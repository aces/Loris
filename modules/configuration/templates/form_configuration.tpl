<script type="text/javascript" src="js/jquery/jquery.treegrid.js"></script>
<script type="text/javascript" src="js/jquery/jquery.treegrid.bootstrap3.js"></script>

<link rel="stylesheet" href="css/jquery.treegrid.css">

<p>Please enter the various configuration variables into the fields below. For information on how to configure LORIS, please refer to the Help section and/or the Developer's guide.</p>

{function name=printConfig}
    {foreach $items as $item}
        {if isset($item['Parent'])}
            <tr class="treegrid-{$item['ID']} treegrid-parent-{$item['Parent']}">
        {else}
            <tr class="treegrid-{$item['ID']}">
        {/if}
                <td>
                    {$item['Description']}
                </td>
                <td>
                    {if $item['DataType'] neq ""}
                        <div class="form-section" id="{$item['ID']}-formsection">
                            {if $item['AllowMultiple'] == 1 && $item['DataType'] neq 'instrument'}
                                <form method="POST">
                                    <button class="btn btn-default btn-sm add" id="{$item['ID']}" type="button" name="add-{$item['ID']}">
                                        <span class="glyphicon glyphicon-plus"></span> Add field
                                    </button>
                                </form>
                            {/if}
                            {if isset($item['Value'])}
                                {foreach from=$item['Value'] key=k item=v}
                                    {if $item['DataType'] eq 'boolean'}
                                        <form method="POST">
                                            <label class="radio-inline">
                                                <input type="radio" name="radio-{$k}" value="1">Yes
                                            </label>
                                            <label class="radio-inline">
                                                <input type="radio" name="radio-{$k}" value="0" checked>No
                                            </label>
                                        </form>
                                    {elseif $item['DataType'] eq 'email'}
                                        <form method="POST">
                                            <input class="form-control input-sm" type="email" name="{$k}" id="{$k}" value="{$v}">
                                        </form>
                                    {elseif $item['DataType'] eq 'instrument'}
                                        <form method="POST">
                                            <select multiple class="form-control">
                                                {foreach $instruments as $instrument}
                                                    <option>{$instrument}</option>
                                                {/foreach}
                                            </select>
                                        </form>
                                        {break}
                                    {elseif $item['DataType'] eq 'textarea'}
                                        <form method="POST">
                                            <textarea class="form-control" name="{$k}" id="{$k}" rows="3">{$v}</textarea>
                                        </form>
                                    {else}
                                        <div class="form-item">
                                            <form method="POST">
                                                <input class="form-control input-sm" name="{$k}" type="text" id="{$k}" value="{$v}">
                                            </form>
                                        {if $item['AllowMultiple'] == 1}
                                            <form method="POST">
                                                <button class="btn btn-default btn-small rm-btn" id="{$k}" type="submit" name="remove-{$k}">Remove</button>
                                            </form>
                                        {/if}
                                        </div>
                                    {/if}
                                {/foreach}
                            {else}
                                {if $item['AllowMultiple'] == 0}
                                    <div class="form-item">
                                        <form method="POST">
                                            <input class="form-control input-sm" name="add-{$item['ID']}" type="text">
                                        </form>
                                    </div>
                                {/if}
                            {/if}
                        </div>
                    {/if}
                </td>
            </tr>
    {/foreach}
{/function}

<table class="tree table table-hover">
    {call name=printConfig items=$config}
</table>