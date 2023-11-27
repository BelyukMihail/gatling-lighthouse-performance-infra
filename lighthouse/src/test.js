import { LoginPage } from "./page/login-page.js";
import { MainPage } from "./page/main-page.js";
import { endSessionWithReport, startUserFlow } from "./session.js";
import * as util from "./util/util.js";
import assert from "assert";

async function auditMainPage() {
    console.log("URL: "+ process.env.MAIN_PAGE)
    const flow = await startUserFlow({url:process.env.MAIN_PAGE})
    let mainPage = new MainPage(flow)
    assert(await mainPage.isPageOpened(), 'Main page is open')
    await flow.navigate(mainPage.getUrl())
    await endSessionWithReport(flow)
}

async function auditLoginPageDirect(){
    const flow = await startUserFlow({url:process.env.LOGIN_PAGE})
    let loginPage = new LoginPage(flow)
    assert(await loginPage.isPageOpened(), 'Login page is open')
    await flow.navigate(loginPage.getUrl())
    await endSessionWithReport(flow)
}

async function auditLoginPage(){
    const flow = await startUserFlow({url:process.env.MAIN_PAGE})
    let mainPage = new MainPage(flow)
    assert(await mainPage.isPageOpened(), 'Main page is open')

    const loginPage =await mainPage.clickLoginLink()
    assert(await loginPage.isPageOpened(), 'Login page is open')
    await flow.navigate(loginPage.getUrl())

    await endSessionWithReport(flow)
}

async function executeTests() {
    await auditMainPage()
    await auditLoginPageDirect()
    await auditLoginPage()
}

await executeTests()