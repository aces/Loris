{function name="renderbase" type=$type element=$element}
    "Type" : "{$type}",
    "Name" : "{$element.name}",
    "Description" : "{$element.label}",
{/function}
{function name="renderselect" element=$element}
{ldelim}
    {renderbase type="select" element=$element}
    "Options" : {ldelim}
        "Values" : {ldelim}
        {foreach from=$element.options item=item key=key}
            "{$key}": "{$item}"
            {/foreach}
        {rdelim}
    {rdelim}
{rdelim}
{/function}
{function name="rendertext" element=$element}
{ldelim}
    {renderbase type="text" element=$element}
    "Options" : {ldelim}
        "Type" : "{if $element.type == "textarea"}large{else}small{/if}",
        "RequireResponse" : true
    {rdelim}
{rdelim}
{/function}
{function renderdate element=$element}
    {renderbase type="date" element=$element}
    "Options" : {ldelim}
        "MinDate" : {$element.options.mindate}
        "MaxDate" : {$element.options.maxdate}
    {rdelim}
{/function}
{function name="renderelement" element=$element}
{if $element.type == "select"}
    {renderselect element=$element}
{elseif $element.type == "text" || $element.type == "textarea"}
    {rendertext element=$element}
{elseif $element.type == "date"}
    {renderdate element=$element}
{elseif $element.type == "numeric"}
    NUMERIC TYPE NOT YET IMPLEMENTED
{elseif $element.type == "static"}
    STATIC NOT YET IMPLEMENTED
{elseif $element.type == "group"}
    GROUP NOT YET IMPLEMENTED
{else}
            UNKNOWN ELEMENT TYPE: $element.type
{$element|print_r}
{/if}
{/function}
<pre>
{ldelim}
    "Meta" : {ldelim}
        "InstrumentVersion" : "1l",
        "InstrumentFormatVersion" : "v0.0.1a-dev",
        "ShortName" : "{$testname}",
        "LongName" :  "{$fullname|escape:"javascript"}",
        "IncludeMetaDataFields" : "true"
    {rdelim},
    "Elements" : [
    {foreach from=$form.sections item=section}
        {foreach from=$section.elements item=element}
            {renderelement element=$element}
        {/foreach}
    {/foreach}
    ]
{rdelim}
</pre>
