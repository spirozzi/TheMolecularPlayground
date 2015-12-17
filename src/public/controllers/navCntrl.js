(function() {

var nav = angular.module('nav', [])

nav.controller('navCntrl', ['$rootScope','$scope','$http','$cookies', function($rootScope,$scope, $http,$cookies) {

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

  if(!$cookies.get('userPermLevel')){
    var expireDate = new Date();
    expireDate.setDate(expireDate.getDate() + 1);
    $cookies.put('userPermLevel',1, {'expires': expireDate});
  }

  $scope.has_perm_level = function(needed){
    console.log($cookies.get('permLevel')>= needed);
    return $cookies.get('permLevel') >= needed;
  }

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
          $cookies.put('curUser',fields['username']);
          if (fields['username'] === "admin"){
            $cookies.put('permLevel',5);
          }
          else if(fields['username'] === 'user'){
            $cookies.put('permLevel',$cookies.get('userPermLevel'));
          }
          else{
            $cookies.put('permLevel',1)
          }
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
      $cookies.remove('curUser');
      $cookies.remove('permLevel');
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
