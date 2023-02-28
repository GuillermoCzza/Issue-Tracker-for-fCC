'use strict';

const mongoose = require('mongoose');

module.exports = function(app) {

  mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

  let issueSchema = new mongoose.Schema({
    assigned_to: {
      type: String,
      default: ""
    },
    status_text: {
      type: String,
      default: ""
    },
    open: {
      type: Boolean,
      required: true,
      default: true
    },
    issue_title: {
      type: String,
      required: true
    },
    issue_text: {
      type: String,
      required: true
    },
    created_by: {
      type: String,
      required: true
    },
    created_on: {
      type: String,
      required: true
    },
    updated_on: {
      type: String,
      required: true
    }
  });

  app.route('/api/issues/:project')

    .get(function(req, res) {
      let project = req.params.project;

      //The database will have one collection per project
      let Issue = mongoose.model('Issue', issueSchema, project);

      const query = req.query;
      console.log(query);
      Issue.find(query, (err, docs) => {
        if (err) {
          console.error("GET error: " + err)
          return;
        }
        res.json(docs);
      });
      

    })

    .post(function(req, res) {
      let project = req.params.project;

      if (!req.body.created_by || !req.body.issue_text ||  !req.body.created_by){
        res.json({ error: 'required field(s) missing' });
        return;
      }

      let Issue = mongoose.model('Issue', issueSchema, project);

      const creationDate = new Date();
      Issue.create({
        assigned_to: req.body.assigned_to,
        status_text: req.body.status_text,
        issue_title: req.body.issue_title,
        issue_text: req.body.issue_text,
        created_by: req.body.created_by,
        created_on: creationDate,
        updated_on: creationDate
      }, (err, doc) => {
        if (err) {
          console.error("POST error: " + err)
          res.json({error:"required fields missing"});
          return;
        };
        res.json(doc);
      });
      

    })

    .put(function(req, res) {
      let project = req.params.project;
      const _id = req.body._id;

      //if _id field is empty in the request send corresponding error
      if (!_id){
        res.json({ error: 'missing _id' });
        return;
      }

      //if _id field is not empty but all other are send corresponding error
      let noFields = true;
      for (let field in req.body){
        if (req.body[field] /*is truthy */ && field != "_id"){
          console.log(field + ": " + req.body[field]);
          noFields = false;
        }
      }
      if (noFields){
        res.json({error: 'no update field(s) sent', _id: _id});
        return;
      }
    
    
      let Issue = mongoose.model('Issue', issueSchema, project);

      console.log(req.body);

      //create object to use to update the DB
      let updatedFields = {};

      //add only non-empty fields to avoid overwriting the DB with empty strings
      for (let field in req.body){
        if (req.body[field] != ""){
          updatedFields[field] = req.body[field];
        }
      }

      //set update time
      updatedFields.updated_on = new Date();

      Issue.findByIdAndUpdate(_id, updatedFields, (err, doc) => {
        if (!doc || err){
          console.error("PUT error: " + err)
          res.json({error: 'could not update', _id: _id });
          return;
        } else {
          res.json({result: 'successfully updated', _id: _id});
        }
      });

    })

    .delete(function(req, res) {
      let project = req.params.project;
      const _id = req.body._id;

      //send corresponding error if _id field is empty
      if (!_id){
        res.json({error: 'missing _id'});
        return;
      }
      
      let Issue = mongoose.model('Issue', issueSchema, project);

      Issue.findByIdAndDelete(_id, (err, doc) => {
        if (!doc || err){
          console.error("DELETE error: " + err)
          console.log("Borrado:");
          console.log(doc);
          res.json({error: 'could not delete', _id: _id});
          return;
        } else {
          res.json({result: 'successfully deleted', _id: _id}); 
        }
      });

    });

};
