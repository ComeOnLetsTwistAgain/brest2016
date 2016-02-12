angular.module('brest.factAnimations', [])

.factory('factAnimations', ['$http', 'auth', function($http, auth){
	var o = {
		animations : [],
		animation : {}
	};



	/*Methodes*/

	o.getAll = function(){
		return $http.get('/animations').success(function(data) {
			angular.copy(data, o.animations);
		});
	};

	o.create = function(animation) {
	  return $http.post('/animations', animation, {
	    headers: {Authorization: 'Bearer '+auth.getToken()}
	  }).success(function(data){
	    o.animations.push(data);
	  });
	};

	o.delete = function(id_animation) {
		return $http.delete('/animations/'+ id_animation + '/remove');
	};

	o.getOne = function(id_animation){
		return $http.get('/animations/'+ id_animation + '/edit' ).then(function(res)
		{
			angular.copy(res.data, o.animation);
			return res.data;
		});
	};

	o.getReservationPage= function(id_animation){
		return $http.get('/animations/'+ id_animation ).then(function(res)
		{
			angular.copy(res.data, o.animation);
			return res.data;
		});
	};

	o.update = function(id_animation, animation)
	{
		return $http.put('/animations/' + id_animation ,   {
	    	headers: {Authorization: 'Bearer '+auth.getToken()},
	    	animation : animation
	  	}).success(function(data){
	    	o.animations.push(data);
	  	});
	};

	/*end methodes*/

	return o;
}]);