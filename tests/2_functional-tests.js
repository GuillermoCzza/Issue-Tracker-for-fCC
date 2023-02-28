const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);


suite('Functional Tests', function() {
  //we will need one non-deleted issue with a known _id for test #12
  let idOfIssueToDelete;
  // #1
  test('Create an issue with every field: POST request to /api/issues/{project}', function (done) {
    chai
      .request(server)
      .post('/api/issues/functionaltest')
      .send({
        issue_title: "post title",
        issue_text: "post text",
        created_by: "tester"
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.notProperty(res.body, 'error');

        //for test #12
        idOfIssueToDelete = res.body._id;
        done();
      });
    });
  
  // #2
  test('Create an issue with only required fields: POST request to /api/issues/{project}', function (done) {
    chai
      .request(server)
      .post('/api/issues/functionaltest')
      .send({
        issue_title: "post title",
        issue_text: "post text",
        created_by: "tester",
        assigned_to: "test assignee",
        status_text: "being tested"
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.notProperty(res.body, 'error');
        done();
      });
    });
  
  // #3
  test('Create an issue with missing required fields: POST request to /api/issues/{project}', function (done) {
    chai
      .request(server)
      .post('/api/issues/functionaltest')
      .send({})
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.property(res.body, 'error');
        done();
      });
    });
  
  // #4
  test('View issues on a project: GET request to /api/issues/{project}', function (done) {
    chai
      .request(server)
      .get('/api/issues/functionaltest')
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.isArray(res.body);
        done();
      });
    });
  
  // #5
  test('View issues on a project with one filter: GET request to /api/issues/{project}', function (done) {
    chai
      .request(server)
      .get('/api/issues/functionaltest?creator=tester')
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.isArray(res.body);
        done();
      });
    });
  
  // #6
  test('View issues on a project with multiple filters: GET request to /api/issues/{project}', function (done) {
    chai
      .request(server)
      .get('/api/issues/functionaltest?creator=tester&issue_text=post+text')
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.isArray(res.body);
        done();
      });
    });
  
  // #7
  test('Update one field on an issue: PUT request to /api/issues/{project}', function (done) {
    chai
      .request(server)
      .put('/api/issues/functionaltest')
      .send({_id:'63fd46d013a8bc4dade51ff1', issue_text: "he sido modificado"})
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.result, 'successfully updated');
        done();
      });
    });
  
  // #8
  test('Update multiple fields on an issue: PUT request to /api/issues/{project}', function (done) {
    chai
      .request(server)
      .put('/api/issues/functionaltest')
      .send({_id:'63fd46d313a8bc4dade51ff4', issue_text: "he sido modificado", issue_title: "yo tambien he sido modificado"})
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.result, 'successfully updated');
        done();
      });
    });
  
  // #9
  test('Update an issue with missing _id: PUT request to /api/issues/{project}', function (done) {
    chai
      .request(server)
      .put('/api/issues/functionaltest')
      .send({issue_text: "esto no va a llegar a nadie en absoluto"})
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'missing _id');
        done();
      });
    });
  
  // #10
  test('Update an issue with no fields to update: PUT request to /api/issues/{project}', function (done) {
    chai
      .request(server)
      .put('/api/issues/functionaltest')
      .send({_id: "63fd46f949fe501eab5e4efb"})
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'no update field(s) sent');
        done();
      });
    });
  
  // #11
  test('Update an issue with an invalid _id: PUT request to /api/issues/{project}', function (done) {
    chai
      .request(server)
      .put('/api/issues/functionaltest')
      .send({_id: "invalid _id", issue_text: "esto no va a llegar a nadie real"})
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'could not update');
        done();
      });
    });
  
  // #12
  test('Delete an issue: DELETE request to /api/issues/{project}', function (done) {
    chai
      .request(server)
      .delete('/api/issues/functionaltest')
      .send({_id: idOfIssueToDelete})
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.result, 'successfully deleted');
        done();
      });
    });
  
  // #13
  test('Delete an issue with an invalid _id: DELETE request to /api/issues/{project}', function (done) {
    chai
      .request(server)
      .delete('/api/issues/functionaltest')
      .send({_id: "invalid _id"})
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'could not delete');
        done();
      });
    });
  
  // #14
  test('Delete an issue with missing _id: DELETE request to /api/issues/{project}', function (done) {
    chai
      .request(server)
      .delete('/api/issues/functionaltest')
      .send({})
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'missing _id');
        done();
      });
    });
  
});
