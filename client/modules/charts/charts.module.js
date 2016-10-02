angular
    .module('charts', ['ui-notification', 'angularMoment', 'lbServices', 'highcharts-ng', 'mgcrea.ngStrap.select'])
    .factory('ChartOptionsFactory', function($timeout) {
        return function(extraparams) {
          return angular.merge({}, {
            loading: false,
            title: {
              text: ''
            },
            xAxis: {
              type: 'datetime',
              labels: {
                overflow: 'justify'
              }
            },
            yAxis: {
              title: {
                text: ''
              },
            },
            options: {
              chart: {
                zoomType: 'xy',
              },
              legend: {
                enabled: false
              },
              plotOptions: {
                line: {
                  dataLabels: {enabled: true}
                },
                area: {
                  fillColor: {
                    linearGradient: {
                      x1: 0,
                      y1: 0,
                      x2: 0,
                      y2: 1
                    },
                    stops: [
                      [0, Highcharts.getOptions().colors[0]],
                      [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                    ]
                  },
                  allowPointSelect: true,
                  marker: {
                    radius: 2
                  },
                  lineWidth: 1,
                  states: {
                    hover: {
                      lineWidth: 1
                    }
                  },
                  threshold: null
                }
              },
            },
            func: function(chart) {
              $timeout(function() {
                chart.reflow();
              }, 0);
            },
            series: []
          }, extraparams)
        }
    })
    .constant('rangeOptions', [
        {value: 60*60, label: '1 hour'},
        {value: 3*60*60, label: '3 hours'},
        {value: 6*60*60, label: '6 hours'},
        {value: 12*60*60, label: '12 hours'},
        {value: 24*60*60, label: '24 hours'}
    ])
    .constant('autoUpdateChartInterval', 300000)
    .controller('ChartController', function DefaultController($scope, Notification, $state, DeviceMetrics, device, ChartOptionsFactory, rangeOptions, $interval, autoUpdateChartInterval) {

        $scope.device = device

        this.selectedRangeValue = rangeOptions[0].value

        var self = this

        this.rangeOptions = rangeOptions

        this.chooseRange = function(event, value, index) {
            self.loadingToggle(true)
            var time = moment().subtract(self.selectedRangeValue, 'seconds').unix();
            DeviceMetrics.find({
              filter: {limit: 40000, order: 'createdAt', where: {createdAt: {gt: time}, deviceId: device.deviceId}}
            }).$promise.then(
              self.reloadCharts
            )
        }

        $scope.$on('$select.select', this.chooseRange)

        this.chartVoltageConfig = ChartOptionsFactory({
          yAxis: {
            title: {
              text: 'V'
            },
            min: 160
          }
        })

        this.chartCurrentConfig = ChartOptionsFactory({
          yAxis: {
            title: {
              text: 'A'
            }
          },
          options: {
            chart: {
              zoomType: 'x',
            }
          }
        })

        this.chartPowerConfig = ChartOptionsFactory({
          yAxis: {
            title: {
              text: 'W'
            }
          },
          loading: false,
          options: {
            chart: {
              zoomType: 'x',
            }
          }
        })

        this.chartPowerHourConfig = ChartOptionsFactory({
          title: {
            text: ''//'Power/Hour'
          },
          yAxis: {
            title: {
              text: 'W/h'
            }
          },
          options: {
            chart: {
              zoomType: 'x',
            }
          }
        })

        this.loadingToggle = function(loading) {
          self.chartVoltageConfig.loading = !!loading
          self.chartCurrentConfig.loading = !!loading
          self.chartPowerConfig.loading = !!loading
          self.chartPowerHourConfig.loading = !!loading
        }

        this.reloadCharts = function(metrics) {
          self.chartVoltageConfig.series[0] = {
            name: 'Voltage',
            type: 'area',
            data: metrics.map(function (row) {
              return [row.createdAt * 1000, parseFloat(row.pmv)]
            })
          }

          self.chartCurrentConfig.series[0] = {
            name: 'Current',
            type: 'area',
            data: metrics.map(function (row) {
              return [row.createdAt * 1000, parseFloat(row.pmc)]
            })
          }

          self.chartPowerConfig.series[0] = {
            name: 'Power',
            type: 'area',
            data: metrics.map(function (row) {
              return [row.createdAt * 1000, parseFloat(row.pmw)]
            })
          }

          self.chartPowerHourConfig.series[0] = {
            name: 'Power/Hour',
            type: 'area',
            data: metrics.map(function (row) {
              return [row.createdAt * 1000, parseFloat(row.pmwh)]
            })
          }

          self.loadingToggle(false)
        }

        //Let's Start
        this.chooseRange()

        //And set interval
        $interval(this.chooseRange, autoUpdateChartInterval)
    })
