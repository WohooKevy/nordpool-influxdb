const fs = require('fs')
const { InfluxDB, Point } = require('@influxdata/influxdb-client')

const requiredEnvVars = [
  'INFLUX_HOST',
  'INFLUX_BUCKET',
  'INFLUX_TOKEN',
  'INFLUX_ORG',
]

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`${requiredEnvVars.join(', ')} must be specified`)
  }
}

const jsonData = fs.readFileSync(0, 'utf-8')
const prices = JSON.parse(jsonData)

// Set up the InfluxDB 2.x client
const influxDB = new InfluxDB({
  url: `http://${process.env.INFLUX_HOST}:8086`,  // Assuming InfluxDB 2.x is running on port 8086
  token: process.env.INFLUX_TOKEN,
})

const writeApi = influxDB.getWriteApi(process.env.INFLUX_ORG, process.env.INFLUX_BUCKET)

// Writing points to InfluxDB
prices.forEach(point => {
  const influxPoint = new Point('prices')
      .tag('area', point.area)
      .floatField('value', point.value)
      .timestamp(new Date(point.date * 1000))  // Timestamp in milliseconds
  writeApi.writePoint(influxPoint)
})

// Close the connection and ensure data is written
writeApi.close().then(() => {
  console.log('Data written successfully')
}).catch(e => {
  console.error('Error writing data', e)
})