angular.module('brest.controllerOption', [])

.controller('controllerOption', ['$scope', '$filter', 'auth', 'factOption', 
function($scope, $filter, auth, factOption) {	

	//on récupère toutes les options présentes en base
	$scope.optionss = factOption.options;

	//ajouter une option à la liste d'options
	$scope.addOption = function(id_option){
		var trouve = $filter('getOptionsByTitle')($scope.optionss, $scope.titre_option);

		if (trouve === null)
		{
			factOption.create({
				titre : $scope.titre_option,
				description : $scope.description_option,
			});

			// remet les champs à vides
			$scope.titre_option = "";
			$scope.description_option = "";
			$scope.error = "";
		}else{
			$scope.error = "Il existe déjà une option avec ce titre";
		}

	};

	//supprimer une option à la liste d'options
	$scope.deleteOption = function(index_in_scope){
		var option = $scope.optionss[index_in_scope];
		console.log("deleting : " + index_in_scope);
		if (option._id === ''){return;}

		var confirm = window.confirm("Voulez-vous vraiment supprimer cette option ?");
		if (confirm == true) {
			factOption.delete(option._id).success(function(){
				$scope.optionss.splice(index_in_scope, 1);
			});
		}
	};

	//modifier une option
	$scope.updateOption = function(id_option){
		if (id_option === ''){
			return;
		}

		options.update({
			id : id_option
		}).success(function(){
			//réactualisation du tableau comprenant nos options
			//pas la meilleure methode, il faudrait trouver mieux
			$scope.options = options.options;
		})
	}
}])

.filter('getOptionsByTitle', function() {
  return function(input, titre) {
    var i=0, len=input.length;
    for (; i<len; i++) {
      if (input[i].titre === titre) {
        return input[i];
      }
    }
    return null;
  }
});