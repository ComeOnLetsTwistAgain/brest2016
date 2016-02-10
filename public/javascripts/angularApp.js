var app = angular.module('brest', ['ui.router', 
	'brest.factAnimations', 'brest.factPosts', 'brest.factAuth', 

	'brest.controllerAnimation', 'brest.controllers']);

app.config(['$stateProvider', '$urlRouterProvider',
function($stateProvider, $urlRouterProvider) {

	$stateProvider.state('home', {
		url : '/home',
		templateUrl : '/home.html',
		controller : 'controllerAnimation',
		resolve : {
			animations : ['factAnimations',
			function(animations) {
				return animations.getAll();
			}]

		}
	})
	.state('posts', {
		url : '/posts/:id',
		templateUrl : '/posts.html',
		controller : 'PostsCtrl',
		resolve : {
			post : ['$stateParams', 'posts',
			function($stateParams, posts) {
				return posts.get($stateParams.id);
			}]

		}
	})
	.state('admin', {
		url : '/admin',
		templateUrl : '/admin.html',
		controller : 'AdminCtrl'
	})

	.state('addAnimation', {
		url : '/addAnimation',
		templateUrl : '/addAnimation.html',
		controller : 'controllerAnimation'
		/*onEnter : ['$state', 'auth',
		function($state, auth) {
			if (auth.isAdmin()) {
				$state.go('home');
			}
		}]*/
	})



	.state('login', {
		url : '/login',
		templateUrl : '/login.html',
		controller : 'AuthCtrl',
		onEnter : ['$state', 'auth',
		function($state, auth) {
			if (auth.isLoggedIn()) {
				$state.go('home');
			}
		}]

	})

	.state('register', {
		url : '/register',
		templateUrl : '/register.html',
		controller : 'AuthCtrl',
		onEnter : ['$state', 'auth',
		function($state, auth) {
			if (auth.isLoggedIn()) {
				$state.go('home');
			}
		}]

	});

	$urlRouterProvider.otherwise('code');
}]);



