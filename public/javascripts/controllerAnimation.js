angular.module('brest.controllerAnimation', [])

.controller('controllerAnimation', ['$scope', '$q', 'auth', 'fileUpload', 'factAnimations', 'factOption', 
function($scope, $q, auth, fileUpload, factAnimations, factOption) {

	//on récupère toutes les animations présentes en base
	$scope.animations = factAnimations.animations;
	$scope.animation = factAnimations.animation;

	//toutes les options
	$scope.optionss = factOption.options;

	$scope.option_in_animation = [
		{'titre' : 'lalalala'}
	];


	
	//utilisé dans addAnimation
	$scope.checked_options = [];

	$scope.isAdmin = auth.isAdmin;
	$scope.isLoggedIn = auth.isLoggedIn;

	//retourne l'user courant
	$scope.user = auth.currentUser;

	$scope.addCheckOption = function(id_option){

		//on retire
		if($scope.checked_options.indexOf(id_option) !== -1)
		{
			var index_in_array = $scope.checked_options.indexOf(id_option);
			$scope.checked_options.splice(index_in_array, 1);
		}
		//on ajoute
		else 
		{
			$scope.checked_options.push(id_option);
		}
	}

	$scope.fillOptionsInAnimation = function(){
		for (var i = 0 ; i < $scope.checked_options.length; i++) {
			console.log($scope.checked_options[i]);

			var option = factOption.getOne($scope.checked_options[i]);
			option.then(function(result){
				
				var object = {
					'titre' : result.data.titre
					//description : result.data.description
				};

				console.log(object);
				$scope.option_in_animation.push(object);
			})
		};

		//on créer et ajoute les options dans le scope option
		/*angular.forEach($scope.checked_options, function(value){
			var option = factOption.getOne(value);

			option.then(function(result){
				
				var object = {
					'titre' : result.data.titre
					//description : result.data.description
				};

				console.log(object);
				$scope.option_in_animation.push(object);
			})
			//$scope.option_in_animation.push();
		});*/
	}


	//ajouter une animation
	$scope.addAnimation = function(){

		
		fillOptionsInAnimation();
		

		console.log($scope.option_in_animation);
	
	//	return;

		if ($scope.libelle === '') {
			return;
		}
		factAnimations.create({
			
			libelle : $scope.libelle,
			description : $scope.description,
			//nom_image : $scope.image.name,
			//place_dispo : $scope.place_dispo,
			place_max  : $scope.place_max,
			heure_debut : $scope.heureDebut,
			heure_fin : $scope.heureFin,
			liste_options : $scope.option_in_animation

		}).success(function(animation){
			$scope.animations.push(animation);
		});

		//clear the values
		$scope.libelle = '';
		//$scope.place_debut = '';
		$scope.place_max  = '';
		$scope.heureDebut = '';
		$scope.heureFin = '';
		$scope.description = '';
		//$listeOptions = '';
	};

	//supprimer une animation
	$scope.deleteAnimation = function(index_in_scope){
		var animation = $scope.animations[index_in_scope];
		console.log("deleting : " + index_in_scope);
		if (animation._id === ''){return;}

		factAnimations.delete(animation._id).success(function(){
			$scope.animations.splice(index_in_scope, 1);
		});
	};

	$scope.uploadFile = function(){
        var file = $scope.myFile;
       
        console.log('file is ' );
        console.dir(file);
       
        var uploadUrl = "public/img";
        fileUpload.uploadFileToUrl(file, uploadUrl);
    };

	$scope.setImageFile = function(element) {
 		$scope.$apply(function($scope) {
            $scope.image = element.files[0];
            //console.log($scope.image.name);
        });
	};
	//modifier une animation
	$scope.updateAnimation = function(id_animation){
		if (id_animation === ''){
			return;
		}
		var animationToUpdate = $scope.animations[id_animation];

		Console.log("Animation a modifier "+ id_animation);
		
		animations.update({
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
	};
}])



.service('fileUpload', ['$http', function ($http) {
            this.uploadFileToUrl = function(file, uploadUrl){
               var fd = new FormData();
               fd.append('file', file);
            
               $http.post(uploadUrl, fd, {
                  transformRequest: angular.identity,
                  headers: {'Content-Type': undefined}
               })
            
               .success(function(){
               })
            
               .error(function(){
               });
            }
         }])

.directive('fileModel', ['$parse', function ($parse) {
            return {
               restrict: 'A',
               link: function(scope, element, attrs) {
                  var model = $parse(attrs.fileModel);
                  var modelSetter = model.assign;
                  
                  element.bind('change', function(){
                     scope.$apply(function(){
                        modelSetter(scope, element[0].files[0]);
                     });
                  });
               }
            };
         }]);