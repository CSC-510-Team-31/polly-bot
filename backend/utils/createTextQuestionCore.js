const {v4} =require('uuid');

const Pool = require('pg').Pool
createTextQuestionCore = async function(roomId,title){
    const pool = new Pool({
        user: 'postgres',
        host: 'localhost',
        database: 'postgres',
        password: '',
        port: 5432,
      });
      let question;
      let player = v4();
      question = {
        "question":player,
        roomId,
        "QuestionType": "text",
        "description":title};
      var y=await pool.query('INSERT INTO question ( id ,roomid , questiontype,ispublished ) VALUES ($1,$2,$3,$4)', [player,roomId,"text",'f']);
       
    
      var x = await pool.query('INSERT INTO txtQuestion ( id ,question , qid ) VALUES ($1,$2,$3)', [v4(),title,player]);
          

  
   
    
 
    
      return  question 
  
}

module.exports.createTextQuestionCore = createTextQuestionCore;