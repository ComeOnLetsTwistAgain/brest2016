angular.module('brest.controllerReservation', [])

.controller('controllerReservation', ['$scope', 'auth', 'reservations', 
function($scope, auth, reservation) {

	//on récupère toutes les réservations présentes en base
	$scope.reservations = reservations.reservations;

	$scope.isLoggedIn = auth.isLoggedIn;

	//retourne l'user courant
	$scope.user = auth.currentUser;

	//fonction pour créer une réservations
	$scope.addReservation = function(){
		if ($scope.animation === '') {
			return;
		}
		reservations.create({
			animation : $scope.animation,
			user : $scope.user,
			nbPlaceReservee : $scope.nbPlaceReservee, 
			listeOptions : $scope.listeOption,
		});
		//clear the values
		$scope.animation = '';
		$scope.listeUsers = '';
		$listeOptions  = '';
	};

	//fonction de suppresion d'une réservation
	$scope.deleteReservation = function(id_reservation){
		if (id_reservation === ''){
			return;
		}

		reservations.delete({
			id : id_reservation
		}).success(function(){
			$scope.reservations.delete($scope.reservations[id_reservation]);
		});

	};

	//modifier une reservation
	$scope.updateReservation = function(id_reservation){
		if (id_reservation === ''){
			return;
		}

		reservations.update({
			id : id_reservation
		}).success(function(){
			//réactualisation du tableau comprenant nos reservations
			//pas la meilleure methode, il faudrait trouver mieux
			$scope.reservations = reservations.reservations;
		})
	}
});