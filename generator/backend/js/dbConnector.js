const express = require("express");
const pg = require('pg');
const connectionString = 'postgresql://localhost/wahlschema';
const fs = require('fs');
const path = require('path');
const pool = new pg.Pool({
  connectionString
});
/**
 * Error handling for pg-pool
 */
pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err)
  process.exit(-1)
});

class DB_Connector {

  static createRouter() {
    let router = express.Router();
    let api = new DB_Connector();
    router.get('/bundesland', api.bundesland);
    router.get('/testMitglieder', api.test);
    // Sql query file
    router.get('/query/:file', api.query);
    // Materialized view
    router.get('/mview/:name', api.mview);
    return router;
  }

  mview(req,res,next){
    const name = req.params.name;
    // async/await - check out a client
    (async () => {
      const client = await pool.connect();
      try {
        const queryRes = await client.query(`Select * from ${name}`);
        res.send(queryRes.rows);
      } finally {
        client.release()
      }
    })().catch(e => console.log(e.stack))
  }

  test(req, res, next) {
      res.sendFile(path.join(__dirname, "..", "sql/testMitglieder.csv"));
  }


  query(req, res, next) {
    const file = req.params.file;
    // async/await - check out a client
    (async () => {
      const client = await pool.connect();
      try {
        const queryRes = await client.query(fs.readFileSync(`./sql/${file}.sql`).toString());
        res.send(queryRes.rows);
      } finally {
        client.release()
      }
    })().catch(e => console.log(e.stack))
  }

  bundesland(req, res, next) {
    // async/await - check out a client
    (async () => {
      const client = await pool.connect();
      try {
        const queryRes = await client.query('SELECT * FROM bundesland WHERE id > $1', [req.query.id || 0]);
        console.log(queryRes.rows);
        res.send(queryRes.rows);
      } finally {
        client.release()
      }
    })().catch(e => console.log(e.stack))
  }
}

exports.DB_Connector = DB_Connector;