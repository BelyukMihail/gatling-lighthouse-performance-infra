#!/usr/bin/env node
//////////////////////////////////////////
// Shows how to use InfluxDB write API. //
//////////////////////////////////////////

import {InfluxDB, Point, HttpError} from '@influxdata/influxdb-client'
// import {url, token, org, bucket} from './env.mjs'
// import {hostname} from 'node:os'
import * as util from './util.js'

export async function writeToInfluxDB(endpoint,metricValue,metric) {
    const url = process.env.LIGHTHOUSE_URL
    const token = process.env.LIGHTHOUSE_TOKEN
    const org = process.env.LIGHTHOUSE_ORG
    const bucket = process.env.LIGHTHOUSE_BUCKET

    console.log('*** WRITE POINTS ***')
    // create a write API, expecting point timestamps in nanoseconds (can be also 's', 'ms', 'us')
    const writeApi = new InfluxDB({ url, token }).getWriteApi(org, bucket, 's')
    const point = new Point('performance')
        .tag('url', endpoint)
        .tag('metric',metric)
        .floatField('value', metricValue)
        .timestamp(new Date()) // can be also a number, but in writeApi's precision units (s, ms, us, ns)!
    writeApi.writePoint(point)

    // WriteApi always buffer data into batches to optimize data transfer to InfluxDB server.
    // writeApi.flush() can be called to flush the buffered data. The data is always written
    // asynchronously, Moreover, a failed write (caused by a temporary networking or server failure)
    // is retried automatically. Read `writeAdvanced.js` for better explanation and details.
    //
    // close() flushes the remaining buffered data and then cancels pending retries.
    try {
        await writeApi.close()
    } catch (e) {
        console.error(e)
        if (e instanceof HttpError && e.statusCode === 401) {
            console.log('Run ./onboarding.js to setup a new InfluxDB database.')
        }
        console.log('\nFinished ERROR')
    }
}
