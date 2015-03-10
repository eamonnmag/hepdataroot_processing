HEPDataROOT = {};

HEPDataROOT.functions = {

    process_file: function (opt_startByte, opt_stopByte) {

        var files = document.getElementById('root_file_upload').files;
        if (!files.length) {
            alert('Please select a file!');
            return;
        }

        var file = files[0];
        var start = parseInt(opt_startByte) || 0;
        var stop = parseInt(opt_stopByte) || file.size - 1;

        var reader = new FileReader();

        // If we use onloadend, we need to check the readyState.
        reader.onloadend = function (evt) {
            if (evt.target.readyState == FileReader.DONE) { // DONE == 2
                $('#fileContentHeader').removeClass("hidden");
                loadedFile = evt.target.result;

                //$('#file_contents').html(evt.target.result);
                $('#proceedButton').removeClass('hidden');

                HEPDataROOT.functions.process_root(loadedFile);
            }
        };

        var blob = file.slice(start, stop + 1);
        reader.readAsBinaryString(blob);
    },

    process_root: function (file_contents) {
        JSROOT.source_min = true;
        JSROOT.source_dir = "assets/jsroot/";
        var file_contents = "https://root.cern.ch/js/files/hsimple.root";
        var ignore = ["ntuple", "StreamerInfo"];
        var f = new JSROOT.TFile(file_contents, function (file) {


            for (var key in file.fKeys) {
                if (ignore.indexOf(file.fKeys[key].fName) == -1) {

                    $("#canvas").append(
                        '<div class="plot-container">' +
                            '<h4 id="' + file.fKeys[key].fName + '-title"></h4>' +
                            '<div id="' + file.fKeys[key].fName + '"></div>' +
                            '<p id="' + file.fKeys[key].fName + '-description"></p>' +
                        '</div>'
                    );

                    var plot_key = file.fKeys[key].fName + ";1";
                    file.ReadObject(plot_key, function (obj) {
                        console.log(obj)
                        JSROOT.draw(obj.fName, obj, "colz");
                        $("#" + obj.fName + "-title").text(obj.fName);
                        $("#" + obj.fName + "-description").text(obj.fTitle);
                    });
                }
            }
        });
    }
}
