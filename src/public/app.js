(function() {

  var app = angular.module('app', [
    "ngCookies",
    'nav','content','jmol','users'
  ])

  app.controller('masterCntrl', ['$rootScope','$scope', function($rootScope,$scope) {


  }]);


  app.directive('content', function() {
    return {
      restrict: 'E',
      templateUrl: 'templates/content.ejs',
      controller: 'contentCntrl as content'
    };
  });
  app.directive('navbar', function() {
    return {
      restrict: 'E',
      templateUrl: 'templates/nav.ejs',
      controller: 'navCntrl as nav'
    };
  });

})();
