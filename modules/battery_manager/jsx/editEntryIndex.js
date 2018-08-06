/* global ReactDOM */
/**
 * Battery Manager Edit Form
 *
 * Module component rendering Edit form
 *
 * @author Victoria Foing
 *
 */
import BatteryManagerEditForm from './editEntry';
const args = QueryString.get(document.currentScript.src);
$(function() {
  const batteryManagerEditForm = (
    <div className="page-edit-entry">
      <div className="row">
        <div className="col-md-9 col-lg-7">
          <BatteryManagerEditForm
            DataURL={`${loris.BaseURL}/battery_manager/ajax/get_form_data.php?action=getFormData&ID=${args.id}`}
            checkForDuplicate={`${loris.BaseURL}/battery_manager/ajax/add_entry.php?action=checkForDuplicate`}
            activate={`${loris.BaseURL}/battery_manager/ajax/update_entry.php?action=activate`}
            deactivate={`${loris.BaseURL}/battery_manager/ajax/update_entry.php?action=deactivate`}
            edit={`${loris.BaseURL}/battery_manager/ajax/add_entry.php?action=edit`}
          />
        </div>
      </div>
    </div>
  );

  ReactDOM.render(batteryManagerEditForm, document.getElementById("lorisworkspace"));
});
