{literal}
<script id="overlay-ui-template" type="x-volume-ui-template">
    <div class="overlay-viewer-display" id="panel-size">
    </div>
    <div class="volume-viewer-controls volume-controls">
        <div class="filename">Overlay</div>
        <div class="coords">
            <div class="control-heading" id="world-coordinates-heading-{{VOLID}}">
                World Coordinates 
            </div>
            <div class="world-coords" data-volume-id="{{VOLID}}">
                X<input id="world-x-{{VOLID}}" class="control-inputs">
                Y<input id="world-y-{{VOLID}}" class="control-inputs">
                Z<input id="world-z-{{VOLID}}" class="control-inputs">
            </div>
            <div class="control-heading" id="voxel-coordinates-heading-{{VOLID}}">
                Voxel Coordinates 
            </div>
            <div class="voxel-coords" data-volume-id="{{VOLID}}">
                X<input id="voxel-x-{{VOLID}}" class="control-inputs">
                Y<input id="voxel-y-{{VOLID}}" class="control-inputs">
                Z<input id="voxel-z-{{VOLID}}" class="control-inputs">
            </div>
        </div>
        <div class="blend-div" data-volume-id="{{VOLID}}">
            <span class="control-heading" id="blend-heading{{VOLID}}">Blend (0.0 to 1.0)</span>
            <input class="control-inputs blend-inputs" value="0.5" id="blend-val"/>
            <div id="blend-slider" class="slider volume-viewer-blend"></div>
        </div>
    </div>
</script>

<script id="volume-ui-template4d" type="x-volume-ui-template">
    <div class="volume-viewer-display">
    </div>
    <div class="volume-viewer-controls volume-controls">
        <div class="filename" id="filename-{{VOLID}}"></div>
        <div class="coords">
            <div class="control-heading" id="world-coordinates-heading-{{VOLID}}">
                World Coordinates 
            </div>
            <div class="world-coords" data-volume-id="{{VOLID}}">
                X<input id="world-x-{{VOLID}}" class="control-inputs">
                Y<input id="world-y-{{VOLID}}" class="control-inputs">
                Z<input id="world-z-{{VOLID}}" class="control-inputs">
            </div>
            <div class="control-heading" id="voxel-coordinates-heading-{{VOLID}}">
                Voxel Coordinates
            </div>
            <div class="voxel-coords" data-volume-id="{{VOLID}}">
                X<input id="voxel-x-{{VOLID}}" class="control-inputs">
                Y<input id="voxel-y-{{VOLID}}" class="control-inputs">
                Z<input id="voxel-z-{{VOLID}}" class="control-inputs">
            </div>
        </div>
        <div id="intensity-value-div-{{VOLID}}">
            <span class="control-heading" data-volume-id="{{VOLID}}">
               Value:
            </span>
            <span id="intensity-value-{{VOLID}}" class="intensity-value"></span>
        </div>
        <div id="color-map-{{VOLID}}">
            <span class="control-heading" id="color-map-heading-{{VOLID}}">
                Color Map 
            </span>
        </div>
        <div class="threshold-div" data-volume-id="{{VOLID}}">
            <div class="control-heading">
                Threshold
            </div>
            <div class="thresh-inputs">
                <input id="min-threshold-{{VOLID}}" class="control-inputs thresh-input-left" value="0"/>
                <input id="max-threshold-{{VOLID}}" class="control-inputs thresh-input-right" value="255"/>
            </div> 
            <div class="slider volume-viewer-threshold" id="threshold-slider-{{VOLID}}"></div>
        </div>
        <div id="time-{{VOLID}}" class="time-div" data-volume-id="{{VOLID}}" style="display: none">
            <span class="control-heading">Time</span>
            <input class="control-inputs time-inputs" value="0" id="time-val-{{VOLID}}"/>
            <div class="slider volume-viewer-threshold" id="threshold-time-slider-{{VOLID}}"></div>
            <input type="checkbox" class="button" id="play-{{VOLID}}"><label for="play-{{VOLID}}">Play</label>
        </div>
        <div id="slice-series-{{VOLID}}" class="slice-series-div" data-volume-id="{{VOLID}}">
            <div class="control-heading" id="slice-series-heading-{{VOLID}}">View slices</div>
            <span class="slice-series-button button" data-axis="xspace">Sagittal</span>
            <span class="slice-series-button button" data-axis="yspace">Coronal</span>
            <span class="slice-series-button button" data-axis="zspace">Transverse</span>
        </div>
    </div>
</script>

<div id="loading" style="display: none; color: #064785; font-size: 20px">Loading...</div>
<div id="brainbrowser-wrapper" style="display: none">
    <div id="global-controls">
    <span id="sync-volumes-wrapper">
        <input type="checkbox" class="button ui-helper-hidden-accessible" id="sync-volumes"><label for="sync-volumes" id="sync-volumes">Sync Volumes</label>
    </span>
    <span class="control-heading"> Set panel size:</span>
    <select id="panel-size">
        <option value="256" SELECTED>default</option>
        <option value="350">large</option>
        <option value="450">extra-large</option>
    </select>
    </div>
    <div id="brainbrowser"></div>
</div>
<script type="text/javascript" src="GetJS.php?Module=brainbrowser&file=jquery.mousewheel.min.js"></script>
<script type="text/javascript" src="GetJS.php?Module=brainbrowser&file=three.min.js"></script>
<script type="text/javascript" src="GetJS.php?Module=brainbrowser&file=brainbrowser.volume-viewer.min.js"></script>
<!--script type="text/javascript" src="js/brainbrowser.volume-viewer.ui-controls.min.js"></script-->
<script type="text/javascript" src="GetJS.php?Module=brainbrowser&file=brainbrowser.config.js"></script>
<script type="text/javascript" src="GetJS.php?Module=brainbrowser&file=brainbrowser.loris.js"></script>
{/literal}
