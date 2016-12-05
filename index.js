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

app.get('/', (req, res) => {
  const package = require('./package.json')
  res.json({
    title: "Events API",
    version: package.version,
    status: "ok"
  })
})

app.get('/events', (req, res) => {
  eventService.allEvents((err, events) => {
    if(err) {
      res.send(err)
    }
    res.json({data:events})
  })
})

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

app.put('/events/:event_id', (req, res) => {
  let eventId = req.params.event_id
  let updatedEvent = req.body.data
  eventService.updateEvent(eventId, updatedEvent, (err, event) => {
    if(err) {
      res.send(err)
    }
    res.json({replaced:[event._id]})
  })
})

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

app.get('/secrets', auth, (req, res) => {
  res.json({
    "secrets": [
      "The answer is 42."
    ]
  })
})

app.listen(3000, () => {
  console.log('Listening on port 3000!')
})

module.exports = app
