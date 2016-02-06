angular.module('brest.controllerAnimation', [])

.controller('controllerAnimation', ['$scope', 'auth', 'factAnimations', 
function($scope, auth, factAnimations) {

	//on récupère toutes les animations présentes en base
	$scope.animations = factAnimations.animations;

	$scope.isLoggedIn = auth.isLoggedIn;

	//retourne l'user courant
	$scope.user = auth.currentUser;



	//ajouter une animation
	$scope.addAnimation = function(){
		if ($scope.libelle === '') {
			return;
		}
		factAnimations.create({
			
			libelle : $scope.libelle,
			//place_dispo : $scope.place_dispo,
			place_max  : $scope.place_max,
			heure_debut : $scope.heureDebut,
			heure_fin : $scope.heureFin,
			//listeOptions : $scope.listeOption,
		}).success(function(animation){
			$scope.animations.push(animation);
		});
		//clear the values
		$scope.libelle = '';
		//$scope.place_debut = '';
		$scope.place_max  = '';
		$scope.heureDebut = '';
		$scope.heureFin = '';
		//$listeOptions = '';
	};



	/*$scope.addAnimation = function() {
		console.log("adding animation");
	}*/

	//supprimer une animation
	$scope.deleteAnimation = function(index_in_scope){
		var animation = $scope.animations[index_in_scope];
		console.log("deleting : " + index_in_scope);
		if (animation._id === ''){return;}

		factAnimations.delete(animation._id).success(function(){
			$scope.animations.splice(index_in_scope, 1);
		});
	};

	//modifier une animation
	/*$scope.updateAnimation = function(id_animation){
		if (id_animation === ''){
			return;
		}
		var animationToUpdate = $scope.animations[id_animation];
		
		animations.update({
			id : id_animation
			libelle : $scope.libelle,
			place_dispo : $scope.place_dispo,
			place_max  : $scope.place_max,
			heureDebut : $scope.heureDebut,
			heureFin : $scope.heureFin,
			listeOption : $scope.listeOption,
		}).success(function(){

			//réactualisation du tableau comprenant nos animations
			//pas la meilleure methode, il faudrait trouver mieux
			$scope.animations = animations.animations;
		});
	};*/
}])