import { Sequelize, SequelizeOptions } from 'sequelize-typescript';
import { User } from 'src/model/user.entity';
export const databaseProvider = {
  provide: 'SEQUELIZE',
  useFactory: async () => {
    const sequelize = new Sequelize({
      dialect:
        (process.env.DB_DIALECT as SequelizeOptions['dialect']) || 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      pool: {
        max: parseInt(process.env.DB_POOL_MAX),
        min: parseInt(process.env.DB_POOL_MIN),
        idle: parseInt(process.env.DB_POOL_IDLE),
        acquire: parseInt(process.env.DB_POOL_ACQUIRE),
        evict: parseInt(process.env.DB_POOL_EVICT),
      },
      dialectOptions: {
        connectTimeout: 60000,
      },
    });
    sequelize.addModels([User]);
    await sequelize.sync();
    return sequelize;
  },
};
