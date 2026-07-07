const app = require('./app');
const config = require('./config/app.config');

app.listen(config.port, () => {
  console.log(`Karix middleware running on http://localhost:${config.port}`);
});
