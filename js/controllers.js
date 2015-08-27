var bubbleController = angular.module('bubbleController', ['ngDialog']);
var ref = new Firebase("https://bubbleview.firebaseio.com");


bubbleController.factory("dataStorage", function() {
    var dataS = {};
    dataS.nodes = new vis.DataSet();
    dataS.edges = new vis.DataSet();
    var uid = null;
    var projName;

    dataS.addNode = function(data){
        if (dataS.nodes.getIds().indexOf(data.id) > -1){
            dataS.nodes.update(data);
        }
        else{
            dataS.nodes.add(data);
            dataS.nodeId++;
        }
    };

    dataS.resetEdges = function() {
        dataS.edges = new vis.DataSet();
    };

    dataS.resetAll = function(){
        dataS.nodes = new vis.DataSet();
        dataS.edges = new vis.DataSet();
    }
    dataS.addEdge = function(edge){
        dataS.edges.add(edge);
    }

    dataS.getNodes = function() {
        return dataS.nodes.get();
    };

    dataS.getEdges = function() {
        return dataS.edges.get();
    }
    return dataS
});


bubbleController.directive('showBubbles',['dataStorage', '$route', '$routeParams', '$firebaseArray', '$location', '$q', function(dataStorage, $routeParams, $route, $firebaseArray, $location, $q) {
    var Controller;
    var userData = $firebaseArray(ref);


    Controller = function() {
        var listData = this;
        var data;
        var nodes = dataStorage.getNodes();
        var edges = dataStorage.getEdges();
        var network;
        var theOptions;

        // STATISTICS
        listData.maxSizeSprint;
        listData.maxSizeHour;
        listData.numNodes;
        listData.totalHours;
        listData.totalSprints;

        // Math divisors
        var hMult = 2;
        var sMult = 10;
        // if (dataStorage.uid == null){
        //     $location.path('/home');
        // }
        var uid = localStorage.getItem('uid');
        
        function clearPopUp() {
            document.getElementById('saveButton').onclick = null;
            document.getElementById('cancelButton').onclick = null;
            document.getElementById('network-popUp').style.display = 'none';
        }

        function cancelEdit(callback) {
            clearPopUp();
            callback(null);
        }
        listData.getProjName = function(){
            return dataStorage.projName
        }
        function backup(nodes, edges){
            ref.child(uid).child(projNum).update({
                "nodes": nodes,
                "edges": edges
            })
        }

        listData.resetPanel = function(){
            dataStorage.resetAll();
            backup([], []);
            network.setData({
                    nodes: new vis.DataSet(),
                    edges: new vis.DataSet()
                });
        }

        listData.logoutUser = function() {
            dataStorage.uid = null;
            ref.unauth();
            $location.path('/home');
        }
        listData.togglePhysics = function(){
            if (theOptions.physics.enabled){
                theOptions.physics.enabled = false;
            }
            else{
                theOptions.physics.enabled = true;
            }
            network.setOptions(theOptions);
        }

        function deleteStuff(data, network){
            var nodeId = data.nodes[0];
            dataStorage.nodes.remove(nodeId);
            setEdges(network);
            backup(dataStorage.getNodes(), dataStorage.getEdges());
        }
        function saveData(data, callback) {
            var newData = {
                id: data.id,
                label: document.getElementById('node-label').value,
                size: parseInt(document.getElementById('node-size').value),
                color: getColor(document.getElementById('node-color').value),
                unit: document.getElementById('node-unit').value,
                title: "Effort: " + parseInt(document.getElementById('node-size').value) + " " + document.getElementById('node-unit').value + ", Importance: " + parseInt(document.getElementById('node-color').value),
                shape: 'dot'
            }
            if (newData.unit == "Sprints"){
                newData.size = (newData.size*sMult);
            }
            else{
                newData.size = (newData.size*hMult);
            }
            if (newData.size > 100){
                newData.size = 100;
            }
            dataStorage.addNode(newData);
            backup(dataStorage.getNodes(), dataStorage.getEdges());
            clearPopUp();
            callback(newData);
        }

        function setEdges(network){
            var edges = network.body.data.edges.get();
            dataStorage.resetEdges();
            for (var i = 0; i < edges.length; i++){
                dataStorage.edges.add(edges[i]);
            }
            backup(dataStorage.getNodes(), dataStorage.getEdges());
        }
        function getNumber(color) {
            switch (color) {
                case '#FF9999':
                    return "1";  
                    break;
                case '#FF6666':
                    return "2";
                    break;
                case '#FF3333':
                    return "3";
                    break;
                case '#FF0000':
                    return "4";
                    break;
                default:
                    return "5";
                    break;
            }
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
        function getUserData(){
            var deferred = $q.defer();
            var data = $firebaseArray(ref).$loaded(
                function(data){
                    deferred.resolve(data);
                }
            );
            return deferred.promise
        }

        function getNodeData(userData){
            var projNum = $routeParams.current.params.projId
            var allTheData = []

            if (userData.$getRecord(uid) != null){
                thisUser = userData.$getRecord(uid);
                if (thisUser[projNum] != null){
                    projectData = thisUser[projNum];
                    if (projectData.nodes != null){
                        allTheData[0] = projectData.nodes;
                    }
                    else{
                        allTheData[0] = [];
                    }
                    if (projectData.edges != null){
                        allTheData[1] = projectData.edges;
                    }
                    else{
                        allTheData[1] = [];
                    }
                    this.projName = projectData.name
                }
            }
            return allTheData
        }

        function makeTheNetwork(nodes, edges){

            dataStorage.resetAll();

            var container = document.getElementById('mynetwork');

            var options = {
                physics: {
                    enabled: true,
                },
                manipulation: {
                    addNode: function(data, callback) {
                        // filling in the popup DOM elements
                        document.getElementById('operation').innerHTML = "Add Node";
                        document.getElementById('node-label').value = "Task";
                        document.getElementById('node-size').value = sMult;
                        document.getElementById('node-color').value = 1;
                        document.getElementById('node-unit').value = "Hours";
                        document.getElementById('saveButton').onclick = saveData.bind(this, data, callback);
                        document.getElementById('cancelButton').onclick = clearPopUp.bind();
                        document.getElementById('network-popUp').style.display = 'block';
                    },
                    editNode: function(data, callback) {
                        // filling in the popup DOM elements
                        document.getElementById('operation').innerHTML = "Edit Node";
                        document.getElementById('node-label').value = data.label;
                        document.getElementById('node-size').value = data.size;
                        document.getElementById('node-unit').value = data.unit;
                        if (data.unit == "Sprints"){
                            document.getElementById('node-size').value = data.size/sMult;
                        }
                        else{
                            document.getElementById('node-size').value = data.size/hMult;   
                        }
                        document.getElementById('node-color').value = getNumber(data.color.background);
                        document.getElementById('saveButton').onclick = saveData.bind(this, data, callback);
                        document.getElementById('cancelButton').onclick = cancelEdit.bind(this, callback);
                        document.getElementById('network-popUp').style.display = 'block';
                    },
                    deleteNode: function(data, callback) {
                        deleteStuff(data, network);
                        callback(data);
                    },
                    deleteEdge: function(data, callback) {
                        callback(data);
                        setEdges(network);
                    },
                    addEdge: function(data, callback) {
                        // data.arrows = {
                        //     to: true
                        // }
                        if (data.from == data.to) {
                            var r = confirm("Do you want to connect the node to itself?");
                            if (r == true) {
                                callback(data);
                            }
                        } else {
                            callback(data);
                        }
                        setEdges(network);
                    }
                }
            };
            theOptions = options;
            for (var i = 0; i < nodes.length; i++){
                dataStorage.addNode(nodes[i]);
            }
            for (var i = 0; i < edges.length; i++){
                dataStorage.addEdge(edges[i]);
            }
            var data = {
                nodes: nodes,
                edges: edges
            }
            network = new vis.Network(container, data, options);
        }

        listData.open = (function() {

            getUserData().then(function(res){
                var allTheData = getNodeData(res);
                nodes = allTheData[0]
                edges = allTheData[1]
                makeTheNetwork(nodes, edges);
                
            });

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