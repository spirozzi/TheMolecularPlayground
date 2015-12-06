(function() {

var content = angular.module('content', [])

content.directive('content', function() {
  return {
    templateUrl: 'templates/content.ejs'
  };
});
})();
