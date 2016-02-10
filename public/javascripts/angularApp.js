var app = angular.module('brest', ['ui.router', 
	'brest.factAnimations', 'brest.factPosts', 'brest.factAuth', 'brest.factOption', 

	'brest.controllerAnimation', 'brest.controllerOption', 'brest.controllers']);

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
		controller : 'controllerAnimation',
		resolve : {
			options : ['$stateParams', 'factOption',
			function($stateParams, factOption){
				return factOption.getAll();
			}]
		}
	})

	.state('addOption', {
		url : '/addOption',
		templateUrl : '/addOption.html',
		controller : 'controllerOption',
		resolve: {
			options : ['$stateParams', 'factOption',
			function($stateParams, factOption){
				return factOption.getAll();
			}]
		}
		
	})

	.state('editAnimation', {
		url : '/animations/:id',
		templateUrl : '/editAnimation.html',
		controller : 'controllerAnimation',resolve : {
		animation : ['$stateParams', 'animations',
			function($stateParams, animations) {
				return animations.get($stateParams.id);
			}]

		}
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



