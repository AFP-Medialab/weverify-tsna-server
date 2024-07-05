pipeline {
    
    environment {
        version = ""
        registry = "registry-medialab.afp.com"
        REGISTRY_CREDENTIALS = credentials("Medialab_Docker_Registry")
        sshCredentialKey = "afp-dis-medialab_key"
        SSH_CONNECTION_ENV = "tsna-server-pre-master-env"
        dockerImage = "registry-medialab.afp.com/tsna-server"
        
    }
    agent any
    stages {
        stage ('Prepare build') {
             when {
                branch 'pre-master'
            }
            steps {
                script {
                    slackSend channel: 'medialab_builds', message: "Start building project ${env.JOB_NAME} - ID: ${env.BUILD_ID}", tokenCredentialId: 'medialab_slack_token'
                    version = "${env.BUILD_ID}-${GIT_COMMIT}"
                    println "version ${version}"
                }
            }
        }
       stage('Building Docker Image') {
            when {
                branch 'pre-master'
            }
            steps {
                sh 'echo $REGISTRY_CREDENTIALS_PSW | docker login ${registry} -u $REGISTRY_CREDENTIALS_USR --password-stdin'
                sh "docker buildx create --use --name multi_platform_tsna --driver-opt network=host --buildkitd-flags --node '--allow-insecure-entitlement network.host'"
                sh """ 
                    docker buildx build -t ${dockerImage}:${version} -t ${dockerImage}:latest --push --network=host --platform=linux/amd64,linux/arm64 .
                """ 
                
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
        always {
                sh "docker buildx rm -f multi_platform_tsna"
        }
        success {
            slackSend channel: 'medialab_builds', message: "Success build & deploy project ${env.JOB_NAME} - ID: ${env.BUILD_ID}", tokenCredentialId: 'medialab_slack_token'
        }
        failure {
            slackSend channel: 'medialab_builds', message: "Error building project ${env.JOB_NAME} - ID: ${env.BUILD_ID}", tokenCredentialId: 'medialab_slack_token'
        }
    }
}