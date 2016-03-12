angular.module('brest.controllerCode', [])

.controller('controllerCode', ['$scope', '$rootScope', '$filter', '$state', '$location', 'auth', 'factCode',
function($scope, $rootScope, $filter, $state, $location, auth, factCode) {

	$scope.currentPath = $location.path();
	$scope.formData = {};

	//on récupère tous les options présentes en base
	// $scope.codes = factCode.codes;

	$scope.codes = factCode.codes;

	$scope.error = "";
	
	$scope.checkCode = function(){
		if ($scope.theCode =''){
			return;
		}

		console.log("checking code");

		/*var trouve = $filter('getCodeByNumero')($scope.codes, $scope.code_billet);
		console.log(trouve);

		if (trouve === null )
		{
			$scope.error = "code pas trouvé";
		}else{
			$scope.error = "code trouvé";
		}	*/

		for (var i = 0; i <= $scope.codes.length; i++) {

			if($scope.formData.code == $scope.codes[i].code_billet){
				$rootScope.$broadcast('code:correct');
			} else {
				$scope.error = 'Le code rentré n\'est pas correct';
			}
		};

	}

	//ajouter un code à la liste
	$scope.addCodeBillet = function(id_code){
		var trouve = $filter('getCodeByNumero')($scope.codes, $scope.code_billet);

		console.log(trouve);
		if (trouve === null)
		{
			factCode.create({
				code_billet : $scope.code_billet,
				isUsed : $scope.isUsed,
			});

			// remet les champs à vides
			$scope.code_billet = "";
			$scope.isUsed = false;
			$scope.error = "";
		}else{
			$scope.error = "Il existe déjà un code identique";
		}

	};

	//supprimer une option à la liste d'options
	$scope.deleteOption = function(index_in_scope){
		var code = $scope.codes[index_in_scope];
		console.log("deleting : " + index_in_scope);
		if (code._id === ''){return;}

		var confirm = window.confirm("Voulez-vous vraiment supprimer ce code ?");
		if (confirm == true) {
			factCode.delete(code._id).success(function(){
				$scope.codes.splice(index_in_scope, 1);
			});
		}
	};

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
})

.filter('getCodeByNumero', function() {
  return function(input, code_billet) {
    var i=0, len=input.length;
    for (; i<len; i++) {

      	if (input[i].code_billet == code_billet) {
      	  	return input[i];        	
      	}
    }
    return null;
  }
});
