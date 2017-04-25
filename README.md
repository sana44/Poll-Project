# Polls

Serveur API de sondages.

## API

### Creer un sondage

`POST /polls`

Paramètres : 
- question: string
- answers: string[]

Réponse en cas de succès : `201 Created`
Sondage nouvellement créé en Json: 
```
[{"id": 1, "question": "Question ?", "answers": ["Reponse 1", "Réponse 2"], "votes": []}
```


Erreurs:
- `400 Bad Request`: Paramètres incorrects 

### Lister les sondages

`GET /polls`

Réponse en cas de succès : `200 OK`

Liste des sondages (id et titre) en Json
```
[{"id": 1, "question": "Question ?"},...]
```

### Récupérer un sondage et ses résultats

`GET /polls/:id`

Réponse en cas de succès :  `200 OK`

Sondage en Json: 
```
[{"id": 1, "question": "Question ?", "answers": ["Reponse 1", "Réponse 2"], "votes": [0, 0, 1, 0, 1]},...]
```

Erreurs:
- `404 Page Not Found` : Sondage non trouvé 

### Voter pour une réponse d'un poll

`POST /polls/:id/votes`

Paramètres: 
- answer: Index de la réponse (number)

Réponse en cas de succès : `201 Created`
Listes des votes en JSON :
```
[0, 0, 1, 0, 1]
```

Erreurs:
- `400 Bad Request`: Paramètres incorrects 
- `404 Page Not Found` : Sondage non trouvé 