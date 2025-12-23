<template>
  <div class="dashboard">
    <Sidebar />

    <main class="main-content">
      <Topbar />
      <StatsCards />
    </main>
  </div>
</template>

<script setup>
import Sidebar from '@/components/dashboard/Sidebar.vue'
import Topbar from '@/components/dashboard/Topbar.vue'
import StatsCards from '@/components/dashboard/Statscards.vue'
</script>

<style src="@/assets/css/dashboard.css"></style>
