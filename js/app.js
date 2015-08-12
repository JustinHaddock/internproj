var myApp = angular.module('internApp', [
	'ngRoute',
	'bubbleController'
])


myApp.config(['$routeProvider', function($routeProvider) {
	$routeProvider.
	when('/home', {
		templateUrl: 'partials/edit.html'
	}).
	when('/collect', {
		controller: 'dataController',
		templateUrl: 'partials/buildData.html'
	}).
	when('/display/:projNum', {
		templateUrl: 'partials/show.html'
	}).
	otherwise({
		redirectTo: '/home'
	});
}]);