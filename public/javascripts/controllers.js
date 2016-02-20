angular.module('brest.controllers', [])

.controller('MainCtrl', ['$scope', 'posts', 'auth',
function($scope, posts, auth) {
	$scope.posts = posts.posts;
	$scope.isLoggedIn = auth.isLoggedIn;


	//setting title to blank here to prevent empty posts
	$scope.title = '';



	$scope.addPost = function() {
		if ($scope.title === '') {
			return;
		}
		posts.create({
			title : $scope.title,
			link : $scope.link,
		});
		//clear the values
		$scope.title = '';
		$scope.link = '';
	};

	$scope.upvote = function(post) {
		//our post factory has an upvote() function in it
		//we're just calling this using the post we have
		console.log('Upvoting:' + post.title + "votes before:" + post.upvotes);
		posts.upvote(post);
	};
	$scope.downvote = function(post) {
		posts.downvote(post);
	};
}])



.controller('PostsCtrl', ['$scope', 'posts', 'post', 'auth',
function($scope, posts, post, auth) {
	$scope.post = post;
	$scope.isLoggedIn = auth.isLoggedIn;

	$scope.addComment = function() {
		if ($scope.body === '') {
			return;
		}
		posts.addComment(post._id, {
			body : $scope.body,
			author : 'user'
		}).success(function(comment) {
			$scope.post.comments.push(comment);
		});
		$scope.body = '';
	};
	$scope.upvote = function(comment) {
		posts.upvoteComment(post, comment);
	};

	$scope.downvote = function(comment) {
		posts.downvoteComment(post, comment);
	};

}])

.controller('AuthCtrl', ['$scope', '$state', 'auth',
function($scope, $state, auth) {
	$scope.user = {};

	$scope.register = function() {
		auth.register($scope.user).error(function(error) {
			$scope.error = error;
		}).then(function() {
			$state.go('home');
		});
	};

	$scope.logIn = function() {
		auth.logIn($scope.user).error(function(error) {
			$scope.error = error;
		}).then(function() {
			$state.go('home');
		});
	};
}]);