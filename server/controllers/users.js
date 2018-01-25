const Users = require('../models').User;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cfg = require('../../config');



module.exports =  {
    connexion(req, res){
        console.log('entré');
        if (req.body.email && req.body.password) {
            let email = req.body.email;
            let password = req.body.password;

            Users.findAll({
                where: {
                    email: email,
                }
            }).then(user => {

                bcrypt.compare(password, user[0].dataValues.password).then(compare => {
                    console.log('la response',compare);

                    if (user && compare === true) {
                        let payload = {
                            id: user[0].dataValues.id,
                            admin: user[0].dataValues.admin,
                        };
                        console.log('fffffffffffffffffffffdsssssssssss',payload);
                        let token = jwt.sign(payload, cfg.secret, {
                            expiresIn: 60 * 120 // expires in 24 hours
                        });
                        console.log(token);
                        res.json({
                            success: true,
                            message: 'Enjoy your token!',
                            token: token
                        });
                    } else {
                        res.status(401).send({message: 'Mot de passe incorrecte '});
                    }

                }).catch(error => {console.log(error); res.status(400).send(error)});
            }).catch(error => {console.log(error); res.status(400).send(error)});
        } else {
            res.sendStatus(401);
        }
    },

    create(req, res) {

        jwt.verify(req.query.token, cfg.secret, function(err, decoded) {
            if(err){res.status(400).send(err);}
            if (decoded.admin === true) {
                let password = req.body.password;
                bcrypt.hash(password, 5).then(hashPassword => {
                    return Users
                        .create({
                            username: req.body.username,
                            email: req.body.email,
                            password: hashPassword,
                            admin: req.body.admin
                        })
                        .then(user => res.status(201).send(user))
                        .catch(error => res.status(400).send(error));
                })
                    .catch(error => res.status(201).send(error));
            } else {
                res.sendStatus(401);
            }
        })
    },

    inscription(req, res) {
        let password =  req.body.password;
        bcrypt.hash(password, 5).then(hashPassword => {
            return Users
                .create({
                    username: req.body.username,
                    email: req.body.email,
                    password: hashPassword,
                    admin: 0,
                })
                .then(user => res.status(201).send(user))
                .catch(error => res.status(400).send(error));
        })
            .catch(error => res.status(201).send(error));
    },

    list(req, res) {
        return Users
            .findAll({})
            .then(users => res.status(200).send(users[0]))
            .catch(error => res.status(400).send(error));
    },

    listAdmin(req, res) {
        jwt.verify(req.query.token, cfg.secret, function(err, decoded) {
            if(err){res.status(400).send(err);}
            if(decoded.admin === true) {
                return Users
                    .findAll({
                        where: {
                            admin: true,
                        }
                    })
                    .then(users => res.status(200).send(users[0]))
                    .catch(error => res.status(400).send(error));
            } else {
                res.sendStatus(401);
            }
        });
    },

    profil(req, res) {
    //    jwt.verify(req.query.token, cfg.secret, function(err, decoded) {
   //         if(err){res.status(400).send(err);}
        console.log(req.decoded.id, ': req.decoded.id');
        return Users
            .findById(req.decoded.id)
            .then(user => {
                if (!user) {
                    return res.status(404).send({
                        message: 'User Not Found',
                    });
                }
                return res.status(200).send(user);
            })
            .catch(error => res.status(400).send(error));
   // })
    },

    updateProfil(req, res) {

                return Users
                    .findById(req.decoded.id)
                    .then(user => {
                        if (!user) {
                            return res.status(404).send({
                                message: 'User Not Found',
                            });
                        }
                        return user
                            .update({
                                username: req.body.username || user.dataValues.username,
                                email: req.body.email || user.dataValues.email,
                            })
                            .then(() => res.status(200).send(user))
                            .catch((error) => {console.log(error); res.status(400).send(error)});
                    })
                    .catch((error) => {console.log(error); res.status(400).send(error)});
    },

    update(req, res) {

                return Users
                    .findById(req.params.idUser)
                    .then(user => {
                        if (!user) {
                            return res.status(404).send({
                                message: 'User Not Found',
                            });
                        }
                        return user
                            .update({
                                username: req.body.username || user.dataValues.username,
                                email: req.body.email || user.dataValues.email,
                                admin: req.body.admin || user.dataValues.admin
                            })
                            .then(() => res.status(200).send(user))  // Send back the updated todo.
                            .catch((error) => {console.log(error); res.status(400).send(error)});
                    })
                    .catch((error) => {console.log(error); res.status(400).send(error)});
    },

    destroy(req, res) {

                return Users
                    .findById(req.params.idUser)
                    .then(user => {
                        if (!user) {
                            return res.status(400).send({
                                message: 'User Not Found',
                            });
                        }
                        return user
                            .destroy()
                            .then(() => res.status(204).send())
                            .catch(error => res.status(400).send(error));
                    })
                    .catch(error => res.status(400).send(error));
    },

    destroyProfil(req, res) {

                return Users
                    .findById(req.decoded.id)
                    .then(user => {
                        if (!user) {
                            return res.status(400).send({
                                message: 'User Not Found',
                            });
                        }
                                return user
                                    .destroy()
                                    .then(() => res.status(204).send())
                                    .catch(error => res.status(400).send(error));
                    })
                    .catch(error => res.status(400).send(error));
    },
};/**
 * Created by Klaaw on 04/12/2017.
 */
