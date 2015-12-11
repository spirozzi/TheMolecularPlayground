(function() {

var content = angular.module('content', ['ngCookies'])

content.controller('contentCntrl', ['$rootScope','$scope','$http','$cookies', function($rootScope,$scope,$http,$cookies) {

  $rootScope.is_logged_in = function(){
      var sid = $cookies.getAll()["connect.sid"];
      console.log(sid)
      $http.post("/isuserloggedin",{sessionID:sid}).then(function(response) {
        console.log(response.data.userloggedin);
        return response.data.userloggedin;
      });
  }

  $rootScope.logged_in = $rootScope.is_logged_in();
  $rootScope.permission_level = 0;

  $rootScope.view = "Home"


}]);

content.directive('gallery', function() {
  return {
    restrict: 'E',
    templateUrl: 'templates/gallery.ejs'
  };
});
content.directive('home', function() {
  return {
    restrict: 'E',
    templateUrl: 'templates/home.ejs'
  };
});
content.directive('account', function() {
  return {
    restrict: 'E',
    templateUrl: 'templates/account.ejs'
  };
});
content.directive('contentAuthor', function() {
  return {
    restrict: 'E',
    templateUrl: 'templates/contentAuthor.ejs'
  };
});
content.directive('playgroundManagement', function() {
  return {
    restrict: 'E',
    templateUrl: 'templates/playgroundManagement.ejs'
  };
});
content.directive('globalManagement', function() {
  return {
    restrict: 'E',
    templateUrl: 'templates/globalManagement.ejs'
  };
});
content.directive('playlistCreation', function() {
  return {
    restrict: 'E',
    templateUrl: 'templates/playlistCreation.ejs'
  };
});

})();
