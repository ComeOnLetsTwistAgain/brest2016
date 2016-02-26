angular.module('brest.controllerReservation', [])

.controller('controllerReservation', ['$scope', 'auth', 'factReservations', 
function($scope, auth, factReservations) {

	//on récupère toutes les réservations présentes en base
	$scope.reservations = factReservations.reservations;

	$scope.isAdmin = auth.isAdmin;
	$scope.isLoggedIn = auth.isLoggedIn;

	//retourne l'user courant
	$scope.user = auth.currentUser();

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
	};
}]);