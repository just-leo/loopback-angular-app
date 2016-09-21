angular
    .module('charts', ['ui-notification', 'angularMoment', 'lbServices', 'highcharts-ng'])
    .controller('ChartController', function DefaultController($scope, Notification, $state, STATES, metrics) {
        this.$data = metrics

        this.chartVoltageConfig = {
          chart: {
            zoomType: 'xy',
          },
          title: {
            text: 'Voltage'
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
            return [new Date(row.event).getTime(), parseFloat(row.pmv)]
          })
        })

        this.chartCurrentConfig = {
          chart: {
            zoomType: 'x',
          },
          title: {
            text: 'Current'
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
            return [new Date(row.event).getTime(), parseFloat(row.pmc)]
          })
        })


        this.chartPowerConfig = {
          chart: {
            zoomType: 'x',
          },
          title: {
            text: 'Power'
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
            return [new Date(row.event).getTime(), parseFloat(row.pmw)]
          })
        })

        this.chartPowerHourConfig = {
          chart: {
            zoomType: 'x',
          },
          title: {
            text: 'Power/Hour'
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
            return [new Date(row.event).getTime(), parseFloat(row.pmwh)]
          })
        })
    })
