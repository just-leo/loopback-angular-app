angular
    .module('default', ['ui-notification', 'lbServices'])
    .controller('DefaultController', function DefaultController($scope, Notification) {
        $scope.query = '';
        $scope.search = function () {

        }
    })
