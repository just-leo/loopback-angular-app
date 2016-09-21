'use strict'
/* Lazy loader module-config */
angular
	.module('app.config.autoload', [
		'oc.lazyLoad'
	])
	.constant('autoloaderDebugMode', false)
	.constant('modulesToLoad', [
		{
			name: 'header',
			serie: true,
			files: [
				'modules/header/header.module.js',
				'modules/header/header.controller.js'
			]
		},
    {
      name: 'registration',
      serie: true,
      files: [
        'modules/registration/registration.module.js',
        'modules/registration/registration.controller.js'
      ]
    },
    {
      name: 'login',
      files: [
        'modules/login/login.module.js'
      ]
    },
		{
			name: 'welcome',
			files: [
				'modules/welcome/welcome.module.js'
			]
		},
		{
			name: 'default',
			files: [
				'modules/default/default.module.js'
			]
		},
    {
      name: 'charts',
      files: [
        'modules/charts/charts.module.js'
      ]
    },
		{
			name: 'objects',
			serie: true,
			files: [
				'modules/objects/objects.module.js',
				'modules/objects/object-list.controller.js',
				'modules/objects/object.controller.js'
			]
		},
		{
			name: 'logs',
			serie: true,
			files: [
				'modules/logs/logs.module.js',
				'modules/logs/log-list.controller.js'
			]
		},
		{
			name: 'cron-control',
			serie: true,
			files: [
				'node_modules/jquery/dist/jquery.js',
				'components/cron/jqcron/src/jqCron.js',
				'components/cron/cron-control.js',
				'components/cron/jqcron/src/jqCron.css'
			]
		},
		{
			name: 'ngTable',
			files: [
				'node_modules/ng-table/dist/ng-table.min.js',
				'node_modules/ng-table/dist/ng-table.min.css'
			]
		},
		{
			name: 'ui.select',
			files: [
				'node_modules/ui-select/dist/select.min.js'
			]
		},
		{
			name: 'xeditable',
			files: [
				'node_modules/angular-xeditable/dist/js/xeditable.min.js',
				'node_modules/angular-xeditable/dist/css/xeditable.min.css'
			]
		},
    {
      name: 'highcharts-ng',
      serie: true,
      files: [
        'node_modules/highcharts/highcharts.js',
        'node_modules/highcharts-ng/dist/highcharts-ng.min.js',
        //'node_modules/highcharts-ng/dist/lazyload.min.js'
      ]

    }
	])
	.config([
		'$ocLazyLoadProvider', 'modulesToLoad', 'autoloaderDebugMode',
		function($ocLazyLoadProvider, modulesToLoad, autoloaderDebugMode) {
			//if(debug) {
			//	angular.forEach(modules, function (module) {
			//		module.cache = false
			//	})
			//}

			$ocLazyLoadProvider.config({
				debug: autoloaderDebugMode,
				events: false,
				modules: modulesToLoad
				//jsLoader: function (paths, callback, params) {
				//	params.serie ? $script.order(paths, callback) : $script(paths, callback)
				//},
			})
		}
	])
