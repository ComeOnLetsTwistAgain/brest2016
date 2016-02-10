angular.module('brest.factAnimations', [])

.factory('factAnimations', ['$http', 'auth', function($http, auth){
	var o = {
		animations : []
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
		return $http.get('/animations/'+ id_animation ).then(function(res)
		{
			return res.data;
		});
	};
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