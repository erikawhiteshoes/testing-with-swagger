var Mocha = require('mocha');
let stt = require('swagger-test-templates');
let fs = require('fs');
let swagger = require('../swagger.json');
const Datastore = require('nedb');
const path = require('path');
const db = new Datastore({ filename: path.join(__dirname, '../services/events.db')});
const seedData = require('../test/fixtures/singleEvent.json');
const postData = require('../test/fixtures/postEvents.json');

function loadDb(){
  db.loadDatabase(function(err){
    if(err){
      console.error(err);
    } else {
      console.log(`successfully loaded/created database`);
      db.remove({},{multi: true}, (err,num) => {
        db.insert(seedData, (err, docs) => {
          if(err) {
            console.error(err);
          } else {
            console.log('Seeded with:', seedData);
          }
          findSingle();
        });
      });
    }
  });
}

function findSingle(insertedId) {
  db.findOne({}, function (err, doc) {
    if (err) {
      console.error(err);
    } else {
      const {_id: event_id} = doc;

      let config = {
          assertionFormat: 'expect',
          testModule: 'supertest',
          pathName: ['/', '/events', '/events/{event_id}', '/secrets'],
          maxLen: 80,
          pathParams: {"event_id": event_id},
          requestData: {
              '/events': {
                  post: {
                      '201': [{
                          body: postData,
                          description: 'adds events'
                      }]
                  },
              },
              '/events/{event_id}': {
                  put: {
                      '200': [{
                          body: seedData,
                          description: 'updates event'
                      }]
                  },

              }
          }
      };

      // Generates an array of objects containing the test file content, following specified configuration
      // the array contains objects with the scheme { name: <test-file-name>, test: <test-file-content> }
      // tests = [ {name: base-path-test.js, test: ... }, {name: users-test.js, test: ... }]
      let tests = stt.testGen(swagger, config);

      for (let test of tests) {
          fs.writeFileSync(`./test/generated-tests/${test.name}`, test.test, 'utf8', (err) => {
              if (err) throw err;
              console.log('Bingo!');
          });
      }
      return doc;
    }
  });
}

loadDb();
