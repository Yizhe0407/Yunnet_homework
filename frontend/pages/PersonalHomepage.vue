// PersonalHomepage.vue
<template>
  <div class="font-mono min-h-screen bg-gradient-to-bl from-cyan-50 to-amber-50 p-10">
    <div class="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8">
      <NuxtLink to="/" class="flex  text-sky-500 font-bold drop-shadow-md">
        <img src="/public/home.svg" />home
      </NuxtLink>
      <ProfileCard v-if="success" :name="name" :email="email" />
      <div v-if="loading" class="text-gray-500 text-center">Loading...</div>
      <div v-if="error" class="text-red-500 text-center">
        {{ error }}
        <button @click="redirectToSignIn" class="mt-4 w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500">
          Sign In
        </button>
      </div>

      <!-- Logout Button -->
      <button v-if="success" @click="logout" class="flex justify-center mt-4 w-full py-2 bg-red-600 text-white rounded-lg hover:bg-red-500">
        <img src="/public/logout.svg" />Logout
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import ProfileCard from '@/components/ProfileCard.vue'
import AboutMe from '@/components/AboutMe.vue'
import Skills from '@/components/Skills.vue'
import Projects from '@/components/Projects.vue'

const name = ref('')
const email = ref('')
const success = ref(false)
const loading = ref(true)
const error = ref('')

const router = useRouter()

const logout = () => {
  localStorage.removeItem('token'); // Remove the token
  success.value = false;
  router.push('/SignIn'); // Redirect to login page
}

const redirectToSignIn = () => {
  router.push('/SignIn'); // Redirect to SignIn page
}

onMounted(async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token found. Please log in.');
    }

    const response = await $fetch('http://localhost:3000/api/profile', {
      method: 'GET',
      headers: {
        'Authorization': token, // Standard Bearer token format
        'Content-Type': 'application/json'
      }
    });

    if (response.user) {
      success.value = true;
      name.value = response.user.username;
      email.value = response.user.email;
    } else {
      throw new Error('Failed to retrieve user data.');
    }
  } catch (err) {
    error.value = err.message || 'Failed to load profile. Please try again.';
    console.error('Error:', err);
  } finally {
    loading.value = false;
  }
});
</script>
