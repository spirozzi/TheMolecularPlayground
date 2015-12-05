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
    {text:'sign up',action:"nav.showSignInUpModal()"},
    {text:'log in',action:"showSignInUpModal"}
  ];

  this.sign_in = function(){
    $scope.signed_in = !$scope.signed_in;
  };

  this.get_links = function(){
    if (this.signed_in) return in_links;
    else return out_links;
  };

  this.showSignInUpModal = function(){
    console.log("test");
  }

  this.call_function = function(string){
    if(angular.isFunction(this[name]))
      this[string]();
    else {
      console.log(string);
    }
  }


  this.getAction = function(idx){
    var links = this.get_links();
    var action = links[idx].action;
    return action
  };

  this.showSignInUpModal = function(){
    console.log("showing");
    $('#signinupModal').openModal();
  };
}]);

nav.directive('navbar', function() {
  return {
    templateUrl: 'templates/nav.ejs',
    controller: 'navCntrl as nav'
  };
});
})();
