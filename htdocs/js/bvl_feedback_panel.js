/**
 * Created by evanmcilroy on 15-06-09.
 */
$(document).ready(function() {

    $(function() {
        $( "#accordion" ).accordion({
            collapsible: true,
            autoHeight: false,
            heightStyle: "content"
        });
    });

    $(".navbar-toggle").on('click', function(){
        console.log(this.id);

    });

    $('tr[name=entries]').on('click',function(){
	var feedbackID = this.id;

	if ($('tr[id^="feedbackEntries' + feedbackID + '"]').length){

	}
	
	request = $.ajax({
	    url: "ajax/get_thread_entry_data.php",
	    type: "post",
	    data: {"callFunc1" : feedbackID},
	    success: function (data) {

		$("#" + feedbackID).after('<div id = "feedbackEntriesDiv_' + feedbackID + '"></div>');
		
		for (var i = 0; i < data.length; i++){
		    var tr = "<tr " + "id\"feedbackEntries_" + feedbackID + "_" + data[i]["EntryID"] + "\">";
		    var td1 = "<td>" + data[i]["UserID"] + "</td>";
                    var td2 = "<td>" + data[i]["Date"] + "</td>";
                    var td3 = "<td>" + data[i]["Comment"] + "</td></tr>";

		    $("#feedbackEntriesDiv_" + feedbackID).prepend(tr+td1+td2+td3);
		    
		}
		
	    },
	    error: function (xhr, desc, err){
		console.log(xhr);
		console.log("Details: " + desc + "\nError:" + err);
	    }
	});
	request.done(function (response, textStatus, jqXHR){
	    console.log("Hooray it worked!, In the ajax of pressing a thread");
	});
    });

    
    $('#save_data').on('click',function(){
        var $candID = $("#candID").attr('name');
        var $comment = $('#comment').val();

        request = $.ajax({
            url: "ajax/new_bvl_feedback.php",
            type: "POST",
            data: {"candID": $candID,
                    "comment" : $comment},
            success: function (data) {
                console.log("in the success function");
                console.log("This is the data : " + data);

                //        successAlert = "<div class='alert alert-success'> You are in the success function of the </div>";
        //        $.("#new_feedback").append(successAlert);
        //    },
        //    error: function (xhr, desc, err) {
        //        console.log(xhr);
        //        console.log("Details: " + desc + "\nError:" + err);
            }
        });

    });

});


