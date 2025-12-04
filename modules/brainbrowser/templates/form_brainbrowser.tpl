{literal}
<!--
  Not currently used
-->
<script id="overlay-ui-template" type="x-volume-ui-template">
<div class="brainbrowser-template clearfix">
  <div class="control-panel">
    <div class="panel panel-default">
      <div class="panel-heading">
        <div class="filename"></div>
        <h3 class="panel-title filename">Overlay</h3>
      </div>
      <div class="panel-body">
        <div class="volume-viewer-controls volume-controls .coords">
          <div class="coords">

            <div class="filename-overlay"></div>

            <div class="blend-div" data-volume-id="{{VOLID}}">
              <span class="control-heading" id="blend-heading{{VOLID}}">
                Blend (0.0 to 1.0)
              </span>
              <input class="control-inputs blend-inputs" value="0.5" id="blend-val" />
              <div id="blend-slider" class="slider volume-viewer-blend"></div>
            </div>

            <hr/>
            <div class="filename-overlay-additional-info">
              <div class="control-heading" id="world-coordinates-heading-{{VOLID}}">
                World Coordinates
              </div>
              <div class="world-coords" data-volume-id="{{VOLID}}">
                X<input id="world-x-{{VOLID}}" class="control-inputs">
                Y<input id="world-y-{{VOLID}}" class="control-inputs">
                Z<input id="world-z-{{VOLID}}" class="control-inputs">
              </div>

              <hr/>

              <div class="control-heading" id="voxel-coordinates-heading-{{VOLID}}">
                Voxel Coordinates
              </div>
              <div class="voxel-coords" data-volume-id="{{VOLID}}">
                X<input id="voxel-x-{{VOLID}}" class="control-inputs">
                Y<input id="voxel-y-{{VOLID}}" class="control-inputs">
                Z<input id="voxel-z-{{VOLID}}" class="control-inputs">
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="overlay-viewer-display" id="panel-size"></div>
</div>
</script>

<!--
  Template used to display UI for brain volume viewer
  Once variables are populated template is inserted in #brainbrowser div
-->
<script id="volume-ui-template4d" type="x-volume-ui-template">
<div class="brainbrowser-template clearfix">
  <div class="control-panel">
    <div class="panel panel-default" id="subpanel-filename-{{VOLID}}">
      <div class="panel-heading" id="mri-panel-filename-{{VOLID}}">
        <div class="filename clickable" id="filename-{{VOLID}}">
          Loading filename....
        </div>
        <span class="glyphicon glyphicon-chevron-down clickable"></span>
      </div>
      <div class="panel-body">
        <div class="volume-viewer-controls volume-controls">
          <div class="coords">
            <div data-t="World Coordinates" class="control-heading" id="world-coordinates-heading-{{VOLID}}">

            {/literal}
               {$world_coordinates}
            {literal}
            </div>
            <div class="world-coords" data-volume-id="{{VOLID}}">
              X<input id="world-x-{{VOLID}}" class="control-inputs">
              Y<input id="world-y-{{VOLID}}" class="control-inputs">
              Z<input id="world-z-{{VOLID}}" class="control-inputs">
            </div>

            <hr/>

            <div id="color-map-{{VOLID}}">
              <span data-t="Color Map" class="control-heading" id="color-map-heading-{{VOLID}}">
                {/literal}
                   {$color_map}
                {literal}
              </span>
            </div>

            <hr/>

            <div class="threshold-div" data-volume-id="{{VOLID}}">
              <div class="control-heading" data-t="Threshold">
               {/literal}
                 {$threshold}
               {literal}
              </div>
              <div class="thresh-inputs">
                <input id="min-threshold-{{VOLID}}" class="control-inputs thresh-input-left" value="0"/>
                <input id="max-threshold-{{VOLID}}" class="control-inputs thresh-input-right" value="255"/>
              </div>
              <div class="slider volume-viewer-threshold clickable" id="threshold-slider-{{VOLID}}"></div>
            </div>

            <hr/>

            <div class="filename-additional-info" id="filename-additional-info-{{VOLID}}">
              <div class="control-heading" id="voxel-coordinates-heading-{{VOLID}}">
               {/literal}
                 {$voxel}
               {literal}
              </div>
              <div class="voxel-coords" data-volume-id="{{VOLID}}">
                X<input id="voxel-i-{{VOLID}}" class="control-inputs">
                Y<input id="voxel-j-{{VOLID}}" class="control-inputs">
                Z<input id="voxel-k-{{VOLID}}" class="control-inputs">
              </div>

              <hr/>

              <div id="intensity-value-div-{{VOLID}}">
                <span class="control-heading intensity-heading" data-volume-id="{{VOLID}}">
               {/literal}
                 {$intensity}
               {literal}:
                </span>
                <span id="intensity-value-{{VOLID}}" class="control-inputs intensity-value"></span>
              </div>

              <div id="time-{{VOLID}}" class="time-div" data-volume-id="{{VOLID}}" style="display:none">
                <span class="control-heading">Time:</span>
                <input class="control-inputs time-inputs" value="0" id="time-val-{{VOLID}}"/>
                <button class="btn btn-sm btn-primary play-btn" id="play-{{VOLID}}">
                  Play
                </button>
                <div class="slider volume-viewer-threshold" id="time-slider-{{VOLID}}"></div>
              </div>

              <div class="contrast-div" data-volume-id="{{VOLID}}">
                <span class="control-heading" id="contrast-heading{{VOLID}}">
               {/literal}
                 {$contrast}
               {literal}
                  <input class="control-inputs intensity-value" value="1.0" id="contrast-val" />
                </span>
                <div id="contrast-slider" class="slider volume-viewer-contrast"></div>
              </div>

              <div class="brightness-div" data-volume-id="{{VOLID}}">
                <span class="control-heading" id="brightness-heading{{VOLID}}">
               {/literal}
                 {$brightness}
               {literal}
                  <input class="control-inputs intensity-value" value="0" id="brightness-val" />
                </span>
                <div id="brightness-slider" class="slider volume-viewer-brightness"></div>
              </div>

              <hr/>

              <div id="slice-series-{{VOLID}}" class="slice-series-div" data-volume-id="{{VOLID}}">
                <div class="control-heading" id="slice-series-heading-{{VOLID}}">
              {/literal}
                 {$view_slices}
               {literal}
                </div>
                <div class="slice-series-buttons">
                  <span class="slice-series-button button btn btn-sm btn-primary"
                        data-axis="xspace">
               {/literal}
                 {$sagittal}
               {literal}
                  </span>
                  <span class="slice-series-button button btn btn-sm btn-primary"
                        data-axis="yspace">
               {/literal}
                 {$coronal}
               {literal}
                  </span>
                  <span class="slice-series-button button btn btn-sm btn-primary"
                        data-axis="zspace">
               {/literal}
                 {$transverse}
               {literal}
                  </span>
                </div>
              </div>
            </div>
            <!--closing filename-additional-info -->
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="volume-viewer-display"></div>
</div>
</script>
{/literal}

<div id="brainbrowserPage">
  {* React component is inserted here *}
</div>

<script>
  ReactDOM.createRoot(
    document.getElementById('brainbrowserPage')
  ).render(RBrainBrowser());
</script>

