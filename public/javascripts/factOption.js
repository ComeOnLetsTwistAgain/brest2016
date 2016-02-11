angular.module('brest.factOption', [])

.factory('factOption', ['$http', 'auth', function($http, auth){
	var o = {
		options : []
	};



	/*Methodes*/

	o.getAll = function(){
		return $http.get('/options').success(function(data) {
			angular.copy(data, o.options);
		});
	};

	o.create = function(option) {
	  return $http.post('/options', option, {
	    headers: {Authorization: 'Bearer '+auth.getToken()}
	  }).success(function(data){
	    o.options.push(data);
	  });
	};

	o.delete = function(id_option) {
		return $http.delete('/options/'+ id_option + '/remove');
	};

	o.getOne = function(id_option){
		return $http.get('/options/'+ id_option ).then(function(res)
		{
			return res;
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