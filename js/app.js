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
	when('/collect/:projId', {
		controller: 'dataController',
		templateUrl: 'partials/buildData.html'
	}).
	when('/projects', {
		templateUrl: 'partials/projectChoose.html'
	}).
	otherwise({
		redirectTo: '/home'
	});
}]);