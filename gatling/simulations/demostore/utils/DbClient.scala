package demostore.utils

import com.influxdb.client.{InfluxDBClient, InfluxDBClientFactory}
import io.gatling.core.Predef._
import io.gatling.core.structure.ChainBuilder

import java.lang
import java.lang.System

object DbClient {
  val url = "http://localhost:8086"
  val token = "ZDXeM4zj1zy-MLTrY99iBON2IfUKn4QugUkagrEdOZKawttKe26BKCdpve-SXKTnxx1ocdo_Od3pqQjl_5_2dg=="
  val org = "org"
  val bucket = "gatling"
  val client: InfluxDBClient = InfluxDBClientFactory.create(url, token.toCharArray, org, bucket)

  val metricWriter = new WriteMetricToInfluxDB(org, bucket, client)

  def writeRequestStats(reqName: String): ChainBuilder = {
      exec(metricWriter.writeResponseTime(reqName))
        .exec(metricWriter.writeThroughput())
        .exec(metricWriter.writeTotalRequestsPerSecond())
  }
}
