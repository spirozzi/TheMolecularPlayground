(function() {

var content = angular.module('content', ['ngCookies'])

content.controller('contentCntrl', ['$rootScope','$scope','$http','$cookies', function($rootScope,$scope,$http,$cookies) {

  $rootScope.is_logged_in = function(){
    return ($cookies.get('curUser') && $cookies.get('curUser').length > 0);
  }

  $rootScope.logged_in = $rootScope.is_logged_in();
  $rootScope.permission_level = 0;

  $rootScope.view = "Home"


// jmol stuff 
  var socket = io.connect("http://localhost:3000");
  console.log($rootScope.newMol)
  // set up socket event handlers
  socket.on('upload-status', function(data) {
    if (data.status) {
      $('#uploadstatus').text('Upload succeeded.');
    } else {
      $('#uploadstatus').text('Upload failed. Please try again.');
    }
  });

  $rootScope.newMol = "";

  $rootScope.fileType = 1;

  $rootScope.fields = {
    coordFilePath: '',
    animationFilePath: '',
    coordFileName: '',
    animationFileName: '',
    title:'',
    desc:'',
    file:undefined
  };

  $rootScope.uploadContent = function(){
    if ($rootScope.fields.coordFilePath === ''){
      Materialize.toast("Please specify a xzy coordnate file", 4000) // 4000 is the duration of the toast
    }
    else{
      console.log('Upload button submit handler invoked');
      c = $('#cfP')[0]

      // get file data
      var reader = new FileReader();
      reader.fname = c.files[0].name;
      reader.newMol = ""
      // function called when file data has been successfully read
      status = false;
      reader.onload = function(e) {
        console.log("Uploading raw file data");
        var rawfiledata = e.target.result;
        socket.emit('upload-file', { file: rawfiledata, name: reader.fname });
        socket.on('upload-status', function(data) {
          var status = data.status
          if (status){
            $('#submitContentModal').closeModal();
          }
          else{
            Materialize.toast("Upload failed", 4000) // 4000 is the duration of the toast
          }
        });
      };

      reader.readAsBinaryString(c.files[0]);

      $rootScope.newMol = {name: reader.fname.substring(0,reader.fname.lastIndexOf('.')), author: 'Team Mufasa', src:"assets/mols/"+reader.fname}
      $rootScope.molecules.push($rootScope.newMol);
      console.log($rootScope.molecules);
    }
  };


  $rootScope.molecules = [
    {name:"Dextroamphetamine",author:"Bill Nye",src:"assets/mols/Dextroamphetamine.mol"},
    {name:"Ethanol",author:"The Irish",src:"assets/mols/Ethanol.mol"},
    {name:"Dopamine",author:"The Brain",src:"assets/mols/Dopamine.mol"},
    {name:"Benzene",author:"Some Scientist",src:"assets/mols/Benzene.mol"}
  ];


}]);

content.directive('gallery', function() {
  return {
    restrict: 'E',
    templateUrl: 'templates/gallery.ejs'
  };
});
content.directive('home', function() {
  return {
    restrict: 'E',
    templateUrl: 'templates/home.ejs'
  };
});
content.directive('account', function() {
  return {
    restrict: 'E',
    templateUrl: 'templates/account.ejs'
  };
});
content.directive('contentAuthor', function() {
  return {
    restrict: 'E',
    templateUrl: 'templates/contentAuthor.ejs',
    controller: 'jmolCntrl as jmol'
  };
});
content.directive('playgroundManagement', function() {
  return {
    restrict: 'E',
    templateUrl: 'templates/playgroundManagement.ejs'
  };
});
content.directive('globalManagement', function() {
  return {
    restrict: 'E',
    templateUrl: 'templates/globalManagement.ejs'
  };
});
content.directive('playlistCreation', function() {
  return {
    restrict: 'E',
    templateUrl: 'templates/playlistCreation.ejs'
  };
});


})();
