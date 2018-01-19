const express = require("express");
const pg = require('pg');
const connectionString = 'postgresql://postgres: @localhost/wahlschema';
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
    router.get('/:table/', api.table);
    router.get('/testMitglieder', api.test);
    // Sql query file
    router.get('/query/:file', api.query);
    router.get('/customQuery/:file', api.customQuery);
    // Materialized view
    router.get('/mview/:name', api.mview);
    router.get('/function/:name', api.sqlFunction);

    return router;
  }

  mview(req, res, next) {
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
    })().catch(e => {
      res.status(500).send("Materialized view does not exist!");
      console.error(e.stack);
    })
  }

  test(req, res, next) {
    res.sendFile(path.join(__dirname, "..", "sql/testMitglieder.csv"));
  }

  customQuery(req, res, next) {
    const file = req.params.file;
    const params = req.query.param ? req.query.param.split(',') : [];

    const func = require(`./query/${file}`)(...params);
    // async/await - check out a client
    (async () => {
      const client = await pool.connect();
      try {
        const queryRes = await client.query(func);
        res.send(queryRes.rows);
      } finally {
        client.release()
      }
    })().catch(e => {
      res.status(500).send("Custom query failed!");
      console.error(e.stack);
    })
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
    })().catch(e => {
      res.status(500).send("Query failed!");
      console.error(e.stack);
    })
  }

  table(req, res, next) {
    const table = req.params.table;
    // async/await - check out a client
    (async () => {
      const client = await pool.connect();
      try {
        const queryRes = await client.query(`SELECT * FROM ${table}`);
        res.send(queryRes.rows);
      } finally {
        client.release()
      }
    })().catch(e => {
      res.status(500).send("Table does not exist!");
      console.error(e.stack)
    })
  }

  sqlFunction(req, res, next) {
    const name = req.params.name;
    let params = req.query.param ? req.query.param.split(',') : [];

    params.forEach((value, key) => {
      params[key] = "'" + value.trim() + "'"
    });
    params = params.join(',');

    // async/await - check out a client
    (async () => {
      const client = await pool.connect();
      try {
        const queryRes = await client.query(`SELECT * FROM ${name}(${params})`);
        res.send(queryRes.rows);
      } finally {
        client.release()
      }
    })().catch(e => {
      res.status(500).send("Function does not exist!");
      console.error(e.stack)
    })
  }
}

exports.DB_Connector = DB_Connector;
