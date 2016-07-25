function formatColumn(column, cell, rowData) {
    if(column === 'Username') {
        var url = loris.BaseURL + "/user_accounts/edit_user/?identifier=" + rowData.Username;
        return <td><a href={url}>{cell}</a></td>;
    }
    return <td>{cell}</td>;
}
