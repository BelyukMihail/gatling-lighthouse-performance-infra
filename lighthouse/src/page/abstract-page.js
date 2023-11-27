import { WebElement } from "./web-element.js"

export class AbstractPage {

    constructor(flow) {
        this.flow = flow
        this.pageHeader = 'default'
        this.pageHeaderSelector = 'h2'
    }

    async isPageOpened() {
        const header = await this.flow._page.$eval(this.pageHeaderSelector, el => el.textContent)
        return header == this.pageHeader
    }

    getUrl() {
        return this.flow._page.url()
    }

}