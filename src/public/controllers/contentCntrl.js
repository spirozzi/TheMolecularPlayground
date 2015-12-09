(function() {

var content = angular.module('content', [])

content.controller('contentCntrl', ['$rootScope','$scope', function($rootScope,$scope) {
  $rootScope.logged_in = 1;
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

})();
