function fetch_all (args) {
    const data = {
        "center_id":args.center_id
    };
    if (args.filter) {
        Object.assign(data, args.filter);
    }
    $.ajax({
        type: "GET",
        url : "/acknowledgements/ajax/fetch_all_of_center.php",
        data: data,
        dataType: "json",
        success: args.success,
        error: args.error
    });
}