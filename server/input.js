export class HttpError extends Error {
    constructor(status, message) {
        super(message);
        this.status = status;
    }
}

export function readId(value) {
    if (!/^-?\d+$/.test(value) || !Number.isSafeInteger(Number(value))) {
        throw new HttpError(400, 'ID는 안전한 정수여야 합니다.');
    }
    return Number(value);
}

export function readPost(body, partial = false) {
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
        throw new HttpError(400, 'JSON 객체가 필요합니다.');
    }
    const allowed = ['title', 'content'];
    if (Object.keys(body).some(key => !allowed.includes(key))) {
        throw new HttpError(400, 'title과 content만 입력할 수 있습니다.');
    }
    const result = {};
    for (const key of allowed) {
        if (partial && body[key] === undefined) continue;
        const value = body[key];
        const max = key === 'title' ? 100 : 10000;
        if (typeof value !== 'string') {
            throw new HttpError(400, `${key}는 문자열이어야 합니다.`);
        }
        const trimmed = value.trim();
        const length = [...trimmed].length;
        if (length < 1 || length > max) {
            throw new HttpError(400, `${key}는 1–${max}자여야 합니다.`);
        }
        result[key] = trimmed;
    }
    if (Object.keys(result).length === 0) {
        throw new HttpError(400, '수정할 필드가 필요합니다.');
    }
    return result;
}
