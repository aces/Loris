/**
 * Created by evanmcilroy on 15-06-09.
 */
$(document).ready(function() {

    $(".navbar-toggle").on('click', function(){
        console.log(this.id);

        request = $.ajax({
            url: "ajax/bvl_feedback_panel.php",
            type: "get",
	    data: 
            success: function (data) {
                console.log("In the succession function of the ajax reqest for bvl_feedback_panel");
		console.log(data);

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
    });


});


