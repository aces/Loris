import DataIntegrityFlag from './DataIntegrityFlag';

/**
 * Entry point of the module.
 * Renders data_integrity_flag on page load
 */
$(function() {
  const dataURL = loris.BaseURL + "/data_integrity_flag/?format=json";
  const dataIntegrity = (
    <div id="page-data-integrity">
      <DataIntegrityFlag
        Module="data_integrity_flag"
        DataURL={dataURL}
      />
    </div>
  );
  ReactDOM.render(dataIntegrity, document.getElementById("lorisworkspace"));
});
