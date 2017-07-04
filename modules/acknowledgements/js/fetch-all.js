function fetchAll(args) {
    const data = {
        centerId: args.centerId
    };
    if (args.filter) {
        Object.assign(data, args.filter);
    }
    $.ajax(
        {
            type: "GET",
            url: "/acknowledgements/ajax/fetch_all_of_center.php",
            data: data,
            dataType: "json",
            success: args.success,
            error: args.error
        }
    );
}

window.fetchAll = fetchAll;
