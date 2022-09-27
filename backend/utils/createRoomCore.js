const jwt =require('jsonwebtoken');
const Pool = require('pg').Pool
const createHttpError =require('http-errors');


const {createOrFetchPlayer} = require("./createOrFetchPlayer");
const { v4 } = require('uuid');
const createRoomCore = async function(playerId, name, title) {
    let player;

    try {
      player =  await createOrFetchPlayer(playerId, name);
      console.log(player);
    } catch (error) {
      console.log(error);
      console.log('Could not create/fetch player');
      throw new createHttpError.InternalServerError('Unable to fetch player details');
    }
    const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const length = 9;
    let randomStr = "";

    for (let i = 0; i < length; i++) {
        const randomNum = Math.floor(Math.random() * characters.length);
        randomStr += characters[randomNum];
    }
    const key = randomStr;
    const token = jwt.sign({"token":player.id}, "Krishna");
    
    const pool = new Pool({
        user: 'postgres',
        host: 'localhost',
        database: 'postgres',
        password: '',
        port: 5432,
      })
      let room=v4();
      const {rowCount} = await pool.query('INSERT INTO room (id,hostid,host,key,title) VALUES ($1, $2,$3,$4,$5)', [room,player.id,name,key,title])
    
    if(rowCount<=0)
      return new createHttpError.BadRequest("Room is not created successfully");
  
    return {room, token,player};
}
module.exports.createRoomCore = createRoomCore;