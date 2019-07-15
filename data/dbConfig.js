const knex = require('knex');

const configOptions = require('../knexfile').development;

module.exports = knex(configOptions);
const db = knex(configOptions);

module.exports = {
  get,
  getTotal,
  getById,
  insert,
  update,
  remove,
};

function get() {
  return db('accounts');
}

function getTotal() {
  return db('accounts')
    .sum('budget');
}

function getById(id) {
  return db('accounts')
    .where({ id })
    .first();
}

function insert(account) {
  return db('accounts')
    .insert(account)
    .then(ids => {
      return getById(ids[0]);
    });
}

function update(id, changes) {
  return db('accounts')
    .where({ id })
    .update(changes);
}

function remove(accountID) {
  return db('accounts')
    .where('id', accountID)
    .del();
}