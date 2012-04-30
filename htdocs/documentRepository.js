var SITE = SITE || {};
SITE.fileInputs = function() {
  var $this = $(this),
      $val = $this.val(),
      valArray = $val.split('\\'),
      newVal = valArray[valArray.length-1],
      $button = $this.siblings('.button-file'),
      $fakeFile = $this.siblings('.file-holder');
  if(newVal !== '') {
    $button.text('File Chosen');
    if($fakeFile.length === 0) {
      $button.after('' + newVal + '');
    } else {
      $fakeFile.text(newVal);
    }
  }
};

$(document).ready(function() {


$('.delete-success').hide();
$('.edit-success').hide();
$('.upload-error').hide();
$('.file-error').hide();

//For the Delete dialog
var id;
$('.sure').dialog({ autoOpen: false })
$('.thedeletelink').click(function(){ 
        $('.sure').dialog('open'); 
        id = this.id;
                        });
  $(".sure").dialog({
      buttons : {
        "Cancel" : function() {
          $(this).dialog("close");
        },
        "Yes" : function() {
   //   $.get("documentDelete.php?", {record_id: id});
//      $.get("documentDelete.php?id=" + id);
        $.ajax({
                url: "documentDelete.php", 
                type: "POST",
                data: {id:id}, 
                success: function(){
                        $("#"+id).parent().parent().remove();
			$('.delete-success').show();
			setTimeout( "$('.delete-success').hide();", 5000 );
                },
                error:function(jqXHR, textStatus, errorThrown){
                        console.log("Error: " + textStatus + " " +errorThrown);
                }
                
        });
        
        $(this).dialog("close");
        //location.reload(true);
        return false;
 //     window.location.href = "main.php?test_name=document_repository";
//$(this).parent().get(0).submit()
        }
      }
    });

$(function() {
//$( "#dialog:ui-dialog" ).dialog( "destroy" );
var name = $( "#name" ),
                        category = $( "#category" ),
                        site = $( "#site" ),
                        pscid = $( "#pscid" ),
                        visit = $( "#visit" ),
                        comments = $( "#comments" ),
                        file = $( "#file" ),
                        version = $( "#version" ),
                        allFields = $( [] ).add( category ).add( site ).add( name ).add( pscid ).add( visit ).add( comments ).add ( file ).add( version ), 
                        tips = $( ".validateTips" );

/*
                function updateTips( t ) {
                        tips
                                .text( t )
                                .addClass( "ui-state-highlight" );
                        setTimeout(function() {
                                tips.removeClass( "ui-state-highlight", 1500 );
                        }, 500 );
                }

                function checkLength( o, n, min, max ) {
                        if ( o.val().length > max || o.val().length < min ) {
                                o.addClass( "ui-state-error" );
                                updateTips( "Length of " + n + " must be between " +
                                        min + " and " + max + "." );
                                return false;
                        } else {
                                return true;
                        }
                }

                function checkRegexp( o, regexp, n ) {
                        if ( !( regexp.test( o.val() ) ) ) {
                                o.addClass( "ui-state-error" );
                                updateTips( n );
                                return false;
                        } else {
                                return true;
                        }
                }
*/
  $('.file-wrapper input[type=file]')
  .bind('change focus click', SITE.fileInputs);

                $( ".dialog-form" ).dialog({
                        autoOpen: false,
                        height: 500,
                        width: 400,
                        modal: true,//,
        //                buttons: {
            //                  "Upload": function() {
                        //              var bValid = true;
                        //              allFields.removeClass( "ui-state-error" );
                        //              bValid = bValid && checkLength( name, "username", 3, 16 );
                                //      bValid = bValid && checkLength( email, "email", 6, 80 );
                                //      bValid = bValid && checkLength( password, "password", 5, 16 );
                        //              bValid = bValid && checkRegexp( name, /^[a-z]([0-9a-z_])+$/i, "Username may consist of a-z, 0-9, underscores, begin with a letter." );
                                        // From jquery.validate.js (by joern), contributed by Scott Gonzalez: http://projects.scottsplayground.com/email_address_validation/
                                //      bValid = bValid && checkRegexp( email, /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i, "eg. ui@jquery.com" );
                                //      bValid = bValid && checkRegexp( password, /^([0-9a-zA-Z])+$/, "Password field only allow : a-z 0-9" );

                        //              if ( bValid ) {
                /*                              $( "#users tbody" ).append( "<tr>" +
                                                        "<td>" + category.val() + "</td>" + 
                                                        "<td>" + site.val() + "</td>" + 
                                                "</tr>" ); 
                                                //var 'bin/doLogin.php'

                                              $.get("documentUpload.php", {categoryP:category.val(), versionP:version.val(), submit:'yeahhh'}); // siteP:site, pscidP:pscid, visitP:visit, commentsP:comments,  version:version});
                                              return false;

                                        },
                                "Cancel": function() {
                                        $( this ).dialog( "close" );
                                }
                        },
*/
                        close: function() {
                                allFields.val( "" ).removeClass( "ui-state-error" );
                        }
//              });

        });
                $("#cancelButton").click(function() {
                                $( ".dialog-form"  ).dialog( "close" );
                });

             //   location.reload(true);
            //  return false;
           //  });
                               
//                      $.get("documentUpload.php", {categoryP:category.val()}); // siteP:site, pscidP:pscid, visitP:visit, commentsP:comments, /*file:file,*/ version:version});
//              });
//                              $( ".dialog-form" ).dialog( "close" );
//                                              location.reload(true);
//              });

/*		$("#uploadForm").submit(function() {
                        alert("IT WORKS!");
			return false;
		}*/
                $( "#upload" )
                        .click(function() {
                                $( ".dialog-form" ).dialog( "open" );
                                return false;
                        });

/*
                $("#cancelButton").click(function() {
                                $( ".dialog-form"  ).dialog( "close" );
                }

                $("#uploadButton").click(function() {
                                $( ".dialog-form" ).dialog( "close" );
                }*/

      $( ".dialog-form-edit" ).dialog({
                        autoOpen: false,
                        height: 300,
                        width: 400,
                        modal: true,
			cache: false,
                        close: function() {
                                allFields.val( "" ).removeClass( "ui-state-error" );
                        },
			buttons:{
                              "Cancel": function() { 
				$(this).dialog("close");					
				},
				"Edit": function() {
    var data = {
                  idEdit:id,
                  categoryEdit:$(categoryEdit).val(),
                  siteEdit:$(siteEdit).val(),
                  instrumentEdit:$(nameEdit).val(),
                  pscidEdit:$(pscidEdit).val(),
                  visitEdit:$(visitEdit).val(),
                  commentsEdit:$(commentsEdit).val(),
                  versionEdit:$(versionEdit).val(),
                  action:$(actionEdit).val(),
                  submit: 'yeah!!!!'
                };

                  $.ajax({
                        type: "POST",
                        url: "documentUpload.php",
                        data: data,
 			success: function(){    
                        	location.reload(true);      
                        	$('.edit-success').show();
                        	setTimeout( "$('.edit-success').hide();", 5000 );
                    	}
                        });
                $( ".dialog-form-edit" ).dialog( "close" );

				}	
		}

        });
                $("#cancelEditButton").click(function() {
                                $( ".dialog-form-edit"  ).dialog( "close" );
                });

//document.getElementById("categoryEdit").selectedIndex="paper";//setAttribute('value', "paper");
            /*    $("#editForm").submit(function() {
                  var data = {
		  idEdit:id,
                  categoryEdit:$(categoryEdit).val(),
                  siteEdit:$(siteEdit).val(), 
                  instrumentEdit:$(nameEdit).val(),
                  pscidEdit:$(pscidEdit).val(),
		  visitEdit:$(visitEdit).val(),
                  commentsEdit:$(commentsEdit).val(),
                  versionEdit:$(versionEdit).val(),
		  action:$(actionEdit).val(),
		  submit: 'yeah!!!!'
                };
		
                  $.ajax({
                        type: "POST",
                        url: "documentUpload.php",
                        data: data 
                        });
                $( ".dialog-form-edit" ).dialog( "close" );
             //   location.reload(true);
            //    return false;
                });*/
        });

                $( ".theeditlink" )
                        .click(function() {
                                $( ".dialog-form-edit" ).dialog( "open" );
        			id = this.id;
   				var myClass = $(this).attr("data-id");
   			//	alert($(".$(this).attr('data-id')").text());
                                return false;
                        });

        });


function isEmpty(element) {
  if (element.val() === "") {
	element.focus();
	element.addClass('missing');
	$(".upload-error").show();
	return true;
	}

else
	return false;
}

function isFileEmpty(element) {
   if (element.length == 0) {
	$(".file-error").show();	
	return true;
	}
	
else
	return false;
}

function SelectElement(element, valueToSelect)
{    
//    var element = document.getElementById('categoryEdit');
    $("#" + element + "").val(valueToSelect);
}


$(document).ready(function() {

$("#uploadForm").submit(function() {
  var elements = $(this).get(0).elements;
  if(isEmpty($(elements).children("[name=category]"))) { return false; };
  if(isEmpty($(elements).children("[name=site]"))) { return false; } ;
 // if($("[name=file]").get(0).files.length == 0) { $(".upload-error").show(); return false; } ;
  if(isFileEmpty($("[name=file]").get(0).files)) { return false; };
});


SelectElement("categoryEdit", "paper");
SelectElement("commentsEdit", "test");
SelectElement("versionEdit", "1.0");
//			$("#categoryEdit").val("paper");
//  document.getElementById("category").setAttribute('value', "paper");
//document.getElementById("categoryEdit").selectedIndex="paper";//setAttribute('value', "paper");



    $(".categories").hide();
    function toggleGroup(group) {
        if(group) {

            // id is the header that was clicked
            id = group.target.id;

            // chop off header_ to get section name
            section = id.substring(7);
            
            // hide (or show) the appropriate div for that section
            section_el = $(".categories_" + section);
            section_el.toggle();
            if ($(this).hasClass('selected'))
	    	$(this).removeClass('selected');
	    else
	   	 $(this).addClass('selected');
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


