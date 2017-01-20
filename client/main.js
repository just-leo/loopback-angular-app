;(function(){
	var app = {};

	app.DEBUG = false;
	app.StartTime = Date.now();
	app.workingTime = function(){
		return (Date.now() - app.StartTime)/1000
	};
	app.version = '0.0.1-device';

	if(console.info){
		console.info(app.version)
	}

	this.app = app;

}).call(this)

$script.urlArgs('_v='+app.version);
$script.path('../');

$script([
	//'node_modules/angular/angular.js',//in index.html
	'node_modules/lodash/lodash.min.js',
	'node_modules/angular-moment/node_modules/moment/min/moment.min.js',
	'node_modules/angular-i18n/angular-locale_ru-ua.js',
	'node_modules/angular-ui-router/release/angular-ui-router.js',
	'node_modules/angular-animate/angular-animate.min.js',
	'node_modules/angular-sanitize/angular-sanitize.min.js',
	'node_modules/angular-touch/angular-touch.min.js',
	'node_modules/angular-local-storage/dist/angular-local-storage.min.js'
], 'angular', function() {

	$script([
		'node_modules/angular-permission/dist/angular-permission.min.js',
		'node_modules/angular-moment/node_modules/moment/locale/ru.js',//decoupled from moment
		'node_modules/angular-loading-bar/build/loading-bar.min.js',
		'node_modules/angular-ui-notification/dist/angular-ui-notification.min.js',
		'node_modules/angular-resource/angular-resource.min.js',
		'node_modules/oclazyload/dist/ocLazyLoad.min.js',
		'node_modules/angular-moment/angular-moment.min.js',
		'node_modules/angular-strap/dist/angular-strap.min.js',
    'node_modules/angular-breadcrumb/dist/angular-breadcrumb.min.js'
	], 'modules', function() {

		$script([
			'node_modules/angular-permission/dist/angular-permission-ui.js',
			'node_modules/angular-strap/dist/angular-strap.tpl.min.js',
      'components/services/lb-services.js',
			'core/services/app.core.auth.interceptor.js',
			'config/app.config.api.js',
			'config/app.config.autoload.js',
			'config/app.config.routes.js',
      'assets/plugins/core.min.js'
		], 'app')

	})

});



$script
	.ready('angular', function () {
		console.info(app.workingTime(), 'angular READY')
	})
	.ready('modules', function () {
		console.info(app.workingTime(), 'modules READY')
	})
	.ready('app', function() {
		console.info(app.workingTime(), 'Loading app...')
		$script.order([
			'config/app.config.js',
			'core/app.core.module.js'
		], function() {
			console.info(app.workingTime(), 'Starting...')
			angular.bootstrap(document, ['app.core']);
		})
	})
