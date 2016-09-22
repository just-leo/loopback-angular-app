angular
    .module('charts', ['ui-notification', 'angularMoment', 'lbServices', 'highcharts-ng'])
    .controller('ChartController', function DefaultController($scope, Notification, $state, STATES, metrics) {
        this.$data = metrics

        this.chartVoltageConfig = {
          chart: {
            zoomType: 'xy',
          },
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
              text: 'V'
            },
            min: 160
          },
          legend: {
            enabled: false
          },
          plotOptions: {
            line: {
              dataLabels: {enabled: true}
            }
          },
          series: []
        }

        this.chartVoltageConfig.series.push({
          name: 'Voltage',
          type: 'area',
          data: metrics.map(function(row){
            return [row.createdAt * 1000, parseFloat(row.pmv)]
          })
        })

        this.chartCurrentConfig = {
          chart: {
            zoomType: 'x',
          },
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
              text: 'A'
            }
          },
          legend: {
            enabled: false
          },
          plotOptions: {
            line: {
              dataLabels: {enabled: true}
            }
          },
          series: []
        }

        this.chartCurrentConfig.series.push({
          name: 'Current',
          type: 'area',
          data: metrics.map(function(row){
            return [row.createdAt * 1000, parseFloat(row.pmc)]
          })
        })


        this.chartPowerConfig = {
          chart: {
            zoomType: 'x',
          },
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
              text: 'W'
            }
          },
          legend: {
            enabled: false
          },
          plotOptions: {
            line: {
              dataLabels: {enabled: true}
            }
          },
          series: []
        }

        this.chartPowerConfig.series.push({
          name: 'Power',
          type: 'area',
          data: metrics.map(function(row){
            return [row.createdAt * 1000, parseFloat(row.pmw)]
          })
        })

        this.chartPowerHourConfig = {
          chart: {
            zoomType: 'x',
          },
          title: {
            text: ''//'Power/Hour'
          },
          xAxis: {
            type: 'datetime',
            labels: {
              overflow: 'justify',
            }
          },
          yAxis: {
            title: {
              text: 'W/h'
            }
          },
          legend: {
            enabled: false
          },
          plotOptions: {
            line: {
              dataLabels: {enabled: true}
            }
          },
          series: []
        }

        this.chartPowerHourConfig.series.push({
          name: 'Power/Hour',
          type: 'area',
          data: metrics.map(function(row){
            return [row.createdAt * 1000, parseFloat(row.pmwh)]
          })
        })
    })
