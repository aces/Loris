
{if $form.javascript}
<script language="javascript">
<!-- 
    {$form.javascript}
//-->
</script>
{/if}

<table border="0" class="maintable" align="left">
    <form{$form.attributes}>{$form.hidden}
    
    {foreach item=sec key=i from=$form.sections}
        <tr>
            <td class="header" colspan="2">
            <b>{$sec.header}</b></td>
        </tr>
              
        {foreach item=element from=$sec.elements}
            
            <!-- elements with alternative layout in external template file-->
            {if $element.style}
                {include file="smarty-dynamic-`$element.style`.tpl} 
                
            {*
            NOTE: Another way is to have smarty template code in
            $element.style. In this case you can do:
            
            {if $element.style}
                {eval var=$element.style}
            *}   
            
            <!-- submit or reset button (don't display on frozen forms) -->
            {elseif $element.type eq "submit" or $element.type eq "reset"}
                {if not $form.frozen}
                <tr>   
                    <td>&nbsp;</td>
                    <td align="left">{$element.html}</td>
                </tr>
                {/if}
            
            <!-- normal elements -->
            {else}
                <tr>
                {if $element.type eq "textarea"}               
                    <td colspan="2">
                        {if $element.required}<font color="red">*</font>{/if}<b>{$element.label}</b><br />
                {else}
                    <td align="right" valign="top">
                        {if $element.required}<font color="red">*</font>{/if}<b>{$element.label}:</b></td>
                    <td>
                {/if} 
                    {*{if $element.error}<font color="red">{$element.error}</font><br />{/if}*}
                    {if $element.type eq "group"}
                        {foreach key=gkey item=gitem from=$element.elements}
                            {$gitem.label}
                            {$gitem.html}{if $gitem.required}<font color="red">*</font>{/if}                           
                            {if $element.separator}{cycle values=$element.separator}{/if}
                        {/foreach}
                    {else}
                        {$element.html}
                    {/if}
                    </td>
                </tr>
            
            {/if}
        {/foreach}   
    {/foreach}
    
    {if $form.requirednote and not $form.frozen}
    <tr>
        <td>&nbsp;</td>
        <td valign="top">{$form.requirednote}</td>
    </tr>
    {/if}
    
    </form>   
</table>
<!-- {*
&nbsp;
<p><b>Collected Errors:</b><br />
{foreach key=name item=error from=$form.errors}
    <font color="red">{$error}</font> in element [{$name}]<br />
{/foreach}
</p>
*}
-->
