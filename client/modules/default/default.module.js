angular
    .module('default', ['ui-notification', 'angularMoment', 'lbServices'])
    .controller('DefaultController', function DefaultController($scope, Notification, $state, STATES, EnergyMonitor) {
        $scope.query = '';
        $scope.cardList = [];
        $scope.search = function () {

        }

        this.$data = EnergyMonitor.find({filter: {limit: 5}}).$promise.then(
            function (result) {
              debugger
            },
            function (error) {

            }
        )
    })
