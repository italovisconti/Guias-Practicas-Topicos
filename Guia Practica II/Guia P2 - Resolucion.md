# Guía Práctica II - Resoluciones

## PARTE I: EJERCICIOS PRÁCTICOS

#### Ejercicio 1: Tipos Funcionales y Callbacks
**Resolución:**
```typescript
type Validator = (value: string) => boolean;

function processInput(input: string, validator: Validator): string {
  if (validator(input)) {
    return `✓ Entrada válida: ${input}`;
  }
  return `✗ Entrada inválida: ${input}`;
}

// Validadores específicos
const isEmail: Validator = (value) => value.includes('@');
const isNotEmpty: Validator = (value) => value.trim().length > 0;
const isLongEnough: Validator = (value) => value.length >= 8;

// Uso
console.log(processInput('user@email.com', isEmail)); // ✓ Entrada válida: user@email.com
console.log(processInput('pass', isLongEnough)); // ✗ Entrada inválida: pass
```

**Explicación:** Este ejercicio demuestra el uso de tipos funcionales básicos. Definimos `Validator` como un tipo que describe una función que toma un string y retorna un booleano. La función `processInput` es de orden superior porque acepta otra función como parámetro, permitiendo diferentes estrategias de validación sin modificar la lógica principal.

---

#### Ejercicio 2: Genéricos Básicos
**Resolución:**
```typescript
function getLast<T>(arr: T[]): T | undefined {
  return arr.length > 0 ? arr[arr.length - 1] : undefined;
}

function getFirstTwo<T>(arr: T[]): T[] {
  return arr.slice(0, 2);
}

// Uso
console.log(getLast([1, 2, 3, 4])); // 4
console.log(getLast(['a', 'b', 'c'])); // 'c'
console.log(getLast([])); // undefined

console.log(getFirstTwo([10, 20, 30, 40])); // [10, 20]
console.log(getFirstTwo(['x', 'y', 'z'])); // ['x', 'y']
```

**Explicación:** Los genéricos permiten crear funciones reutilizables que funcionan con cualquier tipo. `T` es un parámetro de tipo que se infiere automáticamente del argumento pasado. Esto proporciona seguridad de tipos sin sacrificar flexibilidad - TypeScript sabe que si pasas un `number[]`, obtendrás un `number | undefined`.

---

#### Ejercicio 3: Decorator Pattern Funcional
**Resolución:**
```typescript
type Logger = (message: string) => void;

function createLogger(prefix: string): Logger {
  return (message: string) => {
    console.log(`[${prefix}] ${message}`);
  };
}

function withTimestamp(logger: Logger): Logger {
  return (message: string) => {
    const timestamp = new Date().toISOString();
    logger(`${timestamp} - ${message}`);
  };
}

function withUpperCase(logger: Logger): Logger {
  return (message: string) => {
    logger(message.toUpperCase());
  };
}

// Uso - componiendo decoradores
const basicLogger = createLogger('APP');
const timestampedLogger = withTimestamp(basicLogger);
const fullLogger = withUpperCase(timestampedLogger);

basicLogger('Hello'); 
// [APP] Hello

timestampedLogger('Hello');
// [APP] 2024-01-15T10:30:00.000Z - Hello

fullLogger('Hello');
// [APP] 2024-01-15T10:30:00.000Z - HELLO
```

**Explicación:** Este patrón Decorator funcional muestra cómo añadir comportamientos de forma modular. Cada función decoradora toma un `Logger` y retorna un nuevo `Logger` con funcionalidad adicional. La clave está en que cada decorador envuelve la función anterior, permitiendo composición: `withUpperCase` llama a `logger`, que es `withTimestamp`, que a su vez llama al `basicLogger`. Esto es más limpio que usar clases cuando solo necesitamos añadir comportamiento a funciones.

---

#### Ejercicio 4: Genéricos con Restricciones
**Resolución:**

```typescript
interface Identifiable {
  id: number;
}

interface Nameable {
  name: string;
}

// Tipo que requiere AMBAS propiedades
type Entity = Identifiable & Nameable;

class Repository<T extends Entity> {
  private items: T[] = [];
  
  add(item: T): void {
    this.items.push(item);
  }
  
  findById(id: number): T | undefined {
    return this.items.find(item => item.id === id);
  }
  
  findByName(name: string): T[] {
    return this.items.filter(item => 
      item.name.toLowerCase().includes(name.toLowerCase())
    );
  }
  
  getAll(): T[] {
    return [...this.items]; // retorna copia
  }
  
  update(id: number, updates: Partial<T>): boolean {
    const index = this.items.findIndex(item => item.id === id);
    if (index === -1) return false;
    
    this.items[index] = { ...this.items[index], ...updates };
    return true;
  }
  
  delete(id: number): boolean {
    const initialLength = this.items.length;
    this.items = this.items.filter(item => item.id !== id);
    return this.items.length < initialLength;
  }
}

// Modelos específicos
interface User extends Entity {
  email: string;
  age: number;
}

interface Product extends Entity {
  price: number;
  stock: number;
}

// Uso
const userRepo = new Repository<User>();
userRepo.add({ id: 1, name: 'Alice', email: 'alice@email.com', age: 25 });
userRepo.add({ id: 2, name: 'Bob', email: 'bob@email.com', age: 30 });

const productRepo = new Repository<Product>();
productRepo.add({ id: 1, name: 'Laptop', price: 1000, stock: 5 });

console.log(userRepo.findById(1)); 
// { id: 1, name: 'Alice', email: 'alice@email.com', age: 25 }

console.log(userRepo.findByName('bob'));
// [{ id: 2, name: 'Bob', email: 'bob@email.com', age: 30 }]

userRepo.update(1, { age: 26 });
console.log(userRepo.findById(1)?.age); // 26
```

**Explicación:** Este ejercicio muestra el poder de los genéricos con restricciones. `<T extends Entity>` significa "T puede ser cualquier tipo, siempre que tenga `id` y `name`". Esto nos da:
1. **Reutilización**: La misma clase funciona para User, Product, o cualquier otro Entity
2. **Seguridad de tipos**: TypeScript sabe que T tiene id y name, permitiéndonos usarlos
3. **Flexibilidad**: Cada tipo específico (User, Product) puede tener propiedades adicionales

`Partial<T>` es un tipo utilitario que hace todas las propiedades opcionales, perfecto para actualizaciones parciales.

---

#### Ejercicio 5: Contenedores Genéricos con Filtrado
**Resolución:**
```typescript
class Elemento<T> {
  public dato: T;

  constructor(dato: T) {
    this.dato = dato;
  }

  public filtrar(predicado: (val: T) => boolean): T[] {
    // Si el dato cumple el predicado, lo retornamos en un array
    // Si no, retornamos un array vacío
    return predicado(this.dato) ? [this.dato] : [];
  }
}

class Contenedor<T> extends Elemento<T> {
  private items: Elemento<T>[];

  constructor(dato: T, items: Elemento<T>[] = []) {
    super(dato);
    this.items = items;
  }

  public override filtrar(predicado: (val: T) => boolean): T[] {
    const resultados: T[] = [];

    // Verificar si el dato del contenedor cumple el predicado
    if (predicado(this.dato)) {
      resultados.push(this.dato);
    }

    // Filtrar recursivamente cada item
    for (const item of this.items) {
      // Llamar a filtrar en cada item (polimorfismo)
      // Esto funciona tanto para Elemento como para Contenedor
      const itemResultados = item.filtrar(predicado);
      resultados.push(...itemResultados);
    }

    return resultados;
  }
}

// USO
// Funciones de filtrado
const mayoresA10 = (n: number): boolean => n > 10;
const pares = (n: number): boolean => n % 2 === 0;
const menoresA10 = (n: number): boolean => n < 10;

// Crear elementos simples
const elem1 = new Elemento<number>(5);
const elem2 = new Elemento<number>(8);
const elem3 = new Elemento<number>(15);
const elem4 = new Elemento<number>(20);

// Crear contenedor simple
const contenedor = new Contenedor<number>(3, [elem1, elem2, elem3]);

console.log("FILTRADO BÁSICO");
console.log(contenedor.filtrar(mayoresA10)); // Output: [15]
console.log(contenedor.filtrar(pares)); // Output: [8]
console.log(contenedor.filtrar(menoresA10)); // Output: [3, 5, 8]

console.log("\nFILTRADO EN ELEMENTO SIMPLE");
console.log(elem3.filtrar(mayoresA10)); // Output: [15]
console.log(elem1.filtrar(mayoresA10)); // Output: []

// Ejemplo avanzado: Contenedores anidados
console.log("\nCONTENEDORES ANIDADOS");
const subContenedor = new Contenedor<number>(2, [elem1, elem2]);
const contenedorPrincipal = new Contenedor<number>(1, [subContenedor, elem3, elem4]);

console.log(contenedorPrincipal.filtrar(mayoresA10)); 
// Output: [15, 20] (solo los valores mayores a 10)

console.log(contenedorPrincipal.filtrar(menoresA10)); 
// Output: [1, 2, 5, 8] (todos los valores menores a 10)

// Ejemplo con strings
console.log("\nEJEMPLO CON STRINGS");
const tieneA = (s: string): boolean => s.includes('a');

const str1 = new Elemento<string>('hola');
const str2 = new Elemento<string>('mundo');
const str3 = new Elemento<string>('casa');

const contenedorStrings = new Contenedor<string>('palabra', [str1, str2, str3]);

console.log(contenedorStrings.filtrar(tieneA)); 
// Output: ['palabra', 'hola', 'casa']
```

**Explicación:**

1. **Clase Elemento<T>**:
   - El método `filtrar` evalúa si su propio dato cumple el predicado
   - Retorna un array con el dato si cumple, o un array vacío si no
   - Esto mantiene consistencia: siempre retornamos un array de T

2. **Clase Contenedor<T>**:
   - Primero verifica su propio dato y lo agrega si cumple el predicado
   - Luego itera sobre cada item llamando a su método `filtrar`
   - Gracias al **polimorfismo**, no necesita saber si el item es un Elemento o un Contenedor
   - Usa el operador spread `...` para aplanar los resultados de cada item
   - Maneja automáticamente estructuras anidadas mediante recursión

---

## PARTE II: EJERCICIOS TEÓRICOS

### Sección A: Selección Simple

#### 1. ¿Cuál es la principal ventaja del patrón Strategy funcional sobre el basado en clases?
**a)** Mejor performance  
**b)** Menos código y mayor simplicidad ✓  
**c)** Más seguridad de tipos  
**d)** Mejor encapsulación  

**Respuesta correcta: b**  
**Explicación:** El Strategy funcional elimina la necesidad de interfaces y múltiples clases cuando los algoritmos son simples funciones. Reduce el boilerplate significativamente manteniendo la misma flexibilidad.

---

#### 2. ¿Qué función de orden superior transformaría [1,2,3,4] en [2,4]?
**a)** map(x => x * 2)  
**b)** filter(x => x % 2 === 0) ✓  
**c)** reduce((acc, x) => acc + x)  
**d)** forEach(x => x * 2)  

**Respuesta correcta: b**  
**Explicación:** `filter` selecciona elementos que cumplen una condición. La condición `x % 2 === 0` selecciona solo los números pares (2 y 4). `map` transformaría pero no filtraría, y `reduce` acumularía en un solo valor.

---

#### 3. En el contexto de tipos algebraicos, un tipo Union es un:
**a)** Product Type  
**b)** Sum Type ✓  
**c)** Intersection Type  
**d)** Generic Type  

**Respuesta correcta: b**  
**Explicación:** Los Sum Types representan "esto O aquello", como `string | number`. El número de valores posibles es la suma de cada tipo. Los Product Types representan "esto Y aquello", como objetos donde necesitas todas las propiedades.

---

#### 4. ¿Cuál es el propósito principal de await?
**a)** Ejecutar código en paralelo  
**b)** Pausar la ejecución hasta que una promesa se resuelva ✓  
**c)** Manejar errores  
**d)** Crear promesas  

**Respuesta correcta: b**  
**Explicación:** `await` pausa la ejecución de una función async hasta que la promesa se resuelva, permitiendo escribir código asíncrono de forma secuencial y legible. Solo puede usarse dentro de funciones async.

---

#### 5. En genéricos, ¿qué representa la T?
**a)** Un tipo específico predefinido  
**b)** Un parámetro de tipo que se define al usar el genérico ✓  
**c)** Siempre es un tipo numérico  
**d)** Un tipo opcional  

**Respuesta correcta: b**  
**Explicación:** T es un parámetro de tipo (type parameter), un placeholder que será reemplazado por un tipo concreto cuando uses el genérico. Es como un parámetro de función, pero para tipos en lugar de valores.

---

#### 6. ¿Qué restricción permite que un genérico funcione con arrays de cualquier tipo?
**a)** `<T extends any[]>` ✓  
**b)** `<T extends Array>`  
**c)** `<T extends []>`  
**d)** `<T extends Array<any>>`  

**Respuesta correcta: a**  
**Explicación:** `<T extends any[]>` restringe T para que sea un array de cualquier tipo. Esta es la forma más limpia y comúnmente usada para indicar que T debe ser un array. Las otras opciones no son sintaxis válidas o correctas en este contexto.

---

#### 7. Sabiendo que `Triangle` es un subtipo de `Shape` (Forma), ¿cuál de las siguientes afirmaciones es FALSA?

**Contexto:**
1. ¿Podemos pasar una variable `Triangle` a una función `drawShape(shape: Shape): void`?
2. ¿Podemos pasar una variable `Shape` a una función `drawTriangle(triangle: Triangle): void`?
3. ¿Podemos pasar un array de objetos `Triangle` (`Triangle[]`) a una función `drawShapes(shapes: Shape[]): void`?
4. ¿Podemos asignar la función `drawShape()` a una variable de tipo función `(triangle: Triangle) => void`?
5. ¿Podemos asignar la función `drawTriangle()` a una variable de tipo función `(shape: Shape) => void`?
6. ¿Podemos asignar una función `getShape(): Shape` a una variable de tipo función `() => Triangle`?

**SUSTITUCIONES PERMITIDAS**

1. **Sí** - Podemos sustituir un `Triangle` (Triángulo) donde sea que se espere un `Shape` (Forma). Covarianza: subtipo sustituye supertipo.

2. **No** - No podemos usar un supertipo en lugar de un subtipo. Viola el principio de sustitución de Liskov.

3. **Sí** - Los arrays son **covariantes**, por lo que podemos usar un array de objetos `Triangle` en lugar de un array de objetos `Shape`.

4. **Sí** - Las funciones son **bivariantes** en sus argumentos en TypeScript, por lo que podemos usar `(shape: Shape) => void` como `(triangle: Triangle) => void`.

5. **Sí** - Las funciones son **bivariantes** en sus argumentos en TypeScript, por lo que podemos usar `(triangle: Triangle) => void` como `(shape: Shape) => void`.

6. **No** - Las funciones son bivariantes en sus argumentos pero NO en sus tipos de retorno en TypeScript. No podemos usar una función de tipo `() => Shape` como una función de tipo `() => Triangle`, porque esperamos un `Triangle` específico.

---

### Sección B: Selección Múltiple

#### 1. ¿Qué métodos son funciones de orden superior?
**a)** map ✓  
**b)** filter ✓  
**c)** parseInt  
**d)** reduce ✓  
**e)** setTimeout ✓  

**Respuestas correctas: a, b, d, e**  
**Explicación:** Las funciones de orden superior son aquellas que aceptan funciones como argumentos o retornan funciones. map, filter, reduce y setTimeout todas aceptan funciones callback. parseInt acepta un string y un número, no funciones.

---

#### 2. En el contexto de tipos, ¿qué son Product Types?
**a)** Representan "Y" lógico ✓  
**b)** Ejemplos: tuplas, objetos ✓  
**c)** Representan "O" lógico  
**d)** Requieren todas las propiedades ✓  
**e)** Son lo mismo que Union Types  

**Respuestas correctas: a, b, d**  
**Explicación:** Product Types combinan tipos con "Y": necesitas A Y B Y C. Tuplas `[string, number]` y objetos `{ name: string, age: number }` son Product Types. Union Types son Sum Types (representan "O"). Product Types requieren que todas las propiedades estén presentes.

---

#### 3. ¿Qué permite el patrón Decorator?
**a)** Añadir responsabilidades dinámicamente ✓  
**b)** Extender funcionalidad sin herencia ✓  
**c)** Modificar el objeto original  
**d)** Componer comportamientos ✓  
**e)** Solo funciona con clases  

**Respuestas correctas: a, b, d**  
**Explicación:** Decorator añade funcionalidad envolviendo objetos, sin modificar el original. Es alternativa a herencia. Permite composición (múltiples decoradores). Funciona tanto con clases como con funciones (versión funcional).

---

#### 4. Sobre Promise.all() y Promise.race():
**a)** Promise.all() falla si una promesa falla ✓  
**b)** Promise.race() retorna la primera promesa resuelta ✓  
**c)** Ambos ejecutan promesas en paralelo ✓  
**d)** Promise.all() ejecuta secuencialmente  
**e)** Promise.race() espera a todas las promesas  

**Respuestas correctas: a, b, c**  
**Explicación:** Promise.all() se rechaza si cualquier promesa falla, ejecuta todas en paralelo y espera a todas. Promise.race() retorna la primera en resolverse (exitosa o rechazada), ejecuta en paralelo pero no espera a todas.

---

#### 5. Ventajas de usar tipos funcionales:
**a)** Permiten pasar comportamiento como datos ✓  
**b)** Facilitan el patrón Strategy ✓  
**c)** Requieren menos memoria  
**d)** Reducen acoplamiento ✓  
**e)** Eliminan la necesidad de clases  

**Respuestas correctas: a, b, d**  
**Explicación:** Los tipos funcionales permiten tratar funciones como valores, facilitando patrones como Strategy sin clases. Reducen acoplamiento al depender de contratos de función en lugar de tipos concretos. No eliminan la necesidad de clases (son complementarios) ni afectan necesariamente el uso de memoria.

---

#### 6. Sobre genéricos con restricciones `<T extends X>`:
**a)** T debe tener al menos lo que X tiene ✓  
**b)** Permite usar propiedades/métodos de X en T ✓  
**c)** T solo puede ser X exactamente  
**d)** Mejora la seguridad de tipos ✓  
**e)** T puede ser más específico que X ✓  

Respuestas correctas: a, b, d, e

Explicación:  
- `<T extends X>` obliga a que cualquier tipo que sustituya T incluya al menos las propiedades/métodos de X (a).  
- Por eso el compilador permite acceder a los miembros de X sobre valores de tipo T (b).  
- No exige igualdad exacta: T puede ser un subtipo más específico que X, no solo X puro (c es falso, e es verdadero).  
- Restringir T reduce errores y proporciona mayor seguridad de tipos al limitar los tipos aceptables (d).

