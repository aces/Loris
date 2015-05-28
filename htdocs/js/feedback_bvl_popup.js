    //
    //
    //var foo = document.getElementById('feedback');
    //
    //var bar = document.getElementsByName('entries');
    //
    //var kle = document.getElementById('70');
    //
    //kle.addEventListener('click',function(){
    //    this.innerHTML = "insert into element 70";
    //
    //});
    //
    //print(bar);
    //
    //foo.addEventListener('click', function () {
    //    this.innerHTML = "new inner html";
    //});

    $(document).ready(function () {

        var $threadListData = $("[id ^= 'thread_list_data']");

        $threadListData.click().hide();


        $('tr').on('click', function () {
            $(this).append("current id " + this.id);
        });

        console.log("testing");
        var thread_list_data = $("[id ^= 'thread_list_data']").html();


        request = $.ajax({
            url: "ajax/get_thread_entry_data.php",
            type: "post",
            data: { "callFunc1": "6" },
            success: function(data) {
                console.log("in the success function of request- ev");
                console.log("This is the data : " + data);

            },
            error: function(xhr, desc, err) {
                console.log(xhr);
                console.log("Details: " + desc + "\nError:" + err);
            }
        });

        // Callback handler that will be called on success
        request.done(function (response, textStatus, jqXHR){
            // Log a message to the console
            console.log("Hooray, it worked!. Evan is USING AJAX SUCCESSFULLY, can you believe it!");
        });


    });



