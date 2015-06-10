/**
 * Created by evanmcilroy on 15-06-09.
 */
$(document).ready(function() {

    $("#bvl_feedback").on('click', function(){
        console.log(this.id);

        request = $.ajax({
            url: "ajax/bvl_feedback_panel.php",
            type: "post",
            success: function (data) {
                console.log("in the success function of request- ev");

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


