# Capturas de Pantalla Implementadas - Versión Web v2.0

## 📸 Nueva Funcionalidad

La versión web del Comparador de PDFs ahora incluye la **captura de pantallas** que ya estaba presente en la aplicación de escritorio v2.9.1.

## ✨ Características Implementadas

### 1. Captura Automática de Diferencias
- **Resaltado en VERDE**: Cuando se encuentra el texto en el PDF
- **Marcado en ROJO**: Cuando el texto NO se encuentra (indica dónde debería estar)
- **Búsqueda Inteligente**: Múltiples estrategias de búsqueda para frases completas

### 2. Estrategias de Búsqueda Mejoradas

La función `capture_area()` implementa 4 estrategias de búsqueda:

1. **Búsqueda exacta** con preservación de espacios
2. **Búsqueda estándar** sin flags especiales
3. **Búsqueda por proximidad** para frases (agrupa palabras cercanas)
4. **Búsqueda case-insensitive** como último recurso

### 3. Generación de Capturas Comparativas

Para cada diferencia detectada:
- Se genera una captura del **PDF Referencia**
- Se genera una captura del **PDF a Comparar**
- Ambas capturas se incluyen en el documento Word final

### 4. Tipos de Capturas

#### Texto Solo en PDF Referencia (SOLO_REFERENCIA)
- **PDF Referencia**: Texto resaltado en VERDE (encontrado)
- **PDF a Comparar**: Rectángulo ROJO indicando dónde debería estar (falta)

#### Texto Solo en PDF a Comparar (SOLO_COMPARAR)
- **PDF a Comparar**: Texto resaltado en VERDE (encontrado)
- **PDF Referencia**: Rectángulo ROJO indicando dónde debería estar (falta)

## 🔧 Implementación Técnica

### Funciones Principales

#### `capture_area(pdf_path, page_num, word, temp_dir, label, zoom=5.0, mark_missing=False, ref_rect=None)`
Captura un área del PDF con el texto resaltado.

**Parámetros:**
- `pdf_path`: Ruta al archivo PDF
- `page_num`: Número de página (0-based)
- `word`: Palabra o frase a buscar
- `temp_dir`: Directorio temporal para guardar capturas
- `label`: Etiqueta para el nombre del archivo
- `zoom`: Factor de zoom (default: 5.0)
- `mark_missing`: Si es True, marca en rojo donde debería estar el texto
- `ref_rect`: Rectángulo de referencia del otro PDF

**Retorna:**
- `filepath`: Ruta de la imagen generada
- `rect`: Rectángulo donde se encontró el texto (o None)

#### `generate_comparison(pap_pdf, serv_pdf, ref_page_num, comp_page_num, diff, temp_dir)`
Genera comparación de una diferencia entre dos PDFs con capturas de pantalla.

**Retorna:**
- Diccionario con:
  - `palabra`: Texto de la diferencia
  - `tipo`: SOLO_REFERENCIA o SOLO_COMPARAR
  - `img_p`: Ruta de la captura del PDF Referencia
  - `img_s`: Ruta de la captura del PDF a Comparar

### Flujo de Procesamiento

```python
1. Detectar diferencia de contenido
   ↓
2. Llamar a generate_comparison()
   ↓
3. Capturar área en PDF Referencia (capture_area)
   ↓
4. Capturar área en PDF a Comparar (capture_area)
   ↓
5. Guardar rutas de imágenes
   ↓
6. Incluir en documento Word final
```

## 📄 Documento Word Generado

El documento Word ahora incluye:

### Sección de Diferencias de Contenido
Para cada diferencia:
- **Encabezado**: Número de página
- **Detalles**: Palabra/frase y tipo de diferencia
- **Tabla 2x2**:
  - Fila 1: Encabezados "PDF REFERENCIA" | "PDF A COMPARAR"
  - Fila 2: Captura de pantalla | Captura de pantalla

### Características de las Capturas
- **Tamaño**: 3.0 pulgadas de ancho
- **Formato**: PNG
- **Resolución**: Zoom 2.0x para mejor calidad
- **Resaltado**: Círculos verdes o rectángulos rojos según el caso

## 🎨 Visualización de Diferencias

### Texto Encontrado (Verde)
```
┌─────────────────────────────┐
│ Encontrado: 1 ocurrencias   │
│                             │
│    ⭕ texto resaltado ⭕    │
│                             │
└─────────────────────────────┘
```

### Texto No Encontrado (Rojo)
```
┌─────────────────────────────┐
│ TEXTO NO ENCONTRADO         │
│ (Debería estar aquí según   │
│  PDF de referencia)         │
│    🔴 área marcada 🔴       │
└─────────────────────────────┘
```

## 📊 Mejoras Respecto a la Versión Anterior

### Antes (sin capturas)
- Solo texto descriptivo de las diferencias
- Difícil de visualizar dónde están los errores
- Requería abrir los PDFs manualmente

### Ahora (con capturas)
- ✅ Visualización inmediata de las diferencias
- ✅ Contexto visual completo
- ✅ Comparación lado a lado
- ✅ Identificación precisa de ubicación
- ✅ Documentación visual completa

## 🚀 Uso

La funcionalidad se activa automáticamente al realizar cualquier comparación:

1. **Subir PDFs** (individual o múltiple)
2. **Configurar parámetros** (páginas, límites, etc.)
3. **Iniciar comparación**
4. **Descargar documento Word** con capturas incluidas

## 📁 Estructura de Archivos

```
results/
└── {task_id}/
    ├── temp_screenshots_{task_id}/
    │   ├── pag1_referencia_texto_FULL.png
    │   ├── pag1_comparar_FALTA_texto_FULL.png
    │   ├── pag2_comparar_texto_FULL.png
    │   ├── pag2_referencia_FALTA_texto_FULL.png
    │   └── ...
    └── Comparacion_{task_id}.docx
```

## ⚙️ Configuración

### Parámetros Relacionados
- `max_errors`: Límite de diferencias a capturar (default: 500)
- `max_phrase_length`: Longitud máxima de frases (default: 10 palabras)

### Límites
- Máximo 100 diferencias con capturas en el documento Word
- Capturas guardadas temporalmente durante el procesamiento
- Limpieza automática al descargar el resultado

## 🔍 Búsqueda de Frases

### Algoritmo de Proximidad
Para frases de múltiples palabras:
1. Busca cada palabra individualmente
2. Encuentra grupos de palabras cercanas
3. Valida que estén en la misma línea (distancia vertical < 5)
4. Valida que estén cerca horizontalmente (distancia < 100)
5. Crea un rectángulo que engloba toda la frase

### Ejemplo
```
Frase: "cliente solicita cambio"

Búsqueda:
- "cliente" → encontrado en (x:100, y:200)
- "solicita" → encontrado en (x:150, y:200) ✓ cerca
- "cambio" → encontrado en (x:210, y:200) ✓ cerca

Resultado: Rectángulo (100,200) → (260,220)
```

## 🎯 Beneficios

1. **Documentación Visual Completa**: Cada diferencia tiene evidencia visual
2. **Facilita Revisión**: No necesitas abrir los PDFs originales
3. **Contexto Inmediato**: Ves exactamente dónde está el problema
4. **Profesional**: Documentos Word con capturas de alta calidad
5. **Trazabilidad**: Evidencia visual para auditorías

## 🔄 Compatibilidad

- ✅ Compatible con todas las funcionalidades existentes
- ✅ Funciona en modo individual y por lotes
- ✅ Soporta rangos de páginas personalizados
- ✅ Mantiene límites de diferencias configurables
- ✅ Agrupación inteligente de frases

## 📝 Notas Técnicas

### Dependencias
- `PyMuPDF (fitz)`: Lectura y búsqueda en PDFs
- `Pillow (PIL)`: Generación de imágenes
- `python-docx`: Inserción de imágenes en Word

### Rendimiento
- Las capturas se generan solo para diferencias de contenido
- No afecta significativamente el tiempo de procesamiento
- Almacenamiento temporal se limpia automáticamente

## 🎉 Conclusión

La versión web ahora tiene **paridad completa** con la aplicación de escritorio en cuanto a captura de pantallas, proporcionando una experiencia visual rica y profesional para la comparación de PDFs.

---

**Desarrollado por**: Jesus Eduardo Soler Collantes  
**Versión**: 2.0 (basado en v2.9.1 de escritorio)  
**Fecha**: Marzo 2026