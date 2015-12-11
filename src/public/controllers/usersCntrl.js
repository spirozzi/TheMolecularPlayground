(function() {

  var jmol = angular.module('users', [])

  jmol.controller('usersCntrl', ['$rootScope','$scope', function($rootScope,$scope) {

    this.users = [
      {name:"Sally",email:"sally@umass.edu",status:"approved",editPlaylists:1,createPlaylists:1},
      {name:"Joe",email:"joe@umass.edu",status:"waiting",editPlaylists:0,createPlaylists:0},
      {name:"Jane",email:"jane@umass.edu",status:"waiting",editPlaylists:0,createPlaylists:0},
      {name:"Sarah",email:"sarah@umass.edu",status:"rejected",editPlaylists:0,createPlaylists:0}
    ];

  }]);
})();
