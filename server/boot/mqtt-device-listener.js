'use strict';

var Client = require('strong-pubsub');
var Adapter = require('strong-pubsub-mqtt');

module.exports = function(app) {

  function subscription(err, granted) {
    console.log(err || granted)
  }

  var model = app.models.DeviceMetrics;

  var client = new Client({
    host: '46.101.207.214',
    port: 8883,
    mqtt: {
      encoding: 'utf8',
      username: 'owntracks',
      password: 'owntracks'//or newBuffer('password')
    }
  }, Adapter)

  client.connect(function(err) {
    if(err) {
      console.log('Eror MQTT connection filed', err)
      return
    }
    console.log('connected to mqtt')

    client.subscribe('owntracks/#', subscription)
    //client.subscribe('owntracks/ESP0005E27B/+', subscription)

    //client.subscribe('$SYS/broker/uptime', subscription)
    //client.subscribe('$SYS/broker/clients/connected', subscription)

    var tempBbuffer = {}
    client.on('message', function(deviceTopic, msg){
      var params = deviceTopic.split('/')
      var deviceId = params[1]
      var attribute = params[2]
      //separated attributes
      if(['pmv', 'pmc', 'pmw', 'pmwh'].indexOf(attribute) > -1) {
        var data = msg.toString()
        if (!tempBbuffer[deviceId]) {
          tempBbuffer[deviceId] = {}
        }
        tempBbuffer[deviceId][attribute] = data
        if (tempBbuffer[deviceId].pmv && tempBbuffer[deviceId].pmc && tempBbuffer[deviceId].pmw && tempBbuffer[deviceId].pmwh) {
          console.log(new Date, deviceId, tempBbuffer[deviceId])
          var attributes = tempBbuffer[deviceId]
          tempBbuffer[deviceId] = {}

          attributes.deviceId = deviceId;
          attributes.createdAt = Date.now() / 1000;

          model.create(attributes, function (err, row) {
            if (err) {
              console.log(new Date, err)
            } else {
              console.log(new Date, attributes.deviceId, 'string values')
            }
          })
        }
      } else if(attribute === 'json') {
        //expected something like this json:
        //json {"system":{"hostname":"ESP0008F03F","uptime":38740,"rssi":-82,"freemem":23032},"sensors":{"pmv":234.7,"pmc":1.28,"pmw":173,"pmwh":6884}}
        var data = JSON.parse(msg)
        console.log(new Date, data.system.hostname, data.sensors)

        var attributes = data.sensors
        attributes.deviceId = data.system ? data.system.hostname : deviceId;
        attributes.createdAt = Date.now() / 1000;

        model.create(attributes, function (err, row) {
          if (err) {
            console.log(new Date, err)
          } else {
            console.log(new Date, attributes.deviceId, 'json')
          }
        })
      }
    })

    //client.publish('/test', 'this is simple message')
  })

  client.ready(function() {
    //console.log('mqtt ready')
  })

}
