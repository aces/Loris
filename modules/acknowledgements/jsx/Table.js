import TBody from "./TBody";

export default class Table extends React.Component {
  constructor(props) {
    super(props);
    this.tbody = <TBody centerId ={props.centerId}/>;
  }
  render() {
    return (
            <table id ="acknowledgement-table" className="table table-hover table-primary table-bordered table-unresolved-conflicts dynamictable" style={ {border: 0} }>
                <thead>
                    <tr className ="info">
                        <th>Full Name</th>
                        <th>Citation Name</th>
                        <th>Affiliations</th>
                        <th>Degrees</th>
                        <th>Roles</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                        <th>Present?</th>
                        <th>Edit</th>
                        <th>Delete</th>
                    </tr>
                </thead>
                {this.tbody}
            </table>
        );
  }
}
