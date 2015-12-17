(function() {

  var users = angular.module('users', [])

  users.controller('usersCntrl', ['$rootScope','$scope','$cookies', function($rootScope,$scope,$cookies) {

    $scope.users = [
      {name:"Sally",email:"sally@umass.edu",status:"approved",editPlaylists:1,createPlaylists:1},
      {name:"user",email:"user@user.com",status:"waiting",editPlaylists:0,createPlaylists:0},
      {name:"Jane",email:"jane@umass.edu",status:"waiting",editPlaylists:0,createPlaylists:0},
      {name:"Sarah",email:"sarah@umass.edu",status:"rejected",editPlaylists:0,createPlaylists:0}
    ];

    $scope.updateStatus = function(name, status){
      for (idx in $scope.users){
        if ($scope.users[idx].name === name){
          if ($scope.users[idx].name === "user"){
            var expireDate = new Date();
            expireDate.setDate(expireDate.getDate() + 1);
            $cookies.put('userPermLevel',3, {'expires': expireDate});
          }
          $scope.users[idx].status = status;
        }
      }
    }

  }]);
})();
