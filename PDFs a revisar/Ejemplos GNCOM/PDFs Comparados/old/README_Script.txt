================================================================================
INSTRUCCIONES PARA GENERAR DOCUMENTO WORD CON COMPARACIÓN VISUAL
================================================================================

Archivo: generar_comparacion_word.py
Propósito: Generar un documento Word con análisis comparativo visual del 
           documento FAC_001_ES_PI25142000355153 entre Papyrus y Servinform

================================================================================
REQUISITOS PREVIOS
================================================================================

1. Python 3.7 o superior instalado en tu sistema
   - Verificar: Abre CMD y ejecuta: python --version

2. Instalar las bibliotecas necesarias:
   
   Opción A - Instalación individual:
   pip install PyMuPDF
   pip install python-docx
   pip install Pillow

   Opción B - Instalación conjunta:
   pip install PyMuPDF python-docx Pillow

   NOTA: Si tienes problemas con pip, intenta:
   python -m pip install PyMuPDF python-docx Pillow

================================================================================
CÓMO EJECUTAR EL SCRIPT
================================================================================

MÉTODO 1: Desde la línea de comandos (CMD)
-------------------------------------------
1. Abre el símbolo del sistema (CMD)
2. Navega a la carpeta donde está el script:
   cd "C:\Users\GONZALOGUERRASABUGO\Box\BAP COE Delta\DAZEL - Papyrus - Solución conceptual\PDFs a revisar\Ejemplos GNCOM\PDFs Comparados"

3. Ejecuta el script:
   python generar_comparacion_word.py

MÉTODO 2: Desde PowerShell
---------------------------
1. Abre PowerShell
2. Navega a la carpeta:
   cd "C:\Users\GONZALOGUERRASABUGO\Box\BAP COE Delta\DAZEL - Papyrus - Solución conceptual\PDFs a revisar\Ejemplos GNCOM\PDFs Comparados"

3. Ejecuta:
   python generar_comparacion_word.py

MÉTODO 3: Doble clic (Windows)
-------------------------------
1. Simplemente haz doble clic en el archivo generar_comparacion_word.py
2. Se abrirá una ventana de consola mostrando el progreso
3. La ventana se cerrará automáticamente al finalizar

================================================================================
QUÉ HACE EL SCRIPT
================================================================================

El script realizará las siguientes acciones:

1. Verificará que existan los archivos PDF de Papyrus y Servinform
2. Creará una carpeta temporal "temp_images" para guardar las imágenes extraídas
3. Extraerá las 3 páginas de cada PDF como imágenes de alta calidad
4. Creará un documento Word profesional con:
   - Título y fecha de análisis
   - Resumen ejecutivo destacando la diferencia crítica (tasa GTS)
   - 11 secciones de diferencias detalladas
   - Cada diferencia con:
     * Descripción de la diferencia
     * Tabla comparativa lado a lado
     * Imágenes de ambos PDFs mostrando la diferencia
   - Sección de conclusiones y recomendaciones
5. Guardará el documento como "FAC_001_Comparacion_Visual.docx"

================================================================================
RESULTADO ESPERADO
================================================================================

Al finalizar exitosamente, encontrarás:

1. Archivo Word generado:
   "FAC_001_Comparacion_Visual.docx"
   
   Ubicación: Misma carpeta donde está el script
   (PDFs Comparados)

2. Carpeta con imágenes temporales:
   "temp_images"
   
   Contiene las imágenes extraídas de los PDFs:
   - papyrus_page1.png
   - papyrus_page2.png
   - papyrus_page3.png
   - servinform_page1.png
   - servinform_page2.png
   - servinform_page3.png

   NOTA: Puedes eliminar esta carpeta después de revisar el documento Word
         si no necesitas las imágenes individuales.

================================================================================
MENSAJES DE CONSOLA
================================================================================

Durante la ejecución verás mensajes como:

Iniciando generación de documento de comparación...
Papyrus PDF: [ruta]
Servinform PDF: [ruta]

Extrayendo imágenes de páginas completas...

Generando secciones de diferencias...
  - Diferencia 1: Información administrativa
  - Diferencia 2: Dirección en datos sociales
  [...]

Guardando documento en: [ruta]

✓ Documento generado exitosamente: [ruta]
✓ Imágenes temporales guardadas en: [ruta]

============================================================
PROCESO COMPLETADO EXITOSAMENTE
============================================================

================================================================================
SOLUCIÓN DE PROBLEMAS
================================================================================

PROBLEMA: "ModuleNotFoundError: No module named 'fitz'"
SOLUCIÓN: Instala PyMuPDF: pip install PyMuPDF

PROBLEMA: "ModuleNotFoundError: No module named 'docx'"
SOLUCIÓN: Instala python-docx: pip install python-docx

PROBLEMA: "ERROR: No se encuentra el PDF de Papyrus"
SOLUCIÓN: Verifica que los archivos PDF existan en las rutas correctas:
          - Papyrus/Español/FAC_001_ES_PI25142000355153.pdf
          - Servinform/Español/FAC_001_ES_PI25142000355153.pdf

PROBLEMA: El script se ejecuta pero no genera el documento
SOLUCIÓN: 
  1. Verifica que tienes permisos de escritura en la carpeta
  2. Cierra el archivo Word si está abierto
  3. Revisa los mensajes de error en la consola

PROBLEMA: Las imágenes no aparecen en el documento Word
SOLUCIÓN: 
  1. Verifica que se creó la carpeta temp_images
  2. Verifica que las imágenes PNG se generaron correctamente
  3. Intenta abrir las imágenes manualmente para verificar que no están corruptas

================================================================================
CARACTERÍSTICAS DEL DOCUMENTO GENERADO
================================================================================

- Formato profesional con tablas y estilos
- Comparación lado a lado (Papyrus vs Servinform)
- Imágenes de alta calidad (zoom 150%)
- Diferencia crítica resaltada en ROJO
- 11 diferencias documentadas con evidencia visual
- Conclusiones y recomendaciones
- Aproximadamente 15-20 páginas

================================================================================
CONTACTO Y SOPORTE
================================================================================

Si encuentras problemas o necesitas ayuda:
1. Revisa esta guía completa
2. Verifica que todos los requisitos estén instalados
3. Lee los mensajes de error en la consola
4. Consulta con el equipo técnico si persisten los problemas

================================================================================
NOTAS ADICIONALES
================================================================================

- El script está configurado para trabajar con las rutas específicas de Box
- Si mueves los archivos, deberás actualizar las rutas en el script
- El proceso puede tardar 30-60 segundos dependiendo de tu equipo
- El documento Word generado puede ser editado y personalizado después
- Las imágenes se incrustan en el documento, no son enlaces externos

================================================================================
VERSIÓN DEL SCRIPT
================================================================================

Versión: 1.0
Fecha: 12/01/2026
Última actualización: 12/01/2026

================================================================================