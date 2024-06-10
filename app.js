const fastify = require('fastify')({ logger: true });
const users = require('./routes/users.js');
const cors = require('@fastify/cors');
const jwt = require('@fastify/jwt');
require('dotenv').config();
console.log(process.env);
const CronJob = require('cron').CronJob
fastify.register(require('@fastify/postgres', 'fastify-crons'), {connectionString: process.env.CONNECTION_STRING});
fastify.register(users);

const {JWT_SECRET} = process.env;
console.log(JWT_SECRET);

fastify.register(jwt,{
  secret: JWT_SECRET,
  sign:{
    expiresIn: '1d',
  },
});
fastify.register(cors);



const { Sign } = require('crypto');
const { request } = require('http');
const { join } = require('path');


const job = new CronJob('* * */1  * *', function() {
  fastify.pg.query(`UPDATE users SET daily_tasks = 0`)

})
job.start()


fastify.listen(3000, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});


