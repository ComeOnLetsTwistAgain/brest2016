angular.module('brest.controllerReservation', [])

.controller('controllerReservation', ['$scope', '$location', 'auth', 'factReservations', 'factAnimations', 
function($scope, $location, auth, factReservations, factAnimations) {

	//on récupère toutes les réservations présentes en base
	$scope.reservations = factReservations.reservations;
	factAnimations.getAll().success(function(){
		$scope.animations = factAnimations.animations;
	})


	$scope.isAdmin = auth.isAdmin;
	$scope.isLoggedIn = auth.isLoggedIn;

	//retourne l'user courant
	$scope.user = auth.currentUser();

	var where = $location.$$host;
	var socket = io.connect('http://'+where+':3000');
	
	socket.on('client_call_mes_reservations', function(message) {
        factReservations.getMyReservations(auth.currentUser());
    });


	//fonction de suppresion d'une réservation
	$scope.deleteReservation = function(index_in_scope){
		var reservation = $scope.reservations[index_in_scope];
		if (reservation._id === ''){return;}

		var confirm = window.confirm("Voulez-vous vraiment annuler cette reservation ?");
		if (confirm == true) {
		    factReservations.delete(reservation._id).success(function(){
				$scope.reservations.splice(index_in_scope, 1);

				factReservations.incrPlacesDispo(reservation.id_animation, reservation.nbPlaceReserve);
			});
		}
	};

	$scope.showAlert = function(id_animation){
		angular.forEach($scope.animations, function(value){
			console.log(value._id + " " +id_animation);
			if(!value._id === id_animation){
				return true;
			}
		});
		return false;
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