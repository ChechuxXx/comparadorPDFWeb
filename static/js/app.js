// Comparador PDF Web v2.0 - JavaScript Application

class ComparadorPDF {
    constructor() {
        this.currentMode = 'pdf'; // 'pdf' or 'folder'
        this.taskId = null;
        this.refPages = 0;
        this.compPages = 0;
        this.progressInterval = null;
        this.batchTasks = [];
        
        this.initializeElements();
        this.attachEventListeners();
    }

    initializeElements() {
        // Tab buttons
        this.tabButtons = document.querySelectorAll('.tab-button');
        this.tabContents = document.querySelectorAll('.tab-content');
        
        // PDF Mode Elements
        this.pdfReference = document.getElementById('pdf-reference');
        this.pdfCompare = document.getElementById('pdf-compare');
        this.refInfo = document.getElementById('ref-info');
        this.compInfo = document.getElementById('comp-info');
        this.uploadBtnPdf = document.getElementById('upload-btn-pdf');
        this.compareBtnPdf = document.getElementById('compare-btn-pdf');
        this.uploadSectionPdf = document.getElementById('upload-section-pdf');
        this.configSectionPdf = document.getElementById('config-section-pdf');
        
        // Folder Mode Elements
        this.pdfsReference = document.getElementById('pdfs-reference');
        this.pdfsCompare = document.getElementById('pdfs-compare');
        this.refsInfo = document.getElementById('refs-info');
        this.compsInfo = document.getElementById('comps-info');
        this.uploadBtnFolder = document.getElementById('upload-btn-folder');
        this.compareBtnFolder = document.getElementById('compare-btn-folder');
        this.uploadSectionFolder = document.getElementById('upload-section-folder');
        this.configSectionFolder = document.getElementById('config-section-folder');
        this.filesList = document.getElementById('files-list');
        
        // Configuration Elements
        this.pageModeRadios = document.querySelectorAll('input[name="page-mode"]');
        this.rangeInputsPdf = document.getElementById('range-inputs-pdf');
        this.customPagesInput = document.getElementById('custom-pages-input');
        this.startPageRef = document.getElementById('start-page-ref');
        this.endPageRef = document.getElementById('end-page-ref');
        this.startPageComp = document.getElementById('start-page-comp');
        this.endPageComp = document.getElementById('end-page-comp');
        this.customPagesRef = document.getElementById('custom-pages-ref');
        this.customPagesComp = document.getElementById('custom-pages-comp');
        this.maxErrorsPdf = document.getElementById('max-errors-pdf');
        this.maxErrorsFolder = document.getElementById('max-errors-folder');
        this.maxPhraseLength = document.getElementById('max-phrase-length');
        this.maxPhraseLengthFolder = document.getElementById('max-phrase-length-folder');
        this.refPagesInfo = document.getElementById('ref-pages-info');
        this.compPagesInfo = document.getElementById('comp-pages-info');
        
        // Shared Elements
        this.progressSection = document.getElementById('progress-section');
        this.resultsSection = document.getElementById('results-section');
        this.errorSection = document.getElementById('error-section');
        this.progressFill = document.getElementById('progress-fill');
        this.progressText = document.getElementById('progress-text');
        this.pagesStat = document.getElementById('pages-stat');
        this.errorsContentStat = document.getElementById('errors-content-stat');
        this.errorsFormatStat = document.getElementById('errors-format-stat');
        this.statusMessage = document.getElementById('status-message');
        this.batchProgress = document.getElementById('batch-progress');
        this.batchList = document.getElementById('batch-list');
        this.resultsSummary = document.getElementById('results-summary');
        this.errorMessage = document.getElementById('error-message');
        this.cancelBtn = document.getElementById('cancel-btn');
        this.downloadBtn = document.getElementById('download-btn');
        this.newComparisonBtn = document.getElementById('new-comparison-btn');
        this.retryBtn = document.getElementById('retry-btn');
    }

    attachEventListeners() {
        // Tab switching
        this.tabButtons.forEach(btn => {
            btn.addEventListener('click', () => this.switchTab(btn.dataset.tab));
        });
        
        // PDF Mode
        this.pdfReference.addEventListener('change', () => this.handleFileSelect('pdf', 'reference'));
        this.pdfCompare.addEventListener('change', () => this.handleFileSelect('pdf', 'compare'));
        this.uploadBtnPdf.addEventListener('click', () => this.uploadFiles('pdf'));
        this.compareBtnPdf.addEventListener('click', () => this.startComparison('pdf'));
        
        // Folder Mode
        this.pdfsReference.addEventListener('change', () => this.handleFileSelect('folder', 'reference'));
        this.pdfsCompare.addEventListener('change', () => this.handleFileSelect('folder', 'compare'));
        this.uploadBtnFolder.addEventListener('click', () => this.uploadFiles('folder'));
        this.compareBtnFolder.addEventListener('click', () => this.startComparison('folder'));
        
        // Page mode selection
        this.pageModeRadios.forEach(radio => {
            radio.addEventListener('change', () => this.handlePageModeChange());
        });
        
        // Shared buttons
        this.cancelBtn.addEventListener('click', () => this.cancelComparison());
        this.downloadBtn.addEventListener('click', () => this.downloadResult());
        this.newComparisonBtn.addEventListener('click', () => this.resetApplication());
        this.retryBtn.addEventListener('click', () => this.resetApplication());
    }

    switchTab(tabId) {
        // Update buttons
        this.tabButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tabId);
        });
        
        // Update content
        this.tabContents.forEach(content => {
            content.classList.toggle('active', content.id === tabId);
        });
        
        this.currentMode = tabId === 'pdf-mode' ? 'pdf' : 'folder';
    }

    async handleFileSelect(mode, type) {
        if (mode === 'pdf') {
            const input = type === 'reference' ? this.pdfReference : this.pdfCompare;
            const info = type === 'reference' ? this.refInfo : this.compInfo;
            
            if (input.files.length > 0) {
                const file = input.files[0];
                const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
                
                // Mostrar información básica primero
                info.innerHTML = `✓ ${file.name}<br>Tamaño: ${sizeMB} MB<br><span class="loading-pages">Contando páginas...</span>`;
                info.style.background = '#e8f5e9';
                info.style.color = '#43a047';
                
                // Obtener número de páginas
                try {
                    const pageCount = await this.getPageCount(file);
                    info.innerHTML = `✓ ${file.name}<br>Tamaño: ${sizeMB} MB<br>📄 Páginas: ${pageCount}`;
                } catch (error) {
                    info.innerHTML = `✓ ${file.name}<br>Tamaño: ${sizeMB} MB<br>📄 Páginas: (error al contar)`;
                }
            } else {
                info.innerHTML = '';
            }
            
            this.uploadBtnPdf.disabled = !(this.pdfReference.files.length > 0 && this.pdfCompare.files.length > 0);
        } else {
            const input = type === 'reference' ? this.pdfsReference : this.pdfsCompare;
            const info = type === 'reference' ? this.refsInfo : this.compsInfo;
            
            if (input.files.length > 0) {
                const count = input.files.length;
                const totalSize = Array.from(input.files).reduce((sum, f) => sum + f.size, 0);
                const sizeMB = (totalSize / (1024 * 1024)).toFixed(2);
                info.innerHTML = `✓ ${count} archivo(s) seleccionado(s)<br>Tamaño total: ${sizeMB} MB`;
                info.style.background = '#e8f5e9';
                info.style.color = '#43a047';
            } else {
                info.innerHTML = 'Selecciona uno o más archivos PDF';
                info.style.background = '';
                info.style.color = '';
            }
            
            this.uploadBtnFolder.disabled = !(this.pdfsReference.files.length > 0 && this.pdfsCompare.files.length > 0);
        }
    }

    async getPageCount(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = async function(e) {
                try {
                    const typedArray = new Uint8Array(e.target.result);
                    
                    // Buscar el objeto Pages en el PDF
                    const text = String.fromCharCode.apply(null, typedArray);
                    const matches = text.match(/\/Type\s*\/Pages[^]*?\/Count\s+(\d+)/);
                    
                    if (matches && matches[1]) {
                        resolve(parseInt(matches[1]));
                    } else {
                        // Método alternativo: contar objetos Page
                        const pageMatches = text.match(/\/Type\s*\/Page[^s]/g);
                        if (pageMatches) {
                            resolve(pageMatches.length);
                        } else {
                            resolve('?');
                        }
                    }
                } catch (error) {
                    resolve('?');
                }
            };
            
            reader.onerror = () => resolve('?');
            reader.readAsArrayBuffer(file);
        });
    }

    handlePageModeChange() {
        const selectedMode = document.querySelector('input[name="page-mode"]:checked').value;
        
        this.rangeInputsPdf.style.display = selectedMode === 'range' ? 'block' : 'none';
        this.customPagesInput.style.display = selectedMode === 'custom' ? 'block' : 'none';
    }

    async uploadFiles(mode) {
        const formData = new FormData();
        
        if (mode === 'pdf') {
            formData.append('pdf_reference', this.pdfReference.files[0]);
            formData.append('pdf_compare', this.pdfCompare.files[0]);
            formData.append('mode', 'single');
            
            this.uploadBtnPdf.disabled = true;
            this.uploadBtnPdf.innerHTML = '<span class="loading"></span> Subiendo...';
        } else {
            // Upload multiple files
            Array.from(this.pdfsReference.files).forEach(file => {
                formData.append('pdfs_reference', file);
            });
            Array.from(this.pdfsCompare.files).forEach(file => {
                formData.append('pdfs_compare', file);
            });
            formData.append('mode', 'multiple');
            
            this.uploadBtnFolder.disabled = true;
            this.uploadBtnFolder.innerHTML = '<span class="loading"></span> Subiendo...';
        }
        
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
            
            if (mode === 'pdf') {
                this.taskId = data.task_id;
                this.refPages = data.ref_pages;
                this.compPages = data.comp_pages;
                
                // Update info
                this.refPagesInfo.textContent = `${this.refPages} páginas`;
                this.compPagesInfo.textContent = `${this.compPages} páginas`;
                
                // Update range limits for reference PDF
                this.startPageRef.max = this.refPages;
                this.endPageRef.max = this.refPages;
                this.endPageRef.value = this.refPages;
                
                // Update range limits for compare PDF
                this.startPageComp.max = this.compPages;
                this.endPageComp.max = this.compPages;
                this.endPageComp.value = this.compPages;
                
                // Show configuration
                this.uploadSectionPdf.style.display = 'none';
                this.configSectionPdf.style.display = 'block';
            } else {
                this.batchTasks = data.tasks;
                
                // Show file pairs
                this.displayFilePairs(data.tasks);
                
                // Show configuration
                this.uploadSectionFolder.style.display = 'none';
                this.configSectionFolder.style.display = 'block';
            }
            
        } catch (error) {
            this.showError(error.message);
            if (mode === 'pdf') {
                this.uploadBtnPdf.disabled = false;
                this.uploadBtnPdf.innerHTML = '📤 Subir Archivos';
            } else {
                this.uploadBtnFolder.disabled = false;
                this.uploadBtnFolder.innerHTML = '📤 Subir Archivos';
            }
        }
    }

    displayFilePairs(tasks) {
        this.filesList.innerHTML = '<h3>📋 Archivos a Comparar:</h3>';
        
        tasks.forEach((task, index) => {
            const pairDiv = document.createElement('div');
            pairDiv.className = 'file-pair';
            pairDiv.innerHTML = `
                <div class="file-pair-item">
                    <strong>📄 Referencia:</strong>
                    <span>${task.ref_filename}</span>
                </div>
                <div class="file-pair-item">
                    <strong>📄 Comparar:</strong>
                    <span>${task.comp_filename}</span>
                </div>
            `;
            this.filesList.appendChild(pairDiv);
        });
    }

    parseCustomPages(pagesStr, maxPages) {
        // Parse "1-3,5,7-10" format
        const pages = new Set();
        const parts = pagesStr.split(',');
        
        for (const part of parts) {
            const trimmed = part.trim();
            if (trimmed.includes('-')) {
                const [start, end] = trimmed.split('-').map(n => parseInt(n.trim()));
                if (isNaN(start) || isNaN(end)) continue;
                for (let i = Math.max(1, start); i <= Math.min(maxPages, end); i++) {
                    pages.add(i);
                }
            } else {
                const page = parseInt(trimmed);
                if (!isNaN(page) && page >= 1 && page <= maxPages) {
                    pages.add(page);
                }
            }
        }
        
        return Array.from(pages).sort((a, b) => a - b);
    }

    async startComparison(mode) {
        if (mode === 'pdf') {
            const pageMode = document.querySelector('input[name="page-mode"]:checked').value;
            let startPageRef = 1;
            let endPageRef = null;
            let startPageComp = 1;
            let endPageComp = null;
            let customPagesRef = null;
            let customPagesComp = null;
            
            if (pageMode === 'range') {
                startPageRef = parseInt(this.startPageRef.value);
                endPageRef = parseInt(this.endPageRef.value);
                startPageComp = parseInt(this.startPageComp.value);
                endPageComp = parseInt(this.endPageComp.value);
                
                if (startPageRef > endPageRef) {
                    alert('La página inicial del PDF Referencia no puede ser mayor que la final');
                    return;
                }
                if (startPageComp > endPageComp) {
                    alert('La página inicial del PDF a Comparar no puede ser mayor que la final');
                    return;
                }
            } else if (pageMode === 'custom') {
                const pagesRefStr = this.customPagesRef.value.trim();
                const pagesCompStr = this.customPagesComp.value.trim();
                
                if (!pagesRefStr || !pagesCompStr) {
                    alert('Por favor especifica las páginas a comparar para ambos PDFs');
                    return;
                }
                
                customPagesRef = this.parseCustomPages(pagesRefStr, this.refPages);
                customPagesComp = this.parseCustomPages(pagesCompStr, this.compPages);
                
                if (customPagesRef.length === 0 || customPagesComp.length === 0) {
                    alert('No se encontraron páginas válidas en uno o ambos PDFs');
                    return;
                }
                
                if (customPagesRef.length !== customPagesComp.length) {
                    alert(`Advertencia: El número de páginas no coincide (Referencia: ${customPagesRef.length}, Comparar: ${customPagesComp.length}). Se compararán hasta donde sea posible.`);
                }
            }
            
            const maxErrors = parseInt(this.maxErrorsPdf.value);
            const maxPhraseLength = parseInt(this.maxPhraseLength.value);
            
            try {
                const response = await fetch('/compare', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        task_id: this.taskId,
                        start_page_ref: startPageRef,
                        end_page_ref: endPageRef,
                        start_page_comp: startPageComp,
                        end_page_comp: endPageComp,
                        custom_pages_ref: customPagesRef,
                        custom_pages_comp: customPagesComp,
                        max_errors: maxErrors,
                        max_phrase_length: maxPhraseLength
                    })
                });
                
                if (!response.ok) {
                    const error = await response.json();
                    throw new Error(error.error || 'Error al iniciar comparación');
                }
                
                this.configSectionPdf.style.display = 'none';
                this.progressSection.style.display = 'block';
                this.batchProgress.style.display = 'none';
                
                this.pollProgress();
                
            } catch (error) {
                this.showError(error.message);
            }
        } else {
            // Folder mode - batch comparison
            const maxErrors = parseInt(this.maxErrorsFolder.value);
            const maxPhraseLength = parseInt(this.maxPhraseLengthFolder.value);
            
            try {
                const response = await fetch('/compare-batch', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        tasks: this.batchTasks.map(t => t.task_id),
                        max_errors: maxErrors,
                        max_phrase_length: maxPhraseLength
                    })
                });
                
                if (!response.ok) {
                    const error = await response.json();
                    throw new Error(error.error || 'Error al iniciar comparación por lotes');
                }
                
                this.configSectionFolder.style.display = 'none';
                this.progressSection.style.display = 'block';
                this.batchProgress.style.display = 'block';
                
                this.pollBatchProgress();
                
            } catch (error) {
                this.showError(error.message);
            }
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
                
                this.progressFill.style.width = `${data.progress}%`;
                this.progressText.textContent = `${data.progress}%`;
                this.statusMessage.textContent = data.message;
                this.pagesStat.textContent = `${data.pages_processed}/${data.total_pages}`;
                this.errorsContentStat.textContent = data.errors_content;
                this.errorsFormatStat.textContent = data.errors_format;
                
                if (data.status === 'completed') {
                    clearInterval(this.progressInterval);
                    this.showResults(data);
                } else if (data.status === 'error') {
                    clearInterval(this.progressInterval);
                    this.showError(data.message);
                } else if (data.status === 'cancelled') {
                    clearInterval(this.progressInterval);
                    this.showError('Comparación cancelada');
                }
                
            } catch (error) {
                clearInterval(this.progressInterval);
                this.showError(error.message);
            }
        }, 1000);
    }

    async pollBatchProgress() {
        this.progressInterval = setInterval(async () => {
            try {
                const response = await fetch(`/progress-batch/${this.batchTasks[0].task_id}`);
                
                if (!response.ok) {
                    throw new Error('Error al obtener progreso');
                }
                
                const data = await response.json();
                
                // Update overall progress
                this.progressFill.style.width = `${data.overall_progress}%`;
                this.progressText.textContent = `${data.overall_progress}%`;
                this.statusMessage.textContent = data.message;
                
                // Update batch list
                this.updateBatchList(data.tasks);
                
                if (data.status === 'completed') {
                    clearInterval(this.progressInterval);
                    this.showBatchResults(data);
                } else if (data.status === 'error') {
                    clearInterval(this.progressInterval);
                    this.showError(data.message);
                }
                
            } catch (error) {
                clearInterval(this.progressInterval);
                this.showError(error.message);
            }
        }, 1000);
    }

    updateBatchList(tasks) {
        this.batchList.innerHTML = '';
        
        tasks.forEach(task => {
            const item = document.createElement('div');
            item.className = `batch-item ${task.status}`;
            item.innerHTML = `
                <span>${task.filename}</span>
                <span>${task.status === 'completed' ? '✅' : task.status === 'processing' ? '⏳' : '❌'}</span>
            `;
            this.batchList.appendChild(item);
        });
    }

    async cancelComparison() {
        if (!confirm('¿Estás seguro de que deseas cancelar?')) {
            return;
        }
        
        try {
            await fetch(`/cancel/${this.taskId}`, {method: 'POST'});
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
            <h3>✅ Comparación Completada</h3>
            <p><strong>📄 Páginas analizadas:</strong> ${data.total_pages}</p>
            <p><strong>🔴 Diferencias de CONTENIDO:</strong> ${data.errors_content}</p>
            <p><strong>🎨 Diferencias de FORMATO:</strong> ${data.errors_format}</p>
            <p><strong>📊 Total:</strong> ${data.errors_content + data.errors_format}</p>
        `;
    }

    showBatchResults(data) {
        this.progressSection.style.display = 'none';
        this.resultsSection.style.display = 'block';
        
        const totalErrors = data.tasks.reduce((sum, t) => sum + (t.errors_content || 0) + (t.errors_format || 0), 0);
        
        this.resultsSummary.innerHTML = `
            <h3>✅ Comparación por Lotes Completada</h3>
            <p><strong>📁 Archivos procesados:</strong> ${data.tasks.length}</p>
            <p><strong>📊 Total de diferencias:</strong> ${totalErrors}</p>
        `;
    }

    async downloadResult() {
        try {
            window.location.href = `/download/${this.taskId}`;
            setTimeout(() => this.cleanupTask(), 2000);
        } catch (error) {
            this.showError('Error al descargar');
        }
    }

    async cleanupTask() {
        if (this.taskId) {
            try {
                await fetch(`/cleanup/${this.taskId}`, {method: 'POST'});
            } catch (error) {
                console.error('Error al limpiar:', error);
            }
        }
    }

    showError(message) {
        this.uploadSectionPdf.style.display = 'none';
        this.uploadSectionFolder.style.display = 'none';
        this.configSectionPdf.style.display = 'none';
        this.configSectionFolder.style.display = 'none';
        this.progressSection.style.display = 'none';
        this.resultsSection.style.display = 'none';
        this.errorSection.style.display = 'block';
        
        this.errorMessage.textContent = message;
    }

    resetApplication() {
        this.cleanupTask();
        
        // Reset state
        this.taskId = null;
        this.refPages = 0;
        this.compPages = 0;
        this.batchTasks = [];
        
        // Clear inputs
        this.pdfReference.value = '';
        this.pdfCompare.value = '';
        this.pdfsReference.value = '';
        this.pdfsCompare.value = '';
        this.refInfo.innerHTML = '';
        this.compInfo.innerHTML = '';
        this.refsInfo.innerHTML = 'Selecciona uno o más archivos PDF';
        this.compsInfo.innerHTML = 'Selecciona uno o más archivos PDF';
        
        // Reset buttons
        this.uploadBtnPdf.disabled = true;
        this.uploadBtnPdf.innerHTML = '📤 Subir Archivos';
        this.uploadBtnFolder.disabled = true;
        this.uploadBtnFolder.innerHTML = '📤 Subir Archivos';
        
        // Reset progress
        this.progressFill.style.width = '0%';
        this.progressText.textContent = '0%';
        
        // Show upload section
        if (this.currentMode === 'pdf') {
            this.uploadSectionPdf.style.display = 'block';
            this.configSectionPdf.style.display = 'none';
        } else {
            this.uploadSectionFolder.style.display = 'block';
            this.configSectionFolder.style.display = 'none';
        }
        
        this.progressSection.style.display = 'none';
        this.resultsSection.style.display = 'none';
        this.errorSection.style.display = 'none';
        
        if (this.progressInterval) {
            clearInterval(this.progressInterval);
        }
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    new ComparadorPDF();
});