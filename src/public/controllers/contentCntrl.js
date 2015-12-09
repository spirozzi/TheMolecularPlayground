(function() {

var content = angular.module('content', [])

content.controller('contentCntrl', ['$rootScope','$scope', function($rootScope,$scope) {
  $rootScope.logged_in = 1;
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

content.directive('signinupmodal', function() {
  return {
    templateUrl: 'templates/signInUpModal.ejs'
  };
});

})();
