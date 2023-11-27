package demostore.utils

import com.influxdb.client.InfluxDBClient
import com.influxdb.client.domain.WritePrecision
import com.influxdb.client.write.Point
import io.gatling.core.Predef._
import io.gatling.core.structure.ChainBuilder

import java.time.Instant

class WriteMetricToInfluxDB(org: String, bucket: String, client: InfluxDBClient) {
  private final val secondToCount = 990_000_000
  private var allRequestsCounter:Long = 0
  private var successReqCounter:Long = 0
  private var requestsInOneSecond: Long = 0
  private var successfulRequestsInOneSecond: Long = 0
  private var startOfTimePeriod = System.nanoTime()

  def writeResponseTime(requestName: String): ChainBuilder = {
    exec(session => {
      val responseTime = session("responseTime").as[Int]
      val testName = session("testName").as[String]
      countRequestsInSecond(session.contains("requestSuccessful"))

      val point = Point
        .measurement("response_times")
        .addTag("test_name", testName)
        .addTag("request_name", requestName)
        .addField("response_time", responseTime)
        .time(Instant.now(), WritePrecision.NS)
      writePointToDb(point)
      session
    })
  }

  def writeThroughput(): ChainBuilder = {
    exec(session => {
      val throughput = successfulRequestsInOneSecond

      val point = Point
        .measurement("throughput")
        .addField("throughput_value", throughput)
        .time(Instant.now(), WritePrecision.MS)
      writePointToDb(point)
      session
    })
  }

  def writeTotalRequestsPerSecond(): ChainBuilder = {
    exec(session => {
      val requestsPerSecond = requestsInOneSecond

      val point = Point
        .measurement("total_req/s")
        .addField("total_req/s_value", requestsPerSecond)
        .time(Instant.now(), WritePrecision.MS)
      writePointToDb(point)
      session
    })
  }

  def countRequestsInSecond(requestSuccessful: Boolean): Unit = {
    val currentTime = System.nanoTime()
    if (currentTime <= startOfTimePeriod + secondToCount) {
      if (requestSuccessful) {
        successReqCounter += 1
        allRequestsCounter += 1
      } else {
        allRequestsCounter += 1
      }
    } else if (requestSuccessful && currentTime > startOfTimePeriod + secondToCount) {
      successfulRequestsInOneSecond = successReqCounter
      successReqCounter = 1
      requestsInOneSecond = allRequestsCounter
      allRequestsCounter = 1
      startOfTimePeriod = currentTime
    } else if (!requestSuccessful && currentTime > startOfTimePeriod + secondToCount) {
      successfulRequestsInOneSecond = successReqCounter
      successReqCounter = 0
      requestsInOneSecond = allRequestsCounter
      allRequestsCounter = 1
      startOfTimePeriod = currentTime
    }
  }

  def writePointToDb(point: Point) = {
    val writeApi = client.getWriteApiBlocking
    writeApi.writePoint(bucket, org, point)
  }
}

