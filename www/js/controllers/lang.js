angular.module('lang.controllers', [])

.controller('langCtrl', function(BACKEND_API, HEADERS, $rootScope, $state, $http, $ionicHistory, $ionicLoading, 
	languageService, $scope, Utils, translateService) {

    $scope.$on( "$ionicView.enter", function( scopes, states ) {
    	
    	if( states.stateName == "lang" ) {
    		$rootScope.translates = translateService.get_local_translates();
			$rootScope.cur_lang = languageService.get_current_language();

			$scope.languages = [];

			languageService.get_languages().then(function(resp) {
				// console.log("Language :", JSON.stringify(resp));
				$scope.languages = resp;
				for (var i = 0; i < $scope.languages.length; i++) {
					if($scope.languages[i].language_name == $rootScope.cur_lang.language_name) {
						$scope.cur_index = i.toString();
					}
				};

				console.log($scope.languages[$scope.cur_index]);

			}, function(resp) {
				$scope.cur_index = "0";
				$scope.languages.push($rootScope.cur_lang);
				console.log($scope.languages[$scope.cur_index]);
				// Utils.errMessage(resp);
			});
		}
    });

	$scope.changed_Language = function(index) {
		$scope.cur_index = index;
		// languageService.set_current_language($scope.languages[index]);
		console.log($scope.languages[$scope.cur_index]);
	};

	$scope.goStoryList = function() {
		languageService.set_current_language($scope.languages[$scope.cur_index]);

		translateService.get_language_translates().then(function(resp) {
			$rootScope.translates = resp;
			translateService.set_local_translates(resp);
			console.log($rootScope.translates);
			$state.go("app.story_list");
		}, function(resp) {
			// Utils.errMessage("BFC does not still provide translation for " + $scope.languages[$scope.cur_index].language_name);
			$rootScope.translates = resp;
			translateService.set_local_translates(resp);
			$state.go("app.story_list");
		});
		
	};
});