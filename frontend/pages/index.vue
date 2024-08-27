<template>
  <body class="font-mono">
    <div :class="blurClass" class="flex justify-start xl:justify-center items-center h-screen bg-white/30 transition-all duration-500">
      <div class="flex justify-center items-start flex-col p-6">
        <h1 class="text-xl text-violet-600 font-bold">🥃  {{ isAuthenticated ? username : 'Please Login or Signup' }}</h1>
        <h1 class="text-6xl font-bold mb-8">Nuxt3 + Fastapi <br> Login Template</h1>
        <p class="text-lg mb-4 w-1/2 min-w-96">This is a login example template built with Nuxt3 and FastAPI. You can use this template as a starting point to build your own application.</p>
        <p v-if="!isAuthenticated" class="text-lg text-violet-600 font-bold mb-4">Click the buttons below to log in or sign up for a new account.</p>
        <div v-if="!isAuthenticated" class="flex flex-row">
          <button @click="handleLoginClick" class="flex items-center justify-center w-20 p-2 m-2 bg-zinc-700 text-white text-center rounded-lg shadow-md">Login ❯</button>
          <NuxtLink to="/SignUp" class="flex items-center justify-center w-20 p-2 m-2 text-black text-center border rounded-lg bg-white opacity-65 hover:opacity-100">Sign up</NuxtLink>
        </div>
        <div v-else>
          <p class="text-lg text-violet-600 font-bold mb-4">Click the buttons below to view your profile.</p>
          <NuxtLink to="/PersonalHomepage" class="flex items-center justify-center w-20 p-2 m-2 text-black text-center border rounded-lg bg-white opacity-65 hover:opacity-100">Profile</NuxtLink>
        </div>
      </div>
    </div>
  </body>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const blurClass = ref('backdrop-blur-none');
const isAuthenticated = ref(false);
const username = ref('');
const router = useRouter();

onMounted(async () => {
  const token = localStorage.getItem('token');
  if (token) {
    isAuthenticated.value = true;
    const response = await $fetch('http://localhost:3000/api/profile', {
      method: 'GET',
      headers: {
        'Authorization': token, // Standard Bearer token format
        'Content-Type': 'application/json'
      }
    });

    if (response.user) {
      username.value = response.user.username;
    }
  }
  
  setTimeout(() => {
    blurClass.value = 'backdrop-blur-sm';
  }, 500);
});

const handleLoginClick = () => {
  const token = localStorage.getItem('token');
  if (token) {
    router.push('/PersonalHomepage');
  } else {
    router.push('/SignIn');
  }
};
</script>

<style scoped>
.transition-all {
  transition: all 0.5s ease-in-out;
}
</style>
