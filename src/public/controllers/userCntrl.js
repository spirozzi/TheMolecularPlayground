(function() {

var user = angular.module('user', [])

user.controller('userCntrl', ['$scope', function($scope) {

  $scope.openSignInUpModal = function(type){
    $scope.type = type;

    $('#signinupModal').openModal();
  }
}]);


user.directive('signinupmodal', function() {
  return {
    templateUrl: 'templates/signInUpModal.ejs',
    controller: "userCntrl as user"
  };
});
})();
