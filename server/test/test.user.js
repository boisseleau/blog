const chai = require('chai');
const chaiHttp = require('chai-http');

const User = require('../models').User;
const userCtrl = require('../controllers/users');
const server = require('../../app');

const should = chai.should();
chai.use(chaiHttp);


    describe('User', (done) => {
        User.findAll({
            where: {
                username: 'titi'
            }
        }).then((user,) => {
            if (!user) {
                done();
            }
            console.log(user);
                    return user
                        .destroy()
                        .then(() => res.status(204).send())
                        .catch(error => res.status(400).send(error));
                    })
        it('Should list ALL users on /api/user GET', (done) => {
            chai.request(server)
            .get('/api/user?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiYWRtaW4iOnRydWUsImlhdCI6MTUyODM3MTQ1MCwiZXhwIjoxNTI4Mzc4NjUwfQ.l7EeBm55YqcBYAmDvxz0sOiS57JfEHmFNqheIVaDE8c')
            .end((err, res) => {
                console.log(res.body);
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('array');
                res.body[0].should.have.property('id');
                res.body[0].should.have.property('username');
                res.body[0].should.have.property('email');
                res.body[0].should.have.property('password');
                res.body[0].should.have.property('admin');
                res.body[0].should.have.property('token');
                res.body[0].should.have.property('verif');
                res.body[0].should.have.property('billet');
                done();
            })
        })
        it('Should User function', (done) => {
            userCtrl.should.have.property('connexion');
            userCtrl.connexion.should.be.an('function');

            userCtrl.should.have.property('create');
            userCtrl.connexion.should.be.an('function');

            userCtrl.should.have.property('inscription');
            userCtrl.connexion.should.be.an('function');

            userCtrl.should.have.property('send');
            userCtrl.connexion.should.be.an('function');

            userCtrl.should.have.property('verify');
            userCtrl.connexion.should.be.an('function');

            userCtrl.should.have.property('list');
            userCtrl.connexion.should.be.an('function');

            userCtrl.should.have.property('listAdmin');
            userCtrl.connexion.should.be.an('function');

            userCtrl.should.have.property('profil');
            userCtrl.connexion.should.be.an('function');

            userCtrl.should.have.property('updateProfil');
            userCtrl.connexion.should.be.an('function');

            userCtrl.should.have.property('update');
            userCtrl.connexion.should.be.an('function');

            userCtrl.should.have.property('destroy');
            userCtrl.connexion.should.be.an('function');
            
            done();
        })
        /*it('Should inscription user on /api/inscription POST', (done) => {
            chai.request(server)
            .post('/api/inscription')
            .send({'username': 'titi', 'email': 'titi@truc.much', 'password': 'titi'})
            .end((err, res) => {
                console.log(res.body);
                res.should.have.status(201);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('id');
                res.body.should.have.property('username');
                res.body.should.have.property('email');
                res.body.should.have.property('password');
                res.body.should.have.property('admin');
                res.body.should.have.property('token');
                res.body.should.have.property('verif');
                done();
            })
        })*/
        it('Should login user on /api/login POST', (done) => {
            chai.request(server)
            .post('/api/login')
            .send({'email': 'titi@truc.much', 'password': 'titi'})
            .end((err, res) => {
                console.log(res.body);
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('success');
                res.body.should.have.property('message');
                res.body.should.have.property('token');
                res.body.success.should.be.a('boolean');
                res.body.success.should.be.equal(true);
                done();
            })
        })
    })