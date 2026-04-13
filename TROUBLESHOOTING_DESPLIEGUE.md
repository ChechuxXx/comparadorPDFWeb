# 🔧 Troubleshooting - Error en Modo Lotes

## 📋 Error Reportado

**Mensaje**: `Unexpected token '<', "<!doctype "... is not valid JSON`

**Ubicación**: Al hacer clic en "Subir Archivos y Buscar Pares" en modo lotes

**Fecha**: 17/03/2026 - 14:13

---

## 🔍 Diagnóstico

Este error indica que el servidor está devolviendo HTML en lugar de JSON. Esto típicamente ocurre cuando:

1. **El endpoint no existe** (404 error)
2. **El servidor no ha terminado de desplegarse**
3. **Hay un error en el servidor que devuelve una página de error HTML**

---

## ✅ Verificaciones Realizadas

### 1. Backend - Endpoints Presentes ✅

El archivo `app.py` contiene todos los endpoints necesarios:

- ✅ `/upload-batch` - Subir múltiples PDFs
- ✅ `/find-pairs/<batch_id>` - Buscar pares automáticamente
- ✅ `/create-manual-pair/<batch_id>` - Crear par manual
- ✅ `/delete-pair/<batch_id>` - Eliminar par
- ✅ `/compare-pairs/<batch_id>` - Comparar pares seleccionados
- ✅ `/progress-batch/<batch_id>` - Obtener progreso
- ✅ `/get-pairs/<batch_id>` - Obtener pares

### 2. Frontend - Código Actualizado ✅

Los archivos del frontend están actualizados a v2.1:
- ✅ `templates/index.html` - Con pestañas y modo lotes
- ✅ `static/js/app.js` - Con métodos de gestión de lotes
- ✅ `static/css/style.css` - Con estilos para modo lotes

### 3. Git - Cambios Pusheados ✅

- ✅ Commit `870df17` pusheado a GitHub
- ✅ 3 archivos modificados (1,451 inserciones, 949 eliminaciones)

---

## 🚀 Posibles Causas y Soluciones

### Causa 1: Despliegue en Render No Completado ⏳

**Probabilidad**: ALTA

**Explicación**: Render necesita 2-3 minutos para:
1. Detectar cambios en GitHub
2. Hacer build de la aplicación
3. Desplegar la nueva versión

**Solución**:
1. Esperar 5 minutos desde el push (14:09)
2. Verificar el dashboard de Render para ver el estado del despliegue
3. Revisar los logs de build en Render

**Tiempo estimado**: El despliegue debería completarse alrededor de las 14:12-14:14

---

### Causa 2: Caché del Navegador 🔄

**Probabilidad**: MEDIA

**Explicación**: El navegador puede estar usando una versión cacheada del JavaScript que apunta a endpoints antiguos.

**Solución**:
1. Hacer hard refresh: `Ctrl + Shift + R` (Windows) o `Cmd + Shift + R` (Mac)
2. Abrir en modo incógnito
3. Limpiar caché del navegador completamente

---

### Causa 3: Error en el Servidor 🐛

**Probabilidad**: BAJA

**Explicación**: Puede haber un error en el código del servidor que impide que los endpoints funcionen.

**Solución**:
1. Revisar logs de Render para ver errores
2. Verificar que todas las dependencias estén instaladas
3. Verificar que el archivo `app.py` se haya desplegado correctamente

---

## 📝 Pasos de Verificación Inmediatos

### Paso 1: Verificar Estado del Despliegue en Render

1. Ir a: https://dashboard.render.com
2. Buscar el servicio "comparador-pdf-web"
3. Verificar que el estado sea "Live" (verde)
4. Verificar que el último despliegue sea el commit `870df17`

### Paso 2: Verificar Logs de Render

1. En el dashboard de Render, ir a "Logs"
2. Buscar errores relacionados con:
   - Importación de módulos
   - Errores de sintaxis
   - Problemas con dependencias

### Paso 3: Probar Endpoint Directamente

Abrir en el navegador o usar curl:

```bash
# Verificar que el servidor responde
curl https://comparador-pdf-web.onrender.com/

# Debería devolver el HTML de la página principal
```

### Paso 4: Verificar Versión del Frontend

1. Abrir: https://comparador-pdf-web.onrender.com
2. Hacer hard refresh (Ctrl + Shift + R)
3. Verificar que el título diga "Comparador PDF Web v2.1"
4. Verificar que aparezcan las pestañas

---

## 🔧 Soluciones Rápidas

### Solución 1: Esperar y Refrescar

```
1. Esperar 5 minutos desde las 14:09 (hasta 14:14)
2. Hacer Ctrl + Shift + R en el navegador
3. Intentar de nuevo
```

### Solución 2: Forzar Redespliegue en Render

Si después de 10 minutos sigue sin funcionar:

1. Ir al dashboard de Render
2. Hacer clic en "Manual Deploy" > "Deploy latest commit"
3. Esperar 2-3 minutos
4. Probar de nuevo

### Solución 3: Verificar Código del Frontend

Abrir las herramientas de desarrollador del navegador (F12):

1. Ir a la pestaña "Network"
2. Intentar subir archivos en modo lotes
3. Ver qué URL se está llamando
4. Ver la respuesta del servidor

**URL esperada**: `https://comparador-pdf-web.onrender.com/upload-batch`

**Respuesta esperada**: JSON con `batch_id`, `ref_files`, `comp_files`

**Si la URL es diferente**: Hay un problema con el JavaScript

**Si la respuesta es HTML**: El endpoint no existe o hay un error en el servidor

---

## 📊 Timeline del Despliegue

```
14:09 - Push a GitHub completado (commit 870df17)
14:09 - Render detecta cambios (automático)
14:10 - Render inicia build (1-2 minutos)
14:11 - Build completado
14:12 - Despliegue en progreso (30-60 segundos)
14:13 - Despliegue completado ✅ (esperado)
```

**Hora actual del error**: 14:13
**Conclusión**: El despliegue debería estar completándose AHORA

---

## ✅ Checklist de Verificación

- [ ] Han pasado al menos 5 minutos desde el push
- [ ] He hecho hard refresh en el navegador (Ctrl + Shift + R)
- [ ] El título de la página dice "v2.1"
- [ ] Aparecen las pestañas Individual/Lotes
- [ ] He verificado el estado en el dashboard de Render
- [ ] He revisado los logs de Render
- [ ] He probado en modo incógnito
- [ ] He limpiado la caché del navegador

---

## 🆘 Si Nada Funciona

### Opción 1: Rollback Temporal

Si necesitas que la aplicación funcione YA:

```bash
cd "C:\Users\3006978\Desktop\Papyrus VS ServInform Web"
git revert HEAD
git push origin main
```

Esto revertirá al estado anterior (v2.0) temporalmente.

### Opción 2: Verificar Archivos Localmente

Ejecutar la aplicación localmente para verificar que funciona:

```bash
cd "C:\Users\3006978\Desktop\Papyrus VS ServInform Web"
python app.py
```

Luego abrir: http://localhost:5000

Si funciona localmente pero no en Render, el problema es del despliegue.

---

## 📞 Próximos Pasos Recomendados

1. **ESPERAR 2 minutos más** (hasta 14:15)
2. **Hacer hard refresh** en el navegador
3. **Verificar dashboard de Render**
4. **Revisar logs de Render** si sigue sin funcionar
5. **Reportar hallazgos** para diagnóstico adicional

---

**Documento creado**: 17/03/2026 - 14:14
**Última actualización**: 17/03/2026 - 14:14
**Estado**: Esperando completar despliegue