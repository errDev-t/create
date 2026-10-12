<script setup lang="ts">
    import App from './App.vue'
    import ErrorBoundary from './components/ErrorBoundary.vue'
</script>

<template>
    <ErrorBoundary>
        <App />
    </ErrorBoundary>
</template>