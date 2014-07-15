(function() {
	var App = angular.module('App',[]);

	App.controller("FeedController", ['$scope','FeedService','$sce', function ($scope,Feed,$sce) {    
		$scope.feeds = [];
		$selected = false;
		this.loadFeed=function(){        
			Feed.parseFeed('http://feeds.sidebar.io/SidebarFeed').then(function(res){
				$scope.feeds=res.data.responseData.feed.entries;
			});
		}

		this.setPostUrl = function(url){
			var startIndex = url.indexOf("http://sidebar.io/out?url=");
			var target = url.substring(startIndex+26, url.length);
			$scope.currentPostUrl = $sce.trustAsResourceUrl(decodeURIComponent(target));
			$scope.selected = true;
			url = "";
		}

		this.loadFeed();
	}]);

	App.factory('FeedService',['$http',function($http){
		return {
			parseFeed : function(url){
				return $http.jsonp('//ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=50&callback=JSON_CALLBACK&q=' + encodeURIComponent(url));
			}
		}
	}]);

	App.filter('addEllipsis', function () {
		return function (input, scope) {
			if (input) {
				if(input.length > 45)
					return input.substring(0, 45) + '...';
				else  
					return input;
			}
		}
	});

	App.filter('unsafe', function($sce) {
		return function(url) {
			var startIndex = url.indexOf("undefined <a href=");
			var target = url.substring(startIndex+19, url.length-14);
			return $sce.trustAsHtml(target);
		};
	});

})();