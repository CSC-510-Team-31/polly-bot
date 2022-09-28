const express = require('express')
const app = express();

let bodyParser = require('body-parser');

const {createRoomCore} = require("./utils/createRoomCore");
const {createOrFetchPlayer} = require("./utils/createOrFetchPlayer");
const {createMcqQuestionCore}= require("./utils/createMcqQuestionCore");
const {enterRoomCore}= require("./utils/enterRoomCore");
const {createTextQuestionCore} = require("./utils/createTextQuestionCore");
const Pool = require('pg').Pool;


const port = 3000

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));



app.post("/create-mcq-question", async(req,res)=>{
    const {  roomId, title, options,type } = req.body;
    let question;
    if(type=="MCQ")
        question = await createMcqQuestionCore( roomId, title, options);
    else if(type=="text")
        question=await createTextQuestionCore(roomId,title);
    
    
  
   
  
    res.status(200).json( {

  
        question,
        options,
   
    })
})


app.post("/vote-mcq", async(req,res)=>{
    const { playerId, questionId, optionId } = req.body;
    const pool = new Pool({
        user: 'postgres',
        host: 'localhost',
        database: 'postgres',
        password: 'admin',
        port: 5432,
      })
      let playerAnswer;
      playerAnswer =await pool.query('INSERT INTO MCQQuestionPlayerAnswer (id,pid,qid,answerId) VALUES ($1,$2,$3,$4)',[v4(),playerId,questionId,optionId])
     
    
    pool.end();
    if(playerAnswer.rowCount)
    res.status(200).json( {
    
        "answer":playerAnswer
    
    }
    )
    else
    res.status(200).json( {
    
        answer:"Unsuccesfull"
    
    }

)
})

app.get("/getoptions",async(req,res)=>{
    const { questionId } = req.body;
    const pool = new Pool({
        user: 'postgres',
        host: 'localhost',
        database: 'postgres',
        password: 'admin',
        port: 5432,
      })
      let playerAnswer;
      playerAnswer =await pool.query('select * from mcqOption  where questionid=$1 ',[questionId])
       const {rows}=playerAnswer;
    
    pool.end();
    if(playerAnswer.rowCount)
    res.status(200).json( {
    
        "answer":rows
    
    }
    )
    else
    res.status(200).json( {
    
        answer:"Unsuccesfull"
    
    }

)

})



app.post("/enter-room", async(req,res)=>{
    const { playerId, name, roomKey } = req.body;
  const {token, questionData} = await enterRoomCore(playerId, name, roomKey);
  res.status(200).json( {
 
      token,
      questionData
 
  }
  )
})
app.post("/player", async(req,res)=>{
    const player = await createOrFetchPlayer(req.body.playerId,req.body.name)
res.status(200).json({
    "player":player
});

})
app.get("/player",async(req,res)=>{
    const player = await createOrFetchPlayer(req.body.playerId,"")
    res.status(200).json({
        "player":player
    });
    })
app.get("/",(req,res)=>{
    res.status(200).json({"Welcome": "Krishna"})

})

app.post("/create-room", async (req,res)=>{
    
    const {room, token,player} =  await createRoomCore(req.body.playerId, req.body.name,req.body.title);
    res.status(200).json( {
        
    
            room,
            token,
            player
    
        }
    );
    
})
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})