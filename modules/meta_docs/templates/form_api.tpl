<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta charset="UTF-8">
    <title>ServiceDesk Service Swagger</title>
    <link rel="stylesheet" type="text/css" href="/meta_docs/css/swagger-ui.css">
</head>
<body>

<div id="swagger-ui"></div>

<script src="/meta_docs/js/swagger-ui-standalone-preset.js"></script>
<script src="/meta_docs/js/swagger-ui-bundle.js"></script>

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
  })
  window.ui = ui
});
</script>
</body>
</html>
