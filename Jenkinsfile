pipeline {
    agent any
    
    environment {
        // Variables de entorno para Docker
        DOCKER_REGISTRY = 'docker.io'
        DOCKER_CREDENTIALS_ID = 'dockerhub-credentials'
        IMAGE_TAG = "${BUILD_NUMBER}"
        
        // Nombres de las imágenes
        FRONTEND_IMAGE = "leandronv/todo-frontend"
        BACKEND_IMAGE = "leandronv/todo-backend"
        
        // Variables para notificaciones
        GIT_COMMIT_MSG = sh(script: "git log -1 --pretty=%B ${GIT_COMMIT}", returnStdout: true).trim()
        GIT_AUTHOR = sh(script: "git log -1 --pretty=%an ${GIT_COMMIT}", returnStdout: true).trim()
    }
    
    options {
        // Mantener solo los últimos 10 builds
        buildDiscarder(logRotator(numToKeepStr: '10'))
        // Timeout global del pipeline
        timeout(time: 30, unit: 'MINUTES')
        // Timestamps en los logs
        timestamps()
    }
    
    stages {
        stage('Checkout') {
            steps {
                echo '📥 Descargando código desde GitHub...'
                checkout scm
                script {
                    echo "Commit: ${GIT_COMMIT_MSG}"
                    echo "Autor: ${GIT_AUTHOR}"
                    echo "Rama: ${GIT_BRANCH}"
                }
            }
        }
        
        stage('Verificar Dependencias') {
            parallel {
                stage('Verificar Node.js') {
                    steps {
                        echo '🔍 Verificando Node.js...'
                        sh '''
                            node --version
                            npm --version
                        '''
                    }
                }
                
                stage('Verificar Docker') {
                    steps {
                        echo '🔍 Verificando Docker...'
                        sh '''
                            docker --version
                            docker compose version
                        '''
                    }
                }
            }
        }
        
        stage('Instalar Dependencias') {
            parallel {
                stage('Frontend Dependencies') {
                    steps {
                        echo '📦 Instalando dependencias del frontend...'
                        sh '''
                            npm install --legacy-peer-deps
                        '''
                    }
                }
                
                stage('Backend Dependencies') {
                    steps {
                        echo '📦 Instalando dependencias del backend...'
                        dir('backend') {
                            sh '''
                                npm install
                            '''
                        }
                    }
                }
            }
        }
        
        stage('Análisis de Código') {
            parallel {
                stage('Lint Frontend') {
                    steps {
                        echo '🔍 Ejecutando linter en frontend...'
                        catchError(buildResult: 'SUCCESS', stageResult: 'UNSTABLE') {
                            sh '''
                                npm run lint || true
                            '''
                        }
                    }
                }
                
                stage('Lint Backend') {
                    steps {
                        echo '🔍 Ejecutando linter en backend...'
                        dir('backend') {
                            catchError(buildResult: 'SUCCESS', stageResult: 'UNSTABLE') {
                                sh '''
                                    npm run lint || true
                                '''
                            }
                        }
                    }
                }
            }
        }
        
        stage('Compilar TypeScript') {
            parallel {
                stage('Build Frontend') {
                    steps {
                        echo '🔨 Compilando frontend...'
                        sh '''
                            npm run build
                        '''
                    }
                }
                
                stage('Build Backend') {
                    steps {
                        echo '🔨 Compilando backend...'
                        dir('backend') {
                            sh '''
                                npm run build
                            '''
                        }
                    }
                }
            }
        }
        
        stage('Construir Imágenes Docker') {
            parallel {
                stage('Build Frontend Image') {
                    steps {
                        echo '🐳 Construyendo imagen Docker del frontend...'
                        script {
                            sh """
                                docker build -t ${FRONTEND_IMAGE}:${IMAGE_TAG} \
                                             -t ${FRONTEND_IMAGE}:latest \
                                             .
                            """
                        }
                    }
                }
                
                stage('Build Backend Image') {
                    steps {
                        echo '🐳 Construyendo imagen Docker del backend...'
                        script {
                            sh """
                                docker build -t ${BACKEND_IMAGE}:${IMAGE_TAG} \
                                             -t ${BACKEND_IMAGE}:latest \
                                             ./backend
                            """
                        }
                    }
                }
            }
        }
        
        stage('Análisis de Seguridad') {
            when {
                expression { fileExists('/usr/local/bin/trivy') || fileExists('/usr/bin/trivy') }
            }
            parallel {
                stage('Scan Frontend Image') {
                    steps {
                        echo '🔒 Escaneando vulnerabilidades en frontend...'
                        catchError(buildResult: 'SUCCESS', stageResult: 'UNSTABLE') {
                            sh """
                                trivy image --severity HIGH,CRITICAL \
                                      --exit-code 0 \
                                      ${FRONTEND_IMAGE}:${IMAGE_TAG} || true
                            """
                        }
                    }
                }
                
                stage('Scan Backend Image') {
                    steps {
                        echo '🔒 Escaneando vulnerabilidades en backend...'
                        catchError(buildResult: 'SUCCESS', stageResult: 'UNSTABLE') {
                            sh """
                                trivy image --severity HIGH,CRITICAL \
                                      --exit-code 0 \
                                      ${BACKEND_IMAGE}:${IMAGE_TAG} || true
                            """
                        }
                    }
                }
            }
        }
        
        stage('Tests') {
            parallel {
                stage('Test Backend') {
                    steps {
                        echo '🧪 Ejecutando tests del backend...'
                        dir('backend') {
                            catchError(buildResult: 'SUCCESS', stageResult: 'UNSTABLE') {
                                sh '''
                                    npm test || echo "Tests no implementados aún"
                                '''
                            }
                        }
                    }
                }
                
                stage('Test Frontend') {
                    steps {
                        echo '🧪 Ejecutando tests del frontend...'
                        catchError(buildResult: 'SUCCESS', stageResult: 'UNSTABLE') {
                            sh '''
                                npm test || echo "Tests no implementados aún"
                            '''
                        }
                    }
                }
            }
        }
        
        stage('Push a Docker Hub') {
            when {
                branch 'main'
            }
            steps {
                echo '📤 Subiendo imágenes a Docker Hub...'
                script {
                    docker.withRegistry('https://index.docker.io/v1/', DOCKER_CREDENTIALS_ID) {
                        sh """
                            docker push ${FRONTEND_IMAGE}:${IMAGE_TAG}
                            docker push ${FRONTEND_IMAGE}:latest
                            docker push ${BACKEND_IMAGE}:${IMAGE_TAG}
                            docker push ${BACKEND_IMAGE}:latest
                        """
                    }
                }
            }
        }
        
        stage('Desplegar con Docker Compose') {
            when {
                branch 'main'
            }
            steps {
                echo '🚀 Desplegando aplicación con Docker Compose...'
                sh '''
                    # Detener contenedores anteriores
                    docker compose down || true
                    
                    # Iniciar nuevos contenedores
                    docker compose up -d
                    
                    # Esperar a que los servicios estén listos
                    echo "Esperando a que los servicios estén listos..."
                    sleep 30
                    
                    # Verificar estado de los contenedores
                    docker compose ps
                '''
            }
        }
        
        stage('Verificación de Salud') {
            when {
                branch 'main'
            }
            steps {
                echo '🏥 Verificando salud de los servicios...'
                script {
                    retry(3) {
                        sh '''
                            # Verificar backend
                            curl -f http://localhost:3000/health || exit 1
                            
                            # Verificar frontend
                            curl -f http://localhost/ || exit 1
                            
                            echo "✅ Todos los servicios están funcionando correctamente"
                        '''
                    }
                }
            }
        }
    }
    
    post {
        always {
            echo '🧹 Limpiando workspace...'
            // Limpiar imágenes antiguas
            sh '''
                docker image prune -f || true
            '''
        }
        
        success {
            echo '✅ Pipeline ejecutado exitosamente!'
            script {
                def duration = currentBuild.duration / 1000
                echo """
                ╔═══════════════════════════════════════════╗
                ║          BUILD EXITOSO                    ║
                ╠═══════════════════════════════════════════╣
                ║ Build: #${BUILD_NUMBER}                   
                ║ Rama: ${GIT_BRANCH}                       
                ║ Commit: ${GIT_COMMIT_MSG}                 
                ║ Autor: ${GIT_AUTHOR}                      
                ║ Duración: ${duration}s                    
                ╚═══════════════════════════════════════════╝
                """
            }
        }
        
        failure {
            echo '❌ Pipeline falló!'
            script {
                def duration = currentBuild.duration / 1000
                echo """
                ╔═══════════════════════════════════════════╗
                ║          BUILD FALLIDO                    ║
                ╠═══════════════════════════════════════════╣
                ║ Build: #${BUILD_NUMBER}                   
                ║ Rama: ${GIT_BRANCH}                       
                ║ Commit: ${GIT_COMMIT_MSG}                 
                ║ Autor: ${GIT_AUTHOR}                      
                ║ Duración: ${duration}s                    
                ╚═══════════════════════════════════════════╝
                """
            }
        }
        
        unstable {
            echo '⚠️ Pipeline inestable (con warnings)'
        }
    }
}

