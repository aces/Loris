<script>
  document.addEventListener('DOMContentLoaded', () => {
      ReactDOM.createRoot(
          document.getElementById('lorisworkspace')
      ).render(
          React.createElement(RHelpEditorForm, {
            title:      {$title|json_encode nofilter},
            content:    {$content|json_encode nofilter},
            section:    "{$section}",
            subsection: "{$subsection}",
            instrument: "{$instrument}",
            instrumentslist: {$instrumentslist|@json_encode nofilter},
            helpid:     {$helpid},
          })
      );
  });
</script>
