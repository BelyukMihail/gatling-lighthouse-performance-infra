package demostore.pageObjects

import demostore.utils.DbClient
import io.gatling.core.Predef._
import io.gatling.http.Predef._

object CmsPages {

  def homePage(writeToDb: Boolean = true) = {
    val reqName = "Load Home Page"
    exec(http(reqName)
      .get("/")
      .check(regex("<title>Gatling Demo-Store</title>").exists)
      .check(css("#_csrf", "content").saveAs("csrfValue"))
      .check(status.is(200).saveAs("requestSuccessful"))
      .check(responseTimeInMillis.saveAs("responseTime")))
      .doIf(writeToDb) {
        exec(DbClient.writeRequestStats(reqName))
      }
  }

  def aboutUsPage(writeToDb: Boolean = true) = {
    val reqName = "Load About Us"
    exec(http(reqName)
      .get("/about-us")
      .check(substring("About Us")))
      .doIf(writeToDb) {
        exec(DbClient.writeRequestStats(reqName))
      }
  }
}
