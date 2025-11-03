# Guía Práctica II

## PARTE I: EJERCICIOS PRÁCTICOS

#### Ejercicio 1: Tipos Funcionales y Callbacks
**Conceptos:** Tipos funcionales, funciones de orden superior, callbacks

**Planteamiento:**
Crea un sistema simple de validación de entradas donde:
- Define un tipo `Validator` que representa una función que toma un string y retorna un booleano
- Implementa una función `processInput` que reciba una entrada y un validador
- Crea al menos 3 validadores diferentes (email, no vacío, longitud mínima)

**Ejemplo de uso esperado:**
```typescript
console.log(processInput('user@email.com', isEmail)); 
// ✓ Entrada válida: user@email.com

console.log(processInput('pass', isLongEnough)); 
// ✗ Entrada inválida: pass
```

---

#### Ejercicio 2: Genéricos Básicos
**Conceptos:** Programación genérica, reutilización de código

**Planteamiento:**
Implementa dos funciones genéricas:
1. `getLast<T>`: Retorna el último elemento de un array de cualquier tipo (o undefined si está vacío)
2. `getFirstTwo<T>`: Retorna un array con los dos primeros elementos

**Firma de las funciones:**
```typescript
function getLast<T>(arr: T[]): T | undefined {
  // Tu código aquí
}

function getFirstTwo<T>(arr: T[]): T[] {
  // Tu código aquí
}
```

**Casos de prueba:**
```typescript
console.log(getLast([1, 2, 3, 4])); // 4
console.log(getLast(['a', 'b', 'c'])); // 'c'
console.log(getLast([])); // undefined

console.log(getFirstTwo([10, 20, 30, 40])); // [10, 20]
console.log(getFirstTwo(['x', 'y', 'z'])); // ['x', 'y']
```

---

#### Ejercicio 3: Decorator Pattern Funcional
**Conceptos:** Patrón Decorator, tipos funcionales, composición

**Planteamiento:**
Implementa un sistema de logging donde puedas decorar (añadir funcionalidad) a loggers básicos:

1. Crea un tipo `Logger` que representa una función que recibe un mensaje
2. Implementa `createLogger(prefix)` que retorna un logger con un prefijo
3. Crea decoradores:
   - `withTimestamp`: Añade timestamp a los mensajes
   - `withUpperCase`: Convierte mensajes a mayúsculas

**Ejemplo de uso esperado:**
```typescript
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

---

#### Ejercicio 4: Genéricos con Restricciones
**Conceptos:** Genéricos, restricciones, CRUD operations

**Planteamiento:**
Crea un repositorio genérico que funcione con cualquier entidad que tenga `id` y `name`:

1. Define interfaces `Identifiable` y `Nameable`
2. Crea tipo `Entity` que combine ambos (intersection type)
3. Implementa clase `Repository<T extends Entity>` con:
   - `add(item: T)`
   - `findById(id: number)`
   - `findByName(name: string)`
   - `update(id: number, updates: Partial<T>)`
   - `delete(id: number)`

Investiga el tipo utilitario `Partial<T>` para las actualizaciones, asi como el Object Spread Syntax para combinar/actualizar objetos.

**Debe funcionar con:**
```ts
interface User extends Entity {
  email: string;
  age: number;
}

interface Product extends Entity {
  price: number;
  stock: number;
}

const userRepo = new Repository<User>();
const productRepo = new Repository<Product>();
```

---

#### Ejercicio 5: Contenedores Genéricos con Filtrado
**Conceptos:** Genéricos, funciones de orden superior, polimorfismo

**Planteamiento:**
En el desarrollo de aplicaciones, frecuentemente necesitamos trabajar con **contenedores de datos** que pueden almacenar diferentes tipos de información y realizar operaciones de filtrado sobre ellos.

Implemente en **TypeScript** las siguientes clases genéricas basándose en las clases proporcionadas:

```typescript
class Elemento<T> {
  public dato: T;
  public filtrar(predicado: (val: T) => boolean): T[]
}

class Contenedor<T> extends Elemento<T> {
  private items: Elemento<T>[];
  public override filtrar(predicado: (val: T) => boolean): T[]
}
```

**Requerimientos:**

1. **Clase Elemento<T>**:
   - El método `filtrar` debe retornar un array con el dato del elemento si cumple el predicado, o un array vacío si no lo cumple.

2. **Clase Contenedor<T>**:
   - El método `filtrar` debe retornar un array con todos los datos (propios y de los items) que cumplan con el predicado dado.
   - Debe manejar correctamente la recursión si los items son también Contenedores.

**Ejemplo de uso esperado:**

```typescript
// Función de filtro: mayores a 10
const mayoresA10 = (n: number): boolean => n > 10;

// Función de filtro: pares
const pares = (n: number): boolean => n % 2 === 0;

// Crear elementos
const elem1 = new Elemento<number>(5);
const elem2 = new Elemento<number>(8);
const elem3 = new Elemento<number>(15);
const elem4 = new Elemento<number>(20);

// Crear contenedor
const contenedor = new Contenedor<number>(3, [elem1, elem2, elem3]);

// Filtrar: elementos mayores a 10
console.log(contenedor.filtrar(mayoresA10)); // Output: [15]

// Filtrar en un elemento simple
console.log(elem3.filtrar(mayoresA10)); // Output: [15]
console.log(elem1.filtrar(mayoresA10)); // Output: []

// Filtrar pares
console.log(contenedor.filtrar(pares)); // Output: [8]
```

---

## PARTE II: EJERCICIOS TEÓRICOS

### Sección A: Selección Simple
*Selecciona la respuesta correcta

#### 1. ¿Cuál es la principal ventaja del patrón Strategy funcional sobre el basado en clases?
a) Mejor performance  
b) Menos código y mayor simplicidad  
c) Más seguridad de tipos  
d) Mejor encapsulación  

#### 2. ¿Qué función de orden superior transformaría [1,2,3,4] en [2,4]?
a) map(x => x * 2)  
b) filter(x => x % 2 === 0)  
c) reduce((acc, x) => acc + x)  
d) forEach(x => x * 2)  

#### 3. En el contexto de tipos algebraicos, un tipo Union es un:
a) Product Type  
b) Sum Type  
c) Intersection Type  
d) Generic Type  

#### 4. ¿Cuál es el propósito principal de await?
a) Ejecutar código en paralelo  
b) Pausar la ejecución hasta que una promesa se resuelva  
c) Manejar errores  
d) Crear promesas  

#### 5. En genéricos, ¿qué representa la T?
a) Un tipo específico predefinido  
b) Un parámetro de tipo que se define al usar el genérico  
c) Siempre es un tipo numérico  
d) Un tipo opcional

#### 6. ¿Qué restricción permite que un genérico funcione con arrays de cualquier tipo?
a) `<T extends any[]>`
b) `<T extends Array>`
c) `<T extends []>`
d) `<T extends Array<any>>`

#### 7. Sabiendo que `Triangle` es un subtipo de `Shape` (Forma).

1.  ¿Podemos pasar una variable `Triangle` a una función `drawShape(shape: Shape): void`?
2.  ¿Podemos pasar una variable `Shape` a una función `drawTriangle(triangle: Triangle): void`?
3.  ¿Podemos pasar un array de objetos `Triangle` (`Triangle[]`) a una función `drawShapes(shapes: Shape[]): void`?
4.  ¿Podemos asignar la función `drawShape()` a una variable de tipo función `(triangle: Triangle) => void`?
5.  ¿Podemos asignar la función `drawTriangle()` a una variable de tipo función `(shape: Shape) => void`?
6.  ¿Podemos asignar una función `getShape(): Shape` a una variable de tipo función `() => Triangle`?

---

### Sección B: Selección Múltiple
*Selecciona todas las respuestas correctas*

#### 1. ¿Qué métodos son funciones de orden superior?
a) map  
b) filter  
c) parseInt  
d) reduce  
e) setTimeout  

#### 2. En el contexto de tipos, ¿qué son Product Types?
a) Representan "Y" lógico  
b) Ejemplos: tuplas, objetos  
c) Representan "O" lógico  
d) Requieren todas las propiedades  
e) Son lo mismo que Union Types  

#### 3. ¿Qué permite el patrón Decorator?
a) Añadir responsabilidades dinámicamente  
b) Extender funcionalidad sin herencia  
c) Modificar el objeto original  
d) Componer comportamientos  
e) Solo funciona con clases  

#### 4. Sobre Promise.all() y Promise.race():
a) Promise.all() falla si una promesa falla  
b) Promise.race() retorna la primera promesa resuelta  
c) Ambos ejecutan promesas en paralelo  
d) Promise.all() ejecuta secuencialmente  
e) Promise.race() espera a todas las promesas  

#### 5. Ventajas de usar tipos funcionales:
a) Permiten pasar comportamiento como datos  
b) Facilitan el patrón Strategy  
c) Requieren menos memoria  
d) Reducen acoplamiento  
e) Eliminan la necesidad de clases  

#### 6. Sobre genéricos con restricciones `<T extends X>`:
a) T debe tener al menos lo que X tiene  
b) Permite usar propiedades/métodos de X en T  
c) T solo puede ser X exactamente  
d) Mejora la seguridad de tipos  
e) T puede ser más específico que X  
