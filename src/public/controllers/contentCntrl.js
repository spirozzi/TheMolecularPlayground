(function() {

var content = angular.module('content', [])

content.controller('contentCntrl', ['$rootScope','$scope', function($rootScope,$scope) {
  $rootScope.logged_in = 0;
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
