<template>
  <div class="min-h-screen flex items-center justify-center p-4 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black relative overflow-hidden">
    <!-- Decorative background blobs -->
    <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none"></div>
    <div class="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

    <div class="max-w-md w-full relative z-10">
      <!-- Header / Logo -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-tr from-red-600 to-red-500 shadow-xl shadow-red-500/25 mb-4 group hover:scale-105 transition-transform duration-300">
          <img 
            src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/ultra-ball.png" 
            alt="Pokeball" 
            class="w-12 h-12 filter drop-shadow"
          />
        </div>
        <h1 class="text-3xl font-black tracking-tight bg-gradient-to-r from-red-400 via-amber-300 to-yellow-400 bg-clip-text text-transparent">
          PokéDashboard
        </h1>
        <p class="text-xs text-slate-400 mt-2 font-mono">
          LDAP Authentication &nbsp;•&nbsp; JWT Injection &nbsp;•&nbsp; Pinia
        </p>
      </div>

      <!-- Login Card -->
      <div class="bg-slate-900/90 border border-slate-800 rounded-3xl p-8 shadow-2xl backdrop-blur-xl">
        <div class="mb-6 pb-4 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h2 class="text-lg font-bold text-slate-100">Sign In</h2>
            <p class="text-xs text-slate-400 mt-0.5">Enter your LDAP directory credentials</p>
          </div>
          <span class="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono flex items-center gap-1.5">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            LDAP :389
          </span>
        </div>

        <!-- Error Message -->
        <div 
          v-if="errorMessage" 
          class="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-start gap-3 animate-in fade-in slide-in-from-top-2"
        >
          <svg class="w-5 h-5 text-red-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div>
            <p class="font-bold text-red-400">Authentication Error</p>
            <p class="mt-0.5">{{ errorMessage }}</p>
          </div>
        </div>

        <!-- Form -->
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div>
            <label class="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 font-mono">
              LDAP Username (UID)
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <input
                v-model="username"
                type="text"
                required
                placeholder="e.g. alice"
                class="w-full bg-slate-950/80 border border-slate-700/80 focus:border-red-500 focus:ring-1 focus:ring-red-500 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-100 placeholder-slate-500 transition-all"
              />
            </div>
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 font-mono">
              Password
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <input
                v-model="password"
                type="password"
                required
                placeholder="••••••••"
                class="w-full bg-slate-950/80 border border-slate-700/80 focus:border-red-500 focus:ring-1 focus:ring-red-500 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-100 placeholder-slate-500 transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            :disabled="authStore.loading"
            class="w-full mt-2 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-red-500/25 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            <svg 
              v-if="authStore.loading" 
              class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" 
              fill="none" 
              viewBox="0 0 24 24"
            >
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span v-if="!authStore.loading">Sign In with LDAP</span>
            <span v-else>Authenticating with LDAP...</span>
            <svg v-if="!authStore.loading" class="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </form>

        <!-- Quick Demo Accounts -->
        <div class="mt-8 pt-6 border-t border-slate-800">
          <p class="text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-3 text-center">
            Demo Credentials (LDAP Lab)
          </p>
          <div class="grid grid-cols-2 gap-2.5">
            <button
              @click="setDemoUser('alice', 'alice123')"
              type="button"
              class="p-2.5 rounded-xl bg-slate-950/60 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-left transition-colors group"
            >
              <div class="flex items-center justify-between">
                <span class="text-xs font-bold text-slate-200 group-hover:text-amber-300">alice</span>
                <span class="text-[10px] text-slate-500 font-mono">LDAP</span>
              </div>
              <span class="text-[10px] text-slate-400 font-mono block mt-0.5">pass: alice123</span>
            </button>

            <button
              @click="setDemoUser('bob', 'bob123')"
              type="button"
              class="p-2.5 rounded-xl bg-slate-950/60 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-left transition-colors group"
            >
              <div class="flex items-center justify-between">
                <span class="text-xs font-bold text-slate-200 group-hover:text-amber-300">bob</span>
                <span class="text-[10px] text-slate-500 font-mono">LDAP</span>
              </div>
              <span class="text-[10px] text-slate-400 font-mono block mt-0.5">pass: bob123</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const username = ref('alice')
const password = ref('alice123')
const errorMessage = ref('')

function setDemoUser(u, p) {
  username.value = u
  password.value = p
  errorMessage.value = ''
}

async function handleSubmit() {
  errorMessage.value = ''
  const result = await authStore.login(username.value, password.value)
  if (result.success) {
    router.push('/dashboard')
  } else {
    errorMessage.value = result.error || 'Invalid credentials or LDAP server error'
  }
}
</script>
