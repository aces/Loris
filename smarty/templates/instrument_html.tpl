<form {$form.attributes}>
	{$form.hidden}
	{foreach from=$form.sections item=section}
		<h3>{$section.header}</h3>
		{foreach from=$section.elements item=element}
			{if $element.error}
	    	<div class="row form-group form-inline form-inline has-error">
	        {else}
	        <div class="row form-group form-inline form-inline">
	        {/if}
				<lable class="lab col-sm-4">
					{if $element.required}
						<span style="color: #ff0000">*</span>
					{/if}
					{$element.label}  
				</lable>
				<div class="col-sm-8">
					{if $element.type eq "group"}
						{foreach key=gkey item=gitem from=$element.elements}
							{$gitem.html}
						{/foreach}
					{else}
						{$element.html}
					{/if}
				</div>
				{if $element.error}
					<div class="col-sm-offset-4 col-xs-12">
	                    <font class="form-error">{$element.error}</font>
	                </div>
				{/if}
			</div>
		{/foreach}
	{/foreach}
</form>