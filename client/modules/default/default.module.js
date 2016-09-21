angular
    .module('default', ['ui-notification', 'angularMoment', 'lbServices'])
    .controller('DefaultController', function DefaultController($scope, Notification, $state, STATES, EnergyMonitor) {
        $scope.query = '';
        $scope.cardList = [];
        $scope.search = function () {

        }
    })
