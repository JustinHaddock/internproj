var myApp = angular.module('internApp', [
	'ngRoute',
	'bubbleController'
])


myApp.config(['$routeProvider', function($routeProvider) {
	$routeProvider.
	when('/home', {
		templateUrl: 'partials/edit.html',
		controller: 'jsonController as jCont'
	}).
	when('/display/:projNum', {
		templateUrl: 'partials/show.html',
		controller: 'garbageController as garbage'
	}).
	otherwise({
		redirectTo: '/home'
	});
}]);