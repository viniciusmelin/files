let db = require('./config/database')
let server = require('./config/server')(db)
require('./config/routes')(server)
