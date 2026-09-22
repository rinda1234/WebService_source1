export class InitialPosts1789400000000 {
    async up(queryRunner) {
        await queryRunner.query(`
            CREATE TABLE "posts" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "title" text NOT NULL,
                "content" text NOT NULL,
                "createdAt" datetime NOT NULL DEFAULT (datetime('now')),
                "updatedAt" datetime NOT NULL DEFAULT (datetime('now'))
            )
        `);
    }
    async down(queryRunner) {
        await queryRunner.query('DROP TABLE "posts"');
    }
}
