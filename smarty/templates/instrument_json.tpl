{function name="renderbase" type=$type element=$element lastComma=true}
    "Type" : "{$type}"
    {if $element.name}, "Name" : "{$element.name}"{/if}
    {if $element.label},"Description" : "{$element.label}"{/if}
{/function}
{function name="renderheader" description=$description level=$level}
{ldelim}
    "Type" : "header",
    "Description" : "{$description}"{if $level},
    "Options" : {ldelim}
        "Level" : {$level}
    {rdelim}{/if}
{rdelim}
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
{function name="rendernumeric" element=$element}
{ldelim}
    {renderbase type="numeric" element=$element},
    "Options" : {ldelim}
        {* The Loris wrappers use HTML_Quickform numeric rules to
           enforce this in PHP. The numeric rule can be either decimal
           or integer, so we say it's a decimal which is more lax
           *}
        "NumberType" : "decimal"
    {rdelim}
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
    {rendernumeric element=$element}
{elseif $element.type == "static"}
    {if $element.name != ''}
        {if $element.name != 'Window_difference' && $element.name != 'Candidate_Age'}
            {* Window Difference and Candidate Age are from the MetaData fields *}
            {renderscore element=$element}
        {/if}
    {else}
        {if $element.label|strip}
            {ldelim}
            {renderbase type="label" element=$element lastComma=false}
            {rdelim}
        {/if}
    {/if}
{elseif $element.type == "header"}
    {renderheader description=$element.label level=1}
{elseif $element.type == "group"}
    {ldelim}
        "Type" : "Group",
        "Error" : "Unimplemented"
    {rdelim}
{elseif $element.type == "page"}
    {ldelim}
        "Type" : "ElementGroup",
        "GroupType" : "Page",
        "Elements" : [{call renderElementGroup elements=$element.elements}],
        "Description" : "{$element.Description}"
    {rdelim}
{elseif $element.type == "ignored"}{else}
    {ldelim}
        "Type" : "Unknown",
        "Error" :"Unknown type"
    {rdelim}
{/if}
{/strip}
{/function}
{function name="renderElementGroup" elements=$elements}
    {foreach from=$elements item=element name=ElementLoop}
    {capture assign="el"}{strip}{renderelement element=$element}{/strip}{/capture}
        {if $el}{$el}{if $el && !$smarty.foreach.ElementLoop.last},{/if}{/if}
    {/foreach}
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
    {renderElementGroup elements=$form.elements}
    {foreach from=$form.sections item=section name=SectionsLoop}
        {if $section.header}
             {capture assign="header"}{strip}{$section.header}{/strip}{/capture}
             {renderheader description=$header level=1}
             {if $section.elements || !$smarty.foreach.SectionsLoop.last},{/if}
        {/if}
        {foreach from=$section.elements item=element name=SectionLoop}
            {capture assign="el"}{strip}{renderelement element=$element}{/strip}{/capture}
            {if $el}{$el}{/if}{if $el}{if !$smarty.foreach.SectionsLoop.last},{elseif !$smarty.foreach.SectionLoop.last},{/if}{/if}
        {/foreach}
    {/foreach}
    ]
{rdelim}
