<script>
  document.addEventListener('DOMContentLoaded', () => {
      const app = document.getElementById('app');
      const root = ReactDOM.createRoot(
          document.getElementById('lorisworkspace')
      );
      root.render(
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
