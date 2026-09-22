import { EntitySchema } from 'typeorm';

export const Post = new EntitySchema({
    name: 'Post',
    tableName: 'posts',
    columns: {
        id: { type: Number, primary: true, generated: true },
        title: { type: 'text' },
        content: { type: 'text' },
        createdAt: { type: 'datetime', createDate: true },
        updatedAt: { type: 'datetime', updateDate: true },
    },
});
