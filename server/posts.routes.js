import { Router } from 'express';
import { readId, readPost } from './input.js';
import { createPost, listPosts, findPost,
    updatePost, deletePost } from './posts.service.js';

export const router = Router();
router.param('id', (req, res, next, value) => {
    req.postId = readId(value);
    next();
});

router.post('/', async (req, res) => {
    const input = readPost(req.body);
    const post = await createPost(input);
    res.status(201).location(`/api/posts/${post.id}`).json(post);
});

router.get('/', async (req, res) => {
    res.json(await listPosts());
});

router.get('/:id', async (req, res) => {
    res.json(await findPost(req.postId));
});

router.patch('/:id', async (req, res) => {
    const input = readPost(req.body, true);
    res.json(await updatePost(req.postId, input));
});

router.delete('/:id', async (req, res) => {
    await deletePost(req.postId);
    res.status(204).end();
});
