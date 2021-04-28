import {SwaggerUIBundle, SwaggerUIStandalonePreset} from 'swagger-ui-dist';
import 'swagger-ui-dist/swagger-ui.css';

window.addEventListener('load', () => {
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
