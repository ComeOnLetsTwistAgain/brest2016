var app = angular.module('brest', ['ui.router', 
	'brest.factAnimations', 'brest.factPosts', 'brest.factAuth', 'brest.factOption', 'brest.factReservations', 'brest.controllerReservation', 

	'brest.controllerNav', 'brest.controllerCode', 'brest.controllerAnimation', 'brest.controllerOption', 'brest.controllerAuth']);

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

	.state('code', {
		url: '/code',
		templateUrl: '/code.html',
		controller: 'controllerCode'
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
			}],
		options : ['$stateParams', 'factOption',
			function($stateParams, factOption){
				return factOption.getAll();
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
			reservations : ['$stateParams', 'factReservations', 'auth',
			function($stateParams, factReservations, auth) {
				return factReservations.getMyReservations(auth.currentUser());
			}]
		}
	})


	.state('login', {
		url : '/login',
		templateUrl : '/login.html',
		controller : 'controllerAuth',
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
		controller : 'controllerAuth',
		onEnter : ['$state', 'auth',
		function($state, auth) {
			if (auth.isLoggedIn()) {
				$state.go('home');
			}
		}]

	});

	$urlRouterProvider.otherwise('code');
}])
.run(function($rootScope, $state, auth){
	$rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams) {

		console.log(fromState.name + ' => ' + toState.name);

		/*
		*	Si le user n'est pas connecté, il ne peut pas avoir accès qu'a login, register et code
		*/
		//TODO


		/*
		*	Si le user est deja connecté, il n'a plus accès a la view code
		*/
		var codeRedirect = toState.name === 'code' && auth.isLoggedIn();
		if (codeRedirect) {
			console.log('already logged in');
			event.preventDefault();
			$state.go('home');
		}

		/*
		*	Si le user n'est pas admin, il n'a pas accès aux vues admin
		*/
		if(!auth.isAdmin()){
			
			if(
			   toState.name === 'addAnimation' ||
			   toState.name === 'addOption' ||
			   toState.name === 'editAnimation'
			  )
			{
				event.preventDefault();
				$state.go('home');
			}
		}



	});

	$rootScope.$on('code:correct', function() {
		if(auth.isLoggedIn())
        	$state.go('home');
        else
        	$state.go('register');
    });

    $rootScope.$on('auth:logout', function() {
        	$state.go('login');
    });
});



