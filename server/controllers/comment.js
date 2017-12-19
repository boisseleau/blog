const Comments = require('../models').Comments;

module.exports = {
    create(req, res) {
        return Comments
            .create({
                author: req.body.author,
                comment: req.body.comment,
                billetId: req.params.idBillet,
            })
            .then(comment => res.status(201).send(comment))
            .catch(error => res.status(400).send(error));
    },

    update(req, res) {
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
                    .update({
                        content: req.body.content || todoItem.content,
                        complete: req.body.complete || todoItem.complete,
                    })
                    .then(updatedTodoItem => res.status(200).send(updatedTodoItem))
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
