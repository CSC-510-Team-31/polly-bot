const createHttpError =require( 'http-errors');
const Pool = require('pg').Pool;
 const  fetchRoomData = async function (roomKey, onlyFetchPublished) {
    const pool = new Pool({
        user: 'postgres',
        host: 'localhost',
        database: 'postgres',
        password: '',
        port: 5432,
      })
      let roomId;
     const {rows}= await pool.query('SELECT * FROM room WHERE key = $1', [roomKey]);
      roomId = rows[0].id;
    
      if (!roomId) {
        return new createHttpError.BadRequest('Invalid room key');
      } 
      var answers=[];
     let results = await pool.query('SELECT * FROM question WHERE roomId = $1 and ispublished=$2', [roomId, !onlyFetchPublished]);
     for(var i=0;i<results.rowCount;i++){
      var result = {};
      const {rows} = results;
      const {id,mcqQuestion}=rows[i];
      result.id=id;
      let mcqQuestions = await pool.query('SELECT * FROM mcqQuestion WHERE qId = $1 LIMIT 1', [mcqQuestion]);
  const {qid,description,options} = mcqQuestions.rows[0];
  result.qid=qid;
  result.description = description;
  result.options = [];
  for(var j=0;j<options.length;j++){
   
     let opts =  await pool.query('SELECT * FROM MCQOption WHERE  id= $1 LIMIT 1', [options[i]]);
      const {qid,description} = opts.rows[0];
      result.options.push({qid,description});

  }
  answers.push(result);
  }
      pool.end();
      return answers;

      




}
module.exports.fetchRoomData = fetchRoomData;