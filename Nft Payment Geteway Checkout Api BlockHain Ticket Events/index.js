if(process.env.NODE_ENV !== 'production'){
  require("dotenv").config()
}
require('./database');
const server = require('./app.js');
const port= process.env.PORT || 8001

// Syncing all the models at once.

  server.listen(port, () => {
    console.log(`Running server: port ${port}:`); // eslint-disable-line no-console
  });

