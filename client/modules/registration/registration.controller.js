angular.module('registration')
    .controller('RegistrationController',
    function RegistrationController($scope, currentUser, AuthService, STATES, $sce, $state, Notification, cfpLoadingBar) {

        $scope.submit = function() {
            cfpLoadingBar.start();
            AuthService.registration(card).then(
                function(resp){
                    cfpLoadingBar.complete()
                    $state.go('root.aside.main.account', {CardID: resp.id})//card info
                },
                function(errResponse) {
                    cfpLoadingBar.complete()
                    $scope.serverErrors = _.keyBy(errResponse.data, 'field')
                    if(errResponse.status === 422){
                        angular.forEach($scope.serverErrors, function(field){
                            Notification.error({
                                title: 'Ошибка',
                                message: field.message
                            })
                        })
                    } else {
                        Notification.error({
                            title: 'Ошибка',
                            message: errResponse.statusText
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

        $scope.trustAsHtml = function(value) {
            return $sce.trustAsHtml(value);
        }

    })
