(function() {

  var jmol = angular.module('jmol', [])

  jmol.controller('jmolCntrl', ['$rootScope','$scope', function($rootScope,$scope) {
    var socket = io.connect("http://localhost:3000");

    // set up socket event handlers
    socket.on('upload-status', function(data) {
      if (data.status) {
        $('#uploadstatus').text('Upload succeeded.');
      } else {
        $('#uploadstatus').text('Upload failed. Please try again.');
      }
    });

    this.fileType = 1;

    this.fields = {
      coordFilePath: '',
      animationFilePath: '',
      coordFileName: '',
      animationFileName: '',
      title:'',
      desc:''
    };

    this.uploadContent = function(){
      console.log(this.fields);
      if (this.fields.coordFilePath === ''){
        Materialize.toast("Please specify a xzy coordnate file", 4000) // 4000 is the duration of the toast
      }
      else{
        console.log('Upload button submit handler invoked');

        cFilePath = $('#cfP').val();
        aFilePath = $('#afP').val();

        // get file data
        var reader = new FileReader();
        // function called when file data has been successfully read
        reader.onload = function(e) {
          console.log("Uploading raw file data");
          var rawfiledata = e.target.result;
          console.log(rawfiledata);
          socket.emit('upload-file', { file: rawfiledata, name: this.fields.title });
        };
        console.log("Reading File "+cFilePath);

        reader.readAsBinaryString(cFilePath);
      }
    }

    this.molecules = [
      {name:"Dextroamphetamine",author:"Bill Nye",src:"jsmol/adderall.mol"},
      {name:"Ethanal",author:"Bill Nye",src:"jsmol/ethanal.mol"},
      {name:"Dopamine",author:"Bill Nye",src:"jsmol/dopamine.mol"},
      {name:"Methylenedioxyphenethylamine",author:"Bill Nye",src:"jsmol/methylenedioxyphenethylamine.mol"},
      {name:"Benzene",author:"Bill Nye",src:"jsmol/benzene.mol"}
    ];

  }]);
})();
