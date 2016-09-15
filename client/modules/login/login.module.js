angular.module('login', ['ui-notification'])
  .config(function ($sceProvider) {
    // Completely disable SCE.  For demonstration purposes only!
    // Do not use in new projects.
    //$sceProvider.enabled(false);
  })
  .controller('LoginController', function ($scope, AuthService, $state, Notification) {

    $scope.credentials = {
      email: '',
      password: ''
    }
    $scope.rememberMe = false

    $scope.login = function () {
      $scope.loginResult = AuthService.login($scope.credentials, $scope.rememberMe)
        .then(
          function (result) {
            // success
            debugger
          },
          function (errResponse) {
            debugger
            if (errResponse.status === 401) {
              //$scope.serverErrors = _.keyBy(errResponse.error, 'field')
              //angular.forEach($scope.serverErrors, function (field) {
                Notification.warning({
                  title: 'Ошибка',
                  message: errResponse.data ? errResponse.data.error.message : 'Unauthorized'
                })
              //})
            } else {
              Notification.error({
                title: 'Ошибка ' + errResponse.status,
                message: errResponse.message ? errResponse.message : ''
              })
            }
          }
      )
    }

  })
