angular.module('brest.controllerReservation', [])

.controller('controllerReservation', ['$scope', 'auth', 'factReservations', 
function($scope, auth, factReservations) {

	//on récupère toutes les réservations présentes en base
	$scope.reservations = factReservations.reservations;

	$scope.isAdmin = auth.isAdmin;
	$scope.isLoggedIn = auth.isLoggedIn;

	//retourne l'user courant
	$scope.user = auth.currentUser();


	var socket = io.connect('http://localhost:8080');
	socket.on('client_call_mes_reservations', function(message) {
        factReservations.getMyReservations();
    });



	//fonction de suppresion d'une réservation
	$scope.deleteReservation = function(index_in_scope){
		var reservation = $scope.reservations[index_in_scope];
		console.log('deleting - index : ' + index_in_scope + ' id : ' + reservation._id);
		if (reservation._id === ''){return;}

		var confirm = window.confirm("Voulez-vous vraiment annuler cette reservation ?");
		if (confirm == true) {
		    factReservations.delete(reservation._id).success(function(){
				$scope.reservations.splice(index_in_scope, 1);

				factReservations.incrPlacesDispo(reservation.id_animation, reservation.nbPlaceReserve);
			});
		}

		


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