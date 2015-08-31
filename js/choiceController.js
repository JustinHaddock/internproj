var choiceController = angular.module('choiceController', ['firebase', 'ngDialog']);
var ref = new Firebase("https://bubbleview.firebaseio.com");

choiceController.controller("projectChooseController", ['dataStorage', 'ngDialog', '$scope', '$firebaseArray', "$location", function(dataStorage, ngDialog, $scope, $firebaseArray, $location, names) {
	var uid = dataStorage.uid;
	$scope.projNames = []
	$scope.projNames[0] = "";
	$scope.projNames[1] = "";
	$scope.projNames[2] = "";
	this.loaded = false;
	if (dataStorage.uid == null){
        $location.path('/home');
    }
    this.initializeNames = function(){
        var fireData = $firebaseArray(ref);
        fireData.$loaded(function () {
          userData = fireData.$getRecord(uid);
          $scope.projNames[0] = userData["1"]["name"]
          $scope.projNames[1] = userData["2"]["name"]
          $scope.projNames[2] = userData["3"]["name"]
      	});
    }
  	this.initializeNames();
  	this.getName = function(num){
  		if ($scope.projNames[num] == ""){
  			return false
  		}
  		else{
  			return $scope.projNames[num]
  		}
  	}

    this.logoutUser = function() {
        dataStorage.uid = null;
        ref.unauth();
        $location.path('/home');
    }

  	this.loadName = function(num){
  		dataStorage.projName = $scope.projNames[num]
  	}

	this.changeName = function(projNum){
		$scope.projNum = projNum;
		var uid = dataStorage.uid;
		ngDialog.openConfirm({
			className: 'ngdialog-theme-default',
            template: 'partials/changeName.html',
            controller: 'newNameController as NNC',
            scope: $scope
        })
        this.initializeNames();
	}
}]);

choiceController.controller("newNameController", ['dataStorage', '$scope', '$route', function(dataStorage, $scope, $route) {
	this.newName = "";

	this.changeName = function(){
		var uid = dataStorage.uid
		ref.child(uid).child($scope.projNum).update({
			"name": this.newName
		});
		$scope.closeThisDialog(0);
    $route.reload();
	}
}]);
