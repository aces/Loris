<script type="text/javascript" src="js/jquery/jquery.treegrid.js"></script>
<script type="text/javascript" src="js/jquery.treegrid.bootstrap3.js"></script>

<link rel="stylesheet" href="css/jquery.treegrid.css">

<script type="text/javascript">
  $(document).ready(function() {
        $('.tree').treegrid({
          'initialState': 'collapsed',
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
                <td>
                        {if $item['AllowMultiple'] == 1}
                            <form method="POST" action="">
                                <button class="btn btn-default add" id="{$item['ID']}" type="submit" name="add-{$item['ID']}">
                                    <span class="glyphicon glyphicon-plus"></span> Add field
                                </button>
                            </form>
                        {/if}
                        {if isset($item['Value'])}
                            {foreach from=$item['Value'] key=k item=v}
                                    <form method="POST" action="">
                                        <input class="form-control" name="{$k}" type="text" id="{$k}" value="{$v}">
                                    </form>
                                    {if $item['AllowMultiple'] == 1}
                                            <form class="inline" method="POST" action="">
                                                <button class="btn btn-default remove" id="{$k}" type="submit" name="remove-{$k}"><i class="glyphicon glyphicon-remove"></i></button>
                                            </form>
                                    {/if}
                            {/foreach}
                        {/if}
                </td>
            </tr>
    {/foreach}
{/function}

<table class="tree table table-hover">
    {call name=printConfig items=$config}
</table>

