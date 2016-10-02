'use strict';

module.exports = function(DeviceMetrics) {

  DeviceMetrics.validatesPresenceOf('pmv', 'pmc', 'pmw', 'pmwh', 'deviceId')
  DeviceMetrics.validatesNumericalityOf('pmv', { message: { number: 'is not a number'}})
  DeviceMetrics.validatesNumericalityOf('pmc', { message: { number: 'is not a number'}})
  DeviceMetrics.validatesNumericalityOf('pmw', { message: { number: 'is not a number'}})
  DeviceMetrics.validatesNumericalityOf('pmwh', { int: true, message: { int: 'is not an integer'}})

  DeviceMetrics.validatesLengthOf('deviceId', {is: 11})
};
