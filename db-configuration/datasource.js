/* eslint-disable @typescript-eslint/no-var-requires */
const datasourceOptions = require('./core.config')();
const { join } = require('path');
const { entities } = require('./entity.config');
const { DataSource } = require('typeorm');

const dataSource = new DataSource({
  ...datasourceOptions,
  entities,
  logging: 'all',
  synchronize: false,
  migrations: [join(process.cwd(), 'db-configuration', 'migrations', '*.js')],
});

module.exports = { dataSource };
