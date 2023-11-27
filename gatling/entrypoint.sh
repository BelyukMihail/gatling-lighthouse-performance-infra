#!/bin/bash

## If needed setting % of container current free memory usage (0.7 - 70%)
#FREE_MEM="$(free | grep Mem | awk '{print sprintf("%.0f", $4/1024*0.7)}')"
#JAVA_OPTS="-Xms${FREE_MEM}m -Xmx${FREE_MEM}m"
#echo "JVM Arguments: ${JAVA_OPTS}"
#export JAVA_OPTS

bash gatling.sh -sf /opt/gatling/user-files -rf ${WORKSPACE}/results -rm local -s ${SIMULATION}