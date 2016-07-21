function formatColumn(column, cell, rowData) {
    if (column === 'Username') {
        var url = loris.BaseURL + "/user_accounts/edit_user/?identifier=" + row.Username;
        return React.createElement(
            "td",
            null,
            React.createElement(
                "a",
                { href: url },
                cell
            )
        );
    }

    return React.createElement(
        "td",
        null,
        cell
    );
}
