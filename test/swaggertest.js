//env needs to be in root director for security tests to work
let stt = require('swagger-test-templates');
let fs = require('fs');
let swagger = require('../swagger.json');
let config = {
    assertionFormat: 'expect',
    testModule: 'supertest',
    pathName: ['/', '/events', '/events/{event_id}', '/secrets'],
    maxLen: 80,
    pathParams: {
        event_id: "IMkTN8WdsZKK8Pvo"
    },
    requestData: {
        '/events': {
            post: {
                '201': [{
                    body: [{
                            "name": "climb Everest.",
                            "start": "2016-10-24T20:44:49.100Z",
                            "end": "2016-10-24T20:44:49.100Z"
                        },
                        {
                            "name": "do not climb Everest",
                            "start": "2016-10-29T20:44:49.100Z",

                            "end": "2016-10-29T20:44:49.100Z"
                        }],
                    description: 'adds events'
                }]
            },
        },
        '/events/{event_id}': {
            put: {
                '200': [{
                    body: [{
                        "name": "meet me in St. Louis",
                        "start": "2016-10-29T20:44:49.100Z",
                        "end": "2016-10-29T20:44:49.100Z"
                    }],
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
    fs.writeFileSync(`./test/${test.name}`, test.test, 'utf8', (err) => {
        if (err) throw err;
        console.log('Bingo!');
    });
    //console.log(test.name, test.test);
    //console.log(config.requestData);
}
