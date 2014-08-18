//Function that deals with custom file upload button: changes text and displays file name when chosen
var SITE = SITE || {};
SITE.fileInputs = function() {
  var $this = $(this),
      $val = $this.val(),
      valArray = $val.split('\\'),
      newVal = valArray[valArray.length-1],
      $button = $this.siblings('.button-file'),
      $fakeFile = $this.siblings('.file-holder');
  
  if (newVal !== '') {
    $button.text('File Chosen');
    if ($fakeFile.length === 0) {
	if (newVal.length >= 15)
		newVal = (newVal.substr(0,10)).concat("..."); 
	$('.fileName').text(newVal);
    } else {
	$fakeFile.text(newVal);
    }
  }
};


function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regexS = "[\\?&]" + name + "=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(window.location.search);
    if (results == null)
        return "";
    else
        return decodeURIComponent(results[1].replace(/\+/g, " "));
}

var filtered;

function editCategory() {

    $('.categorycomments').
            bind('blur',function(event){
                event.stopImmediatePropagation();
                id = event.target.id;
                value = $("#" + id) . text();
                id = id.replace("categorycomment", "");
                $.get("DocumentRepository/categoryEdit.php?id=" + id + "&comments=" + value, function(data) {});
            }
    ).keypress(function(e) {
        if(e.which === 13) { // Determine if the user pressed the enter button
            $(this).blur();
        }
    });
}

$(document).ready(function() {

   $(function() {
     $("div.accordion").accordion({
       autoHeight: false,
       collapsible: true,
      active: false,
     });
   });

   $(function() {
    editCategory();
   });

    //Hide error and success messages on load
    $('.upload-success').hide();
    $('.delete-success').hide();
    $('.add-success').hide();
    $('.edit-success').hide();
    $('.upload-error').hide();
    $('.file-error').hide();
    $('.no-files').hide();

    var uploadSuccess = getParameterByName('uploadSuccess');
    if (uploadSuccess) {
	    $('.upload-success').show();
	    setTimeout("$('.upload-success').hide();", 3000);
    }


    //Open confirmation dialog on Delete click
    var id;
    $('.sure').dialog({ autoOpen: false })
    $('.thedeletelink').click(function(){ 
        $('.sure').dialog('open'); 
        id = this.id;
    });

    //Delete dialog
    $(".sure").dialog({
        buttons : {
            "Cancel" : function() {
                 $(this).dialog("close");
            },
             "Yes" : function() {
                 $.ajax({
                    url: "DocumentRepository/documentDelete.php", 
                    type: "POST",
                    data: {id:id}, 
                    success: function(){
                        $("#"+id).parent().parent().remove();
			            $('.delete-success').show();
			            setTimeout("$('.delete-success').hide();", 3000);
                    },
                    error:function(jqXHR, textStatus, errorThrown){
                        console.log("Error: " + textStatus + " " +errorThrown);
                    }   
        	});
        
                $(this).dialog("close");
        	        return false;
        	}	 	
         }  
    });

    //Add category dialog
    $('.addCategory').dialog({ autoOpen: false });
    $('#addCategory').click(function(){
        $('.addCategory').dialog('open');
    });

    $(".addCategory").dialog({
	buttons : {
             "Cancel" : function() {
                 $(this).dialog("close");
             },
             "Add" : function() {
                 $.ajax({
                    url: "DocumentRepository/addCategory.php",
                    type: "POST",
                    data: $("#addCategoryForm").serialize(),
                    success: function(){
                                 $('.add-success').show();
                                 setTimeout("$('.add-success').hide();", 3000);
                                 setTimeout("location.reload();",3000);
                    },
                    error:function(jqXHR, textStatus, errorThrown){
                        console.log("Error: " + textStatus + " " +errorThrown);
                    }
                });

                $(this).dialog("close");
                        return false;
                }
         }
    });

    //Upload dialog
    //File input wrapper
    $('.file-wrapper input[type=file]').bind('change', SITE.fileInputs);

    $(".dialog-form").dialog({
        autoOpen: false,
        height: 500,
        width: 666,
        modal: true
     });

    $("#cancelButton").click(function() {
        $(".dialog-form").dialog("close");
    });

    $("#upload").click(function() {
        $(".dialog-form").dialog("open");
        return false;
    });


    //Edit dialog    
    $(".dialog-form-edit").dialog({
        autoOpen: false,
        height: 500,
        width: 666,
        modal: true,
        cache: false,
       // close: function() {
         //   allFields.val( "" ).removeClass( "ui-state-error" );
       // },
	    buttons:{
            "Cancel": function() { 
	        $(this).dialog("close");					
        },
	    "Edit": function() {
            var data = {
                idEdit:id,
                categoryEdit:$(categoryEdit).val(),
                siteEdit:$(siteEdit).val(),
                instrumentEdit:$(instrumentEdit).val(),
                pscidEdit:$(pscidEdit).val(),
                visitEdit:$(visitEdit).val(),
                commentsEdit:$(commentsEdit).val(),
                versionEdit:$(versionEdit).val(),
                action:$(actionEdit).val(),
                submit: 'yeah!!!!'
             };

             $.ajax({
                type: "POST",
                url: "DocumentRepository/documentEditUpload.php",
                data: data,
 	            success: function(){    
                    $('.edit-success').show();
                    setTimeout(function() { location.reload() }, 3000);
                }
             });

             $(".dialog-form-edit").dialog("close");
	    }	
	}
    });

    $("#cancelEditButton").click(function() {
        $(".dialog-form-edit").dialog("close");
    });
		
    //The Edit file function
    $(".theeditlink").click(function() {
        $(".dialog-form-edit").dialog("open");
        id = this.id;

	    $.ajax({
     	    type: "GET",
  	        url: "DocumentRepository/getFileData.php",
            data: {id:id}, 
            async: false,
                dataType: "json",
                success: function(data){

                   //Pre-populate the form with the existing values
                   SelectElement("categoryEdit", data.File_category);
                   SelectElement("siteEdit", data.For_site);
                   SelectElement("instrumentEdit", data.Instrument);
                   SelectElement("pscidEdit", data.PSCID);
                   SelectElement("visitEdit", data.visitLabel);
                   SelectElement("commentsEdit", data.comments);
                   SelectElement("versionEdit", data.version);

                }   
	});

        return false;
    });


    //Check form inputs before upload
    $("#uploadForm").submit(function() {
        var elements = $(this).get(0).elements;
        if(isEmpty($(elements).children("[name=category]"))) { return false; };
        if(isEmpty($(elements).children("[name=site]"))) { return false; } ;
        if(isFileEmpty($("[name=file]").get(0).files)) { return false; };
    //    if ($("[name=file]").get(0).files.size > 100000000) { return false; }; 
    });

    //Accordion effect
    //Hide category divs and table headers by default
    $(".accordionHeaders").hide();
    $(".categories").hide();

    function openSection(idx, el) {
        id = el.id;
        section = id.substring(7);
        section_el = $(".categories_" + section);

	    if (section_el.is(':visible')) {
            return true;
	    } else {
	        return false;
	    }
    }


    //If using the search filter, open divs with appropriate results
    if ($("#filterTable").attr('data-filter') == "true") {

        $(".categories").show();
        var count = 0;

	    $(".categories_header").each(function(idx, el) { 
	        isOpen = openSection(idx, el);
	        if (isOpen) {
                    $(".accordionHeaders").show();
                    $(this).addClass('selected');
                    count++;
	        }    
	    });

	    if (count<1) { 
                    $(".accordionHeaders").hide();
                    $('.no-files').show();
                    setTimeout("$('.no-files').hide();", 3000);
	    }
    }

    //If using table header filters, open divs with appropriate results
    if ($('#accordionTable').attr('data-open') == "true") {
        $(".accordionHeaders").show();
        $(".categories").show();
        $(".categories_header").each(function(idx, el) { 
            isOpen = openSection(idx, el);
            if (isOpen) {
                $(this).addClass('selected');
            }    
        });
    }


    function toggleGroup(group) {
        if (group) {

            // id is the header that was clicked
            id = group.target.id;

            // chop off header_ to get section name
            section = id.substring(7);

            // hide (or show) the appropriate div for that section
            section_el = $(".categories_" + section);
            section_el.toggle();
	
	        var count = 0;
	        if(section_el.is(':visible')) {
    	        $(".accordionHeaders").show();
	            $(this).addClass('selected');
	        } else {
	    	    $(this).removeClass('selected');

                        $(".categories_header").each(function(idx, el) {
                          isOpen = openSection(idx, el);
                          if (isOpen) {
		                count++;
                          }
                        });
		        if (count<1) {
                            $(".accordionHeaders").hide();
		        }
	        }		
	    }
    }
	

    // define event handler for all the header sections
    $(".categories_header").click(toggleGroup);

    // Get rid of the extra <br /> tag that Quickform element adds at the top of each <div>
    $(".categories_header").each(function(idx, el) {
        id = el.id;
        section = id.substring(7);
        section_el = $(".categories_" + section + " br:nth-child(1)").hide();
    });

    
});



//Checks that all fields required for file upload are entered 
function isEmpty(element) {
    if (element.val() === " ") {
	    element.focus();
	    element.addClass('missing');
	    $(".upload-error").show();
	    return true;
    } else {
	    return false;
    }
}

//Checks that file has been selected for upload
function isFileEmpty(element) {
    if (element.length == 0) {
	    $(".file-error").show();	
	    return true;
    } else {
	    return false;
    }
}

//Pre-populates the Edit form with fields already associated with that file
function SelectElement(element, valueToSelect) {
	$("#" + element + "").val(valueToSelect);
}
