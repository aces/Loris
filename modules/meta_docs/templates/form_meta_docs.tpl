  <link rel="stylesheet" type="text/css" href="/meta_docs/css/swagger-ui.css">
  <script src="/meta_docs/js/swagger-ui-standalone-preset.js"></script>
  <script src="/meta_docs/js/swagger-ui-bundle.js"></script>
  <div id="swagger-ui"></div>
  <style>
    html
    {
      box-sizing: border-box;
      overflow: -moz-scrollbars-vertical;
      overflow-y: scroll;
    }
    *,
    *:before,
    *:after
    {
      box-sizing: inherit;
    }
    body
    {
      margin:0;
      background: #fafafa;
    }
    .version
    {
      background-color: inherit;
    }
  </style>
  <script>
    window.addEventListener('load', () => {
      const ui = SwaggerUIBundle({
        urls: {$schema_urls},
        dom_id: '#swagger-ui',
        deepLinking: true,
        presets: [
          SwaggerUIBundle.presets.apis,
          SwaggerUIStandalonePreset
        ],
        plugins: [
          SwaggerUIBundle.plugins.DownloadUrl
        ],
        layout: 'StandaloneLayout',
        validatorUrl: null,
      })
      window.ui = ui;
    });
  </script>
