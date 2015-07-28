var bubbleController = angular.module('myApp', ['ngDialog'])

bubbleController.controller('jsonController', ['$scope', '$http', 'ngDialog', function($scope, $http, ngDialog) {
    $scope.json = null;
    this.showButtons = true;

    this.open = function(pj) {
        $scope.jsonList = [];
        var path = "projects/proj" + pj + ".json";
        $http.get(path).then(function(data) {
            if (data.data instanceof Array){
                $scope.json = data.data;
            }
            else{
                $scope.json = data.data[Object.keys(data.data)[0]];
            }
            console.log($scope.json);
            $scope.bringUpDialoge();
        });
    };

    $scope.save = function() {
        $http.post('example.json', $scope.json).then(function(data) {
            console.log("data saved");
        });
    };

    $scope.bringUpDialoge = function() {
        ngDialog.openConfirm({
            className: 'ngdialog-theme-default',
            template: 'partials/displayJson.html',
            scope: $scope,
            controller: 'jsonDisplay as jDisplay'
        })
    }
}]);



bubbleController.controller('jsonDisplay', ['$scope', function($scope) {
    this.jList = $scope.json;

    this.printList = function(item, string) {
        string.concat("<ul>");
        for (key in item){
            if (typeof item[key] === 'string'){
                string.concat("<li>" + item[key]);
            }
            else{
                this.printList(item[key], string);
            }
        }
        string.concat("</ul>");
        console.log(string);
        return string;
    }
}]);