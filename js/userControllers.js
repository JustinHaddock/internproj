var userController = angular.module('userController', ['ngDialog']);
var ref = new Firebase("https://bubbleview.firebaseio.com");

bubbleController.factory("userManagement", function() {
    $scope.users = $firebaseArray(ref);

    this.addUser = function(user, pass) {
		ref.createUser({
		  email    : user,
		  password : pass
		}, function(error, userData) {
		  if (error) {
		    console.log("Error creating user:", error);
		  } else {
		    console.log("Successfully created user account with uid:", userData.uid);
		  }
		});
    }

    this.loginUser = function(user, pass){
    	ref.authWithPassword({
    		email    : "bobtony@firebase.com",
    		password : "correcthorsebatterystaple"
    	}, function(error, authData) {
    		if (error) {
    			console.log("Login Failed!", error);
    		} else {
    			console.log("Authenticated successfully with payload:", authData);
    		}
    	});
    }

    this.deleteUser = function(user, pass){
    	ref.removeUser({
    		email    : "bobtony@firebase.com",
    		password : "correcthorsebatterystaple"
    	}, function(error) {
    		if (error === null) {
    			console.log("User removed successfully");
    		} else {
    			console.log("Error removing user:", error);
    		}
    	});
    }
});