<template>
    <div class="text-center mb-8">
      <h1 class="text-3xl font-bold mb-2">{{ name }}</h1>
      <p class="text-gray-600">{{ email }}</p>
    </div>
  </template>
  
  <script setup>
  import { defineProps } from 'vue';
  
  const props = defineProps({
    name: String,
    email: String,
  });
  </script>
  