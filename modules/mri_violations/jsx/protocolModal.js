import Modal from 'Modal';
import StaticDataTable from 'StaticDataTable';

import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {withTranslation} from 'react-i18next';

/**
 * A Modal popup to display a protocol violation of any
 * type.
 *
 * @param {object} props - React element props
 * @return {JSX}
 */
function ProtocolModal(props) {
  const {t} = props;
  switch (props.Type) {
  case 'protocolviolation':
    return <ProtocolViolationModal {...props} t={t} />;
  case 'protocolcheck':
    return <ProtocolCheckViolationModal {...props} t={t} />;
  default: return null;
  }
}
ProtocolModal.propTypes = {
  Type: PropTypes.string,
  t: PropTypes.func,
};

/**
 * Return a modal window to display a MRI violations protocol
 * violation.
 *
 * (ie the mri_protocol table check failed for a scan and the
 * scan type could not be identified.)
 *
 * @param {object} props - React element props
 * @return {JSX}
 */
function ProtocolViolationModal(props) {
  const [data, setData] = useState([]);
  const [protocols, setMRIProtocols] = useState([]);
  const {t} = props;

  useEffect(() => {
    fetch(props.URL + '?format=json' +
                  '&violationtype=protocolviolation' +
                  '&seriesUID=' + props.SeriesUID)
      .then((res) => res.json())
      .then(
        (result) => {
          setData(result.Data);
          setMRIProtocols(result.fieldOptions.protocols);
        },
        (error) => {
          console.error(error);
        }
      );
  }, [props.SeriesUID]);

  let violations = [];

  let title = t('Violations for SeriesUID', {ns: 'mri_violations'}) +
  ' ' + props.SeriesUID;
  for (const violation of data) {
    title = t('Violations for', {ns: 'mri_violations'}) + ' ' + violation[4];
    violations.push(
      <div key={violation[4]}>
        <dl className="violation-description-list">
          <div>
            <dt>{t('DCCID', {ns: 'loris'})}</dt>
            <dd>{violation[0]}</dd>
          </div>
          <div>
            <dt>{t('PSCID', {ns: 'loris'})}</dt>
            <dd>{violation[1]}</dd>
          </div>
          <div>
            <dt>{t('Time Run', {ns: 'mri_violations'})}</dt>
            <dd>{violation[2]}</dd>
          </div>
          <div>
            <dt>{t('Series Description', {ns: 'mri_violations'})}</dt>
            <dd>{violation[3]}</dd>
          </div>
          <div>
            <dt>{t('Image Location', {ns: 'mri_violations'})}</dt>
            <dd>{violation[4]}</dd>
          </div>
          <div>
            <dt>{t('Patient Name', {ns: 'mri_violations'})}</dt>
            <dd>{violation[5]}</dd>
          </div>
          <div>
            <dt>{t('Series UID', {ns: 'mri_violations'})}</dt>
            <dd>{props.SeriesUID}</dd>
          </div>
          <div>
            <dt>{t('Echo Time', {ns: 'mri_violations'})}</dt>
            <dd>{violation[8]}</dd>
          </div>
        </dl>

        <table className="table table-hover table-primary table-bordered">
          <thead>
            <tr>
              <th>{t('Protocol Group', {ns: 'mri_violations'})}</th>
              <th>{t('TR', {ns: 'mri_violations'})}</th>
              <th>{t('TE', {ns: 'mri_violations'})}</th>
              <th>{t('TI', {ns: 'mri_violations'})}</th>
              <th>{t('Slice Thickness', {ns: 'mri_violations'})}</th>
              <th>{t('Xspace', {ns: 'mri_violations'})}</th>
              <th>{t('Yspace', {ns: 'mri_violations'})}</th>
              <th>{t('Zspace', {ns: 'mri_violations'})}</th>
              <th>{t('Xstep', {ns: 'mri_violations'})}</th>
              <th>{t('Ystep', {ns: 'mri_violations'})}</th>
              <th>{t('Zstep', {ns: 'mri_violations'})}</th>
              <th>{t('Time', {ns: 'mri_violations'})}</th>
              <th>{t('Image Type', {ns: 'mri_violations'})}</th>
              <th>{t('Phase Encoding Direction', {ns: 'mri_violations'})}</th>
              <th>{t('Echo Number', {ns: 'mri_violations'})}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{violation[6]}</td>
              <td>{violation[7]}</td>
              <td>{violation[8]}</td>
              <td>{violation[9]}</td>
              <td>{violation[10]}</td>
              <td>{violation[11]}</td>
              <td>{violation[12]}</td>
              <td>{violation[13]}</td>
              <td>{violation[14]}</td>
              <td>{violation[15]}</td>
              <td>{violation[16]}</td>
              <td>{violation[17]}</td>
              <td>{violation[20]}</td>
              <td>{violation[21]}</td>
              <td>{violation[22]}</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  let protocolgroups = [];
  let curgroupname = '';
  let curgroup = [];
  const showRange = (min, max) => {
    if (!min && !max) {
      return ' ';
    }
    if (min === max) {
      return min;
    }
    if (min && !max) {
      return '>=' + min;
    }
    if (!min && max) {
      return '<= ' + max;
    }
    return min + ' - ' + max;
  };

  const pushgroup = (name, tablerows) => {
    protocolgroups.push(<div>
      <h3>{name}</h3>
      <table className="table table-hover table-primary table-bordered">
        <thead>
          <tr>
            <th>{t('Center Name', {ns: 'mri_violations'})}</th>
            <th>{t('Scanner ID', {ns: 'mri_violations'})}</th>
            <th>{t('Scan Type', {ns: 'mri_violations'})}</th>
            <th>{t('TR Range', {ns: 'mri_violations'})}</th>
            <th>{t('TE Range', {ns: 'mri_violations'})}</th>
            <th>{t('TI Range', {ns: 'mri_violations'})}</th>
            <th>{t('Slice Thickness Range', {ns: 'mri_violations'})}</th>
            <th>{t('Xspace Range', {ns: 'mri_violations'})}</th>
            <th>{t('Yspace Range', {ns: 'mri_violations'})}</th>
            <th>{t('Zspace Range', {ns: 'mri_violations'})}</th>
            <th>{t('Xstep Range', {ns: 'mri_violations'})}</th>
            <th>{t('Ystep Range', {ns: 'mri_violations'})}</th>
            <th>{t('Zstep Range', {ns: 'mri_violations'})}</th>
            <th>{t('Time Range', {ns: 'mri_violations'})}</th>
            <th>{t('Image Type', {ns: 'mri_violations'})}</th>
            <th>{t('Phase Encoding Direction', {ns: 'mri_violations'})}</th>
            <th>{t('Echo Number', {ns: 'mri_violations'})}</th>
          </tr>
        </thead>
        <tbody>
          {tablerows}
        </tbody>
      </table>
    </div>);
  };

  for (const protocol of protocols) {
    if (protocol['Protocol Group'] != curgroupname && curgroupname != '') {
      pushgroup(curgroupname, curgroup);
      curgroup = [];
    }
    curgroupname = protocol['Protocol Group'];
    if (protocol['series_description_regex']) {
      curgroup.push(<tr>
        <td>{protocol['Center_name']}</td>
        <td>{protocol['ScannerID']}</td>
        <td>{protocol['ScanType']}</td>
        <td colSpan="11">
          {t('Series Description Regex:', {ns: 'mri_violations'})}
          <span style={{fontWeight: 'bold'}}>
            {protocol['series_description_regex']}
          </span>
        </td>
      </tr>
      );
    } else {
      curgroup.push(<tr>
        <td>{protocol['Center_name']}</td>
        <td>{protocol['ScannerID']}</td>
        <td>{protocol['ScanType']}</td>
        <td>{showRange(protocol['TR_min'], protocol['TR_max'])}</td>
        <td>{showRange(protocol['TE_min'], protocol['TE_max'])}</td>
        <td>{showRange(protocol['TI_min'], protocol['TI_max'])}</td>
        <td>{showRange(
          protocol['slice_thickness_min'],
          protocol['slice_thickness_max'],
        )}
        </td>
        <td>{showRange(protocol['xspace_min'], protocol['xspace_max'])}</td>
        <td>{showRange(protocol['yspace_min'], protocol['yspace_max'])}</td>
        <td>{showRange(protocol['zspace_min'], protocol['zspace_max'])}</td>
        <td>{showRange(protocol['xstep_min'], protocol['xstep_max'])}</td>
        <td>{showRange(protocol['ystep_min'], protocol['ystep_max'])}</td>
        <td>{showRange(protocol['zstep_min'], protocol['zstep_max'])}</td>
        <td>{showRange(protocol['time_min'], protocol['time_max'])}</td>
        <td>{protocol['image_type']}</td>
        <td>{protocol['PhaseEncodingDirection']}</td>
        <td>{protocol['EchoNumber']}</td>
      </tr>
      );
    }
  }
  pushgroup(curgroupname, curgroup);

  return <Modal onClose={props.onClose}
    show={true}
    width="90%"
    title={title}>
    <h2>{t('Image Protocol', {ns: 'mri_violations'})}</h2>
    {violations}
    <h2>{t('Study Protocols', {ns: 'mri_violations'})}</h2>
    {protocolgroups}
  </Modal>;
}
ProtocolViolationModal.propTypes = {
  URL: PropTypes.string,
  SeriesUID: PropTypes.string,
  onClose: PropTypes.func,
  t: PropTypes.func,
};

/**
 * Return a modal window to display a MRI violations protocol
 * check violation.
 *
 * (ie the protocol type was identified, but it violates the
 * protocol study's constraints.)
 *
 * @param {object} props - React element props
 * @return {JSX}
 */
function ProtocolCheckViolationModal(props) {
  const [data, setData] = useState([]);
  const {t} = props;
  useEffect(() => {
    fetch(props.URL + '?format=json' +
                  '&violationtype=protocolcheck' +
                  '&seriesUID=' + props.SeriesUID)
      .then((res) => res.json())
      .then(
        (result) => {
          setData(result.Data);
        },
        (error) => {
          console.error(error);
        }
      );
  }, [props.SeriesUID]);

  return <Modal onClose={props.onClose}
    show={true}
    width="90%"
    title={t('Violations for SeriesUID', {ns: 'mri_violations'})
    + ' ' + props.SeriesUID}>
    <h2>{t('Scan Problems', {ns: 'mri_violations'})}</h2>
    <StaticDataTable Headers={[
      t('Patient Name', {ns: 'mri_violations'}),
      t('CandID', {ns: 'loris'}),
      t('Visit', {ns: 'loris'}),
      t('Scan Type', {ns: 'mri_violations'}),
      t('Protocol Group', {ns: 'mri_violations'}),
      t('Severity', {ns: 'mri_violations'}),
      t('Header', {ns: 'mri_violations'}),
      t('Value', {ns: 'mri_violations'}),
      t('Valid Values', {ns: 'mri_violations'}),
    ]}
    Hide={{rowsPerPage: true, defaultColumn: true}}
    NoDynamicTable={true}
    Data={data} />
  </Modal>;
}
ProtocolCheckViolationModal.propTypes = {
  URL: PropTypes.string,
  SeriesUID: PropTypes.string,
  onClose: PropTypes.func,
  t: PropTypes.func,
};

export default withTranslation(['mri_violations', 'loris'])(ProtocolModal);
