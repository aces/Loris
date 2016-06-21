<link rel="stylesheet" href="/videos/css/videos.css">
<script>
  // Set candidate ids object
  candidateIds = {$candIDs|json_encode};
</script>

{if $errorMessage}
  <div class="alert alert-danger text-center" role="alert">
    <b>{$errorMessage}</b>
  </div>
{/if}

{if $uploadMessage}
  <div class="alert alert-success text-center" role="alert">
    <b>Upload Successful!</b>
  </div>
  <a class="btn btn-sm btn-primary" href='/videos/'>Back to Videos Page</a>
{/if}

{if $updateMessage}
  <div class="alert alert-success text-center" role="alert">
    <b>Update Successful!</b>
  </div>
  <a class="btn btn-sm btn-primary" href='/videos/'>Back to Videos Page</a>
{/if}


<form method="post" name="video_upload" id="video_upload"
      enctype="multipart/form-data">
  <h3>
    {if $smarty.get.identifier}
      Edit Video
    {elseif $uploadMessage}
      Upload Summary
    {else}
      Upload Video
    {/if}
  </h3>
  <br><br>

  {if empty($uploadMessage)}
    <div class="row form-group form-inline">
      <label class="col-sm-2">Note:</label>
      <div class="col-sm-10">
        File name should begin with
        <b>[PSCID]_[CandID]_[Visit Label]_[Instrument]</b>
        <br>
        For example, for candidate <i>9990000</i>, visit <i>V1</i> for
        <i>Biosample Collection</i>
        <br>
        the file name should be prefixed by: <b>9990000_CandID_V1_Biosample_Collection</b>
        <br>
      </div>
    </div>
  {/if}

  <div class="row form-group form-inline {if $form.errors.PSCID}has-error{/if}">
    <label class="col-sm-2">
      {$form.PSCID.label}
    </label>
    <div class="col-sm-10">
      {$form.PSCID.html} <span class="error-msg">PSCID is required!</span>
    </div>
    {if $form.errors.PSCID}
      <div class="col-sm-offset-2 col-xs-12">
        <span class="form-error">{$form.errors.PSCID}</span>
      </div>
    {/if}
  </div>

  <div class="row form-group form-inline {if $form.errors.visitLabel}has-error{/if}">
    <label class="col-sm-2">
      {$form.visitLabel.label}
    </label>
    <div class="col-sm-10">
      {$form.visitLabel.html} <span
              class="error-msg">Visit Label is required!</span>
    </div>
    {if $form.errors.visitLabel}
      <div class="col-sm-offset-2 col-xs-12">
        <span class="form-error">{$form.errors.visitLabel}</span>
      </div>
    {/if}
  </div>

  <div class="row form-group form-inline {if $form.errors.Instrument}has-error{/if}">
    <label class="col-sm-2">
      {$form.Instrument.label}
    </label>
    <div class="col-sm-10">
      {$form.Instrument.html} <span
              class="error-msg">Instrument is required!</span>
    </div>
    {if $form.errors.Instrument}
      <div class="col-sm-offset-2 col-xs-12">
        <span class="form-error">{$form.errors.Instrument}</span>
      </div>
    {/if}
  </div>

  <div class="row form-group form-inline {if $form.errors.Date_taken}has-error{/if}">
    <label class="col-sm-2">
      {$form.Date_taken.label}
    </label>
    <div class="col-sm-10">
      {$form.Date_taken.html}
    </div>
    {if $form.errors.Date_taken}
      <div class="col-sm-offset-2 col-xs-12">
        <span class="form-error">{$form.errors.Date_taken}</span>
      </div>
    {/if}
  </div>

  <div class="row form-group form-inline {if $form.errors.For_site}has-error{/if}">
    <label class="col-sm-2">
      {$form.For_site.label}
    </label>
    <div class="col-sm-10">
      {$form.For_site.html}
    </div>
    {if $form.errors.For_site}
      <div class="col-sm-offset-2 col-xs-12">
        <span class="form-error">{$form.errors.For_site}</span>
      </div>
    {/if}
  </div>

  <div class="row form-group form-inline {if $form.errors.comments}has-error{/if}">
    <label class="col-sm-2">
      {$form.comments.label}
    </label>
    <div class="col-sm-10">
      {$form.comments.html}
    </div>
    {if $form.errors.comments}
      <div class="col-sm-offset-2 col-xs-12">
        <span class="form-error">{$form.errors.comments}</span>
      </div>
    {/if}
  </div>

  <div class="row form-group form-inline">
    <div id="file-progress" class="col-sm-10 hide">
      <div class="progress">
        <div id="progressbar" class="progress-bar progress-bar-striped active"
             role="progressbar" aria-valuenow="0" aria-valuemin="0"
             aria-valuemax="100">
        </div>
        <div id="progresslabel">0%</div>
      </div>
    </div>
  </div>

  {if $form.video_file}
    {if empty($uploadMessage)}
      <div class="row form-group form-inline {if $form.errors.video_file}has-error{/if}">
        <label class="col-sm-2">
          {$form.video_file.label}
        </label>
        <div class="col-sm-10">
          {$form.video_file.html}
        </div>
        {if $form.errors.video_file}
          <div class="col-sm-offset-2 col-xs-12">
            <span class="form-error">{$form.errors.video_file}</span>
          </div>
        {/if}
      </div>
    {/if}
  {else}
    <div class="row form-group form-inline {if $form.errors.File_name}has-error{/if}">
      <label class="col-sm-2">
        {$form.File_name.label}
      </label>
      <div class="col-sm-10">
        {$form.File_name.html}
      </div>
      {if $form.errors.File_name}
        <div class="col-sm-offset-2 col-xs-12">
          <span class="form-error">{$form.errors.File_name}</span>
        </div>
      {/if}
    </div>
    <div class="row form-group form-inline {if $form.errors.hide_video}has-error{/if}">
      <label class="col-sm-2">
        {$form.hide_video.label} (check both to confirm)
      </label>
      <div class="col-sm-10">
        {$form.hide_video.html} {$form.hide_video_confirm.html}
      </div>
      {if $form.errors.hide_video}
        <div class="col-sm-offset-2 col-xs-12">
          <span class="form-error">{$form.errors.hide_video}</span>
        </div>
      {/if}
    </div>
  {/if}

  {if empty($uploadMessage)}
    <div class="row form-group form-inline">
      <div class="col-sm-2">
        {if $smarty.get.identifier}
          <input type="submit"
                 class="btn btn-sm btn-primary col-xs-12"
                 name="fire_away"
                 value="Update"
          />
        {else}
          <button type="button" class="btn btn-sm btn-primary col-xs-12" id="btn-upload">
            Upload
          </button>
        {/if}
      </div>
    </div>
  {/if}


  {$form.hidden}
</form>

