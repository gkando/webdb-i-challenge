const express = require('express');

const db = require('./data/dbConfig.js');

const server = express();

server.use(express.json());


//C
server.post('/', validateAccount, (req, res) => {
  const account = req.body;
  db.insert(account)
  .then(result => {
    console.log(result)
    res.status(201).json({
      success: true,
      result: result
    });
  })
  .catch(error => {
    console.log(error)
    res.status(500).json({
      success: false,
      error: error
    });
  });
})

//R
server.get('/', (req, res) => {
  db.get()
  .then(accounts => {
    if (accounts) {
      res.status(200).json({
        success: true,
        accounts: accounts
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'No Accounts Have Been Created Yet.'
      });
    }
  })
});

server.get('/total', (req, res) => {
  db.getTotal()
  .then(total => {
    var sum = total[0]
    var sum = Object.values(sum)
    if (total) {
      res.status(200).json({
        success: true,
        total: 'The total budget is $' + sum.toLocaleString()
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'No Accounts Have Been Created Yet.'
      });
    }
  })
});

//U

server.put('/:id', validateAccount, (req, res) => {  
  const id = req.params.id;
  const changes  = req.body;

  db.update(id, changes)
  .then(count => {
    res.status(200).json({
      success: true, 
      changes: changes,
      count:   count
    });
  })
  .catch(error => {
    console.log(error)
    res.status(500).json(error);
  })  
});

//D
server.delete('/:id', (req, res) => {
  db.remove(req.params.id)
  .then(count => {
    res.status(200).json({ 
      success: true, 
      message: 'The account has been deleted.',
      count: count
    });
  }) 
    .catch(error => {
      console.log(error);
      res.status(500).json({
      success: false,
      message: 'The account could not be removed',
    });
  });
});

function validateAccount(req, res, next) {
  if (!req.body.name || !req.body.budget) {   
    let msg =  Object.keys(req.body.name).length === 0 ?
      'Missing Account Name' :
      'Missing Required Budget Field'
    res.status(400).json({
      success: false,
      errorMessage: msg
    });
  } else {
    next();
  }
};

module.exports = server;