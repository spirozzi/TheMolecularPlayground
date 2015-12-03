angular.module('nav', [])

.controller('navCntrl', ['$scope', function($scope) {
  var in_links = [
    {text:'sign out',action:'nav.sign_in()'},
    {text:'account',action:'link'},
    {text:'gallery',action:'link'},
    {text:'home',action:'link'}
  ];
  var out_links = [
    {text:'sign up',action:'link'},
    {text:'log in',action:'nav.sign_in()'}
  ];

  this.signed_in = 0;
  this.sign_in = function(){
    this.signed_in = !this.signed_in;
  };
  
  this.get_links = function(){
    if (this.signed_in) return in_links;
    else return out_links;
  };
}])


.directive('navbar', function() {
  return {
    templateUrl: 'templates/nav.ejs',
    controller: 'navCntrl as nav'
  };
});
