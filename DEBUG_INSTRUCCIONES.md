# 🔍 Instrucciones para Debug - Error Persistente

## 📋 Problema

El endpoint `/upload-batch` devuelve HTML en lugar de JSON, incluso después de un redespliegue limpio.

## 🎯 Necesito Ver los Logs del Servidor

Para diagnosticar el problema, necesito que copies los logs de Render:

### Paso 1: Ir a los Logs

1. Ve a: https://dashboard.render.com
2. Selecciona tu servicio "comparador-pdf-web"
3. Haz clic en **"Logs"** en el menú lateral

### Paso 2: Buscar Errores

Busca en los logs líneas que contengan:

- `ERROR`
- `Exception`
- `Traceback`
- `ImportError`
- `ModuleNotFoundError`
- `SyntaxError`
- `Failed to`

### Paso 3: Copiar los Logs Relevantes

Copia las últimas **30-50 líneas** de los logs, especialmente:

1. **Después de** `==> Deploying...`
2. **Las líneas que muestran** el inicio de gunicorn
3. **Cualquier error** que aparezca

## 🔍 Qué Buscar Específicamente

### Logs Normales (Si Todo Funciona)

Deberías ver algo como:

```
==> Deploying...
Starting gunicorn 21.2.0
Listening at: http://0.0.0.0:10000 (1)
Using worker: sync
Booting worker with pid: 23
```

### Logs con Error (Lo Que Probablemente Estás Viendo)

Podrías ver algo como:

```
Traceback (most recent call last):
  File "/opt/render/project/src/app.py", line X, in <module>
    ...
ImportError: cannot import name 'X' from 'Y'
```

O:

```
ModuleNotFoundError: No module named 'X'
```

O:

```
SyntaxError: invalid syntax
```

## 🧪 Prueba Alternativa

Mientras tanto, prueba acceder directamente al endpoint con curl:

```bash
curl -X POST https://comparador-pdf-web.onrender.com/upload-batch \
  -H "Content-Type: multipart/form-data" \
  -F "pdfs_reference=@test.pdf" \
  -F "pdfs_compare=@test.pdf"
```

Si devuelve HTML en lugar de JSON, confirma que el endpoint no está funcionando.

## 📝 Información Adicional Útil

También sería útil saber:

1. **¿El modo individual funciona?** (subir 2 PDFs y comparar)
2. **¿Qué ves en la consola del navegador?** (F12 > Console)
3. **¿Qué ves en la pestaña Network?** (F12 > Network > intenta subir archivos > mira la respuesta del servidor)

## 🎯 Próximos Pasos

Una vez que tengas los logs, podré:

1. Identificar el error exacto
2. Proporcionar una solución específica
3. Actualizar el código si es necesario
4. Redesplegar con la corrección

---

**Por favor, comparte los logs del servidor para poder ayudarte mejor.** 🔍