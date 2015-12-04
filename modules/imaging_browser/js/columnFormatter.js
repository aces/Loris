function formatColumn(column, cell, rowData) {
    if (column === 'New Data') {
        if (cell === 'new') {
            return React.createElement(
                'td',
                null,
                'NEW'
            );
        }
        return React.createElement('td', null);
    }
    if (column === 'Links') {
        return React.createElement(
            'td',
            null,
            'Hiyoooo'
        );
    }
    return React.createElement(
        'td',
        null,
        cell
    );
}