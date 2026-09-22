// 실행 중인 로컬 API에 게시글 한 건을 만들고 수정한 다음 삭제합니다.
const base = 'http://127.0.0.1:3000/api/posts';
async function request(method, path = '', body) {
    const response = await fetch(base + path, {
        method,
        headers: body ? { 'Content-Type': 'application/json' } : {},
        body: body ? JSON.stringify(body) : undefined,
    });
    const raw = await response.text();
    console.log(`${method} ${path || '/'} -> ${response.status}`);
    console.log(raw || '(응답 본문 없음)');
    if (response.status >= 400) throw new Error(raw);
    return raw ? JSON.parse(raw) : undefined;
}
const post = await request('POST', '', { title: '첫 게시글', content: '웹서비스설계 실습입니다.' });
await request('GET');
await request('GET', `/${post.id}`);
await request('PATCH', `/${post.id}`, { title: '수정한 제목' });
await request('DELETE', `/${post.id}`);
