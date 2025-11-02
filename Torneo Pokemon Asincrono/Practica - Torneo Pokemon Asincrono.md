# Práctica: Torneo Pokémon Asíncrono

## Introducción

En esta práctica, crearás un sistema que simula un **torneo Pokémon** consumiendo datos de la [PokeAPI](https://pokeapi.co/). El sistema deberá:

1. **Buscar Pokémon** de forma asíncrona
2. **Comparar estadísticas** usando programación genérica
3. **Simular batallas** combinando ambos conceptos
4. **Cachear resultados** para optimizar peticiones

### 🌐 API a Utilizar

**PokeAPI**: https://pokeapi.co/

Endpoints principales:
- `https://pokeapi.co/api/v2/pokemon/{id o nombre}` - Obtener un Pokémon
- `https://pokeapi.co/api/v2/pokemon?limit=151` - Lista de Pokémon (primera generación)

---

## 🎯 Parte 1: Setup Inicial y Tipos Base

### Paso 1.1: Crear el archivo TypeScript

Crea un archivo `pokemon-tournament.ts` (o usa el TS Playground) con los tipos básicos:

```typescript
// Tipos para la respuesta de la API
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
```

### Paso 1.2: Función de transformación

**EJERCICIO 1:** Implementa una función que transforme la respuesta de la API a nuestro modelo:

```typescript
function transformPokemon(data: PokemonAPIResponse): Pokemon {
  // TODO: Implementar transformación
  // Pista: usa .find() para buscar cada stat por nombre
  // Los nombres de stats son: "hp", "attack", "defense", "speed"
}
```

Para conocer la respuesta puedes hacer una peticion a https://pokeapi.co/api/v2/pokemon/1 y ver su estructura. Tambien puedes usar herramientas como Postman o simplemente el navegador.
Pero la *recomendación* es usar la documentación oficial de la API (averigualo tu mismo).

Por otro lado, la funcion find te permite buscar un elemento en un array que cumpla con una condicion especifica. Esta funcion es una funcion de orden superior que recibe como parametro una funcion callback que define la condicion de busqueda.

<details>
<summary>💡 Ver solución</summary>

```typescript
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
```
</details>

---

## ⚡ Parte 2: Programación Asíncrona - Fetching Pokémon

### Paso 2.1: Fetch básico con manejo de errores

**EJERCICIO 2:** Implementa una función que obtenga un Pokémon por ID o nombre:

```typescript
async function fetchPokemon(identifier: string | number): Promise<Pokemon> {
  try {
    // TODO: Implementar
    // 1. Hacer fetch a la API
    // 2. Verificar que response.ok sea true
    // 3. Convertir a JSON
    // 4. Transformar usando transformPokemon()
    // 5. Manejar errores apropiadamente
  } catch (error) {
    // TODO: Manejar error
  }
}
```

<details>
<summary>💡 Ver solución</summary>

```typescript
async function fetchPokemon(identifier: string | number): Promise<Pokemon> {
  try {
    const url = `https://pokeapi.co/api/v2/pokemon/${identifier}`;
    const response = await fetch(url);
    
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
```
</details>

### Paso 2.2: Fetch múltiple en paralelo

**EJERCICIO 3:** Implementa una función que obtenga múltiples Pokémon en paralelo:

```typescript
async function fetchMultiplePokemon(
  identifiers: (string | number)[]
): Promise<Pokemon[]> {
  // TODO: Usar Promise.all() para hacer todas las peticiones en paralelo
  // Pista: usa map() para crear un array de promesas
}
```

<details>
<summary>💡 Ver solución</summary>

```typescript
async function fetchMultiplePokemon(
  identifiers: (string | number)[]
): Promise<Pokemon[]> {
  const promises = identifiers.map(id => fetchPokemon(id));
  return await Promise.all(promises);
}
```
</details>

### Paso 2.3: Fetch con timeout (NO ES NECESARIO PARA LA PRACTICA)

**EJERCICIO 4 (Desafío):** Implementa una versión con timeout para evitar esperas infinitas:

```typescript
function fetchWithTimeout<T>(
  promise: Promise<T>,
  timeout: number = 5000
): Promise<T> {
  // TODO: Implementar usando Promise.race()
  // Crear una promesa que rechace después de 'timeout' ms
}
```

<details>
<summary>💡 Ver solución</summary>

```typescript
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

// Uso:
async function fetchPokemonWithTimeout(
  identifier: string | number
): Promise<Pokemon> {
  return fetchWithTimeout(fetchPokemon(identifier), 3000);
}
```
</details>

---

## 🧬 Parte 3: Programación Genérica - Sistema de Comparación

### Paso 3.1: Comparador genérico

**EJERCICIO 5:** Crea una clase genérica para comparar cualquier tipo de valor:

```typescript
class Comparator<T> {
  // TODO: Implementar
  // - Constructor: recibe una función que compara dos elementos (retorna negativo si a<b, 0 si igual, positivo si a>b)
  // - Método max(a: T, b: T): T → retorna el mayor de dos elementos
  // - Método min(a: T, b: T): T → retorna el menor de dos elementos
  // - Método sort(items: T[]): T[] → ordena un array sin modificar el original
}
```

<details>
<summary>💡 Ver solución</summary>

```typescript
class Comparator<T> {
  private compareFunction: (a: T, b: T) => number;

  // Constructor que recibe una función de comparación personalizada
  // La función retorna: número negativo si a < b, 0 si a == b, positivo si a > b
  constructor(compareFunction: (a: T, b: T) => number) {
    this.compareFunction = compareFunction;
  }

  // Retorna el mayor de dos elementos usando la función de comparación
  // Si compareFunction(a, b) > 0 significa que a es mayor, retorna a. Si no, retorna b.
  max(a: T, b: T): T {
    return this.compareFunction(a, b) > 0 ? a : b;
  }

  // Retorna el menor de dos elementos usando la función de comparación
  // Si compareFunction(a, b) < 0 significa que a es menor, retorna a. Si no, retorna b.
  min(a: T, b: T): T {
    return this.compareFunction(a, b) < 0 ? a : b;
  }

  // Ordena un array de elementos sin modificar el original ([...items] crea una copia)
  // Usa la función de comparación para determinar el orden
  sort(items: T[]): T[] {
    return [...items].sort(this.compareFunction);
  }
}

// Ejemplo de uso:
const numberComparator = new Comparator<number>((a, b) => a - b);
console.log(numberComparator.max(5, 10)); // 10
console.log(numberComparator.min(5, 10)); // 5

const pokemonAttackComparator = new Comparator<Pokemon>(
  (a, b) => a.attack - b.attack
);
console.log(pokemonAttackComparator.max(bulbasaur, charizard)); // El que tenga más ataque
```
</details>

### Paso 3.2: Selector de estadísticas genérico

**EJERCICIO 6:** Crea una función genérica para seleccionar propiedades:

```typescript
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

// TODO: Úsala para crear una función que compare Pokémon por cualquier stat
function comparePokemonByStat(
  stat: keyof Pick<Pokemon, 'hp' | 'attack' | 'defense' | 'speed'>
): (a: Pokemon, b: Pokemon) => number {
  // TODO: Implementar
}
```

<details>
<summary>💡 Ver solución</summary>

```typescript
function comparePokemonByStat(
  stat: keyof Pick<Pokemon, 'hp' | 'attack' | 'defense' | 'speed'>
): (a: Pokemon, b: Pokemon) => number {
  return (a: Pokemon, b: Pokemon) => {
    return getProperty(a, stat) - getProperty(b, stat);
  };
}

// Uso:
const speedComparator = new Comparator(comparePokemonByStat('speed'));
```
</details>

### Paso 3.3: Cache genérico

**EJERCICIO 7:** Implementa un sistema de cache genérico:

```typescript
class Cache<K, V> {
  private cache: Map<K, V>;

  constructor() {
    this.cache = new Map();
  }

  // TODO: Implementar métodos:
  // - get(key: K): V | undefined → retorna el valor asociado a una clave, o undefined si no existe
  // - set(key: K, value: V): void → almacena un par clave-valor en el cache
  // - has(key: K): boolean → verifica si una clave existe en el cache
  // - clear(): void → elimina todos los elementos del cache
  // - size(): number → retorna la cantidad de elementos almacenados
}
```

<details>
<summary>💡 Ver solución</summary>

```typescript
class Cache<K, V> {
  private cache: Map<K, V>;

  constructor() {
    this.cache = new Map();
  }

  // Obtiene un valor del cache usando su clave
  // Retorna undefined si la clave no existe (el Map lo hace automáticamente)
  get(key: K): V | undefined {
    return this.cache.get(key);
  }

  // Almacena un par clave-valor en el cache
  // Si la clave ya existe, actualiza su valor
  set(key: K, value: V): void {
    this.cache.set(key, value);
  }

  // Verifica si una clave existe en el cache sin obtener su valor
  // Útil para validar antes de hacer una operación costosa
  has(key: K): boolean {
    return this.cache.has(key);
  }

  // Limpia completamente el cache eliminando todos los elementos
  // Se usa cuando quieres descartar datos almacenados
  clear(): void {
    this.cache.clear();
  }

  // Retorna la cantidad total de elementos en el cache
  // Útil para monitorear el tamaño del cache
  size(): number {
    return this.cache.size;
  }
}

// Uso con Pokémon:
const pokemonCache = new Cache<string | number, Pokemon>();

// Guardar un Pokémon
pokemonCache.set(1, bulbasaur);

// Verificar si existe
if (pokemonCache.has(1)) {
  console.log("El Pokémon está en cache");
  const pokemon = pokemonCache.get(1); // Obtener del cache
}

// Ver cuántos elementos hay
console.log(`Pokémon en cache: ${pokemonCache.size()}`);

// Limpiar todo
pokemonCache.clear();
```
</details>

---

## ⚔️ Parte 4: Juntando Todo - Sistema de Batallas

### Paso 4.1: PokemonService con cache

**EJERCICIO 8:** Crea un servicio que combine async + cache:

```typescript
class PokemonService {
  private cache: Cache<string | number, Pokemon>;

  constructor() {
    this.cache = new Cache();
  }

  async getPokemon(identifier: string | number): Promise<Pokemon> {
    // TODO: 
    // 1. Verificar si está en cache
    // 2. Si está, retornarlo
    // 3. Si no, hacer fetch, guardarlo en cache y retornarlo
  }

  async getBatch(identifiers: (string | number)[]): Promise<Pokemon[]> {
    // TODO: Similar a getPokemon pero con múltiples
  }

  clearCache(): void {
    this.cache.clear();
  }
}
```

<details>
<summary>💡 Ver solución</summary>

```typescript
class PokemonService {
  private cache: Cache<string | number, Pokemon>;

  constructor() {
    this.cache = new Cache();
  }

  async getPokemon(identifier: string | number): Promise<Pokemon> {
    // Primer paso: comprobar si ya tenemos el Pokémon en cache
    // has() retorna true/false sin obtener el valor aún
    if (this.cache.has(identifier)) {
      console.log(`✅ Cache hit: ${identifier}`); // Evitamos una petición a la API
      return this.cache.get(identifier)!; // El ! dice: "sé que existe, confía en mí"
    }

    // Segundo paso: si no está en cache, traerlo de la API
    console.log(`🌐 Fetching: ${identifier}`);
    const pokemon = await fetchPokemon(identifier); // Hace petición HTTP
    
    // Tercer paso: guardar en cache para futuros accesos
    this.cache.set(identifier, pokemon);
    
    return pokemon;
  }

  async getBatch(identifiers: (string | number)[]): Promise<Pokemon[]> {
    // Crear un array de promesas llamando getPokemon para cada uno
    // Cada llamada verificará el cache automáticamente
    const promises = identifiers.map(id => this.getPokemon(id));
    
    // Promise.all() espera a que TODOS se resuelvan en paralelo
    // Esto es importante para el rendimiento
    return await Promise.all(promises);
  }

  clearCache(): void {
    this.cache.clear();
  }
}

// Ejemplo de uso:
const service = new PokemonService();

// Primera vez: hace fetch (lento)
const pika1 = await service.getPokemon(25); // 🌐 Fetching: 25

// Segunda vez: obtiene del cache (rápido)
const pika2 = await service.getPokemon(25); // ✅ Cache hit: 25

// Cargar múltiples en paralelo (el cache ayuda si hay repetidos)
const batch = await service.getBatch([1, 25, 1, 4, 25]); // Solo 3 requests reales
```
</details>

### Paso 4.2: Sistema de batallas

**EJERCICIO 9:** Implementa un simulador de batallas:

```typescript
interface BattleResult {
  winner: Pokemon;
  loser: Pokemon;
  rounds: number;
  summary: string;
}

class BattleSimulator {
  // TODO: Implementar método de batalla simple
  battle(p1: Pokemon, p2: Pokemon): BattleResult {
    // Algoritmo simple:
    // 1. El más rápido ataca primero
    // 2. Daño = (attack del atacante - defense del defensor) * 0.5
    // 3. Restar daño del HP
    // 4. Repetir hasta que un HP <= 0
  }
}
```

<details>
<summary>💡 Ver solución</summary>

```typescript
interface BattleResult {
  winner: Pokemon;
  loser: Pokemon;
  rounds: number;
  summary: string;
}

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
      const damage = Math.max( // Max evita que el daño sea menor a 1
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
```
</details>

### Paso 4.3: Torneo completo

**EJERCICIO 10 (Desafío Final):** Crea un sistema de torneo:

```typescript
class Tournament {
  constructor(
    private service: PokemonService,
    private simulator: BattleSimulator
  ) {}

  async runTournament(pokemonIds: number[]): Promise<Pokemon> {
    // TODO:
    // 1. Obtener todos los Pokémon (async)
    // 2. Hacer batallas eliminatorias
    // 3. El ganador de cada batalla avanza
    // 4. Repetir hasta tener un campeón
  }
}
```

<details>
<summary>💡 Ver solución</summary>

```typescript
class Tournament {
  constructor(
    private service: PokemonService,
    private simulator: BattleSimulator
  ) {}

  async runTournament(pokemonIds: number[]): Promise<Pokemon> {
    console.log('🏆 ¡Iniciando torneo!');
    
    // Obtener todos los Pokémon
    let competitors = await this.service.getBatch(pokemonIds);
    console.log(`📋 ${competitors.length} competidores registrados`);

    let round = 1;

    while (competitors.length > 1) {
      console.log(`\n⚔️ RONDA ${round}`);
      const nextRound: Pokemon[] = [];

      // Emparejar competidores
      for (let i = 0; i < competitors.length; i += 2) {
        if (i + 1 < competitors.length) {
          const p1 = competitors[i];
          const p2 = competitors[i + 1];
          
          console.log(`  ${p1.name} vs ${p2.name}`);
          const result = this.simulator.battle(p1, p2);
          console.log(`    ✅ ${result.summary}`);
          
          nextRound.push(result.winner);
        } else {
          // Número impar, pasa automáticamente
          console.log(`  ${competitors[i].name} pasa automáticamente`);
          nextRound.push(competitors[i]);
        }
      }

      competitors = nextRound;
      round++;
    }

    const champion = competitors[0];
    console.log(`\n🎉 ¡${champion.name} es el CAMPEÓN!`);
    return champion;
  }
}
```
</details>

---

## ✅ Parte 5: Prueba el Sistema Completo

### Código principal para ejecutar:

```typescript
async function main() {
  const service = new PokemonService();
  const simulator = new BattleSimulator();
  const tournament = new Tournament(service, simulator);

  try {
    // IDs de Pokémon famosos de la primera generación
    const pokemonIds = [1, 4, 7, 25, 6, 9, 94, 130]; 
    // Bulbasaur, Charmander, Squirtle, Pikachu, Charizard, Blastoise, Gengar, Gyarados

    const champion = await tournament.runTournament(pokemonIds);
    
    console.log('\n📊 Estadísticas del campeón:');
    console.log(champion);
  } catch (error) {
    console.error('Error en el torneo:', error);
  }
}

main();
```

---

## Preguntas de Reflexión

1. **¿Qué pasaría si hicieras las peticiones de forma secuencial en lugar de paralela?**
   - Pista: Calcula el tiempo con 8 Pokémon si cada petición tarda 500ms

2. **¿Por qué es importante el cache en este sistema?**
   - Pista: ¿Qué pasa si llamas dos veces a `getPokemon(25)`?

3. **¿Cómo mejorarías el algoritmo de batalla para que sea más realista?**
   - Considera: tipos de Pokémon, movimientos especiales, críticos

4. **¿Qué ventajas tiene usar genéricos en el Comparator y el Cache?**
   - Intenta usar el Cache para guardar otra cosa que no sean Pokémon

---

