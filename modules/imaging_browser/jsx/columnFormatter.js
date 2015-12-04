function formatColumn(column, cell, rowData) {
    if(column === 'New Data') {
        if(cell === 'new') {
            return <td>NEW</td>
        }
        return <td></td>;
    }
    if(column === 'Links') {
        return <td>Hiyoooo</td>;
    }
    return <td>{cell}</td>;
}
