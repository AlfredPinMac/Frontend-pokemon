<template>
  <div class="group relative bg-slate-900/90 rounded-2xl border border-slate-800 hover:border-slate-700 p-5 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col justify-between overflow-hidden">
    <!-- Top badge & ID -->
    <div class="flex items-center justify-between z-10">
      <span class="text-xs font-black font-mono px-2.5 py-1 rounded-full bg-slate-800/80 border border-slate-700/60 text-slate-400">
        #{{ String(pokemon.id).padStart(3, '0') }}
      </span>

      <div class="flex items-center gap-1.5">
        <span 
          class="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border shadow-sm"
          :class="getTypeBadgeClass(pokemon.type1)"
        >
          {{ pokemon.type1 }}
        </span>
        <span 
          v-if="pokemon.type2"
          class="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border shadow-sm"
          :class="getTypeBadgeClass(pokemon.type2)"
        >
          {{ pokemon.type2 }}
        </span>
      </div>
    </div>

    <!-- Image section with subtle glow -->
    <div class="relative py-4 flex items-center justify-center my-2">
      <!-- Glow background -->
      <div 
        class="absolute w-32 h-32 rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity"
        :class="getTypeGlowClass(pokemon.type1)"
      ></div>

      <img
        :src="pokemon.image_url || 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png'"
        :alt="pokemon.name"
        class="relative z-10 w-36 h-36 object-contain filter drop-shadow-lg group-hover:scale-110 transition-transform duration-300"
        loading="lazy"
        @error="handleImageError"
      />
    </div>

    <!-- Content -->
    <div class="z-10 mt-1">
      <h3 class="text-lg font-black text-slate-100 group-hover:text-amber-400 transition-colors">
        {{ pokemon.name }}
      </h3>
      <p class="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
        {{ pokemon.description || 'No description available.' }}
      </p>

      <!-- Stats Grid -->
      <div class="mt-4 pt-3 border-t border-slate-800/80 space-y-1.5 text-xs">
        <div class="flex items-center justify-between">
          <span class="text-slate-400 font-mono text-[11px]">HP</span>
          <div class="flex items-center gap-2 flex-1 max-w-[130px] ml-2">
            <div class="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div class="bg-emerald-500 h-1.5 rounded-full" :style="{ width: Math.min(100, (pokemon.hp / 150) * 100) + '%' }"></div>
            </div>
            <span class="font-mono text-[11px] text-slate-300 w-6 text-right">{{ pokemon.hp }}</span>
          </div>
        </div>

        <div class="flex items-center justify-between">
          <span class="text-slate-400 font-mono text-[11px]">ATK</span>
          <div class="flex items-center gap-2 flex-1 max-w-[130px] ml-2">
            <div class="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div class="bg-red-500 h-1.5 rounded-full" :style="{ width: Math.min(100, (pokemon.attack / 150) * 100) + '%' }"></div>
            </div>
            <span class="font-mono text-[11px] text-slate-300 w-6 text-right">{{ pokemon.attack }}</span>
          </div>
        </div>

        <div class="flex items-center justify-between">
          <span class="text-slate-400 font-mono text-[11px]">DEF</span>
          <div class="flex items-center gap-2 flex-1 max-w-[130px] ml-2">
            <div class="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div class="bg-blue-500 h-1.5 rounded-full" :style="{ width: Math.min(100, (pokemon.defense / 150) * 100) + '%' }"></div>
            </div>
            <span class="font-mono text-[11px] text-slate-300 w-6 text-right">{{ pokemon.defense }}</span>
          </div>
        </div>

        <div class="flex items-center justify-between">
          <span class="text-slate-400 font-mono text-[11px]">SPD</span>
          <div class="flex items-center gap-2 flex-1 max-w-[130px] ml-2">
            <div class="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div class="bg-amber-500 h-1.5 rounded-full" :style="{ width: Math.min(100, (pokemon.speed / 150) * 100) + '%' }"></div>
            </div>
            <span class="font-mono text-[11px] text-slate-300 w-6 text-right">{{ pokemon.speed }}</span>
          </div>
        </div>
      </div>

      <!-- Footer Info & Delete -->
      <div class="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500 font-mono">
        <span>By: <span class="text-slate-400">{{ pokemon.created_by || 'system' }}</span></span>
        
        <button
          @click="$emit('delete', pokemon.id)"
          title="Delete Pokémon"
          class="text-slate-500 hover:text-red-400 p-1 rounded hover:bg-red-500/10 transition-colors"
        >
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  pokemon: {
    type: Object,
    required: true
  }
})

defineEmits(['delete'])

function handleImageError(e) {
  e.target.src = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png'
}

function getTypeBadgeClass(type) {
  const t = (type || '').toLowerCase()
  const map = {
    fire: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    water: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    grass: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    electric: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
    psychic: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
    ice: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
    dragon: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
    dark: 'bg-slate-700/40 text-slate-300 border-slate-600',
    fairy: 'bg-rose-400/20 text-rose-300 border-rose-400/30',
    normal: 'bg-slate-500/20 text-slate-300 border-slate-500/30',
    fighting: 'bg-red-600/20 text-red-400 border-red-600/30',
    flying: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
    poison: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    ground: 'bg-amber-600/20 text-amber-400 border-amber-600/30',
    rock: 'bg-stone-500/20 text-stone-300 border-stone-500/30',
    bug: 'bg-lime-500/20 text-lime-400 border-lime-500/30',
    ghost: 'bg-violet-600/20 text-violet-300 border-violet-600/30',
    steel: 'bg-zinc-500/20 text-zinc-300 border-zinc-500/30'
  }
  return map[t] || 'bg-slate-800 text-slate-300 border-slate-700'
}

function getTypeGlowClass(type) {
  const t = (type || '').toLowerCase()
  const map = {
    fire: 'bg-orange-500',
    water: 'bg-blue-500',
    grass: 'bg-emerald-500',
    electric: 'bg-yellow-400',
    psychic: 'bg-pink-500',
    ice: 'bg-cyan-400',
    dragon: 'bg-indigo-600',
    ghost: 'bg-violet-600',
    poison: 'bg-purple-500'
  }
  return map[t] || 'bg-red-500'
}
</script>
