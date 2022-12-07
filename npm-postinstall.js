const fs = require('fs');
const path = require('path');
const cp = require('child_process');

const submodules = [
  'project',
  'modules/electrophysiology_browser/jsx/react-series-data-viewer',
];

submodules.forEach((submodule) => {
  // Check if the submodule is in modules/, and has an override
  const submodulePath = submodule.split(path.sep);

  if (
    submodulePath[0] === 'modules' &&
    fs.existsSync(path.join(__dirname, 'project', 'modules', submodulePath[1]))
  ) {
    submodule = path.join('project', submodule);
  }

  submodule = path.join(__dirname, submodule);

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

