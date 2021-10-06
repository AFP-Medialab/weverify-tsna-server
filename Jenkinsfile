pipeline {
    
    environment {
        version = ""
        registry = "registry-medialab.afp.com"
        registryCredential = "Medialab_Docker_Registry"
        dockerImage = ""
        gitRepository = "https://github.com/AFP-Medialab/weverify-tsna-server.git"
        buidImage =""
        
    }
    agent {
        docker {
            image 'node:14.18.0-slim'
        }
    }
    //tools {nodejs "Node"}
    stages {
        stage ('Build Node') {
             when {
                branch 'pre-master'
            }
            steps {
                version = "${env.BUILD_ID}-${GIT_COMMIT}"
                println "version ${version}"
                dockerImage = "registry-medialab.afp.com/tsna-server-csv:${version}"
                sh "npm ci --only=production"
                sh "npx next telemetry disable"
                sh "npm run build"
                sh "npm prune --production"
            }
        }
       stage('Building Docker Image') {
            when {
                branch 'pre-master'
            }
            steps {
                script {
                    buidImage = docker.build dockerImage
                }
            }
        }
        stage('Deploying Docker Image to Dockerhub') {
            when {
                branch 'pre-master'
            }
            steps {
                script {
                    docker.withRegistry('https://'+registry, registryCredential) {
                    buidImage.push()
                    buidImage.push('latest')
                    }
                }
            }
        }
        stage('Cleaning Up') {
            when {
                branch 'pre-master'
            }
            steps{
                sh "docker rmi --force $dockerImage"
            }
        }
    }
}