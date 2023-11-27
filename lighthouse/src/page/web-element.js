export class WebElement {

    constructor(flow, xpath) {
        this.flow = flow
        this.xpath = xpath
    }

    async waitAndClick() {
        const element = await this.flow._page.waitForXPath(this.xpath, { timeout: 10_000 })
        await element.click()
        await this.flow._page.waitForNetworkIdle()
    }

    async waitAndType(text) {
        const element = await this.flow._page.waitForXPath(this.xpath, { timeout: 10_000 })
        await element.type(text)
        await this.flow._page.waitForNetworkIdle()
    }

}