{function name=printTree}
<div class="tree">
<ul class="list-group">
    {foreach $items as $item}
        {if isset($item['Children']) && $item['Children']}
{*SPECIAL CASE FOR INSTRUMENTS, SINCE THEY ARE MULTIPLE PARENT*}
            {if $item['Name'] == 'ReliabilityInstruments'}
                {* SORRY, IT'S NOT IMPLEMENTED *}
            {else}
                <li class="list-group-item list-group-item-success" id="{$item['ID']}">
                    <span class="collapsable" id="{$item['ID']}">
                        <span class="glyphicon glyphicon-chevron-down" id="{$item['ID']}"> {$item['Description']}</span>
                    </span>
                    {call name=printTree items=$item['Children']}
                </li>
            {/if}
        {else}
            {if $item['Value']} 
                {call name=printLeaves node=$item}
            {/if}
        {/if}
    {/foreach}
</ul>
</div>
{/function}


{function name=printLeaves}
{foreach from=$node['Value'] key=k item=v}
    <div class="row" id="{$k}" style="margin-left:0px;margin-right:0px;">
        <li class="list-group-item list-group-item-info" id="{$k}">
            <span class="collapsable" id="{$node['ID']}">
                <div class="col-md-8"><span class="name" id="{$k}">{$node['Description']}</span></div>
                <div class="col-md-4">
                    <div class="form" id="{$node['ID']}">
                        <div {if $node['AllowMultiple'] == 1}class="input-group"{/if}>
                            <form method="POST" action="">
                                <input class="form-control" name="{$k}" type="text" id="{$k}" value="{$v}">
                            </form>
                            {if $node['AllowMultiple'] == 1}
                                <div class="input-group-btn">
                                    <form method="POST" action="">
                                        <button class="btn btn-default add" id="{$k}" type="button" name="add-{$node['ID']}"><i class="glyphicon glyphicon-plus"></i></button>
                                        <button class="btn btn-default remove" id="{$k}" type="submit" name="remove-{$k}"><i class="glyphicon glyphicon-minus"></i></button>
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
{/function}

{call name=printTree items=$configs}

