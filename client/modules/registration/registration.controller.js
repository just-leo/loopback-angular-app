angular.module('registration')
    .controller('RegistrationController',
    function RegistrationController($scope, AuthService, STATES, $state, Notification, cfpLoadingBar) {

        $scope.user = {
          username: '',
          email: '',
          password: '',
          confirmPassword:'',
          terms: false
        }

        $scope.serverValidationErrors = {}

        $scope.submit = function() {
            $scope.$registrationForm
            debugger
            cfpLoadingBar.start();
            AuthService.registration($scope.user).then(
                function(resp){
                    cfpLoadingBar.complete()
                    Notification.info({
                      title: 'Congratulations!',
                      message: 'Registration completed'
                    })

                    $state.go(STATES.LOGINPAGE)
                },
                function(errResponse) {
                    $scope.serverValidationErrors = errResponse.data.error.details
                    cfpLoadingBar.complete()
                    if(errResponse.status === 422){
                        Notification.warning({
                          title: 'Error ' + errResponse.data.error.name,
                          message: errResponse.data.error.message
                        })
                        $scope.serverErrors = errResponse.data.error.details.messages;
                        angular.forEach($scope.serverErrors, function(messages, field){
                            Notification.warning({
                                title: 'Error ' + field,
                                message: messages[0]
                            })
                        })
                    } else {
                        Notification.error({
                          title: 'Error ' + errResponse.status,
                          message: errResponse.message ? errResponse.message : ''
                        })
                    }
                }
            )
        }

        $scope.goBack = function() {
            var state = AuthService.getReturnState()
            if(state) {
                return $state.go(state.name, state.params)
            } else {
                return $state.go(STATES.DEFAULT)
            }
        }

    })
