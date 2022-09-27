const createHttpError =require('http-errors');
const Pool = require('pg').Pool
const {v4} =require('uuid');



createOrFetchPlayer= async function(playerId, name){
    let player;
    let results;
    let id;
    const pool = new Pool({
        user: 'postgres',
        host: 'localhost',
        database: 'postgres',
        password: '',
        port: 5432,
      })
      
    if(!playerId && !name) {
      console.log(playerId);
      console.log(name);
      return new createHttpError.BadRequest('Insufficient inputs');
    }
  
    if (playerId) {

       const {rows}= await pool.query('SELECT * FROM players WHERE id = $1', [playerId]);
       player = rows[0];

        
     
    } else {
    
    
      player = pool.on('connect', client => {
        console.log("Connected");
      }); 
     id = v4();
      results = player.query("INSERT INTO players (id,name) VALUES ($1,$2)", [id,name]).then((results)=>{
 
      return results;
    
      }).catch(err=>{
        console.log(err);
      }).finally(ab=>{
        console.log("HU");
        pool.end();
      })
      
    }
   if(results){
    const {rowCount} = await results;
    if(rowCount==0) {
     return new createHttpError.BadRequest("Nil Player");

    }
    player = {"id":id,"name":name}
  
  }
    return player;
  }

  module.exports.createOrFetchPlayer = createOrFetchPlayer;