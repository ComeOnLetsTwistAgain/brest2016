var app = angular.module('brest', ['ui.router', 
	'brest.factAnimations', 'brest.factPosts', 'brest.factAuth', 'brest.factOption', 'brest.factReservations', 'brest.controllerReservation', 

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
		url : '/animations/:id/edit',
		templateUrl : '/editAnimation.html',
		controller : 'controllerAnimation',
		resolve : {
		animation : ['$stateParams', 'factAnimations',
			function($stateParams, factAnimations) {
				return factAnimations.getOne($stateParams.id);
			}]

		}
	})

	.state('seeAnimation', {
		url : '/animations/:id',
		templateUrl : '/animation.html',
		controller : 'controllerAnimation',
		resolve : {
		animation : ['$stateParams', 'factAnimations',
			function($stateParams, factAnimations) {
				return factAnimations.getReservationPage($stateParams.id);
			}]

		}
	})

	.state('mes_reservations', {
		url : '/mes_reservations',
		templateUrl:'/mes_reservations.html',
		controller : 'controllerReservation',
		resolve : {
			reservations : ['factReservations',
			function(factReservations) {
				return factReservations.getAll();
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



