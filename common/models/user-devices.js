'use strict';

var loopback = require('loopback');

module.exports = function(UserDevices) {

  // Returns null if the access token is not valid
  function getCurrentUserId() {
    var ctx = loopback.getCurrentContext();
    if(ctx) {
      return ctx.get('currentUserId');
    }
  }

  UserDevices.add = function(deviceId, cb) {
    //console.log('UserID', getCurrentUserId())
    UserDevices.create({
      userId: getCurrentUserId(),
      deviceId: deviceId.toUpperCase(),
      created: Date.now()/1000,
      modified: Date.now()/1000
    }, cb)
  }

  UserDevices.remoteMethod('add', {
    accepts: {arg: 'deviceId', type: 'string', required: true},
    description: 'Add device for current user',
    http: {verb: 'post'}
  })

  UserDevices.validatesPresenceOf('deviceId');
  //todo needs to check UniquenessOf deviceId + userId
  UserDevices.validatesUniquenessOf('deviceId', {message: 'Device already exists'});
  //todo two next validators doesn't works
  UserDevices.validatesFormatOf('deviceId', {with: /^ESP[A-F0-9]{8}/}, {message:'Wrong deviceId'});
  UserDevices.validatesLengthOf('deviceId', {min: 11, max: 11, is: 11}, {message:'Wrong deviceId length'});

  UserDevices.validateAsync('deviceId', function customAsync(error, done) {
    UserDevices.app.models.DeviceMetrics.findOne({where: {deviceId: this.deviceId}}, function(err, instance){
      if(err || !instance) error()
      done()
    })
  }, {message:'Device doesn\'t registered'})
};
