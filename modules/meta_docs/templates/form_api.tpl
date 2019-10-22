<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta charset="UTF-8">
    <title>ServiceDesk Service Swagger</title>
    <link rel="stylesheet" type="text/css" href="/meta_docs/css/swagger-ui.css">
    <script src="/meta_docs/js/swagger-ui-standalone-preset.js"></script>
    <script src="/meta_docs/js/swagger-ui-bundle.js"></script>
</head>
<body>
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
        url: '/meta_docs/js/loris-0.0.3-dev.yml',
        dom_id: '#swagger-ui',
        deepLinking: true,
        presets: [
          SwaggerUIBundle.presets.apis,
          SwaggerUIStandalonePreset
        ],
        plugins: [
          SwaggerUIBundle.plugins.DownloadUrl
        ],
        layout: "StandaloneLayout",
        validatorUrl: null,
      })
      window.ui = ui
    });
  </script>
</body>
</html>
