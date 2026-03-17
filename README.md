# 📊 Comparador PDF Web v1.0

Aplicación web para comparar documentos PDF y detectar diferencias de contenido y formato.

**Basado en:** Comparador PDF Desktop v2.9.1  
**Desarrollado por:** Jesus Eduardo Soler Collantes

---

## 🌟 Características

- ✅ **Interfaz Web Moderna**: Diseño responsive y atractivo
- 📤 **Carga de Archivos**: Sube dos PDFs para comparar
- ⚙️ **Configuración Flexible**: Compara documento completo o páginas específicas
- 📊 **Progreso en Tiempo Real**: Visualiza el avance de la comparación
- 🔴 **Detección de Diferencias**: Identifica diferencias de contenido y formato
- 📥 **Descarga de Resultados**: Genera documento Word con el análisis
- 🚀 **Procesamiento Asíncrono**: No bloquea la interfaz durante la comparación
- ⛔ **Cancelación**: Detén la comparación en cualquier momento

---

## 📋 Requisitos

- Python 3.8 o superior
- pip (gestor de paquetes de Python)
- Navegador web moderno (Chrome, Firefox, Edge, Safari)

---

## 🚀 Instalación

### 1. Clonar o descargar el proyecto

```bash
cd web_app
```

### 2. Crear entorno virtual (recomendado)

**Windows:**
```bash
python -m venv venv
venv\Scripts\activate
```

**Linux/Mac:**
```bash
python3 -m venv venv
source venv/bin/activate
```

### 3. Instalar dependencias

```bash
pip install -r requirements.txt
```

---

## ▶️ Uso

### Iniciar el servidor

```bash
python app.py
```

El servidor se iniciará en: **http://localhost:5000**

### Acceder a la aplicación

1. Abre tu navegador web
2. Ve a: **http://localhost:5000**
3. Sigue los pasos en la interfaz:
   - **Paso 1:** Selecciona los dos PDFs a comparar
   - **Paso 2:** Configura las opciones de comparación
   - **Paso 3:** Observa el progreso en tiempo real
   - **Paso 4:** Descarga el documento Word con los resultados

---

## 📁 Estructura del Proyecto

```
web_app/
│
├── app.py                      # Aplicación Flask (backend)
├── requirements.txt            # Dependencias Python
├── README.md                   # Este archivo
│
├── templates/
│   └── index.html             # Interfaz HTML
│
├── static/
│   ├── css/
│   │   └── style.css          # Estilos CSS
│   └── js/
│       └── app.js             # Lógica JavaScript
│
├── uploads/                    # Archivos PDF subidos (temporal)
└── results/                    # Documentos Word generados
```

---

## 🔧 Configuración

### Límite de tamaño de archivo

Por defecto: **50 MB por archivo**

Para cambiar, edita en `app.py`:
```python
MAX_FILE_SIZE = 50 * 1024 * 1024  # 50MB
```

### Puerto del servidor

Por defecto: **5000**

Para cambiar, edita en `app.py`:
```python
app.run(debug=True, host='0.0.0.0', port=5000)
```

### Límite de diferencias

Por defecto: **500 diferencias**

Configurable desde la interfaz web (50-2000)

---

## 🎯 Funcionalidades Principales

### 1. Comparación de Contenido
- Detecta palabras y frases diferentes entre PDFs
- Agrupa palabras consecutivas en frases
- Identifica texto presente en un PDF pero no en el otro

### 2. Comparación de Formato
- Detecta diferencias visuales
- Identifica cambios de presentación

### 3. Generación de Informes
- Documento Word detallado
- Resumen ejecutivo
- Listado de diferencias por página

### 4. Progreso en Tiempo Real
- Barra de progreso visual
- Contador de páginas procesadas
- Contador de diferencias encontradas
- Mensajes de estado

---

## 🌐 API Endpoints

### POST `/upload`
Sube dos archivos PDF

**Body:** FormData con `pdf_reference` y `pdf_compare`

**Response:**
```json
{
  "task_id": "uuid",
  "ref_pages": 10,
  "comp_pages": 10,
  "ref_filename": "documento1.pdf",
  "comp_filename": "documento2.pdf"
}
```

### POST `/compare`
Inicia la comparación

**Body:**
```json
{
  "task_id": "uuid",
  "start_page": 1,
  "end_page": 10,
  "max_errors": 500
}
```

### GET `/progress/<task_id>`
Obtiene el progreso de la comparación

**Response:**
```json
{
  "status": "processing",
  "progress": 45,
  "message": "Comparando página 5",
  "errors_content": 12,
  "errors_format": 3,
  "pages_processed": 5,
  "total_pages": 10
}
```

### GET `/download/<task_id>`
Descarga el documento Word generado

### POST `/cancel/<task_id>`
Cancela una comparación en progreso

### POST `/cleanup/<task_id>`
Limpia los archivos temporales de una tarea

---

## 🔒 Seguridad

- ✅ Validación de tipos de archivo (solo PDF)
- ✅ Nombres de archivo seguros (secure_filename)
- ✅ IDs únicos por sesión (UUID)
- ✅ Límite de tamaño de archivo
- ✅ CORS configurado
- ⚠️ **Nota:** Esta es una versión de desarrollo. Para producción, considera:
  - Autenticación de usuarios
  - HTTPS
  - Rate limiting
  - Almacenamiento persistente
  - Limpieza automática de archivos antiguos

---

## 🐛 Solución de Problemas

### Error: "ModuleNotFoundError"
**Solución:** Instala las dependencias
```bash
pip install -r requirements.txt
```

### Error: "Address already in use"
**Solución:** El puerto 5000 está ocupado. Cambia el puerto en `app.py` o cierra la aplicación que lo usa.

### Error al subir archivos grandes
**Solución:** Aumenta `MAX_FILE_SIZE` en `app.py`

### La comparación es muy lenta
**Solución:** 
- Reduce el rango de páginas
- Aumenta el límite de diferencias para detener antes
- Considera usar la versión desktop para archivos muy grandes

---

## 📝 Diferencias con la Versión Desktop

| Característica | Desktop v2.9.1 | Web v1.0 |
|----------------|----------------|----------|
| Interfaz | Tkinter (nativa) | HTML/CSS/JS |
| Instalación | Ejecutable | Servidor web |
| Procesamiento | Multihilo local | Asíncrono servidor |
| Capturas de pantalla | ✅ Sí | ❌ No (simplificado) |
| Comparación por lotes | ✅ Sí | ❌ No |
| Generación PDF | ✅ Sí | ❌ Solo Word |
| Acceso remoto | ❌ No | ✅ Sí |

---

## 🔄 Actualizaciones Futuras

- [ ] Autenticación de usuarios
- [ ] Historial de comparaciones
- [ ] Comparación por lotes
- [ ] Generación de PDF
- [ ] Capturas de pantalla en resultados
- [ ] Exportación a Excel
- [ ] API REST completa
- [ ] Modo oscuro
- [ ] Múltiples idiomas

---

## 📄 Licencia

© 2026 Jesus Eduardo Soler Collantes

---

## 👨‍💻 Autor

**Jesus Eduardo Soler Collantes**

Basado en el Comparador PDF Desktop v2.9.1

---

## 🙏 Agradecimientos

Gracias por usar el Comparador PDF Web. Esta herramienta ha sido desarrollada para facilitar la comparación de documentos PDF de manera rápida y eficiente.

Para reportar problemas o sugerencias, por favor contacta al desarrollador.

---

**¡Disfruta comparando PDFs! 📊✨**