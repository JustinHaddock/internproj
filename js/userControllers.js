var userController = angular.module('userController', ['firebase', 'ngDialog']);
var ref = new Firebase("https://bubbleview.firebaseio.com");


userController.controller("userManagement", ['$scope', 'ngDialog', '$location', 'dataStorage', function($scope, ngDialog, $location, dataStorage) {
    this.email = "";
    this.pass = "";
    this.emessage = "";

    ref.onAuth(function(authData) {
      if (authData) {
        dataStorage.uid = authData.uid;

        localStorage.setItem('uid', authData.uid)

        if ($location.path() == '/home'){
            $location.path('/projects');
        }
      } else {
        dataStorage.uid = null;
        $location.path('/home'); 
      }
    });

    this.loginUser = function() {
        ref.authWithPassword({
            email: this.email,
            password: this.pass,
            remember: "default"
        }, function(error, authData) {
            if (error) {
                console.log("Login Failed!", error);
                this.emessage = error.message;
                $scope.$apply();
            } else {
                dataStorage.uid = authData.uid;
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

bubbleController.controller("createController", ['$scope', '$firebaseArray', function($scope, $firebaseArray){
    var create = this;
    create.email = $scope.email;
    create.pass = $scope.password;
    create.emessage = "";

    create.addUser = function() {
        ref.createUser({
            email: create.email,
            password: create.pass
        }, function(error, userData) {
            if (error) {
                create.emessage = "Entered email is invalid";
                console.log(create);
                console.log(create.emessage);
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
                $scope.closecreateDialog(0);
            }
        });
    }
    return create;

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


