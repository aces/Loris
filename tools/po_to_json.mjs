import {readFile, writeFile} from 'node:fs/promises';
import {basename, dirname} from 'node:path';
import {gettextToI18next} from 'i18next-conv';

const [source, target] = process.argv.slice(2);
const catalog = await readFile(source);
const language = basename(dirname(dirname(source)));
const options = {compatibilityJSON: 'v4'};
const [legacy, current] = await Promise.all([
  gettextToI18next('UNUSED', catalog, options),
  gettextToI18next(language, catalog, options),
]);

await writeFile(target, JSON.stringify({
  ...JSON.parse(legacy),
  ...JSON.parse(current),
}, null, 4));
