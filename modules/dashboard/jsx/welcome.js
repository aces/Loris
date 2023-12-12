import DOMPurify from 'dompurify';

window.addEventListener('load', () => {
    fetch(loris.BaseURL + '/dashboard/projectdescription').then( (resp) => {
        if (!resp.ok) {
            throw new Error('Could not get project description');
        }
        return resp.json();
    }).then( (json) => {
      const el = document.getElementById('project-description');
      el.innerHTML = DOMPurify.sanitize(json.Description);
    }).catch( (e) => console.error(e));
});
