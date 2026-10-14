<template>
  <div class="min-h-screen flex flex-col bg-slate-950">
    <Navbar />

    <main class="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <!-- Top Banner / Security Context -->
      <div class="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-800/80 border border-slate-800 rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div class="absolute right-0 top-0 translate-x-10 -translate-y-10 w-64 h-64 bg-red-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div class="flex items-center gap-2 mb-1">
              <span class="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-[11px] flex items-center gap-1.5">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                JWT Active & Injected
              </span>
              <span class="text-xs text-slate-400 font-mono">Logged in as: <strong class="text-slate-200 capitalize">{{ authStore.username }}</strong></span>
            </div>
            <h1 class="text-2xl sm:text-3xl font-black text-slate-100">
              Centralized Pokédex
            </h1>
            <p class="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
              Protected by Bearer Token. Every request made via Axios automatically injects the JWT retrieved from the LDAP service.
            </p>
          </div>

          <div class="flex items-center gap-3 self-start md:self-center">
            <button
              @click="fetchPokemons"
              :disabled="loading"
              class="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center gap-2 transition-colors disabled:opacity-50"
              title="Refresh list (sends GET /api/pokemons with Bearer Token)"
            >
              <svg class="w-4 h-4" :class="{ 'animate-spin': loading }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Reload GET</span>
            </button>

            <router-link
              to="/pokemons/create"
              class="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white text-xs font-bold shadow-lg shadow-red-500/20 flex items-center gap-2 transition-all group"
            >
              <svg class="w-4 h-4 group-hover:rotate-90 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              <span>+ New Pokémon</span>
            </router-link>
          </div>
        </div>

        <!-- Live JWT Console Inspection Snippet -->
        <div class="mt-4 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
          <div class="flex items-center gap-2 text-slate-400">
            <span class="text-amber-400">Authorization:</span>
            <span class="text-emerald-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800 max-w-[280px] sm:max-w-md truncate">
              Bearer {{ authStore.token }}
            </span>
          </div>
          <span class="text-[11px] text-slate-500">
            💡 Check browser developer tools <span class="text-slate-300 font-bold">(F12 -> Console)</span> to view detailed JWT logs on every request.
          </span>
        </div>
      </div>

      <!-- Filters & Search Bar -->
      <div class="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800/80">
        <!-- Search Input -->
        <div class="relative w-full sm:w-80">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search by name or type..."
            class="w-full bg-slate-950/80 border border-slate-800 focus:border-red-500 focus:ring-1 focus:ring-red-500 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-100 placeholder-slate-500 transition-all"
          />
        </div>

        <!-- Type Filter Pills -->
        <div class="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-thin">
          <button
            v-for="t in typeFilters"
            :key="t"
            @click="selectedType = t"
            class="px-3 py-1 rounded-lg text-xs font-semibold capitalize whitespace-nowrap transition-colors border"
            :class="selectedType === t ? 'bg-red-500 text-white border-red-400 shadow-sm' : 'bg-slate-950/60 text-slate-400 hover:text-slate-200 border-slate-800 hover:border-slate-700'"
          >
            {{ t === 'all' ? 'All' : t }}
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading && pokemons.length === 0" class="py-24 text-center space-y-4">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-slate-800 border-t-red-500"></div>
        <p class="text-sm font-mono text-slate-400">Querying Backend with Bearer JWT...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-500/10 border border-red-500/30 rounded-2xl p-8 text-center max-w-lg mx-auto space-y-4">
        <div class="w-12 h-12 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center mx-auto">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 class="text-base font-bold text-red-400">Error Fetching Pokémon List</h3>
        <p class="text-xs text-slate-300 font-mono">{{ error }}</p>
        <button
          @click="fetchPokemons"
          class="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow transition-colors"
        >
          Retry Request
        </button>
      </div>

      <!-- Empty State -->
      <div v-else-if="filteredPokemons.length === 0" class="py-16 text-center bg-slate-900/40 rounded-3xl border border-slate-800/80 p-8">
        <img 
          src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png" 
          alt="Empty Pokeball" 
          class="w-16 h-16 opacity-30 mx-auto mb-3"
        />
        <h3 class="text-base font-bold text-slate-300">No Pokémon Found</h3>
        <p class="text-xs text-slate-500 mt-1">Try another search term or register a new one.</p>
        <router-link
          to="/pokemons/create"
          class="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-xl bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 text-red-400 text-xs font-bold transition-colors"
        >
          + Register a Pokémon
        </router-link>
      </div>

      <!-- Pokémon Cards Grid -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <PokemonCard
          v-for="pokemon in filteredPokemons"
          :key="pokemon.id"
          :pokemon="pokemon"
          @delete="handleDelete"
        />
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import Navbar from '../components/Navbar.vue'
import PokemonCard from '../components/PokemonCard.vue'
import apiClient from '../services/api'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()

const pokemons = ref([])
const loading = ref(false)
const error = ref(null)
const searchQuery = ref('')
const selectedType = ref('all')

const typeFilters = ['all', 'Electric', 'Fire', 'Water', 'Grass', 'Ghost', 'Psychic', 'Fighting', 'Normal']

const filteredPokemons = computed(() => {
  return pokemons.value.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                          p.type1.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                          (p.type2 && p.type2.toLowerCase().includes(searchQuery.value.toLowerCase()))
    
    const matchesType = selectedType.value === 'all' || 
                        p.type1.toLowerCase() === selectedType.value.toLowerCase() ||
                        (p.type2 && p.type2.toLowerCase() === selectedType.value.toLowerCase())

    return matchesSearch && matchesType
  })
})

async function fetchPokemons() {
  loading.value = true
  error.value = null

  try {
    console.log('%c[DASHBOARD] Fetching pokemons list via GET /api/pokemons (JWT Bearer Protected)...', 'color: #38bdf8; font-weight: bold;')
    const response = await apiClient.get('/api/pokemons')
    pokemons.value = response.data
    console.log(`%c[DASHBOARD] Successfully loaded ${pokemons.value.length} pokemons!`, 'color: #4ade80; font-weight: bold;')
  } catch (err) {
    console.error('[DASHBOARD ERROR] Failed to fetch pokemons:', err)
    error.value = err.response?.data?.detail || err.message || 'Error connecting to backend'
  } finally {
    loading.value = false
  }
}

async function handleDelete(id) {
  if (!confirm('Are you sure you want to delete this Pokémon?')) return

  try {
    console.log(`%c[DELETE ACTION] Deleting pokemon #${id} with Bearer JWT...`, 'color: #f87171; font-weight: bold;')
    await apiClient.delete(`/api/pokemons/${id}`)
    pokemons.value = pokemons.value.filter((p) => p.id !== id)
    console.log(`%c[DELETE SUCCESS] Pokemon #${id} deleted.`, 'color: #4ade80;')
  } catch (err) {
    alert('Deletion error: ' + (err.response?.data?.detail || err.message))
  }
}

onMounted(() => {
  fetchPokemons()
})
</script>
