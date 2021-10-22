
const { filterByQuery, joinQuery, findById, validateAnimal, createNewAnimal } = require('../../lib/animals');
const { animals } = require('../../data/animals');
const router = require('express').Router();

router.get('/animals', (req,res) => {
    let results = animals;
    if(req.query) {
        results = filterByQuery(joinQuery(req.query),results);
    }
    res.json(results);
});

router.get('/animals/:id', (req,res) => {
    const result = findById(req.params.id, animals);
    if(result) {
        res.json(result);
    } else {
        res.send(404);
    }
});

router.post('/animals', (req,res) => {
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

module.exports = router;