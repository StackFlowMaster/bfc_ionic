// HomeOpen App

var app = angular.module('bfc', ['ionic', 'pdf', 'ngCordova', 'appctrl.controllers',
  'lang.controllers', 'stroy_list.controllers', 'about.controllers', 'privacy.controllers', ] )

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }

    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();

      $cordovaStatusbar.overlaysWebView(true);
      $cordovaStatusbar.styleColor('white');
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  document.body.classList.remove("platform-ios");
  document.body.classList.remove("platform-android");
  document.body.classList.add("platform-ios");
  document.body.classList.add("platform-android");

  $stateProvider

  .state('lang', {
    url: '/lang',
    templateUrl: 'templates/lang.html',
    controller: 'langCtrl'
  })

  .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('app.story_list', {
    url: '/story_list',
    views: {
      'menuContent': {
        templateUrl: 'templates/story_list.html',
        controller: 'storyListCtrl'
      }
    }
  })

  .state('app.about', {
    url: '/about',
    views: {
      'menuContent': {
        templateUrl: 'templates/about.html',
        controller: 'aboutCtrl'
      }
    }
  })

  .state('app.privacy', {
    url: '/privacy',
    views: {
      'menuContent': {
        templateUrl: 'templates/privacy.html',
        controller: 'privacyCtrl'
      }
    }
  })

  ;

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/lang');

});
