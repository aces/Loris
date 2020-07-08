{function name=createRadio}
  {*Use variable to make sure 1/0 values dont get converted to true/false accidentally, code sections expecting 1/0 or true/false can break otherwise*}
  {$useZerosAndOnes=false}
  {if $v eq "1" || $v eq "0"}
    {$useZerosAndOnes=true}
  {/if}
    <label class="radio-inline">
        <input type="radio" name="{$k}" {if $useZerosAndOnes} value="1"{else}value="true"{/if} {if $v eq "1" || $v eq "true"}checked{/if} {if $d eq "Yes"}disabled{/if}>Yes
    </label>
    <label class="radio-inline">
        <input type="radio" name="{$k}" {if $useZerosAndOnes} value="0"{else}value="false"{/if} {if $v eq "0" || $v eq "false"}checked{/if} {if $d eq "Yes"}disabled{/if}>No
    </label>
{/function}

{function name=createInstrument}
    <select class="form-control" name="{$k}" {if $d eq "Yes"}disabled{/if}>
        {foreach from=$instruments key=name item=label}
            <option {if $v eq $name}selected{/if} value="{$name}">{$label}</option>
        {/foreach}
    </select>
{/function}

{function name=createScanType}
    <select class="form-control" name="{$k}" {if $d eq "Yes"}disabled{/if}>
        {foreach from=$scan_types key=name item=label}
            <option {if $v eq $name}selected{/if} value="{$name}">{$label}</option>
        {/foreach}
    </select>
{/function}

{function name=createLookUpCenterNameUsing}
    <select class="form-control" name="{$k}" {if $d eq "Yes"}disabled{/if}>
        {foreach from=$lookup_center key=name item=label}
            <option {if $v eq $name}selected{/if} value="{$name}">{$label}</option>
        {/foreach}
    </select>
{/function}

{function name=createEmail}
    <input class="form-control" type="email" name="{$k}" value="{$v}" {if $d eq "Yes"}disabled{/if}>
{/function}

{function name=createTextArea}
    <textarea class="form-control" rows="4" name="{$k}" {if $d eq "Yes"}disabled{/if}>{$v}</textarea>
{/function}

{function name=createText}
    <input type="text" class="form-control" name="{$k}" value="{$v}" {if $d eq "Yes"}disabled{/if}>
{/function}

{function name=printConfigItem}
<div class="form-group">
    <div class="col-sm-3" data-toggle="tooltip" data-placement="right" title="{$node['Description']}">
        <label class="col-sm-12 control-label config-name">{$node['Label']}</label>
        {if $sandbox}<div class="config-dev-name pull-right"><i>{$node['Name']}</i></div>{/if}
    </div>
    <div class="col-sm-9">
        {if isset($node['Children']) && $node['Children']}
            Child nodes go here
            {call name=printConfigItem node=$node['Children']}
        {else}
            {call name=printForm node=$node}
        {/if}
        {if $node['AllowMultiple'] == 1}
            <button class="btn btn-success add" id="{$node['ID']}" type="button" {if $node['Disabled'] eq "Yes"}disabled{/if}>
                <span class="glyphicon glyphicon-plus"></span> Add field
            </button>
        {/if}
    </div>
</div>
{/function}

{function name=printForm}
    <div class="config-form-group" id="{$node['ID']}">
    {foreach from=$node['Value'] key=k item=v}
        {if $node['AllowMultiple'] == 1}<div class="input-group entry">{/if}
        {if $node['DataType'] eq 'boolean'}
            {call createRadio k=$k v=$v d=$node['Disabled']}
        {elseif $node['DataType'] eq 'instrument'}
            {call createInstrument k=$k v=$v d=$node['Disabled']}
        {elseif $node['DataType'] eq 'scan_type'}
            {call createScanType k=$k v=$v d=$node['Disabled']}
        {elseif $node['DataType'] eq 'email'}
            {call createEmail k=$k v=$v d=$node['Disabled']}
        {elseif $node['DataType'] eq 'textarea'}
            {call createTextArea k=$k v=$v d=$node['Disabled']}
        {elseif $node['DataType'] eq 'lookup_center'}
            {call createLookUpCenterNameUsing k=$k v=$v d=$node['Disabled']}
        {else}
            {call createText k=$k v=$v d=$node['Disabled']}
        {/if}
        {if $node['AllowMultiple'] == 1}
            <div class="input-group-btn">
                <button class="btn btn-danger btn-remove" type="button" name="remove-{$k}" {if $node['Disabled'] eq "Yes"}disabled{/if}>
                    <span class="glyphicon glyphicon-remove"></span>&nbsp;
                </button>
            </div>
        {/if}
        {if $node['AllowMultiple'] == 1}</div>{/if}
    {foreachelse}
        {if $node['AllowMultiple'] == 1}<div class="input-group entry">{/if}
        {assign var=id value={"add-"|cat:$node['ID']} }
        {if $node['DataType'] eq 'boolean'}
            {call createRadio k=$id d=$node['Disabled']}
        {elseif $node['DataType'] eq 'instrument'}
            {call createInstrument k=$id d=$node['Disabled']}
        {elseif $node['DataType'] eq 'scan_type'}
            {call createScanType k=$id d=$node['Disabled']}
        {elseif $node['DataType'] eq 'email'}
            {call createEmail k=$id d=$node['Disabled']}
        {elseif $node['DataType'] eq 'textarea'}
            {call createTextArea k=$id d=$node['Disabled']}
        {elseif $node['DataType'] eq 'lookup_center'}
            {call createLookUpCenterNameUsing k=$id d=$node['Disabled']}
        {else}
            {call createText k=$id d=$node['Disabled']}
        {/if}
        {if $node['AllowMultiple'] == 1}
            <div class="input-group-btn">
                <button class="btn btn-danger btn-remove remove-new" type="button" {if $node['Disabled'] eq "Yes"}disabled{/if}>
                    <span class="glyphicon glyphicon-remove"></span>&nbsp;
                </button>
            </div>
        {/if}
        {if $node['AllowMultiple'] == 1}</div>{/if}
    {/foreach}
    </div>
{/function}

<p>Please enter the various configuration variables into the fields below. For information on how to configure LORIS, please refer to the Help section and/or the Developer's guide.</p>
<p>To configure study subprojects <a href="{$baseurl}/configuration/subproject/">click here</a>.
    To configure study projects <a href="{$baseurl}/configuration/project/">click here</a>.
</p>
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

<div class="col-md-9">
    <div class="tab-content">
    {foreach $config as $topItem name=configContent}
        {if $smarty.foreach.configContent.first}
        <div class="tab-pane active" id="{$topItem['Name']}">

        {else}
        <div class="tab-pane" id="{$topItem['Name']}">

        {/if}
            <h3>{$topItem['Label']}</h3>
            <p>{$topItem['Description']}</p>
            <hr>
            <div class="col-md-11">
            <form class="form-horizontal" role="form" method="post">
            {foreach $topItem['Children'] as $configChild}
                {call name=printConfigItem node=$configChild}
            {/foreach}
                <div class="form-group">
                    <div class="col-sm-offset-3 col-sm-9 submit-area">
                        <button type="submit" class="btn btn-primary">Submit</button>
                        <button type="reset" class="btn btn-default">Reset</button>
                    </div>
                </div>
            </form>
            </div>
        </div>
    {/foreach}
    </div>
</div>
