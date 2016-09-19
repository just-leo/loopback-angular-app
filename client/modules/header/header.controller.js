'use strict'

angular.module('header')
	.controller('HeaderController',
		function HeaderController($scope, AuthService, cfpLoadingBar) {

			$scope.isAuthenticated = AuthService.isAuthenticated();

			$scope.logout = function(){
				cfpLoadingBar.start();
				AuthService.logout().then(function(){
					logoutSuccess()
				}, function(reason) {
					console.warn('Server rejected logout', reason);
					logoutSuccess()
				})
			}

			function logoutSuccess() {
				$scope.isAuthenticated = false;
				if(cfpLoadingBar.status() > 0) {
					cfpLoadingBar.complete()
				}
			}

      $scope.$on('auth.logout.success', function(e){
        $scope.isAuthenticated = true
      })
		}
	)
