angular.module('bfc')
.service('fileService', function ($q, $http, BACKEND_API, HEADERS, $cordovaFileTransfer, $cordovaFile, $timeout) {
	var self = this;

	self.checkFile = function(searchURL, file, index) {
		var defer = $q.defer();
	    document.addEventListener('deviceready', function() {
	    	
			$cordovaFile.checkFile(searchURL, file).then(function(result) {
				defer.resolve({
					"status" : "y",
					"index" : index,
					"nativeURL" : result.nativeURL
				});
			}, function(err) {
				defer.resolve({
					"status" : "n",
					"index" : index
				});
			});
			
	    }, false);
	    return defer.promise;
	}

	self.test_file_download = function() {
		
		document.addEventListener('deviceready', function () {
			// var url = "http://www.gajotres.net/wp-content/uploads/2015/04/logo_radni.png";
		    var url = "http://cdn.wall-pix.net/albums/art-space/00030109.jpg";
		    var targetPath = cordova.file.documentsDirectory + "testImage.png";
		    var trustHosts = true;
		    var options = {};

		    $cordovaFileTransfer.download(url, targetPath, options, trustHosts)
		      .then(function(result) {
		        console.log("-------- Success ---------");
		      }, function(err) {
		        console.log("-------- Fail ---------");
		      }, function (progress) {
		        $timeout(function () {
		          var downloadProgress = (progress.loaded / progress.total) * 100;
		          console.log("--------", downloadProgress);
		        });
		      });

		}, false);
	};

});