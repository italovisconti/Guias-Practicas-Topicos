### Ejercicio 1: Identificación de Patrones

Lee el siguiente código y responde:
```typescript
class DatabaseConnection {
    private static instance: DatabaseConnection;
    private constructor() {}
    
    static getInstance(): DatabaseConnection {
        if (!this.instance) {
            this.instance = new DatabaseConnection();
        }
        return this.instance;
    }
}
```

**Preguntas**:
1. ¿Qué patrón de diseño se está implementando?
2. ¿Cuál es el propósito de hacer el constructor privado?
3. ¿En qué situaciones del mundo real usarías este patrón?

#### [[Resoluciones Guías P1#Ejercicio 1: Identificación de Patrones|Solución (Obsidian)]] · [Ver en GitHub](./Resoluciones%20Guías%20P1.md#ejercicio-1-identificación-de-patrones)
---
### Ejercicio 2: Implementación desde UML

Implementa el siguiente diagrama de clases en TypeScript:

```
┌─────────────────────┐
│    <<interface>>    │
│        Shape        │
├─────────────────────┤
│ + area(): number    │
│ + draw(): void      │
│ + describe(): string│
└──────────▲──────────┘
           │
     ┌─────┴──────┐
     │            │
┌────┴───┐   ┌────┴───┐
│ Circle │   │ Square │
├────────┤   ├────────┤
│ -radius│   │ -side  │
└────────┘   └────────┘
```

**Requisitos**:
- Implementa la interfaz `Shape`
- Implementa las clases `Circle` y `Square`
- Agrega un método `describe()` que retorne una descripción de la forma
- Crea un array de formas mixtas y calcula el área total 

#### [[Resoluciones Guías P1#Ejercicio 2: Implementación desde UML|Solución (Obsidian)]] · [Ver en GitHub](./Resoluciones%20Guías%20P1.md#ejercicio-2-implementación-desde-uml)

---
### Ejercicio 3: Refactorización con Decorator

El siguiente código calcula el precio de pizzas con ingredientes adicionales:

```typescript
class Pizza {
    private base: number = 10;
    private queso: boolean = false;
    private pepperoni: boolean = false;
    private champinones: boolean = false;
    private extraQueso: boolean = false;
    
    agregarQueso() { this.queso = true; }
    agregarPepperoni() { this.pepperoni = true; }
    agregarChampinones() { this.champinones = true; }
    agregarExtraQueso() { this.extraQueso = true; }
    
    calcularPrecio(): number {
        let precio = this.base;
        if (this.queso) precio += 2;
        if (this.pepperoni) precio += 3;
        if (this.champinones) precio += 2.5;
        if (this.extraQueso) precio += 1.5;
        return precio;
    }
    
    getDescripcion(): string {
        let desc = "Pizza base";
        if (this.queso) desc += " + queso";
        if (this.pepperoni) desc += " + pepperoni";
        if (this.champinones) desc += " + champiñones";
        if (this.extraQueso) desc += " + extra queso";
        return desc;
    }
}
```

Refactoriza usando el patrón Decorator para:
- Eliminar los booleanos
- Hacer el código más extensible (agregar nuevos ingredientes sin modificar código existente)
- Permitir agregar el mismo ingrediente múltiples veces
- Mantener la funcionalidad de `calcularPrecio()` y `getDescripcion()`

#### [[Resoluciones Guías P1#Ejercicio 3: Refactorización con Decorator|Solución (Obsidian)]] · [Ver en GitHub](./Resoluciones%20Guías%20P1.md#ejercicio-3-refactorización-con-decorator)
---
### Ejercicio 4: Sistema de Tarifas UrbanRide

Eres desarrollador en "*UrbanRide*", una aplicación de transporte urbano que necesita calcular tarifas dinámicas para sus viajes. El sistema debe ser lo suficientemente flexible para adaptarse a diferentes tipos de viajes y aplicar recargos según las circunstancias.

**Requisitos del Sistema:**
1. **Cálculo Base de Tarifas:**
	- **Viajes Cortos** (< 8 km): Tarifa base de $1.50 + $0.80 por kilómetro
	- **Viajes Medios** (≥ 8 km y < 12 km): Tarifa base de $1.80 + $0.70 por kilómetro
	- **Viajes Largos** (≥ 12 km): Tarifa base de $2.00 + $0.60 por kilómetro

2. **Recargos Aplicables:**    
    - **Nocturno**: +15% sobre el total
    - **Aeropuerto**: +$3.00 fijo
    - **Fin de Semana**: +25% sobre el total

3. **Funcionalidad Requerida:**    
    - Seleccionar automáticamente la estrategia de tarifa base según la distancia
    - Permitir aplicar múltiples recargos de forma encadenada
    - Mostrar desglose detallado del costo (base + cada recargo)
    - Calcular el precio final total

#### [[Resoluciones Guías P1#Ejercicio 4: Sistema de Tarifas UrbanRide|Solución (Obsidian)]] · [Ver en GitHub](./Resoluciones%20Guías%20P1.md#ejercicio-4-sistema-de-tarifas-urbanride)
---

### Ejercicio 5: Sistema de Archivos Virtual con Composite

Implementa un sistema de archivos virtual donde los archivos individuales y las carpetas puedan tratarse de forma uniforme (sin usar `instanceof`).

**Requisitos:**
- **Interfaz `ElementoFS`:** métodos `obtenerNombre(): string`, `obtenerTamano(): number` (en KB) y `mostrar(indentacion?: number): void`.
- **Clase `Archivo` (Hoja):** almacena su nombre y tamaño propio en KB.
- **Clase `Carpeta` (Compuesto):**
  - Permite agregar elementos hijos (`ElementoFS[]`).
  - `obtenerTamano()` calcula la suma recursiva de todos sus elementos.
  - `mostrar()` imprime el árbol con indentación jerárquica.

> *Nota: Asume que la estructura es un árbol acíclico (una carpeta no se contiene a sí misma).*

**Ejemplo de uso esperado:**

```typescript
const resume = new Archivo("cv.pdf", 500);
const photo = new Archivo("foto_perfil.png", 1200);
const config = new Archivo(".env", 50);
const script = new Archivo("deploy.sh", 150);

const subcarpeta = new Carpeta("Scripts");
subcarpeta.agregar(script);
subcarpeta.agregar(config);

const carpetaRaiz = new Carpeta("MiProyecto");
carpetaRaiz.agregar(resume);
carpetaRaiz.agregar(photo);
carpetaRaiz.agregar(subcarpeta);

console.log(`Tamaño total: ${carpetaRaiz.obtenerTamano()} KB`);
console.log("\nEstructura de archivos:");
carpetaRaiz.mostrar();
```

**Salida esperada:**

```text
Tamaño total: 1900 KB

Estructura de archivos:
📁 MiProyecto (1900 KB)
  📄 cv.pdf (500 KB)
  📄 foto_perfil.png (1200 KB)
  📁 Scripts (200 KB)
    📄 deploy.sh (150 KB)
    📄 .env (50 KB)
```

**Preguntas de reflexión:**

1. ¿Por qué `Carpeta` almacena una lista de `ElementoFS` y no de `Archivo`?
2. Si se agrega un `EnlaceSimbolico` que implementa `ElementoFS`, ¿hay que modificar `Carpeta`? ¿Qué principio SOLID se ilustra? Antes de implementarlo, ¿qué habría que decidir sobre el tamaño que informa un enlace?

#### [[Resoluciones Guías P1#Ejercicio 5: Sistema de Archivos Virtual con Composite|Solución (Obsidian)]] · [Ver en GitHub](./Resoluciones%20Guías%20P1.md#ejercicio-5-sistema-de-archivos-virtual-con-composite)
---
