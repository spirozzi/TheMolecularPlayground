(function() {

var user = angular.module('user', [])

user.controller('userCntrl', ['$scope', function($scope) {
}]);


user.directive('signinupmodal', function() {
  return {
    templateUrl: 'templates/loginSignupModal.ejs',
    controller: "userCntrl as user"
  };
});
})();
