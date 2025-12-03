# 🤝 Práctica en Parejas: Creando y Consumiendo Paquetes con npm + GitHub

## Contexto

En el mundo real, los desarrolladores constantemente crean librerías que otros equipos consumen. En esta práctica van a experimentar **ambos lados**: uno será el **creador del paquete** y el otro será el **consumidor**.

> [!INFO] ¿Por qué GitHub y no npmjs.com?
> Publicar en el registro oficial de npm requiere crear una cuenta y el paquete queda público para siempre. Para practicar, usaremos **GitHub como registro privado** — npm puede instalar paquetes directamente desde repositorios de GitHub.

---

## 🎯 Objetivo

Crear un **Sistema de Calculadora de Propinas** donde:
- **Persona A** crea un paquete con funciones utilitarias para cálculos
- **Persona B** consume ese paquete para construir la aplicación final

El código es simple, pero el flujo de trabajo es exactamente como se hace en empresas reales.

---

## 📋 Roles

| Rol | Responsabilidad |
|-----|-----------------|
| **Persona A** (Creador) | Crea el paquete `tip-utils` con funciones de cálculo |
| **Persona B** (Consumidor) | Usa `tip-utils` para crear la app de propinas |

> [!TIP] Intercambien roles
> Cuando terminen, intercambien roles y repitan el ejercicio. Así ambos experimentan crear y consumir paquetes.

---

# 👤 Persona A: Creador del Paquete

## Parte 1: Configurar el repositorio

### Paso 1.1: Crear repositorio en GitHub
1. Vayan a [github.com/new](https://github.com/new)
2. Nombre: `tip-utils`
3. Descripción: "Utilidades para cálculo de propinas"
4. ✅ Público
5. ✅ Add README
6. Creen el repositorio

### Paso 1.2: Clonar y configurar localmente
```bash
git clone https://github.com/SU_USUARIO/tip-utils.git
cd tip-utils
npm init -y
npm install -D typescript @types/node
npx tsc --init
```

### Paso 1.3: Configurar TypeScript para el paquete

Editen `tsconfig.json`:
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "declaration": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### Paso 1.4: Configurar package.json

Editen `package.json` para que se vea así:
```json
{
  "name": "tip-utils",
  "version": "1.0.0",
  "description": "Utilidades para cálculo de propinas",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "scripts": {
    "build": "tsc",
    "prepublishOnly": "npm run build"
  },
  "keywords": ["tips", "calculator", "utils"],
  "author": "SU_NOMBRE",
  "license": "MIT",
  "devDependencies": {
    "typescript": "^5.1.3",
    "@types/node": "^18.16.0"
  }
}
```

> [!NOTE] Campos importantes
> - `main`: Apunta al archivo compilado (JavaScript)
> - `types`: Apunta a las declaraciones de tipos (para TypeScript)
> - `prepublishOnly`: Se ejecuta automáticamente antes de publicar

---

## Parte 2: Crear las funciones del paquete

### Paso 2.1: Crear la estructura
```bash
mkdir src
touch src/index.ts
```

### Paso 2.2: Implementar las funciones

Creen `src/index.ts` con las siguientes funciones:

```typescript
// src/index.ts

/**
 * Calcula el monto de la propina
 * @param billAmount - Monto de la cuenta
 * @param tipPercentage - Porcentaje de propina (ej: 15 para 15%)
 * @returns Monto de la propina
 */
export function calculateTip(billAmount: number, tipPercentage: number): number {
  // TODO: Implementar
  // Fórmula: billAmount * (tipPercentage / 100)
  // Redondear a 2 decimales
}

/**
 * Calcula el total a pagar (cuenta + propina)
 * @param billAmount - Monto de la cuenta
 * @param tipPercentage - Porcentaje de propina
 * @returns Total a pagar
 */
export function calculateTotal(billAmount: number, tipPercentage: number): number {
  // TODO: Implementar
  // Usar calculateTip internamente
}

/**
 * Divide la cuenta entre varias personas
 * @param totalAmount - Total a pagar
 * @param numberOfPeople - Número de personas
 * @returns Monto por persona
 */
export function splitBill(totalAmount: number, numberOfPeople: number): number {
  // TODO: Implementar
  // Manejar el caso de 0 personas (lanzar error)
}

/**
 * Sugiere propinas basado en la calidad del servicio
 * @param serviceQuality - 'bad' | 'ok' | 'good' | 'excellent'
 * @returns Porcentaje sugerido
 */
export function suggestTipPercentage(serviceQuality: 'bad' | 'ok' | 'good' | 'excellent'): number {
  // TODO: Implementar
  // bad: 10%, ok: 15%, good: 18%, excellent: 25%
}

/**
 * Formatea un monto como moneda
 * @param amount - Monto a formatear
 * @param currency - Código de moneda (default: 'USD')
 * @returns String formateado (ej: "$25.50")
 */
export function formatCurrency(amount: number, currency: string = 'USD'): string {
  // TODO: Implementar
  // Usar Intl.NumberFormat
}
```

<details>
<summary>💡 Ver solución de las funciones</summary>

```typescript
// src/index.ts

export function calculateTip(billAmount: number, tipPercentage: number): number {
  const tip = billAmount * (tipPercentage / 100);
  return Math.round(tip * 100) / 100; // Redondear a 2 decimales
}

export function calculateTotal(billAmount: number, tipPercentage: number): number {
  const tip = calculateTip(billAmount, tipPercentage);
  return Math.round((billAmount + tip) * 100) / 100;
}

export function splitBill(totalAmount: number, numberOfPeople: number): number {
  if (numberOfPeople <= 0) {
    throw new Error('El número de personas debe ser mayor a 0');
  }
  return Math.round((totalAmount / numberOfPeople) * 100) / 100;
}

export function suggestTipPercentage(serviceQuality: 'bad' | 'ok' | 'good' | 'excellent'): number {
  const suggestions: Record<string, number> = {
    bad: 10,
    ok: 15,
    good: 18,
    excellent: 25
  };
  return suggestions[serviceQuality];
}

export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency
  }).format(amount);
}
```

</details>

---

## Parte 3: Compilar y publicar

### Paso 3.1: Compilar el paquete
```bash
npm run build
```

Esto creará la carpeta `dist/` con los archivos JavaScript y las declaraciones de tipos.

### Paso 3.2: Crear .gitignore
```bash
echo "node_modules/" > .gitignore
```

> [!WARNING] ¡No ignoren dist/!
> Normalmente se ignora `dist/`, pero como estamos usando GitHub como registro, **necesitamos incluir los archivos compilados**.

### Paso 3.3: Subir a GitHub
```bash
git add .
git commit -m "feat: add tip calculation utilities"
git push origin main
```

### Paso 3.4: Notificar a Persona B
Envíen a su compañero/a:
- El enlace del repositorio: `https://github.com/SU_USUARIO/tip-utils`
- ¡Listo para consumir!

---

# 👤 Persona B: Consumidor del Paquete

## Parte 1: Configurar el proyecto

### Paso 1.1: Crear el proyecto
```bash
mkdir tip-calculator-app
cd tip-calculator-app
npm init -y
npm install -D typescript ts-node @types/node
npx tsc --init
```

### Paso 1.2: Instalar el paquete desde GitHub

```bash
npm install github:USUARIO_PERSONA_A/tip-utils
```

> [!INFO] Sintaxis de instalación desde GitHub
> - `npm install github:usuario/repo` — rama por defecto
> - `npm install github:usuario/repo#branch` — rama específica
> - `npm install github:usuario/repo#v1.0.0` — tag específico

Verifiquen que en `package.json` aparezca algo como:
```json
"dependencies": {
  "tip-utils": "github:USUARIO/tip-utils"
}
```

---

## Parte 2: Crear la aplicación

### Paso 2.1: Crear la estructura
```bash
mkdir src
touch src/app.ts
```

### Paso 2.2: Implementar la aplicación interactiva

Creen `src/app.ts`:

```typescript
// src/app.ts
import * as readline from 'readline';
import {
  calculateTip,
  calculateTotal,
  splitBill,
  suggestTipPercentage,
  formatCurrency
} from 'tip-utils';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function main() {
  console.log('\n🧾 === CALCULADORA DE PROPINAS === 🧾\n');

  // TODO: Pedir el monto de la cuenta
  const billInput = await question('💰 Ingrese el monto de la cuenta: $');
  const billAmount = parseFloat(billInput);

  // TODO: Validar que sea un número válido
  if (isNaN(billAmount) || billAmount <= 0) {
    console.log('❌ Monto inválido');
    rl.close();
    return;
  }

  // TODO: Preguntar calidad del servicio
  console.log('\n¿Cómo fue el servicio?');
  console.log('  1. 😠 Malo (bad)');
  console.log('  2. 😐 Regular (ok)');
  console.log('  3. 🙂 Bueno (good)');
  console.log('  4. 🤩 Excelente (excellent)');
  
  const serviceInput = await question('\nOpción (1-4): ');
  
  // TODO: Mapear la opción a la calidad
  // Usar suggestTipPercentage para obtener el porcentaje

  // TODO: Preguntar número de personas

  // TODO: Calcular y mostrar resultados usando las funciones del paquete:
  // - calculateTip
  // - calculateTotal
  // - splitBill
  // - formatCurrency

  // TODO: Mostrar resumen bonito

  rl.close();
}

main().catch(console.error);
```

<details>
<summary>💡 Ver solución completa</summary>

```typescript
// src/app.ts
import * as readline from 'readline';
import {
  calculateTip,
  calculateTotal,
  splitBill,
  suggestTipPercentage,
  formatCurrency
} from 'tip-utils';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function main() {
  console.log('\n🧾 === CALCULADORA DE PROPINAS === 🧾\n');

  // Pedir monto
  const billInput = await question('💰 Ingrese el monto de la cuenta: $');
  const billAmount = parseFloat(billInput);

  if (isNaN(billAmount) || billAmount <= 0) {
    console.log('❌ Monto inválido');
    rl.close();
    return;
  }

  // Preguntar calidad del servicio
  console.log('\n¿Cómo fue el servicio?');
  console.log('  1. 😠 Malo');
  console.log('  2. 😐 Regular');
  console.log('  3. 🙂 Bueno');
  console.log('  4. 🤩 Excelente');
  
  const serviceInput = await question('\nOpción (1-4): ');
  
  const serviceMap: Record<string, 'bad' | 'ok' | 'good' | 'excellent'> = {
    '1': 'bad',
    '2': 'ok',
    '3': 'good',
    '4': 'excellent'
  };
  
  const serviceQuality = serviceMap[serviceInput];
  if (!serviceQuality) {
    console.log('❌ Opción inválida');
    rl.close();
    return;
  }

  // Obtener porcentaje sugerido
  const tipPercentage = suggestTipPercentage(serviceQuality);
  console.log(`\n💡 Propina sugerida: ${tipPercentage}%`);

  // Preguntar número de personas
  const peopleInput = await question('\n👥 ¿Entre cuántas personas dividir? ');
  const numberOfPeople = parseInt(peopleInput);

  if (isNaN(numberOfPeople) || numberOfPeople <= 0) {
    console.log('❌ Número inválido');
    rl.close();
    return;
  }

  // Calcular
  const tip = calculateTip(billAmount, tipPercentage);
  const total = calculateTotal(billAmount, tipPercentage);
  const perPerson = splitBill(total, numberOfPeople);

  // Mostrar resumen
  console.log('\n' + '═'.repeat(40));
  console.log('📋 RESUMEN DE LA CUENTA');
  console.log('═'.repeat(40));
  console.log(`   Subtotal:      ${formatCurrency(billAmount)}`);
  console.log(`   Propina (${tipPercentage}%): ${formatCurrency(tip)}`);
  console.log('─'.repeat(40));
  console.log(`   TOTAL:         ${formatCurrency(total)}`);
  console.log('─'.repeat(40));
  console.log(`   Por persona:   ${formatCurrency(perPerson)} (${numberOfPeople} personas)`);
  console.log('═'.repeat(40));
  console.log('\n¡Gracias por usar la calculadora! 🎉\n');

  rl.close();
}

main().catch(console.error);
```

</details>

### Paso 2.3: Agregar script de ejecución

En `package.json`:
```json
"scripts": {
  "start": "ts-node src/app.ts"
}
```

### Paso 2.4: Ejecutar
```bash
npm start
```

---

## Parte 3: Actualización del paquete (Simulación de versión nueva)

### 🔄 Escenario: Persona A agrega una nueva función

**Persona A** agrega esta función a `src/index.ts`:

```typescript
/**
 * Calcula propina rápida (redondea el total a un número "bonito")
 * @param billAmount - Monto de la cuenta  
 * @param tipPercentage - Porcentaje de propina
 * @returns Total redondeado al siguiente múltiplo de 5
 */
export function quickTip(billAmount: number, tipPercentage: number): number {
  const total = calculateTotal(billAmount, tipPercentage);
  return Math.ceil(total / 5) * 5; // Redondea al siguiente múltiplo de 5
}
```

Luego:
```bash
npm run build
git add .
git commit -m "feat: add quickTip function"
git push origin main
```

### 🔄 Persona B actualiza el paquete

```bash
npm update tip-utils
```

O para forzar reinstalación:
```bash
npm install github:USUARIO_PERSONA_A/tip-utils
```

Ahora Persona B puede usar `quickTip` en su app:

```typescript
import { quickTip } from 'tip-utils';

const roundedTotal = quickTip(47.83, 18);
console.log(`Total redondeado: ${formatCurrency(roundedTotal)}`); // $60.00
```

---

## Entregables

Al finalizar, cada pareja debe tener:

| Persona | Repositorio | Contenido |
|---------|-------------|-----------|
| A | `tip-utils` | Paquete con 6 funciones exportadas |
| B | `tip-calculator-app` | App que consume el paquete |

---

## Reto adicional: CLI con argumentos

Persona B convierte la app en un CLI que acepta argumentos:
```bash
npm start -- --bill=50 --service=good --people=3
```

Pueden usar el paquete `commander` para parsear argumentos.

---

## 💭 Reflexión final

Después de completar el ejercicio, discutan en pareja:

1. **¿Qué pasaría si Persona A introduce un bug en `calculateTip`?** ¿Cómo afectaría a Persona B?

2. **¿Por qué es importante el versionado semántico (semver)?** ¿Qué significa `^1.0.0` vs `1.0.0` exacto?

3. **¿Qué ventajas tiene publicar en npmjs.com vs GitHub?** ¿Cuándo usarían cada uno?

4. **¿Cómo manejarían un breaking change?** Por ejemplo, si `calculateTip` cambia sus parámetros.

---

## 📚 Referencias

- [Installing packages from GitHub](https://docs.npmjs.com/cli/v10/commands/npm-install#description)
- [Creating and publishing scoped packages](https://docs.npmjs.com/creating-and-publishing-scoped-public-packages)
- [Semantic Versioning](https://semver.org/)
