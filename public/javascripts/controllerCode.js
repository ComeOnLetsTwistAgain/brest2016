angular.module('brest.controllerCode', [])

.controller('controllerCode', ['$scope', '$filter', '$location', 'auth', 
function($scope, $filter, $location, auth, code) {

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

		console.log(found);
		

		
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