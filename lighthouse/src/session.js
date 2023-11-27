import { startFlow, desktopConfig, generateReport } from 'lighthouse'
import puppeteer from 'puppeteer'
import * as util from './util/util.js'

export async function startBrowser(browserOptions = undefined, url) {
    const browser = await puppeteer.launch(browserOptions)
    const page = await browser.newPage()
    await page.goto(url)
    return page
}
export async function startUserFlow(
    { browserOptions = {
        headless: 'new', args: ['--start-maximized','--no-sandbox']
    },
        url }
) {
    const page = await startBrowser(browserOptions, url)
    const flow = await startFlow(page, {
        config: desktopConfig
        // {
        //     extends: 'lighthouse:default',
        //     settings: {
        //         formFactor: 'desktop',
        //         screenEmulation: { disabled: true },
        //         output: ['json']
        //         //   throttling: constants.throttling.desktopDense4G,
        //         //   screenEmulation: constants.screenEmulationMetrics.desktop,
        //         //   emulatedUserAgent: constants.userAgents.desktop,
        //     }
        // }
    })

    return flow
}

export async function endSessionWithReport(flow) {
    await util.generatReport(flow)
    await flow._page.browser().close()
}