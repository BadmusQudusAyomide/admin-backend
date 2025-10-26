require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
  console.log(`Admin backend listening on port ${PORT}`);
});
