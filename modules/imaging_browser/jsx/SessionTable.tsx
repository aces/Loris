import { useEffect, useState } from 'react';

interface Subject {
  mriqcstatus: any;
  mriqcpending: any;
  pscid: any;
  candid: any;
  visitLabel: any;
  site: any;
  dob: any;
  sex: any;
  scanner: any;
  CohortTitle: any;
  edc: any;
  useEDC: boolean;
  outputType: any;
}

interface TableProps {
  subject: Subject;
}

function Table(props: TableProps) {
  return (
    <div style={{overflowX: 'scroll'}}>
      <table className="table table-hover table-bordered dynamictable" id='table-header-left'>
        <thead>
          <tr className="info">
            <th>QC Status</th>
            <th>Patient Name</th>
            <th>PSCID</th>
            <th>DCCID</th>
            <th>Visit Label</th>
            <th>Site</th>
            <th>QC Pending</th>
            <th>DOB</th>
            <th>Sex</th>
            <th>Output Type</th>
            <th>Scanner</th>
            <th>Cohort</th>
            {props.subject.useEDC ? <th>EDC</th> : null}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{props.subject.mriqcstatus}</td>
            <td>{props.subject.pscid}_{props.subject.candid}_{props.subject.visitLabel}</td>
            <td>{props.subject.pscid}</td>
            <td>{props.subject.candid}</td>
            <td>{props.subject.visitLabel}</td>
            <td>{props.subject.site}</td>
            <td>
              {props.subject.mriqcpending === 'Y'
              ? <img src={window.location.origin + "/images/check_blue.gif"} width={12} height={12} />
              : null}
            </td>
            <td>{props.subject.dob}</td>
            <td>{props.subject.sex}</td>
            <td>{props.subject.outputType}</td>
            <td>{props.subject.scanner}</td>
            <td>{props.subject.CohortTitle}</td>
            {props.subject.useEDC ? <td>{props.subject.edc}</td> : null}
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function TableWrapper() {
  const [subject, setSubject] = useState<Subject | null>(null);
  const sessionID = new URLSearchParams(window.location.search).get('sessionID');

  useEffect(() => {
    fetch(`${window.location.origin}/imaging_browser/getsubjectdata?sessionID=${sessionID}`,
      {credentials: 'same-origin'})
      .then((response) => response.json())
      .then((subject) => setSubject(subject))
  }, []);

  return subject ? <Table subject={subject} /> : null;
}

export default TableWrapper;
