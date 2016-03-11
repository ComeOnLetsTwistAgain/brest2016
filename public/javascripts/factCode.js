angular.module('brest.factCode', [])

.factory('factCode', ['$http', 'auth', function($http, auth){
	var o = {
		codes : []
	};

	/*Methodes*/

	o.getAll = function(){
		return $http.get('/billets').success(function(data) {
			angular.copy(data, o.codes);
		});
	};

	o.create = function(option) {
	  return $http.post('/billets', option, {
	    headers: {Authorization: 'Bearer '+auth.getToken()}
	  }).success(function(data){
	    o.codes.push(data);
	  });
	};

	o.delete = function(id_code) {
		return $http.delete('/billets/'+ id_code + '/remove');
	};

	o.getOne = function(id_code){
		return $http.get('/billets/'+ id_option ).then(function(res)
		{
			return res;
		});
	};		

	return o;
}]);

