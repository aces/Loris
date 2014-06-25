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
				$('.' + name ).removeProp('disabled')
			}
			else{
				$('.' + name ).prop('disabled', 'true');
			}
		}
		else{
			if( index == 0){
				$('[name=' + name + ']' ).removeProp('disabled')
			}
			else{
				$('[name=' + name + ']' ).prop('disabled', 'true');
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
			$('.' + name ).removeProp('disabled');
			$(this).parent().removeClass('has-warning');
			$("#" + name).remove();
		}
		else{
			$('.' + name ).prop('disabled', 'true');
			$(this).parent().addClass('has-warning');
			$(this).after("<div class=\"col-xs-12 warning\" id=\"" + name + "\">Any inputed data will not save</div>");
		}
	}
	else{
		if( index == 0){
			$('[name=' + name + ']' ).removeProp('disabled');
			$(this).parent().removeClass('has-warning');
			$("#" + name).remove();
		}
		else{
			$('[name=' + name + ']' ).prop('disabled', 'true');
			$(this).parent().addClass('has-warning');
			$(this).after("<div class=\"col-xs-12 warning\" id=\"" + name + "\">Any inputed data will not save</div>");
		}
	}
}