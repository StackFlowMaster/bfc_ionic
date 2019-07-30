angular.module('bfc')

  .directive('ionicstringtohtml', ['$compile', function($compile) {
    return function(scope, element, attrs) {
      scope.$watch(
        function(scope) {
          return scope.$eval(attrs.inputstring);
        },
        function(value) {
          element.html(value);
          $compile(element.contents())(scope);
        }
      );
    };
  }])

.factory('REGX', function() {
  var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
  return {
    validEmail : function(email) {
      return re.test(email);
    }
  }
})

.factory('Utils', function($ionicLoading, $ionicPopup) {

  var Utils = {

      show: function(title) {
        var caption = "Loading...";
        if(title) {
          caption = title;
        };

        $ionicLoading.show({
          animation: 'fade-in',
          showBackdrop: false,
          maxWidth: 200,
          showDelay: 500,
          template: '<ion-spinner class="light"></ion-spinner><br /><span>' + caption + '</span>'
        });
      },

      hide: function(){
        $ionicLoading.hide();
      },

      alertshow: function(tit, msg){
        var alertPopup = $ionicPopup.alert({
          title: tit,
          template: msg,
          cssClass : 'bfc_dlg',
          buttons: [
            {
              text: '<b>OK</b>',
              type: 'button-balanced',
              onTap: function(e) {
                /*
                if (!$scope.data.wifi) {
                  //don't allow the user to close unless he enters wifi password
                  e.preventDefault();
                } else {
                  return $scope.data.wifi;
                }
                */
              }
            }
          ]
        });

        alertPopup.then(function(res) {
          //console.log('Registrado correctamente.');
        });
      },

      alert_all_download : function(tit, msg) {
        var alertPopup = $ionicPopup.alert({
          title: tit,
          template: msg,
          cssClass : 'bfc_dlg',
          buttons: [
            {
              text: 'OK',
              type: 'button-balanced icon-right ion-checkmark-circled',
              onTap: function(e) {
              }
            }
          ]
        });

        alertPopup.then(function(res) {
          //console.log('...');
        });
      },


      errMessage: function(err) {

        var msg = "Error! " + err;

        Utils.alertshow("Error", msg);
      },

    };

  return Utils;

})

.factory('$localstorage', ['$window', function($window) {
	return {
		set: function(key, value) {
		 $window.localStorage[key] = value;
		},
		get: function(key, defaultValue) {
		 return $window.localStorage[key] || defaultValue;
		},
		setObject: function(key, value) {
		 $window.localStorage[key] = JSON.stringify(value);
		},
		getObject: function(key) {
		 return JSON.parse($window.localStorage[key] || '{}');
		}
	}
}]);

function isEmpty(obj){
    return (Object.getOwnPropertyNames(obj).length === 0);
}

function toparams(obj) {
  var p = [];
  for (var key in obj) {
      p.push(key + '=' + encodeURIComponent(obj[key]));
  }

  return p = p.join('&');
}

function predicatBy(prop){
  return function(a,b){
    if( a[prop] > b[prop]){
        return 1;
    }else if( a[prop] < b[prop] ){
        return -1;
    }
    return 0;
  }
}

function cat_subs(menus) {
  cats = [];
  for (i in menus) {
      category = menus[i];
      cats.push({category_id: category['category_id'], products: category['products']});
      if (category['categories'] && category['categories'].length > 0) {
          cats = cats.concat(cat_subs(category['categories']));
      }
  }
  return cats;
}

function current_date() {
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth()+1; //January is 0!
  var yyyy = today.getFullYear();

  if(dd<10) {
      dd='0'+dd
  } 

  if(mm<10) {
      mm='0'+mm
  } 

  today = yyyy + '-' + mm + '-' + dd;

  return today;
}

function strToBool(str) {
  if(str === "true") {
    return true;
  } else {
    return false;
  }
}

function titleCase(str) {
   var splitStr = str.toLowerCase().split(' ');
   for (var i = 0; i < splitStr.length; i++) {
       // You do not need to check if i is larger than splitStr length, as your for does that for you
       // Assign it back to the array
       splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);     
   }
   // Directly return the joined string
   return splitStr.join(' '); 
}

function checkOrientation(){
      var currMode = "";
 
      switch(window.orientation){
 
           case 0:
           currMode = "portrait";
           break;
 
           case -90:
           currMode = "landscape";
           break;
 
           case 90:
           currMode = "landscape";
           break;
 
           case 180:
           currMode = "landscape";
           break;
     }
     return currMode;
}


