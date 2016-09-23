'use strict';

var Client = require('strong-pubsub');
var Adapter = require('strong-pubsub-mqtt');

module.exports = function(app) {
  var client = new Client({
    host: '46.101.207.214',
    port: 8883,
    mqtt: {
      username: 'owntracks',
      password: 'owntracks'//or newBuffer('password')
    }
  }, Adapter)

  client.connect(function(status) {
    console.log('mqtt connect')
    client.subscribe('*')
    //client.subscribe('ESP82660005e27b')
    client.on('message', function(deviceTopic, msg){
      console.log(deviceTopic, msg)
    })
  })

  client.ready(function() {
    console.log('mqtt ready')
  })

}
