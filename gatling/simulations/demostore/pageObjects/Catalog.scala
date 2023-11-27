package demostore.pageObjects

import demostore.utils.DbClient
import io.gatling.core.Predef._
import io.gatling.http.Predef._

object Catalog {

  val categoryFeeder = csv("data/category.csv").random
  val jsonFeeder = jsonFile("data/jsonProducts.json").random

  object Category {
    def view(writeToDb:Boolean =true) = {
      val reqName = "Load Category #{categoryName}"
      feed(categoryFeeder)
        .exec(http(reqName)
          .get("/category/#{categorySlug}")
          .check(css("#CategoryName").is("#{categoryName}")))
        .doIf(writeToDb) {
          exec(DbClient.writeRequestStats(reqName))
        }
    }
  }

  object Product {
    def view = {
      feed(jsonFeeder)
        .exec(http("Load Product Page - #{name}")
          .get("/product/#{slug}")
          .check(css("#ProductDescription").is("#{description}"))
        )
    }

    def add = {
      exec(view)
        .exec(http("Add product to cart")
          .get("/cart/add/#{id}")
          .check(substring("items in your cart"))
        )
        .exec(session => {
          val currentTotal = session("cartTotal").as[Double]
          val itemPrice = session("price").as[Double]
          session.set("cartTotal", (currentTotal + itemPrice))
        })
    }
  }
}
