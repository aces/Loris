/* global BrainBrowser */

/**
 *
 * @param variable
 */
function getQueryVariable(variable) {
  'use strict';
  let query = window.location.search.substring(1);
  let vars = query.split('&');
  let i;
  let pair;
  for (i = 0; i < vars.length; i += 1) {
    pair = vars[i].split('=');
    if (pair[0] === variable) {
        return unescape(pair[1]);
    }
  }
}


// This script is meant to be a demonstration of how to
// use most of the functionality available in the
// BrainBrowser Volume Viewer.
$(function() {
  'use strict';

  $('.button').button();

  // ///////////////////////////////////
  // Start running the Volume Viewer
  // ///////////////////////////////////
  window.viewer =
  BrainBrowser.VolumeViewer.start('brainbrowser', function(viewer) {
    let loadingDiv = $('#loading');
    let mincIDs;
    let fileUrls;
    let mincVolumes = [];
    let mincFilenames = [];
    let bboptions = {};

    // /////////////////////////
    // Set up global UI hooks.
    // /////////////////////////

    // Change viewer panel canvas size.
    $('#panel-size').on('change', function() {
      let size = parseInt($(this).val(), 10);
      if (size < 0) {
        viewer.setAutoResize(true, 'volume-controls');
        viewer.doAutoResize();
      } else {
        viewer.setAutoResize(false, 'volume-controls');
        viewer.setPanelSize(size, size, {scale_image: true});
      }
    });

    // Should cursors in all panels be synchronized?
    let isChecked = false;
    $('#sync-volumes').on('click', function() {
      isChecked = !isChecked;
      $(this).toggleClass('isChecked');
      viewer.synced = isChecked;
    });

    // Reset button
    $('#reset-view').on('click', function() {
      viewer.resetDisplays();
      viewer.redrawVolumes();
    });

    // This will create an image of all the display panels
    // currently being shown in the viewer.
    $('#screenshot').on('click', function() {
      let width = 0;
      let height = 0;
      let activePanel = viewer.active_panel;

      // Create a canvas on which we'll draw the images.
      let canvas = document.createElement('canvas');
      let context = canvas.getContext('2d');
      let img = new Image();

      viewer.volumes.forEach(function(volume) {
        volume.display.forEach(function(panel) {
          width = Math.max(width, panel.canvas.width);
          height = Math.max(height, panel.canvas.height);
        });
      });

      canvas.width = width * viewer.volumes.length;
      canvas.height = height * 3;
      context.fillStyle = '#000000';
      context.fillRect(0, 0, canvas.width, canvas.height);

      // The active canvas is highlighted by the viewer,
      // so we set it to null and redraw the highlighting
      // isn't shown in the image.
      if (activePanel) {
        activePanel.updated = true;
        viewer.active_panel = null;
        viewer.draw();
      }

      viewer.volumes.forEach(function(volume, x) {
        volume.display.forEach(function(panel, axisName, y) {
          context.drawImage(panel.canvas, x * width, y * height);
        });
      });

      // Restore the active canvas.
      if (activePanel) {
        activePanel.updated = true;
        viewer.active_panel = activePanel;
        viewer.draw();
      }

      // Show the created image in a dialog box.
      img.onload = function() {
        $('<div></div>').append(img).dialog({
          title: 'Slices',
          height: img.height,
          width: img.width,
        });
      };

      img.src = canvas.toDataURL();
    });

    $(document).on('keypress', function(e) {
      if (e.keyCode === 114) {
        // Reset displays if user presses 'r' key.
        viewer.resetDisplays();
        viewer.redrawVolumes();
      }
    });

    /**
     * @name viewer.setAutoResize
     * @param {boolean} flag Whether we should auto-resize the views.
     * @param {string} className The name of the class associated with volume
     * controls.
     * @description
     * Enable or disable auto-resizing mode.
     * ```js
     * viewer.setAutoResize(true, 'volume-controls');
     * ```
     */
    viewer.setAutoResize = function(flag, className) {
      viewer.auto_resize = flag;
      viewer.volume_control_class = className;
    };

    /**
     * @name viewer.doAutoResize
     * @description
     * This function implements auto-resizing of the volume panels
     * when the window itself is resized. It should therefore be invoked
     * as part of a window resize notification.
     */
    viewer.doAutoResize = function() {
      if (!viewer.auto_resize) {
        return;
      }

      /**
       *
       * @param className
       * @param propName
       */
      function getIntProperty(className, propName) {
        return parseInt($(className).css(propName).replace('px', ''), 10);
      }

      /* Assumes at least three views or three volumes across.
       */
      let n = Math.max(viewer.volumes.length, 3);
      let ml = getIntProperty('.slice-display', 'margin-left');
      let mr = getIntProperty('.slice-display', 'margin-right');
      let vv = getIntProperty('.volume-viewer-display', 'width');

      // Divide panel container size (.volume-viewer-display) by
      // number of panels and subtract the margins for each panel.
      // Note: (Subtract 1, because float widths are rounded up by jQuery)
      let size = ((vv - 1) / n) - (ml + mr);

      viewer.setDefaultPanelSize(size, size);
      viewer.setPanelSize(size, size, {scale_image: true});
    };

    window.addEventListener('resize', viewer.doAutoResize, false);

    // ////////////////////////////////
    // Per volume UI hooks go in here.
    // ////////////////////////////////
    viewer.addEventListener('volumeuiloaded', function(event) {
      let container = event.container;
      let volume = event.volume;
      let volID = event.volume_id;

      container = $(container);

      container.find('.button').button();

      // The world coordinate input fields.
      container.find('.world-coords').change(function() {
        let div = $(this);

        let x = parseFloat(div.find('#world-x-' + volID).val());
        let y = parseFloat(div.find('#world-y-' + volID).val());
        let z = parseFloat(div.find('#world-z-' + volID).val());

        // Make sure the values are numeric.
        if (!BrainBrowser.utils.isNumeric(x)) {
          x = 0;
        }
        if (!BrainBrowser.utils.isNumeric(y)) {
          y = 0;
        }
        if (!BrainBrowser.utils.isNumeric(z)) {
          z = 0;
        }

        // Set coordinates and redraw.
        if (viewer.synced) {
          viewer.volumes.forEach(function(volume) {
            volume.setWorldCoords(x, y, z);
          });
        } else {
          viewer.volumes[volID].setWorldCoords(x, y, z);
        }

        viewer.redrawVolumes();
      });

      // The world coordinate input fields.
      container.find('.voxel-coords').change(function() {
        let div = $(this);

        let i = parseInt(div.find('#voxel-i-' + volID).val(), 10);
        let j = parseInt(div.find('#voxel-j-' + volID).val(), 10);
        let k = parseInt(div.find('#voxel-k-' + volID).val(), 10);

        // Make sure the values are numeric.
        if (!BrainBrowser.utils.isNumeric(i)) {
          i = 0;
        }
        if (!BrainBrowser.utils.isNumeric(j)) {
          j = 0;
        }
        if (!BrainBrowser.utils.isNumeric(k)) {
          k = 0;
        }

        // Set coordinates and redraw.
        viewer.volumes[volID].setVoxelCoords(i, j, k);
        if (viewer.synced) {
          let syncedVolume = viewer.volumes[volID];
          let wc = syncedVolume.getWorldCoords();
          viewer.volumes.forEach(function(volume) {
            if (syncedVolume !== volume) {
              volume.setWorldCoords(wc.x, wc.y, wc.z);
            }
          });
        }

        viewer.redrawVolumes();
      });

      // Color map URLs are read from the config file and added to the
      // color map select box.
      let colorMapSelect = $(
        '<select id="color-map-select" class="form-control input-sm"></select>'
      ).on('change', function() {
        let selection = $(this).find(':selected');

        viewer.loadVolumeColorMapFromURL(
          volID,
          selection.val(),
          selection.data('cursor-color'),
          function() {
            viewer.redrawVolumes();
          }
        );
      });

      BrainBrowser.config.get('color_maps').forEach(function(colorMap) {
        colorMapSelect.append('<option value="' + colorMap.url +
          '" data-cursor-color="' + colorMap.cursor_color + '">' +
          colorMap.name +'</option>'
        );
      });

      $('#color-map-' + volID).append(colorMapSelect);

      // Load a color map select by the user.
      container.find('.color-map-file').change(function() {
        viewer.loadVolumeColorMapFromFile(volID, this, '#FF0000', function() {
          viewer.redrawVolumes();
        });
      });

      // Change the range of intensities that will be displayed.
      container.find('.threshold-div').each(function() {
        let div = $(this);

        // Input fields to input min and max thresholds directly.
        let minInput = div.find('#min-threshold-' + volID);
        let maxInput = div.find('#max-threshold-' + volID);

        // Slider to modify min and max thresholds.
        let slider = div.find('.slider');

        let volume = viewer.volumes[volID];

        // Update the input fields.
        minInput.val(volume.getVoxelMin());
        maxInput.val(volume.getVoxelMax());

        slider.slider({
          range: true,
          min: volume.getVoxelMin(),
          max: volume.getVoxelMax(),
          values: [volume.getVoxelMin(), volume.getVoxelMax()],
          step: 1,
          slide: function(event, ui) {
            let values = ui.values;

            // Update the input fields.
            minInput.val(values[0]);
            maxInput.val(values[1]);

            // Update the volume and redraw.
            volume.intensity_min = values[0];
            volume.intensity_max = values[1];
            viewer.redrawVolumes();
          },
          stop: function() {
            $(this).find('a').trigger('blur');
          },
        });

        // Input field for minimum threshold.
        minInput.change(function() {
          let value = parseFloat(this.value);

          // Make sure input is numeric and in range.
          if (!BrainBrowser.utils.isNumeric(value)) {
            value = volume.getVoxelMin();
          }
          value = Math.max(volume.getVoxelMin(),
                           Math.min(value, volume.getVoxelMax()));
          this.value = value;

          // Update the slider.
          slider.slider('values', 0, value);

          // Update the volume and redraw.
          volume.intensity_min = value;
          viewer.redrawVolumes();
        });

        maxInput.change(function() {
          let value = parseFloat(this.value);

          // Make sure input is numeric and in range.
          if (!BrainBrowser.utils.isNumeric(value)) {
            value = volume.getVoxelMax();
          }
          value = Math.max(volume.getVoxelMin(),
                           Math.min(value, volume.getVoxelMax()));
          this.value = value;

          // Update the slider.
          slider.slider('values', 1, value);

          // Update the volume and redraw.
          volume.intensity_max = value;
          viewer.redrawVolumes();
        });
      });

      container.find('.time-div').each(function() {
        let div = $(this);

        if (volume.header.time) {
          div.show();
        } else {
          return;
        }

        let slider = div.find('.slider');
        let timeInput = div.find('#time-val-' + volID);
        let playButton = div.find('#play-' + volID);
        let isPlaying = false;

        let min = 0;
        let max = volume.header.time.space_length - 1;
        let playInterval;

        slider.slider({
          min: min,
          max: max,
          value: 0,
          step: 1,
          slide: function(event, ui) {
            let value = +ui.value;
            timeInput.val(value);
            volume.current_time = value;
            viewer.redrawVolumes();
          },
          stop: function() {
            $(this).find('a').trigger('blur');
          },
        });

        timeInput.change(function() {
          let value = parseInt(this.value, 10);
          if (!BrainBrowser.utils.isNumeric(value)) {
            value = 0;
          }

          value = Math.max(min, Math.min(value, max));

          this.value = value;
          timeInput.val(value);
          slider.slider('value', value);
          volume.current_time = value;
          viewer.redrawVolumes();
        });

        playButton.click(function() {
          if (!isPlaying) {
            clearInterval(playInterval);
            playInterval = setInterval(function() {
              let value = volume.current_time + 1;
              value = value > max ? 0 : value;
              volume.current_time = value;
              timeInput.val(value);
              slider.slider('value', value);
              viewer.redrawVolumes();
            }, 200);
            isPlaying = true;
            playButton.text('Pause');
          } else {
            clearInterval(playInterval);
            isPlaying = false;
            playButton.text('Play');
          }
        });
      });

      // Create an image of all slices in a certain
      // orientation.
      container.find('.slice-series-div').each(function() {
        let div = $(this);

        let spaceNames = {
          xspace: 'Sagittal',
          yspace: 'Coronal',
          zspace: 'Transverse',
        };

        div.find('.slice-series-button').click(function() {
          let axisName = $(this).data('axis');
          let axis = volume.header[axisName];
          let spaceLength = axis.space_length;
          let time = volume.current_time;
          let perColumn = 10;
          let zoom = 0.5;
          let i;
          let x;
          let y;

          // Canvas on which to draw the images.
          let canvas = document.createElement('canvas');
          let context = canvas.getContext('2d');

          // Get first slice to set dimensions of the canvas.
          let imageData = volume.getSliceImage(
            volume.slice(axisName, 0, time),
            zoom
          );
          let img = new Image();
          canvas.width = perColumn * imageData.width;
          canvas.height = Math.ceil(
            spaceLength / perColumn
          ) * imageData.height;
          context.fillStyle = '#000000';
          context.fillRect(0, 0, canvas.width, canvas.height);

          // Draw the slice on the canvas.
          context.putImageData(imageData, 0, 0);

          // Draw the rest of the slices on the canvas.
          for (i = 1; i < spaceLength; i++) {
            imageData = volume.getSliceImage(
              volume.slice(axisName, i, time),
              zoom
            );
            x = i % perColumn * imageData.width;
            y = Math.floor(i / perColumn) * imageData.height;
            context.putImageData(imageData, x, y);
          }

          // Retrieve image from canvas and display it
          // in a dialog box.
          img.onload = function() {
            $('<div></div>').append(img).dialog({
              title: spaceNames[axisName] + ' Slices',
              height: 600,
              width: img.width,
            });
          };

          img.src = canvas.toDataURL();
        });
      });

      // Blend controls for a multivolume overlay.
      container.find('.blend-div').each(function() {
        let div = $(this);
        let slider = div.find('.slider');
        let blendInput = div.find('#blend-val');

        // Slider to select blend value.
        slider.slider({
          min: 0,
          max: 1,
          step: 0.01,
          value: 0.5,
          slide: function(event, ui) {
            let value = parseFloat(ui.value);
            volume.blend_ratios[0] = 1 - value;
            volume.blend_ratios[1] = value;


            blendInput.val(value);
            viewer.redrawVolumes();
          },
          stop: function() {
            $(this).find('a').trigger('blur');
          },
        });

        // Input field to select blend values explicitly.
        blendInput.change(function() {
          let value = parseFloat(this.value);

          // Check that input is numeric and in range.
          if (!BrainBrowser.utils.isNumeric(value)) {
            value = 0;
          }
          value = Math.max(0, Math.min(value, 1));
          this.value = value;

          // Update slider and redraw volumes.
          slider.slider('value', value);
          volume.blend_ratios[0] = 1 - value;
          volume.blend_ratios[1] = value;
          viewer.redrawVolumes();
        });
      });

      const fileNameID = $('#filename-' + volID);
      const filename = mincFilenames[volID];
      fileNameID.html(filename);
      fileNameID.data('title', filename);
      fileNameID.tooltip();

      $('#filename-'+volID).on('click', function() {
               $('#filename-additional-info-'+volID).slideToggle('fast');
               let arrow = $(this).siblings('.arrow');
               if (arrow.hasClass('glyphicon-chevron-down')) {
                  arrow
                  .removeClass('glyphicon-chevron-down')
                  .addClass('glyphicon-chevron-up');
               } else {
                  arrow
                  .removeClass('glyphicon-chevron-up')
                  .addClass('glyphicon-chevron-down');
               }
       });
       $('.filename-overlay').on('click', function() {
               $('.filename-overlay-additional-info').slideToggle('fast');
               let arrow = $(this).siblings('.arrow');
               if (arrow.hasClass('glyphicon-chevron-down')) {
                  arrow
                  .removeClass('glyphicon-chevron-down')
                  .addClass('glyphicon-chevron-up');
               } else {
                  arrow
                  .removeClass('glyphicon-chevron-up')
                  .addClass('glyphicon-chevron-down');
               }
       });

        $('.arrow').on('click', function() {
              $('#filename-additional-info-'+volID).slideToggle('fast');
              if ($('.arrow').hasClass('glyphicon-chevron-down')) {
                $('.arrow')
                .removeClass('glyphicon-chevron-down')
                .addClass('glyphicon-chevron-up');
              } else {
                $('.arrow')
                .removeClass('glyphicon-chevron-up')
                .addClass('glyphicon-chevron-down');
              }
            });

      // Contrast controls
      container.find('.contrast-div').each(function() {
        let div = $(this);
        let slider = div.find('.slider');
        let contrastInput = div.find('#contrast-val');

        // Slider to select contrast value.
        slider.slider({
          min: 0,
          max: 2,
          step: 0.05,
          value: 1,
          slide: function(event, ui) {
            let value = parseFloat(ui.value);
            volume.display.setContrast(value);
            volume.display.refreshPanels();

            contrastInput.val(value);
          },
          stop: function() {
            $(this).find('a').trigger('blur');
          },
        });

        // Input field to select contrast values explicitly.
        contrastInput.change(function() {
          let value = parseFloat(this.value);

          // Check that input is numeric and in range.
          if (!BrainBrowser.utils.isNumeric(value)) {
            value = 0;
          }
          value = Math.max(0, Math.min(value, 2));
          this.value = value;

          // Update slider and redraw volumes.
          slider.slider('value', value);
          volume.display.setContrast(value);
          volume.display.refreshPanels();
          viewer.redrawVolumes();
        });
      });

      // Contrast controls
      container.find('.brightness-div').each(function() {
        let div = $(this);
        let slider = div.find('.slider');
        let brightnessInput = div.find('#brightness-val');

        // Slider to select brightness value.
        slider.slider({
          min: -1,
          max: 1,
          step: 0.05,
          value: 0,
          slide: function(event, ui) {
            let value = parseFloat(ui.value);
            volume.display.setBrightness(value);
            volume.display.refreshPanels();

            brightnessInput.val(value);
          },
          stop: function() {
            $(this).find('a').trigger('blur');
          },
        });

        // Input field to select brightness values explicitly.
        brightnessInput.change(function() {
          let value = parseFloat(this.value);

          // Check that input is numeric and in range.
          if (!BrainBrowser.utils.isNumeric(value)) {
            value = 0;
          }
          value = Math.max(-1, Math.min(value, 1));
          this.value = value;

          // Update slider and redraw volumes.
          slider.slider('value', value);
          volume.display.setBrightness(value);
          volume.display.refreshPanels();
          viewer.redrawVolumes();
        });
      });
    });

    /* This function simply takes an input hex background color
     * and returns either "black" or "white" as the appropriate
     * foreground color for text rendered over the background colour.
     * Idea from https://24ways.org/2010/calculating-color-contrast/
     * Equation is from http://www.w3.org/TR/AERT#color-contrast
     */
    /**
     *
     * @param hexcolor
     */
    function getContrastYIQ(hexcolor) {
      let r = parseInt(hexcolor.substr(0, 2), 16);
      let g = parseInt(hexcolor.substr(2, 2), 16);
      let b = parseInt(hexcolor.substr(4, 2), 16);
      let yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
      return (yiq >= 128) ? 'black' : 'white';
    }

    $('#brainbrowser-wrapper').slideDown({duration: 600});

    // ///////////////////////////////////////////////////
    // UI updates to be performed after each slice update.
    // ////////////////////////////////////////////////////
    viewer.addEventListener('sliceupdate', function(event) {
      let panel = event.target;
      let volume = event.volume;
      let volID = panel.volume_id;
      let worldCoords;
      let voxelCoords;
      let value;

      if (BrainBrowser.utils.isFunction(volume.getWorldCoords)) {
        worldCoords = volume.getWorldCoords();
        $('#world-x-' + volID).val(worldCoords.x.toPrecision(6));
        $('#world-y-' + volID).val(worldCoords.y.toPrecision(6));
        $('#world-z-' + volID).val(worldCoords.z.toPrecision(6));
      }

      if (BrainBrowser.utils.isFunction(volume.getVoxelCoords)) {
        voxelCoords = volume.getVoxelCoords();
        $('#voxel-i-' + volID).val(parseInt(voxelCoords.i, 10));
        $('#voxel-j-' + volID).val(parseInt(voxelCoords.j, 10));
        $('#voxel-k-' + volID).val(parseInt(voxelCoords.k, 10));
      }

      value = volume.getIntensityValue();

      /* Set background color of intensity value to match colormap
       * entry for that value.
       */
      let bgColor = volume.color_map.colorFromValue(value, {
        hex: true,
        min: volume.intensity_min,
        max: volume.intensity_max,
        contrast: panel.contrast,
        brightness: panel.brightness,
      });

      /* Given that the background color has a wide range, use a little
       * cleverness to pick either white or black as the foreground color
       * of the intensity value. This improves readability.
       */
      let fgColor = getContrastYIQ(bgColor);

      $('#intensity-value-' + volID)
      .css('background-color', '#' + bgColor)
      .css('color', fgColor)
      .html(Math.floor(value));

      if (volume.header && volume.header.time) {
        $('#time-slider-' + volID).slider(
          'option',
          'value',
          volume.current_time
        );
        $('#time-val-' + volID).val(volume.current_time);
      }
    }); // Should cursors in all panels be synchronized?

    mincIDs = getQueryVariable('minc_id') || [];
    fileUrls = getQueryVariable('file_url') || [];
    if (getQueryVariable('overlay') === 'true') {
      bboptions.overlay = {
        template: {
          element_id: 'overlay-ui-template',
          viewer_insert_class: 'overlay-viewer-display',
        },
      };
    }

    let colorMapConfig = BrainBrowser.config.get('color_maps')[0];

    loadingDiv.show();
    bboptions.complete = function() {
      loadingDiv.hide();
      // Trigger change event when page is loaded to auto-resize panels if necessary
      $('#panel-size').trigger('change');
    };

    // //////////////////////////////////////
    // Set the size of slice display panels.
    // //////////////////////////////////////

    // Use the size from dropdown as deafault size
    let panelSize = Number.parseInt($('#panel-size').val(), 10);

    // If not a real size, set to default value
    if (panelSize < 0) {
      panelSize = 300;
    }

    viewer.setDefaultPanelSize(panelSize, panelSize);

    fetch(
      'imageinfo?fileids=' + mincIDs + '&fileurls=' + fileUrls,
      {credentials: 'same-origin', method: 'GET'}
    )
    .then((resp) => resp.json())
    .then((data) => {
      for (const file of data) {
          let volume = {
              type: file.type,
              template: {
                  element_id: 'volume-ui-template4d',
                  viewer_insert_class: 'volume-viewer-display',
              },
          };
          if (file.type == 'nifti1') {
              volume.nii_url = file.URL;
          } else {
              volume.raw_data_url = file.URL;
          }

          mincVolumes.push(volume);
          mincFilenames.push(file.Filename);
      }
      bboptions.volumes = mincVolumes;

      // ////////////////////////////
      // Load the default color map and then call
      // render only after it's been loaded
      // ////////////////////////////
      viewer.loadDefaultColorMapFromURL(
        colorMapConfig.url,
        colorMapConfig.cursor_color,
        function() {
            // ///////////////////
            // Load the volumes.
            // ///////////////////
            viewer.render(); // start the rendering
            viewer.loadVolumes(bboptions); // load the volumes
        }
      );
    });

    return viewer;
  });

  BrainBrowser.events.addEventListener('error', function() {
    $('#loading').html(
      'Loading error' +
      '<p>Something went wrong while trying to render your files.</p>'
    );
  });
});
