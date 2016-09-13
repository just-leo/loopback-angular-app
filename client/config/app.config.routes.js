'use strict';
/* App routes */
angular
	.module('app.config.routes', ['ui.router', 'LocalStorageModule', 'permission', 'permission.ui'])
	.constant('DEFAULT_URL', '/')
	.constant('DEFAULT_ROUTE_URL', '/')
	.constant('STATES', {
		LOGINPAGE: 'root.main',
		REGISTRATION: 'root.main.registration',
		DEFAULT: 'root.main',
		MAINPAGE: 'root.main',
		ERROR_NOTFOUND: 'root.main.404'
	})
	.config([
		'$stateProvider', '$urlRouterProvider', 'STATES', 'DEFAULT_ROUTE_URL', 'DEFAULT_URL',
		function($stateProvider, $urlRouterProvider, STATES, DEFAULT_ROUTE_URL, DEFAULT_URL) {
			// Prevent router from automatic state resolving
			$urlRouterProvider.deferIntercept();

			// when there is an empty route, redirect to /
			$urlRouterProvider.when('', DEFAULT_ROUTE_URL);
			$urlRouterProvider.when('/welcome/success', function($window) {
				$window.location = DEFAULT_URL
			});
			$urlRouterProvider.otherwise(function($injector, $location) {
				var $state = $injector.get('$state');
				console.warn('[app.config.routes] location is not defined!', $state, $location);
				$state.go(STATES.MAINPAGE)
			});

			$stateProvider
				/**
				* Apply header that used on all pages
				*/
				.state({
					name: 'root',
					abstract: true,
					views: {
						header: {
							templateUrl: 'modules/header/header.view.html',
							controller: 'HeaderController',
							controllerAs: 'controller'
						},
            'left-sidebar': {
              templateUrl: 'modules/left-sidebar/sidebar-left.html',
              controllerAs: 'controller'
            },
            'right-sidebar': {
              templateUrl: 'modules/right-sidebar/sidebar-right.html',
              controllerAs: 'controller'
            }
					},
					resolve: {
						_loadHeaderModule: function($ocLazyLoad) {
							return $ocLazyLoad.load('header')
						},
						authApi: function(api) {
							return api.auth;
						}
					},
					pageTitle: 'Главная страница',
          onEnter: function($rootScope) {
            var hide = $rootScope.$on('$viewContentAnimationEnded', function() {
              hide()
              $script(['assets/js/utility/utility.js','assets/js/main.js'], function() {
                Core.init();
              })
            })
          }
				})
        .state({
					name: 'root.main',
					url: '/',
					views: {
						'main@': {
							templateUrl: 'modules/default/default.html',
              controller: 'DefaultController',
							controllerAs: 'controller'
						}
					},
					resolve: {
						_loadDefModule: function($ocLazyLoad) {
							return $ocLazyLoad.load('default')
						},
					},
          data: {
            permissions: {
              only: ['root.main']
            }
          },
					pageTitle: 'Добро пожаловать'
				})

				//Error page
				.state({
					name: 'root.main.404',
					url: '/404',
					pageTitle: 'Страница не найдена',
					views: {
            'main@': {
							templateUrl: 'layouts/404.html'
						}
					},
					authenticate: true
				})
				.state({
					name: 'root.main.registration',
					url: '/registration',
					pageTitle: 'Регистрация',
					views: {
						content: {
							templateUrl: 'modules/registration/registration.html',
							controller: 'RegistrationController',
							controllerAs: 'controller'
						}
					},
					onEnter: function(localStorageService, $rootScope) {
						if(true) {
						} else {
							console.info('Redirect back...')
							$rootScope.goBack()
						}
					},
					resolve: {
						_loadRegModule: function($ocLazyLoad) {
							return $ocLazyLoad.load('registration')
						},
						currentUser: function($rootScope) {
							return $rootScope.currentUser
						}
					},
					data: {
						permissions: {
							only: ['root.main.registration']
						}
					},
					authenticate: true
				})
				.state({
					name: 'root.aside.main.logs',
					url: '/logs',
					pageTitle: 'Системный журнал',
					views: {
						'content': {
							templateUrl: 'modules/logs/logs-list.html',
							controller: 'LogListController',
							controllerAs: 'controller'
						}
					},
					resolve: {
						_loadLogsModule: function($ocLazyLoad) {
							return $ocLazyLoad.load('logs')
						},
						logsApi: function(api) {
							return api.log;
						}
					},
					data: {
						permissions: {
							only: ['root.aside.main.logs']
						}
					},
					authenticate: true
				})
/*
        $futureStateProvider.addResolve(function($q){})
        $futureStateProvider.futureState({})
*/
		}
	])
	.run([
		'$rootScope', '$state', '$log',
		function($rootScope, $state, $log){

			$rootScope.$state = $state;

			$rootScope.$on('$stateChangeroot',
				function(event, toState, toParams, fromState, fromParams){
					$log.info(event.name, toState.name);
				})
			$rootScope.$on('$stateChangeSuccess',
				function(event, toState, toParams, fromState, fromParams){
					$log.info(event.name, toState.name);
				})
			$rootScope.$on('$stateChangeError',
				function(event, toState, toParams, fromState, fromParams, error){
					$log.error(event.name, error)
					$log.info(event, toState, toParams, fromState, fromParams)
				})
			$rootScope.$on('$stateNotFound',
				function(event, unfoundState, fromState, fromParams){
					$log.warn(event.name, unfoundState.to);
					$log.warn(unfoundState.toParams);
					$log.warn(unfoundState.options); // {inherit:false} + default options

					var toState = unfoundState.to,
						toStateParent = toState;

					//if (toState.name.indexOf(".")) {
					//	// Check if parent state is a valid state
					//	var firstToState = toState.name.split(".")[0];
					//	if ($state.get(firstToState)) {
					//		$log.log("Parent state '" + firstToState + "' found for '" + toState + "'" );
					//		toStateParent = firstToState;
                    //
					//		// Load first the parent state
					//		$state.go(toStateParent).then(function (resolved) {
					//			// Only go to final state if it exists.
					//			if ($state.get(toState)) {
					//				return $state.go(toState);
					//			} else {
					//				// Go back to calling state
					//				$log.log("Going back to ", fromState);
					//				return $state.go(fromState.name);
					//			}
					//		});
					//		event.preventDefault();
					//	} else {
							$log.error(toState, " state not found.");
					//	}
					//}
				})
		}
	])
