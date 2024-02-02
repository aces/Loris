import { ReactNode } from 'react';

interface ImagePanelQcDropdownProps {
  label: ReactNode;
  editable: boolean;
  options: {[keyid: string]: string};
  fileID: string;
  formName: string;
  defaultValue: string;
  url?: string;
}

/**
 * Image Quality Control Dropdown component
 */
function ImagePanelQcDropdown(props: ImagePanelQcDropdownProps) {
  const label = props.url
    ? <a href={props.url}>{props.label}</a>
    : props.label;

  let dropdown;
  if (props.editable) {
    const options = Object.keys(props.options).map((key) => (
      <option key={props.formName + props.fileID + key}
        className="form-control input-sm option"
        value={key}
      >
        {props.options[key]}
      </option>
    ));

    dropdown = (
      <select
        name={`${props.formName}[${props.fileID}]`}
        defaultValue={props.defaultValue}
        className="form-control input-sm"
      >
        {options}
      </select>
    );
  } else {
    dropdown = (
      <div className="col-xs-12">
        {props.options[props.defaultValue]}
      </div>
    );
  }

  return (
    <div className="row">
      <label>{label}</label>
      {dropdown}
    </div>
  );
}

interface ImagePanelQcStatusSelectorProps {
  fileNew: boolean;
  hasQcPerm: boolean;
  qcStatus: string;
  fileID: string;
}

/**
 * Image Panel Quality Control Status Selector Component
 */
function ImagePanelQcStatusSelector(props: ImagePanelQcStatusSelectorProps) {
  let qcStatusLabel;
  if (props.hasQcPerm && props.fileNew) {
    qcStatusLabel = (
      <span>
        QC Status <span className="text-info">
              ( <span className="glyphicon glyphicon-star">
            </span> New )
          </span>
      </span>
    );
  } else {
    qcStatusLabel = 'QC Status';
  }

  return (
    <ImagePanelQcDropdown
      label={qcStatusLabel}
      formName="status"
      fileID={props.fileID}
      editable={props.hasQcPerm}
      defaultValue={props.qcStatus}
      options={{'': '', 'Pass': 'Pass', 'Fail': 'Fail'}}
    />
  );
}

interface ImagePanelQcSelectedSelectorProps {
  fileID: string,
  hasQcPerm: boolean,
  selected: string,
}

/**
 * Image Panel Quality Control Selected Selector component
 */
function ImagePanelQcSelectedSelector(props: ImagePanelQcSelectedSelectorProps) {
  return (
    <ImagePanelQcDropdown
      label="Selected"
      formName="selectedvol"
      fileID={props.fileID}
      editable={props.hasQcPerm}
      options={{'': '', 'true': 'True', 'false': 'False'}}
      defaultValue={props.selected}
    />
  );
}

interface ImagePanelQcCaveatSelectorProps {
  fileID: string;
  hasQcPerm: boolean;
  seriesUID: string;
  caveat: string;
  editableCaveat: boolean;
  fullName: string;
}

/**
 * Image Panel Quality Control Caveat Selector component
 */
function ImagePanelQcCaveatSelector(props: ImagePanelQcCaveatSelectorProps) {
  // Link caveat to MRI Violations if set true (the hell does that mean ?)
  const mriViolationsLink = props.fullName && props.caveat === '1'
    ? `/mri_violations/?mincFile=${props.fullName}&seriesUID=${props.seriesUID}`
    : undefined;

  return (
    <ImagePanelQcDropdown
      label="Caveat"
      formName="caveat"
      fileID={props.fileID}
      editable={props.hasQcPerm && props.editableCaveat}
      options={
        {
          '': '',
          '1': 'True',
          '0': 'False',
        }
      }
      defaultValue={props.caveat}
      url={mriViolationsLink}
    />
  );
}

interface ImageQcStaticProps {
  label?: string;
  defaultValue: string;
}

/**
 * Image quality control static component
 */
function ImageQcStatic(props: ImageQcStaticProps) {
  const label = props.label
    ? <label>{props.label}</label>
    : null;

  return (
    <div className="row">
      {label}
      <div className="col-xs-12">
        {props.defaultValue}
      </div>
    </div>
  );
}

interface ImagePanelQcSnrValueProps {
  fileID: string;
  snr: string;
}

function ImagePanelQcSnrValue(props: ImagePanelQcSnrValueProps) {
  return (
    <ImageQcStatic
      label={props.snr ? 'SNR' : undefined}
      defaultValue={props.snr}
    />
  );
}

interface ImagePanelQcProps {
  fileID: string,
  hasQcPerm: boolean,
  qcStatus: string,
  fileNew: boolean,
  selected: string,
  caveat: string,
  seriesUID: string,
  snr: string,
  editableCaveat: boolean,
  fullName: string,
}

/**
 * Image Panel Quality Control component
 */
function ImagePanelQc(props: ImagePanelQcProps) {
  return (
    <div className="form-group">
      <ImagePanelQcStatusSelector
        fileID={props.fileID}
        hasQcPerm={props.hasQcPerm}
        qcStatus={props.qcStatus}
        fileNew={props.fileNew}
      />
      <ImagePanelQcSelectedSelector
        fileID={props.fileID}
        hasQcPerm={props.hasQcPerm}
        selected={props.selected}
      />
      <ImagePanelQcCaveatSelector
        fileID={props.fileID}
        hasQcPerm={props.hasQcPerm}
        caveat={props.caveat}
        seriesUID={props.seriesUID}
        editableCaveat={props.editableCaveat}
        fullName={props.fullName}
      />
      <ImagePanelQcSnrValue
        fileID={props.fileID}
        snr={props.snr}
      />
    </div>
  );
}

export default ImagePanelQc;
