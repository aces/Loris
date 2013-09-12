/*
$(document).ready(function() { 
//

    setInterval(function() 
        {
    $.get("<?php echo $url; ?>?progress_key=<?php echo $_GET['up_id']; ?>&randval="+ Math.random(), { 
        //get request to the current URL (upload_frame.php) which calls the code at the top of the page.  It checks the file's progress based on the file id "progress_key=" and returns the value with the function below:
    },
        function(data)  //return information back from jQuery's get request
            {
                $('#progress_container').fadeIn(100);   //fade in progress bar  
                $('#progress_bar').width(data +"%");    //set width of progress bar based on the $status value (set at the top of this page)
                $('#progress_completed').html(parseInt(data) +"%"); //display the % completed within the progress bar
            }
        )},500);    //Interval is set at 500 milliseconds (the progress bar will refresh every .5 seconds)

});

<!--display bar only if file is chosen-->

$(document).ready(function() { 
//

//show the progress bar only if a file field was clicked
	var show_bar = 0;
    $('input[type="file"]').click(function(){
		show_bar = 1;
    });

//show iframe on form submit
    $("#form1").submit(function(){

		if (show_bar === 1) { 
			$('#upload_frame').show();
			function set () {
				$('#upload_frame').attr('src','upload_frame.php?up_id=<?php echo $up_id; ?>');
			}
			setTimeout(set);
		}
    });
//

});

*/

  $(function() {
    /*$( "#progress_container" ).progressbar({
      value: 37
    });
    */
    
    
  });
  

  avail_elem = 0;
function progress_bar() {
    //progress_status = $('#progressbar').progressbar('value');
    //progress_status_avail = ['twentyfive-percent', 'fifty-percent', 'seventyfive-percent', 'onehundred-percent'];
    if (progress_status != '100') {
    	$('#progress_bar').css('width', progress_status + "%");
        
    	/*$.ajax({
            url: 'test.php?' + avail_elem,
            success: function(msg) {
                eval(msg);
                avail_elem++;
                progress_bar();
                }
            });
        }
        */
    }

    
    
  
  
