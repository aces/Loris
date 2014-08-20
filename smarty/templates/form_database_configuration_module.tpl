{function name=printTree}
<div class="tree">
<ul class="list-group">
    {foreach $items as $item}
        {if isset($item['Children']) && $item['Children']} 
            <li class="list-group-item list-group-item-success" id="{$item['ID']}">
            <span class="collapsable" id="{$item['ID']}">
            <span class="glyphicon glyphicon-chevron-down" id="{$item['ID']}"> {$item['Description']}</span></span>  
            {call name=printTree items=$item['Children']}</li> 
        {else}
            {if $item['Value']} 
            {foreach from=$item['Value'] key=k item=v}
                <div class="row" id="{$k}" style="margin-left:0px;margin-right:0px;">
                <li class="list-group-item list-group-item-info" id="{$k}">
                <span class="collapsable" id="{$item['ID']}">
                    <div class="col-md-8"><span class="name" id="{$k}">{$item['Description']}</span></div>
                    <div class="col-md-4">
                        <div class="form" id="{$item['ID']}">
                            <div {if $item['AllowMultiple'] == 1}class="input-group"{/if}>
                                <form method="POST" action="">
                                    <input class="form-control" name="{$k}" type="text" id="{$k}" value="{$v}">
                                </form>
                                {if $item['AllowMultiple'] == 1}
                                    <div class="input-group-btn">
                                        <form method="POST" action="">
                                             <button class="btn btn-default remove" id="{$k}" type="submit" name="remove-{$k}"><i class="glyphicon glyphicon-remove"></i></button>
                                             <button class="btn btn-default add" id="{$k}" type="button" name="add-{$item['ID']}"><i class="glyphicon glyphicon-plus"></i></button>
                                        </form>
                                    </div>
                                {/if}
                            </div>
                        </div>
                    </div>
                </span>
                </li>
                </div>
            {/foreach}
            {/if}
        {/if}
    {/foreach}
</ul>
</div>
{/function}

{call name=printTree items=$configs}


{function name=printForms}
    {foreach $items as $tag}
        {if $tag['Type'] != '' || $tag['AllowMultiple'] == 1}
            <form method="POST" action="">  
            <div class="form" id="{$tag['ID']}">
            <span class="form-label">{$tag['Description']}</span><br>
            {foreach from=$tag['Value'] key=k item=v}
                <div {if $tag['AllowMultiple'] == 1}class="input-group"{/if}>
                {if $tag['AllowMultiple'] == 0}<div style="margin-bottom:-14px">&nbsp;</div>{/if}
                {if $tag['Type'] == "bool"} 
                    {html_options id="{$k}" options=$options name="{$k}" selected={$v}}<br>
                {elseif $tag['Type'] == "text"}
                    <input class="form-control" name="{$k}" type="text" id="{$k}" value="{$v}"><br>
                {/if}
                {if $tag['AllowMultiple'] == 1}
                    {* AllowMultiple is true and already contains value(s), add remove button *}
                    <span class="input-group-btn">
                    <input class="btn btn-default remove" id="{$k}" type="submit" value="Remove" name="remove-{$k}"></span>                    
                {/if}
                </div>
            {/foreach}
            {* AllowMultiple is true, but no content yet *}
            {if $tag['AllowMultiple'] == 1}
                {if !$tag['Value']}<div style="margin-bottom:-14px">&nbsp;</div>{/if} 
                <input class="btn btn-default add" id="{$tag['ID']}" type="button" value="Add"> 
            {/if}
            <input class="btn btn-default" type="submit" value="Save" name="save">
            <input class="btn btn-default cancel" id="{$tag['ID']}" type="button" value="Cancel">
            </div>
            </form>
        {/if}
        {if $tag['Children']}
            {call name=printForms items=$tag['Children']}
        {/if}
    {/foreach}
{/function}

{*call name=printForms items=$configs*}

