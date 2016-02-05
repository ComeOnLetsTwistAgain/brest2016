angular.module('brest.controllerCode', [])

.controller('controllerCode', ['$scope', '$state' 'auth', 'code', 
function($scope, $state, auth, code) {

	$scope.validCode = function(){
		if ($scope.code =''){
			return;
		}

		code.validCode({
			code : $scope.code
		}).error(function(error){
			$scope.error = error;
		}).then(function(){
			$state.go('home');
		})
		success(function(){

		});
	}
}]);