# Vue + Express 게시판

JavaScript 기반의 Vue 3 프론트엔드와 Node.js·Express 5 백엔드입니다. TypeORM EntitySchema와 SQLite(sql.js)를 사용합니다.

## 실행

Node.js 20.19 이상이 필요합니다. 이 폴더에서 다음을 실행합니다.

```sh
npm ci
npm start
```

브라우저에서 **http://127.0.0.1:3000**을 엽니다. Vue 화면에서 등록, 목록·상세 조회, 수정, 삭제를 할 수 있습니다. API 주소는 **http://127.0.0.1:3000/api/posts**입니다.

첫 npm ci는 인터넷 연결이 필요합니다. Vue 브라우저 모듈도 설치한 패키지에서 로컬로 제공하므로 설치 이후에는 외부 CDN 연결 없이 동작합니다. 이 예제는 빌드 도구 없이 Composition API와 HTML 템플릿으로 시작합니다.

서버와 프론트엔드를 같은 출처에서 제공합니다. Vue는 상대 경로 `/api/posts`로 요청합니다. 별도 프론트 개발 서버나 CORS 설정이 필요하지 않습니다.

개발 중에는 `npm run dev`를 사용하면 서버 파일 변경 시 Node watch 모드가 재시작합니다. 화면 파일은 수정 후 브라우저를 새로고침합니다. 이 예제는 별도 빌드 단계가 없습니다.

## 파일 구조

| 파일 | 역할 |
|---|---|
| server/main.js | Express 시작, JSON 파싱, Vue 제공, 오류 처리 |
| server/posts.routes.js | HTTP 메서드·경로와 Service 연결 |
| server/posts.service.js | 게시글 CRUD 함수 |
| server/input.js | ID와 등록·수정 입력 검사 |
| server/post.entity.js | EntitySchema 저장 모델 |
| server/database.js | TypeORM 연결과 Repository |
| server/migration.js | 초기 테이블 생성 |
| public/index.html | Vue 템플릿과 폼 |
| public/app.js | Vue 상태, fetch, 등록·수정·삭제 |
| public/style.css | 게시판 화면 스타일 |
| requests.http | 개별 HTTP 요청 예제 |
| demo.mjs | 실제 API의 CRUD 순차 실행 |

## API 명세

| 기능 | Method | URL | 성공 응답 |
|---|---|---|---|
| 등록 | POST | /api/posts | 201, 생성 객체, Location 헤더 |
| 목록 | GET | /api/posts | 200, ID 내림차순 배열 |
| 상세 | GET | /api/posts/:id | 200, 게시글 객체 |
| 일부 수정 | PATCH | /api/posts/:id | 200, 수정한 객체 |
| 삭제 | DELETE | /api/posts/:id | 204, 본문 없음 |

등록 입력은 title과 content입니다. title은 앞뒤 공백 제거 후 1–100자, content는 1–10,000자이며 유니코드 코드 포인트 수로 계산합니다. 입력 함수는 추가 필드를 거부하고 서버가 id·createdAt·updatedAt을 생성합니다. 수정에서는 최소 한 필드를 전달해야 하며 생략한 값은 유지합니다. null·숫자·공백뿐인 문자열은 허용하지 않습니다.

ID는 안전한 정수 형식입니다. 잘못된 형식은 400, 정수지만 해당 글이 없으면 404입니다. 같은 삭제 요청을 반복하면 첫 요청은 204, 이후에는404입니다. 목록이 비어 있으면200과[]입니다. 검색·페이지네이션·로그인은 이번 구현 범위에 포함하지 않습니다.

요청 JSON 예시:

```json
{"title":"첫 게시글","content":"웹서비스설계 실습입니다."}
```

생성 응답은 id, title, content, createdAt, updatedAt을 포함합니다. ID와 시각은 실제 실행 시 정해집니다. 오류 응답 형식:

```json
{"statusCode":404,"message":"게시글을 찾을 수 없습니다."}
```

## API만 실행해보기

서버를 유지하고 새 터미널에서 다음을 실행합니다.

```sh
node demo.mjs
```

스크립트가 글 한 건을 만들고 조회·수정한 뒤 그 글만 삭제합니다. Windows·macOS·Linux에서 같은 명령을 사용합니다. 개별 요청은 requests.http를 지원하는 편집기에서도 보낼 수 있습니다.

## Vue 화면의 데이터 흐름

입력값을 v-model로 상태와 연결합니다. 저장할 때 fetch로 JSON을 보내고, 성공 응답을 상세 상태에 넣은 뒤 목록을 다시 조회합니다. 수정과 삭제도 같은 API 계약을 사용합니다. 처리 중에는 버튼을 비활성화합니다. 서버 오류는 화면에 표시합니다. Vue 텍스트 보간으로 사용자 내용을 표시하며 HTML로 삽입하지 않습니다.

request 함수는 204에서 JSON 파싱을 건너뜁니다. 서버의 400·404 응답도 fetch 자체는 성공적으로 수신할 수 있으므로 response.ok로 구분합니다.

## DB 저장과 스키마

`posts.sqlite`에 저장하므로 서버를 재시작해도 데이터가 남습니다. 초기화 시 미실행 마이그레이션만 적용합니다. synchronize는 false입니다. 모델 변경 시 새 마이그레이션을 추가해야 합니다.

처음부터 실습하려면 서버를 종료하고 기존 posts.sqlite를 다른 이름으로 옮겨 보관한 뒤 재시작합니다. 파일을 지울 필요는 없습니다.

이 예제는 내 컴퓨터의127.0.0.1에서 단일 서버 프로세스로 실행합니다. 여러 서버가 같은 sql.js 파일을 동시에 수정하는 운영 구성이 아닙니다.

## 실행 문제

- 3000 포트 사용 중: 기존 실습 서버를 종료하고 다시 실행합니다.
- 모듈 없음: 이 폴더에서 npm ci를 실행합니다.
- 서버 코드가 반영되지 않음: 다시 시작하거나 npm run dev를 사용합니다.
- 빈 화면: 서버 주소로 접속합니다. public/index.html을 파일로 직접 열지 않습니다.

## 공식 문서

- [Express Routing](https://expressjs.com/en/guide/routing.html)
- [Express 오류 처리](https://expressjs.com/en/guide/error-handling.html)
- [Vue 시작하기](https://vuejs.org/guide/quick-start.html)
- [Vue 반응형 상태](https://vuejs.org/guide/essentials/reactivity-fundamentals.html)
- [TypeORM EntitySchema](https://typeorm.io/docs/entity/separating-entity-definition/)
