const Users = require('../models').User;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cfg = require('../../config');
const nodemailer = require('nodemailer');
const Billet= require('../models').Billet;

let smtpTransport = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: "boisseleau85430@gmail.com",
        pass: "dsd445a889"
    }
});
let rand,mailOptions,host,link;



module.exports =  {
    connexion(req, res){
        if (req.body.email && req.body.password) {
            let email = req.body.email;
            let password = req.body.password;

            Users.findAll({
                where: {
                    email: email,
                }
            }).then(user => {

                bcrypt.compare(password, user[0].dataValues.password).then(compare => {

                    if (user && compare === true) {
                        let payload = {
                            id: user[0].dataValues.id,
                            admin: user[0].dataValues.admin,
                        };

                        let token = jwt.sign(payload, cfg.secret, {
                            expiresIn: 60 * 120 // expires in 24 hours
                        });

                        res.json({
                            success: true,
                            message: 'Enjoy your token!',
                            token: token
                        });
                    } else {
                        res.status(401).json({message: 'Mot de passe incorrecte '});
                    }

                }).catch(error =>  res.status(400).send(error));
            }).catch(error =>  res.status(400).send(error));
        } else 
        {
            res.status(401).json({
                success: false,
                error: 'Tout les champs doivent être rempli !',
                email:    req.body.email || '',
                password: req.body.password || ''
            });
        }
    },

    create(req, res) {
                if(req.body.username && req.body.email && req.body.password && req.body.admin){
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
            }else
            {
                res.status(401).json({
                    error: 'Tout les champs doivent être rempli !',
                    username: req.body.username || '',
                    email:    req.body.email || '',
                    password: req.body.password || '',
                    admin:    req.body.admin || ''
                });
            }
    },

    inscription(req, res) {

        if(req.body.username && req.body.email && req.body.password){
            let password =  req.body.password;
            let payload = {
                email: req.body.email,
            };

            let token = jwt.sign(payload, cfg.secret, {
                expiresIn: 60 * 120 // expires in 24 hours
            });

            bcrypt.hash(password, 5).then(hashPassword => {
                return Users
                    .create({
                        username: req.body.username,
                        email: req.body.email,
                        password: hashPassword,
                        admin: 0,
                        token: token,
                    })
                    .then(user =>  res.status(201).send(user))
                    .catch(error => res.status(400).send(error));
            })
                .catch(error => res.status(201).send(error));
         }else
            {
                res.status(401).json({
                    error: 'Tout les champs doivent être rempli !',
                    username: req.body.username || '',
                    email:    req.body.email || '',
                    password: req.body.password || '',
                });
            }
    },

    send(req, res) {

        Users.findAll({
            where: {
                email: req.body.email,
            }
        }).then(user => {
                    host=req.get('host');
                    link="http://"+req.get('host')+"/verify?id="+ user[0].dataValues.token;
                    mailOptions={
                        to : req.body.email,
                        subject : "Please confirm your Email account",
                        html : "Hello,<br> Please Click on the link to verify your email.<br><a href="+link+">Click here to verify</a>" 
                    }
                    console.log(mailOptions);
                    smtpTransport.sendMail(mailOptions, function(error, response){
                    if(error){
                            console.log(error);
                        res.end("error");
                    }else{
                            console.log("Message sent: " + response.message);
                        res.end("sent");
                        }
                    });
            }).catch(error => {console.log(error); res.status(400).send(error)});
    },

    verify(req, res){
       token = req.query.id;

       Users.findAll({
        where: {
            token: token,
        }
    }).then(user => {
        if (!user[0]) {
            return res.status(404).send({
                message: 'User Not Found',
            });
        }
        if(user[0].dataValues.token === token){
            return user[0]
                .update({
                    verif: 1,
                    token: null,
                    })
                .then(user => res.status(200).send({
                    message : 'Email verify true'
                }))
                .catch((error) =>  res.status(400).send(error));
        }else{
            return res.status(404).send({
                message: 'No token provided.',
            });
        }
    }).catch(error =>  res.status(400).send(error));

    },

    list(req, res) {
        return Users
            .findAll({
                include: [{
                    model: Billet,
                    as: 'billet',
                }],
            })
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
                            .then(user => res.status(200).send(user))
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
