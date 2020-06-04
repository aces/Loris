<select name='{$name}'>
	<option value=""></option>
	{for $index = $minYear to $maxYear}
		{if $index eq $value}
			<option value="{$index}" selected="selected">{$index}</option>
		{else}
			<option value="{$index}">{$index}</option>
		{/if}
	{/for}
</select>
