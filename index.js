/* jshint esversion:6, asi:true */

const express      = require('express')
const app          = express()
const eventService = require('./services/eventService.js')
const bodyParser   = require('body-parser')
const basicAuth    = require('basic-auth')

 app.use(bodyParser.urlencoded({extended: true}))
 app.use(bodyParser.json())

 var auth = function (req, res, next) {
   function unauthorized(res) {
     res.set('WWW-Authenticate', 'Basic realm=Authorization Required')
     return res.sendStatus(401)
   }

   var user = basicAuth(req)
   if (!user || !user.name || !user.pass) {
     return unauthorized(res)
   }

   if (user.name === 'admin' && user.pass === 'password') {
     return next()
   } else {
     return unauthorized(res)
   }
 }

 /**
  * @swagger
  * /:
  *   get:
  *     description: Gets package information
  *     produces:
  *       - application/json
  *     responses:
  *       200:
  *         description: returns object with basic info
  */

app.get('/', (req, res) => {
  const package = require('./package.json')
  res.json({
    title: "Events API",
    version: package.version,
    status: "ok"
  })
})

/**
 * @swagger
 * /events:
 *   get:
 *     description: Returns all events
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: returns event object
 */
app.get('/events', (req, res) => {
  eventService.allEvents((err, events) => {
    if(err) {
      res.send(err)
    }
    res.status(200)
       .json({data:events})
  })
})

/**
 * @swagger
 * /events:
 *   post:
 *     description: Posts new events
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: event
 *         in: body
 *         description: adds new event
 *         required: true
 *         schema:
 *           $ref: "#/definitions/NewEvent"
 *     responses:
 *       201:
 *         description: returns event object
 * definitions:
 *   NewEvent:
 *     type: object
 *     properties:
 *       name:
 *         type: string
 *       start:
 *         type: string
 *       end:
 *         type: string
 */
app.post('/events', (req, res) => {
  let events = req.body.data
  eventService.newEvents(events, (err, insertedEvents) => {
    if(err){
      res.statusCode(501).send(err)
    }
    var insertedIds = insertedEvents.map(evt => evt._id )
    res.status(201)
       .json({data:insertedEvents, inserted:insertedIds})
  })
})

/**
 * @swagger
 * /events/{event_id}:
 *   get:
 *     description: Returns single event by ID
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: event_id
 *         in: path
 *         type: string
 *         required: true
 *     responses:
 *       200:
 *         description: returns event object
 *       404:
 *         description: Error with invalid event_id
 */
app.get('/events/:event_id', (req, res) => {
  eventService.findOneEventById(req.params.event_id, (err, event) => {
    if(err) {
      res.send(err)
      return
    }
    if(event === null) {
      res.status(404)
      res.send('event not found')
      return
    }
    res.json({data:event})
  })
})

/**
 * @swagger
 * /events/{event_id}:
 *   put:
 *     description: Updates events by ID
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: event_id
 *         in: path
 *         type: string
 *         required: true
 *       - name: event
 *         in: body
 *         description: updated event
 *         required: true
 *         schema:
 *           $ref: "#/definitions/UpdatedEvent"
 *     responses:
 *       200:
 *         description: returns updated event object
 * definitions:
 *   UpdatedEvent:
 *     type: object
 *     properties:
 *       name:
 *         type: string
 *       start:
 *         type: string
 *       end:
 *         type: string
*/
app.put('/events/:event_id', (req, res) => {
  let eventId = req.params.event_id
  let updatedEvent = req.body.data
  eventService.updateEvent(eventId, updatedEvent, (err, event) => {
    if(err) {
      res.send(err)
    }
    res.json({replaced:[eventId]})
  })
})

/**
 * @swagger
 * /events/{event_id}:
 *   delete:
 *     description: Deletes event by ID
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: event_id
 *         in: path
 *         type: string
 *         required: true
 *     responses:
 *       202:
 *         description: event accepted for deletion
 */
app.delete('/events/:event_id', (req, res) => {
  let deletedId = req.params.event_id
  eventService.deleteEvent(deletedId, (err, event) => {
    if(err) {
      res.send(err)
    }
    res.status(202)
       .json({deleted:[deletedId]})
  })
})

/**
 * @swagger
 * /secrets:
 *   get:
 *     description: Returns single event by ID
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: event object
 *       401:
 *         description: Error invalid credentials
 */
app.get('/secrets', auth, (req, res) => {
  res.json({
    "secrets": [
      "The answer is 42."
    ]
  })
})

app.use('/swagger/swagger.json', express.static('swagger.json'));
app.use('/swagger/', express.static('swagger-ui/dist'));

app.listen(8080, () => {
  console.log('Listening on port 8080!')
})

module.exports = app
