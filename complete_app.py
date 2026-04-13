#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Complete the truncated app.js file"""

import os

# Change to script directory
os.chdir(os.path.dirname(os.path.abspath(__file__)))

# Read current file
with open('static/js/app.js', 'r', encoding='utf-8') as f:
    content = f.read()

# The missing part to append
missing_part = '''`, {
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
'''

# Check if file is truncated
if content.rstrip().endswith('const response = await fetch(`/compare-pairs/${this.batchId'):
    # Write complete file
    with open('static/js/app.js', 'w', encoding='utf-8') as f:
        f.write(content + missing_part)
    print('✓ File completed successfully!')
else:
    print('✗ File structure different than expected')
    print(f'File ends with: ...{content[-100:]}')