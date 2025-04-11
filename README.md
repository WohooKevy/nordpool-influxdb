# nordpool-influxdb

A collection of scripts for storing Nordpool price data in InfluxDB

This repository contains a collection of scripts for storing Nordpool price data in InfluxDB:

* one that fetches price data from Nordpool and outputs it as JSON
* one that reads JSON and stores it in InfluxDB

## Usage

### Set environment variables
```
AREA=EE
CURRENCY=EUR

INFLUX_HOST=localhost
INFLUX_DB=nordpool
INFLUX_USERNAME=admin
INFLUX_PASSWORD=supersecurepassword
```

### fetch prices from Nordpool

```bash
npm run fetch
```

The JSON is an array of objects like this:

```json
{
  "area": "EE",
  "date": 1581890400000,
  "value": 8.39
}
```

Fetch and push to influxdb

```bash
npm run push
```

## License

GNU GENERAL PUBLIC LICENSE Version 3
