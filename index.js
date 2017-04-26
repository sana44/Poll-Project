const express = require('express');
const bodyParser = require('body-parser');
const authMiddleware = require('./authmiddleware');

const app = express();
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true }));

//const db = require('mongodb');
//conn = new Mongo();
//db = conn.getDB("pollProject");

// Retrieve
//var MongoClient = require('mongodb').MongoClient;
// Connect to the db
//const db = MongoClient.connect("mongodb://localhost:27017/pollProject");
//const collection = db.collection('poll');

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
app.post('/polls', authMiddleware, function (req, res) {
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
    
    // On crée un nouvel identifiant unique, supérieur à tous les autres
    //const id = Math.max.apply(null, polls.map(p => p.id)) + 1;
    const id = polls.reduce((max,p) => max > p.id ? max: p.id, 0) + 1; 
    
    //on crée un nouvel objet sondage
    const sondage = {
        id: id,
        question: question,
        answers: answers,
        votes: []
    };
    
    //on ajoute le nouveau sondage à la liste
    //db.poll.insert(sondage);
    polls.push(sondage);
    
    //et on le renvoie avec le bon code HTTP
    res.send(201, sondage);
});

//Supprimer un sondage 
app.delete('/polls/:id', authMiddleware, function(req, res){
    //On cherche l'index du sondage dans le tableau polls par son id
    const id = parseInt(req.params.id, 10);
    const idSup = polls.findIndex(p => p.id === id);

    //Si le sondage n'existe pas, erreur 404
    if(idSup === -1){
        return res.sendStatus(404);   
    }
    //On supprime le sondage de la liste
    polls.splice(idSup, 1);
    //Code "No Content" (Succès)
    res.sendStatus(204);
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
    //on extrait le paramètre id et on le transforme en integer
    const pollId = parseInt(req.params.id, 10);
    //On cherche le sondage par son id
    function correspond (poll){
        return poll.id === pollId;
    }
    const poll = polls.find(correspond);
    if(typeof(poll) === 'undefined'){
        //on envoie une erreur 400
        return res.sendStatus(404);
    }
    //on récupère l'index de la réponse votée depuis le body
    const idAnswer = parseInt(req.body.answer);
    //on vérifie sa validité
    if(!(idAnswer in poll.answers)){
        //Sinon, on envoie une erreur 400
         return res.sendStatus(400);
    }
    //Ajouter l'index de la réponse à la liste de vote dans l'objet poll
    poll.votes.push(idAnswer);
    //Renvoyer la liste des votes en 201
    res.send(201, poll.votes);
});

//Ajouter une authentification sur la création et la suppression de sondage

app.listen(3000);