# Test Backend Endpoints

## Verificar que el backend esté funcionando

### 1. Verificar que el servidor backend esté corriendo en el puerto correcto
```bash
# El backend debería estar corriendo en puerto 5000
curl http://localhost:5000/api/admin/users
```

### 2. Verificar las variables de entorno
- Frontend: `VITE_API_URL=http://localhost:5000`
- Backend: Puerto debe ser 5000

### 3. Problemas comunes identificados:

#### Error JSON "Unexpected token '<'"
Esto indica que el servidor está devolviendo HTML en lugar de JSON, posibles causas:

1. **Puerto incorrecto**: El frontend está llamando al puerto 5173 en lugar de 5000
2. **CORS**: El backend no está configurado para aceptar requests del frontend
3. **Middleware de autenticación**: El token no se está validando correctamente
4. **Ruta incorrecta**: La URL del endpoint es incorrecta

#### Solución aplicada:
1. ✅ Mejorado el logging en el backend para debug
2. ✅ Mejorado el manejo de errores en el frontend
3. ✅ Creada página de colaboradores más organizada
4. ❌ **REVISAR**: Variable `VITE_API_URL` debe apuntar a puerto 5000

### 4. Pasos para verificar:

1. **Verificar que el backend esté corriendo:**
   ```bash
   cd backend
   npm start
   ```

2. **Verificar el puerto del backend en package.json o server.js**

3. **Actualizar la variable de entorno:**
   ```
   VITE_API_URL=http://localhost:5000
   ```

4. **Reiniciar el frontend:**
   ```bash
   npm run dev
   ```

### 5. URLs actualizadas:

- **Gestión de usuarios (original):** `/super_admin/usuarios`
- **Gestión de colaboradores (nueva):** `/super_admin/colaboradores`

La nueva página de colaboradores tiene:
- ✅ Mejor UI/UX
- ✅ Filtros por rol
- ✅ Búsqueda avanzada
- ✅ Manejo robusto de errores
- ✅ Acciones rápidas para cambio de roles
