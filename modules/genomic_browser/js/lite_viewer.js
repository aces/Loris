    function showData() {

        console.log('showData');
        var inputValues = {
            chromosome: document.getElementsByName('Chromosome')[0].value,
            startLoc:  document.getElementsByName('StartLoc')[0].value,
            endLoc:  document.getElementsByName('EndLoc')[0].value,
        };

        $('#chart-placeholder-2 div').remove();

        var chartContainer = document.getElementById('chart-placeholder-2');
        React.render(React.createElement(
            GenomicViewer,
            {
                DataURL: '/AjaxHelper.php?Module=genomic_browser&script=getBetaValues.php',
                width: chartContainer.clientWidth,
                height: 400,
                chromosome: inputValues.chromosome,
                startLoc: inputValues.startLoc,
                endLoc: inputValues.endLoc
            }
        ), chartContainer);

        $('[data-toggle="tooltip"]').tooltip();
    }

$(document).on("click", ".snp", function () {
     var snpId = $(this).data('id');
     $("#myModalLabel").html( snpId );

});
