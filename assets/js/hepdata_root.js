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

                $('#file_contents').html(evt.target.result);
                $('#proceedButton').removeClass('hidden');

                HEPDataROOT.functions.process_root(loadedFile);
            }
        };

        var blob = file.slice(start, stop + 1);
        reader.readAsBinaryString(blob);
    },

    process_root: function (file_contents) {
        var filename = "https://root.cern.ch/js/files/hsimple.root";
        JSROOT.source_min = true;
        JSROOT.source_dir = "assets/jsroot/";

        alert(file_contents);
        var f = new JSROOT.TFile(filename, function (file) {
            alert(file);
            file.ReadObject("hprof;1", function (obj) {
                JSROOT.draw("canvas", obj, "colz");
            });
        });
    }
}
