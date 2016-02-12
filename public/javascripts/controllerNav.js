angular.module('brest.controllerNav', [])

.controller('controllerNav', ['$scope', 'auth',
function($scope, auth) {
	$scope.isLoggedIn = auth.isLoggedIn;
	$scope.currentUser = auth.currentUser;
	$scope.logOut = auth.logOut;
	$scope.isAdmin = auth.isAdmin;
	$scope.currentPath = auth.getCurrentPath;

	
}]);