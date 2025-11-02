// PRÁCTICA: TORNEO POKÉMON ASÍNCRONO
// SOLUCIÓN COMPLETA

// PARTE 1: TIPOS Y INTERFACES

// Tipos para la respuesta de la API

namespace PokemonTorneoAsync {

interface PokemonAPIResponse {
  id: number;
  name: string;
  height: number;
  weight: number;
  stats: Array<{
    base_stat: number;
    stat: {
      name: string;
    };
  }>;
  types: Array<{
    type: {
      name: string;
    };
  }>;
  sprites: {
    front_default: string;
  };
}

// Nuestro modelo simplificado
interface Pokemon {
  id: number;
  name: string;
  hp: number;
  attack: number;
  defense: number;
  speed: number;
  types: string[];
}

// Resultado de batalla
interface BattleResult {
  winner: Pokemon;
  loser: Pokemon;
  rounds: number;
  summary: string;
}

// PARTE 1: TRANSFORMACIÓN DE DATOS
// ------

function transformPokemon(data: PokemonAPIResponse): Pokemon {
  const getStat = (statName: string): number => {
    const stat = data.stats.find(s => s.stat.name === statName);
    return stat ? stat.base_stat : 0;
  };

  return {
    id: data.id,
    name: data.name,
    hp: getStat('hp'),
    attack: getStat('attack'),
    defense: getStat('defense'),
    speed: getStat('speed'),
    types: data.types.map(t => t.type.name)
  };
}

// PARTE 2: PROGRAMACIÓN ASÍNCRONA - FETCHING
// ------

async function fetchPokemon(identifier: string | number): Promise<Pokemon> {
  try {
    const url = `https://pokeapi.co/api/v2/pokemon/${identifier}`;
    const response: Response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Pokémon no encontrado: ${identifier}`);
    }
    
    const data: PokemonAPIResponse = await response.json();
    return transformPokemon(data);
  } catch (error) {
    console.error(`Error obteniendo Pokémon:`, error);
    throw error;
  }
}

async function fetchMultiplePokemon(
  identifiers: (string | number)[]
): Promise<Pokemon[]> {
  const promises = identifiers.map(id => fetchPokemon(id));
  return await Promise.all(promises);
}

function fetchWithTimeout<T>(
  promise: Promise<T>,
  timeout: number = 5000
): Promise<T> {
  const timeoutPromise = new Promise<T>((_, reject) => {
    setTimeout(() => {
      reject(new Error(`Timeout después de ${timeout}ms`));
    }, timeout);
  });
  
  return Promise.race([promise, timeoutPromise]);
}

async function fetchPokemonWithTimeout(
  identifier: string | number
): Promise<Pokemon> {
  return fetchWithTimeout(fetchPokemon(identifier), 3000);
}

// PARTE 3: PROGRAMACIÓN GENÉRICA
// ------


// Clase Comparador Genérico
class Comparator<T> {
  private compareFunction: (a: T, b: T) => number;

  constructor(compareFunction: (a: T, b: T) => number) {
    this.compareFunction = compareFunction;
  }

  max(a: T, b: T): T {
    return this.compareFunction(a, b) > 0 ? a : b;
  }

  min(a: T, b: T): T {
    return this.compareFunction(a, b) < 0 ? a : b;
  }

  sort(items: T[]): T[] {
    return [...items].sort(this.compareFunction);
  }
}

// Función genérica para obtener propiedades
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

// Función para comparar Pokémon por estadística
function comparePokemonByStat(
  stat: keyof Pick<Pokemon, 'hp' | 'attack' | 'defense' | 'speed'>
): (a: Pokemon, b: Pokemon) => number {
  return (a: Pokemon, b: Pokemon) => {
    return getProperty(a, stat) - getProperty(b, stat);
  };
}

// Cache Genérico
class Cache<K, V> {
  private cache: Map<K, V>;

  constructor() {
    this.cache = new Map();
  }

  get(key: K): V | undefined {
    return this.cache.get(key);
  }

  set(key: K, value: V): void {
    this.cache.set(key, value);
  }

  has(key: K): boolean {
    return this.cache.has(key);
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }
}

// PARTE 4: SERVICIOS Y SIMULACIÓN
// ------

// Servicio Pokémon con Cache
class PokemonService {
  private cache: Cache<string | number, Pokemon>;

  constructor() {
    this.cache = new Cache();
  }

  async getPokemon(identifier: string | number): Promise<Pokemon> {
    // Verificar cache
    if (this.cache.has(identifier)) {
      console.log(`✅ Cache hit: ${identifier}`);
      return this.cache.get(identifier)!;
    }

    // Fetch y guardar en cache
    console.log(`🌐 Fetching: ${identifier}`);
    const pokemon = await fetchPokemon(identifier);
    this.cache.set(identifier, pokemon);
    return pokemon;
  }

  async getBatch(identifiers: (string | number)[]): Promise<Pokemon[]> {
    const promises = identifiers.map(id => this.getPokemon(id));
    return await Promise.all(promises);
  }

  clearCache(): void {
    this.cache.clear();
  }

  getCacheSize(): number {
    return this.cache.size();
  }
}

// Simulador de Batallas
class BattleSimulator {
  battle(p1: Pokemon, p2: Pokemon): BattleResult {
    let hp1 = p1.hp;
    let hp2 = p2.hp;
    let rounds = 0;
    const maxRounds = 50; // Evitar batallas infinitas

    // Determinar quién ataca primero
    let attacker = p1.speed >= p2.speed ? p1 : p2;
    let defender = attacker === p1 ? p2 : p1;
    let attackerHP = attacker === p1 ? hp1 : hp2;
    let defenderHP = attacker === p1 ? hp2 : hp1;

    while (attackerHP > 0 && defenderHP > 0 && rounds < maxRounds) {
      // Calcular daño
      const damage = Math.max(
        1,
        (attacker.attack - defender.defense) * 0.5
      );
      defenderHP -= damage;
      rounds++;

      // Intercambiar roles
      [attacker, defender] = [defender, attacker];
      [attackerHP, defenderHP] = [defenderHP, attackerHP];
    }

    const winner = hp1 > 0 ? p1 : p2;
    const loser = hp1 > 0 ? p2 : p1;

    return {
      winner,
      loser,
      rounds,
      summary: `${winner.name} venció a ${loser.name} en ${rounds} rondas!`
    };
  }
}

// PARTE 5: SISTEMA DE TORNEO
// ------

class Tournament {
  constructor(
    private service: PokemonService,
    private simulator: BattleSimulator
  ) {}

  async runTournament(pokemonIds: number[]): Promise<Pokemon> {
  console.log('Iniciando torneo...');
    
    // Obtener todos los Pokémon
    // let competitors = await this.service.getBatch(pokemonIds);

    // En vez de obtener todos de una vez, los obtenemos uno por uno para aprovechar la cache
    let competitors: Pokemon[] = [];
    for (const id of pokemonIds) {
      const pokemon = await this.service.getPokemon(id);
      competitors.push(pokemon);
    }

  console.log(`${competitors.length} competidores registrados\n`);

    let round = 1;

    while (competitors.length > 1) {
  console.log(`RONDA ${round}`);
      const nextRound: Pokemon[] = [];

      // Emparejar competidores
      for (let i = 0; i < competitors.length; i += 2) {
        if (i + 1 < competitors.length) {
          const p1 = competitors[i];
          const p2 = competitors[i + 1];
          
          console.log(`  ${p1.name} vs ${p2.name}`);
          const result = this.simulator.battle(p1, p2);
          console.log(`    ${result.summary}`);
          
          nextRound.push(result.winner);
        } else {
          // Número impar, pasa automáticamente
          console.log(`  ${competitors[i].name} pasa automáticamente`);
          nextRound.push(competitors[i]);
        }
      }

      competitors = nextRound;
      round++;
      console.log();
    }

    const champion = competitors[0];
  console.log(`¡${champion.name} es el CAMPEÓN!`);
    return champion;
  }
}

// MAIN
// ------

async function main() {
  const service = new PokemonService();
  const simulator = new BattleSimulator();
  const tournament = new Tournament(service, simulator);

  try {
    // IDs de Pokémon famosos de la primera generación
    const pokemonIds = [1, 4, 7, 25, 6, 9, 94, 130]; 
    // Bulbasaur, Charmander, Squirtle, Pikachu, Charizard, Blastoise, Gengar, Gyarados

    const champion = await tournament.runTournament(pokemonIds);
    
  console.log('\nEstadísticas del campeón:');
    console.log(champion);
  console.log(`\nTotal de Pokémon en cache: ${service.getCacheSize()}`);
  } catch (error) {
    console.error('Error en el torneo:', error);
  }
}

main();











// EJEMPLOS DE USO ADICIONALES

// Ejemplo 1: Usar Comparator con números
async function ejemploComparador() {
  console.log('\nEJEMPLO: COMPARADOR CON NÚMEROS');
  const numberComparator = new Comparator<number>((a, b) => a - b);
  console.log('Max(5, 10):', numberComparator.max(5, 10)); // 10
  console.log('Min(5, 10):', numberComparator.min(5, 10)); // 5
  console.log('Sort([3, 1, 4, 1, 5]):', numberComparator.sort([3, 1, 4, 1, 5])); // [1, 1, 3, 4, 5]
}

// Ejemplo 2: Usar Comparator con Pokémon
async function ejemploComparadorPokemon() {
  console.log('\nEJEMPLO: COMPARADOR CON POKÉMON');
  
  const service = new PokemonService();
  const bulbasaur = await service.getPokemon(1);
  const charizard = await service.getPokemon(6);
  
  const attackComparator = new Comparator<Pokemon>((a, b) => a.attack - b.attack);
  const speedComparator = new Comparator<Pokemon>((a, b) => a.speed - b.speed);
  
  console.log('Pokémon con más ataque:', attackComparator.max(bulbasaur, charizard).name);
  console.log('Pokémon más rápido:', speedComparator.max(bulbasaur, charizard).name);
}

// Ejemplo 3: Usar Cache con diferentes tipos
async function ejemploCache() {
  console.log('\nEJEMPLO: CACHE GENÉRICO');
  
  // Cache de números
  const numberCache = new Cache<string, number>();
  numberCache.set('pi', 3.14159);
  numberCache.set('e', 2.71828);
  console.log('Número Pi:', numberCache.get('pi'));
  console.log('Tamaño del cache:', numberCache.size());
  
  // Cache de strings
  const stringCache = new Cache<number, string>();
  stringCache.set(1, 'Bulbasaur');
  stringCache.set(4, 'Charmander');
  console.log('Pokémon ID 1:', stringCache.get(1));
}

// Ejemplo 4: Torneo con pokémon personalizados
async function ejemploTorneoPersonalizado() {
  console.log('\nEJEMPLO: TORNEO PERSONALIZADO');
  
  const service = new PokemonService();
  const simulator = new BattleSimulator();
  const tournament = new Tournament(service, simulator);
  
  // Torneo solo con iniciales de Kanto
  const iniciales = [1, 4, 7]; // Bulbasaur, Charmander, Squirtle
  const champion = await tournament.runTournament(iniciales);
  console.log(`\nCampeón de iniciales: ${champion.name}`);
}
}
