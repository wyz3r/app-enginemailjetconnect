// Copyright 2018, Google LLC.
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use strict';

const express = require('express');
const bodyParser = require('body-parser');

const Mailjet = require('node-mailjet').connect(
  'a6c5004146335cc1bebf1b840e7c8e35',
  '0291065ecd01dde55386bfe9ccefb121'
);

const app = express();
app.use(express.json({limit: '50mb'}))
app.use(bodyParser.json())
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, filters')
  next()
})
// [START hello_world]
// Say hello!
app.get('/', (req, res) => {
  console.log(process.env.MJ_APIKEY_PUBLIC,
    process.env.MJ_APIKEY_PRIVATE)
  res.status(200).send('XD!');
});



app.post('/sendmail', (req, res, next) => {
  const sendEmail = Mailjet.post('send', {'version': 'v3.1'});
  const emailData = {}
  if(req.body.lang === 'es') {
    emailData['Messages'] = [
      {
        From: {
          Email: 'no-reply@ad2track.com',
          "Name": "Ad2track Digital",
        },
        To: [
          {
            Email: req.body.email,
          },
        ],
        "TemplateID": 710267,
				"TemplateLanguage": true,
				"Subject": "Comienza tu Tracking Digital",
				"Variables": {}
      },
    ]
  } else {
    emailData['Messages'] = [
      {
        From: {
          Email: 'no-reply@ad2track.com',
          "Name": "Ad2track Digital",
        },
        To: [
          {
            Email: req.body.email,
          },
        ],
        "TemplateID": 710340,
				"TemplateLanguage": true,
				"Subject": "Start your Digital Tracking",
				"Variables": {}
      },
    ]
  }
  sendEmail
    .request(emailData)
      .then((result) => {
        res.sendStatus(200)
      })
      .catch((err) => {
        console.log(err.statusCode)
        res.sendStatus(err.statusCode)
      }) 
});
// [END hello_world]

if (module === require.main) {
  // [START server]
  // Start the server
  const server = app.listen(process.env.PORT || 8080, () => {
    const port = server.address().port;
    console.log(`App listening on port ${port}`);
  });
  // [END server]
}

module.exports = app;
