<script type="text/javascript" src="js/jquery/jquery.treegrid.js"></script>
<script type="text/javascript" src="js/jquery.treegrid.bootstrap3.js"></script>

<link rel="stylesheet" href="css/jquery.treegrid.css">

<script type="text/javascript">
  $(document).ready(function() {
        $('.tree').treegrid({
          initialState: 'collapsed'
        });
    });
</script>

{function name=printConfig}
    {foreach $items as $item}
        {if isset($item['Parent'])}
            <tr class="treegrid-{$item['ID']} treegrid-parent-{$item['Parent']}">
        {else}
            <tr class="treegrid-{$item['ID']}">
        {/if}
                <td>{$item['Description']}</td>
                {if isset($item['Value'])}
                    <td>
                        {if $item['AllowMultiple'] == 1}
                            <button class="btn btn-default add" id="{$item['ID']}" type="button" name="add-{$item['ID']}"><i class="glyphicon glyphicon-plus"></i></button>
                        {/if}
                        {foreach from=$item['Value'] key=k item=v}
                            <form class="form-inline" method="POST" action="">
                                    <input class="form-control" name="{$k}" type="text" id="{$k}" value="{$v}">
                            </form>
                            {if $item['AllowMultiple'] == 1}
                                <form class="inline" method="POST" action="">
                                    <button class="btn btn-default remove" id="{$k}" type="submit" name="remove-{$k}"><i class="glyphicon glyphicon-remove"></i></button>
                                </form>
                            {/if}
                            
                        {/foreach}
                    </td>
                {else}
                <td></td>
                {/if}
            </tr>
    {/foreach}
{/function}


<!-- {function name=printTree}
<table class="tree table table-striped">
    {foreach $items as $item}
        {if isset($item['Children']) && $item['Children']}
            <tr class="treegrid-{$item['ID']}">
                <td>{$item['Description']}</td><td>Additional info</td>
            </tr>
                    {call name=printTree items=$item['Children']}
        {else}
            {if $item['Value']} 
                {call name=printLeaves node=$item}
            {/if}
        {/if}
    {/foreach}
</table>
{/function}


{function name=printLeaves}
{foreach from=$node['Value'] key=k item=v}
    <tr class="treegrid-2 treegrid-parent-1">
        <td>Node 1-1</td><td>Additional info</td>
    </tr>
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
{/function} -->

<!--{call name=printTree items=$configs}-->

<table class="tree table table-hover">
    {call name=printConfig items=$config}
</table>

