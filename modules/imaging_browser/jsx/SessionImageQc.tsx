import {ReactNode} from 'react';

interface ImageQcDropdownProps {
  fileID: number;
  label: ReactNode;
  editable: boolean;
  options: {[keyid: string]: string};
  formName: string;
  defaultValue: string;
  url?: string;
}

function ImageQcDropdown(props: ImageQcDropdownProps) {
  const label = props.url
    ? <a href={props.url}>{props.label}</a>
    : props.label;

  let dropdown;
  if (props.editable) {
    dropdown = (
      <select
        name={`${props.formName}[${props.fileID}]`}
        defaultValue={props.defaultValue}
        className="form-control input-sm"
      >
        {Object.keys(props.options).map((key) => (
          <option key={props.formName + props.fileID + key}
            className="form-control input-sm option"
            value={key}
          >
            {props.options[key]}
          </option>
        ))}
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

interface ImageQcStatusSelectorProps {
  fileID: number;
  fileNew: boolean;
  hasQcPerm: boolean;
  qcStatus: string | null;
}

function ImageQcStatusSelector(props: ImageQcStatusSelectorProps) {
  let qcStatusLabel;
  if (props.hasQcPerm && props.fileNew) {
    qcStatusLabel = (
      <span>
        QC Status
        <span className="text-info">(<span className="glyphicon glyphicon-star" /> New)</span>
      </span>
    );
  } else {
    qcStatusLabel = 'QC Status';
  }

  return (
    <ImageQcDropdown
      label={qcStatusLabel}
      formName="status"
      fileID={props.fileID}
      editable={props.hasQcPerm}
      defaultValue={props.qcStatus ?? ''}
      options={{'': '', 'Pass': 'Pass', 'Fail': 'Fail'}}
    />
  );
}

interface ImageQcSelectedSelectorProps {
  fileID: number,
  hasQcPerm: boolean,
  selected: boolean | null,
}

function ImageQcSelectedSelector(props: ImageQcSelectedSelectorProps) {
  return (
    <ImageQcDropdown
      label="Selected"
      formName="selectedvol"
      fileID={props.fileID}
      editable={props.hasQcPerm}
      options={{'': '', '1': 'True', '0': 'False'}}
      defaultValue={props.selected !== null ? (props.selected ? '1' : '0') : ''}
    />
  );
}

interface ImageQcCaveatSelectorProps {
  fileID: number;
  hasQcPerm: boolean;
  seriesUID: string;
  caveat: boolean;
  editableCaveat: boolean;
  fullName: string;
}

function ImageQcCaveatSelector(props: ImageQcCaveatSelectorProps) {
  const mriViolationsLink = props.fullName && props.caveat
    ? `/mri_violations/?mincFile=${props.fullName}&seriesUID=${props.seriesUID}`
    : undefined;

  return (
    <ImageQcDropdown
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
      defaultValue={props.caveat ? '1' : '0'}
      url={mriViolationsLink}
    />
  );
}

interface ImageQcStaticProps {
  label: string;
  defaultValue: string;
}

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

interface ImageQcSnrValueProps {
  fileID: number;
  snr: string | null;
}

function ImageQcSnrValue(props: ImageQcSnrValueProps) {
  return (
    <ImageQcStatic
      label={props.snr ? 'SNR' : ''}
      defaultValue={props.snr ?? ''}
    />
  );
}

interface ImageQcProps {
  fileID: number,
  hasQcPerm: boolean,
  qcStatus: string | null,
  fileNew: boolean,
  selected: boolean | null,
  caveat: boolean,
  seriesUID: string,
  snr: string | null,
  editableCaveat: boolean,
  fullName: string,
}

function ImageQc(props: ImageQcProps) {
  return (
    <div className="form-group">
      <ImageQcStatusSelector
        fileID={props.fileID}
        hasQcPerm={props.hasQcPerm}
        qcStatus={props.qcStatus}
        fileNew={props.fileNew}
      />
      <ImageQcSelectedSelector
        fileID={props.fileID}
        hasQcPerm={props.hasQcPerm}
        selected={props.selected}
      />
      <ImageQcCaveatSelector
        fileID={props.fileID}
        hasQcPerm={props.hasQcPerm}
        caveat={props.caveat}
        seriesUID={props.seriesUID}
        editableCaveat={props.editableCaveat}
        fullName={props.fullName}
      />
      <ImageQcSnrValue
        fileID={props.fileID}
        snr={props.snr}
      />
    </div>
  );
}

export default ImageQc;
