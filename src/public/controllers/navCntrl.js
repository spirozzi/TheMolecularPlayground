(function() {

var nav = angular.module('nav', [])

nav.controller('navCntrl', ['$rootScope','$scope', function($rootScope,$scope) {

  var in_links = [
    {text:'Home',action:'link'},
    {text:'Gallery',action:'link'},
    {text:'Account',action:'link'},
    {text:'Sign Out',action:'nav.sign_in()'}
  ];
  var out_links = [
    {text:'Sign Up',action:"openSignInUpModal()"},
    {text:'Log In',action:"openSignInUpModal()"}
  ];

  $rootScope.get_links = function(lin){
    if($rootScope.logged_in) links = in_links;
    else links = out_links;

    return links;
  };

  $scope.signInUp = function(type){
    $('#signinupModal').closeModal();
    if (type == 'login'){
      $rootScope.logged_in = 1;
    }
    else if (type == 'signup'){

    }
  }

  $scope.handleNavigation = function(text){
    if (text == "Sign Up" || text == "Log In"){
      $scope.openSignInUpModal(text);
    }
    else if (text == "Sign Out"){
      $rootScope.view = "Home";
      $rootScope.logged_in = 0;
    }
    else{
      $rootScope.view = text;
    }
  };

  $scope.openSignInUpModal = function(type){
    $scope.type = type;

    $('#signinupModal').openModal();
  }
}]);
})();
