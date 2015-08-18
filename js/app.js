var myApp = angular.module('internApp', [
	'ngRoute',
	'bubbleController',
	'userController'
])


myApp.config(['$routeProvider', function($routeProvider) {
	$routeProvider.
	when('/home', {
		controller: 'userManagement as login',
		templateUrl: 'partials/home.html'
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