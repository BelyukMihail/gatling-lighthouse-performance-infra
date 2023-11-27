#!/bin/sh

JENKINS_USER=${JENKINS_ADMIN_LOGIN:-admin};
JENKINS_PASSWORD=${JENKINS_ADMIN_PASSWORD:-admin};
JENKINS_HOST="localhost";
JENKINS_PORT="8080";
SERVER="http://$JENKINS_HOST:$JENKINS_PORT"
USER=$JENKINS_USER:$JENKINS_PASSWORD
JENKINS_API="http://$JENKINS_USER:$JENKINS_PASSWORD@$JENKINS_HOST:$JENKINS_PORT";
JENKINS_URL_CONFIG=${JENKINS_URL_CONFIG:-"http:\\/\\/127.0.0.1:8080\\/"};

bash -x /usr/local/bin/jenkins.sh &

echo "Waiting Jenkins to start"
sleep 8

# Proceed with other commands here
echo "Continue with other commands..."

echo "Downloading jenkins-cli.jar..."
curl -o /usr/share/jenkins/ref/jenkins-cli.jar $SERVER/jnlpJars/jenkins-cli.jar
sleep 3

java -jar /usr/share/jenkins/ref/jenkins-cli.jar -s $JENKINS_API version
while [ $? -ne 0 ]; do
  echo -n "."
  echo "TRYING AGAIN to download jenkins-cli.jar..."
  curl -o /usr/share/jenkins/ref/jenkins-cli.jar $SERVER/jnlpJars/jenkins-cli.jar
  sleep 3
  java -jar /usr/share/jenkins/ref/jenkins-cli.jar -s $JENKINS_API version
done
echo " "

echo "Move security.groovy to init.groovy.d/"
cp /usr/share/jenkins/ref/init.groovy.d/security.groovy /var/jenkins_home/init.groovy.d/security.groovy

echo "Trying to import jobs to jenkins"

for job in `ls -1 /jobs/*.xml`; do
  JOB_NAME=$(basename ${job} .xml)
  java -jar /usr/share/jenkins/ref/jenkins-cli.jar -s $JENKINS_API create-job $JOB_NAME < ${job}
done

wait $!