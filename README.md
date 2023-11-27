<!--- 
Copyright © 2023 Yevhen Levchenko ylevchenko@solvd.com
-->

# Performance testing framework
This framework could be used for backend load testing with Gatling load-tool and Prometheus - Grafana open-source solutions for host resources monitoring.

## Getting Started

Framework consists of next services:
- **Grafana**: data visualization & monitoring
- **Influxdb**: time series DB platform for metrics & events (Time Series Data)
- **Jenkins**: continuous integration server for tests execution
- **Gatling**: tool for backend load testing
- **Prometheus**: time series DB platform for storing Host (Docker) metrics. Depends on:
- **Node-Exporter**: tool exposes a wide variety of hardware- and kernel-related metrics
- **cAdvisor**: analyzes and exposes resource usage and performance data from running containers
- **Redis**: in-memory data store for cAdvisor

## Prerequisites

To run framework install docker: https://docs.docker.com/engine/installation/

You should be able to run ```docker run hello-world``` with no errors.

## Installing

1. Clone this repository
   ```git clone https://github.com/yevle/gatling-performance-infra.git```
2. open gatling-performance-infra dir

3. ```docker-compose up --build -d```

All containers should be up and running

### Services endpoints
- **jenkins** localhost:8181
- **grafana** localhost:8857
- **influxdb** localhost:8653
- **prometheus** localhost:9091
- **cadvisor** localhost:8081

## Jenkins

Login to Jenkins with admin/admin(could be changed in docker-compose file).
By default, jenkins consists of 1 job:
- **GatlingBackend**: run Gatling simulations with runtime parameters: -SIMULATION -USERS -RAMPUP -DURATION

## Running demo scenario with GatlingBackend job

To run Gatling demo script: **Open GatlingBackend job -> Build with Parameters -> Set simulation -> Set build parameters  -> Build**

This job will start Gatling docker container and execute Demostore.scala gatling scenario

You'll find default test reports inside **Gatling** tab in Jenkins job page: 
http://localhost:8181/job/GatlingBackend/gatling/ 

## Making your gatling script compatible with framework

Framework accept both .java and .scala versions of scripts. For default GatlingBackend job you can add next runtime parameters: 
- -USERS 
- -RAMPUP 
- -DURATION

## Grafana

Start Demostore.scala test with jenkins GatlingBackend job
Login to Grafana with admin/admin.
Real time host performance metrics should be available in 'Docker monitoring with service selection' dashboard. 
Dashboard contains visualizations based on data from prometheus.

### Available metrics
Dashboard has multiple rows with different metrics

### Timerange
All values in visualizations are calculated according to selected time range. Default timerange is last 24h with 5 sec refresh. Timerange could be set in timepicker or selected on any graph.
Graphs and series on dashboard are displayed dynamically according to service (container) variable selected.