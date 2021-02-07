import sys
import json
import time
import board
import adafruit_dht

dhtDevice = adafruit_dht.DHT22(board.D4)

while True:
    try:
        # Print the values to the serial port
        temperature_c = dhtDevice.temperature
        temperature_f = temperature_c * (9 / 5) + 32
        humidity = dhtDevice.humidity
        print(
            "Temp: {:.1f} F / {:.1f} C    Humidity: {}% ".format(
                temperature_f, temperature_c, humidity
            )
        )
    except RuntimeError as error:
        # Errors happen fairly often, DHT's are hard to read, just keep going
        # print(error.args[0])
        time.sleep(2.0)
        continue
    except Exception as error:
        dhtDevice.exit()
        raise error

    time.sleep(2.0)

#DHT_SENSOR = Adafruit_DHT.DHT22
#DHT_PIN = 4

#humidity, temperature = Adafruit_DHT.read_retry(DHT_SENSOR, DHT_PIN)

#reading = {'temperature': temperature, 'humidity': humidity}
#reading = json.dumps(reading)

#print (reading)
#sys.stdout.flush()
#exit
