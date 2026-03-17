# Actualización v2.1 - Funcionalidades de Lotes Mejoradas

## 🎉 Nuevas Funcionalidades Implementadas

### Backend (API Endpoints)

#### 1. **Búsqueda Automática de Pares** ✅
- **Endpoint**: `POST /upload-batch`
- **Endpoint**: `POST /find-pairs/<batch_id>`
- **Funcionalidad**:
  - Sube múltiples PDFs de ambas carpetas
  - Encuentra coincidencias exactas (100%)
  - Encuentra coincidencias parciales (≥60% similitud)
  - Calcula confianza del emparejamiento
  - Clasifica como: 'exact', 'partial', o 'manual'
  - Incluye número de páginas de cada PDF

#### 2. **Emparejamiento Manual** ✅
- **Endpoint**: `POST /create-manual-pair/<batch_id>`
- **Funcionalidad**:
  - Permite crear pares manualmente
  - Valida existencia de archivos
  - Previene duplicados
  - Marca como 'manual' con confianza 100%
  - Actualiza listas de PDFs sin emparejar

#### 3. **Gestión de Pares** ✅
- **Endpoint**: `POST /delete-pair/<batch_id>`
- **Endpoint**: `GET /get-pairs/<batch_id>`
- **Funcionalidad**:
  - Eliminar pares individuales
  - Obtener lista de pares
  - Obtener PDFs sin emparejar
  - Actualización dinámica de listas

#### 4. **Comparación de Pares Seleccionados** ✅
- **Endpoint**: `POST /compare-pairs/<batch_id>`
- **Funcionalidad**:
  - Compara solo los pares seleccionados
  - Progreso en tiempo real
  - Genera documentos Word individuales
  - Almacena resultados en carpeta de lote

## 📊 Estructura de Datos

### Sesión de Lote
```python
batch_sessions[batch_id] = {
    'ref_dir': 'uploads/batch_xxx/reference',
    'comp_dir': 'uploads/batch_xxx/compare',
    'ref_files': ['file1.pdf', 'file2.pdf', ...],
    'comp_files': ['file1.pdf', 'file3.pdf', ...],
    'pairs': [
        {
            'reference': 'file1.pdf',
            'compare': 'file1.pdf',
            'confidence': 1.0,
            'match_type': 'exact',
            'pages_reference': 10,
            'pages_compare': 10
        },
        ...
    ],
    'unmatched_ref': ['file2.pdf', ...],
    'unmatched_comp': ['file3.pdf', ...]
}
```

### Respuesta de Búsqueda de Pares
```json
{
    "pairs": [
        {
            "reference": "documento1.pdf",
            "compare": "documento1.pdf",
            "confidence": 1.0,
            "match_type": "exact",
            "pages_reference": 15,
            "pages_compare": 15
        },
        {
            "reference": "factura_2024.pdf",
            "compare": "factura_2024_v2.pdf",
            "confidence": 0.85,
            "match_type": "partial",
            "pages_reference": 8,
            "pages_compare": 9
        }
    ],
    "unmatched_ref": ["solo_en_ref.pdf"],
    "unmatched_comp": ["solo_en_comp.pdf"]
}
```

## 🔄 Flujo de Trabajo

### 1. Subir Archivos
```javascript
POST /upload-batch
FormData: {
    pdfs_reference: [File, File, ...],
    pdfs_compare: [File, File, ...]
}
Response: {
    batch_id: "uuid",
    ref_files: ["file1.pdf", ...],
    comp_files: ["file1.pdf", ...]
}
```

### 2. Buscar Pares Automáticamente
```javascript
POST /find-pairs/{batch_id}
Response: {
    pairs: [...],
    unmatched_ref: [...],
    unmatched_comp: [...]
}
```

### 3. Crear Par Manual (Opcional)
```javascript
POST /create-manual-pair/{batch_id}
Body: {
    reference: "file2.pdf",
    compare: "file3.pdf"
}
Response: {
    pair: {...},
    unmatched_ref: [...],
    unmatched_comp: [...]
}
```

### 4. Eliminar Par (Opcional)
```javascript
POST /delete-pair/{batch_id}
Body: {
    reference: "file1.pdf",
    compare: "file1.pdf"
}
Response: {
    status: "deleted",
    unmatched_ref: [...],
    unmatched_comp: [...]
}
```

### 5. Obtener Pares Actuales
```javascript
GET /get-pairs/{batch_id}
Response: {
    pairs: [...],
    unmatched_ref: [...],
    unmatched_comp: [...]
}
```

### 6. Comparar Pares Seleccionados
```javascript
POST /compare-pairs/{batch_id}
Body: {
    pairs: [
        {reference: "file1.pdf", compare: "file1.pdf"},
        {reference: "file2.pdf", compare: "file3.pdf"}
    ],
    max_errors: 500,
    max_phrase_length: 10
}
Response: {
    status: "started",
    batch_id: "uuid"
}
```

### 7. Monitorear Progreso
```javascript
GET /progress-batch/{batch_id}
Response: {
    status: "processing",
    overall_progress: 45,
    message: "Procesando file1.pdf...",
    tasks: [
        {filename: "file1.pdf", status: "completed", task_id: "..."},
        {filename: "file2.pdf", status: "processing", task_id: "..."}
    ],
    total: 2
}
```

## 🎯 Próximos Pasos

### Frontend (Pendiente)
1. **Interfaz de Carga de Lotes**
   - Selector de múltiples archivos
   - Drag & drop para carpetas
   - Vista previa de archivos seleccionados

2. **Tabla de Pares**
   - Columnas: Referencia, Páginas Ref, Comparar, Páginas Comp, Confianza, Tipo
   - Filtros por confianza
   - Selección múltiple
   - Botones: Seleccionar todos, Deseleccionar, Eliminar

3. **Listas de PDFs Disponibles**
   - Lista de PDFs sin emparejar (Referencia)
   - Lista de PDFs sin emparejar (Comparar)
   - Botón "Emparejar" entre listas

4. **Controles de Comparación**
   - Botón "Buscar Pares Automáticamente"
   - Botón "Comparar Todos"
   - Botón "Comparar Seleccionados"
   - Barra de progreso de lote

5. **Ventana de Progreso**
   - Log de actividad en tiempo real
   - Estado de cada par
   - Progreso general

## 📝 Cambios en el Código

### Nuevas Importaciones
```python
from difflib import SequenceMatcher
```

### Nuevas Variables Globales
```python
batch_sessions = {}  # Almacenamiento de sesiones de lotes
```

### Nuevas Funciones
```python
def find_pdf_pairs(files_ref, files_comp, folder_ref, folder_comp)
```

### Nuevos Endpoints
- `/upload-batch` - Subir múltiples PDFs
- `/find-pairs/<batch_id>` - Buscar pares automáticamente
- `/create-manual-pair/<batch_id>` - Crear par manual
- `/delete-pair/<batch_id>` - Eliminar par
- `/get-pairs/<batch_id>` - Obtener pares
- `/compare-pairs/<batch_id>` - Comparar pares seleccionados

## ✅ Compatibilidad

- ✅ Mantiene compatibilidad con endpoints existentes
- ✅ No afecta funcionalidad de comparación individual
- ✅ Reutiliza función `process_comparison_web` existente
- ✅ Usa misma estructura de progreso

## 🚀 Despliegue

### Archivos Modificados
- `app.py` - Backend con nuevos endpoints

### Archivos Pendientes
- `templates/index.html` - Actualizar interfaz
- `static/js/app.js` - Implementar lógica frontend
- `static/css/style.css` - Estilos para nuevos componentes

### Comandos Git
```bash
cd "C:\Users\3006978\Desktop\Papyrus VS ServInform Web"
git add app.py ACTUALIZACION_v2.1.md
git commit -m "feat: Implementar búsqueda automática de pares y gestión de lotes"
git push origin main
```

## 📚 Documentación de Referencia

- **Código base**: `comparador_GUI_con_selector_paginas_v2.9.1.py`
- **Función adaptada**: `find_pdf_pairs()` (líneas 60-140)
- **Algoritmo**: SequenceMatcher de difflib
- **Umbral de similitud**: 60% (0.6)

---

**Versión**: 2.1  
**Fecha**: 17/03/2026  
**Estado**: Backend completado ✅ | Frontend pendiente ⏳