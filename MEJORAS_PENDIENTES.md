# Mejoras Pendientes - Versión Web vs Escritorio

## 📋 Funcionalidades Faltantes en la Versión Web

### 1. **Búsqueda Automática de Pares de PDFs**

**Estado**: ❌ No implementado en web

**Descripción**: La aplicación de escritorio tiene un algoritmo inteligente que:
- Busca coincidencias exactas por nombre de archivo
- Busca coincidencias parciales usando `SequenceMatcher` (similitud ≥60%)
- Calcula confianza del emparejamiento (0.0 a 1.0)
- Clasifica matches como: 'exact', 'partial', o 'manual'

**Código de referencia** (líneas 60-140 del escritorio):
```python
def find_pdf_pairs(folder1, folder2):
    # FASE 1: Coincidencia exacta
    # FASE 2: Coincidencia parcial con SequenceMatcher
    # Retorna lista de pares con confianza y tipo
```

**Implementación necesaria en web**:
- Endpoint `/find-pairs` que reciba dos listas de archivos
- Algoritmo de emparejamiento en backend
- Retornar JSON con pares encontrados

---

### 2. **Listado de PDFs Disponibles**

**Estado**: ❌ No implementado en web

**Descripción**: La aplicación de escritorio muestra:
- Lista de PDFs sin emparejar en cada carpeta
- Permite seleccionar PDFs para emparejamiento manual
- Actualiza listas dinámicamente al crear/eliminar pares

**Implementación necesaria en web**:
- Endpoint `/list-pdfs` para listar archivos en carpetas
- Componente UI con dos listas (Referencia y Comparar)
- Filtrado de PDFs ya emparejados

---

### 3. **Tabla de Pares con Información Detallada**

**Estado**: ⚠️ Parcialmente implementado

**Actual en web**:
- Solo muestra nombres de archivos emparejados
- No muestra confianza del match
- No muestra tipo de emparejamiento
- **No muestra número de páginas de cada PDF**

**Necesario agregar**:
- Columna "Confianza" (100%, 95%, 80%, etc.)
- Columna "Tipo" (Exacto, Parcial, Manual)
- Columna "Páginas Ref" (número de páginas del PDF Referencia)
- Columna "Páginas Comp" (número de páginas del PDF a Comparar)
- Filtros por confianza (≥90%, ≥80%, etc.)

---

### 4. **Emparejamiento Manual**

**Estado**: ❌ No implementado en web

**Descripción**: Permite al usuario:
- Seleccionar un PDF de cada lista
- Crear un par manualmente
- Marcar el par como 'manual' con confianza 1.0

**Implementación necesaria en web**:
- Botón "Emparejar" entre las dos listas
- Endpoint `/create-manual-pair`
- Validación de que los archivos existan

---

### 5. **Información de Páginas en Pares**

**Estado**: ❌ No implementado en web

**Descripción**: La aplicación de escritorio muestra:
- Número de páginas de cada PDF en la tabla de pares
- Ayuda a identificar PDFs con diferente número de páginas
- Útil para detectar problemas antes de comparar

**Implementación necesaria en web**:
- Función `get_pdf_pages_batch()` en backend
- Incluir páginas en respuesta de `/find-pairs`
- Mostrar en tabla de pares

---

### 6. **Filtros Avanzados**

**Estado**: ❌ No implementado en web

**Descripción**: Filtros disponibles en escritorio:
- "Todos" - Muestra todos los pares
- "100%" - Solo coincidencias exactas
- "≥90%" - Confianza mayor o igual a 90%
- "≥80%" - Confianza mayor o igual a 80%
- "≥70%" - Confianza mayor o igual a 70%
- "Manuales" - Solo pares creados manualmente

**Implementación necesaria en web**:
- Dropdown de filtros en UI
- Filtrado en frontend o backend
- Actualización dinámica de tabla

---

### 7. **Gestión de Pares**

**Estado**: ⚠️ Parcialmente implementado

**Actual en web**:
- Permite eliminar pares individuales

**Necesario agregar**:
- Selección múltiple de pares
- Botón "Seleccionar todos"
- Botón "Deseleccionar todos"
- Botón "Eliminar seleccionados"
- Menú contextual (clic derecho)

---

### 8. **Carpeta de Salida Configurable**

**Estado**: ❌ No implementado en web

**Descripción**: En escritorio:
- Permite seleccionar carpeta de salida para lotes
- Crea subcarpeta `Lote_{timestamp}`
- Guarda todos los documentos Word en esa carpeta

**Implementación necesaria en web**:
- Campo para especificar carpeta de salida
- Crear estructura de carpetas en servidor
- Incluir timestamp en nombre de carpeta

---

### 9. **Informe Consolidado**

**Estado**: ❌ No implementado en web

**Descripción**: Genera informe consolidado con:
- Resumen general (total diferencias)
- Tabla con resultados de cada par
- Estadísticas (promedios, máximos, mínimos)
- Exportación a Word y Excel

**Implementación necesaria en web**:
- Función `generate_consolidated_report()`
- Generación de Excel con pandas
- Descarga de múltiples archivos (ZIP)

---

### 10. **Ventana de Progreso Mejorada**

**Estado**: ⚠️ Básico implementado

**Actual en web**:
- Barra de progreso simple
- Porcentaje de avance

**Necesario agregar**:
- Log de actividad en tiempo real
- Timestamps en cada mensaje
- Colores por tipo (info, success, warning, error)
- Scroll automático al final
- Botón "Limpiar log"

---

## 🎯 Prioridades de Implementación

### Alta Prioridad (Crítico)
1. ✅ Búsqueda automática de pares
2. ✅ Listado de PDFs disponibles
3. ✅ Información de páginas en pares

### Media Prioridad (Importante)
4. ✅ Emparejamiento manual
5. ✅ Filtros avanzados
6. ✅ Gestión de pares (selección múltiple)

### Baja Prioridad (Mejoras)
7. ⚠️ Carpeta de salida configurable
8. ⚠️ Informe consolidado
9. ⚠️ Ventana de progreso mejorada

---

## 📝 Plan de Implementación

### Fase 1: Backend (API Endpoints)
```python
# Nuevos endpoints necesarios
@app.route('/list-pdfs', methods=['POST'])
def list_pdfs_in_folders():
    # Listar PDFs en carpetas subidas
    pass

@app.route('/find-pairs', methods=['POST'])
def find_pairs():
    # Algoritmo de emparejamiento
    pass

@app.route('/create-manual-pair', methods=['POST'])
def create_manual_pair():
    # Crear par manual
    pass

@app.route('/get-pdf-pages', methods=['POST'])
def get_pdf_pages():
    # Obtener número de páginas
    pass
```

### Fase 2: Frontend (UI Components)
```javascript
// Componentes necesarios
- PairTable (tabla con filtros)
- PdfLists (listas de PDFs disponibles)
- PairFilters (dropdown de filtros)
- ProgressLog (log de actividad)
- BatchControls (botones de gestión)
```

### Fase 3: Integración
- Conectar frontend con backend
- Probar flujo completo
- Ajustar UI/UX

---

## 🔍 Diferencias Clave

| Funcionalidad | Escritorio | Web |
|--------------|-----------|-----|
| Búsqueda automática de pares | ✅ | ❌ |
| Emparejamiento manual | ✅ | ❌ |
| Información de páginas | ✅ | ❌ |
| Filtros por confianza | ✅ | ❌ |
| Selección múltiple | ✅ | ⚠️ |
| Informe consolidado | ✅ | ❌ |
| Log de actividad | ✅ | ⚠️ |
| Carpeta de salida | ✅ | ❌ |

---

## 💡 Recomendaciones

1. **Priorizar búsqueda automática**: Es la funcionalidad más importante
2. **Implementar en orden**: Backend → Frontend → Integración
3. **Reutilizar código**: Adaptar algoritmos de la versión escritorio
4. **Mantener compatibilidad**: Asegurar que funcione con la funcionalidad existente
5. **Probar exhaustivamente**: Especialmente el emparejamiento de archivos

---

## 📚 Referencias

- **Código de escritorio**: `comparador_GUI_con_selector_paginas_v2.9.1.py`
- **Funciones clave**:
  - `find_pdf_pairs()` (línea 60)
  - `get_pdf_pages_batch()` (línea 40)
  - `create_manual_pair_batch()` (línea 2800)
  - `generate_consolidated_report()` (línea 3100)

---

**Última actualización**: 17/03/2026  
**Versión web actual**: 2.0  
**Versión escritorio referencia**: 2.9.1