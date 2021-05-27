// 'use strict';

// // 3rd Party Resources
// const express = require('express');
// const cors = require('cors');
// const morgan = require('morgan');

// // Esoteric Resources
// const errorHandler = require('./error-handlers/500.js');
// const notFound = require('./error-handlers/404.js');
// const authRoutes = require('./auth/routes.js');

// // Prepare the express app
// const app = express();

// // App Level MW
// app.use(cors());
// app.use(morgan('dev'));

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // Routes
// app.use(authRoutes);

// // Catchalls
// app.use(notFound);
// app.use(errorHandler);

// module.exports = {
//   server: app,
//   start: (port) => {
//     app.listen(port, () => {
//       console.log(`Server Up on ${port}`);
//     });
//   },
// };

'use strict';

// 3rd Party Resources
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

// Esoteric Resources
const errorHandler = require('./error-handlers/500.js');
const notFound = require('./error-handlers/404.js.js');
const authRoutes = require('./auth/routes.js.js');

// Prepare the express app
const app = express();

// App Level MW
app.use(cors());
app.use(morgan('dev'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', home);

function home(req,res){
  res.send('welcome to server.js');
}
// Routes
app.use('/',authRoutes);//***doesn't have '/' */

// Catchalls
app.use('*', notFound);//**doesn't have '*' */
app.use(errorHandler);

module.exports = {
  server: app,
  startup: (port) => {
    app.listen(port, () => {
      console.log(`Server Up on ${port}`);
    });
  },
};
