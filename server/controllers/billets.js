const Billet= require('../models').Billet;
const Comments = require('../models').Comments;
const jwt = require('jsonwebtoken');
const cfg = require('../../config');


module.exports = {
    create(req, res) {
        jwt.verify(req.query.token, cfg.secret, function(err, decoded) {
            if(err){res.status(400).send(err);}
            return Billet
                .create({
                    picture: req.body.picture,
                    title: req.body.title,
                    content: req.body.content,
                    userId: decoded.id,
                })
                .then(billet => res.status(201).send(billet))
                .catch(error => res.status(400).send(error));
        })
    },

    list(req, res) {
        return Billet
            .findAll({
                include: [{
                    model: Comments,
                    as: 'comments',
                }],
            })
            .then(todos => res.status(200).send(todos))
            .catch(error => res.status(400).send(error));
    },

    retrieve(req, res) {
        console.log(req.params.idBillet);
        return Billet
            .findById(req.params.idBillet, {
                include: [{
                    model: Comments,
                    as: 'comments',
                }],
            })
            .then(billet => {
                if (!billet) {
                    return res.status(404).send({
                        message: 'Article Not Found',
                    });
                }
                return res.status(200).send(billet);
            })
            .catch(error => {console.log(error); res.status(400).send(error)});
    },

    update(req, res) {
        return Billet
            .findById(req.params.idBillet)
            .then(billet => {
                if (!billet) {
                    return res.status(404).send({
                        message: 'Article Not Found',
                    });
                }
                return billet
                    .update({
                        title: req.body.title || billet[0].title,
                        content: req.body.content || billet[0].content,
                    })
                    .then(billet => res.status(200).send(billet))
                    .catch((error) => res.status(400).send(error));
            })
            .catch((error) => {console.log(error); res.status(400).send(error)});
    },

    destroy(req, res) {
        return Billet
            .findById(req.params.idBillet)
            .then(billet => {
                if (!billet) {
                    return res.status(400).send({
                        message: 'Billet Not Found',
                    });
                }
                return billet
                    .destroy()
                    .then(() => res.status(204).send())
                    .catch(error => res.status(400).send(error));
            })
            .catch(error => res.status(400).send(error));
    },
};/**
 * Created by Klaaw on 01/12/2017.
 */
