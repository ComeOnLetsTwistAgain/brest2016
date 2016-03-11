angular.module('brest.factCode', [])

.factory('factCode', ['$http', 'auth', function($http, auth){
	var o = {
		code : []
	};

	/*Methodes*/

	o.getAll = function(){
		return $http.get('/billets').success(function(data) {
			angular.copy(data, o.code);
		});
	};

	return o;
}]);

