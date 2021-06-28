/*global document: false, $: false, window: false*/
function change() {
    "use strict";
    $('#hide').show();
    $('#show').hide();
    $('#mri-protocol').show();
    $('#show').bind('click', function () {
        $('#mri-protocol').parents('.dynamicContentWrapper').show('slow', function () {});
        $('#hide').show();
        $('#show').hide();
    });

    //To hide : table hides...and the show shows...
    $('#hide').bind('click', function () {
        $('#mri-protocol').parents('.dynamicContentWrapper').hide('slow', function () {});
        $('#show').show();
        $('#hide').hide();
    });
}

$(function () {
    "use strict";
    change();
});
