const chai = require('chai')
const chaiHttp = require('chai-http')
const app = require('../index')
const should = chai.should()
const expect = chai.expect

chai.use(chaiHttp)

// ---> DEBUT
/**
  * Génération des nouvelles couleurs et enregistrement de ces
  * couleurs dans un tableau.
  */
const newValues = []
const colorKey = 'NEW_COLOR_'
let nextCursor = 0;
const payloadColor = () => {
  const nextColor = `${colorKey}${nextCursor}`
  newValues.push(nextColor)
  nextCursor++;
  return { 'color': nextColor }
}
const getCurrentCulor = () => {
  return nextCursor > 0 ? `${colorKey}${nextCursor - 1}` : `${colorKey}O`
}
// <-- FIN

describe('API /documents', () => {
  it('should return all colors', (done) => {
    chai.request(app)
      .get('/colors')
      .end((err, res) => {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.an('object');
        res.body.results.should.be.an('array');
        res.body.results.should.be.eql(['RED','GREEN','BLUE']);
        done();
      });
  });


  it('should return Bad Request', (done) => {
    chai.request(app)
      .get('/foo')
      .end((err, res) => {
        res.should.have.status(404);
        done();
      });
  });

  it('should add new colors', (done) => {
    chai.request(app)
      .post('/colors')
      .send(payloadColor())
      .end((err, res) => {
        res.should.have.status(201);
        res.should.be.json;
        res.body.should.be.an('object');
        res.body.results.should.be.an('array');
        res.body.results.should.be.include(getCurrentCulor());
        done();
      });
  });

});


