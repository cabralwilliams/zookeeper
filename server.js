
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3002;
const fs = require("fs");
const path = require('path');

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

const { animals } = require('./data/animals.json');
console.log(animals);

function joinQuery(query) {
    //convert the query object into a string
    const qArray = [];
    const qKeys = Object.keys(query);
    for(let i = 0; i < qKeys.length; i++) {
        if(typeof query[qKeys[i]] === "string") {
            qArray.push(`${qKeys[i]}=${query[qKeys[i]]}`);
        } else {
            for(let j = 0; j < query[qKeys[i]].length; j++) {
                qArray.push(`${qKeys[i]}=${query[qKeys[i]][j]}`);
            }
        }
    }
    return qArray.join("&");
}

const testOb = {
    diet: 'omnivore',
    personalityTraits: ['goofy','sleepy']
};

function filterByQuery(query, animalsArray) {
    if(!query) {
        return animalsArray;
    }
    const qArray = query.split("&");
    const qKeys = [];
    const qVals = [];
    for(let i = 0; i < qArray.length; i++) {
        let obArr = qArray[i].split("=");
        qKeys.push(obArr[0]);
        qVals.push(obArr[1]);
    }
    
    return animalsArray.filter(animal => {
        for(let i = 0; i < qKeys.length; i++) {
            if(typeof animal[qKeys[i]] === "string") {
                if(animal[qKeys[i]] != qVals[i]) {
                    return false;
                }
            } else {
                let matchFound = false;
                for(let j = 0; j < animal[qKeys[i]].length; j++) {
                    if(animal[qKeys[i]][j] === qVals[i]) {
                        matchFound = true;
                        break;
                    }
                }
                return matchFound;
            }
        }
        return true;
    });
}

function findById(idVal, objArray) {
    const ob = { message: `No record was found matching an id of ${idVal}.`};
    for(let i = 0; i < objArray.length; i++) {
        if(objArray[i].id === idVal) {
            return objArray[i];
        }
    }
    return ob;
}

function validateAnimal(animal) {
    if(!animal.name || typeof animal.name !== 'string') {
        return false;
    }
    if(!animal.species || typeof animal.species !== 'string') {
        return false;
    }
    if(!animal.diet || typeof animal.diet !== 'string') {
        return false;
    }
    if(!animal.personalityTraits || !Array.isArray(animal.personalityTraits)) {
        return false;
    }
    return true;
}

function createNewAnimal(body, animalsArray) {
    const animal = body;
    animalsArray.push(animal);
    fs.writeFile(path.join(__dirname + "/data/animals.json"), JSON.stringify({animals: animalsArray}, null, 2), err => {
        if(err) {
            console.log(err);
        }
    });
    return animal;
}

app.get('/api/animals', (req,res) => {
    let results = animals;
    if(req.query) {
        results = filterByQuery(joinQuery(req.query),results);
    }
    res.json(results);
    //console.log(req.query);
    //console.log(joinQuery(testOb));
    //console.log(joinQuery(req.query));
});

app.get('/api/animals/:id', (req,res) => {
    const result = findById(req.params.id, animals);
    res.json(result);
});

app.post('/api/animals', (req,res) => {
    console.log(req.body);
    console.log(animals);
    req.body.id = animals.length.toString();
    if(!validateAnimal(req.body)) {
        res.status(400).send('The animal is not properly formatted.');
    } else {
        const animal = createNewAnimal(req.body, animals);
        res.json(animal);
    }
});

app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});