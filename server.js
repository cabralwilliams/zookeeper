
const express = require('express');
const app = express();
const PORT = 3002;

const { animals } = require('./data/animals.json');

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

app.get('/api/animals', (req,res) => {
    let results = animals;
    if(req.query) {
        results = filterByQuery(joinQuery(req.query),animals);
    }
    res.json(results);
    //console.log(req.query);
    //console.log(joinQuery(testOb));
    //console.log(joinQuery(req.query));
});

app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});