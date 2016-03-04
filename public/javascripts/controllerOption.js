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

		var trouve=false;

		angular.forEach($scope.optionss, function(value){
			console.log("-----");
			console.log("value de l'option= "+value.titre);
			console.log("value passé form = "+$scope.titre_option);
			if ($scope.titre_option === value.titre && trouve !== true)
			{
				console.log("Option found");
				$scope.error = 'Il existe déjà une option avec ce nom';
				trouve = true;
			} 	else {
				console.log("Option non trouvée, création de l\'option")
				trouve = false;				
			}
		});
		

		if (trouve === false)
		{
			factOption.create({
				titre : $scope.titre_option,
				description : $scope.description_option,
			}).success(function(option){
				//$scope.optionss.push(option);
			});

			// remet les champs à vides
			$scope.titre_option = "";
			$scope.description_option = "";
			$scope.error = "";
		}

		trouve = false;
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