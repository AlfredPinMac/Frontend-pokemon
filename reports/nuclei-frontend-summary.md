# Reporte de Vulnerabilidades con Nuclei - Custom Dashboard (Frontend)

## 📋 Resumen del Escaneo
- **Objetivo analizado:** `http://127.0.0.1:5173` (Vue 3 + Vite / Nginx Dashboard)
- **Herramienta:** ProjectDiscovery Nuclei v3.11.1
- **Fecha:** Octubre 2026
- **Total de plantillas evaluadas:** 6,330+ (CVEs, exposures, misconfigurations, auth, APIs)
- **Total de hallazgos:** 11 alertas (Informational / Misconfiguration)

---

## 🔍 Hallazgos Principales

### 1. Recurso Externo sin Subresource Integrity (Missing SRI)
- **Severidad:** Baja / Info
- **Recurso afectado:** `https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap`
- **Detalle:** La etiqueta `<link>` que carga la fuente tipográfica externa en `index.html` carece del atributo `integrity` y `crossorigin`.
- **Impacto:** Si el CDN o la red intermedia fueran comprometidos (Man-in-the-Middle o CDN poisoning), se podría inyectar CSS malicioso sin que el navegador verifique el hash criptográfico del contenido.
- **Remediación:** Alojar las fuentes localmente en el frontend o agregar atributos `integrity` y `crossorigin="anonymous"`.

### 2. Cabeceras de Seguridad HTTP Faltantes
El servidor web que sirve la aplicación frontend carece de las directivas recomendadas por OWASP:
- `Content-Security-Policy (CSP)` (Crucial en SPAs para prevenir Cross-Site Scripting / XSS)
- `Strict-Transport-Security (HSTS)`
- `X-Frame-Options: SAMEORIGIN` / `DENY` (Protección contra Clickjacking)
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy`
- `Cross-Origin-Opener-Policy (COOP)`
- `Cross-Origin-Embedder-Policy (COEP)`
- `Cross-Origin-Resource-Policy (CORP)`
- `X-Permitted-Cross-Domain-Policies`

**Remediación:** En la configuración de Nginx (`nginx.conf`) que sirve el frontend en producción, incorporar bloques `add_header`:
```nginx
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; connect-src 'self' http://localhost:8000 http://localhost:5000;" always;
```

---

## 📁 Archivos Relacionados
- `reports/nuclei-frontend-results.jsonl`: Archivo JSON Lines con detalle técnico y solicitudes HTTP.
- `reports/nuclei-frontend-report.txt`: Registro de coincidencias detectadas.
