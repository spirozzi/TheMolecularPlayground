(function() {

  var app = angular.module('app', [
    'nav','content'
  ])

  app.controller('masterCntrl', ['$rootScope','$scope', function($rootScope,$scope) {

    this.view = "sdf"


/*
    this.src_obj = {'test2' : "jsmol/test2.mol"}

    this.Info = {
  		width: 450,
  		height: 450,
  		color: "black",
  		j2sPath: "j2s",
  		addSelectionOptions: false,
  		serverURL: "http://chemapps.stolaf.edu/jmol/jsmol/jsmol.php",
  		src: this.src_obj.test2,
  		readyFunction: null,
  		console: "jmol_infodiv",
  		disableInitialConsole: true,
  		defaultModel: null,
  		debug: false
  	};
*/
  }]);

  /*app.directive('jmolPreview', function() {
    return {
      restrict: 'E',
      templateUrl: 'templates/jmolPreview.ejs'
    };
  });*/

  app.directive('content', function() {
    return {
      restrict: 'E',
      templateUrl: 'templates/content.ejs',
      controller: 'contentCntrl as content'
    };
  });
  app.directive('navbar', function() {
    return {
      restrict: 'E',
      templateUrl: 'templates/nav.ejs',
      controller: 'navCntrl as nav'
    };
  });

})();
