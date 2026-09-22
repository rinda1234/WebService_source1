import { createApp, ref, onMounted } from '/vendor/vue.js';

createApp({
    setup() {
        const posts = ref([]);
        const selected = ref(null);
        const title = ref('');
        const content = ref('');
        const editingId = ref(null);
        const busy = ref(false);
        const error = ref('');
        const notice = ref('');

        async function request(path = '', options = {}) {
            const response = await fetch('/api/posts' + path, {
                ...options,
                headers: { 'Content-Type': 'application/json' },
            });
            if (response.status === 204) return null;
            const data = await response.json();
            if (!response.ok) throw new Error(data.message ?? '요청에 실패했습니다.');
            return data;
        }
        async function run(action) {
            if (busy.value) return;
            busy.value = true;
            error.value = '';
            notice.value = '';
            try { await action(); }
            catch (err) { error.value = err.message; }
            finally { busy.value = false; }
        }
        const load = () => run(async () => { posts.value = await request(); });
        const openPost = id => run(async () => { selected.value = await request(`/${id}`); });
        function resetForm() {
            editingId.value = null;
            title.value = '';
            content.value = '';
        }
        function editPost() {
            editingId.value = selected.value.id;
            title.value = selected.value.title;
            content.value = selected.value.content;
        }
        const savePost = () => run(async () => {
            const id = editingId.value;
            const saved = await request(id === null ? '' : `/${id}`, {
                method: id === null ? 'POST' : 'PATCH',
                body: JSON.stringify({ title: title.value, content: content.value }),
            });
            selected.value = saved;
            resetForm();
            posts.value = await request();
            notice.value = id === null ? '게시글을 등록했습니다.' : '게시글을 수정했습니다.';
        });
        const removePost = () => run(async () => {
            const id = selected.value.id;
            await request(`/${id}`, { method: 'DELETE' });
            selected.value = null;
            if (editingId.value === id) resetForm();
            posts.value = await request();
            notice.value = '게시글을 삭제했습니다.';
        });
        onMounted(load);
        return { posts, selected, title, content, editingId, busy, error, notice,
            load, openPost, resetForm, editPost, savePost, removePost };
    },
}).mount('#app');
