import { posts } from './database.js';
import { HttpError } from './input.js';

export function createPost(input) {
    const post = posts.create({
        title: input.title,
        content: input.content,
    });
    return posts.save(post);
}

export function listPosts() {
    return posts.find({ order: { id: 'DESC' } });
}

export async function findPost(id) {
    const post = await posts.findOneBy({ id });
    if (!post) throw new HttpError(404, '게시글을 찾을 수 없습니다.');
    return post;
}

export async function updatePost(id, input) {
    const post = await findPost(id);
    if (input.title !== undefined) post.title = input.title;
    if (input.content !== undefined) post.content = input.content;
    return posts.save(post);
}

export async function deletePost(id) {
    const result = await posts.delete(id);
    if (!result.affected) {
        throw new HttpError(404, '게시글을 찾을 수 없습니다.');
    }
}
