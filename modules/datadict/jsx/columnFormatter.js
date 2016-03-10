function formatDataDictColumn(column, cell, rowData) {
    if(column ==='Description') {
        var updateDict = function(name) {
            return function(e) {
                e.stopPropagation();

                var value = e.target.valueOf().innerText;
                $.post(loris.BaseURL + "/datadict/ajax/UpdateDataDict.php", { fieldname: name,  description: value }, function(data) {
                });
            }
        }
        return <td contentEditable="true" className="description" onBlur={updateDict(rowData[1])}>{cell}</td>;
    }
    return <td>{cell}</td>;
}
