// Comparador PDF Web - JavaScript Application
// Versión 2.2 - Con Selección de Carpetas

class ComparadorPDF {
    constructor() {
        // Single mode
        this.taskId = null;
        this.refPages = 0;
        this.compPages = 0;
        this.progressInterval = null;
        
        // Batch mode
        this.batchId = null;
        this.batchRefFiles = [];
        this.batchCompFiles = [];
        this.currentPairs = [];
        this.unmatchedRef = [];
        this.unmatchedComp = [];
        this.batchProgressInterval = null;
        
        // Check if File System Access API is supported
        this.supportsFolderSelection = 'showDirectoryPicker' in window;
        
        this.initializeElements();
        this.attachEventListeners();
        this.setupFolderButtons();
    }

    initializeElements() {
        // Mode tabs
        this.tabBtns = document.querySelectorAll('.tab-btn');
        this.singleMode = document.getElementById('single-mode');
        this.batchMode = document.getElementById('batch-mode');
        
        // Single mode - File inputs
        this.pdfReference = document.getElementById('pdf-reference');
        this.pdfCompare = document.getElementById('pdf-compare');
        this.refInfo = document.getElementById('ref-info');
        this.compInfo = document.getElementById('comp-info');
        
        // Single mode - Buttons
        this.uploadBtn = document.getElementById('upload-btn');
        this.compareBtn = document.getElementById('compare-btn');
        this.cancelBtn = document.getElementById('cancel-btn');
        this.downloadBtn = document.getElementById('download-btn');
        this.newComparisonBtn = document.getElementById('new-comparison-btn');
        this.retryBtn = document.getElementById('retry-btn');
        
        // Single mode - Sections
        this.uploadSection = document.getElementById('upload-section');
        this.configSection = document.getElementById('config-section');
        this.progressSection = document.getElementById('progress-section');
        this.resultsSection = document.getElementById('results-section');
        this.errorSection = document.getElementById('error-section');
        
        // Single mode - Configuration
        this.compareAll = document.getElementById('compare-all');
        this.rangeGroup = document.getElementById('range-group');
        this.startPageRef = document.getElementById('start-page-ref');
        this.endPageRef = document.getElementById('end-page-ref');
        this.startPageComp = document.getElementById('start-page-comp');
        this.endPageComp = document.getElementById('end-page-comp');
        this.maxErrors = document.getElementById('max-errors');
        
        // Single mode - Progress
        this.progressFill = document.getElementById('progress-fill');
        this.progressText = document.getElementById('progress-text');
        this.pagesStat = document.getElementById('pages-stat');
        this.errorsContentStat = document.getElementById('errors-content-stat');
        this.errorsFormatStat = document.getElementById('errors-format-stat');
        this.statusMessage = document.getElementById('status-message');
        
        // Single mode - Results
        this.resultsSummary = document.getElementById('results-summary');
        this.errorMessage = document.getElementById('error-message');
        
        // Batch mode - File inputs
        this.batchPdfReference = document.getElementById('batch-pdf-reference');
        this.batchPdfCompare = document.getElementById('batch-pdf-compare');
        this.dropZoneRef = document.getElementById('drop-zone-ref');
        this.dropZoneComp = document.getElementById('drop-zone-comp');
        this.refFileList = document.getElementById('ref-file-list');
        this.compFileList = document.getElementById('comp-file-list');
        
        // Batch mode - Buttons
        this.batchUploadBtn = document.getElementById('batch-upload-btn');
        this.findPairsBtn = document.getElementById('find-pairs-btn');
        this.compareSelectedBtn = document.getElementById('compare-selected-btn');
        this.createManualPairBtn = document.getElementById('create-manual-pair-btn');
        this.newBatchBtn = document.getElementById('new-batch-btn');
        this.batchRetryBtn = document.getElementById('batch-retry-btn');
        
        // Batch mode - Sections
        this.batchUploadSection = document.getElementById('batch-upload-section');
        this.batchPairsSection = document.getElementById('batch-pairs-section');
        this.batchProgressSection = document.getElementById('batch-progress-section');
        this.batchResultsSection = document.getElementById('batch-results-section');
        this.batchErrorSection = document.getElementById('batch-error-section');
        
        // Batch mode - Pairs management
        this.pairsTable = document.getElementById('pairs-table');
        this.pairsTbody = document.getElementById('pairs-tbody');
        this.selectAllPairs = document.getElementById('select-all-pairs');
        this.unmatchedRefList = document.getElementById('unmatched-ref-list');
        this.unmatchedCompList = document.getElementById('unmatched-comp-list');
        this.manualRefSelect = document.getElementById('manual-ref-select');
        this.manualCompSelect = document.getElementById('manual-comp-select');
        
        // Batch mode - Progress
        this.batchProgressFill = document.getElementById('batch-progress-fill');
        this.batchProgressText = document.getElementById('batch-progress-text');
        this.batchStatusMessage = document.getElementById('batch-status-message');
        this.batchTasksList = document.getElementById('batch-tasks-list');
        
        // Batch mode - Results
        this.batchResultsSummary = document.getElementById('batch-results-summary');
        this.batchErrorMessage = document.getElementById('batch-error-message');
    }

    attachEventListeners() {
        // Mode tabs
        this.tabBtns.forEach(btn => {
            btn.addEventListener('click', () => this.switchMode(btn.dataset.mode));
        });
        
        // Single mode - File selection
        this.pdfReference.addEventListener('change', () => this.handleFileSelect('reference'));
        this.pdfCompare.addEventListener('change', () => this.handleFileSelect('compare'));
        
        // Single mode - Buttons
        this.uploadBtn.addEventListener('click', () => this.uploadFiles());
        this.compareBtn.addEventListener('click', () => this.startComparison());
        this.cancelBtn.addEventListener('click', () => this.cancelComparison());
        this.downloadBtn.addEventListener('click', () => this.downloadResult());
        this.newComparisonBtn.addEventListener('click', () => this.resetApplication());
        this.retryBtn.addEventListener('click', () => this.resetApplication());
        
        // Single mode - Configuration
        this.compareAll.addEventListener('change', () => this.toggleRangeInputs());
        
        // Batch mode - Drop zones
        this.setupDropZone(this.dropZoneRef, this.batchPdfReference, 'reference');
        this.setupDropZone(this.dropZoneComp, this.batchPdfCompare, 'compare');
        
        // Batch mode - File selection
        this.batchPdfReference.addEventListener('change', () => this.handleBatchFileSelect('reference'));
        this.batchPdfCompare.addEventListener('change', () => this.handleBatchFileSelect('compare'));
        
        // Batch mode - Buttons
        this.batchUploadBtn.addEventListener('click', () => this.uploadBatchFiles());
        this.findPairsBtn.addEventListener('click', () => this.findPairs());
        this.compareSelectedBtn.addEventListener('click', () => this.compareSelectedPairs());
        this.selectAllPairs.addEventListener('change', () => this.toggleSelectAllPairs());
        this.createManualPairBtn.addEventListener('click', () => this.createManualPair());
        this.newBatchBtn.addEventListener('click', () => this.resetBatchMode());
        this.batchRetryBtn.addEventListener('click', () => this.resetBatchMode());
        
        // Batch mode - Manual pair selects
        this.manualRefSelect.addEventListener('change', () => this.updateManualPairButton());
        this.manualCompSelect.addEventListener('change', () => this.updateManualPairButton());
    }

    handleFileSelect(type) {
        const input = type === 'reference' ? this.pdfReference : this.pdfCompare;
        const info = type === 'reference' ? this.refInfo : this.compInfo;
        
        if (input.files.length > 0) {
            const file = input.files[0];
            const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
            info.innerHTML = `✓ ${file.name}<br>Tamaño: ${sizeMB} MB`;
            info.style.background = '#e8f5e9';
            info.style.color = '#43a047';
        } else {
            info.innerHTML = '';
        }
        
        // Enable upload button if both files selected
        this.uploadBtn.disabled = !(this.pdfReference.files.length > 0 && this.pdfCompare.files.length > 0);
    }

    async uploadFiles() {
        const formData = new FormData();
        formData.append('pdf_reference', this.pdfReference.files[0]);
        formData.append('pdf_compare', this.pdfCompare.files[0]);
        
        this.uploadBtn.disabled = true;
        this.uploadBtn.innerHTML = '<span class="loading"></span> Subiendo...';
        
        try {
            const response = await fetch('/upload', {
                method: 'POST',
                body: formData
            });
            
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Error al subir archivos');
            }
            
            const data = await response.json();
            this.taskId = data.task_id;
            this.refPages = data.ref_pages;
            this.compPages = data.comp_pages;
            
            // Update configuration
            this.startPageRef.max = this.compPages;
            this.endPageRef.max = this.compPages;
            this.endPageRef.value = this.compPages;
            
            // Show configuration section
            this.uploadSection.style.display = 'none';
            this.configSection.style.display = 'block';
            
        } catch (error) {
            this.showError(error.message);
            this.uploadBtn.disabled = false;
            this.uploadBtn.innerHTML = '📤 Subir Archivos';
        }
    }

    toggleRangeInputs() {
        if (this.compareAll.checked) {
            this.rangeGroup.style.display = 'none';
            // Values are already set in uploadFiles
        } else {
            this.rangeGroup.style.display = 'grid';
        }
    }

    async startComparison() {
        let startPageRef, endPageRef, startPageComp, endPageComp;
        
        if (this.compareAll.checked) {
            startPageRef = 1;
            endPageRef = null;
            startPageComp = 1;
            endPageComp = null;
        } else {
            startPageRef = parseInt(this.startPageRef.value);
            endPageRef = parseInt(this.endPageRef.value);
            startPageComp = parseInt(this.startPageComp.value);
            endPageComp = parseInt(this.endPageComp.value);
        }
        
        const maxErrors = parseInt(this.maxErrors.value);
        
        // Validation
        if (!this.compareAll.checked) {
            if (startPageRef > endPageRef) {
                alert('La página inicial del PDF Referencia no puede ser mayor que la final');
                return;
            }
            if (startPageComp > endPageComp) {
                alert('La página inicial del PDF a Comparar no puede ser mayor que la final');
                return;
            }
            if (startPageRef < 1 || endPageRef > this.refPages) {
                alert(`El rango del PDF Referencia debe estar entre 1 y ${this.refPages}`);
                return;
            }
            if (startPageComp < 1 || endPageComp > this.compPages) {
                alert(`El rango del PDF a Comparar debe estar entre 1 y ${this.compPages}`);
                return;
            }
        }
        
        try {
            const response = await fetch('/compare', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    task_id: this.taskId,
                    start_page_ref: startPageRef,
                    end_page_ref: endPageRef,
                    start_page_comp: startPageComp,
                    end_page_comp: endPageComp,
                    max_errors: maxErrors
                })
            });
            
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Error al iniciar comparación');
            }
            
            // Show progress section
            this.configSection.style.display = 'none';
            this.progressSection.style.display = 'block';
            
            // Start polling progress
            this.pollProgress();
            
        } catch (error) {
            this.showError(error.message);
        }
    }

    async pollProgress() {
        this.progressInterval = setInterval(async () => {
            try {
                const response = await fetch(`/progress/${this.taskId}`);
                
                if (!response.ok) {
                    throw new Error('Error al obtener progreso');
                }
                
                const data = await response.json();
                
                // Update progress
                this.progressFill.style.width = `${data.progress}%`;
                this.progressText.textContent = `${data.progress}%`;
                this.statusMessage.textContent = data.message;
                this.pagesStat.textContent = `${data.pages_processed}/${data.total_pages}`;
                this.errorsContentStat.textContent = data.errors_content;
                this.errorsFormatStat.textContent = data.errors_format;
                
                // Check status
                if (data.status === 'completed') {
                    clearInterval(this.progressInterval);
                    this.showResults(data);
                } else if (data.status === 'error') {
                    clearInterval(this.progressInterval);
                    this.showError(data.message);
                } else if (data.status === 'cancelled') {
                    clearInterval(this.progressInterval);
                    this.showError('Comparación cancelada por el usuario');
                }
                
            } catch (error) {
                clearInterval(this.progressInterval);
                this.showError(error.message);
            }
        }, 1000); // Poll every second
    }

    async cancelComparison() {
        if (!confirm('¿Estás seguro de que deseas cancelar la comparación?')) {
            return;
        }
        
        try {
            await fetch(`/cancel/${this.taskId}`, {
                method: 'POST'
            });
            
            clearInterval(this.progressInterval);
            this.showError('Comparación cancelada');
            
        } catch (error) {
            console.error('Error al cancelar:', error);
        }
    }

    showResults(data) {
        this.progressSection.style.display = 'none';
        this.resultsSection.style.display = 'block';
        
        this.resultsSummary.innerHTML = `
            <h3>✅ Comparación Completada Exitosamente</h3>
            <p><strong>📄 Páginas analizadas:</strong> ${data.total_pages}</p>
            <p><strong>🔴 Diferencias de CONTENIDO:</strong> ${data.errors_content}</p>
            <p><strong>🎨 Diferencias de FORMATO:</strong> ${data.errors_format}</p>
            <p><strong>📊 Total de diferencias:</strong> ${data.errors_content + data.errors_format}</p>
        `;
    }

    async downloadResult() {
        try {
            window.location.href = `/download/${this.taskId}`;
            
            // Cleanup after download
            setTimeout(() => {
                this.cleanupTask();
            }, 2000);
            
        } catch (error) {
            this.showError('Error al descargar el archivo');
        }
    }

    async cleanupTask() {
        if (this.taskId) {
            try {
                await fetch(`/cleanup/${this.taskId}`, {
                    method: 'POST'
                });
            } catch (error) {
                console.error('Error al limpiar:', error);
            }
        }
    }

    showError(message) {
        this.uploadSection.style.display = 'none';
        this.configSection.style.display = 'none';
        this.progressSection.style.display = 'none';
        this.resultsSection.style.display = 'none';
        this.errorSection.style.display = 'block';
        
        this.errorMessage.textContent = message;
    }

    resetApplication() {
        // Cleanup current task
        this.cleanupTask();
        
        // Reset state
        this.taskId = null;
        this.refPages = 0;
        this.compPages = 0;
        
        // Clear file inputs
        this.pdfReference.value = '';
        this.pdfCompare.value = '';
        this.refInfo.innerHTML = '';
        this.compInfo.innerHTML = '';
        
        // Reset buttons
        this.uploadBtn.disabled = true;
        this.uploadBtn.innerHTML = '📤 Subir Archivos';
        
        // Reset progress
        this.progressFill.style.width = '0%';
        this.progressText.textContent = '0%';
        this.pagesStat.textContent = '0/0';
        this.errorsContentStat.textContent = '0';
        this.errorsFormatStat.textContent = '0';
        
        // Show upload section
        this.uploadSection.style.display = 'block';
        this.configSection.style.display = 'none';
        this.progressSection.style.display = 'none';
        this.resultsSection.style.display = 'none';
        this.errorSection.style.display = 'none';
        
        // Clear interval if exists
        if (this.progressInterval) {
            clearInterval(this.progressInterval);
        }
    }

    // ========== MODE SWITCHING ==========
    
    switchMode(mode) {
        this.tabBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.mode === mode);
        });
        
        if (mode === 'single') {
            this.singleMode.classList.add('active');
            this.batchMode.classList.remove('active');
            this.singleMode.style.display = 'block';
            this.batchMode.style.display = 'none';
        } else {
            this.singleMode.classList.remove('active');
            this.batchMode.classList.add('active');
            this.singleMode.style.display = 'none';
            this.batchMode.style.display = 'block';
        }
    }
    
    // ========== BATCH MODE METHODS ==========
    
    setupDropZone(dropZone, fileInput, type) {
        dropZone.addEventListener('click', () => fileInput.click());
        
        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropZone.classList.add('drag-over');
        });
        
        dropZone.addEventListener('dragleave', () => {
            dropZone.classList.remove('drag-over');
        });
        
        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.classList.remove('drag-over');
            
            const files = Array.from(e.dataTransfer.files).filter(f => f.name.endsWith('.pdf'));
            if (files.length > 0) {
                const dataTransfer = new DataTransfer();
                files.forEach(file => dataTransfer.items.add(file));
                fileInput.files = dataTransfer.files;
                this.handleBatchFileSelect(type);
            }
        });
    }
    
    handleBatchFileSelect(type) {
        const input = type === 'reference' ? this.batchPdfReference : this.batchPdfCompare;
        const list = type === 'reference' ? this.refFileList : this.compFileList;
        const files = type === 'reference' ? this.batchRefFiles : this.batchCompFiles;
        
        files.length = 0;
        list.innerHTML = '';
        
        if (input.files.length > 0) {
            Array.from(input.files).forEach(file => {
                files.push(file);
                const item = document.createElement('div');
                item.className = 'file-item';
                item.innerHTML = `📄 ${file.name} <span>(${(file.size / 1024 / 1024).toFixed(2)} MB)</span>`;
                list.appendChild(item);
            });
        }
        
        this.batchUploadBtn.disabled = !(this.batchRefFiles.length > 0 && this.batchCompFiles.length > 0);
    }
    
    async uploadBatchFiles() {
        const formData = new FormData();
        
        this.batchRefFiles.forEach(file => {
            formData.append('pdfs_reference', file);
        });
        
        this.batchCompFiles.forEach(file => {
            formData.append('pdfs_compare', file);
        });
        
        this.batchUploadBtn.disabled = true;
        this.batchUploadBtn.innerHTML = '<span class="loading"></span> Subiendo...';
        
        try {
            const response = await fetch('/upload-batch', {
                method: 'POST',
                body: formData
            });
            
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Error al subir archivos');
            }
            
            const data = await response.json();
            this.batchId = data.batch_id;
            
            // Automatically find pairs
            await this.findPairs();
            
            // Show pairs section
            this.batchUploadSection.style.display = 'none';
            this.batchPairsSection.style.display = 'block';
            
        } catch (error) {
            this.showBatchError(error.message);
            this.batchUploadBtn.disabled = false;
            this.batchUploadBtn.innerHTML = '📤 Subir Archivos y Buscar Pares';
        }
    }
    
    async findPairs() {
        try {
            const response = await fetch(`/find-pairs/${this.batchId}`, {
                method: 'POST'
            });
            
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Error al buscar pares');
            }
            
            const data = await response.json();
            this.currentPairs = data.pairs;
            this.unmatchedRef = data.unmatched_ref;
            this.unmatchedComp = data.unmatched_comp;
            
            this.renderPairsTable();
            this.renderUnmatchedLists();
            this.updateManualPairSelects();
            
        } catch (error) {
            this.showBatchError(error.message);
        }
    }
    
    renderPairsTable() {
        this.pairsTbody.innerHTML = '';
        
        if (this.currentPairs.length === 0) {
            this.pairsTbody.innerHTML = '<tr><td colspan="8" class="no-data">No hay pares. Haz clic en "Buscar Pares Automáticamente"</td></tr>';
            this.compareSelectedBtn.disabled = true;
            return;
        }
        
        this.currentPairs.forEach((pair, index) => {
            const row = document.createElement('tr');
            
            const matchTypeLabel = {
                'exact': '✓ Exacto',
                'partial': '≈ Parcial',
                'manual': '✋ Manual'
            }[pair.match_type] || pair.match_type;
            
            const confidencePercent = (pair.confidence * 100).toFixed(0);
            const confidenceClass = pair.confidence === 1.0 ? 'confidence-high' : 
                                   pair.confidence >= 0.8 ? 'confidence-medium' : 'confidence-low';
            
            row.innerHTML = `
                <td><input type="checkbox" class="pair-checkbox" data-index="${index}" /></td>
                <td>${pair.reference}</td>
                <td>${pair.pages_reference}</td>
                <td>${pair.compare}</td>
                <td>${pair.pages_compare}</td>
                <td><span class="${confidenceClass}">${confidencePercent}%</span></td>
                <td>${matchTypeLabel}</td>
                <td><button class="btn-small btn-danger" onclick="app.deletePair(${index})">🗑️</button></td>
            `;
            
            this.pairsTbody.appendChild(row);
        });
        
        // Update compare button state
        this.updateCompareButtonState();
        
        // Add event listeners to checkboxes
        document.querySelectorAll('.pair-checkbox').forEach(cb => {
            cb.addEventListener('change', () => this.updateCompareButtonState());
        });
    }
    
    renderUnmatchedLists() {
        // Unmatched reference
        this.unmatchedRefList.innerHTML = '';
        if (this.unmatchedRef.length === 0) {
            this.unmatchedRefList.innerHTML = '<li class="no-data">Todos los PDFs están emparejados</li>';
        } else {
            this.unmatchedRef.forEach(file => {
                const li = document.createElement('li');
                li.textContent = file;
                this.unmatchedRefList.appendChild(li);
            });
        }
        
        // Unmatched compare
        this.unmatchedCompList.innerHTML = '';
        if (this.unmatchedComp.length === 0) {
            this.unmatchedCompList.innerHTML = '<li class="no-data">Todos los PDFs están emparejados</li>';
        } else {
            this.unmatchedComp.forEach(file => {
                const li = document.createElement('li');
                li.textContent = file;
                this.unmatchedCompList.appendChild(li);
            });
        }
    }
    
    updateManualPairSelects() {
        // Update reference select
        this.manualRefSelect.innerHTML = '<option value="">Seleccionar PDF Referencia...</option>';
        this.unmatchedRef.forEach(file => {
            const option = document.createElement('option');
            option.value = file;
            option.textContent = file;
            this.manualRefSelect.appendChild(option);
        });
        
        // Update compare select
        this.manualCompSelect.innerHTML = '<option value="">Seleccionar PDF a Comparar...</option>';
        this.unmatchedComp.forEach(file => {
            const option = document.createElement('option');
            option.value = file;
            option.textContent = file;
            this.manualCompSelect.appendChild(option);
        });
        
        this.updateManualPairButton();
    }
    
    updateManualPairButton() {
        this.createManualPairBtn.disabled = !(this.manualRefSelect.value && this.manualCompSelect.value);
    }
    
    async createManualPair() {
        const refFile = this.manualRefSelect.value;
        const compFile = this.manualCompSelect.value;
        
        if (!refFile || !compFile) return;
        
        try {
            const response = await fetch(`/create-manual-pair/${this.batchId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    reference: refFile,
                    compare: compFile
                })
            });
            
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Error al crear par manual');
            }
            
            const data = await response.json();
            this.currentPairs.push(data.pair);
            this.unmatchedRef = data.unmatched_ref;
            this.unmatchedComp = data.unmatched_comp;
            
            this.renderPairsTable();
            this.renderUnmatchedLists();
            this.updateManualPairSelects();
            
        } catch (error) {
            alert(error.message);
        }
    }
    
    async deletePair(index) {
        if (!confirm('¿Eliminar este par?')) return;
        
        const pair = this.currentPairs[index];
        
        try {
            const response = await fetch(`/delete-pair/${this.batchId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    reference: pair.reference,
                    compare: pair.compare
                })
            });
            
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Error al eliminar par');
            }
            
            const data = await response.json();
            this.currentPairs.splice(index, 1);
            this.unmatchedRef = data.unmatched_ref;
            this.unmatchedComp = data.unmatched_comp;
            
            this.renderPairsTable();
            this.renderUnmatchedLists();
            this.updateManualPairSelects();
            
        } catch (error) {
            alert(error.message);
        }
    }
    
    toggleSelectAllPairs() {
        const checkboxes = document.querySelectorAll('.pair-checkbox');
        checkboxes.forEach(cb => {
            cb.checked = this.selectAllPairs.checked;
        });
        this.updateCompareButtonState();
    }
    
    updateCompareButtonState() {
        const checkedBoxes = document.querySelectorAll('.pair-checkbox:checked');
        this.compareSelectedBtn.disabled = checkedBoxes.length === 0;
    }
    
    async compareSelectedPairs() {
        const checkedBoxes = document.querySelectorAll('.pair-checkbox:checked');
        const selectedPairs = Array.from(checkedBoxes).map(cb => {
            const index = parseInt(cb.dataset.index);
            return this.currentPairs[index];
        });
        
        if (selectedPairs.length === 0) {
            alert('Selecciona al menos un par para comparar');
            return;
        }
        
        try {
            const response = await fetch(`/compare-pairs/${this.batchId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    pairs: selectedPairs,
                    max_errors: 500,
                    max_phrase_length: 10
                })
            });
            
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Error al iniciar comparación');
            }
            
            // Show progress section
            this.batchPairsSection.style.display = 'none';
            this.batchProgressSection.style.display = 'block';
            
            // Start polling progress
            this.pollBatchProgress();
            
        } catch (error) {
            this.showBatchError(error.message);
        }
    }
    
    async pollBatchProgress() {
        this.batchProgressInterval = setInterval(async () => {
            try {
                const response = await fetch(`/progress-batch/${this.batchId}`);
                
                if (!response.ok) {
                    throw new Error('Error al obtener progreso');
                }
                
                const data = await response.json();
                
                // Update progress
                this.batchProgressFill.style.width = `${data.overall_progress}%`;
                this.batchProgressText.textContent = `${data.overall_progress}%`;
                this.batchStatusMessage.textContent = data.message;
                
                // Update tasks list
                this.batchTasksList.innerHTML = '';
                if (data.tasks) {
                    data.tasks.forEach(task => {
                        const li = document.createElement('li');
                        const statusIcon = task.status === 'completed' ? '✅' : 
                                         task.status === 'processing' ? '⏳' : '⏸️';
                        li.innerHTML = `${statusIcon} ${task.filename} - ${task.status}`;
                        this.batchTasksList.appendChild(li);
                    });
                }
                
                // Check status
                if (data.status === 'completed') {
                    clearInterval(this.batchProgressInterval);
                    this.showBatchResults(data);
                } else if (data.status === 'error') {
                    clearInterval(this.batchProgressInterval);
                    this.showBatchError(data.message);
                }
                
            } catch (error) {
                clearInterval(this.batchProgressInterval);
                this.showBatchError(error.message);
            }
        }, 1000);
    }
    
    showBatchResults(data) {
        this.batchProgressSection.style.display = 'none';
        this.batchResultsSection.style.display = 'block';
        
        const totalTasks = data.tasks ? data.tasks.length : 0;
        
        // Build download links for individual files
        let downloadLinks = '';
        if (data.tasks) {
            downloadLinks = '<div class="download-section"><h4>📥 Descargar Resultados Individuales:</h4><ul class="download-list">';
            data.tasks.forEach(task => {
                if (task.task_id && task.result_file) {
                    downloadLinks += `
                        <li>
                            <span>📄 ${task.filename}</span>
                            <button class="btn btn-primary btn-small" onclick="app.downloadBatchFile('${task.task_id}')">
                                📥 Descargar
                            </button>
                        </li>
                    `;
                }
            });
            downloadLinks += '</ul></div>';
        }
        
        this.batchResultsSummary.innerHTML = `
            <h3>✅ Comparación por Lotes Completada</h3>
            <p><strong>📊 Total de comparaciones:</strong> ${totalTasks}</p>
            <p><strong>✅ Completadas:</strong> ${totalTasks}</p>
            
            <div class="download-buttons" style="margin: 20px 0;">
                <button class="btn btn-success" onclick="app.downloadConsolidated()" style="margin-right: 10px;">
                    📦 Descargar Todo Consolidado
                </button>
            </div>
            
            ${downloadLinks}
        `;
    }
    
    downloadBatchFile(taskId) {
        window.location.href = `/download-batch/${this.batchId}/${taskId}`;
    }
    
    downloadConsolidated() {
        window.location.href = `/download-batch-consolidated/${this.batchId}`;
    }
    
    showBatchError(message) {
        this.batchUploadSection.style.display = 'none';
        this.batchPairsSection.style.display = 'none';
        this.batchProgressSection.style.display = 'none';
        this.batchResultsSection.style.display = 'none';
        this.batchErrorSection.style.display = 'block';
        
        this.batchErrorMessage.textContent = message;
    }
    
    resetBatchMode() {
        // Reset state
        this.batchId = null;
        this.batchRefFiles = [];
        this.batchCompFiles = [];
        this.currentPairs = [];
        this.unmatchedRef = [];
        this.unmatchedComp = [];
        
        // Clear file inputs
        this.batchPdfReference.value = '';
        this.batchPdfCompare.value = '';
        this.refFileList.innerHTML = '';
        this.compFileList.innerHTML = '';
        
        // Reset buttons
        this.batchUploadBtn.disabled = true;
        this.batchUploadBtn.innerHTML = '📤 Subir Archivos y Buscar Pares';
        
        // Clear tables
        this.pairsTbody.innerHTML = '<tr><td colspan="8" class="no-data">No hay pares</td></tr>';
        this.unmatchedRefList.innerHTML = '<li class="no-data">Todos los PDFs están emparejados</li>';
        this.unmatchedCompList.innerHTML = '<li class="no-data">Todos los PDFs están emparejados</li>';
        
        // Show upload section
        this.batchUploadSection.style.display = 'block';
        this.batchPairsSection.style.display = 'none';
        this.batchProgressSection.style.display = 'none';
        this.batchResultsSection.style.display = 'none';
        this.batchErrorSection.style.display = 'none';
        
        // Clear interval if exists
        if (this.batchProgressInterval) {
            clearInterval(this.batchProgressInterval);
        }
    }
    
    // ========== FOLDER SELECTION (v2.2) ==========
    
    setupFolderButtons() {
        // Only add folder buttons if API is supported
        if (!this.supportsFolderSelection) {
            console.log('File System Access API not supported in this browser');
            return;
        }
        
        // Add folder selection buttons to drop zones
        const refDropZone = document.getElementById('drop-zone-ref');
        const compDropZone = document.getElementById('drop-zone-comp');
        
        if (refDropZone && compDropZone) {
            // Add folder button for reference
            const refFolderBtn = document.createElement('button');
            refFolderBtn.className = 'btn btn-secondary folder-btn';
            refFolderBtn.innerHTML = '📁 Seleccionar Carpeta';
            refFolderBtn.onclick = (e) => {
                e.stopPropagation();
                this.selectFolder('reference');
            };
            refDropZone.appendChild(refFolderBtn);
            
            // Add folder button for compare
            const compFolderBtn = document.createElement('button');
            compFolderBtn.className = 'btn btn-secondary folder-btn';
            compFolderBtn.innerHTML = '📁 Seleccionar Carpeta';
            compFolderBtn.onclick = (e) => {
                e.stopPropagation();
                this.selectFolder('compare');
            };
            compDropZone.appendChild(compFolderBtn);
        }
    }
    
    async selectFolder(type) {
        try {
            // Request directory access
            const dirHandle = await window.showDirectoryPicker({
                mode: 'read'
            });
            
            // Get all PDF files from the directory
            const pdfFiles = await this.getPDFFilesFromDirectory(dirHandle);
            
            if (pdfFiles.length === 0) {
                alert('No se encontraron archivos PDF en la carpeta seleccionada');
                return;
            }
            
            // Update the file list
            const files = type === 'reference' ? this.batchRefFiles : this.batchCompFiles;
            const list = type === 'reference' ? this.refFileList : this.compFileList;
            
            files.length = 0;
            list.innerHTML = '';
            
            pdfFiles.forEach(file => {
                files.push(file);
                const item = document.createElement('div');
                item.className = 'file-item';
                item.innerHTML = `📄 ${file.name} <span>(${(file.size / 1024 / 1024).toFixed(2)} MB)</span>`;
                list.appendChild(item);
            });
            
            // Show success message
            const message = document.createElement('div');
            message.className = 'success-message';
            message.innerHTML = `✅ ${pdfFiles.length} archivos PDF cargados desde la carpeta`;
            message.style.cssText = 'background: #e8f5e9; color: #43a047; padding: 10px; margin: 10px 0; border-radius: 5px; text-align: center;';
            list.insertBefore(message, list.firstChild);
            
            // Enable upload button if both sides have files
            this.batchUploadBtn.disabled = !(this.batchRefFiles.length > 0 && this.batchCompFiles.length > 0);
            
        } catch (error) {
            if (error.name === 'AbortError') {
                console.log('User cancelled folder selection');
            } else {
                console.error('Error selecting folder:', error);
                alert('Error al seleccionar la carpeta: ' + error.message);
            }
        }
    }
    
    async getPDFFilesFromDirectory(dirHandle) {
        const pdfFiles = [];
        
        try {
            for await (const entry of dirHandle.values()) {
                if (entry.kind === 'file' && entry.name.toLowerCase().endsWith('.pdf')) {
                    const file = await entry.getFile();
                    pdfFiles.push(file);
                }
            }
        } catch (error) {
            console.error('Error reading directory:', error);
        }
        
        // Sort files by name
        pdfFiles.sort((a, b) => a.name.localeCompare(b.name));
        
        return pdfFiles;
    }
}

// Global app instance for onclick handlers
let app;

// Initialize application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    app = new ComparadorPDF();
});


