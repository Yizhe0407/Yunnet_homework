<template>
  <div class="h-screen bg-gray-800 flex items-center justify-center">
    <div class="text-center">
      <p class="text-white mb-4">Press any key and check the console for events.</p>
      <p v-if="message" class="text-white text-lg">{{ message }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';

const message = ref('');

const handleKeydown = (event) => {
  console.log(event.code);
  if (event.code === 'Enter') {
    message.value = 'Enter key was pressed!';
  }
};

onMounted(() => {
  window.addEventListener('keydown', handleKeydown, false);
});

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown, false);
});
</script>