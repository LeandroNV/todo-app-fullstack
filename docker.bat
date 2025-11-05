@echo off
chcp 65001 >nul
echo ===============================================
echo      TODO APP - Docker Manager
echo ===============================================
echo.

if "%1"=="" goto menu
if "%1"=="up" goto up
if "%1"=="down" goto down
if "%1"=="build" goto build
if "%1"=="logs" goto logs
if "%1"=="ps" goto ps
if "%1"=="restart" goto restart
goto help

:menu
echo Selecciona una opción:
echo.
echo 1. Iniciar aplicación (docker compose up)
echo 2. Detener aplicación (docker compose down)
echo 3. Reconstruir imágenes (docker compose build)
echo 4. Ver logs
echo 5. Ver estado de contenedores
echo 6. Reiniciar servicios
echo 7. Limpiar todo (contenedores + volúmenes)
echo 8. Ayuda
echo 9. Salir
echo.
set /p option="Opción: "

if "%option%"=="1" goto up
if "%option%"=="2" goto down
if "%option%"=="3" goto build
if "%option%"=="4" goto logs
if "%option%"=="5" goto ps
if "%option%"=="6" goto restart
if "%option%"=="7" goto clean
if "%option%"=="8" goto help
if "%option%"=="9" goto end
goto menu

:up
echo.
echo Iniciando aplicación...
echo.
docker compose up -d
if %errorlevel% equ 0 (
    echo.
    echo ✓ Aplicación iniciada exitosamente
    echo.
    echo Accede a:
    echo   Frontend: http://localhost
    echo   Backend:  http://localhost:3000
    echo   Health:   http://localhost:3000/health
    echo.
    echo Para ver logs: docker compose logs -f
) else (
    echo.
    echo ✗ Error al iniciar la aplicación
    echo Revisa los logs con: docker compose logs
)
goto end

:down
echo.
echo Deteniendo aplicación...
docker compose down
if %errorlevel% equ 0 (
    echo ✓ Aplicación detenida
) else (
    echo ✗ Error al detener
)
goto end

:build
echo.
echo Reconstruyendo imágenes...
docker compose build --no-cache
if %errorlevel% equ 0 (
    echo ✓ Imágenes reconstruidas
) else (
    echo ✗ Error al construir
)
goto end

:logs
echo.
echo Selecciona qué logs ver:
echo 1. Todos
echo 2. Frontend
echo 3. Backend
echo 4. MongoDB
echo.
set /p log_option="Opción: "

if "%log_option%"=="1" docker compose logs -f
if "%log_option%"=="2" docker compose logs -f frontend
if "%log_option%"=="3" docker compose logs -f backend
if "%log_option%"=="4" docker compose logs -f mongodb
goto end

:ps
echo.
echo Estado de contenedores:
echo.
docker compose ps
goto end

:restart
echo.
echo Selecciona qué reiniciar:
echo 1. Todo
echo 2. Frontend
echo 3. Backend
echo 4. MongoDB
echo.
set /p restart_option="Opción: "

if "%restart_option%"=="1" docker compose restart
if "%restart_option%"=="2" docker compose restart frontend
if "%restart_option%"=="3" docker compose restart backend
if "%restart_option%"=="4" docker compose restart mongodb
goto end

:clean
echo.
echo ⚠ ADVERTENCIA: Esto eliminará todos los contenedores y DATOS
set /p confirm="¿Estás seguro? (S/N): "
if /i "%confirm%"=="S" (
    docker compose down -v
    echo ✓ Todo limpiado
) else (
    echo Operación cancelada
)
goto end

:help
echo.
echo Uso: docker.bat [comando]
echo.
echo Comandos:
echo   up       - Iniciar aplicación
echo   down     - Detener aplicación
echo   build    - Reconstruir imágenes
echo   logs     - Ver logs
echo   ps       - Ver estado
echo   restart  - Reiniciar servicios
echo.
echo Sin argumentos se muestra el menú interactivo
goto end

:end
echo.
pause

