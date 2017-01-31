/* jshint esversion:6, asi:true */

const Datastore = require('nedb')
const path = require('path')

const events = new Datastore({ filename: path.join(__dirname, 'events.db')})

events.loadDatabase()

function allEvents(cb) {
  events.find({}, cb)
}

function newEvents(arr, cb) { //cb(err,val)
  let E = arr.map(obj => ({name: obj.name, start: obj.start, end: obj.end}))
    events.insert(E, cb)
}

function findOneEventById(id, cb) {
  events.findOne({_id: id}, cb)
}

function updateEvent(id, evts, cb) {
  evts = evts.length !== undefined ? [evts] : evts
    events.update({_id: id}, evts, {returnUpdatedDocs:true}, (err, numAffected, affectedDocuments) => {
      if(err) {console.error(err)}
      cb(err, affectedDocuments)
    })
}

function deleteEvent(id, cb) {
  events.remove({_id: id}, {}, cb)
}


module.exports = {
newEvents, allEvents, findOneEventById, updateEvent, deleteEvent
}
