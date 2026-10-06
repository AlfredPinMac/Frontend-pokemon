<template>
  <header class="bg-slate-900/90 border-b border-slate-800 backdrop-blur-md sticky top-0 z-40">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- Brand / Logo -->
        <div class="flex items-center gap-3">
          <router-link to="/dashboard" class="flex items-center gap-3 group">
            <div class="relative w-10 h-10 flex items-center justify-center bg-gradient-to-tr from-red-600 to-red-500 rounded-xl shadow-lg shadow-red-500/20 group-hover:scale-105 transition-transform">
              <img 
                src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png" 
                alt="Pokeball" 
                class="w-7 h-7 drop-shadow"
              />
            </div>
            <div>
              <span class="text-xl font-bold bg-gradient-to-r from-red-400 via-amber-300 to-yellow-400 bg-clip-text text-transparent">
                PokéDashboard
              </span>
              <span class="hidden sm:inline-block ml-2 text-xs px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-400 font-mono">
                LDAP + JWT
              </span>
            </div>
          </router-link>
        </div>

        <!-- Navigation items -->
        <nav class="flex items-center gap-2 sm:gap-4">
          <router-link
            to="/dashboard"
            class="px-3.5 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2"
            :class="$route.name === 'Dashboard' ? 'bg-red-500/10 text-red-400 border border-red-500/30 shadow-sm' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            <span>Pokédex</span>
          </router-link>

          <router-link
            to="/pokemons/create"
            class="px-3.5 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2"
            :class="$route.name === 'AddPokemon' ? 'bg-red-500/10 text-red-400 border border-red-500/30 shadow-sm' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            <span>Nuevo Pokémon</span>
          </router-link>

          <!-- User Info & Logout -->
          <div class="flex items-center pl-2 sm:pl-4 border-l border-slate-800 gap-3">
            <!-- User Badge -->
            <div class="hidden md:flex flex-col items-end">
              <div class="flex items-center gap-1.5">
                <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span class="text-xs font-semibold text-slate-200 capitalize font-mono">{{ authStore.username }}</span>
              </div>
              <span class="text-[10px] text-slate-500 max-w-[140px] truncate" :title="authStore.userDn">
                {{ authStore.userDn || 'LDAP User' }}
              </span>
            </div>

            <!-- Token Inspect Button -->
            <button
              @click="showTokenModal = true"
              title="Inspeccionar JWT Token actual"
              class="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 border border-amber-500/30 text-xs font-mono flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
              <span>JWT</span>
            </button>

            <!-- Logout Button -->
            <button
              @click="handleLogout"
              class="p-2 rounded-lg bg-slate-800/80 hover:bg-red-500/20 text-slate-400 hover:text-red-400 border border-slate-700 hover:border-red-500/40 transition-all text-xs font-medium flex items-center gap-1"
              title="Cerrar sesión"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span class="hidden sm:inline">Salir</span>
            </button>
          </div>
        </nav>
      </div>
    </div>

    <!-- JWT Token Modal -->
    <div v-if="showTokenModal" class="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div class="bg-slate-900 border border-slate-700 rounded-2xl max-w-xl w-full p-6 shadow-2xl relative animate-in fade-in zoom-in duration-200">
        <div class="flex items-center justify-between pb-4 border-b border-slate-800">
          <div class="flex items-center gap-2">
            <span class="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
            </span>
            <div>
              <h3 class="text-base font-bold text-slate-100">JWT Token Activo en Pinia</h3>
              <p class="text-xs text-slate-400">Inyectado en cada request mediante Axios interceptor</p>
            </div>
          </div>
          <button @click="showTokenModal = false" class="text-slate-400 hover:text-slate-200 p-1">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="mt-4 space-y-3">
          <div>
            <label class="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">Encabezado HTTP</label>
            <div class="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-xs font-mono text-emerald-400 select-all">
              Authorization: Bearer {{ authStore.token }}
            </div>
          </div>

          <div>
            <label class="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">Raw JWT Token</label>
            <textarea 
              readonly 
              rows="4" 
              class="w-full bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-xs font-mono text-amber-300 resize-none select-all focus:outline-none"
              :value="authStore.token"
            ></textarea>
          </div>

          <div class="flex items-center justify-between pt-2">
            <span class="text-xs text-slate-500 font-mono">Usuario: {{ authStore.username }}</span>
            <button
              @click="copyToken"
              class="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <span v-if="copied">✓ Copiado al portapapeles</span>
              <span v-else>Copiar Token</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const showTokenModal = ref(false)
const copied = ref(false)

function copyToken() {
  if (authStore.token) {
    navigator.clipboard.writeText(authStore.token)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  }
}

function handleLogout() {
  authStore.logout()
  router.push('/login')
}
</script>
