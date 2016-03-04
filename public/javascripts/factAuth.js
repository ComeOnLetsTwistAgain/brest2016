angular.module('brest.factAuth', [])

.factory('auth', ['$http', '$rootScope','$location', '$window',
function($http, $rootScope, $location, $window) {
	var auth = {
		users : []
	};

	auth.getAllUsers = function(){
		return $http.get('/users').success(function(data){
			angular.copy(data, auth.users);
		});
	};

	auth.saveToken = function(token) {
		$window.localStorage['brest-token'] = token;
	};

	auth.getToken = function() {
		return $window.localStorage['brest-token'];
	}

	auth.isAdmin = function() {
		if(auth.currentUser() == 'admin'){
			return true;
		} return false;
	}

	auth.isLoggedIn = function() {
		var token = auth.getToken();

		//if the user is logged in
		if (token) {



			var payload = JSON.parse($window.atob(token.split('.')[1]));
			return payload.exp > Date.now() / 1000;
		} else {
			return false;
		}
	};

	auth.currentUser = function() {
		if (auth.isLoggedIn()) {
			var token = auth.getToken();
			var payload = JSON.parse($window.atob(token.split('.')[1]));

			return payload.username;
		}
	};

	auth.delete = function(id) {
		return $http.delete('/user/' + id + '/remove');
	};

	auth.getCurrentPath = function(){
		return $location.path();
	};

	auth.register = function(user) {
		return $http.post('/register', user).success(function(data) {
			auth.saveToken(data.token);
		});
	};

	auth.logIn = function(user) {
		return $http.post('/login', user).success(function(data) {
			auth.saveToken(data.token);
		});
	};

	auth.logOut = function() {
		$window.localStorage.removeItem('brest-token');
		$rootScope.$broadcast('auth:logout');
	};

	return auth;
}]);