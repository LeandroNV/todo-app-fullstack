@echo off
chcp 65001 >nul
echo ===============================================
echo   TODO APP - Verificación del Proyecto
echo ===============================================
echo.

set ERROR_COUNT=0

echo [Verificando estructura del proyecto...]
echo.

REM Verificar Frontend
echo ✓ Verificando Frontend...
if not exist "src\App.vue" (
    echo   ❌ Falta: src\App.vue
    set /a ERROR_COUNT+=1
) else (
    echo   ✓ src\App.vue
)

if not exist "src\components\TodoForm.vue" (
    echo   ❌ Falta: src\components\TodoForm.vue
    set /a ERROR_COUNT+=1
) else (
    echo   ✓ src\components\TodoForm.vue
)

if not exist "src\components\TodoItem.vue" (
    echo   ❌ Falta: src\components\TodoItem.vue
    set /a ERROR_COUNT+=1
) else (
    echo   ✓ src\components\TodoItem.vue
)

if not exist "src\components\TodoFilters.vue" (
    echo   ❌ Falta: src\components\TodoFilters.vue
    set /a ERROR_COUNT+=1
) else (
    echo   ✓ src\components\TodoFilters.vue
)

if not exist "src\components\TodoStats.vue" (
    echo   ❌ Falta: src\components\TodoStats.vue
    set /a ERROR_COUNT+=1
) else (
    echo   ✓ src\components\TodoStats.vue
)

if not exist "src\services\api.ts" (
    echo   ❌ Falta: src\services\api.ts
    set /a ERROR_COUNT+=1
) else (
    echo   ✓ src\services\api.ts
)

if not exist "src\stores\todoStore.ts" (
    echo   ❌ Falta: src\stores\todoStore.ts
    set /a ERROR_COUNT+=1
) else (
    echo   ✓ src\stores\todoStore.ts
)

echo.
echo ✓ Verificando Backend...

if not exist "backend\src\server.ts" (
    echo   ❌ Falta: backend\src\server.ts
    set /a ERROR_COUNT+=1
) else (
    echo   ✓ backend\src\server.ts
)

if not exist "backend\src\models\Todo.ts" (
    echo   ❌ Falta: backend\src\models\Todo.ts
    set /a ERROR_COUNT+=1
) else (
    echo   ✓ backend\src\models\Todo.ts
)

if not exist "backend\src\controllers\todoController.ts" (
    echo   ❌ Falta: backend\src\controllers\todoController.ts
    set /a ERROR_COUNT+=1
) else (
    echo   ✓ backend\src\controllers\todoController.ts
)

if not exist "backend\src\routes\todoRoutes.ts" (
    echo   ❌ Falta: backend\src\routes\todoRoutes.ts
    set /a ERROR_COUNT+=1
) else (
    echo   ✓ backend\src\routes\todoRoutes.ts
)

if not exist "backend\src\config\database.ts" (
    echo   ❌ Falta: backend\src\config\database.ts
    set /a ERROR_COUNT+=1
) else (
    echo   ✓ backend\src\config\database.ts
)

echo.
echo ✓ Verificando Dependencias...

if not exist "node_modules" (
    echo   ⚠ Falta: node_modules (frontend)
    echo   Ejecuta: pnpm install
    set /a ERROR_COUNT+=1
) else (
    echo   ✓ node_modules (frontend)
)

if not exist "backend\node_modules" (
    echo   ⚠ Falta: backend\node_modules
    echo   Ejecuta: cd backend ^&^& npm install
    set /a ERROR_COUNT+=1
) else (
    echo   ✓ backend\node_modules
)

echo.
echo ✓ Verificando Configuración...

if not exist "backend\.env" (
    echo   ⚠ Falta: backend\.env
    echo   Se creará automáticamente con valores por defecto
) else (
    echo   ✓ backend\.env
)

echo.
echo ✓ Verificando Documentación...

if exist "README.md" echo   ✓ README.md
if exist "SETUP.md" echo   ✓ SETUP.md
if exist "QUICKSTART.md" echo   ✓ QUICKSTART.md
if exist "PROYECTO_COMPLETADO.md" echo   ✓ PROYECTO_COMPLETADO.md
if exist "RESUMEN.md" echo   ✓ RESUMEN.md
if exist "backend\README.md" echo   ✓ backend\README.md

echo.
echo ===============================================
echo   Resumen de Verificación
echo ===============================================
echo.

if %ERROR_COUNT% equ 0 (
    echo ✓ ¡Todo está correcto!
    echo ✓ El proyecto está listo para ejecutarse
    echo.
    echo Siguiente paso:
    echo 1. Instala MongoDB si no lo tienes
    echo 2. Ejecuta START.bat o sigue SETUP.md
) else (
    echo ⚠ Se encontraron %ERROR_COUNT% problemas
    echo.
    echo Por favor, revisa los errores anteriores
)

echo.
echo ===============================================
echo   Información del Sistema
echo ===============================================
echo.

echo Node.js:
node --version 2>nul || echo   ❌ Node.js no está instalado

echo.
echo npm:
npm --version 2>nul || echo   ❌ npm no está disponible

echo.
echo pnpm:
pnpm --version 2>nul || echo   ⚠ pnpm no está instalado (opcional)

echo.
echo MongoDB:
mongod --version 2>nul || echo   ⚠ MongoDB no está instalado o no está en PATH

echo.
echo Docker:
docker --version 2>nul || echo   ⚠ Docker no está instalado (opcional)

echo.
echo ===============================================
pause

