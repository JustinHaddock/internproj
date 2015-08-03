var bubbleController = angular.module('myApp', [])

bubbleController.controller('jsonController', ['$scope', '$http', function($scope, $http) {
    $scope.json = null;
    this.showButtons = true;

    this.open = function() {
        var pj = 2;
        $scope.jsonList = [];
        var path = "projects/proj" + pj + ".json";
        $http.get(path).then(function(data) {
            $scope.json = data.data;
        });
    };

    $scope.save = function() {
        $http.post('example.json', $scope.json).then(function(data) {
            console.log("data saved");
        });
    };
}]);  