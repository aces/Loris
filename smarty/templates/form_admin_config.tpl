{function name=printTree}
<div class="tree">
<ul class="list-group">
    {foreach $items as $item}
    <li class="list-group-item{if $item['Children']} list-group-item-success"{else} list-group-item-info"{/if} id="{$item['ID']}">
        <span class="collapsable">
        {$item['Description']}
        </span>
        {if $item['Children']}
            {call name=printTree items=$item['Children']}
        {/if}
    </li>
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

{call name=printForms items=$configs}

