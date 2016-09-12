'use strict';

angular
	.module('app.config.api', [
		'restangular'
	])
	.constant('ALLOW_PUBLIC_API', false)
	.config(['RestangularProvider', 'ALLOW_PUBLIC_API', function(RestangularProvider, ALLOW_PUBLIC_API) {
		var host = location.host;
		if((host.indexOf('localhost') > -1) || (host.indexOf('127.0.0.1') > -1)) {
			RestangularProvider.setBaseUrl('http://localhost/api');
		} else if(ALLOW_PUBLIC_API){
			RestangularProvider.setBaseUrl(location.protocol + '//' + location.hostname + '/api');
		} else {
			RestangularProvider.setBaseUrl('http://192.168.0.100/api');
		}

		RestangularProvider.setDefaultHttpFields(
			{
				withCredentials: true,
				cache: false,
				_format: 'json'
			}
		)

		RestangularProvider.setFullResponse(false)

		// In this case we are mapping the id of each element to the _id field.
		// We also change the Restangular route.
		// The default value for parentResource remains the same.
		//RestangularProvider.setRestangularFields({
		//	id: "ID",
		//	//selfLink: "self.href"
		//})

		RestangularProvider.setResponseExtractor(function(response, operation) {
			if('getList' === operation && angular.isArray(response.items)) {
				var result = response.items;
				result._meta = response._meta;
				return result
			} else {
				return response
			}
		})
	}])
	.config(['apiProvider', function(apiProvider){

		//apiProvider.restService = '';

		apiProvider
			.addEndpoint('objects', {
				route: 'object'
			})
			.addEndpoint('auth', [
				{
					name: 'login',
					path: 'login/by-card',
					method: 'post'
				},
				{
					name: 'logout',
					path: 'login/logout',
					method: 'post'
				},
				{
					name: 'registration',
					path: 'login',
					method: 'post'
				}
			])
			.addEndpoint('log')
	}])
