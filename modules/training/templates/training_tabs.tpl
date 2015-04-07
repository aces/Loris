<h3>{$instrumentName} Training</h3>

<ul class="nav nav-tabs" id="trainingTabs">
    {foreach $tabs as $tab}
    {if $type == 'training'}
    <li class="disabled" id="{$tab['OrderNumber']}">
    {elseif $type == 'review'}
    <li class="review" id="{$tab['OrderNumber']}">
    {/if}
        <a role="button" data-toggle="tab" data-target="#{$tab['Title']|replace:' ':''}">
            {$tab['Title']}
        </a>
    </li>
    {/foreach}
</ul>
<div class="tab-content container">
    {foreach $tabs as $tab}
        <div class="tab-pane training-{$tab['TrainingType']}" id="{$tab['Title']|replace:' ':''}">
        </div>
    {/foreach}
</div>