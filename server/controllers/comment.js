const Comments = require('../models').Comments;

module.exports = {
    create(req, res) {
        return Comments
            .create({
                author: req.body.author,
                comment: req.body.comment,
                billetId: req.params.idBillet,
                userId: req.decoded.id,
            })
            .then(comment => res.status(201).send(comment))
            .catch(error => res.status(400).send(error));
    },

    update(req, res) {
        return Comments
            .find({
                where: {
                    id: req.params.commentId,
                    billetId: req.params.billetId,
                    userId: req.decoded.id,
                },
            })
            .then(comment => {
                if (!comment) {
                    return res.status(404).send({
                        message: 'Comment Not Found',
                    });
                }

                return comment
                    .update({
                        comment: req.body.comment || comment.comment,
                        author: req.body.author || comment.author,
                    })
                    .then(updatedComment => res.status(200).send(updatedComment))
                    .catch(error => res.status(400).send(error));
            })
            .catch(error => res.status(400).send(error));
    },

    destroy(req, res) {
        return Comments
            .find({
                where: {
                    id: req.params.commentId,
                    billetId: req.params.billetId,
                },
            })
            .then(comment => {
                if (!comment) {
                    return res.status(404).send({
                        message: 'comment Not Found',
                    });
                }

                return comment
                    .destroy()
                    .then(() => res.status(204).send())
                    .catch(error => res.status(400).send(error));
            })
            .catch(error => res.status(400).send(error));
    },
};/**
 * Created by Klaaw on 01/12/2017.
 */
