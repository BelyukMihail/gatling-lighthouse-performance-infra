FROM eclipse-temurin:8-jdk

# working directory for gatling
WORKDIR /opt

# gating version
ENV GATLING_VERSION 3.9.5

# create directory for gatling install
RUN mkdir -p gatling

# install gatling
RUN apt-get -y update && apt-get upgrade -y && \
    apt-get install -y curl bash unzip && \
    apt-get install -y rsync && \
    mkdir -p /tmp/downloads && \
    curl -o "/tmp/downloads/gatling-$GATLING_VERSION.zip" \
    https://repo1.maven.org/maven2/io/gatling/highcharts/gatling-charts-highcharts-bundle/$GATLING_VERSION/gatling-charts-highcharts-bundle-$GATLING_VERSION-bundle.zip && \
    mkdir -p /tmp/archive && cd /tmp/archive && \
    unzip /tmp/downloads/gatling-$GATLING_VERSION.zip && \
    rsync -av /tmp/archive/gatling-charts-highcharts-bundle-$GATLING_VERSION/* /opt/gatling/ && \
    rm -rf /tmp/*

COPY /conf/. /opt/gatling/conf
COPY /resources/. /opt/gatling/user-files/resources
COPY /simulations/. /opt/gatling/user-files/simulations
COPY /lib/. /opt/gatling/user-files/lib
COPY entrypoint.sh /

# change context to gatling directory
WORKDIR  /opt/gatling

# set directories below to be mountable from host
VOLUME ["/opt/gatling/conf", "/opt/gatling/results", "/opt/gatling/user-files"]

# set environment variables
ENV PATH /opt/gatling/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
ENV GATLING_HOME /opt/gatling

ENTRYPOINT ["bash","-x","/entrypoint.sh"]