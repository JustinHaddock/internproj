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
		templateUrl: 'partials/buildData.html',
		controller: 'dataController as data'
	}).
	when('/display/:projNum', {
		templateUrl: 'partials/show.html'
	}).
	otherwise({
		redirectTo: '/home'
	});
}]);