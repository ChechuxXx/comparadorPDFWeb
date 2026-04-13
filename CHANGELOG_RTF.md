# Changelog - Soporte para Archivos RTF

## Versión 2.2 - 13/04/2026

### ✨ Nuevas Funcionalidades

Se ha añadido soporte completo para comparar archivos RTF (Rich Text Format) además de los archivos PDF existentes.

### 🔧 Cambios Técnicos

#### 1. **Dependencias Actualizadas**
- Añadida librería `striprtf==0.0.26` en `requirements.txt`
- Esta librería permite extraer texto plano de archivos RTF

#### 2. **Configuración**
- `ALLOWED_EXTENSIONS` ahora incluye `{'pdf', 'rtf'}`
- Los archivos RTF son validados igual que los PDF

#### 3. **Nuevas Funciones**

##### `get_file_extension(filepath)`
- Obtiene la extensión del archivo en minúsculas
- Retorna: `.pdf`, `.rtf`, etc.

##### `extract_text_from_rtf(rtf_path)`
- Extrae texto plano de un archivo RTF
- Maneja errores de codificación automáticamente
- Retorna el texto extraído o cadena vacía en caso de error

##### `extract_text_from_file(file_path)`
- Función unificada para extraer texto de PDF o RTF
- Detecta automáticamente el tipo de archivo
- Retorna el texto completo del documento

##### `get_document_info(file_path)`
- Obtiene información del documento (número de páginas para PDF, 1 para RTF)
- Útil para mostrar información al usuario

##### `process_comparison_rtf_web(task_id, file1_path, file2_path, output_dir, max_errors, max_phrase_length)`
- Función especializada para comparar archivos RTF
- Extrae el texto completo de ambos archivos
- Compara el contenido usando la misma lógica que PDF
- Genera un documento Word con las diferencias encontradas
- **Nota**: Los archivos RTF no generan capturas de pantalla (no tienen páginas visuales)

#### 4. **Modificaciones en Funciones Existentes**

##### `process_comparison_web()`
- Ahora detecta automáticamente el tipo de archivo
- Si ambos archivos son RTF, delega a `process_comparison_rtf_web()`
- Si se intenta comparar PDF con RTF, muestra un error claro
- Mantiene la funcionalidad completa para archivos PDF

##### `upload_files()`
- Mensaje de error actualizado: "Solo se permiten archivos PDF o RTF"

### 📋 Limitaciones

1. **Comparación Mixta**: No se pueden comparar archivos de diferentes formatos (PDF vs RTF)
2. **Capturas de Pantalla**: Los archivos RTF no generan capturas de pantalla visuales
3. **Páginas**: Los archivos RTF se tratan como un documento único (sin paginación)

### 🎯 Casos de Uso

#### Comparación de Archivos RTF
```python
# Ambos archivos deben ser RTF
archivo_referencia.rtf  ←→  archivo_comparar.rtf
```

#### Comparación de Archivos PDF (sin cambios)
```python
# Funcionalidad existente mantiene todas sus características
archivo_referencia.pdf  ←→  archivo_comparar.pdf
```

### 📊 Formato del Reporte

#### Para archivos RTF:
- **Título**: "COMPARACIÓN DE ARCHIVOS RTF"
- **Contenido**: Lista de diferencias encontradas (palabras/frases)
- **Sin capturas**: Solo texto descriptivo de las diferencias
- **Formato**: Documento Word (.docx)

#### Para archivos PDF (sin cambios):
- **Título**: "COMPARACIÓN DE PDFs CON CAPTURAS"
- **Contenido**: Diferencias con capturas de pantalla visuales
- **Formato**: Documento Word (.docx) con imágenes

### 🚀 Instalación

Para usar la nueva funcionalidad, instalar las dependencias actualizadas:

```bash
pip install -r requirements.txt
```

### ✅ Compatibilidad

- ✅ Totalmente compatible con la funcionalidad existente de PDF
- ✅ No requiere cambios en la interfaz de usuario
- ✅ Los endpoints existentes funcionan sin modificaciones
- ✅ Detección automática del tipo de archivo

### 🔍 Ejemplo de Uso

```python
# El usuario sube dos archivos RTF
# El sistema detecta automáticamente que son RTF
# Procesa la comparación sin capturas de pantalla
# Genera un reporte Word con las diferencias textuales
```

### 📝 Notas Adicionales

- Los archivos RTF se procesan más rápido que los PDF (no requieren renderizado)
- La comparación de contenido usa el mismo algoritmo inteligente de agrupación de frases
- Los errores de formato se detectan igual que en PDF
- El límite de errores (`max_errors`) aplica igual para RTF

---

**Desarrollado por**: Jesus Eduardo Soler Collantes  
**Fecha**: 13/04/2026  
**Versión**: 2.2