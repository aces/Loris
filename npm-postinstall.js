const fs = require('fs');
const path = require('path');
const cp = require('child_process');

/**
 * Check if the path provided is a module and has an override
 * in project. If so, returns the override path
 *
 * @param {string} p
 * @return {string}
 */
const getPath = (p) => {
  const pathParts = p.split(path.sep);

  if (
    pathParts[0] === 'modules' &&
    fs.existsSync(path.join(__dirname, 'project', 'modules', pathParts[1]))
  ) {
    return path.join('project', p);
  }

  return p;
};

/*
 * ----------------------------------------
 * Install npm packages in LORIS submodules
 * ----------------------------------------
 */
const eegVisualization =
  'modules/electrophysiology_browser/jsx/react-series-data-viewer';
const submodules = [
  'project',
  eegVisualization,
];

submodules.forEach((submodule) => {
  submodule = path.join(__dirname, getPath(submodule));

  // ensure submodule has package.json
  if (!fs.existsSync(path.join(submodule, 'package.json'))) return;

  // install folder
  console.info(
    '\n ----- \n >> Installing packages in '
    + submodule
    + '\n -----'
  );

  let installMode = 'ci';
  // ensure submodule has package-lock.json
  if (!fs.existsSync(path.join(submodule, 'package-lock.json'))) {
    installMode = 'i';
  }

  cp.spawnSync(
    'npm',
    [installMode],
    {
      env: process.env,
      cwd: submodule,
      stdio: 'inherit',
    }
  );
});

/*
 * ------------------------------------------------------------
 * Check if useEEGBrowserVisualizationComponents is set to TRUE
 * If so, compile the protobuf file to enable the components to load
 * ------------------------------------------------------------
 */
const getConfig = cp.spawn('php', [
  'tools/get_config.php',
  'useEEGBrowserVisualizationComponents',
], {});

let EEGVisEnabled = false;
getConfig.stdout.on('data', (data) => {
  try {
    EEGVisEnabled = JSON.parse(data);
  } catch (e) {
    console.warn(
      '\x1b[33m',
      'WARNING: Unable to fetch DB config',
      'useEEGBrowserVisualizationComponents',
      '\x1b[0m',
    );
  }

  if (EEGVisEnabled === 'true' || EEGVisEnabled === '1') {
    console.info('\n ----- \n >> '
      + 'EEG Browser visualization components enabled '
      + '\n -----'
    );

    const eegVizSubmodule = path.join(__dirname, getPath(eegVisualization));

    const protoc = cp.spawn(
      'protoc',
      [
        'protocol-buffers/chunk.proto',
        '--js_out=import_style=commonjs,binary:./src/',
      ],
      {
        env: process.env,
        cwd: eegVizSubmodule,
        stdio: 'inherit',
      }
    );

    protoc.on('error', (error) => {
      console.error(
        '\x1b[31m',
        'ERROR: Make sure that protoc',
        '(https://github.com/protocolbuffers/protobuf/releases/)',
        'is installed on your system',
        '\x1b[0m',
      );
      console.error(error);
    });
  }
});

getConfig.on('error', (error) => {
    console.error(error);
});
