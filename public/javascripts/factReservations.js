angular.module('brest.factReservations', [])

.factory('factReservations', ['$http', 'auth', function($http, auth){
	var o = {
		reservations : []
	};



	/*Methodes*/

	o.getAll = function(){
		return $http.get('/reservations').success(function(data) {
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
		return $http.delete('/reservations/'+ id_reservation + '/remove');
	};

	o.getOne = function(id_reservation){
		return $http.get('/reservations/'+ id_reservation ).then(function(res)
		{
			return res.data;
		});
	};

	o.decrPlacesDispo = function(id_animation, nbPlaces){
		return $http.put('/animations/' + id_animation + '/decrPlaceDispo', {
			headers: {Authorization: 'Bearer '+auth.getToken()}
	  	});
	}
		/*
			o.get = function(id) {
		//use the express route to grab this post and return the response
		//from that route, which is a json of the post data
		//.then is a promise, a kind of newly native thing in JS that upon cursory research
		//looks friggin sweet; TODO Learn to use them like a boss.  First, this.
		return $http.get('/posts/' + id).then(function(res) {
			return res.data;
		});
	};*/

	/*end methodes*/

	return o;
}]);