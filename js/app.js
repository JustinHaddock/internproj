var myApp = angular.module('internApp', [
	'ngRoute',
	'bubbleController'
])


myApp.config(['$routeProvider', function($routeProvider) {
	$routeProvider.
	when('/home', {
		controller: 'jsonController as jCont'
	}).
	when('/display/:projNum', {
		controller: 'garbageController as garbage'
	}).
	otherwise({
		redirectTo: '/home'
	});
}]);