<form method="post" name="test_form" id="test_form">
	<table id={$form.tableID} class="instrument">
		{foreach from=$form.elements item=element}
			{if $element.type eq header}
				<tr><th colspan="2">{$element.html}</th></tr>
			{elseif $element.type eq hidden}
				{$element.html}
			{elseif $element.name eq lorisSubHeader}
				<tr>
                    <td colspan="2">{$element.label}</td>
                </tr>
			{elseif $element.type eq static AND $element.error}
				<tr>
					<td class="lab">
					</td>
					<td class="ele">
						{$element.error}
					</td>
				</tr>
			{else}
				<tr>
					<td class="lab">
						{if $element.required}
							<span style="color: #ff0000">*</span>
						{/if} {$element.label}
					</td>
					<td class="ele">
						{if $element.error}
							<span style="color: #ff0000">{$element.error}</span>
							<br />
						{/if}
						{$element.html}
					</td>
				</tr>
			{/if}
		{/foreach}
	</table>
</form>