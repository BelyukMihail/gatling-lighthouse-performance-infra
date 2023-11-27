package demostore

import demostore.pageObjects._
import io.gatling.core.Predef._
import io.gatling.http.Predef._

import scala.util.Random

class Demostore extends Simulation {

  val DOMAIN = "demostore.gatling.io"
  final val startTime = System.currentTimeMillis()
  private val httpProtocol = http
    .baseUrl(s"http://${DOMAIN}")

  def userCount = getProperty("USERS", "2").toInt

  def rampDuration = getProperty("RAMP_DURATION", "5").toInt

  def testDuration = getProperty("TEST_DURATION", "30").toInt

  private def getProperty(propertyName: String, defaultValue: String) = {
    Option(System.getenv(propertyName))
      .orElse(Option(System.getProperty(propertyName)))
      .getOrElse(defaultValue)
  }

  val rnd = new Random()

  def rndString(length: Int) = {
    rnd.alphanumeric.filter(_.isLetter).take(length).mkString
  }

  before {
    println(s"Running simulation with:\n $userCount users \n $rampDuration ramp duration \n $testDuration test duration")
  }

  after {
    println("Test complete!")
  }

  def initSession(testName: String) = exec(flushCookieJar)
    .exec(session => session.set("randomNumber", rnd.nextInt()))
    .exec(session => session.set("customerLoggedIn", false))
    .exec(session => session.set("cartTotal", 0.00))
    .exec(addCookie(Cookie("sessionId", rndString(20)).withDomain(DOMAIN)))
    .exec(session => session.set("startTime", startTime))
    .exec(session => session.set("testName", testName))

  private val scn = scenario("Recorded Demostore")
    .exec(initSession("Test1"))
    .exec(CmsPages.homePage(false))
    .pause(1)
    .exec(CmsPages.aboutUsPage(false))
      .pause(1)
      .exec(Catalog.Category.view(false))
  //    .pause(1)
  //    .exec(Catalog.Product.add)
  //    .pause(1)
  //    .exec(Checkout.viewCart)
  //    .pause(1)
  //    .exec(Catalog.Product.add)
  //    .pause(1)
  //    .exec(Checkout.viewCart)
  //    .pause(1)
  //    .exec(Checkout.completeCheckout)

  private val scn2 = scenario("Recorded Demostore2")
    .exec(initSession("Test2"))
    .exec(CmsPages.homePage(false))
    .pause(1)
    .exec(CmsPages.aboutUsPage(false))

  setUp(
    scn.inject(atOnceUsers(3) ,
      rampUsers(1500) during (60),
//      nothingFor(20),
//      rampUsers(5) during (20)
    ),
//    scn2.inject(constantConcurrentUsers(20) during (20))
  ).protocols(httpProtocol)

}

