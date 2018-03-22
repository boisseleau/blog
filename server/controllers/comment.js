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
            .then(comment => {console.log(comment); res.status(201).send(comment)})
            .catch(error => res.status(400).send(error));
    },

    update(req, res) {
        return Comments
            .find({
                where: {
                    id: req.params.commentId,
                    todoId: req.params.billetId,
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
        return TodoItem
            .find({
                where: {
                    id: req.params.todoItemId,
                    todoId: req.params.todoId,
                },
            })
            .then(todoItem => {
                if (!todoItem) {
                    return res.status(404).send({
                        message: 'TodoItem Not Found',
                    });
                }

                return todoItem
                    .destroy()
                    .then(() => res.status(204).send())
                    .catch(error => res.status(400).send(error));
            })
            .catch(error => res.status(400).send(error));
    },
};/**
 * Created by Klaaw on 01/12/2017.
 */
