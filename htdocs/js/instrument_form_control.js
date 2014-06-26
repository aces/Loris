$( document ).ready(function() {
	$(".element").children().addClass("form-control input-sm");
	$(".button").removeClass("form-control");
	var naList = document.getElementsByClassName('not-answered');
	for(var i=0;i<naList.length;i++)
	{
		var name = $(naList[i]).attr('name');
		name = name.replace('_status', '');
		var index = naList[i].selectedIndex;
		if(name.indexOf('_date') > -1){
			if( index == 0){
				$('.' + name ).prop('disabled', false);
			}
			else{
				$('.' + name ).prop('disabled', true);
			}
		}
		else{
			if( index == 0){
				$('[name=' + name + ']' ).prop('disabled', false);
			}
			else{
				$('[name=' + name + ']' ).prop('disabled', true);
			}
		}
	    naList[i].onchange = notAnswered;
	}
});
function notAnswered(){
	var name = $(this).attr('name');
	name = name.replace('_status', '');
	var index = this.selectedIndex;
	if(name.indexOf('_date') > -1){
		if( index == 0){
			$('.' + name ).prop('disabled', false);
			$(this).parent().removeClass('has-warning');
			$("#" + name).remove();
		}
		else{
			$('.' + name ).propprop('disabled', true);
			$(this).parent().addClass('has-warning');
			$(this).after("<div class=\"col-xs-12 warning\" id=\"" + name + "\">Any inputed data will not save</div>");
		}
	}
	else{
		if( index == 0){
			$('[name=' + name + ']' ).prop('disabled', false);
			$(this).parent().removeClass('has-warning');
			$("#" + name).remove();
		}
		else{
			$('[name=' + name + ']' ).prop('disabled', true);
			console.log($('[name=' + name + ']' ));
			$(this).parent().addClass('has-warning');
			$(this).after("<div class=\"col-xs-12 warning\" id=\"" + name + "\">Any inputed data will not save</div>");
		}
	}
}