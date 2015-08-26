var myApp = angular.module('internApp', [
	'ngRoute',
	'bubbleController',
	'userController',
	'choiceController'
])


myApp.config(['$routeProvider', function($routeProvider) {
	$routeProvider.
	when('/home', {
		controller: 'userManagement as login',
		templateUrl: 'partials/home.html'
	}).
	when('/collect/:projId', {
		templateUrl: 'partials/buildData.html'
	}).
	when('/projects', {
		controller: 'projectChooseController as choice',
		templateUrl: 'partials/projectChoose.html'
	}).
	otherwise({
		redirectTo: '/home'
	});
}]);