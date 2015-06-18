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

    //Create an entry for an existing thread here.

    $('body').on('click', '[id^=submit_comment]', function(event){
	console.log("clicking on dynamically created event");
	event.stopPropagation();
	var feedbackID = this.id.slice(15);
	var comment = $("#thread_entry_comment_" + feedbackID).val();


        request= $.ajax({
	    type: "POST",
	    url: "ajax/thread_comment_bvl_feedback",
	    data: {"comment" : comment,
		 "feedbackID" : feedbackID},
	    success: function (data) {
		console.log("in the success function of adding a thread entry comment");
	    },//end of success function
        error: function (xhr, desc, err){
            console.log(xhr);
            console.log("Details: " + desc + "\nError:" + err);
        }
	});
        request.done(function (response, textStatus, jqXHR){
            console.log("Hooray it worked!, In the ajax of sending a comment on a thread entry");
        });//end of ajax
    });

    // Here I want to create a comment field. On click of commentglyphicon I want to add a comment field.
    $('span[name=comment_icon]').on('click',function(event){
 	event.stopPropagation();
	var feedbackID = this.id.slice(13);
	if($("#comment_field_" + feedbackID).length){
	    $("#comment_field_" + feedbackID).toggle();
	}

	else{
	console.log("comment icon has been clicked");
	var $tbody = $("#" + feedbackID);
	var commentField = '<td id = "comment_field_' + feedbackID + '"colspan = 3 class=form-group><input type="text" class="form-control" placeholder="Comment on this thread." id = "thread_entry_comment_' + feedbackID + '"><a class="btn btn-default" name ="submit_entry" id = "submit_comment_' + feedbackID + '">Submit</a></td>';

	//  Var commentField = '<div class="form-control input-group"><span class="input-group-btn"><button class="btn btn-default" type="button">Go!</button></span><input type="text" class="form-control" placeholder="Search for..."></div>';
	    $tbody.append(commentField);
	}
    });// end of comment_icon stuff

    //Thread entries toggling.
    $('tbody[name=entries]').on('click',function(){
	var feedbackID = this.id;

	//If we already have created a tbody with the entries for the given thread we simply toggle this thread on click.
	if ($("#feedbackEntries_" + feedbackID).length){
	    console.log("There is a feedback entries table body");
	    $("#feedbackEntries_" + feedbackID).toggle();
	}
	
	else{
	    request = $.ajax({
	    url: "ajax/get_thread_entry_data.php",
	    type: "post",
	    data: {"callFunc1" : feedbackID},
	    success: function (data) {

	    $("#" + feedbackID).after('<tbody id = "feedbackEntries_' + feedbackID + '"></tbody>');
		
		for (var i = 0; i < data.length; i++){
		    var tr = "<tr " + "id\"feedbackEntries_" + feedbackID + "_" + data[i]["EntryID"] + "\">";
		    var td1 = "<td>" + data[i]["UserID"] + "</td>";
                    var td2 = "<td>" + data[i]["Date"] + "</td>";
                    var td3 = "<td>" + data[i]["Comment"] + "</td></tr>";

		    $("#feedbackEntries_" + feedbackID).prepend(tr+td1+td2+td3);
		    
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
	}
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
                console.log("in the success function of adding new thread stuff");
                console.log("This is the data : " + data);

                //        successAlert = "<div class='alert alert-success'> You are in the success function of the </div>";
        //        $.("#new_feedback").append(successAlert);
        //    },
        //    error: function (xhr, desc, err) {
        //        console.log(xhr);
        //        console.log("Details: " + desc + "\nError:" + err);
            },
	    	error: function (xhr, desc, err){
		console.log(xhr);
		    console.log("Details: " + desc + "\nError:" + err);
		}
	    });//end of ajax

		request.done(function (response, textStatus, jqXHR){
		    console.log("It worked! In the ajax of adding a thread");

		    
		}); //end of on click
    })}); // end of document


