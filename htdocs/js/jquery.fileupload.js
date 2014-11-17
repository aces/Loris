(function ($) {
	var wrapper = function(element){
		$(element).wrap(inputGroup);
		$(element).before(fileNameDisplay);
		$(element).parent().find(".file-caption-name").attr('id', element.name);
		$(element).wrap(inputButtonGroup);
		$(element).wrap(inputButton);
		$(element).before(buttonText);
	}, 
	inputGroup = "<div class=\"input-group\"></div>",
	fileNameDisplay = 	"<div tabindex=\"-1\" class=\"form-control file-caption  kv-fileinput-caption\" title=\"\">\
							<span class=\"glyphicon glyphicon-file kv-caption-icon\" style=\"display: none;\"></span>\
							<div class=\"file-caption-name\"></div>\
						</div>",
	inputButtonGroup = 	"<div class=\"input-group-btn\"></div>",
	inputButton = "<div class=\"btn btn-primary btn-file\"></div>",
	buttonText = "<i class=\"glyphicon glyphicon-folder-open\"></i>&nbsp;Browse …";

	$.fn.FileUpload = function(){
		this.each(function(index, element){
			wrapper(element);
	        $(element).change(function(){
	        	var filename = $(this).val().split('\\').pop();
	        	var placeHolder = $(this).parent().parent().parent().find(".file-caption-name")
	            $(placeHolder).html(filename);
	        });
		});
		return this;
	}
}(jQuery));