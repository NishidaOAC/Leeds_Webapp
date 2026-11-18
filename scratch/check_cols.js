const path = require('path');
const { Sequelize } = require(path.resolve(__dirname, '../Backend/invoice-service/node_modules/sequelize'));
require(path.resolve(__dirname, '../Backend/invoice-service/node_modules/dotenv')).config({ path: path.resolve(__dirname, '../Backend/invoice-service/.env') });

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: 'postgres',
  logging: false
});

(async () => {
  try {
    const [rows] = await sequelize.query('SELECT * FROM "company" LIMIT 10;');
    console.log('Sample company rows:', JSON.stringify(rows, null, 2));
    await sequelize.close();
  } catch(e) {
    console.error('Error detail:', e.message);
  }
})();
