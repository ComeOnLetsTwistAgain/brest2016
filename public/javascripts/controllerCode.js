angular.module('brest.controllerCode', [])

.controller('controllerCode', ['$scope', '$filter', '$state', '$location', 'auth', 
function($scope, $filter, $state, $location, auth, code) {

	$scope.currentPath = $location.path();
	$scope.formData = {};

	
	$scope.codes = [

		'12345',
		'ABCDE',
		'67890',
		'FGHIJ'

	];


	$scope.checkCode = function(){
		if ($scope.theCode =''){
			return;
		}

		var found = $filter('getById')($scope.codes, $scope.formData.code);

		for (var i = 0; i <= $scope.codes.length; i++) {
			console.log($scope.codes[i]);
			if($scope.formData.code === $scope.codes[i]){
				$state.go("home");
			} else {
				$scope.error = 'Le code rentré n\'est pas correct';
			}
		};

		
		

		
	}
}])

.filter('getById', function() {
  return function(input, id) {
    var i=0, len=input.length;
    for (; i<len; i++) {
      if (+input[i] == +id) {
        return input[i];
      }
    }
    return null;
  }
});