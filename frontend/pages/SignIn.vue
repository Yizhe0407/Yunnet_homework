<template>

    <body class="font-mono">
        <div class="flex justify-center items-center h-screen">
            <div class="absolute top-0 left-0 p-8">
                <BackToHome />
            </div>
            <div
                class="flex justify-center items-center flex-col w-96 p-6 backdrop-blur-sm bg-white/30 rounded-2xl shadow-lg">
                <h1 class="text-2xl font-semibold mb-6">Sign in</h1>
                <div v-if="errorMessage"
                    class="flex items-center justify-between p-2 mb-4 w-64 text-sm text-red-700 font-semibold border border-red-400 rounded-lg bg-gradient-to-r from-rose-200 to-rose-50">
                    {{ "⚠️ " + errorMessage }}
                    <button @click="clearErrorMessage"
                        class="p-1 w-6 h-6 flex items-center justify-center rounded bg-transparent hover:bg-rose-200">✕</button>
                </div>
                <input v-model="user.email" placeholder="Email address"
                    class="mb-4 p-2 w-64 border rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:border-blue-500" />
                <input type="password" v-model="user.password" placeholder="Password"
                    class="mb-6 p-2 w-64 border rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:border-blue-500" />
                <button @click="submit"
                    class="mb-4 w-64 p-2 bg-blue-400 hover:bg-blue-500 text-white rounded-lg shadow-md"
                    :disabled="loading">
                    Sign in
                </button>
                <button class="mb-6 text-xs text-stone-300">Forgot your password?</button>
                <h1 class="mb-4 text-base">Don’t have account?</h1>
                <NuxtLink to="/SignUp" class="text-center bg-white p-2 w-64 border rounded-lg shadow hover:shadow-lg">
                    Create new account</NuxtLink>

            </div>
        </div>
    </body>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const handleKeydown = (event) => {
    if (event.code === 'Enter') {
        submit()
    }
};

onMounted(() => {
    window.addEventListener('keydown', handleKeydown, false);
});

onBeforeUnmount(() => {
    window.removeEventListener('keydown', handleKeydown, false);
});

const user = ref({
    email: '',
    password: ''
})

const errorMessage = ref('')
const loading = ref(false)
const router = useRouter()


const submit = async () => {
    if (!user.value.email || !user.value.password) {
        errorMessage.value = 'Fields required';
        return;
    }

    try {
        errorMessage.value = '';
        loading.value = true; // 在加载时禁用按钮
        const data = await $fetch('http://localhost:3000/api/login', { // 更新端点
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: { email: user.value.email, password: user.value.password }
        });
        if (data.token) {
            localStorage.setItem('token', data.token);
            router.push({
                path: '/PersonalHomepage'
            });
        } else {
            errorMessage.value = data.error || 'Login failed';
        }
    } catch (error) {
        console.error('Error:', error);
        errorMessage.value = 'Login failed';
    } finally {
        loading.value = false;
    }
};

const clearErrorMessage = () => {
    errorMessage.value = ''
}
</script>
