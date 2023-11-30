/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-var-requires */
const { DataSourceOptions } = require('typeorm');

/**
 *
 * @returns {DataSourceOptions}
 */
module.exports = () => ({
  type: 'postgres',
  database: process.env.DB_NAME ?? 'temp',
  host: process.env.DB_HOST ?? 'localhost',
  username: process.env.DB_USERNAME ?? 'postgres',
  password: process.env.DB_PASSWORD ?? '12345678',
});
