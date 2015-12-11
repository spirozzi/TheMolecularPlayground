(function() {

var nav = angular.module('nav', [])

nav.controller('navCntrl', ['$rootScope','$scope','$http', function($rootScope,$scope, $http) {

  this.fields = {
    firstname: '',
    lastname: '',
    email: '',
    phonenumber: '',
    username: '',
    password: ''
  }

  this.username = '';
  this.firstname = '';
  this.lastname = '';
  this.email = '';
  this.phonenumber = '';
  this.username = '';
  this.password = '';

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

  this.signInUp = function(fields,type){
    var close = true;

    if (type == 'login'){
      if (fields['username'] === ""){
        Materialize.toast("Please fill in the username field", 4000) // 4000 is the duration of the toast
        close = false;
      }
      if (fields['password'] === ""){
        Materialize.toast("Please fill in the password field", 4000) // 4000 is the duration of the toast
        close = false;
      }
      if (close){
        // Login call
        console.log(fields)
        $http.post("/userlogin",fields).then(function(response) {
          console.log('user logged in.');
          $rootScope.logged_in = 1;
        });
      }
    }
    else if (type == 'signup'){
      for(var prop in fields) {
        if (fields[prop] === ""){
          Materialize.toast("Please fill in the "+prop+" field", 4000) // 4000 is the duration of the toast
          close = false;
        }
      }
      if (close){
        $http.post("/usersignup",fields).then(function(response) {
            console.log('user signed up.');
        });
      }

    }

    if (close){
      $('#signinupModal').closeModal();
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

nav.directive('signinupmodal', function() {
  return {
    templateUrl: 'templates/signInUpModal.ejs'
  };
});
})();
