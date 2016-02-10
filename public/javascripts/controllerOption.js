angular.module('brest.controllerOption', [])

.controller('controllerOption', ['$scope', 'auth', 'factOption', 
function($scope, auth, factOption) {	

	//on récupère toutes les options présentes en base
	$scope.optionss = factOption.options;

	//ajouter une option à la liste d'options
	$scope.addOption = function(id_option){
		if (id_option === ''){
			return;
		}

		factOption.create({
			titre : $scope.titre_option,
			description : $scope.description_option,
		}).success(function(option){
			//$scope.optionss.push(option);
		});

		$scope.titre_option = "";
		$scope.description_option = "";
	};

	//supprimer une option à la liste d'options
	$scope.deleteOption = function(index_in_scope){
		var option = $scope.optionss[index_in_scope];
		console.log("deleting : " + index_in_scope);
		if (option._id === ''){return;}

		factOption.delete(option._id).success(function(){
			$scope.optionss.splice(index_in_scope, 1);
		});
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
}]);