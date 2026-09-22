import express from 'express';
// node:url 모듈의 fileURLToPath 함수는 URL 형식의 경로를 운영체제의 파일 경로로 바꾸는 함수
import { fileURLToPath } from 'node:url';
// 게시판 Router 가져오기.
import { router } from './posts.routes.js';
// 일반적인 JavaScript오류는 그냥 throw new Error('메시지')로 발생시키지만, HTTP 요청 처리 중 발생한 오류는 HTTP 상태 코드와 메시지를 함께 전달하는 것이 좋음.
import { HttpError } from './input.js';

// Express 서버를 생성, app은 앞으로 서버의 설정을 담당하는 객체
const app = express();
// express.json() 미들웨어를 사용하여 요청 본문을 JSON으로 파싱하도록 설정. limit 옵션은 요청 본문의 최대 크기를 제한.
app.use(express.json({ limit: '100kb' }));
// router를 /api/posts 경로에 연결. 즉, /api/posts로 시작하는 요청은 router에서 정의한 규칙에 따라 처리됨.
app.use('/api/posts', router);
// Vue 패키지의 브라우저 모듈을 로컬에서 제공합니다.
// import.meta.url -> new URL(...) -> file:// 형태의 URL -> fileURLToPath() -> 실제 파일 경로 -> res.sendFile()
app.get('/vendor/vue.js', (req, res) => {
    // Express가 해당 파일을 HTTP응답으로 보내는 함수. 즉 Get/vendor/vue.js 요청이 들어오면 실제로는 node_modules/vue/dist/vue.esm-browser.prod.js 를 전달
    res.sendFile(fileURLToPath(
        new URL('../node_modules/vue/dist/vue.esm-browser.prod.js', import.meta.url),
    ), { dotfiles: 'allow' });
});
// public 폴더를 정적 파일 제공 경로로 설정. public 폴더 안에 있는 HTML, CSS, JS 파일을 브라우저에서 직접 접근 가능하도록 함. 예를 들어 public/index.html 파일은 http://
app.use(express.static(fileURLToPath(new URL('../public', import.meta.url))));
app.use((req, res, next) => next(new HttpError(404, '경로를 찾을 수 없습니다.')));
app.use((err, req, res, next) => {
    const status = Number.isInteger(err.status) && err.status >= 400 && err.status <= 599
        ? err.status : 500;
    if (status >= 500) console.error(err);
    const message = status >= 500 ? '서버 처리 중 오류가 발생했습니다.'
        : err.type === 'entity.parse.failed' ? '올바른 JSON이 필요합니다.' : err.message;
    res.status(status).json({ statusCode: status, message });
});
app.listen(Number(process.env.PORT ?? 3000), '127.0.0.1', () => {
    console.log(`게시판: http://127.0.0.1:${process.env.PORT ?? 3000}`);
});

// 1. express 서버 만들기
// express: Node.js에서 웹 서버를 쉽게 만들 수 있도록 도와주는 프레임워크
// 예를 들어 순수 Node.js만 사용하면 HTTP 요청을 직접 처리해야 하지만 Express를 사용하면 간단하게 URL별 동작을 정의할 수 있음. 
// 
/*
 요청 처리 규칙 등록
        ├─ JSON 처리
        ├─ /api/posts → 게시판 API
        ├─ /vendor/vue.js → Vue 제공
        └─ /public → HTML/CSS/JS 제공
*/ 
// 오류 처리
// 서버 실행
