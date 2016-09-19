'use strict';
/* App routes */
angular
	.module('app.config.routes', ['ui.router', 'LocalStorageModule', 'permission', 'permission.ui'])
	.constant('DEFAULT_URL', '/')
	.constant('DEFAULT_ROUTE_URL', '/')
	.constant('STATES', {
		LOGINPAGE: 'external.layout.login',
		REGISTRATION: 'external.layout.registration',
		DEFAULT: 'dashboard.layout.default',
		MAINPAGE: 'dashboard.layout.default',
		ERROR_NOTFOUND: 'dashboard.layout.404'
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
        .state({
          name: 'external',
          abstract: true,
          templateUrl: 'layouts/external.html'
        })
        .state({
          name: 'external.layout',
          abstract: true
        })
        .state({
          name: 'external.layout.registration',
          url: '/registration',
					pageTitle: 'Регистрация',
          views: {
            'content@external': {
              templateUrl: 'modules/registration/registration.html',
              controller: 'RegistrationController',
              controllerAs: 'controller'
            }
          },
          resolve: {
            _loadRegModule: function($ocLazyLoad) {
              return $ocLazyLoad.load('registration')
            }
          },
          //onEnter: function() {
          //  CanvasBG.init({
          //    Loc: {
          //      x: window.innerWidth / 2.1,
          //      y: window.innerHeight / 4.2
          //    },
          //  })
          //},
          data: {
            permissions: {
              only: ['external.layout.registration']
            }
          },
          authenticate: false
        })
        .state({
          name: 'external.layout.login',
          url: '/login',
          pageTitle: 'Логин',
          views: {
            'content@external': {
              templateUrl: 'modules/login/login.html',
              controller: 'LoginController',
              controllerAs: 'controller'
            }
          },
          resolve: {
            _loadRegModule: function($ocLazyLoad) {
              return $ocLazyLoad.load('login')
            }
          },
          data: {
            permissions: {
              only: ['external.layout.login']
            }
          },
          authenticate: false
        })
				.state({
					name: 'dashboard',
					abstract: true,
          templateUrl: 'layouts/dashboard.html'
				})
        .state({
          name: 'dashboard.layout',
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
					name: 'dashboard.layout.default',
					url: '/',
					views: {
						'content@dashboard': {
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
              only: ['dashboard.layout.default']
            }
          },
					pageTitle: 'Добро пожаловать',
          authenticate: true
				})

				//Error page
				.state({
					name: 'dashboard.layout.404',
					url: '/404',
					pageTitle: 'Страница не найдена',
					views: {
            content: {
							templateUrl: 'layouts/404.html'
						}
					},
					authenticate: true
				})
				.state({
					name: 'dashboard.layout.logs',
					url: '/logs',
					pageTitle: 'Системный журнал',
					data: {
						permissions: {
							only: ['dashboard.layout.logs']
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
