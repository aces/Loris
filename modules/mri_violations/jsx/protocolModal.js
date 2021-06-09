import Modal from 'Modal';
import React, {useEffect, useState} from 'react';


/**
 * A Modal popup to display a MRI violations protocol violation
 * (ie the mri_protocol table check failed for a scan and the
 * scan type could not be identified.
 *
 * @param {object} props - React element props
 *
 * @return {ReactDOM}
 */
function ProtocolModal(props) {
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

    for (const violation of data) {
      violations.push(
        <div key={violation[4]}>
          <dl style={{display: 'flex', width: '100%',
                      justifyContent: 'space-around',
          }}>
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
              <dt>Minc Location</dt>
              <dd>{violation[4]}</dd>
            </div>
            <div>
              <dt>Patient Name</dt>
              <dd>{violation[5]}</dd>
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
                <th>zspace</th>
                <th>Xstep</th>
                <th>Ystep</th>
                <th>Zstep</th>
                <th>Time</th>
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
                <th>Center_name</th>
                <th>ScannerID</th>
                <th>Scan_type</th>
                <th>TR Range</th>
                <th>TE Range</th>
                <th>TI Range</th>
                <th>slice_thickness_max</th>
                <th>xspace range</th>
                <th>yspace range</th>
                <th>zspace range</th>
                <th>xstep range</th>
                <th>ystep range</th>
                <th>zstep range</th>
                <th>time range</th>
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
        console.log('change ', curgroupname, curgroup);
        curgroup = [];
      }
      curgroupname = protocol['Protocol Group'];
      if (protocol['series_description_regex']) {
          curgroup.push(<tr>
              <td>{protocol['Center_name']}</td>
              <td>{protocol['ScannerID']}</td>
              <td>{protocol['Scan_type']}</td>
              <td colspan="11">
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
          </tr>
          );
      }
    }
    console.log('done', curgroupname, curgroup);
    pushgroup(curgroupname, curgroup);

    return <Modal onClose={props.onClose}
    show={true}
    width="90%"
        title={'Violations for SeriesUID ' + props.SeriesUID}>
        <h2>Study Protocols</h2>
        {protocolgroups}
    <h2>Violations</h2>
    {violations}
    </Modal>;
}

export default ProtocolModal;
