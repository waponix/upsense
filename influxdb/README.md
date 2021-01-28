# How to use

Run the following command inside the influxdb directory:
```
sudo docker run -d --name upsense-influx --rm -p 8086:8086 -v $(pwd)/influxdb.conf:/etc/influxdb/influxdb.conf:ro influxdb:1.8.3 -config /etc/influxdb/influxdb.conf
```
