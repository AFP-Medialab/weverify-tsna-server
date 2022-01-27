def notifySlack(message, color = null) {
    slackSend(
            message: message,
            color: color,
            baseUrl: "https://azemagin.slack.com/services/hooks/jenkins-ci/",
            token: "LpFMbbHVqeE4EU7Mh4MimsyO",
            channel: "onepay-build-jenkins"
    )
}

pipeline {
    
    environment {
        version = ""
        registry = "registry-medialab.afp.com"
        registryCredential = "Medialab_Docker_Registry"
        sshCredentialKey = "afp-dis-medialab_key"
        SSH_CONNECTION_ENV = "tsna-server-pre-master-env"
        dockerImage = ""
        buidImage = ""
        
    }
    agent any
    //tools {nodejs "Node"}
    stages {
        stage ('Build Node') {
             when {
                branch 'pre-master'
            }
            steps {
                script {
                    slackSend channel: 'medialab_builds', message: "Start building project ${env.JOB_NAME} - ID: ${env.BUILD_ID}", tokenCredentialId: 'medialab_slack_token'
                    version = "${env.BUILD_ID}-${GIT_COMMIT}"
                    println "version ${version}"
                    dockerImage = "registry-medialab.afp.com/tsna-server:${version}"
                    /*sh "npm ci --only=production"
                    sh "npx next telemetry disable"
                    sh "npm run build"
                    sh "npm prune --production"*/
                }
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
        stage ('Deploy to server') {
            when {
                branch 'pre-master'
            }
            steps{
                sshagent (credentials: [sshCredentialKey]){
                    configFileProvider([configFile(fileId: SSH_CONNECTION_ENV, variable: 'SSH_ENV')]){
                        echo " =========== ^^^^^^^^^^^^ pull and restart tsna container "
                        sh "./deploy.sh ${env.SSH_ENV}"
                    }
                }
            }
        }
    }
    post {
        success {
            slackSend channel: 'medialab_builds', message: "Success build & deploy project ${env.JOB_NAME} - ID: ${env.BUILD_ID}", tokenCredentialId: 'medialab_slack_token'
        }
        failure {
            slackSend channel: 'medialab_builds', message: "Error building project ${env.JOB_NAME} - ID: ${env.BUILD_ID}", tokenCredentialId: 'medialab_slack_token'
        }
    }
}