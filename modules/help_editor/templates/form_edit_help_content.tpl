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
            helpid:     {$helpid},
          })
      );
  });
</script>
