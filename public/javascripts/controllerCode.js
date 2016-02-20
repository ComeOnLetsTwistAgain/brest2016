angular.module('brest.controllerCode', [])

.controller('controllerCode', ['$scope', '$rootScope', '$filter', '$state', '$location', 'auth', 
function($scope, $rootScope, $filter, $state, $location, auth, code) {

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

		var notfound = false;

		for (var i = 0; i <= $scope.codes.length; i++) {
			
			if($scope.formData.code === $scope.codes[i]){
				$rootScope.$broadcast('code:correct');
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