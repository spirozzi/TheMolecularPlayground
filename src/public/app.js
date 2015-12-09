(function() {

  var app = angular.module('app', [
    'nav','content'
  ])

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
