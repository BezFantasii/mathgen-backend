const fastify = require('fastify');
const bcrypt = require('bcrypt');
const jwt = require('@fastify/jwt');
const { restart } = require('nodemon');

async function routes (fastify, options) {

  
  fastify.get('/users', async (request, reply) => {
      try {
        const res = await fastify.pg.query(`SELECT * FROM users;`);
        return res.rows;
      } catch (error) {
        reply.code(500).send({ error: error.message });
      }
    });

    fastify.get('/users/:id', async (request, reply) => {
        try {
          const {id} = request.params
          const res = await fastify.pg.query(`SELECT * FROM users WHERE id=$1`,[id]);

          if (res.rowCount === 0) {
            reply.code(404).send({ error: 'User not found' });
          } else {
            return res.rows[0];
          }
        } catch (error) {
          reply.code(500).send(error);
        }
      });
    fastify.get('/users/top10', async (request, reply) =>{
      try {
        const res = await fastify.pg.query(`SELECT * FROM users ORDER BY score DESC LIMIT 10`)
        return res.rows;
      } catch(error) {
        reply.code(500).send(er);

      }
    });
      fastify.post('/users/signup', async (request, reply) => {
        try {
          const {login, password, petname} = request.body;

          const hash = await bcrypt.hash(password, 10);
          const logg = await fastify.pg.query(`SELECT * FROM users WHERE login = $1;`, [login],)
          if (logg.rowCount===0){
          const res = await fastify.pg.query(
           
            `INSERT INTO users(login, password, petname) VALUES($1, $2, $3) RETURNING *;`,
             [login, hash, petname],
          );          
          return res.rows[0];}
          else{
            reply.code(404).send({ error: 'User already exists' });
          }
        } catch (error) {
          reply.code(500).send({ error: error.message });
        }
      });
    
      fastify.post('/users/signin', async (request, reply) =>{
        const{login, password} = request.body;
        try{
          const res =  await fastify.pg.query(`SELECT * FROM users WHERE login = $1`, [login]);
          console.log(res.rows);

          if(res.rowCount === 0) {
            reply.code(404).send({message : 'User not founded'});
          }else{

            const users = res.rows[0];
            const isValid = await bcrypt.compare(password.toString(), users.password);
            if(isValid){
              const token = fastify.jwt.sign({
              payload: {
              userid: users.id,
              createdAt: new Date()
              },

            });

              reply.code(200).send({
              status: 200,
              token: token,
              login: login,
              score: users.score,
              dailyScore: users.daily_tasks,
              id: users.id
            });
            }else{
            return reply.code(401).send({
              failed: 'Anauthorized Access'
            });
          }
        }
      }catch(err){
        reply.code(500).send(err);
      }
    });
  fastify.put('/users/:id', async (request, reply) => {
    const{login, score} =  request.body;

    try{
      const res = await fastify.pg.query(
      `UPDATE users 
      SET score = score + $1, daily_tasks = daily_tasks +$1
          WHERE login = $2 RETURNING *;`,
          [score, login]
      );

      if(res.rowCount === 0){

        reply.code(404).send({message: 'User not found'});
      }else{
        reply.send(res.rows[0]);
      }

    }catch(err){
      reply.code(500).send(err);
    }
  });
}  


module.exports = routes;