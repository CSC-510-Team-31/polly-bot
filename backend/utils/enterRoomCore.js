const  createHttpError =require('http-errors');
const Pool = require('pg').Pool;
const jwt =require('jsonwebtoken');
const { createOrFetchPlayer } =require( './createOrFetchPlayer');
const  {fetchRoomData} =require("./fetchRoomData");
const enterRoomCore = async function(playerId, name, roomKey){
    const pool = new Pool({
        user: 'postgres',
        host: 'localhost',
        database: 'postgres',
        password: '',
        port: 5432,
      })
    const player = await createOrFetchPlayer(playerId, name);
    if (!player) {
        return new createHttpError.InternalServerError('Unable to fetch/create player data');
      }
      let roomId;
     const {rows}= await pool.query('SELECT * FROM room WHERE key = $1', [roomKey]);
   
      roomId =  rows[0].id;
    
      if (!roomId) {
        return new createHttpError.BadRequest('Invalid room key');
      }
      pool.query('INSERT INTO RoomPlayer (pid,roomId) VALUES ($1,$2,$3)', [player.id,player.name,roomId], (error, results) => {
        if (error) {
            return new createHttpError.InternalServerError('Unable to add player to room')
        }
      
      })
    
  
    
      const questionData = await fetchRoomData(roomKey, true);
      const token = jwt.sign({"token":player.id}, "Krishna");

    pool.end();
      return { token, questionData };

}
module.exports.enterRoomCore = enterRoomCore;