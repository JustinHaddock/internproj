var bubbleController = angular.module('bubbleController', []);


bubbleController.directive('showBubbles', ['$http', function($http) {
    var Controller;

    Controller = function () {
        var listData = this;
        var currentNode = 0;
        listData.nodes = [];
        listData.edges = [];

        listData.open = (function() {
            var pj = 2;
            listData.jsonList = [];
            var path = "projects/proj" + pj + ".json";
            var gephiJSON = loadJSON(path)
            var parserOptions = {
                edges: {
                    inheritColors: false
                },
                nodes: {
                    fixed: true,
                    parseColor: false
                }
            }
            var parsed = vis.network.convertGephi(gephiJSON, parserOptions);
            var data = {
                nodes: parsed.nodes,
                edges: parsed.edges
            }

            var container = document.getElementById('mynetwork');

            var network = new vis.Network(container, data);
                // listData.makeGraph(data.data);
        })();
        
        listData.makeGraph = function(data){
            for (item in data){
                if (listData.isObject(data[item])){
                    listData.nodes.push({id: currentNode, label: data[item]});
                    currentNode += 1;
                }
                else if (listData.isArray(data[item])){
                    var preNode = currentNode;
                    listData.nodes.push({id: currentNode, label: item});
                    currentNode ++;
                    subLinks = listData.getSubtaskArray(data[item]);
                    listData.createLinks(preNode, subLinks);
                }
                else{
                    listData.nodes.push({id: currentNode, label: item});
                    currentNode += 1;
                }
            }
            console.log(listData.edges);
            console.log(listData.nodes);
            listData.finishUp();
        };
        listData.createLinks = function(beginnin, to){
            for (var i = 0; i < to.length; i++){
                listData.edges.push({from: beginnin, to: to[i]});
            }
        };
        listData.getObjectArray = function(data){
            var numList = [];
            for (proprety in data){
                if (listData.isArray(data[proprety])){
                    var tempNode = currentNode;
                    listData.nodes.push({id: currentNode, label: proprety});
                    currentNode++;
                    subLinks = listData.getSubtaskArray(data[proprety]);
                    listData.createLinks(tempNode, subLinks);
                }
                else if (listData.isObject(data[proprety])){
                    console.log(proprety);
                    var tNode = currentNode;
                    listData.nodes.push({id: currentNode, label: proprety});
                    numList.push(tNode);
                    currentNode++;
                    var sLinks = listData.getObjectArray(data[proprety]);
                    console.log(data[proprety]);
                    console.log(tNode);
                    console.log(sLinks);
                    listData.createLinks(tNode, sLinks);
                }
                else{
                    numList.push(currentNode);
                    listData.nodes.push({id: currentNode, label: proprety});
                    currentNode++;
                }

            }
            return numList;
        };
        listData.getSubtaskArray = function(data){
            var numList = [];
            for (item in data){
                if (listData.isObject(data[item])){
                    moreNum = listData.getObjectArray(data[item]);
                    for (var i = 0; i < moreNum.length; i++){
                        numList.push(moreNum[i]);
                    }
                }
                else if (listData.isArray(data[item])){
                    listData.nodes.push({id: currentNode, label: item});
                    var preNode = currentNode;
                    currentNode ++;
                    subLinks = listData.getSubtaskArray(data[item]);
                    listData.createLinks(preNode, subLinks);
                }
                else{
                    console.log(item);
                    numList.push(currentNode);
                    listData.nodes.push({id: currentNode, label: data[item]})
                    currentNode ++;
                }
            }
            return numList;
        };

        listData.isObject = function (value) {
            return value.constructor === Object
        };

        listData.isArray = function(value) {
            return value.constructor === Array
        };

        listData.finishUp = function(){
            var container = document.getElementById('mynetwork');

            var data = {
                nodes: listData.nodes,
                edges: listData.edges
            };
            var options = {};

            var network = new vis.Network(container, data, options);
        }

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
        "<div id='mynetwork'></div>"
    }
}]);



    // $scope.save = function() {
    //     $http.post('example.json', $scope.json).then(function(data) {
    //         console.log("data saved");
    //     });
    // };
