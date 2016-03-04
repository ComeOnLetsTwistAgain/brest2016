angular.module('brest.controllerAuth', [])
.controller('controllerAuth', ['$scope', '$state', 'auth',
function($scope, $state, auth) {
	$scope.user = {};
	$scope.users = auth.users;
	$scope.currentUsername = auth.currentUser();

	$scope.register = function() {

		auth.register($scope.user).error(function(error) {
			$scope.error = "Ce nom d'utilisateur n'est pas disponible";
		}).then(function() {
			$state.go('home');
		});
	};

	$scope.logIn = function() {
		auth.logIn($scope.user).error(function(error) {
			$scope.error = "Le nom d'utilisateur ou le mot de passe n'est pas correct";
		}).then(function() {
			$state.go('home');
		});
	};

	$scope.deleteUser = function(index_in_scope){
		var u = $scope.users[index_in_scope];
		if(u._id === ''){ return; }

		auth.delete(u._id).success(function(){
			$scope.users.splice(index_in_scope, 1);
		});
	};
}]);