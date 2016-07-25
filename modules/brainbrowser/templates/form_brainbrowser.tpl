{literal}
<!--
  Not currently used
-->
<script id="overlay-ui-template" type="x-volume-ui-template">
<div class="row">
  <div class="overlay-viewer-display" id="panel-size"></div>
  <div class="form-group col-sm-3 col-xs-12">
    <div class="panel panel-default">
      <div class="panel-heading">
        <div class="filename"></div>
        <h3 class="panel-title filename">Overlay</h3>
      </div>
    </div>

    <div class="volume-viewer-controls volume-controls">
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
        <div class="coords">
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
</script>

<!--
  Template used to display UI for brain volume viewer
  Once variables are populated template is inserted in #brainbrowser div
-->
<script id="volume-ui-template4d" type="x-volume-ui-template">
<div class="row">
  <div class="col-xs-12 col-sm-12 col-md-7 col-md-push-5 col-lg-8 col-lg-push-4">
    <div class="volume-viewer-display"></div>
  </div>
  <div class="col-xs-12 col-sm-12 col-md-5 col-md-pull-7 col-lg-4 col-lg-pull-8">
    <div class="panel panel-default" id="subpanel-filename-{{VOLID}}">
      <div class="panel-heading" id="mri-panel-filename-{{VOLID}}">
        <div class="filename clickable" id="filename-{{VOLID}}">
          Loading filename....
        </div>
        <span class="arrow glyphicon glyphicon-chevron-down clickable"></span>
      </div>
      <div class="panel-body">
        <div class="volume-viewer-controls volume-controls">
          <div class="coords">
            <div class="control-heading" id="world-coordinates-heading-{{VOLID}}">
              World Coordinates
            </div>
            <div class="world-coords" data-volume-id="{{VOLID}}">
              X<input id="world-x-{{VOLID}}" class="control-inputs">
              Y<input id="world-y-{{VOLID}}" class="control-inputs">
              Z<input id="world-z-{{VOLID}}" class="control-inputs">
            </div>

            <hr/>

            <div id="color-map-{{VOLID}}">
              <span class="control-heading" id="color-map-heading-{{VOLID}}">
                  Color Map
              </span>
            </div>

            <hr/>

            <div class="threshold-div" data-volume-id="{{VOLID}}">
              <div class="control-heading">
                Threshold
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
                Voxel Coordinates
              </div>
              <div class="voxel-coords" data-volume-id="{{VOLID}}">
                X<input id="voxel-i-{{VOLID}}" class="control-inputs">
                Y<input id="voxel-j-{{VOLID}}" class="control-inputs">
                Z<input id="voxel-k-{{VOLID}}" class="control-inputs">
              </div>

              <hr/>

              <div id="intensity-value-div-{{VOLID}}">
                <span class="control-heading intensity-heading" data-volume-id="{{VOLID}}">
                  Intensity Value:
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
                <span class="control-heading" id="contrast-heading{{VOLID}}">Contrast (0.0 to 2.0):
                  <input class="control-inputs intensity-value" value="1.0" id="contrast-val" />
                </span>
                <div id="contrast-slider" class="slider volume-viewer-contrast"></div>
              </div>

              <div class="brightness-div" data-volume-id="{{VOLID}}">
                <span class="control-heading" id="brightness-heading{{VOLID}}">
                  Brightness (-1 to 1):
                  <input class="control-inputs intensity-value" value="0" id="brightness-val" />
                </span>
                <div id="brightness-slider" class="slider volume-viewer-brightness"></div>
              </div>

              <hr/>

              <div id="slice-series-{{VOLID}}" class="slice-series-div" data-volume-id="{{VOLID}}">
                <div class="control-heading" id="slice-series-heading-{{VOLID}}">
                  View Slices
                </div>
                <div class="slice-series-buttons">
                  <span class="slice-series-button button btn btn-sm btn-primary"
                        data-axis="xspace">Sagittal</span>
                  <span class="slice-series-button button btn btn-sm btn-primary"
                        data-axis="yspace">Coronal</span>
                  <span class="slice-series-button button btn btn-sm btn-primary"
                        data-axis="zspace">Transverse</span>
                </div>
              </div>
            </div>
            <!--closing filename-additional-info -->
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</script>
{/literal}

<div id="brainbrowser-wrapper" class="brainbrowser-wrapper">
    <div id="global-controls" class="clearfix">
        <span id="sync-volumes-wrapper" class="clickable">
            <input type="checkbox" class="button ui-helper-hidden-accessible" id="sync-volumes">
            <label for="sync-volumes" id="sync-volumes" class="clickable btn btn-sm btn-primary">Sync Volumes</label>
        </span>

        <span id="reset-wrapper" class="clickable">
            <input type="button" class="button ui-helper-hidden-accessible" id="reset-view">
            <label for="reset-view" id="reset-view" class="clickable btn btn-sm btn-primary">Reset View</label>
        </span>

        <div class="btn-group">
            <select id="panel-size" class="form-control panel-size clickable">
                <option value="256" selected>Choose Panel Size</option>
                <option value="-1">Auto</option>
                <option value="100">100 Pixels</option>
                <option value="200">200 Pixels</option>
                <option value="256">256 Pixels (Default)</option>
                <option value="300">300 Pixels</option>
                <option value="400">400 Pixels</option>
                <option value="500">500 Pixels</option>
                <option value="600">600 Pixels</option>
                <option value="700">700 Pixels</option>
                <option value="800">800 Pixels</option>
                <option value="900">900 Pixels</option>
                <option value="1000">1000 Pixels</option>
            </select>
        </div>
    </div>
</div>

<div id="brainbrowser" class="brainbrowser"></div>

<div id="loading" class="loading-message">Loading...</div>

