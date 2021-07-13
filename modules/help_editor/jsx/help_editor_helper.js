/* eslint new-cap: ["error", {capIsNewExceptions: ["RMarkdown"]}]*/
import swal from 'sweetalert2';

$(document).ready(function() {
    $('input[name=preview]').click(function(e) {
        if ($('div.help-content').length) {
            $('div.help-content').remove();
            e.preventDefault();
        }
        let title = $('input[name="title"]').val();
        let content = $('textarea[name="content"]').val();
        let div = document.createElement('div');
        let btn = document.createElement('BUTTON');
        let button = document.createTextNode('Close');
        let wrap = document.createElement('div');

        wrap.setAttribute('id', 'help-wrapper');
        wrap.innerHTML = '<h1>' + title + '</h1>';
        let markdownContent = document.createElement('div');
        ReactDOM.render(
            RMarkdown({content: content}),
            markdownContent
        );
        wrap.appendChild(markdownContent);
        btn.appendChild(button);
        btn.className='btn btn-default';
        btn.setAttribute('id', 'helpclose');
        div.appendChild(btn);
        div.appendChild(wrap);
        document.getElementById('wrap').appendChild(div);
        div.setAttribute('class', 'help-content');
        btn.addEventListener('click', function(e) {
            $(div).remove();
            e.preventDefault();
        });
        e.preventDefault();
    });

    $('#save-help').click(function(e) {
        e.preventDefault();
        let title = $('input[name="title"]').val();
        let content = $('textarea[name="content"]').val();
        let section = $('#section').val();
        let subsection = $('#subsection').val();
        let parentID = $('#parentID').val();
        let helpID = $('#helpID').val();
        let returnString = $('#return').val();

        $.ajax({
            type: 'POST',
            url: loris.BaseURL + '/help_editor/ajax/process.php',
            data: {
                title: title ? title : '',
                content: content ? content : '',
                section: section ? section : '',
                subsection: subsection ? subsection : '',
                parentID: parentID ? parentID : '',
                helpID: helpID ? helpID : '',
            },
            success: function() {
                swal.fire({
                    title: 'Content update successful!',
                    type: 'success',
                    showCancelButton: true,
                    confirmButtonText: returnString,
                    cancelButtonText: 'Close',
                }).then((result) => {
                    if (result.value) {
                        location.href = document.referrer;
                    }
                });
            },
            error: function(xhr, errorCode, errorMsg) {
                console.error(xhr);
                swal.fire({
                    title: 'Content update unsuccessful.',
                    text: errorCode + ': ' + xhr.status + ' ' + errorMsg,
                    type: 'error',
                    confirmButtonText: 'Try again',
                });
            },
        });
    });
});
