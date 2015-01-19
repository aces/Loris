{function name="renderbase" type=$type element=$element lastComma=true}
    "Type" : "{$type}"
    {if $element.name}, "Name" : "{$element.name}"{/if}
    {if $element.label},"Description" : "{$element.label}"{/if}
{/function}
{function name="renderselect" element=$element}
{ldelim}
    {renderbase type="select" element=$element},
    "Options" : {ldelim}
        "Values" : {ldelim}
        {foreach from=$element.options item=item key=key name=SelectLoop}
            "{$key}": "{$item|strip}"{if !$smarty.foreach.SelectLoop.last},{/if}
            {/foreach}
        {rdelim}
        {if $element.RequireResponse}
        , "RequireResponse" : true
        {else}
        , "RequireResponse" : false
        {/if}
        {if $element.Multiselect}
        , "AllowMultiple" : true
        {/if}
    {rdelim}
{rdelim}
{/function}
{function name="rendertext" element=$element}
{ldelim}
    {renderbase type="text" element=$element},
    "Options" : {ldelim}
        "Type" : "{if $element.type == "textarea"}large{else}small{/if}",
        "RequireResponse" : true
    {rdelim}
{rdelim}
{/function}
{function renderdate element=$element}
{ldelim}
    {renderbase type="date" element=$element},
    "Options" : {ldelim}
        "MinDate" : "{$element.options.mindate}",
        "MaxDate" : "{$element.options.maxdate}"{if $element.NoResponse},
        "RequireResponse" : false{/if}
    {rdelim}
{rdelim}
{/function}
{function name="renderscore" element=$element}
{ldelim}
    {renderbase type="score" element=$element}
{rdelim}
{/function}
{function name="renderelement" element=$element}
{strip}
{if $element.type == "select"}
    {renderselect element=$element}
{elseif $element.type == "text" || $element.type == "textarea"}
    {rendertext element=$element}
{elseif $element.type == "date"}
    {renderdate element=$element}
{elseif $element.type == "numeric"}
    NUMERIC TYPE NOT YET IMPLEMENTED
{elseif $element.type == "static"}
    {if $element.name!= ''}
        {if $element.name != 'Window_difference' && $element.name != 'Candidate_Age'}
            {* Window Difference and Candidate Age are from the MetaData fields *}
            {renderscore element=$element}
        {/if}
    {else}
        {if $element.description|strip}
            {renderbase type="label" element=$element lastComma=false}
        {/if}
    {/if}
{elseif $element.type == "group"}
    {ldelim}
        "Type" : "Group",
        "Error" : "Unimplemented"
    {rdelim}
{elseif $element.type == "ignored"}{else}
    {ldelim}
        "Type" : "Unknown",
        "Error" :"Unknown type"
    {rdelim}
{/if}
{/strip}
{/function}
{ldelim}
    "Meta" : {ldelim}
        "InstrumentVersion" : "1l",
        "InstrumentFormatVersion" : "v0.0.1a-dev",
        "ShortName" : "{$testname}",
        "LongName" :  "{$fullname|escape:"javascript"}",
        "IncludeMetaDataFields" : "true"
    {rdelim},
    "Elements" : [
    {foreach from=$form.elements item=element name=ElementLoop}
        {capture assign="el"}{strip}{renderelement element=$element}{/strip}{/capture}
        {if $el}{$el}{if $el && !$smarty.foreach.ElementLoop.last},{/if}{/if}
    {/foreach}
    {foreach from=$form.sections item=section name=SectionsLoop}
        {foreach from=$section.elements item=element name=SectionLoop}
            {capture assign="el"}{strip}{renderelement element=$element}{/strip}{/capture}
            {if $el}{$el}{/if}{if $el}{if !$smarty.foreach.SectionsLoop.last},{elseif !$smarty.foreach.SectionLoop.last},{/if}{/if}
        {/foreach}
    {/foreach}
    ]
{rdelim}
