#!groovy

String GIT_VERSION

node {
  def buildEnv
  def serverImage
  def serviceName = 'frontend-scaffolding'
  def imageTag

  def branchConfigMap = [
    master: [
      k8sServiceName: "${serviceName}-test",
    ]
  ]

  def branchConfig = branchConfigMap[env.BRANCH_NAME]
  if (branchConfig == null) {
    return
  }

  stage ('Checkout') {
    checkout scm
    GIT_VERSION = sh (
      script: 'git rev-parse HEAD',
      returnStdout: true
    ).trim()
  }

  def now = new Date()
  def nowString = now.format("yyyyMMddHHmmss", TimeZone.getTimeZone('UTC'))
  def uniqueId = "${GIT_VERSION}_${nowString}"
  
  withCredentials([string(credentialsId: 'registry-address', variable: 'registryAddress')]) {
    stage('docker build') {
      imageTag = "${serviceName}:${uniqueId}"
      docker.withRegistry("${registryAddress}") {
        serverImage = docker.build(imageTag)
        serverImage.push()
      }
    }
  }

  if (env.BRANCH_NAME == 'master') {
    withCredentials([string(credentialsId: 'registry-address2', variable: 'registryAddress2')]) {
      stage('deploy') {
        docker.image('lachlanevenson/k8s-kubectl').inside {
          withCredentials(bindings: [[$class: "FileBinding", credentialsId: 'kubeconfig', variable: 'KUBE_CONFIG']]) {
            def kubectl = "kubectl --kubeconfig=\$KUBE_CONFIG"
            sh """
              cat k8s.yml | \
              sed 's~IMAGE_TAG_HERE~${registryAddress2}/${imageTag}~g' | \
              sed 's~SERVICE_NAME_HERE~${branchConfig.k8sServiceName}~g' | \
              ${kubectl} apply -f -
            """
          }
        }
      }
    }
  }
}
