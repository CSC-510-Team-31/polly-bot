const {v4} =require('uuid');

const Pool = require('pg').Pool
createMcqQuestionCore = async function(roomId, title, options){
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
        "QuestionType": "MCQ",
        "description":title,


      };
      var y=pool.query('INSERT INTO question ( id ,roomid , questiontype, ispublished ) VALUES ($1,$2,$3,$4)', [player,roomId,"MCQ",'f']);
       
    
      var x = await pool.query('INSERT INTO mcqQuestion ( id ,question , qid ) VALUES ($1,$2,$3)', [v4(),title,player]);
          

  
    for(var i=0;i<options.length;i++)
    pool.query("INSERT into MCQOption ( id ,questionId , description ) VALUES ($1,$2,$3)",[v4(),player,options[i]], (error, results) => {
        if (error) {
            throw error
          }


        }
        )
    
 
    
      return  question 
  
}
module.exports.createMcqQuestionCore = createMcqQuestionCore