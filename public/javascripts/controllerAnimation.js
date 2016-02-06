angular.module('brest.controllerAnimation', [])

.controller('controllerAnimation', ['$scope', 'auth', 'animations', 
function($scope, auth, animations) {

	//on récupère toutes les animations présentes en base
	$scope.animations = animations.animations;

	$scope.isLoggedIn = auth.isLoggedIn;

	//retourne l'user courant
	$scope.user = auth.currentUser;

	//ajouter une animation
	$scope.addAnimation = function(){
		if ($scope.libelle === '') {
			return;
		}
		animations.create({
			libelle : $scope.libelle,
			//place_dispo : $scope.place_dispo,
			place_max  : $scope.place_max,
			heureDebut : $scope.heureDebut,
			heureFin : $scope.heureFin,
			//listeOptions : $scope.listeOption,
		}).success(function(animation){
			$scope.animations.push(animation);
		});
		//clear the values
		$scope.libelle = '';
		//$scope.place_debut = '';
		$place_max  = '';
		$heureDebut = '';
		$heureFin = '';
		//$listeOptions = '';
	};

	/*$scope.addAnimation = function() {
		console.log("adding animation");
	}*/

	//supprimer une animation
	/*$scope.deleteAnimation = function(id_animation){
		if (id_animation === ''){
			return;
		}

		animations.delete({
			id : id_animation
		}).success(function(){
			$scope.animations.delete($scope.animations[id_animation]);
		});
	};

	//modifier une animation
	$scope.updateAnimation = function(id_animation){
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