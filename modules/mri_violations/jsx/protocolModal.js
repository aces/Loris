import Modal from 'Modal';
import StaticDataTable from 'StaticDataTable';

import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';


/**
 * A Modal popup to display a protocol violation of any
 * type.
 *
 * @param {object} props - React element props
 * @return {JSX}
 */
function ProtocolModal(props) {
    switch (props.Type) {
        case 'protocolviolation':
          return <ProtocolViolationModal {...props} />;
        case 'protocolcheck':
          return <ProtocolCheckViolationModal {...props} />;
        default: return null;
    }
}
ProtocolModal.propTypes = {
    Type: PropTypes.string,
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

    let title = 'Violations for SeriesUID ' + props.SeriesUID;
    for (const violation of data) {
      title = 'Violations for ' + violation[4];
      violations.push(
        <div key={violation[4]}>
          <dl className="violation-description-list">
            <div>
              <dt>CandID</dt>
              <dd>{violation[0]}</dd>
            </div>
            <div>
              <dt>PSCID</dt>
              <dd>{violation[1]}</dd>
            </div>
            <div>
              <dt>Time Run</dt>
              <dd>{violation[2]}</dd>
            </div>
            <div>
              <dt>Series Description</dt>
              <dd>{violation[3]}</dd>
            </div>
            <div>
              <dt>Image Location</dt>
              <dd>{violation[4]}</dd>
            </div>
            <div>
              <dt>Patient Name</dt>
              <dd>{violation[5]}</dd>
            </div>
            <div>
              <dt>Series UID</dt>
              <dd>{props.SeriesUID}</dd>
            </div>
            <div>
              <dt>Echo Time</dt>
              <dd>{violation[8]}</dd>
            </div>
          </dl>

          <table className="table table-hover table-primary table-bordered">
            <thead>
              <tr>
                <th>Protocol Group</th>
                <th>TR</th>
                <th>TE</th>
                <th>TI</th>
                <th>Slice Thickness</th>
                <th>Xspace</th>
                <th>Yspace</th>
                <th>Zspace</th>
                <th>Xstep</th>
                <th>Ystep</th>
                <th>Zstep</th>
                <th>Time</th>
                <th>Image Type</th>
                <th>Phase Encoding Direction</th>
                <th>Echo Number</th>
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
        </div>);
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
                <th>Center Name</th>
                <th>Scanner ID</th>
                <th>Scan Type</th>
                <th>TR Range</th>
                <th>TE Range</th>
                <th>TI Range</th>
                <th>Slice Thickness Range</th>
                <th>Xspace Range</th>
                <th>Yspace Range</th>
                <th>Zspace Range</th>
                <th>Xstep Range</th>
                <th>Ystep Range</th>
                <th>Zstep Range</th>
                <th>Time Range</th>
                <th>Image Type</th>
                <th>Phase Encoding Direction</th>
                <th>Echo Number</th>
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
              <td>{protocol['Scan_type']}</td>
              <td colSpan="11">
                Series Description Regex:
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
            <td>{protocol['Scan_type']}</td>
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
              <h2>Image Protocol</h2>
              {violations}
              <h2>Study Protocols</h2>
              {protocolgroups}
           </Modal>;
}
ProtocolViolationModal.propTypes = {
    URL: PropTypes.string,
    SeriesUID: PropTypes.string,
    onClose: PropTypes.func,
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
             title={'Violations for SeriesUID ' + props.SeriesUID}>
              <h2>Scan Problems</h2>
              <StaticDataTable Headers={
                ['Patient Name', 'CandID', 'Visit', 'Scan Type',
                 'Protocol Group', 'Severity', 'Header', 'Value',
                 'Valid Values'] }
                Hide={{rowsPerPage: true, defaultColumn: true}}
                NoDynamicTable={true}
                Data={data} />
           </Modal>;
}
ProtocolCheckViolationModal.propTypes = {
    URL: PropTypes.string,
    SeriesUID: PropTypes.string,
    onClose: PropTypes.func,
};
export default ProtocolModal;
