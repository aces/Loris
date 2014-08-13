{function name=printTree}

<ul class="config">
    {foreach $items as $item}
    <li class={if $item['Children']}"plus"{else}"minus"{/if} id="{$item['ID']}">
        <span class="collapsable">
        {$item['Description']}
        </span>
        {if $item['Children']}
            {call name=printTree items=$item['Children']}
        {/if}
    </li>
    {/foreach}
</ul>

{/function}

{call name=printTree items=$configs}

{function name=printForms}

{foreach $items as $tag}
   {if $tag['Type'] != ''}  
     <div class="form" id="{$tag['ID']}">
     {foreach from=$tag['Value'] key=k item=v}
         {$tag['Description']}{$tag['ID']}<br>
         {if $tag['Type'] == "bool"} 
         {html_options id={$k} options=$options name="bool_tag" selected={$v}}<br>
         {elseif $tag['Type'] == "text"}
         <input name="text_tag" type="text" id={$k} value="{$v}"><br>
         {/if}
     {/foreach}
     </div><br>
  {/if}
  {if $tag['Children']}
    {call name=printForms items=$tag['Children']}
  {/if}
{/foreach}
{/function}

{call name=printForms items=$configs}
{*foreach $dropdown as $tag}
     <div class="form" id="{$tag['ID']}">
     {foreach from=$tag['Value'] key=k item=v}
     {$tag['Description']}{$tag['ID']}<br> 
     {html_options id={$k} options=$tag['options'] name="bool_tag" selected={$v}}<br>
     {/foreach}
     </div><br>
{/foreach}
<br>
{foreach $text as $tag}
     <div class="form" id="{$tag['ID']}">
     {foreach from=$tag['Value'] key=k item=v}
     {$tag['Description']}{$tag['ID']}<br>
     <input name="text_tag" type="text" id={$k} value="{$v}"><br>
     {/foreach}
     </div><br>
{/foreach*}

 {*$form.{$tag['ID']}.label}
     {$form.{$tag['ID']}.html*}
 {*$form.{$tag['ID']}.label}
     {$form.{$tag['ID']}.html*} 