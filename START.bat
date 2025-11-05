@echo off
echo ===============================================
echo      TODO APP - Script de Inicio
echo ===============================================
echo.

REM Verificar si MongoDB está corriendo
echo [1/4] Verificando MongoDB...
sc query MongoDB >nul 2>&1
if %errorlevel% equ 0 (
    echo ✓ MongoDB está corriendo
) else (
    echo.
    echo ⚠ MongoDB no está corriendo o no está instalado
    echo.
    echo Por favor, instala MongoDB primero:
    echo 1. Ve a: https://www.mongodb.com/try/download/community
    echo 2. Descarga e instala MongoDB Community Server
    echo 3. Asegúrate de instalarlo como servicio
    echo.
    echo O usa Docker:
    echo docker run -d -p 27017:27017 --name mongodb mongo:7-alpine
    echo.
    pause
    exit /b 1
)

echo.
echo [2/4] Verificando dependencias del backend...
if not exist "backend\node_modules" (
    echo Instalando dependencias del backend...
    cd backend
    call npm install
    cd ..
) else (
    echo ✓ Dependencias del backend ya instaladas
)

echo.
echo [3/4] Verificando dependencias del frontend...
if not exist "node_modules" (
    echo Instalando dependencias del frontend...
    call pnpm install
) else (
    echo ✓ Dependencias del frontend ya instaladas
)

echo.
echo [4/4] Iniciando servicios...
echo.
echo ===============================================
echo  Backend corriendo en: http://localhost:3000
echo  Frontend corriendo en: http://localhost:5173
echo ===============================================
echo.
echo Presiona Ctrl+C para detener los servicios
echo.

REM Iniciar backend en una nueva ventana
start "Todo App - Backend" cmd /k "cd backend && npm run dev"

REM Esperar 3 segundos para que el backend inicie
timeout /t 3 /nobreak >nul

REM Iniciar frontend
start "Todo App - Frontend" cmd /k "pnpm dev"

echo.
echo ✓ Servicios iniciados
echo.
echo Para acceder a la aplicación, abre tu navegador en:
echo http://localhost:5173
echo.
pause

