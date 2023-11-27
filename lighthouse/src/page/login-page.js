import { AbstractPage } from "./abstract-page.js"
import { AllCategoriesPage } from "./all-categories-page.js"
import { MainPage } from "./main-page.js"
import { WebElement } from "./web-element.js"

export class LoginPage extends AbstractPage {
    constructor(flow) {
        super(flow)
        this.allProductsLink = new WebElement(flow, '//*[@href="/category/all"]')
        this.userNameField = new WebElement(flow, '//*[@name="username"]')
        this.passwordField = new WebElement(flow, '//*[@name="password"]')
        this.loginBtn = new WebElement(flow, '//button[text()="Login"]')
        this.pageHeaderSelector = 'div[class="col-6 text-center"] h3[class="display-4"]'
        this.pageHeader = 'Login'
    }

    async gotoAllProductsPage() {
        await this.allProductsLink.waitAndClick()
    }

    async enterUsername(userName) {
        await this.userNameField.waitAndType(userName)
    }

    async enterPassword(password) {
        await this.passwordField.waitAndType(password)
    }

    async clickLoginBtn() {
        await this.loginBtn.waitAndClick()
    }

    async login(userName, password) {
        await this.enterUsername(userName)
        await this.enterPassword(password)
        await this.clickLoginBtn()
        return new MainPage(this.flow)
    }

    async gotoAllCategoriesPage() {
        await this.allCategoriesPageLink.waitAndClick()
        return new AllCategoriesPage(this.flow)
    }
}