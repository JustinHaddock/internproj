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
                $location.path('/projects');
                $scope.$apply(); 
            }
        }.bind(this));
    }
    
    this.logoutUser = function() {
        dataStorage.uid = null;
        $location.path('/home');
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

bubbleController.controller("createController", ['$scope', '$firebaseArray', function($scope, $firebaseArray){
    this.email = $scope.email;
    this.pass = $scope.password;
    this.emessage = "";

    this.addUser = function() {
        ref.createUser({
            email: this.email,
            password: this.pass
        }, function(error, userData) {
            if (error) {
                this.emessage = "Entered email is invalid";
                console.log(error);
                $scope.$apply();
            } else {
                console.log("Success!");
                var uid = userData.uid

                ref.child(uid).child("1").update({
                    "name": "Project 1"
                })
                ref.child(uid).child("2").update({
                    "name": "Project 2"
                })
                ref.child(uid).child("3").update({
                    "name": "Project 3"
                })
                $scope.closeThisDialog(0);
            }
        });
    }

}])

bubbleController.directive('ngConfirmClick', [
    function(){
        return {
            priority: 1,
            terminal: true,
            link: function (scope, element, attr) {
                var msg = attr.ngConfirmClick || "Are you sure?";
                var clickAction = attr.ngClick;
                element.bind('click',function (event) {
                    if ( window.confirm(msg) ) {
                        scope.$eval(clickAction)
                    }
                });
            }
        };
}])


