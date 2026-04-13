#!/usr/bin/env python3
"""Script para agregar endpoints de lotes a app.py"""

# Leer archivo actual
with open('app.py', 'r', encoding='utf-8') as f:
    content = f.read()

# Código de los endpoints a insertar
endpoints_code = '''
@app.route('/upload-batch', methods=['POST'])
def upload_batch():
    """Endpoint para subir múltiples PDFs y crear sesión de lotes"""
    if 'pdfs_reference' not in request.files or 'pdfs_compare' not in request.files:
        return jsonify({'error': 'Faltan archivos'}), 400
    
    refs = request.files.getlist('pdfs_reference')
    comps = request.files.getlist('pdfs_compare')
    
    if not refs or not comps:
        return jsonify({'error': 'No se seleccionaron archivos'}), 400
    
    batch_id = str(uuid.uuid4())
    batch_dir = os.path.join(UPLOAD_FOLDER, f"batch_{batch_id}")
    ref_dir = os.path.join(batch_dir, "reference")
    comp_dir = os.path.join(batch_dir, "compare")
    
    os.makedirs(ref_dir, exist_ok=True)
    os.makedirs(comp_dir, exist_ok=True)
    
    ref_files = []
    for f in refs:
        if allowed_file(f.filename):
            filename = secure_filename(f.filename)
            f.save(os.path.join(ref_dir, filename))
            ref_files.append(filename)
    
    comp_files = []
    for f in comps:
        if allowed_file(f.filename):
            filename = secure_filename(f.filename)
            f.save(os.path.join(comp_dir, filename))
            comp_files.append(filename)
    
    batch_sessions[batch_id] = {
        'ref_dir': ref_dir,
        'comp_dir': comp_dir,
        'ref_files': ref_files,
        'comp_files': comp_files,
        'pairs': []
    }
    
    return jsonify({
        'batch_id': batch_id,
        'ref_files': ref_files,
        'comp_files': comp_files
    })

@app.route('/find-pairs/<batch_id>', methods=['POST'])
def find_pairs(batch_id):
    """Encuentra pares automáticamente para una sesión de lote"""
    if batch_id not in batch_sessions:
        return jsonify({'error': 'Sesión no encontrada'}), 404
    
    session = batch_sessions[batch_id]
    
    pairs, unmatched_ref, unmatched_comp = find_pdf_pairs(
        session['ref_files'],
        session['comp_files'],
        session['ref_dir'],
        session['comp_dir']
    )
    
    session['pairs'] = pairs
    session['unmatched_ref'] = list(unmatched_ref)
    session['unmatched_comp'] = list(unmatched_comp)
    
    return jsonify({
        'pairs': pairs,
        'unmatched_ref': list(unmatched_ref),
        'unmatched_comp': list(unmatched_comp)
    })

@app.route('/create-manual-pair/<batch_id>', methods=['POST'])
def create_manual_pair(batch_id):
    """Crea un par manual"""
    if batch_id not in batch_sessions:
        return jsonify({'error': 'Sesión no encontrada'}), 404
    
    data = request.json
    pdf_ref = data.get('reference')
    pdf_comp = data.get('compare')
    
    if not pdf_ref or not pdf_comp:
        return jsonify({'error': 'Faltan nombres de archivos'}), 400
    
    session = batch_sessions[batch_id]
    
    ref_path = os.path.join(session['ref_dir'], pdf_ref)
    comp_path = os.path.join(session['comp_dir'], pdf_comp)
    
    if not os.path.exists(ref_path) or not os.path.exists(comp_path):
        return jsonify({'error': 'Archivos no encontrados'}), 404
    
    for pair in session['pairs']:
        if pair['reference'] == pdf_ref and pair['compare'] == pdf_comp:
            return jsonify({'error': 'Este par ya existe'}), 400
    
    pages_ref = get_pdf_pages(ref_path)
    pages_comp = get_pdf_pages(comp_path)
    
    new_pair = {
        'reference': pdf_ref,
        'compare': pdf_comp,
        'confidence': 1.0,
        'match_type': 'manual',
        'pages_reference': pages_ref,
        'pages_compare': pages_comp
    }
    
    session['pairs'].append(new_pair)
    
    if pdf_ref in session.get('unmatched_ref', []):
        session['unmatched_ref'].remove(pdf_ref)
    if pdf_comp in session.get('unmatched_comp', []):
        session['unmatched_comp'].remove(pdf_comp)
    
    return jsonify({
        'pair': new_pair,
        'unmatched_ref': session.get('unmatched_ref', []),
        'unmatched_comp': session.get('unmatched_comp', [])
    })

@app.route('/delete-pair/<batch_id>', methods=['POST'])
def delete_pair(batch_id):
    """Elimina un par de la sesión"""
    if batch_id not in batch_sessions:
        return jsonify({'error': 'Sesión no encontrada'}), 404
    
    data = request.json
    pdf_ref = data.get('reference')
    pdf_comp = data.get('compare')
    
    session = batch_sessions[batch_id]
    
    for i, pair in enumerate(session['pairs']):
        if pair['reference'] == pdf_ref and pair['compare'] == pdf_comp:
            del session['pairs'][i]
            
            if 'unmatched_ref' not in session:
                session['unmatched_ref'] = []
            if 'unmatched_comp' not in session:
                session['unmatched_comp'] = []
            
            if pdf_ref not in session['unmatched_ref']:
                session['unmatched_ref'].append(pdf_ref)
            if pdf_comp not in session['unmatched_comp']:
                session['unmatched_comp'].append(pdf_comp)
            
            return jsonify({
                'status': 'deleted',
                'unmatched_ref': session['unmatched_ref'],
                'unmatched_comp': session['unmatched_comp']
            })
    
    return jsonify({'error': 'Par no encontrado'}), 404

@app.route('/get-pairs/<batch_id>', methods=['GET'])
def get_pairs(batch_id):
    """Obtiene los pares de una sesión"""
    if batch_id not in batch_sessions:
        return jsonify({'error': 'Sesión no encontrada'}), 404
    
    session = batch_sessions[batch_id]
    
    return jsonify({
        'pairs': session.get('pairs', []),
        'unmatched_ref': session.get('unmatched_ref', []),
        'unmatched_comp': session.get('unmatched_comp', [])
    })

@app.route('/compare-pairs/<batch_id>', methods=['POST'])
def compare_pairs(batch_id):
    """Compara los pares seleccionados de una sesión"""
    if batch_id not in batch_sessions:
        return jsonify({'error': 'Sesión no encontrada'}), 404
    
    data = request.json
    selected_pairs = data.get('pairs', [])
    max_errors = data.get('max_errors', 500)
    max_phrase_length = data.get('max_phrase_length', 10)
    
    if not selected_pairs:
        return jsonify({'error': 'No hay pares seleccionados'}), 400
    
    session = batch_sessions[batch_id]
    
    batch_progress[batch_id] = {
        'status': 'processing',
        'overall_progress': 0,
        'message': 'Iniciando comparación por lotes...',
        'tasks': [],
        'total': len(selected_pairs)
    }
    
    def process_batch():
        result_dir = os.path.join(RESULTS_FOLDER, f"batch_{batch_id}")
        os.makedirs(result_dir, exist_ok=True)
        
        for idx, pair in enumerate(selected_pairs):
            ref_path = os.path.join(session['ref_dir'], pair['reference'])
            comp_path = os.path.join(session['comp_dir'], pair['compare'])
            
            task_id = str(uuid.uuid4())
            
            batch_progress[batch_id]['message'] = f"Procesando {pair['reference']}..."
            batch_progress[batch_id]['tasks'].append({
                'filename': pair['reference'],
                'status': 'processing',
                'task_id': task_id
            })
            
            process_comparison_web(
                task_id, ref_path, comp_path, result_dir,
                1, None, 1, None, None, None,
                max_errors, max_phrase_length
            )
            
            batch_progress[batch_id]['tasks'][-1]['status'] = 'completed'
            batch_progress[batch_id]['overall_progress'] = int(((idx + 1) / len(selected_pairs)) * 100)
        
        batch_progress[batch_id]['status'] = 'completed'
        batch_progress[batch_id]['message'] = 'Comparación por lotes completada'
    
    thread = threading.Thread(target=process_batch)
    thread.daemon = True
    thread.start()
    
    return jsonify({'status': 'started', 'batch_id': batch_id})

'''

# Buscar donde insertar (antes de @app.route('/upload'))
insert_marker = "@app.route('/upload', methods=['POST'])"
if insert_marker in content:
    # Insertar los endpoints antes de /upload
    new_content = content.replace(insert_marker, endpoints_code + "\n" + insert_marker)
    
    # Escribir archivo modificado
    with open('app.py', 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    print("✅ Endpoints agregados exitosamente")
    print(f"Total de endpoints ahora: {new_content.count('@app.route')}")
else:
    print("❌ No se encontró el marcador de inserción")