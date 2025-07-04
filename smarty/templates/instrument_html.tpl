<script type="text/javascript" src="{$baseurl}/js/instrument_form_control.js"></script>
<style type="text/css">
	.table-instrument {
		white-space: nowrap;
	}
	.table-instrument>tbody>tr>th{
		color: black;
	}
	.table-instrument>tbody>tr>th, .table-instrument>tbody>tr>td  {
	     border-top: none;
	 }
</style>

<!-- table with candidate profile info -->
<table cellpadding="2" class="table table-info table-bordered dynamictable" style="max-width:auto">
  <!-- column headings -->
  <thead>
  <tr class="info">
    <th>
      Derived Age
    </th>
    <th>
        EDC Age
    </th>
    <th>
      Biological Sex
    </th>
    {if $candidate.ProjectTitle != ""}
      <th>
        Project
      </th>
    {/if}
    {foreach from=$candidate.DisplayParameters item=value key=name}
      <th>
        {$name}
      </th>
    {/foreach}
      <th>
        Visit Label
      </th>
      <th>
        Visit to Site
      </th>
      <th>
        Cohort
      </th>
      <th>
        MR Scan Done
      </th>
      <th>
        Within Optimal
      </th>
      <th>
        Within Permitted
      </th>
      {if $SupplementalSessionStatuses }
        {foreach from=$timePoint.status item=status key=name}
          <th>
            {$name}
          </th>
        {/foreach}
      {/if}
  </tr>
  </thead>
  <!-- candidate data -->
  <tbody>
  <tr>
    {if $dob_age!=""}
      <td>
        {$dob_age}
      </td>
    {/if}
    {if $edc_age!=""}
      <td>
        {$edc_age}
      </td>
    {/if}
    <td>
      {$candidate.Sex}
    </td>
    {if $candidate.ProjectTitle != ""}
      <td>
        {$candidate.ProjectTitle}
      </td>
    {/if}
    {foreach from=$candidate.DisplayParameters item=value key=name}
      <td>
        {$value}
      </td>
    {/foreach}

      <!-- timepoint data -->
      <td>
        {$timePoint.Visit_label}
      </td>
      <td>
        {$timePoint.PSC}
      </td>
      <td>
        {$timePoint.CohortTitle}
      </td>
      <td>
        {$timePoint.Scan_done|default:"<img alt=\"Data Missing\" src=\"$baseurl/images/help2.gif\" width=\"12\" height=\"12\" />"}
      </td>
      <td>
        {if $timePoint.WindowInfo.Optimum}
          Yes
        {else}
          No
        {/if}
      </td>
      <td {if not $timePoint.WindowInfo.Optimum}class="error"{/if}>
        {if $timePoint.WindowInfo.Permitted}
          Yes
        {else}
          No
        {/if}
      </td>
      {if $SupplementalSessionStatuses }
        {foreach from=$timePoint.status item=status}
          <td>
            {$status}
          </td>
        {/foreach}
      {/if}
  </tr>
  </tbody>
</table>

<div class="table-responsive">
  <table class="table table-bordered">
    <!-- visit statuses -->
    <thead>
    <tr class="info">
      <th nowrap="nowrap" colspan="3">
        Stage
      </th>
      <th nowrap="nowrap" colspan="3">
        Status
      </th>
      <th nowrap="nowrap" colspan="2">
        Date
      </th>
    </tr>
    </thead>
    <tbody>
    <tr>
      <td nowrap="nowrap" colspan="3">
        Screening
      </td>
      <td nowrap="nowrap" colspan="3">
        {$timePoint.Screening}
      </td>
      <td nowrap="nowrap" colspan="2">
        {$timePoint.Date_screening}
      </td>
    </tr>
    <tr>
      <td nowrap="nowrap" colspan="3">
        Visit
      </td>
      <td nowrap="nowrap" colspan="3">
        {$timePoint.Visit}
      </td>
      <td nowrap="nowrap" colspan="2">
        {$timePoint.Date_visit}
      </td>
    </tr>
    <tr>
      <td nowrap="nowrap" colspan="3">
        Approval
      </td>
      <td nowrap="nowrap" colspan="3">
        {$timePoint.Approval}
      </td>
      <td nowrap="nowrap" colspan="2">
        {$timePoint.Date_approval}
      </td>
    </tr>
    </tbody>
  </table>
</div>

<form method="post" name="test_form" id="test_form" {$form.enctype} {$form.action}>
<div class="form-group">
	{$form.hidden}
	{$form.errors.mainError}
	{assign var="inTable" value="FALSE"}
	{foreach from=$form.elements item=element}
		{if $element.name neq mainError}
			{if $inTable eq "TRUE" and $element.type neq "group"}
				{assign var="inTable" value="FALSE"}
				</table>
			{/if}
			{if $element.type eq header}
				<div class="row form-group col-xs-12">
					{$element.html}
				</div>
			{elseif $element.label === $element.html}
				<label class="row form-group col-xs-12">
					{$element.label}
				</label>
			{elseif $element.type eq hidden}
				{$element.html}
			{elseif $element.name eq lorisSubHeader}
				<div class="col-xs-12">
					{$element.label}
				</div>
				<br><br><br><br>
			{elseif $element.type eq "group"}
				{if substr_count($element.elements[1].name, '_status')}
					{if $inTable eq "TRUE"}
						{assign var="inTable" value="FALSE"}
						</table>
					{/if}
					{if $element.error}
			    	<div class="row form-group form-inline has-error">
			        {else}
			        <div class="row form-group form-inline">
			        {/if}
						<label class="col-sm-4 col-xs-12">
							{if $element.required}
								<span style="color: #ff0000">*</span>
							{/if}
							{$element.label}
						</label>
						<div class="col-sm-8">
							<div class="col-xs-12 element">
								{foreach key=gkey item=gitem from=$element.elements}
									{$gitem.html}
								{/foreach}
							</div>
							{if $element.error}
								<div class="col-xs-12">
				                    <font class="form-error">{$element.error}</font>
				                </div>
							{/if}
						</div>
					</div>
				{else}
					{if $inTable eq "FALSE"}
						{assign var="inTable" value="TRUE"}
						<table class="table table-instrument">
							<tr>
								<th colspan="2">{$element.label}</th>
								{foreach key=gkey item=gitem from=$element.elements}
									<th>{$gitem.html}</th>
								{/foreach}
							</tr>
					{else}
						{if $element.error}
				    	<tr class="has-error">
				        {else}
				        <tr>
				        {/if}
							<td colspan="2">{$element.label}</td>
                            {assign var="itemError" value=""}
                            {assign var="atLeastOneError" value=""}
                            {foreach key=gkey item=gitem from=$element.elements}
                                {if $gitem.error}
                                    {assign var="itemError" value=" has-error"}
                                    {assign var="atLeastOneError" value="1"}
                                {else}
                                    {assign var="itemError" value=""}
                                {/if}
                                {if $gitem.type == 'date' || $gitem.type == 'time' }
                                    <td class="element form-inline{$itemError}">{$gitem.html}</td>
                                {elseif $gitem.type == 'checkbox'}
                                    <td class="form-inline{$itemError}">{$gitem.html}</td>
                                {else}
                                    <td class="element{$itemError}">{$gitem.html}</td>
                                {/if}
                            {/foreach}
						</tr>
						{if $element.error}
                        <tr>
                            <td colspan="2"></td>
                            <td colspan="{$element.elements|@count}" class="has-error">
                                <font class="form-error">{$element.error}</font>
                            </td>
                        </tr>
                        {elseif $atLeastOneError}
                        <tr>
                            <td colspan="2"></td>
                            {foreach key=gkey item=gitem from=$element.elements}
                                {if $gitem.error}
                                    <td class="has-error">
                                        <font class="form-error">{$gitem.error}</font>
                                    </td>
                                {else}
                                    <td/>
                                {/if}
                            {/foreach}
                        </tr>
						{/if}
					{/if}
				{/if}
			{else}
				{if $inTable eq "TRUE"}
					{assign var="inTable" value="FALSE"}
					</table>
				{/if}
				{if $element.error}
		    	<div class="row form-group form-inline has-error">
		        {else}
		        <div class="row form-group form-inline">
		        {/if}
		        	<label class="col-sm-4 col-xs-12">
						{if $element.required}
							<span style="color: #ff0000">*</span>
						{/if}
						{$element.label}
					</label>
					<div class="col-sm-8">
						<div class="col-xs-12 element">
							{$element.html}
						</div>
						{if $element.error}
							<div class="col-xs-12">
			                    <font class="form-error">{$element.error}</font>
			                </div>
						{/if}
					</div>
				</div>
			{/if}
		{/if}
	{/foreach}
	{foreach from=$form.sections item=section}
		<div class="col-sm-12">
			<div class="col-sm-8">
				<h3 align="center">{$section.header}</h3>
				<br>
			</div>
		</div>
		{foreach from=$section.elements item=element}
			{if $element.name neq mainError}
				{if $element.name eq lorisSubHeader}
					<div class="col-xs-12">
						{$element.label}
					</div>
					<br><br><br><br>
				{elseif $element.type eq "group"}
					{if substr_count($element.elements[1].name, '_status')}
						{if $inTable eq "TRUE"}
							{assign var="inTable" value="FALSE"}
							</table>
						{/if}
						{if $element.error}
				    	<div class="row form-group form-inline has-error">
				        {else}
				        <div class="row form-group form-inline">
				        {/if}
							<label class="col-sm-4 col-xs-12">
								{if $element.required}
									<span style="color: #ff0000">*</span>
								{/if}
								{$element.label}
							</label>
							<div class="col-sm-8">
								<div class="col-xs-12 element">
									{foreach key=gkey item=gitem from=$element.elements}
										{$gitem.html}
									{/foreach}
								</div>
								{if $element.error}
									<div class="col-xs-12">
					                    <font class="form-error">{$element.error}</font>
					                </div>
								{/if}
							</div>
						</div>
					{else}
						{if $inTable eq "FALSE"}
							{assign var="inTable" value="TRUE"}
							<table class="table table-instrument">
								<tr>
									<th colspan="2">{$element.label}</th>
									{foreach key=gkey item=gitem from=$element.elements}
										<th>{$gitem.html}</th>
									{/foreach}
								</tr>
						{else}
							{if $element.error}
					    	<tr class="has-error">
					        {else}
					        <tr>
					        {/if}
								<td colspan="2">{$element.label}</td>
								{foreach key=gkey item=gitem from=$element.elements}
									{if $gitem.type == 'date'}
										<td class="element form-inline">{$gitem.html}</td>
									{elseif $gitem.type == 'checkbox'}
										<td class="form-inline">{$gitem.html}</td>
									{else}
										<td class="element">{$gitem.html}</td>
									{/if}
								{/foreach}
							</tr>
							{if $element.error}
								<tr>
									<td colspan="2"></td>
				                    <td colspan="{$element.elements|@count}" class="has-error">
				                    	<font class="form-error">{$element.error}</font>
				                    </td>
				                </tr>
							{/if}
						{/if}
					{/if}
				{else}
					{if $inTable eq "TRUE"}
						{assign var="inTable" value="FALSE"}
						</table>
					{/if}
					{if $element.error}
			    	<div class="row form-group form-inline has-error">
			        {else}
			        <div class="row form-group form-inline">
			        {/if}
			        	<label class="col-sm-4 col-xs-12">
							{if $element.required}
								<span style="color: #ff0000">*</span>
							{/if}
							{$element.label}
						</label>
						<div class="col-sm-8">
							<div class="col-xs-12 element">
								{$element.html}
							</div>
							{if $element.error}
								<div class="col-xs-12">
				                    <font class="form-error">{$element.error}</font>
				                </div>
							{/if}
						</div>
					</div>
				{/if}
			{/if}
		{/foreach}
		{if $inTable eq "TRUE"}
			{assign var="inTable" value="FALSE"}
			</table>
		{/if}
	{/foreach}
	{if $inTable eq "TRUE"}
		{assign var="inTable" value="FALSE"}
		</table>
	{/if}
</div>
</form>
