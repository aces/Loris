$(document).ready(function () {

    var $threadListData = $("[id ^= 'thread_list_data']");

    $threadListData.click().hide();

    //On click of this function we check if a div containing the entries for this FeedbackID exist.
    //If not we fetch the data through an ajax request and display it.
    //If the the class exists we simply toggle it.
    $('tr[name=entries]').on('click', function () {
        var feedbackID = this.id;

        if ($('tr[id^="feedbackEntries_' + feedbackID + '"]').length){

            $('tbody[id^="tablebody_' + feedbackID + '"]').toggle();

        }

        //Beggining of our AJAX request fetching the entries for the requested feedbackID.
        else {
            request = $.ajax({
                url: "ajax/get_thread_entry_data.php",
                type: "post",
                data: {"callFunc1": feedbackID},
                success: function (data) {
                    console.log("in the success function of request- ev");
                    console.log("This is the data : " + data);

                    var feedbackEntries = "<tr id=\"feedbackEntries" + feedbackID + "\">";

                    //looping through json data to return the entries on the feedback thread
                    for (var i = 0; i < data.length; i++) {
                        var tr = "<tr " + "id=\"feedbackEntries_" + feedbackID + "_" + data[i]["EntryID"] + "\">";
                        var td1 = "<td>" + data[i]["UserID"] + "</td>";
                        var td2 = "<td>" + data[i]["Date"] + "</td>";
                        var td3 = "<td>" + data[i]["Comment"] + "</td></tr>";

                        $("#tablebody_" + feedbackID).prepend(tr+td1+td2+td3);

                        //So the toggle works initially.
                        $('tbody[id^="tablebody_' + feedbackID + '"]').toggle();

                    }
                },
                error: function (xhr, desc, err) {
                    console.log(xhr);
                    console.log("Details: " + desc + "\nError:" + err);
                }
            });

            // Callback handler that will be called on success
            request.done(function (response, textStatus, jqXHR) {
                // Log a message to the console
                console.log("Hooray, it worked!. Evan is USING AJAX SUCCESSFULLY, can you believe it!");
            });
        } //end of AJAX request


    });


    console.log("testing");
    var thread_list_data = $("[id ^= 'thread_list_data']").html();



});



