<script>
  document.addEventListener('DOMContentLoaded', () => {
      ReactDOM.createRoot(
          document.getElementById('lorisworkspace')
      ).render(
          React.createElement(RHelpEditorForm, {
            title:      "{$title}",
            content:    `{$content}`,
            section:    "{$section}",
            subsection: "{$subsection}",
            instrument: "{$instrument}",
            instrumentslist: {$instrumentslist|@json_encode nofilter},
            helpid:     {$helpid},
          })
      );
  });
</script>
