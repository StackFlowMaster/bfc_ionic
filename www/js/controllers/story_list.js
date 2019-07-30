angular.module('stroy_list.controllers', [])

.controller('storyListCtrl', function(BACKEND_API, HEADERS, $ionicPlatform, $scope, $rootScope, $state, $http, $ionicHistory, $ionicLoading, storyService,
  $ionicSideMenuDelegate, $ionicModal, fileService, $cordovaFileTransfer, $timeout, $cordovaNetwork, $cordovaFile, pdfDelegate, Utils, languageService, translateService, 
  $cordovaDeviceOrientation, $window ) {
  /*
  $scope.$watch(function() {
    return $rootScope.cur_lang;
  }, function() {
    console.log("watch", $rootScope.cur_lang['language_name']);
    init_story_list();
  }, true);
  */

  $scope.story_list = [];
  $scope.remote_story_list = [];

  $scope.$watch(function () {
      return $ionicSideMenuDelegate.isOpen();
    },
    function (opended) {
      if (!opended) {
        // $rootScope.cur_lang = languageService.get_current_language();
        console.log("Language Changed at Side Menu! ", $rootScope.cur_lang['language_name'], languageService.get_current_language()['language_name']);
        if($rootScope.cur_lang['language_name'] !== languageService.get_current_language()['language_name']) {
          $rootScope.cur_lang = languageService.get_current_language();

          translateService.get_language_translates().then(function(resp) {
            $rootScope.translates = resp;
            translateService.set_local_translates(resp);
          }, function(resp) {
            // Utils.errMessage("BFC does not still provide translation for " + $rootScope.cur_lang['language_name']);
            $rootScope.translates = resp;
          });

          init_story_list();
        }
      }
  });

  $scope.$on( "$ionicView.beforeEnter", function( scopes, states ) {
    if( states.stateName == "app.story_list" ) {

      $rootScope.cur_lang = languageService.get_current_language();
      $rootScope.translates = translateService.get_local_translates();
      init_story_list();

    }
  });

  function init_story_list() {
    console.log("----story list-----");
    
    $scope.msg = "";
    $scope.err = 0;

    $scope.is_list_loading = true;
    $scope.all_download = false;
    $scope.check_story = true;

    $scope.story_list = [];
    $scope.remote_story_list = [];

    $scope.msg = "";

    storyService.get_language_stories().then(function(resp) {
      // resp = [];
      // $rootScope.cur_lang['language_direction'] = 'rtl';
      console.log("cur :", $rootScope.cur_lang.language_filename);
      
      if (resp.length == 0) {
        $scope.err = 1;
        $scope.msg = "Network Error";
        $scope.is_list_loading = false;
        return;
      };

      $scope.remote_story_list = resp;

      $scope.local_story_list = storyService.get_local_stories();

      if(isEmpty($scope.local_story_list)) {
        $scope.local_story_list = $scope.remote_story_list;
      }

      merge_remote_to_local_stories();

      story_list_status_setup();

      story_sort();

      // $scope.story_list[0].r_story_modified_date = "2016-11-28 13:21:42";
      // $scope.story_list[0].status = "y";
      // $scope.story_list[36].r_story_modified_date = "2016-11-28 13:21:42";
      // $scope.story_list[36].status = "y";

    }, function(resp) {
      // Utils.errMessage(resp);
      $scope.err = 1;
      $scope.msg = "Network Error";
      $scope.is_list_loading = false;

      if (resp.length == 0) {
        return;
      };

      $scope.remote_story_list = resp;
      $scope.local_story_list = storyService.get_local_stories();

      if(isEmpty($scope.local_story_list)) {
        $scope.local_story_list = $scope.remote_story_list;
      }

      merge_remote_to_local_stories();

      story_list_status_setup();

      story_sort();

    });
  }

  function order_story_list(a,b) {
    return a.story_order - b.story_order;
  }

  function story_sort() {
      $scope.story_list.sort(order_story_list);
      for (var i = 0; i < $scope.story_list.length; i++) {
        $scope.story_list[i].index = i;
        // console.log("Modified Date :", $scope.story_list[i].index, $scope.story_list[i].story_modified_date, $scope.story_list[i].r_story_modified_date);
      }
      storyService.set_local_stories($scope.story_list);
  }

  function merge_remote_to_local_stories() {

    for (var i = 0; i < $scope.remote_story_list.length; i++) {
      var item = [];
      var flag = true;
      for (var j = 0; j < $scope.local_story_list.length; j++) {

        // Compare Condition between old story on local and new story come from backend : important.

        if ($scope.remote_story_list[i].story_translated_title == $scope.local_story_list[j].story_translated_title) {
          item = $scope.local_story_list[j];
          flag = false;
        };
      };

      if (flag) { // condition that no same element with local data
        item = $scope.remote_story_list[i];
      };

      item['r_story_filename'] = $scope.remote_story_list[i].filename_prefix + $rootScope.cur_lang.language_filename + "_PDA.pdf";

      // item['r_story_id']             = $scope.remote_story_list[i].story_id;

      // item['r_language_stories_id']  = $scope.remote_story_list[i].language_stories_id;
      // item['r_story_filename']       = $scope.remote_story_list[i].story_filename;

      item['r_story_modified_date']  = $scope.remote_story_list[i].story_modified_date;
      // item['r_story_status']         = $scope.remote_story_list[i].story_status;
      // item['r_story_type_id']        = $scope.remote_story_list[i].story_type_id;
      // item['r_testament']            = $scope.remote_story_list[i].testament;
      // console.log(item['r_story_filename']);
      item.story_order = parseInt(item.story_order);
      $scope.story_list.push(item);
    };

  }

  function story_list_status_setup() {

    for (var j = 0; j < $scope.story_list.length; j++) {
      $scope.story_list[j].id = j;
      $scope.story_list[j].status = "n";
      $scope.story_list[j].percent = 0.00;
    };

    document.addEventListener('deviceready', function() {

      var folder = $rootScope.cur_lang['language_name'] + "/";

      var searchPath = cordova.file.dataDirectory + folder; // url for search folder

      for (var i = 0; i < $scope.story_list.length; i++) {
        var rUrl = $scope.story_list[i].r_story_filename;

        // check whether file exist or not

        fileService.checkFile(searchPath, rUrl, i).then(function(result) {
          if(result.status == "y") {
            $scope.story_list[result.index].status = "y";
            console.log(result.nativeURL);
          } else {
            $scope.story_list[result.index].status = "n";
          };

          if (i == $scope.story_list.length) {
            $scope.is_list_loading = false;
          };
        }, function(err) {
          
          $scope.err = 1;
          $scope.msg = "Network Error";
          if (i == $scope.story_list.length) {
            $scope.is_list_loading = false;
          };

        });
      };

    }, false);

    $scope.is_list_loading = false;

  }

  // download per story after check whenever story exist on local

  $scope.checkStory = function(index) {

    $scope.msg = "";

    if ($scope.story_list[index].status == 'd' || $scope.check_story == false) {
      console.log("downloading or view status...");
      return;
    };
    
    document.addEventListener('deviceready', function () {

        if($cordovaNetwork.isOffline()) {
          $scope.err = 1;
          $scope.msg = "Network Error";
          // return;
        }

        $scope.check_story = false;

        var folder = $rootScope.cur_lang['language_name'] + "/";

        var rUrl = $scope.story_list[index].r_story_filename;
        var url = encodeURI("http://bibleforchildren.org/PDFs/" + folder + rUrl);

        var targetPath = cordova.file.dataDirectory + folder + rUrl; // url for download
        var searchPath = cordova.file.dataDirectory + folder; // url for search folder

        var trustHosts = true;
        var options = {};

        $cordovaFile.checkFile(searchPath, rUrl).then(function(result) {

            $scope.pdf_url  = result.nativeURL;
            $scope.story_list[index].status = "y";
            $scope.story_list[index].percent = 0.00;
            $scope.check_story = true;

            $scope.pdf_init();

        }, function(err) {

          $scope.story_download(index);

        });

    });

  };

  $scope.story_download = function(index) {

    console.log($scope.story_list[index].story_order, $scope.story_list[index].story_translated_title);

    document.addEventListener('deviceready', function () {
        if($cordovaNetwork.isOffline()) {
          $scope.err = 1;
          $scope.msg = "Network Error";
          // return;
        }

        $scope.check_story = false;

        var folder = $rootScope.cur_lang['language_name'] + "/";

        var rUrl = $scope.story_list[index].r_story_filename;
        var url = encodeURI("http://bibleforchildren.org/PDFs/" + folder + rUrl);

        var targetPath = cordova.file.dataDirectory + folder + rUrl; // url for download
        var searchPath = cordova.file.dataDirectory + folder; // url for search folder

        var trustHosts = true;
        var options = {};

        $cordovaFileTransfer.download(url, targetPath, options, trustHosts)
          .then(function(result) {

            $scope.pdf_url  = result.nativeURL;
            $scope.story_list[index].status = "y";
            $scope.story_list[index].percent = 0.00;

            $scope.check_story = true;

            $scope.story_list[index].story_modified_date = $scope.story_list[index].r_story_modified_date;
            storyService.update_story_time(index, $scope.story_list[index].story_modified_date);

          }, function(err) {
            $scope.story_list[index].status = "n";
            $scope.story_list[index].percent = 0.00;

            $scope.check_story = true;

            $scope.err = 1;
            $scope.msg = "Network Error";
          }, function (progress) {
              $scope.story_list[index].status = "d";
              $scope.story_list[index].percent = ((progress.loaded / progress.total) * 100).toFixed(2);
        });
    });
  };

/*
 {
  "isFile":true,
  "isDirectory":false,
  "name":"When_God_Made_Everything_English_PDA.pdf",
  "fullPath":"/When_God_Made_Everything_English_PDA.pdf",
  "filesystem":"<FileSystem: persistent>",
  "nativeURL":"file:///Users/dale/Library/Developer/CoreSimulator/Devices/D9A25D50-B82A-49AE-A6B5-C13B5989E99E/data/Containers/Data/Application/3DAB764C-01B5-4041-A359-CA5047964872/Documents/When_God_Made_Everything_English_PDA.pdf"
 }
*/

  $ionicModal.fromTemplateUrl('templates/story_viewer.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.view_modal = modal;
    $scope.pdf_handle = pdfDelegate.$getByHandle('my-pdf-container');
  });

  $scope.openStoryView = function() {
    $scope.view_modal.show();
  };

  $scope.closeStoryView = function() {
    $scope.view_modal.hide();
    $scope.view_modal.remove();
  };


  $scope.$on('modal.shown', function() {
    console.log('Modal is shown!');
  });

  // Cleanup the modal when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.view_modal.remove();
  });
  // Execute action on hide modal
  $scope.$on('modal.hidden', function() {
    console.log('Modal is hidden!');
    $scope.check_story = true;
  });
  // Execute action on remove modal
  $scope.$on('modal.removed', function() {
    console.log('Modal is removed!');
  });

  $scope.all_story_download = function() {

    if ($scope.all_download) {
      return;
    };
    console.log("all download start!");
    $scope.all_download = true;

    document.addEventListener('deviceready', function() {

      if($cordovaNetwork.isOffline()) {
        $scope.all_download = false;
        $scope.err = 1;
        $scope.msg = "Network Error";
        return;
      }

      var folder = $rootScope.cur_lang['language_name'] + "/";

      var searchPath = cordova.file.dataDirectory + folder; // url for search folder

      var options = {};
      var trustHosts = true;

      var counter = 0;

      for (var i = 0; i < $scope.story_list.length; i++) {
        (function(i) {
          var rUrl = $scope.story_list[i].r_story_filename;
          var url = encodeURI("http://bibleforchildren.org/PDFs/" + folder + rUrl);
          var targetPath = cordova.file.dataDirectory + folder + rUrl;

          $cordovaFileTransfer.download(url, targetPath, options, trustHosts)
            .then(function(result) {
              ++counter;

              $scope.story_list[i].status = "y";
              $scope.story_list[i].percent = 0.00;

              $scope.story_list[i].story_modified_date = $scope.story_list[i].r_story_modified_date;
              storyService.update_story_time(i, $scope.story_list[i].story_modified_date);

              if (counter == $scope.story_list.length) {
                $scope.all_download = false;
                Utils.alert_all_download("BFC", "<i class='icon'></i>");
              };

            }, function(err) {
              ++counter;

              $scope.story_list[i].status = "n";
              $scope.story_list[i].percent = 0.00;

              if (counter == $scope.story_list.length) {
                $scope.all_download = false;
                Utils.alertshow("BFC", "<i class='icon ion-ios-close-circle-outline'></i>"); 
              };

            }, function (progress) {

                $scope.story_list[i].status = "d";
                $scope.story_list[i].percent = ((progress.loaded / progress.total) * 100).toFixed(2);

          });

         })(i);
      };

    }, false);

  };

  $scope.pdf_test = function() {
    // $scope.pdf_url = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/149125/relativity.pdf";
    $scope.pdf_url = "assets/1.pdf";
    $scope.currentPage = 1;

    $scope.is_story_loading = true;
    $scope.is_page_loading = false;
    $scope.story_msg = "";

    $ionicModal.fromTemplateUrl('templates/story_viewer.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.view_modal = modal;
        $scope.pdf_handle = pdfDelegate.$getByHandle('my-pdf-container');

        $scope.view_modal.show();

        $scope.pdf_handle.load($scope.pdf_url).then(function(suc) {
            $scope.pageCount = $scope.pdf_handle.getPageCount();
            $timeout(function() {$scope.is_story_loading = false;}, 500);
        }, function(err) {
            $scope.msg = "PDF File Load Error";
            $timeout(function() {$scope.is_story_loading = false;}, 500);
        });
    });

/*
        $scope.view_modal.show();

        $scope.pdf_handle.load($scope.pdf_url).then(function(suc) {
            $scope.pageCount = $scope.pdf_handle.getPageCount();
            $scope.currentPage = 1;

            $scope.is_story_loading = false;
        }, function(err) {
            $scope.story_msg = err;
            $scope.is_story_loading = false;
        });

        $scope.pdf_handle.goToPage(1);
*/
  };

  $scope.pdf_init = function() {
    $scope.currentPage = 1;
    $scope.angle = 0;

    $scope.is_story_loading = true;
    $scope.is_page_loading = false;
    $scope.story_msg = "";

    $ionicModal.fromTemplateUrl('templates/story_viewer.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.view_modal = modal;
        $scope.pdf_handle = pdfDelegate.$getByHandle('my-pdf-container');

        $scope.view_modal.show();

        $scope.pdf_handle.load($scope.pdf_url).then(function(suc) {
            $scope.pageCount = $scope.pdf_handle.getPageCount();
            $timeout(function() {$scope.is_story_loading = false;}, 500);
        }, function(err) {
            $scope.msg = "PDF File Load Error";
            $timeout(function() {$scope.is_story_loading = false;}, 500);
        });

    });

/*
        $scope.view_modal.show();

        $scope.pdf_handle.load($scope.pdf_url).then(function(suc) {
            $scope.pageCount = $scope.pdf_handle.getPageCount();
            $scope.currentPage = 1;

            $scope.is_story_loading = false;
        }, function(err) {
            $scope.story_msg = err;
            $scope.is_story_loading = false;
        });

        $scope.pdf_handle.goToPage(1);
*/
  };

  $scope.pdf_zoomOut = function() {
    $scope.pdf_handle.zoomOut();
  };

  $scope.pdf_zoomIn = function() {
    $scope.pdf_handle.zoomIn();
  };

  $scope.pdf_prev = function() {
    if ($scope.currentPage > 1) {
      // $scope.is_page_loading = true;
      $scope.currentPage -= 1;
      $scope.pdf_handle.prev();
    };
  };

  $scope.pdf_next = function() {
    if ($scope.currentPage < $scope.pageCount) {
      // $scope.is_page_loading = true;
      $scope.currentPage += 1;
      $scope.pdf_handle.next();
    };
  };

  $scope.pdf_rotate = function() {
    $scope.angle = $scope.pdf_handle.rotate();
    console.log($scope.angle);
  };

  $scope.goToPage = function() {
    $scope.pdf_handle.goToPage($scope.currentPage);
  };

  $scope.onPDFLeft = function() {

    console.log("-------To Next Page-------");
    if ($scope.currentPage < $scope.pageCount) {
      // $scope.is_page_loading = true;
      $scope.currentPage += 1;
      $scope.pdf_handle.next();
      // console.log("--------", $scope.is_page_loading);
    };

  };

  $scope.onPDFRight = function() {

    console.log("-------To Prev Page-------");
    if ($scope.currentPage > 1) {
      // $scope.is_page_loading = true;
      $scope.currentPage -= 1;
      $scope.pdf_handle.prev();
      // console.log("--------", $scope.is_page_loading);
    };

  };

  $scope.onPDFUp = function() {
    console.log("-------To Up Page-------");
  };

  $scope.onPDFDown = function() {
    console.log("-------To Down Page-------");
  };

  $scope.onPageRender = function() {

    // $scope.is_page_loading = false;
    // console.log("$$$$$$$$", $scope.is_page_loading);
  };

})
/*
.filter('searchListings', function() {
  return function (items, query) {
    var filtered = [];
    var letterMatch = new RegExp(query, 'i');
    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      if (query) {
        if (letterMatch.test(item.property._system_search_key.substring(0, query.length))) {
          filtered.push(item);
        }
      } else {
        filtered.push(item);
      }
    }
    return filtered;
  };
})
*/
;
