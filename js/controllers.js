var bubbleController = angular.module('bubbleController', ['ngDialog']);
var ref = new Firebase("https://bubbleview.firebaseio.com");


bubbleController.factory("dataStorage", function() {
    var dataS = {};
    dataS.nodes = new vis.DataSet();
    dataS.edges = new vis.DataSet();
    var uid = null;

    dataS.addNode = function(data) {
        if (dataS.nodes.getIds().indexOf(data.id) > -1){
            dataS.nodes.update(data);
        }
        else{
            dataS.nodes.add(data);
            dataS.nodeId++;
        }
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
}])

bubbleController.directive('showBubbles',['$http', 'dataStorage', '$firebaseArray', '$location', function($http, dataStorage, $firebaseArray, $location) {
    var Controller;
    var userData = $firebaseArray(ref);

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

        function backup(nodes, edges){
            var uid = dataStorage.uid;
            ref.child(uid).set({
                "nodes": nodes,
                "edges": edges
            })
        }
        function deleteStuff(data){
            for (var i = 0; i < data.nodes.length; i++){
                dataStorage.nodes.remove(data.nodes[i]);
            }
            for (var i = 0; i < data.edges.length; i++){
                dataStorage.edges.remove(data.edges[i]);
            }
            backup(dataStorage.getNodes(), dataStorage.getEdges());
        }
        function saveData(data, callback) {
            console.log(data);
            data.label = document.getElementById('node-label').value;
            data.size = parseInt(document.getElementById('node-size').value);
            data.color = getColor(document.getElementById('node-color').value);
            data.shape = 'dot';
            dataStorage.addNode(data);
            backup(dataStorage.getNodes(), dataStorage.getEdges());
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

            var nodes = [];
            var edges = []; 

            if (dataStorage.uid == null){
                $location.path('/home');
            }
            else{
                var datum = userData.$getRecord(dataStorage.uid);
                if (datum != null){
                    console.log(datum);
                    nodes = datum.nodes;
                    if (datum.edges == null){
                        edges = []
                    }
                    else{
                        edges = datum.edges;
                    }
                }
            }

            var container = document.getElementById('mynetwork');
            //Doesn't get the element for some reason

            var options = {
                manipulation: {
                    addNode: function(data, callback) {
                        // filling in the popup DOM elements
                        document.getElementById('operation').innerHTML = "Add Node";
                        document.getElementById('node-label').value = "Task";
                        document.getElementById('node-size').value = 10;
                        document.getElementById('node-color').value = 1;
                        document.getElementById('saveButton').onclick = saveData.bind(this, data, callback);
                        document.getElementById('cancelButton').onclick = clearPopUp.bind();
                        document.getElementById('network-popUp').style.display = 'block';
                    },
                    editNode: function(data, callback) {
                        // filling in the popup DOM elements
                        document.getElementById('operation').innerHTML = "Edit Node";
                        document.getElementById('node-label').value = data.label;
                        document.getElementById('node-size').value = data.size;
                        document.getElementById('node-color').value = data.color;
                        document.getElementById('saveButton').onclick = saveData.bind(this, data, callback);
                        document.getElementById('cancelButton').onclick = cancelEdit.bind(this, callback);
                        document.getElementById('network-popUp').style.display = 'block';
                    },
                    deleteNode: function(data, callback) {
                        deleteStuff(data);
                        callback(data);
                    },
                    deleteEdge: function(data, callback) {
                        deleteStuff(data);
                        callback(data);
                    },
                    addEdge: function(data, callback) {
                        if (data.from == data.to) {
                            var r = confirm("Do you want to connect the node to itself?");
                            if (r == true) {
                                dataStorage.addEdge({
                                    to: data.to,
                                    from: data.from
                                })
                                callback(data);
                            }
                        } else {
                            dataStorage.addEdge({
                                to: data.to,
                                from: data.from
                            })
                            callback(data);
                            backup(dataStorage.getNodes(), dataStorage.getEdges());
                        }
                    }
                }
            };
            for (var i = 0; i < nodes.length; i++){
                dataStorage.addNode(nodes[i]);
            }
            console.log(edges);
            for (var i = 0; i < edges.length; i++){
                dataStorage.addEdge(edges[i]);
            }
            var data = {
                nodes: nodes,
                edges: edges
            }
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