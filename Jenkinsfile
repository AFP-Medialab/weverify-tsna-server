pipeline {
    
    environment {
        gitVars = ""
        version = ""
        registry = "registry-medialab.afp.com"
        registryCredential = "Medialab_Docker_Registry"
        dockerImage = ""
        gitRepository = "https://github.com/AFP-Medialab/weverify-tsna-server.git"
        buidImage =""
        
    }
    agent any
    //tools {nodejs "Node"}
    stages {
        /*stage('Cloning our Git') {
            steps {
                script {
                gitVars = git branch: 'pre-master', credentialsId: 'Jenkings-Medialab', url: gitRepository
                println "GIT_COMMIT: '${gitVars.GIT_COMMIT}'"
                version = "${env.BUILD_ID}-${gitVars.GIT_COMMIT}"
                dockerImage = "registry-medialab.afp.com/tsna-server-csv:${version}"
                }
            }
        }*/
        stage ('Build Node') {
            steps {
                println "commit ${GIT_COMMIT}-${env.BUILD_ID}"
                //sh "npm ci --only=production"
                //sh "npx next telemetry disable"
                //sh "npm run build"
                //sh "npm prune --production"
            }
        }
       /* stage('Building Docker Image') {
            steps {
                script {
                    buidImage = docker.build dockerImage
                }
            }
        }
        stage('Deploying Docker Image to Dockerhub') {
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
            steps{
                sh "docker rmi --force $dockerImage"
            }
        }*/
    }
}