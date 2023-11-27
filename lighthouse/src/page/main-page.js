import { AbstractPage } from "./abstract-page.js"
import { AllCategoriesPage } from "./all-categories-page.js"
import { LoginPage } from "./login-page.js"
import { WebElement } from "./web-element.js"

export class MainPage extends AbstractPage{

    constructor(flow) {
        super(flow)
        this.loginBtn = new WebElement(flow,'//*[@href="/login"]') 
        this.allProductsLink = new WebElement(flow,'//*[@href="/category/all"]') 
        this.pageHeader='Welcome to the Gatling DemoStore!'
    }

    async clickLoginLink() {
        await this.loginBtn.waitAndClick()
        return new LoginPage(this.flow)
    }

    async gotoAllProductsPage(){
        await this.allProductsLink.waitAndClick()
        return new AllCategoriesPage(this.flow)
    }
}
