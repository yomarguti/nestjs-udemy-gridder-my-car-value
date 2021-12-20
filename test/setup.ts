import { rm } from 'fs/promises';
import { join } from 'path';
import { getConnection } from 'typeorm';

global.beforeEach(async () => {
  try {
    await rm(join(__dirname, '..', 'test.db.sqlite'));
  } catch (error) {}
});

global.afterEach(async () => {
  const connection = getConnection();
  await connection.close();
});
