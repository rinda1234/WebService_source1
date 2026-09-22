import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Post } from './post.entity.js';
import { InitialPosts1789400000000 } from './migration.js';

export const db = new DataSource({
    type: 'sqljs',
    location: process.env.DATA_FILE ?? 'posts.sqlite',
    autoSave: true,
    entities: [Post],
    synchronize: false,
    migrations: [InitialPosts1789400000000],
    migrationsRun: true,
});
await db.initialize();
export const posts = db.getRepository(Post);
