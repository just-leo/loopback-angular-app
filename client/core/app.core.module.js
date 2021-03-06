'use strict'
/* Cross app modules (common) */
angular
	.module('app.core', [
		'ngAnimate',
		'app.core.interceptor',
		'app.config',
		'cfp.loadingBar',
		'ui-notification',
		'angularMoment',
		'mgcrea.ngStrap.modal',//only modal
    'ncy-angular-breadcrumb'
	])
	.config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
		cfpLoadingBarProvider.includeBar = true;
		cfpLoadingBarProvider.includeSpinner = true;
		cfpLoadingBarProvider.latencyThreshold = 500;
	}])
	.config(function(NotificationProvider) {
		NotificationProvider.setOptions({
			delay: 4000
			//startTop: 20,
			//startRight: 10,
			//verticalSpacing: 20,
			//horizontalSpacing: 20,
			//positionX: 'right',
			//positionY: 'top',
			//replaceMessage: false
		})
	})
	.config(function($modalProvider) {
		angular.extend($modalProvider.defaults, {
			title: 'Подтверждение действия',
			templateUrl: "layouts/confirmation-dialog.html",
			show: false,
			backdrop: 'static',
			keyboard: true
		});
	})
	.config(['$animateProvider', function ($animateProvider) {
		$animateProvider.classNameFilter(/^(?:(?!ng-animate-disabled).)*$/);
	}])
  .config(function($breadcrumbProvider) {
    $breadcrumbProvider.setOptions({
      includeAbstract: true,
      //prefixStateName: 'home',
      //template: 'bootstrap3',
      //templateLast: '<i ng-bind-html="ncyBreadcrumbLabel"></i>',
      templateUrl: 'layouts/breadcrumbs.html'
    });
  })
	.run(['$animate', function($animate) {
		$animate.enabled(true)
	}])
	.run(function(amMoment) {
		amMoment.changeLocale('ru');

		moment.updateLocale('ru', {
			calendar : {
				//lastDay : '[Yesterday at] LT',
				//sameDay : '[Today at] LT',
				//nextDay : '[Tomorrow at] LT',
				//lastWeek : '[last] dddd [at] LT',
				//nextWeek : 'dddd [at] LT',
				sameElse : 'Do MMM YYYY в LT'
			}
		})
	})
	.run(function($urlRouter, PermRoleStore, PermPermissionStore, User, $rootScope, AuthService, $state, STATES, cfpLoadingBar, Notification, $log) {
		var start = cfpLoadingBar.start;
		var complete = function() {
			if(cfpLoadingBar.status() > 0) {
				cfpLoadingBar.complete()
			}
		}

		/**
		 * Shortcut to take user back
		 * @returns {promise|void}
		 */
		$rootScope.goBack = function goBack(){
			complete()
			var lastState = AuthService.getReturnState();
			if(lastState && lastState.name){
				return $state.go(lastState.name, lastState.params)
			} else {
				return $state.go(STATES.DEFAULT, {})
			}
		}

		$rootScope.$on('auth.not.authorized', function(e){
			//Use this exception when a user has been authenticated but is not allowed to perform the requested action
			Notification.warning('У вас недостаточно прав для выполнения данного действия').then(function() {
        User.isAuthenticated()
			})
		})

		$rootScope.$on('auth.not.authenticated', function(e){
			if(AuthService.isAuthenticated()) {
				Notification.warning({message: 'Время сессии истекло, необходимо авторизоваться снова', closeOnClick: true, delay: 30000}).then(function() {
					$state.go(STATES.LOGINPAGE, {}, {reload: true})
				})
			}
		})

		$rootScope.$on('auth.login.success', function(e, value){
			Notification.clearAll()
			$rootScope.setCurrentUser(value)
			$rootScope.goBack()
		})

		$rootScope.$on('auth.logout.success', function(){
			if($rootScope.$state.current.name.indexOf(STATES.REGISTRATION) < 0) {
				AuthService.setReturnState($rootScope.$state.current.name, $rootScope.$state.params)
			}
			$rootScope.setCurrentUser(null)
			complete();
			$state.go(STATES.LOGINPAGE, {}, {reload: true})
		})

		$rootScope.$on('$stateChangeStart',
			function(event, toState, toParams, fromState, fromParams) {
				if(!toState.abstract && (toState.name !== STATES.LOGINPAGE) && (toState.name !== STATES.REGISTRATION)) {
					//remember not abstract and not user logins states
					AuthService.setReturnState(toState, toParams)
				}

				if(toState.name.indexOf(STATES.LOGINPAGE) > -1) {
					if(AuthService.isAuthenticated()) {
						event.preventDefault();
						//notify
						$rootScope.goBack();
					}
				} else {
					//AUTHENTICATION CHECK
					if (toState.authenticate !== false && !AuthService.isAuthenticated()) {
						//auth required
						event.preventDefault();
						complete();
						$state.go(STATES.LOGINPAGE);
					}
				}
			})

		$rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error){
			if(error.status == 404) {
				$state.go(STATES.ERROR_NOTFOUND)
			}
      console.warn(error)
		})

		$rootScope.currentUser = null;
		$rootScope.isAuthenticated = AuthService.isAuthenticated;

		$rootScope.setCurrentUser = function (user) {
			PermPermissionStore.clearStore();
			PermRoleStore.clearStore();
			$rootScope.currentUser = user;
			if(user && user.Role) {
				switch (user.Role) {
					case 'root':
						PermRoleStore.defineRole('root', function(role, stateProperties) {console.log(role, stateProperties);return true})
					case 'technician':
						var technicianPermissions = [
						]
						PermPermissionStore.defineManyPermissions(technicianPermissions, defaultPermissionCheck)
						PermRoleStore.defineRole('technician', technicianPermissions)
					case 'top':
						var topPermissions = [
						]
						PermPermissionStore.defineManyPermissions(topPermissions, defaultPermissionCheck)
						PermRoleStore.defineRole('top', topPermissions)
					case 'administrator':
						var adminPermissions = [
						]
						PermPermissionStore.defineManyPermissions(adminPermissions, defaultPermissionCheck)
						PermRoleStore.defineRole('administrator', adminPermissions)
					case 'paymaster':
						var paymasterPermissions = [
						]
						PermPermissionStore.defineManyPermissions(paymasterPermissions, defaultPermissionCheck)
						PermRoleStore.defineRole('paymaster', paymasterPermissions)
					default:
						PermPermissionStore.defineManyPermissions([
              'external.layout',
              'external.layout.registration',
              'external.layout.login',
              'dashboard.layout',
              'dashboard.layout.default',
              'dashboard.layout.404',
              'dashboard.layout.charts',
              'dashboard.layout.device'
						], defaultPermissionCheck)
				}

			} else {
				console.log('user permissions cleared')
        PermPermissionStore.defineManyPermissions([
          'external.layout',
          'external.layout.registration',
          'external.layout.login',
          'dashboard.layout',
          'dashboard.layout.default',
          'dashboard.layout.404',
          'dashboard.layout.charts',
          'dashboard.layout.device'
        ], defaultPermissionCheck)
			}
			PermRoleStore.defineRole('AUTHORIZED', defaultRoleCheck)
		}

		$rootScope.setCurrentUser(AuthService.init())

		// Once permissions are set-up
		// kick-off router and start the application rendering
		$urlRouter.sync();
		// Also enable router to listen to url changes
		$urlRouter.listen();

		function defaultPermissionCheck(permission, properties) {
			$log.debug('permission check', permission, properties)
			return true
		}
		function defaultRoleCheck(role, stateProperties) {
			$log.debug('role check', role, stateProperties)
      return AuthService.isAuthenticated()
			if($rootScope.currentUser) {
				if(role === $rootScope.currentUser.Role) {
					return true
				}
			}
			if(role === 'AUTHORIZED')
				role = null
			return AuthService.isAuthenticated()
		}
	})
	.run(function(cfpLoadingBar, $rootScope){
		var start = cfpLoadingBar.start;
		var complete = cfpLoadingBar.complete;

		$rootScope.$on('$stateChangeStart', start)
		$rootScope.$on('$stateChangePermissionStart', start)
		$rootScope.$on('$stateChangeSuccess', complete)
		$rootScope.$on('$stateChangePermissionAccepted', complete)
		$rootScope.$on('$stateChangeError', complete)
		$rootScope.$on('$stateChangePermissionDenied', function() {
      arguments
      debugger
			complete()
			$rootScope.$emit('auth.not.authorized')
		})
	})
	.run(function($rootScope, $state) {
		$rootScope.$state = $state;
		$rootScope.pageTitle = '';

		//Page Title handling
		$rootScope.$on('$stateChangeSuccess',
			function(event, toState, toParams, fromState, fromParams){
				if(!toState.abstract) {
					$rootScope.pageTitle = toState.pageTitle ? toState.pageTitle : ''
				}
			})

		$rootScope.$on('$stateChangeError',
			function(event, toState, toParams, fromState, fromParams, error){
				$rootScope.pageTitle = '';
			})

		$rootScope.$on('$stateNotFound',
			function(event, unfoundState, fromState, fromParams){
				$rootScope.pageTitle = '';
			})

		console.info(app.workingTime(), 'Ready!')
	})
