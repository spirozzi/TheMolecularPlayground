(function() {

  var jmol = angular.module('jmol', [])

  jmol.controller('jmolCntrl', ['$rootScope','$scope', function($rootScope,$scope) {




  }]);
  jmol.directive('contentRow', function() {
    return {
      restrict: 'E',
      templateUrl: 'templates/contentRow.ejs'
    };
  });
})();
