var bubbleController = angular.module('myApp', ['ngDialog'])

bubbleController.controller('jsonController', ['$scope', '$http', 'ngDialog', function($scope, $http, ngDialog) {
    $scope.json = null;
    this.showButtons = true;

    this.open = function(pj) {
        $scope.jsonList = [];
        var path = "projects/proj" + pj + ".json";
        $http.get(path).then(function(data) {
            $scope.json = data.data;
            $scope.bringUpDialoge();
        });
    };

    $scope.save = function() {
        $http.post('example.json', $scope.json).then(function(data) {
            console.log("data saved");
        });
    };

    $scope.bringUpDialoge = function() {
        console.log("Dialog");
        ngDialog.openConfirm({
            className: 'ngdialog-theme-default',
            template: 'partials/displayJson.html',
            scope: $scope,
            controller: 'jsonDisplay as jDisplay'
        })
    }
}]);
bubbleController.controller('helperController', ['$scope', function($scope) {
        this.key = null;
        this.value = null;
}]);

bubbleController.controller('jsonDisplay', ['$scope', function($scope) {
    this.list = $scope.json;

    this.canRecurse = function(v) {
        if (Array.isArray(v)) return '2';
        if (typeof v == 'object') return '1';
        else return '0';
    };

}]);