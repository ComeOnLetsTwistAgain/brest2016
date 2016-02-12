angular.module('brest.factCode', [])

.factory('factCode', ['$http', 'auth', function($http, auth){
	var o = {
		code : []
	};



	return o;
}]);

