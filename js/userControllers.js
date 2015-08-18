var userController = angular.module('userController', ['firebase', 'ngDialog']);
var ref = new Firebase("https://bubbleview.firebaseio.com");

userController.controller("userManagement", ['$scope', 'ngDialog', '$location', 'dataStorage', function($scope, ngDialog, $location, dataStorage) {
    this.email = "";
    this.pass = "";
    this.emessage = "";

    this.loginUser = function() {
        ref.authWithPassword({
            email: this.email,
            password: this.pass
        }, function(error, authData) {
            if (error) {
                console.log("Login Failed!", error);
                this.emessage = error.message;
                $scope.$apply();
            } else {
                dataStorage.uid = authData.uid;
                console.log("Authenticated successfully with payload:", authData);
                $location.path('/collect');
                $scope.$apply();
            }
        }.bind(this));
    }

    this.deleteUser = function(user, pass) {
        ref.removeUser({
            email: user,
            password: pass
        }, function(error) {
            if (error === null) {
                console.log("User removed successfully");
            } else {
                this.emessage = error.message;
                console.log("Error removing user:", error);
            }
        });
    }
    this.createDialog = function(){
        $scope.email = this.email;
        $scope.password = this.pass;
        ngDialog.openConfirm({
            className: 'ngdialog-theme-default',
            template: 'partials/createUser.html',
            controller: 'createController as create',
            scope: $scope
        })
    }
    return this;
}]);

bubbleController.controller("createController", ['$scope', function($scope){
    this.email = $scope.email;
    this.pass = $scope.password;
    this.emessage = "";
    this.emessage = "";
    this.addUser = function() {
        ref.createUser({
            email: this.email,
            password: this.pass
        }, function(error, userData) {
            if (error) {
                this.emessage = error.message;
                console.log("Error creating user:", error);
                $scope.$apply();
            } else {
                console.log("Successfully created user account with uid:", userData.uid);
                $scope.closeThisDialog(0);
            }
        });
    }

}])


