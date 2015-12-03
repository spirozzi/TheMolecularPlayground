(function() {

var nav = angular.module('nav', [])

nav.controller('navCntrl', ['$scope', function($scope) {
  var in_links = [
    {text:'sign out',action:'nav.sign_in()'},
    {text:'account',action:'link'},
    {text:'gallery',action:'link'},
    {text:'home',action:'link'}
  ];
  var out_links = [
    {text:'sign up',action:"onclick=$('#signinupModal').openModal();"},
    {text:'log in',action:"onclick=$('#signinupModal').openModal();"}
  ];

  this.sign_in = function(){
    $scope.signed_in = !$scope.signed_in;
  };

  this.get_links = function(){
    if (this.signed_in) return in_links;
    else return out_links;
  };
}]);

nav.directive('navbar', function() {
  return {
    templateUrl: 'templates/nav.ejs',
    controller: 'navCntrl as nav'
  };
});
})();
