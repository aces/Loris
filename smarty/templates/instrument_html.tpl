{literal}
<script type="text/javascript">
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
</script>
{/literal}
<form {$form.attributes}>
	{$form.hidden}
	{$form.errors.mainError}
	{foreach from=$form.sections item=section}
		<h5>{$section.header}</h5>
		{foreach from=$section.elements item=element}
			{if $element.name neq mainError}
				{if $element.error}
		    	<div class="row form-group form-inline form-inline has-error">
		        {else}
		        <div class="row form-group form-inline form-inline">
		        {/if}
					<lable class="lab col-sm-4 col-xs-12">
						{if $element.required}
							<span style="color: #ff0000">*</span>
						{/if}
						{$element.label}  
					</lable>
					<div class="col-sm-8">
						<div class="col-xs-12 element">
							{if $element.type eq "group"}
								{foreach key=gkey item=gitem from=$element.elements}
									{$gitem.html}
								{/foreach}
							{else}
								{$element.html}
							{/if}
						</div>
						{if $element.error}
							<div class="col-xs-12">
			                    <font class="form-error">{$element.error}</font>
			                </div>
						{/if}
					</div>
				</div>
			{/if}
		{/foreach}
	{/foreach}
</form>