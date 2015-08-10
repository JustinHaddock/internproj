var bubbleController = angular.module('bubbleController', ['ngDialog']);

bubbleController.factory("dataStorage", function() {
    var dataS = {};
    dataS.nodes = [];
    dataS.edges = [];
    dataS.relations = [];
    dataS.nodeId = 0;
    dataS.addNode = function(nam, impor, effor){
        dataS.nodes.push({
            id: dataS.nodeId,
            label: nam,
            //importance: impor,
            //effort: effor
        });
        dataS.nodeId ++;
    };
    dataS.addEdge = function(origin, target){
        dataS.edges.push({
            to: origin,
            from: target
        });
    };
    dataS.getNodes = function(){
        return dataS.nodes;
    };

    dataS.getEdges = function(){
        return dataS.edges;
    }
    return dataS
})


bubbleController.controller('dataController', ['$scope', 'ngDialog', 'dataStorage', function($scope, ngDialog, dataStorage) {
    this.dpName = "";
    this.dpImp = "";
    this.dpEff = "";
    $scope.relations = [];

    this.printRelations = function(){
        var ret = $scope.relations;
        return ret;
    }
    this.addNode = function(){
        dataStorage.addNode(this.dpName, this.dpImp, this.dpEff);
        this.setRelations();
        this.dpName = "";
        this.dpImp = "";
        this.dpEff = "";
    };
    this.getRelations = function(){
        $scope.dpName = this.dpName;
        $scope.dpImp = this.dpImp;
        $scope.dpEff = this.dpEff;
        ngDialog.openConfirm({
            className: 'ngdialog-theme-default',
            template: 'partials/getSelections.html',
            controller: 'nodeController as nodeC',
            scope: $scope
        })
    };
    this.openVisual = function() {
        console.log("WTF");
        ngDialog.openConfirm({
            className: 'ngdialog-theme-default',
            template: 'partials/showBubbles.html'
        })
    };
    this.setRelations = function(){
        for (var i = 0; i < $scope.relations.length; i++){
            var num = $scope.relations[i];
            dataStorage.addEdge(dataStorage.nodeId+1, num);
        }
        $scope.relations.length = 0;
        console.log(dataStorage.nodes);
        console.log(dataStorage.edges);
    }

}]);

bubbleController.controller('nodeController', ['dataStorage', '$scope', function(dataStorage, $scope){
    this.names = [];
    this.getNames = function(){
        var nameList = [];
        nodeList = dataStorage.getNodes();
        for (var i = 0; i < nodeList.length; i++){
            nameList.push({
                name: nodeList[i].label,
                id: nodeList[i].id,
                selected: false
            });
        }
        this.names = nameList;
    };
    this.storeRelations = function() {
        $scope.relations.length = 0;
        for (var i = 0; i < this.names.length; i++){
            if (this.names[i].selected){
                $scope.relations.push(this.names[i].id);
            }
        }
        $scope.closeThisDialog(0);
    }
    this.getNames();
}])


bubbleController.directive('showBubbles', ['$http', 'dataStorage', function($http, dataStorage) {
    var Controller;

    Controller = function () {
        var listData = this;
        listData.nodes = dataStorage.getNodes();
        listData.edges = dataStorage.getEdges();
        console.log(listData.nodes);
        console.log(listData.edges);

        listData.open = (function() {

            var container = document.getElementById('mynetwork');

            var data = {
                nodes: listData.nodes,
                edges: listData.edges
            };
            var options = {
                height: '100%',
                width: '100%'
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
        // bindToController: {
        //     list: "="
        // },
        template: 
        "<div id='mynetwork'></div>"
    }
}]);