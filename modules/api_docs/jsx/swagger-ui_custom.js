import {SwaggerUIBundle, SwaggerUIStandalonePreset} from 'swagger-ui-dist';

window.addEventListener('load', () => {
  /* jshint newcap: false */
  const ui = new SwaggerUIBundle({
    urls: schema_urls,
    dom_id: '#swagger-ui',
    deepLinking: true,
    presets: [
      SwaggerUIBundle.presets.apis,
      SwaggerUIStandalonePreset,
    ],
    plugins: [
      SwaggerUIBundle.plugins.DownloadUrl,
    ],
    layout: 'StandaloneLayout',
    validatorUrl: null,
  });
  window.ui = ui;
});
