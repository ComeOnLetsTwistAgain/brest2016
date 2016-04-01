angular.module('brest.controllerAnimation', ["checklist-model"])

.controller('controllerAnimation', ['$scope', '$location', '$filter', '$state', 'auth', 'factAnimations', 'factOption', 'factReservations',
function($scope, $location, $filter, $state, auth, factAnimations, factOption, factReservations) {

	//on récupère toutes les animations présentes en base
	$scope.animations = factAnimations.animations;
	$scope.animation = factAnimations.animation;

	//on construit les date des objet
	$scope.animation.date = new Date($scope.animation.date);
	$scope.animation.heure_debut = new Date ($scope.animation.heure_debut);
	$scope.animation.heure_fin = new Date($scope.animation.heure_fin);

	//toutes les options
	$scope.optionss = factOption.options;

	//checkboxes des animations / reservations
	if($scope.animation.optionss == null) 	//on est dans la vue ADD
		$scope.option_in_animation=[];
	else									//on est dans la vue EDIT
		$scope.option_in_animation = $scope.animation.optionss;

	$scope.option_in_reservation = [];



	$scope.isAdmin = auth.isAdmin;
	$scope.isLoggedIn = auth.isLoggedIn;

	//retourne l'user courant
	$scope.user = auth.currentUser();

	//nb de reservations par défaut
	$scope.nbPlaceReserve = 1;


	var where = $location.$$host;
	var socket = io.connect('http://'+where+':3000');
	

	socket.on('client_call_animations', function(){
		factAnimations.getAll();
	});


	/*if(window.DeviceOrientationEvent){
    	MobileReader.bindOrientation({

	      	callback: function(orientation) {
	        	$scope.$apply(function(){$scope.x = orientation.gamma;})
	        	$scope.$apply(function(){$scope.y = orientation.beta;})
	        	document.getElementsByClassName('.cube');
	      	},
	     	interval: 0
	    });
    }*/



    

	
	$scope.refreshAnimations = function(){
		factAnimations.getAll();
	}



	$scope.addCheckOption = function(id_option, checked){

		//contient tous les idoption des options ajoutée
		var found = $filter('getById')($scope.option_in_animation, id_option);
		

		//on retire
		if(found != null)
		{
			var index_in_array = $scope.option_in_animation.indexOf(found);
			$scope.option_in_animation.splice(index_in_array, 1);
		}
		//on ajoute
		else 
		{
				$scope.option_in_animation.push(id_option);
		}
	}

	$scope.addCheckOptionReservation = function(id_option){
		//contient tous les idoption des options ajoutée
		var found = $filter('getById')($scope.option_in_reservation, id_option);
		

		//on retire
		if(found != null)
		{
			var index_in_array = $scope.option_in_reservation.indexOf(found);
			$scope.option_in_reservation.splice(index_in_array, 1);
		}
		//on ajoute
		else 
		{
			var option = factOption.getOne(id_option);
			option.then(function(result){
				$scope.option_in_reservation.push(id_option);
			});

			
			
		}
	}
	//ajouter une animation
	$scope.addAnimation = function(){
		if ($scope.libelle === '') {
			return;
		}
		var trouve = $filter('getAnimationsByTitle')($scope.animations, $scope.libelle);
		if (trouve === null)
		{
			console.log("heure debut"+$scope.heureDebut);
			console.log("heure fin "+$scope.heureFin);
			if ($scope.heureDebut < $scope.heureFin)
			{
				//bon
				console.log("heureDebut < heureFin");
				factAnimations.create({
			
					libelle : $scope.libelle,
					description : $scope.description,
					nom_image : $scope.image.name,
					place_dispo : $scope.place_max,
					place_max  : $scope.place_max,
					date : $scope.date,
					heure_debut : $scope.heureDebut,
					heure_fin : $scope.heureFin,
					optionss : $scope.option_in_animation
				}).success(function(){
					//si l'animation est enregistré en base, on upload l'image
					console.log($scope.image);
					factAnimations.upload($scope.image);
				});
				// remet les champs à vides
				$scope.libelle = '';
				$scope.place_debut = '';
				$scope.place_max  = '';
				$scope.date = '';
				$scope.heureDebut = '';
				$scope.heureFin = '';
				$scope.description = '';
				$scope.error = '';
			}else{
				//pas bon
				$scope.error = "L'heure de début est supérieure à l'heure de fin.";
				return;
			}
			
		}else{
			$scope.error = "Il existe déjà une animation avec ce titre";
		}
	};
	
	//ajouter une animation
	/*$scope.addAnimation = function(){

		if ($scope.libelle === '') {
			return;
		}

		var trouve = $filter('getAnimationsByTitle')($scope.animations, $scope.libelle);

		if (trouve === null)
		{
			factAnimations.create({
			
				libelle : $scope.libelle,
				description : $scope.description,
				nom_image : $scope.image.name,
				place_dispo : $scope.place_max,
				place_max  : $scope.place_max,
				date : $scope.date,
				heure_debut : $scope.heureDebut,
				heure_fin : $scope.heureFin,
				optionss : $scope.option_in_animation

			}).success(function(){
				//si l'animation est enregistré en base, on upload l'image
				console.log($scope.image);
				factAnimations.upload($scope.image);
			});

			// remet les champs à vides
			$scope.libelle = '';
			$scope.place_debut = '';
			$scope.place_max  = '';
			$scope.date = '';
			$scope.heureDebut = '';
			$scope.heureFin = '';
			$scope.description = '';
			$scope.error = '';
		}else{
			$scope.error = "Il existe déjà une animation avec ce titre";
		}
	};*/

	//ajouter une réservation
	$scope.addReservation = function(){
		

		factReservations.create({
			animation : $scope.animation._id,
			user : $scope.user,
			nbPlaceReserve : $scope.nbPlaceReserve,
			optionss : $scope.option_in_reservation
		}).then(function(){

			factReservations.decrPlacesDispo($scope.animation._id, $scope.nbPlaceReserve).success(function(){
				alert("Votre reservation est bien prise en compte, vous pouvez la consulter/annuler dans l'onglet \"Mes reservations\"");
				$state.go('home');
			});

			//$scope.nbPlaceReserve  = '';
			//$state.go('home');
		});
	}

	//supprimer une animation
	$scope.deleteAnimation = function(index_in_scope){
		var animation = $scope.animations[index_in_scope];
		console.log("deleting : " + index_in_scope);
		if (animation._id === ''){return;}

		factAnimations.delete(animation._id).success(function(){
			$scope.animations.splice(index_in_scope, 1);
		});
	};

	/*permet de mettre dans le scope.image, l'objet file*/
	$scope.setImageFile = function(element) {
 		$scope.$apply(function($scope) {
            $scope.image = element.files[0];
            //console.log($scope.image.name);
        });
	};


		//modifier une option
	/*$scope.updateOption = function(id_option){
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
	}*/



	//modifier une animation
	$scope.updateAnimation = function(id_animation){

		$scope.success = '';
		$scope.error = '';

		if (id_animation === ''){
			return;
		}
		var animationToUpdate = $scope.animations[id_animation]; // recupère notre animation
		var trouve = $filter('getAnimationsByTitle')($scope.animations, $scope.animation.libelle);

		
		
		animation = animationToUpdate; 
		
			factAnimations.update(id_animation, {
				libelle : $scope.animation.libelle,
				place_dispo : $scope.animation.place_dispo,
				description : $scope.animation.description,
				nom_image : $scope.animation.nom_image,
				place_max  : $scope.animation.place_max,
				date : $scope.animation.date,
				heure_debut : $scope.animation.heure_debut,
				heure_fin : $scope.animation.heure_fin,
				optionss : $scope.option_in_animation
			}).success(function(){

				$scope.success = "OK";
				//réactualisation du tableau comprenant nos animations
				//pas la meilleure methode, il faudrait trouver mieux
				$scope.animations = factAnimations.animations;


			});
		
	};


}])

.filter('getById', function() {
  return function(input, id) {
    var i=0, len=input.length;
    for (; i<len; i++) {
      if (input[i] == id) {
        return input[i];
      }
    }
    return null;
  }
})

.filter('getAnimationsByTitle', function() {
  return function(input, libelle) {
    var i=0, len=input.length;
    for (; i<len; i++) {
      if (input[i].libelle === libelle) {
        return input[i];
      }
    }
    return null;
  }
});
