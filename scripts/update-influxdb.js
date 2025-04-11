const fs = require('fs')
const { InfluxDB, FieldType } = require('influx')

const requiredEnvVars = [
  'INFLUX_HOST',
  'INFLUX_DB',
  'INFLUX_USERNAME',
  'INFLUX_PASSWORD',
]

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`${requiredEnvVars.join(', ')} must be specified`)
  }
}

// Read data from stdin
const jsonData = fs.readFileSync(0, 'utf-8')
const prices = JSON.parse(jsonData)

// Set up the InfluxDB 1.x client
const influx = new InfluxDB({
  host: process.env.INFLUX_HOST,
  database: process.env.INFLUX_DB,
  username: process.env.INFLUX_USERNAME,
  password: process.env.INFLUX_PASSWORD,
  schema: [
    {
      measurement: 'prices',
      fields: {
        value: FieldType.FLOAT,
      },
      tags: ['area'],
    },
  ],
})

// Write points
const points = prices.map(point => ({
  measurement: 'prices',
  tags: { area: point.area },
  fields: { value: point.value },
  timestamp: new Date(point.date * 1000),
}))

influx.writePoints(points)
    .then(() => {
      console.log('Data written successfully')
    })
    .catch(e => {
      console.error('Error writing data', e)
    })