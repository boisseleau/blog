const usersController = require('../controllers/users');
const billetController = require('../controllers').billets;
const commentController = require('../controllers').comment;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cfg = require('../../config');

const multer = require('multer');

const storage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, 'server/pictures')
    },
    filename: function(req, file, callback) {
        console.log(file);
        callback(null, file.originalname )
    }
});

const upload = multer({storage: storage});



module.exports = (app) => {

    app.use(function (req, res, next) {

        // Website you wish to allow to connect
        res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
    
        // Request methods you wish to allow
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    
        // Request headers you wish to allow
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    
        // Set to true if you need the website to include cookies in the requests sent
        // to the API (e.g. in case you use sessions)
        res.setHeader('Access-Control-Allow-Credentials', true);
    
        // Pass to next layer of middleware
        next();
    });

    app.get('/api', (req, res) => res.status(200).send({
        message: 'Welcome !',
    }));


    app.post('/api/inscription', usersController.inscription);
    app.post('/api/send', usersController.send);
    app.get('/api/verify', usersController.verify);
    app.post('/api/login', usersController.connexion);

    app.get('/api/article', billetController.list);
    app.get('/api/article/:idBillet', billetController.retrieve);

    app.use(function(req, res, next) {

        // check header or url parameters or post parameters for token
        let token = req.body.token || req.query.token || req.headers['x-access-token'];

        // decode token
        if (token) {

            // verifies secret and checks exp
            jwt.verify(token, cfg.secret, function(err, decoded) {
                if (err) {
                    return res.json({ success: false, message: 'Failed to authenticate token.' });
                } else {
                    // if everything is good, save to request for use in other routes
                    req.decoded = decoded;
                    next();
                }
            });

        } else {

            // if there is no token
            // return an error
            return res.status(403).send({
                success: false,
                message: 'No token provided.'
            });

        }
    });

    app.get('/api/user/profil', usersController.profil);
    app.put('/api/user/profil/update', usersController.updateProfil);
    app.delete('/api/user/profil/delete', usersController.destroyProfil);

    app.post('/api/article/:idBillet/comments', commentController.create);
    app.put('/api/article/:idBillet/comments/:idComment', commentController.update);

    app.use(function(req, res, next) {

        if (req.decoded) {

                if (req.decoded.admin === true){
                    next()
                } else {

                    return res.status(401).send({
                        success: false,
                        message: 'Have dont you acces to this page !'
                    });

                }

        } else {

            return res.status(403).send({
                success: false,
                message: 'No token provided.'
            });

        }
    });

    app.get('/api/user', usersController.list);
    app.get('/api/user/admin', usersController.listAdmin);
    app.post('/api/user/add', usersController.create);
    app.put('/api/user/:idUser', usersController.update);
    app.delete('/api/user/:idUser/delete', usersController.destroy);

    app.post('/api/article/add', upload.single('picture'), billetController.create);
    app.put('/api/article/:idBillet', billetController.update);
    app.delete('/api/article/:idBillet', billetController.destroy);

};
