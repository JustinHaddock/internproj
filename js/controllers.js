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
    this.items = $scope.json;

}]);

bubbleController.directive('listData', function() {
  var Controller;
  
  Controller = function () {
    var listData = this;

    listData.isArray = function (value) {
      return value.constructor === Array
    };
    
    listData.isObject = function (value) {
      return value.constructor === Object
    };
    
    return listData;
  };
  
  return {
    restrict: "E",
    controller: Controller,
    controllerAs: 'listData',
    scope: true,
    bindToController: {
      list: "="
    },
    template: 
              "<p>{{listData.list}}</p>" +
              "<ul>" +
                "<li ng-repeat='(item, value) in listData.list'>" +
                  "{{item}}" + "{{value}}" +
                  "<ul ng-if='listData.isArray(value)'>" +
                    "<li ng-repeat='item in value' ng-include='partials/json-helper.html'>" +
                      "{{item}}" +
                    "</li>" +
                  "</ul>" +
                  "<ul ng-if='listData.isObject(value)'>" +
                    "<li ng-repeat='item in value' ng-include='partials/json-helper.html'>" +
                      "{{item}}" +
                    "</li>" +
                  "</ul>" +
                "</li>" +
              "</ul>"
  };
  
});