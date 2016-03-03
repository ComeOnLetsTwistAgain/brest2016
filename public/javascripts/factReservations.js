angular.module('brest.factReservations', [])

.factory('factReservations', ['$http', 'auth', function($http, auth){
	var o = {
		reservations : [],
		animationReturned: {}
	};



	/*Methodes*/

	o.getAll = function(){
		return $http.get('/reservations').success(function(data) {
			angular.copy(data, o.reservations);
		});
	};

	o.getMyReservations = function(user){
		return $http.get('/mes_reservations/' + user , {
			headers: {Authorization: "Bearer " + auth.getToken() }
		}).success(function(data){
			angular.copy(data, o.reservations);
		});
	};

	o.create = function(reservation) {
	  return $http.post('/reservations', reservation, {
	    headers: {Authorization: 'Bearer '+auth.getToken()}
	  }).success(function(data){
	    o.reservations.push(data);
	  });
	};

	o.delete = function(id_reservation) {
		return $http.delete('/reservations/'+ id_reservation + '/remove', {
			headers: {Authorization: 'Bearer '+auth.getToken()}
		});
	};

	o.getOne = function(id_reservation){
		return $http.get('/reservations/'+ id_reservation ).then(function(res)
		{
			return res.data;
		});
	};

	o.decrPlacesDispo = function(id_animation, nbPlaces){
		return $http.put('/animations/' + id_animation + '/decrPlaceDispo', {
			headers: {Authorization: 'Bearer '+auth.getToken()},
			infos: {"id_animation" : id_animation, "nbPlaces" : nbPlaces}
	  	});
	};

	o.incrPlacesDispo = function(id_animation, nbPlaces){
		return $http.put('/animations/' + id_animation + '/incrPlaceDispo', {
			headers: {Authorization: 'Bearer '+auth.getToken()},
			infos: {"id_animation" : id_animation, "nbPlaces" : nbPlaces}
	  	});
	};

	return o;
}]);