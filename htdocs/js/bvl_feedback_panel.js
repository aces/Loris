
/**
 * Created by evanmcilroy on 15-06-09.
 */
$(document).ready(function() {

    var candID = $('meta[itemprop="candID"]').attr("context");
    var sessionID = $('meta[itemprop="sessionID"]').attr("context");
    var commentID = $('meta[itemprop="commentID"]').attr("context");

    $('#feedback_toggle').on('click',function(event){
        console.log("navbar toggle clicked");
        $("#bvl_feedback_menu").toggleClass("active_panel");
        $("#bvl_panel_wrapper").toggleClass("bvl_panel");

	//We check if a sidebar exists on the page and toggle it if such.
	if ($("#page_wrapper_sidebar").length){
	    $("#sidebar-wrapper").toggle("#sidebar-wrapper hide_sidebar");
	    $("#page_wrapper_sidebar").toggleClass("wrapper");
	}

    });

    //Setting tooltips.
    $('body').tooltip({
	selector: '[rel=tooltip]'
    });

    //On hover of the "action bar" we display the glyphicons for edit and see more comments.
    $('body').on("mouseenter mouseleave", '[name=action_bar]', function(event){ 
    	var bvl_table_icons = $(this).find(".bvl_table_icons");
	
	if (event.type === 'mouseenter'){
	    bvl_table_icons.css("visibility", "visible");
	}
	
	if (event.type === 'mouseleave'){
	    bvl_table_icons.css("visibility", "hidden");
	}
    });

    //close a thread here
    $('body').on('click', '[id^=close_thread]', function(event) {
	event.stopPropagation();
        var feedbackID = this.id.slice(13);
        //getting the button group for this id
        var buttonGroup = $("#" + feedbackID).find(".btn-group");
        var closedButton = '<button name = "thread_button" type="button" class="btn btn-danger dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"> Closed <span class="caret"></span></button><ul class="dropdown-menu"><li><a id="open_thread_' + feedbackID + '">Re-Open</a></li></ul>';

        request= $.ajax({
            type: "POST",
            url: "ajax/close_bvl_feedback_thread.php",
            data: {"feedbackID": feedbackID,
                   "candID" :  candID,
		   "sessionID" : sessionID},
            success: function (data){
                console.log("In the success function of the closing thread");
                buttonGroup.replaceWith(closedButton);

            },//end of success function
            error: function (xhr, desc, err){
                console.log(xhr);
                console.log("Details: " + desc + "\nError:" + err);
            }
        });//end of ajax
        request.done(function(respoinse,textStatus,jqXHR){
            console.log("Request to close thread done");
        });

    });//end of closing a thread

    //re-open a thread here
    $('body').on('click', '[id^=open_thread]', function(event){
	event.stopPropagation();
	var feedbackID = this.id.slice(12);

	var buttonGroup = $("#" + feedbackID).find(".btn-group");
        var openedButton = '<button name = "thread_button" type="button" class="btn btn-success dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"> Opened <span class="caret"></span></button><ul class="dropdown-menu"><li><a id="close_thread_' + feedbackID + '">Close</a></li></ul>';

	request = $.ajax({
	    type: "POST",
	    url: "ajax/open_bvl_feedback_thread.php",
	    data: {"feedbackID": feedbackID,
		   "candID": candID},
	    success: function (data){
		console.log("successfully reopened a thread");
		buttonGroup.replaceWith(openedButton);
	    },
	    error: function (xhr, desc, err){
                console.log(xhr);
                console.log("Details: " + desc + "\nError:" + err);
            }
	    
	});  //end of ajax
	
    });//end of re-opening a thread

    //on click of submit comment
    $('body').on('click', '[id^=submit_comment]', function(event){
        console.log("clicking on dynamically created event");
        event.stopPropagation();
        var feedbackID = this.id.slice(15);
        var comment = $("#thread_entry_comment_" + feedbackID).val();


        request= $.ajax({
            type: "POST",
            url: "ajax/thread_comment_bvl_feedback.php",
            data: {"comment" : comment,
                   "feedbackID" : feedbackID,
		   "candID" : candID},
            success: function (response) {
                console.log("in the success function of adding a thread entry comment");
		var tr = '<tr class = "feedback_entries" " + "id="feedbackEntries_' + response["FeedbackID"] + '">';
                var td1 = '<td>' + response["UserID"] + '</td>';
                var td2 = '<td colspan="2">'+ response["Comment"] + '</td></tr>';

		$("#feedbackEntries_" + feedbackID).prepend(tr + td1 + td2);
		
            },//end of success function
            error: function (xhr, desc, err){
                console.log(xhr);
                console.log("Details: " + desc + "\nError:" + err);
            }
        });
        request.done(function (response, textStatus, jqXHR){
            console.log("Hooray it worked!, In the ajax of sending a comment on a thread entry");
            $("#thread_entry_comment_" + feedbackID).val("Comment successful!");	
        });//end of ajax
    });

    // Here I want to create a comment field. On click of commentglyphicon I want to add a comment field.
    $('body').on('click','span[name=comment_icon]',function(event){
        event.stopPropagation();
        var feedbackID = this.id.slice(13);
        if($("#comment_field_" + feedbackID).length){
            $("#comment_field_" + feedbackID).toggle();
        }

        else{
            console.log("comment icon has been clicked");
            var $tbody = $("#" + feedbackID);
            var commentField = '<td id = "comment_field_' + feedbackID + '"colspan = 3 class=form-inline><input type="text" class="form-control" placeholder="Comment on this thread." id = "thread_entry_comment_' + feedbackID + '"><a class="btn btn-default" name ="submit_entry" id = "submit_comment_' + feedbackID + '">Submit</a></td>';
            $tbody.append(commentField);
        }
    });// end of comment_icon stuff

    //Thread entries toggling.
    $('body').on('click','span[id^=toggle_entries]',function(e){
        console.log("toggling entries");
        var feedbackID = this.id.slice(15);
	$(this).toggleClass(".glyphicon-chevron-right glyphicon-chevron-down");

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
                        var tr = "<tr class = \"feedback_entries\" " + "id=\"feedbackEntries_" + feedbackID + "_" + data[i]["EntryID"] + "\">";
                        var td1 = "<td>" + data[i]["UserID"] + "</td>";
                        var td2 = "<td colspan=\"2\">" + data[i]["Comment"] + "</td></tr>";

                        $("#feedbackEntries_" + feedbackID).prepend(tr+td1+td2);

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
	var $input_type = $('select[name="input_type"]').val();
	var $fieldname = $('select[name="fieldname"]').val();

        request = $.ajax({
            url: "ajax/new_bvl_feedback.php",
            type: "POST",
            data: {"candID": candID,
		   "sessionID": sessionID,
		   "commentID": commentID,
                   "comment" : $comment,
		   "input_type" : $input_type,
		   "field_name" : $fieldname},
            //dataType: "html",
            success: function (response) {
                console.log("in the success function of adding new thread stuff");

                console.log(response["feedbackID"]);

                var tbody = '<tbody id="' + response["feedbackID"] + '" name="entries">';
		var td1 = '<tr><td>'+ response["date"] + '</td>';
		var td2 = '<td>' + response["user"] + '</td>';
		if (response["fieldname"] != ''){
		    var td3 = '<td>' + response["fieldname"] + '</td>';
		}
		var td4 = '<td name = "action_bar">'
		    + '<div class = "btn-group"><button name ="thread_button" type="button" class="btn btn-success dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">'
		    + 'Opened <span class="caret"></span></button>'
		    + '<ul class="dropdown-menu"><li><a id="close_thread_' + response["feedbackID"] + '">Close</a></li></ul></div>';
		var bvl_table_icons = '<div class = "bvl_table_icons" name="bvl_table_icons">'
                    + '<span class="glyphicon glyphicon-chevron-right" id="toggle_entries_' + response["feedbackID"] + '"></span>'
		    + '<span id="comment_icon_' + response["feedbackID"]  + '" class="glyphicon glyphicon-pencil" name="comment_icon"></span>'
		    + '<span class="glyphicon glyphicon-info-sign" data-toggle="tooltip" data-placement="top" title="FeedbackID: '
		    + response["feedbackID"] + ' Type: ' + response["type"]  + '"></span>';

                var close = '</td></tr></tbody>';

                $("#current_thread_table_header").after($(tbody + td1 + td2 + td3 + td4 + bvl_table_icons + close).fadeIn('slow'));
		$('#comment').val('New thread successfully added!');
		$('#toggle_entries_' + response["feedbackID"]).click();

            },
            error: function (xhr, desc, err){
                console.log(xhr);
                console.log("Details: " + desc + "\nError:" + err);
            }
        });//end of ajax

        request.done(function (response, textStatus, jqXHR){
            console.log("It worked! In the ajax of adding a thread");
	    

        }); //end of on click
    });
}); // end of document


