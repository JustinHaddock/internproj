var myApp = angular.module('bubbleView', [
	'ngRoute',
	'myApp'
])


myApp.config(['$routeProvider', function($routeProvider) {
	$routeProvider.
	when('/home', {
		templateUrl: 'partials/edit.html',
		controller: 'jsonController as jCont'
	}).
	otherwise({
		redirectTo: '/home'
	});
}]);