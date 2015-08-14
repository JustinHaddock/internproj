var bubbleController = angular.module('bubbleController', ['ngDialog']);
//var ref = new Firebase("https://<YOUR-FIREBASE-APP>.firebaseio.com");


bubbleController.factory("dataStorage", function() {
    var dataS = {};
    dataS.nodes = new vis.DataSet();
    dataS.edges = new vis.DataSet();
    var toUpdate = null;

    dataS.addNode = function(data) {
        dataS.nodes.add(data);
        dataS.nodeId++;
        console.log(dataS.nodes.get());
    };
    dataS.addEdge = function(edge) {
        dataS.edges.add(edge);
        dataS.edgeId++;
    };

    dataS.getNodes = function() {
        return dataS.nodes.get();
    };

    dataS.getEdges = function() {
        return dataS.edges.get();
    }
    return dataS
});

bubbleController.controller('dataController', ['$scope', 'dataStorage', function($scope, dataStorage){
  $scope.nodes = dataStorage.getNodes();
  $scope.edges = dataStorage.getEdges();
  // $scope.$watch(function () {return dataStorage.nodes}, function (newVal, oldVal){
  //   if (typeof newVal !== 'undefined') {
  //       $scope.nodes = dataStorage.nodes.get();
  //   }
  // })
}])

bubbleController.directive('showBubbles',['$http', 'dataStorage', function($http, dataStorage) {
    var Controller;

    Controller = function() {
        var listData = this;
        var seed = 2;
        var data;

        function clearPopUp() {
            document.getElementById('saveButton').onclick = null;
            document.getElementById('cancelButton').onclick = null;
            document.getElementById('network-popUp').style.display = 'none';
        }

        function cancelEdit(callback) {
            clearPopUp();
            callback(null);
        }

        function saveData(data, callback) {
            data.label = document.getElementById('node-label').value;
            data.size = parseInt(document.getElementById('node-size').value);
            data.color = getColor(document.getElementById('node-color').value);
            data.shape = 'dot';
            clearPopUp();
            callback(data);
        }

        function getColor(importance) {
            switch (importance) {
                case '1':
                    return "#FF9999";  
                    break;
                case '2':
                    return "#FF6666";
                    break;
                case '3':
                    return "#FF3333";
                    break;
                case '4':
                    return "#FF0000";
                    break;
                default:
                    return "#CC0000";
                    break;
            }
        }
        listData.open = (function() {
            nodes = [];
            edges = [];

            var container = document.getElementById('mynetwork');
            //Doesn't get the element for some reason

            var options = {
                manipulation: {
                    addNode: function(data, callback) {
                        // filling in the popup DOM elements
                        document.getElementById('operation').innerHTML = "Add Node";
                        document.getElementById('node-label').value = data.label;
                        document.getElementById('node-size').value = data.size;
                        document.getElementById('saveButton').onclick = saveData.bind(this, data, callback);
                        document.getElementById('cancelButton').onclick = clearPopUp.bind();
                        document.getElementById('network-popUp').style.display = 'block';
                    },
                    editNode: function(data, callback) {
                        // filling in the popup DOM elements
                        document.getElementById('operation').innerHTML = "Edit Node";
                        document.getElementById('node-label').value = data.label;
                        document.getElementById('node-size').value = data.size;
                        document.getElementById('saveButton').onclick = saveData.bind(this, data, callback);
                        document.getElementById('cancelButton').onclick = cancelEdit.bind(this, callback);
                        document.getElementById('network-popUp').style.display = 'block';
                    },
                    addEdge: function(data, callback) {
                        if (data.from == data.to) {
                            var r = confirm("Do you want to connect the node to itself?");
                            if (r == true) {
                                callback(data);
                            }
                        } else {
                            callback(data);
                        }
                    }
                }
            };

            var network = new vis.Network(container, data, options);
        })();
        return listData;
    };

    return {
        restrict: "E",
        controller: Controller,
        controllerAs: 'listData',
        scope: true,
        templateUrl: "partials/theDisplay.html"
    }
}]);