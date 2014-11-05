<script type="text/javascript" src="js/jquery/jquery.treegrid.js"></script>
<script type="text/javascript" src="js/jquery/jquery.treegrid.bootstrap3.js"></script>
<script type="text/javascript" src="js/bootstrap-multiselect.js"></script>

<link rel="stylesheet" href="css/jquery.treegrid.css">

<p>Please enter the various configuration variables into the fields below. For information on how to configure LORIS, please refer to the Help section and/or the Developer's guide.</p>
<br>

<div class="col-md-3">
<ul class="nav nav-pills nav-stacked" role="tablist" data-tabs="tabs">
    {foreach $parentMenuItems as $menuItem name=tabnav}
        {if $smarty.foreach.tabnav.first}
        <li class="active"><a href="#{$menuItem['Name']}" data-toggle="tab">{$menuItem['Label']}</a></li>
        {else}
        <li><a href="#{$menuItem['Name']}" data-toggle="tab">{$menuItem['Label']}</a></li>
        {/if}
    {/foreach}
</ul>
</div>


{function name=printLeaves}
{foreach from=$node['Value'] key=k item=v}
<div class="form-group">
    <label for="{$k}" class="col-sm-3 control-label config-name" data-toggle="tooltip" data-placement="right" title="{$node['Description']}">{$node['Label']}</label>
    <div class="col-sm-9">
        {if $node['DataType'] eq 'boolean'}
            <label class="radio-inline">
                {if $v eq "1" || $v eq "true"}
                <input type="radio" name="radio-{$v}-{$k}" value="1" checked>Yes
                {else}
                <input type="radio" name="radio-{$v}-{$k}" value="1">Yes
                {/if}
            </label>
            <label class="radio-inline">
                {if $v eq "0" || $v eq "false"}
                <input type="radio" name="radio-{$v}-{$k}" value="0" checked>No
                {else}
                <input type="radio" name="radio-{$v}-{$k}" value="0">No
                {/if}
            </label>
        {elseif $node['DataType'] eq 'instrument'}
            <select class="form-control">
                {foreach $instruments as $instrument}
                    <option>{$instrument}</option>
                {/foreach}
            </select>
        {elseif $node['DataType'] eq 'email'}
            <input class="form-control" type="email" name="{$k}" id="{$k}" value="{$v}">
        {else}
            <input type="text" class="form-control" name="{$k}" id="{$k}" value="{$v}">
        {/if}
    </div>
</div>
{/foreach}
{/function}

<div class="col-md-9">
    <div class="tab-content">
    {foreach $config as $topItem name=configContent}
        {if $smarty.foreach.configContent.first}
        <div class="tab-pane active" id="{$topItem['Name']}">

        {else}
        <div class="tab-pane" id="{$topItem['Name']}">

        {/if}
            <form class="form-horizontal" role="form">
            {foreach $topItem['Children'] as $configChild}
                {if isset($configChild[Children])}
                {call name=printLeaves node=$configChild}
                {else}
                {call name=printLeaves node=$configChild}
                {/if}
            {/foreach}
                <div class="form-group">
                    <div class="col-sm-offset-3 col-sm-9 submit-area">
                        <button type="submit" class="btn btn-primary">Submit</button>
                        <button type="reset" class="btn btn-default">Reset</button>
                    </div>
                </div>
            </form>
        </div>
    {/foreach}
    </div>
</div>

<!--
<table class="tree table table-hover">
    {foreach $config as $item}
        {if isset($item['Parent'])}
            <tr class="treegrid-{$item['ID']} treegrid-parent-{$item['Parent']}">
        {else}
            <tr class="treegrid-{$item['ID']}">
        {/if}
                <td>
                    <p class="tree-name" data-toggle="tooltip" data-placement="bottom" title="{$item['Description']}">{$item['Label']}</p>
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
                                                {if $v eq 1 || $v eq true}
                                                <input type="radio" name="radio-{$v}-{$k}" value="1" checked>Yes
                                                {else}
                                                <input type="radio" name="radio-{$v}-{$k}" value="1">Yes
                                                {/if}
                                            </label>
                                            <label class="radio-inline">
                                                {if $v eq 0 || $v eq false}
                                                <input type="radio" name="radio-{$v}-{$k}" value="0" checked>No
                                                {else}
                                                <input type="radio" name="radio-{$v}-{$k}" value="0">No
                                                {/if}
                                            </label>
                                        </form>
                                    {elseif $item['DataType'] eq 'email'}
                                        <form method="POST">
                                            <input class="form-control input-sm" type="email" name="{$k}" id="{$k}" value="{$v}">
                                        </form>
                                    {elseif $item['DataType'] eq 'instrument'}
                                        <form method="POST">
                                            <select multiple="multiple">
                                                {foreach $instruments as $instrument}
                                                    <option>{$instrument}</option>
                                                {/foreach}
                                            </select>
                                        </form>
                                        {break}
                                    {elseif $item['DataType'] eq 'textarea'}
                                        <form method="POST" id="textarea-{$k}">
                                            <textarea class="form-control" name="{$k}" id="{$k}" rows="3" form="textarea-{$k}">{$v}</textarea>
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
</table>
</div>