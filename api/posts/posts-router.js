// implement your posts router here

const express = require('express');

const Post = require('./posts-model');

const router = express.Router();

router.get('/', (req, res) => {
    Post.find(req.query)
        .then(posts => {
            res.status(200).json(posts)
        })
        .catch(error => {
            res.status(500).json({
                message: "The posts information could not be retrieved",
                error: error.message
            });
        });
});

router.get('/:id', (req, res) => {
    Post.findById(req.params.id)
        .then(posts => {
            if (posts) {
                res.status(200).json(posts);
            } else {
                res.status(404).json({ message: "The post with the specified ID does not exist" })
            }
        })
        .catch(error => {
            res.status(500).json({
                message: "The post information could not be retrieved",
                error: error.message
            });
        });
});

router.post('/', (req, res) => {
    const { title, contents } = req.body;
    if (!title || !contents) {
        res.status(400).json(
            {
                message: "Please provide title and contents for the post"
            })
    } else {
        Post.insert({ title, contents })
            .then(({ id }) => {
                return Post.findById(id)
            })
            .then(posts => {
                res.status(201).json(posts)
            })
            .catch(error => {
                res.status(500).json({
                    message: "There was an error while saving the post to the database",
                    error: error.message
                });
            });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const posts = await Post.findById(req.params.id);
        if (!posts) {
            res.status(404).json(
                {
                    message: "The post with the specified ID does not exist"
                })
        } else {
            await Post.remove(req.params.id);
            res.status(200).json(posts);
        }
    } catch (error) {
        res.status(500).json({
            message: "The comments information could not be retrieved",
            error: error.message
        });
    }
});

router.put('/:id', (req, res) => {
    const { title, contents } = req.body;
    if (!title || !contents) {
        res.status(400).json(
            {
                message: "Please provide title and contents for the post"
            })
    } else {
        Post.findById(req.params.id)
            .then(stuff => {
                if (!stuff) {
                    res.status(404).json(
                        {
                            message: "The post with the specified ID does not exist"
                        })
                } else {
                    return Post.update(req.params.id, req.body)
                }
            })
            .then(data => {
                if (data) {
                    return Post.findById(req.params.id)
                }
            })
            .then(post => {
                if (post) {
                    res.json(post)
                }
            })
            .catch(error => {
                res.status(500).json({
                    message: "The post information could not be modified",
                    error: error.message
                });
            });
    }
});


router.get('/:id/comments', async (req, res) => {
    try {
        const posts = await Post.findById(req.params.id);
        if (!posts) {
            res.status(404).json(
                {
                    message: "The post with the specified ID does not exist"
                })
        } else {
            const stuff = await Post.findPostComments(req.params.id);
            res.status(200).json(stuff);
        }
    } catch (error) {
        res.status(500).json({
            message: "The comments information could not be retrieved",
            error: error.message
        });
    }
});

module.exports = router;
