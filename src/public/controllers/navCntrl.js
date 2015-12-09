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
    console.log(lin);
    if($rootScope.logged_in) links = in_links;
    else links = out_links;

    return links;
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
})();
