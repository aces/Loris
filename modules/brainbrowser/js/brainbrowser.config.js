/* 
 * Copyright (C) 2011 McGill University
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 *   the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

///////////////////////////////////////////////////////////////////////////
//
// This is a sample configuration file for brainbrowser
// Modify it to match the congiguration of your installation.
//
// Options include:
// suface_viewer: options for Surface Viewer
//   - filetypes: options for supported model file types
//     Each file type can define the following:
//     - worker: url of the web worker used to parse the file.
//     - format_hint: html to be displayed to aid the user when 
//       uploading that type of file
//   - data: options for parsing color data files
//     - worker: url of the web worker used to parse the file.
// 
// volume_viewer:
//   - color_maps: an array of color scale definitions
//     - name: name to be display for the color scale in the UI
//     - url: url of the color scale file
//     - crosshair_color: color of the crosshair to be used when 
//       the color scale is active.
//
///////////////////////////////////////////////////////////////////////////


(function() {
  "use strict";
  
  // REQUIRED (for surface viewer) 
  BrainBrowser.config.set("worker_dir", "js/brainbrowser/workers/");

  // Custom configuration for the Surface Viewer demo app.
  BrainBrowser.config.set("model_types.freesurferasc.format_hint", 'You can use <a href="http://surfer.nmr.mgh.harvard.edu/fswiki/mris_convert" target="_blank">mris_convert</a> to convert your binary surface files into .asc format.');
  BrainBrowser.config.set("intensity_data_types.freesurferasc.format_hint", 'You can use <a href="http://surfer.nmr.mgh.harvard.edu/fswiki/mris_convert" target="_blank">mris_convert</a> to convert your binary surface files into .asc format.');

  // Color maps
  BrainBrowser.config.set("color_maps", [
    {
      name: "Gray",
      url: loris.BaseURL + "/brainbrowser/static/color_maps/gray_scale.txt",
      cursor_color: "#FF0000"
    },
    {
      name: "Spectral",
      url: loris.BaseURL + "/brainbrowser/static/color_maps/spectral.txt",
      cursor_color: "#FFFFFF"
    },
    {
      name: "Thermal",
      url: loris.BaseURL + "/brainbrowser/static/color_maps/thermal.txt",
      cursor_color: "#FFFFFF"
    },
    {
      name: "Blue",
      url: loris.BaseURL + "/brainbrowser/static/color_maps/blue.txt",
      cursor_color: "#FFFFFF"
    },
    {
      name: "Green",
      url: loris.BaseURL + "/brainbrowser/static/color_maps/green.txt",
      cursor_color: "#FF0000"
    }
  ]);
})();


