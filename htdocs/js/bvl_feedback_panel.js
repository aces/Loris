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


    //var $comment = $('#comment').html($('input:textbox').val());

    $('#save_data').on('click',function(){
        var $candID = $("#candID").attr('name');

        request = $.ajax({
            url: "ajax/new_bvl_feedback.php",
            type: "POST",
            data: {"candID": $candID},
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


