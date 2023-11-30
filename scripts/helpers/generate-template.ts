import { createReadStream, createWriteStream, readdirSync } from 'fs';
import { join } from 'path';
import { pipeline } from 'stream';
import { map, split } from 'event-stream';

const paths = readdirSync(join(process.cwd(), 'entities-js')).filter((path) =>
  path.endsWith('.entity.js'),
);

const template = join(
  process.cwd(),
  'scripts',
  'templates',
  'entity-config.template.js',
);

const output = join(process.cwd(), 'db-configuration', 'entity.config.js');

const replacer = '__entities__';

function generateTemplateFile() {
  const readStream = createReadStream(template);
  const writeStream = createWriteStream(output);

  pipeline(
    readStream,
    split(),
    map((data: string, callback: (error?: Error, data?: string) => void) => {
      if (data.includes(replacer)) {
        data = data.replace(
          replacer,
          paths
            .map((path) => `require('../entities-js/${path}').default`)
            .toString(),
        );
      }
      callback(null, data + '\n');
    }),
    writeStream,
    (err) => {
      if (err) {
        console.error('Pipeline failed.', err);
      } else {
        console.log('Pipeline succeeded.');
      }
    },
  );
}

generateTemplateFile();
