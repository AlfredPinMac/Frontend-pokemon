<template>
  <div class="min-h-screen flex flex-col bg-slate-950">
    <Navbar />

    <main class="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <!-- Breadcrumb & Back -->
      <div class="flex items-center justify-between">
        <router-link
          to="/dashboard"
          class="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Volver al Dashboard</span>
        </router-link>

        <span class="px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] font-mono text-emerald-400">
          POST /api/pokemons &nbsp;(Bearer JWT)
        </span>
      </div>

      <!-- Main Form Container -->
      <div class="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div class="mb-6 pb-4 border-b border-slate-800">
          <h1 class="text-2xl font-black text-slate-100 flex items-center gap-3">
            <span class="p-2 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
            Dar de Alta Nuevo Pokémon
          </h1>
          <p class="text-xs text-slate-400 mt-1">
            Completa el formulario para registrar un Pokémon. La petición enviará el Bearer Token generado en LDAP.
          </p>
        </div>

        <!-- Quick Presets Picker -->
        <div class="mb-6 p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80">
          <p class="text-xs font-bold text-amber-400 mb-2 font-mono flex items-center gap-1.5">
            <span>⚡ Plantillas Rápidas (Click para autocompletar):</span>
          </p>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="preset in presets"
              :key="preset.name"
              type="button"
              @click="applyPreset(preset)"
              class="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/60 hover:border-amber-400/50 text-xs font-medium text-slate-200 flex items-center gap-2 transition-all group"
            >
              <img :src="preset.image_url" :alt="preset.name" class="w-5 h-5 object-contain" />
              <span>{{ preset.name }}</span>
            </button>
          </div>
        </div>

        <!-- Error Notification -->
        <div v-if="errorMessage" class="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs">
          <strong>Error:</strong> {{ errorMessage }}
        </div>

        <!-- Form -->
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Left Column: Basic Info -->
            <div class="space-y-4">
              <div>
                <label class="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1 font-mono">
                  Nombre del Pokémon *
                </label>
                <input
                  v-model="form.name"
                  type="text"
                  required
                  placeholder="ej. Dragonite"
                  class="w-full bg-slate-950 border border-slate-700/80 focus:border-red-500 focus:ring-1 focus:ring-red-500 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 transition-all"
                />
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1 font-mono">
                    Tipo Principal *
                  </label>
                  <select
                    v-model="form.type1"
                    required
                    class="w-full bg-slate-950 border border-slate-700/80 focus:border-red-500 focus:ring-1 focus:ring-red-500 rounded-xl px-3 py-2.5 text-sm text-slate-100 transition-all"
                  >
                    <option v-for="t in pokemonTypes" :key="t" :value="t">{{ t }}</option>
                  </select>
                </div>

                <div>
                  <label class="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1 font-mono">
                    Tipo Secundario
                  </label>
                  <select
                    v-model="form.type2"
                    class="w-full bg-slate-950 border border-slate-700/80 focus:border-red-500 focus:ring-1 focus:ring-red-500 rounded-xl px-3 py-2.5 text-sm text-slate-100 transition-all"
                  >
                    <option :value="null">Ninguno</option>
                    <option v-for="t in pokemonTypes" :key="t" :value="t">{{ t }}</option>
                  </select>
                </div>
              </div>

              <div>
                <label class="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1 font-mono">
                  URL de Imagen / Sprite
                </label>
                <input
                  v-model="form.image_url"
                  type="url"
                  required
                  placeholder="https://..."
                  class="w-full bg-slate-950 border border-slate-700/80 focus:border-red-500 focus:ring-1 focus:ring-red-500 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 font-mono text-xs transition-all"
                />
              </div>

              <div>
                <label class="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1 font-mono">
                  Descripción
                </label>
                <textarea
                  v-model="form.description"
                  rows="3"
                  placeholder="Describe las habilidades o características del Pokémon..."
                  class="w-full bg-slate-950 border border-slate-700/80 focus:border-red-500 focus:ring-1 focus:ring-red-500 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 transition-all resize-none"
                ></textarea>
              </div>
            </div>

            <!-- Right Column: Stats & Live Preview -->
            <div class="space-y-4">
              <!-- Live Preview Card -->
              <div class="bg-slate-950/90 rounded-2xl border border-slate-800 p-4 text-center flex flex-col items-center justify-center min-h-[160px]">
                <span class="text-[10px] font-mono text-slate-500 uppercase mb-2">Vista Previa</span>
                <img
                  :src="form.image_url || 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png'"
                  :alt="form.name || 'Preview'"
                  class="w-28 h-28 object-contain filter drop-shadow-md"
                  @error="handleImageError"
                />
                <span class="text-sm font-bold text-slate-200 mt-2">{{ form.name || 'Nombre Pokémon' }}</span>
                <div class="flex items-center gap-1.5 mt-1">
                  <span class="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">{{ form.type1 }}</span>
                  <span v-if="form.type2" class="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">{{ form.type2 }}</span>
                </div>
              </div>

              <!-- Sliders -->
              <div class="space-y-3 bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80 text-xs">
                <div>
                  <div class="flex justify-between font-mono mb-1">
                    <span class="text-emerald-400 font-bold">HP (Salud):</span>
                    <span class="text-slate-300 font-bold">{{ form.hp }}</span>
                  </div>
                  <input type="range" v-model.number="form.hp" min="10" max="250" class="w-full accent-emerald-500 cursor-pointer" />
                </div>

                <div>
                  <div class="flex justify-between font-mono mb-1">
                    <span class="text-red-400 font-bold">Ataque:</span>
                    <span class="text-slate-300 font-bold">{{ form.attack }}</span>
                  </div>
                  <input type="range" v-model.number="form.attack" min="10" max="250" class="w-full accent-red-500 cursor-pointer" />
                </div>

                <div>
                  <div class="flex justify-between font-mono mb-1">
                    <span class="text-blue-400 font-bold">Defensa:</span>
                    <span class="text-slate-300 font-bold">{{ form.defense }}</span>
                  </div>
                  <input type="range" v-model.number="form.defense" min="10" max="250" class="w-full accent-blue-500 cursor-pointer" />
                </div>

                <div>
                  <div class="flex justify-between font-mono mb-1">
                    <span class="text-amber-400 font-bold">Velocidad:</span>
                    <span class="text-slate-300 font-bold">{{ form.speed }}</span>
                  </div>
                  <input type="range" v-model.number="form.speed" min="10" max="250" class="w-full accent-amber-500 cursor-pointer" />
                </div>
              </div>
            </div>
          </div>

          <!-- Submit Buttons -->
          <div class="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <router-link
              to="/dashboard"
              class="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
            >
              Cancelar
            </router-link>

            <button
              type="submit"
              :disabled="submitting"
              class="px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white text-xs font-bold shadow-lg shadow-red-500/25 flex items-center gap-2 transition-all disabled:opacity-50"
            >
              <svg v-if="submitting" class="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>{{ submitting ? 'Guardando con JWT...' : 'Guardar Pokémon (POST)' }}</span>
            </button>
          </div>
        </form>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import Navbar from '../components/Navbar.vue'
import apiClient from '../services/api'

const router = useRouter()
const submitting = ref(false)
const errorMessage = ref('')

const pokemonTypes = [
  'Normal', 'Fire', 'Water', 'Grass', 'Electric', 'Ice', 'Fighting',
  'Poison', 'Ground', 'Flying', 'Psychic', 'Bug', 'Rock', 'Ghost',
  'Dragon', 'Dark', 'Steel', 'Fairy'
]

const presets = [
  {
    name: 'Rayquaza',
    type1: 'Dragon',
    type2: 'Flying',
    hp: 105,
    attack: 150,
    defense: 90,
    speed: 95,
    image_url: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/384.png',
    description: 'Se dice que ha vivido durante cientos de millones de años en la capa de ozono de la Tierra sin bajar jamás.'
  },
  {
    name: 'Gengar',
    type1: 'Ghost',
    type2: 'Poison',
    hp: 60,
    attack: 65,
    defense: 60,
    speed: 110,
    image_url: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/94.png',
    description: 'En una noche de luna llena, si a tu sombra le da por reírse y moverse sola, es culpa de Gengar.'
  },
  {
    name: 'Dragonite',
    type1: 'Dragon',
    type2: 'Flying',
    hp: 91,
    attack: 134,
    defense: 95,
    speed: 80,
    image_url: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/149.png',
    description: 'Es capaz de dar la vuelta al mundo en tan solo dieciséis horas. Es un Pokémon bondadoso que rescata a los náufragos.'
  },
  {
    name: 'Gyarados',
    type1: 'Water',
    type2: 'Flying',
    hp: 95,
    attack: 125,
    defense: 79,
    speed: 81,
    image_url: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/130.png',
    description: 'Tiene un carácter tremendamente violento. Los rayos hiperrayo que lanza por la boca lo destruyen todo.'
  },
  {
    name: 'Snorlax',
    type1: 'Normal',
    type2: null,
    hp: 160,
    attack: 110,
    defense: 65,
    speed: 30,
    image_url: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/143.png',
    description: 'Su estómago es tan fuerte que sus jugos digestivos pueden disolver cualquier tipo de veneno.'
  }
]

const form = reactive({
  name: 'Rayquaza',
  type1: 'Dragon',
  type2: 'Flying',
  hp: 105,
  attack: 150,
  defense: 90,
  speed: 95,
  image_url: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/384.png',
  description: 'Se dice que ha vivido durante cientos de millones de años en la capa de ozono de la Tierra.'
})

function applyPreset(p) {
  form.name = p.name
  form.type1 = p.type1
  form.type2 = p.type2
  form.hp = p.hp
  form.attack = p.attack
  form.defense = p.defense
  form.speed = p.speed
  form.image_url = p.image_url
  form.description = p.description
}

function handleImageError(e) {
  e.target.src = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png'
}

async function handleSubmit() {
  submitting.value = true
  errorMessage.value = ''

  try {
    console.log('%c[ADD POKEMON] Sending POST /api/pokemons request with Bearer JWT token...', 'color: #38bdf8; font-weight: bold;')
    
    const payload = {
      name: form.name,
      type1: form.type1,
      type2: form.type2 || null,
      hp: form.hp,
      attack: form.attack,
      defense: form.defense,
      speed: form.speed,
      image_url: form.image_url,
      description: form.description
    }

    const response = await apiClient.post('/api/pokemons', payload)
    console.log('%c[ADD POKEMON SUCCESS] Pokémon created:', 'color: #4ade80; font-weight: bold;', response.data)

    // Redirect to dashboard where the newly added pokemon will appear
    router.push('/dashboard')
  } catch (err) {
    console.error('[ADD POKEMON ERROR]', err)
    errorMessage.value = err.response?.data?.detail || err.message || 'Error al guardar el Pokémon'
  } finally {
    submitting.value = false
  }
}
</script>
