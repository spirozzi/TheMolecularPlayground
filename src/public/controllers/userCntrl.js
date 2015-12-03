(function() {

var user = angular.module('user', [])


user.directive('signinupModal', function() {
  return {
    templateUrl: 'templates/loginSignupModal.ejs'
  };
});
})();
