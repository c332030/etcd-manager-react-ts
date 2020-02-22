/**
 * <p>
 *   Description: proxy
 * </p>
 * @author c332030
 * @version 1.0
 * @date 2019-10-24 16:42
 */

const debug = console.debug;

const port = 404;

const request = require('request');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(express.static('../build'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

function addHeaders(res){
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', '*');
  res.header('Access-Control-Allow-Headers', '*');
  res.header('Content-Type', 'application/json; charset=utf-8');
}

app.all('/proxy', (req, res) => {

  addHeaders(res);

  // debug('req.body');
  // debug(req.body);

  const method = req.method;

  // debug('method');
  // debug(method);

  if(method === 'OPTIONS'){
    res.statusCode = 204;
    res.send('');
    return;
  }

  const url = req.get('ProxyUrl');

  const bodyStr = Object.entries(req.body).map(([key, value]) => {
    return `${key}=${value}`
  }).join('&');

  // debug(bodyStr);

  request({
    method: method
    , url: url
    , body: bodyStr
    , headers: req.headers
  }, (err, resProxy, body) => {

    // debug('body');
    // debug(body);

    res.send(body);
  });
});

app.listen(404, () => {
  debug(`Listening ${port} successful`)
});

const {
  exec
} = require("child_process");

exec(`start http://localhost:${port}`);
