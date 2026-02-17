# 📝 Ejemplos de Datos para Pruebas

Este archivo contiene ejemplos de datos JSON que puedes usar para probar la API.

---

## 🛍️ Ejemplos de Productos

### Producto 1: Laptop Gaming
```json
{
  "title": "Laptop Gaming ASUS ROG",
  "description": "Laptop de alto rendimiento con procesador Intel i9 y RTX 4090",
  "code": "LAP001",
  "price": 2500,
  "stock": 5,
  "category": "Electrónica",
  "thumbnails": ["asus-rog-1.jpg", "asus-rog-2.jpg"]
}
```

### Producto 2: Mouse Inalámbrico
```json
{
  "title": "Mouse Logitech MX Master 3",
  "description": "Mouse ergonómico inalámbrico de alta precisión",
  "code": "MOU001",
  "price": 99.99,
  "stock": 25,
  "category": "Accesorios",
  "thumbnails": ["logitech-mx-1.jpg"]
}
```

### Producto 3: Teclado Mecánico
```json
{
  "title": "Teclado Mecánico Keychron K2",
  "description": "Teclado mecánico compacto con switches Gateron Brown",
  "code": "TEC001",
  "price": 89,
  "status": true,
  "stock": 15,
  "category": "Accesorios",
  "thumbnails": ["keychron-k2-1.jpg", "keychron-k2-2.jpg", "keychron-k2-3.jpg"]
}
```

### Producto 4: Monitor 4K
```json
{
  "title": "Monitor LG UltraWide 34",
  "description": "Monitor curvo 34 pulgadas, resolución 3440x1440, 144Hz",
  "code": "MON001",
  "price": 799,
  "stock": 8,
  "category": "Electrónica",
  "thumbnails": ["lg-ultrawide-1.jpg"]
}
```

### Producto 5: Auriculares Bluetooth
```json
{
  "title": "Auriculares Sony WH-1000XM5",
  "description": "Auriculares con cancelación de ruido activa",
  "code": "AUR001",
  "price": 349,
  "stock": 20,
  "category": "Audio",
  "thumbnails": ["sony-wh-1000xm5.jpg"]
}
```

### Producto 6: Webcam HD
```json
{
  "title": "Webcam Logitech C920",
  "description": "Webcam Full HD 1080p con micrófono estéreo",
  "code": "WEB001",
  "price": 79,
  "stock": 30,
  "category": "Accesorios"
}
```

---

## 🔄 Ejemplos de Actualizaciones

### Actualizar precio y stock
```json
{
  "price": 2299,
  "stock": 3
}
```

### Actualizar solo el precio
```json
{
  "price": 1999
}
```

### Actualizar estado a no disponible
```json
{
  "status": false
}
```

### Actualizar múltiples campos
```json
{
  "title": "Laptop Gaming ASUS ROG Strix",
  "description": "Laptop de alto rendimiento actualizada con mejor refrigeración",
  "price": 2399,
  "stock": 7,
  "thumbnails": ["asus-rog-new-1.jpg", "asus-rog-new-2.jpg", "asus-rog-new-3.jpg"]
}
```

---

## 🧪 Flujo de Prueba Completo

### Paso 1: Crear varios productos
```bash
# Producto 1
curl -X POST http://localhost:8080/api/products/ \
  -H "Content-Type: application/json" \
  -d '{"title":"Laptop Gaming ASUS ROG","description":"Laptop de alto rendimiento","code":"LAP001","price":2500,"stock":5,"category":"Electrónica","thumbnails":["img1.jpg"]}'

# Producto 2
curl -X POST http://localhost:8080/api/products/ \
  -H "Content-Type: application/json" \
  -d '{"title":"Mouse Logitech MX Master 3","description":"Mouse ergonómico","code":"MOU001","price":99.99,"stock":25,"category":"Accesorios"}'

# Producto 3
curl -X POST http://localhost:8080/api/products/ \
  -H "Content-Type: application/json" \
  -d '{"title":"Teclado Mecánico Keychron K2","description":"Teclado mecánico compacto","code":"TEC001","price":89,"stock":15,"category":"Accesorios"}'
```

### Paso 2: Listar todos los productos
```bash
curl http://localhost:8080/api/products/
```

### Paso 3: Crear un carrito
```bash
curl -X POST http://localhost:8080/api/carts/
```

### Paso 4: Agregar productos al carrito
```bash
# Agregar laptop (ID 1)
curl -X POST http://localhost:8080/api/carts/1/product/1

# Agregar laptop otra vez (incrementa cantidad)
curl -X POST http://localhost:8080/api/carts/1/product/1

# Agregar mouse (ID 2)
curl -X POST http://localhost:8080/api/carts/1/product/2

# Agregar teclado (ID 3)
curl -X POST http://localhost:8080/api/carts/1/product/3
```

### Paso 5: Ver el carrito completo
```bash
curl http://localhost:8080/api/carts/1
```

### Resultado esperado del carrito:
```json
{
  "status": "success",
  "payload": {
    "id": 1,
    "products": [
      {
        "product": 1,
        "quantity": 2
      },
      {
        "product": 2,
        "quantity": 1
      },
      {
        "product": 3,
        "quantity": 1
      }
    ]
  }
}
```

### Paso 6: Actualizar un producto
```bash
curl -X PUT http://localhost:8080/api/products/1 \
  -H "Content-Type: application/json" \
  -d '{"price":2299,"stock":3}'
```

### Paso 7: Eliminar un producto
```bash
curl -X DELETE http://localhost:8080/api/products/2
```

---

## ⚠️ Casos de Error a Probar

### 1. Crear producto sin campos obligatorios
```bash
curl -X POST http://localhost:8080/api/products/ \
  -H "Content-Type: application/json" \
  -d '{"title":"Producto Incompleto"}'
```

**Respuesta esperada:** Error indicando campos faltantes

### 2. Crear producto con código duplicado
```bash
# Primero crear un producto
curl -X POST http://localhost:8080/api/products/ \
  -H "Content-Type: application/json" \
  -d '{"title":"Producto 1","description":"Test","code":"DUP001","price":100,"stock":10,"category":"Test"}'

# Intentar crear otro con el mismo código
curl -X POST http://localhost:8080/api/products/ \
  -H "Content-Type: application/json" \
  -d '{"title":"Producto 2","description":"Test","code":"DUP001","price":200,"stock":5,"category":"Test"}'
```

**Respuesta esperada:** Error indicando código duplicado

### 3. Buscar producto inexistente
```bash
curl http://localhost:8080/api/products/9999
```

**Respuesta esperada:** Error 404

### 4. Agregar producto a carrito inexistente
```bash
curl -X POST http://localhost:8080/api/carts/9999/product/1
```

**Respuesta esperada:** Error indicando carrito no encontrado

---

## 📊 Validaciones Implementadas

✅ Todos los campos obligatorios deben estar presentes
✅ El código del producto debe ser único
✅ No se puede modificar el ID de un producto
✅ Si un producto ya existe en el carrito, se incrementa su cantidad
✅ Los IDs se autogenera de forma incremental
✅ El campo `status` tiene valor por defecto `true`
✅ El campo `thumbnails` tiene valor por defecto array vacío

---

**Tip:** Puedes copiar estos comandos y ejemplos directamente para probar tu API 🚀
