### Demonstrating Swagger Generated Tests with the ST Platform Intern Challenge

A possible additional benefit of using Swagger specification to document your API is the ability to auto-generate tests based on the specification file.  

In this scenario, I used Apigee's [Swagger Test Templates](https://github.com/apigee-127/swagger-test-templates) with mocha/chai to generate tests based on the specification used to document the platform intern challenge.
You can read a little more in [Apigee's blogpost](https://apigee.com/about/blog/developer/swagger-test-templates-test-your-apis) about their endeavor.

####To Run Test Demo
1. run 'npm install'
2. 'npm test' (This will run test/index.js which starts the server, runs lib/generate-test, tests all files in folder with mocha and closes the server after testing concludes.)


####Setup
lib/generate-test.js houses the primary logic from swagger-test-templates. It will clear and seed the database with data from fixtures and generate individual test files to a specified folder.

Initial configuration requires one to cheese the assertionFormat (should/__expect__/assert), testModule(__supertest__/request) and pathName which is the array of path names available for testing. I optionally added pathParam to specify the event_id and requestData which is used to send mock data.

#####Of note:
- For testing OAUTH or Basic Auth the token should be stored in a .env file.     
- If a response code is defined in the Swagger spec one needs to define the response type(i.e. object/array). The test generation may require more specificity than what is needed when initially documenting your API.
- If a test fails, look at the individual test file.  If '__DATA GOES HERE__' appears in the file it probably means that either the Swagger spec is incorrect or there isn't enough specificity.

####Conclusion
The documentation for swagger-test-templates is limited as is error handling, but could still be worthwhile to use with some extra setup.  


#### To Run App without testing
1. run 'npm install'
2. 'npm start'
3. go to localhost:8080/swagger

#### GET /
Should return status info in the form of:
```
{
  "title": "Events API",
  "version": "1.0.0",
  "status": "ok"
}
```
1. The status property should be set to "ok"
2. The version property should return the version from package.json

#### GET /events
Should return json listing (array) of all events in the format:
```
{
  "data": [
    {
      "name": "Interview for sweet dev job",
      "start": "2016-10-30T20:44:49.100Z",
      "end": "2016-10-30T20:44:49.100Z",
      "id": "659ab379-083f-4414-a73a-aa593c3f9892"
    }
  ]
}
```

#### GET /events/:event_id
Should return json for a specific event in the format:
```
{
  "data": {
    "name": "Interview for sweet dev job",
    "start": "2016-10-30T20:44:49.100Z",
    "end": "2016-10-30T20:44:49.100Z",
    "id": "659ab379-083f-4414-a73a-aa593c3f9892"
  }
}
```

#### POST /events
Should allow creation of multiple events by posting an array in the format:
```
{
    "data": [
        {
            "name": "Interview for sweet dev job",
            "start": "2016-10-30T20:44:49.100Z",
            "end": "2016-10-30T20:44:49.100Z"
		},
		{
            "name": "Another event",
            "start": "2016-10-25T20:44:49.100Z",
            "end": "2016-10-25T20:44:49.100Z"
		}
    ]
}
```
Should return an array of inserted ids:
```
{
  "inserted": [
    "5297c1e0-8017-4126-bac9-3ce5c2c8f00a",
    "e78bcdd7-960e-4e1e-b05e-fbeade8b505d"
  ]
}
```

#### PUT /events/:event_id
Should replace an event with a particular id with new data:
```
{
    "data":
        {
            "name": "Maybe later...",
            "start": "2016-11-30T20:44:49.100Z",
            "end": "2016-11-30T20:44:49.100Z"
		}
}
```
Should return the replaced id:
```
{
	"replaced": [
		"5297c1e0-8017-4126-bac9-3ce5c2c8f00a"
	]
}
```

#### DELETE /events/:event_id
Should delete an event with a particular id.

Should return the deleted id:
```
{
	"deleted": [
		"5297c1e0-8017-4126-bac9-3ce5c2c8f00a"
	]
}
```
#### GET /secrets
Should get a list of secrets:
```
{
  "secrets": [
    "The answer is 42."
  ]
}
