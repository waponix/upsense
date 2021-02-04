import sys
import json
import Adafruit_DHT

DHT_SENSOR = Adafruit_DHT.DHT22
DHT_PIN = 4

humidity, temperature = Adafruit_DHT.read_retry(DHT_SENSOR, DHT_PIN)

reading = {'temperature': temperature, 'humidity': humidity}
reading = json.dumps(reading)

print (reading)
sys.stdout.flush()
exit
