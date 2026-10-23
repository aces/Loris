<script language="javascript" src="{$baseurl|default}/configuration/js/candidate_identifier_types.js">
</script>

<p>{dgettext('configuration', 'Use this page to manage the configuration of candidate identifier types, or to add a new one.')}</p>

<div class="col-md-3">
<ul class="nav nav-pills nav-stacked" role="tablist" data-tabs="tabs">
    <li class="active">
        <a href="#identifiernew" data-toggle="tab" class="active">
            {dgettext('configuration', 'New Identifier Type')}
        </a>
    </li>
    {foreach from=$identifierTypes item=identifierType}
    <li>
        <a href="#identifier{$identifierType->candidateIdentifierTypeID}" data-toggle="tab">
            {$identifierType->name|escape}
        </a>
    </li>
    {/foreach}
</ul>
</div>

<div class="col-md-7">
    <div class="tab-content">
    {foreach from=$identifierTypes item=identifierType}
    <div id="identifier{$identifierType->candidateIdentifierTypeID}" class="tab-pane">
        <h2>{$identifierType->name|escape}</h2>
        <br>
        <form class="form-horizontal" role="form" method="post">
            <fieldset>
                <input type="hidden" name="CandidateIdentifierTypeID"
                    value="{$identifierType->candidateIdentifierTypeID}"
                    class="identifierTypeID">

                <div class="form-group">
                    <label class="col-sm-3 control-label"
                        data-toggle="tooltip"
                        data-placement="top"
                        title="Identifier name, e.g. PSCID or ExternalID">
                        {dgettext('configuration', 'Name')}
                    </label>
                    <div class="col-sm-9">
                        <input class="form-control identifierName" name="Name"
                            value="{$identifierType->name|escape}">
                    </div>
                </div>

                <div class="form-group">
                    <label class="col-sm-3 control-label"
                        data-toggle="tooltip"
                        data-placement="top"
                        title="Template used to generate or validate identifier values.">
                        {dgettext('configuration', 'Format')}
                    </label>
                    <div class="col-sm-9">
                        <input class="form-control identifierFormat" name="Format"
                            value="{$identifierType->format|escape}">
                    </div>
                </div>

                {foreach [
                    'IsRequired' => 'Required',
                    'IsUnique' => 'Unique',
                    'AutoGenerate' => 'Auto Generate',
                    'AllowMultiple' => 'Allow Multiple'
                ] as $field => $label}
                <div class="form-group">
                    <label class="col-sm-3 control-label"
                        data-toggle="tooltip"
                        data-placement="top"
                        title="{if $field == 'IsRequired'}Whether candidates using this identifier type must have at least one value
                            {elseif $field == 'IsUnique'}Whether identifier values must be unique across candidates
                            {elseif $field == 'AutoGenerate'}Whether LORIS generates the value automatically from the format
                            {elseif $field == 'AllowMultiple'}Whether a candidate can have more than one value of this type{/if}">
                        {dgettext('configuration', $label)}
                    </label>
                    <div class="col-sm-9">
                        <input type="checkbox" name="{$field}" class="{$field}"
                            {if $field == 'IsRequired' && $identifierType->isRequired
                                || $field == 'IsUnique' && $identifierType->isUnique
                                || $field == 'AutoGenerate' && $identifierType->autoGenerate
                                || $field == 'AllowMultiple' && $identifierType->allowMultiple}
                                checked
                            {/if}>
                    </div>
                </div>
                {/foreach}

                <div class="form-group">
                    <label class="col-sm-3 control-label"
                        data-toggle="tooltip"
                        data-placement="top"
                        title="Projects in which this identifier type can be used. An identifier type can be associated with multiple projects.">
                        {dgettext('configuration', 'Projects')}
                    </label>
                    <div class="col-sm-9">
                        <select name="ProjectIDs" class="form-control identifierProjects" multiple>
                            {foreach from=$projects key=ProjectID item=projectName}
                                <option value="{$ProjectID}"
                                    {foreach from=$identifierType->projects item=project}
                                        {if $project->getId() == $ProjectID}selected{/if}
                                    {/foreach}>
                                    {$projectName|escape}
                                </option>
                            {/foreach}
                        </select>
                    </div>
                </div>

                <div class="form-group">
                    <div class="col-sm-offset-3 col-sm-9">
                        <button class="btn btn-primary saveIdentifierType submit-area">
                            {dgettext('loris', 'Save')}
                        </button>
                        <button class="btn btn-default submit-area" type="reset">
                            {dgettext('loris', 'Reset')}
                        </button>
                        <label class="saveStatus"></label>
                    </div>
                </div>
            </fieldset>
        </form>
    </div>
    {/foreach}

    <div id="identifiernew" class="tab-pane active">
        <h2>{dgettext('configuration', 'New Identifier Type')}</h2>
        <br>
        <form class="form-horizontal" role="form" method="post">
            <fieldset>
                <input type="hidden" name="CandidateIdentifierTypeID"
                    value="new" class="identifierTypeID">

                <div class="form-group">
                    <label class="col-sm-3 control-label"
                        data-toggle="tooltip"
                        data-placement="top"
                        title="Identifier name, e.g. PSCID or ExternalID">
                        {dgettext('configuration', 'Name')}
                    </label>
                    <div class="col-sm-9">
                        <input class="form-control identifierName" name="Name" value="">
                    </div>
                </div>

                <div class="form-group">
                    <label class="col-sm-3 control-label"
                        data-toggle="tooltip"
                        data-placement="top"
                        title="Template used to generate or validate identifier values.">
                        {dgettext('configuration', 'Format')}
                    </label>
                    <div class="col-sm-9">
                        <input class="form-control identifierFormat" name="Format" value="">
                    </div>
                </div>

                {foreach [
                    'IsRequired' => 'Required',
                    'IsUnique' => 'Unique',
                    'AutoGenerate' => 'Auto Generate',
                    'AllowMultiple' => 'Allow Multiple'
                ] as $field => $label}
                <div class="form-group">
                    <label class="col-sm-3 control-label"
                        data-toggle="tooltip"
                        data-placement="top"
                        title="{if $field == 'IsRequired'}Whether candidates using this identifier type must have at least one value
                            {elseif $field == 'IsUnique'}Whether identifier values must be unique across candidates
                            {elseif $field == 'AutoGenerate'}Whether LORIS generates the value automatically from the format
                            {elseif $field == 'AllowMultiple'}Whether a candidate can have more than one value of this type{/if}">
                        {dgettext('configuration', $label)}
                    </label>
                    <div class="col-sm-9">
                        <input type="checkbox" name="{$field}" class="{$field}">
                    </div>
                </div>
                {/foreach}

                <div class="form-group">
                    <label class="col-sm-3 control-label"
                        data-toggle="tooltip"
                        data-placement="top"
                        title="Projects in which this identifier type can be used. An identifier type can be associated with multiple projects.">
                        {dgettext('configuration', 'Projects')}
                    </label>
                    <div class="col-sm-9">
                        <select name="ProjectIDs" class="form-control identifierProjects" multiple>
                            {foreach from=$projects key=ProjectID item=projectName}
                                <option value="{$ProjectID}">{$projectName|escape}</option>
                            {/foreach}
                        </select>
                    </div>
                </div>

                <div class="form-group">
                    <div class="col-sm-offset-3 col-sm-9">
                        <button class="btn btn-primary saveIdentifierType submit-area">
                            {dgettext('loris', 'Save')}
                        </button>
                        <button class="btn btn-default submit-area" type="reset">
                            {dgettext('loris', 'Reset')}
                        </button>
                        <label class="saveStatus"></label>
                    </div>
                </div>
            </fieldset>
        </form>
    </div>
    </div>
</div>