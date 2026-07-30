<script>
  document.addEventListener('DOMContentLoaded', () => {
      ReactDOM.createRoot(
          document.getElementById('lorisworkspace')
      ).render(
          React.createElement(RHelpEditorForm, {
            title:      {$title|@json_encode nofilter},
            content:    {$content|@json_encode nofilter},
            section:    {$section|@json_encode nofilter},
            subsection: {$subsection|@json_encode nofilter},
            instrument: {$instrument|@json_encode nofilter},
            instrumentslist: {$instrumentslist|@json_encode nofilter},
            helpid:     {$helpid},
          })
      );
  });
</script>
