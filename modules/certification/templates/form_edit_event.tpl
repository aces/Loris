<script src="js/filterControl.js" type="text/javascript"></script>

<p>Choose the instrument for which you would like to receive certification:</p>

<div class="row">
    <div class="form-group">
        <label class="col-sm-12 col-md-1">Instruments</label>
        <div class="col-sm-12 col-md-3">
            <select class="form-control" name="certification_instruments">
                <option value="0"></option>
                {foreach from=$certification_instruments key=id item=name}
                <option value="{$id}">{$name}</option>
                {/foreach}
            </select>
        </div>
    </div>
</div>

<!--
<ul class="nav nav-tabs">
  <li role="presentation" class="active"><a href="#">Description</a></li>
  <li role="presentation"><a href="#">Instructions</a></li>
  <li role="presentation"><a href="#">Example</a></li>
  <li role="presentation"><a href="#">Scoring</a></li>
  <li role="presentation"><a href="#">Video</a></li>
  <li role="presentation"><a href="#">Quiz</a></li>
</ul>
-->