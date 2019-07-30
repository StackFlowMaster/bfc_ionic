angular.module('appctrl.controllers', [])

.controller('AppCtrl', function($scope, $window, $state, $rootScope, $ionicModal, $timeout, $cordovaInAppBrowser, languageService) {
  	var options = {
      location: 'yes',
      clearcache: 'yes',
      toolbar: 'no'
    };

	$scope.languages = languageService.get_language_list();

	$scope.$on( "$ionicView.enter", function( scopes, states ) {
		$rootScope.cur_lang = languageService.get_current_language();
		
		for (var i = 0; i < $scope.languages.length; i++) {
			if($scope.languages[i].language_name == $rootScope.cur_lang.language_name) {
				$scope.cur_index = i.toString();
			}
		};

		if( states.stateName == "app.story_list" ) {
			console.log("----Menu story list----");
		}
	});

	$scope.goWebsite = function() {

	  document.addEventListener("deviceready", function () {
	    $cordovaInAppBrowser.open('http://bibleforchildren.org', '_system', options)
	      .then(function(event) {
	        // success
	      })
	      .catch(function(event) {
	        // error
	      });

	    $cordovaInAppBrowser.close();

	  }, false);
	  	/*
		window.open('http://bibleforchildren.org', '_system', 'location=yes');
		return false;
		*/
	};

	$scope.changed_Language = function(index) {
		languageService.set_current_language($scope.languages[index]);
	};
});
