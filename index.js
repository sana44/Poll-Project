const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true }));


const polls = [
    {
        id: 1,
        question: "Question 1?",
        answers: ["Réponse 1", "Réponse 2", "Réponse 3"],
        votes:[]
    },
    {
        id: 2,
        question: "Question 2?",
        answers: ["Réponse 1", "Réponse 2", "Réponse 3"],
        votes:[1, 0, 0, 2, 1, 0, 1, 1]
    },
    {
        id: 3,
        question: "Question 3?",
        answers: ["Réponse 1", "Réponse 2", "Réponse 3"],
        votes:[1, 3, 0, 2, 3, 0]
    }
];

/*app.get('/', function (req, res) {
  res.send('Hello World');
});*/


//Créer un poll
app.post('/polls', function (req, res) {
    const question = req.body.question;
    const answers = req.body.answers;
    //const { question, answers } = req.body; c'est la même chose que les deux lignes précedentes mais ca ne fonctionne pas dans tous les navigateurs
    
    //on vérifie si la question est une chaine de caractère
    if(typeof(question) !== 'string'){
        return res.sendStatus(400);
    }
    
    //on vérifie si answers est une liste de chaines de caractères
    if(/*typeof(answers) === 'object' || typeof (answers.every) !== 'function'*/ !Array.isArray(answers) || answers.some(a => typeof(a) !== 'string')){
        return res.sendStatus(400);
    }
    
    //on crée un nouvel identifiant unique, supérieur à tous les autres
    const id = polls.reduce((max,p) => max > p.id ? max: p.id, 0) + 1; 
    
    //on crée un nouvel objet sondage
    const poll = {
        id: id,
        question: question,
        answers: answers,
        votes: []
    };
    
    //on ajoute le nouveau sondage à la liste
    polls.push(poll);
    
    //et on le renvoie avec le bon code HTTP
    res.send(201, poll);
});

//Lister les sondages
app.get('/polls', function (req, res) {
  res.send(polls);
});

//Récupérer un sondage et ses résultats
app.get('/polls/:id', function (req, res) {
    //on extrait le paramètre id et on le transforme en integer
    const id = parseInt(req.params.id, 10);
    //On cherche le sondage par son id
    function correspond (poll){
        return poll.id === id;
    }
    const poll = polls.find(correspond);
    if(typeof(poll) !== 'undefined'){
        //Si un sondage est trouvé, on le renvoie
        res.send(poll);
    }else{
        //Sinon, on envoie une erreur 404
         res.sendStatus(404);
    }
});

//Voter pour une réponse d'un sondage
app.post('/polls/:id/votes', function (req, res) {  
    const vote = parseInt(req.params.votes);
    vote.push(2);
});


app.listen(3000);