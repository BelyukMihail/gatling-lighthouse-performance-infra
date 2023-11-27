import fs from 'fs'
import dotenv from 'dotenv'
import { expand } from 'dotenv-expand';
import { generateReport } from 'lighthouse';
import {writeToInfluxDB}  from './influxdb.js';

export const envConfig = dotenv.config({ path: '.env', override: true });
expand(envConfig);

export async function generatReport(flow) {
    let date = new Date()
    const result = await flow.createFlowResult()

    await writeFlowResultToInFluxDB(result)
    // const jsonRep = generateReport(result, 'json')
    // const htmlRep = generateReport(result, 'html')
    // fs.writeFileSync(`report/lhreport-${date.getTime()}.json`, jsonRep);
    // fs.writeFileSync(`src/report/lhreport-${date.getTime()}.html`, htmlRep);
}

async function writeFlowResultToInFluxDB(result) {
    const steps = result.steps
    await steps.forEach(async step => {
        await writeToInfluxDB(step.lhr.finalUrl, step.lhr.audits["first-contentful-paint"].numericValue, 'first-contentful-paint')
        await writeToInfluxDB(step.lhr.finalUrl, step.lhr.audits["total-blocking-time"].numericValue, 'total-blocking-time')
        await writeToInfluxDB(step.lhr.finalUrl, step.lhr.audits["cumulative-layout-shift"].numericValue, 'cumulative-layout-shift')
        await writeToInfluxDB(step.lhr.finalUrl, step.lhr.audits["largest-contentful-paint"].numericValue, 'largest-contentful-paint')
    })
}
