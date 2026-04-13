#!/usr/bin/env python3
"""
Script para verificar que todos los endpoints estén definidos en app.py
"""

import re

# Leer app.py
with open('app.py', 'r', encoding='utf-8') as f:
    content = f.read()

# Buscar todos los @app.route
routes = re.findall(r"@app\.route\('([^']+)'", content)

print("=" * 60)
print("ENDPOINTS ENCONTRADOS EN app.py:")
print("=" * 60)

for route in sorted(set(routes)):
    print(f"  {route}")

print("=" * 60)
print(f"Total: {len(set(routes))} endpoints únicos")
print("=" * 60)

# Verificar endpoints críticos
critical_endpoints = [
    '/upload-batch',
    '/find-pairs/<batch_id>',
    '/create-manual-pair/<batch_id>',
    '/delete-pair/<batch_id>',
    '/compare-pairs/<batch_id>',
    '/get-pairs/<batch_id>',
    '/progress-batch/<batch_id>'
]

print("\nVERIFICACIÓN DE ENDPOINTS CRÍTICOS:")
print("=" * 60)

for endpoint in critical_endpoints:
    # Normalizar para comparación
    endpoint_pattern = endpoint.replace('<batch_id>', '[^\']+')
    found = any(re.match(endpoint_pattern, route) for route in routes)
    status = "✅ ENCONTRADO" if found else "❌ FALTA"
    print(f"{status}: {endpoint}")

print("=" * 60)