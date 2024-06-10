const bcrypt = require('bcrypt');
user='23'
const saltRounds = 10; 
const hashedPassword = bcrypt.hashSync(user, saltRounds);

console.log('Hashed password:', hashedPassword);