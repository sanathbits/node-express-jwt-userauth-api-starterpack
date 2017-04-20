var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server.js');
var should = chai.should();

chai.use(chaiHttp);

describe('Projects', function() {
    it('should list ALL projects on /projects GET', function(done) {
        chai.request(server)
            .get('/projects')
            .end(function(err, res){
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('array');
                done();
            });
    });
    it('should add a single project on /project POST');
    it('should edit a project on /project PUT');
});