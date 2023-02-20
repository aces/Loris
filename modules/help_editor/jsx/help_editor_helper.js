/* eslint-disable */
import swal from 'sweetalert2';

document.addEventListener('DOMContentLoaded', () => {
    $('input[name=preview]').on('click', function(e) {
        if ($('div.help-content').length) {
            $('div.help-content').remove();
            e.preventDefault();
        }
        let title = document.getElementsByName('title')[0].value;
        let content = document.getElementsByName('content')[0].value;
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

    $('#save-help').on('click', function(e) {
        e.preventDefault();
        const title = document.getElementsByName('title')[0].value ?? '';
        const content = document.getElementsByName('content')[0].value ?? '';
        const section = document.getElementById('section').value ?? '';
        const subsection = document.getElementById('subsection').value ?? '';
        const helpID = document.getElementById('helpID').value ?? '';
        const returnString = document.getElementById('return').value;

        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);
        formData.append('section', section);
        formData.append('subsection', subsection);
        formData.append('helpID', helpID);

        fetch(loris.BaseURL + '/help_editor/ajax/process.php', {
            method: 'POST',
            body: formData,
        }).then((response) => {
            if (response.status !== 200) {
                console.error(response.status);
                return;
            }
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
        }).catch((error) => {
            console.error(error);
            swal.fire({
                title: 'Content update unsuccessful.',
                text: 'Something went wrong',
                type: 'error',
                confirmButtonText: 'Try again',
            });
        });
    });
});
