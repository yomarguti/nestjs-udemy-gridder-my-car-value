const dbConfig = {
  synchronize: false,
};

console.log('ormconfig file');

switch (process.env.NODE_ENV) {
  case 'development':
    Object.assign(dbConfig, {
      type: 'sqlite',
      database: 'db.sqlite',
      entities: ['**/*.entity.js'],
    });
    break;
  case 'test':
    Object.assign(dbConfig, {
      type: 'sqlite',
      database: 'test.db.sqlite',
      entities: ['**/*.entity.ts'],
    });
    break;
  case 'production':
    break;

  default:
    throw new Error('Unknown environment');
}
