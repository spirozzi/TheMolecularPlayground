(function() {

  var jmol = angular.module('jmol', [])

  jmol.controller('jmolCntrl', ['$rootScope','$scope', function($rootScope,$scope) {
    this.molecules = [
      {name:"Dextroamphetamine",author:"Bill Nye",src:"jsmol/adderall.mol"},
      {name:"Ethanal",author:"Bill Nye",src:"jsmol/ethanal.mol"},
      {name:"Dopamine",author:"Bill Nye",src:"jsmol/dopamine.mol"},
      {name:"Methylenedioxyphenethylamine",author:"Bill Nye",src:"jsmol/methylenedioxyphenethylamine.mol"},
      {name:"Benzene",author:"Bill Nye",src:"jsmol/benzene.mol"}
    ];

  }]);
})();
