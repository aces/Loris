class Table extends React.Component {
    constructor (props) {
        super(props);
        this.tbody = <TBody center_id={props["center_id"]}/>
    }
    render () {
        return (
            <table id="acknowledgement-table" className="table table-hover table-primary table-bordered table-unresolved-conflicts dynamictable" border="0">
                <thead>
                    <tr className="info">
                        <th>Full Name</th>
                        <th>Citation Name</th>
                        <th>Affiliations</th>
                        <th>Degrees</th>
                        <th>Roles</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                        <th>In Study?</th>
                        <th>Edit</th>
                        <th>Delete</th>
                    </tr>
                </thead>
                {this.tbody}
            </table>
        );
    }
}

window.Table = Table;