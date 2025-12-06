## POO y SOLID

### Teoría

#### Pregunta I

Marque las afirmaciones correctas sobre SOLID:

  * [ ] SRP: una razón de cambio por clase/módulo.
  * [ ] OCP: abierto a extensión y cerrado a modificación.
  * [ ] LSP: subtipos deben poder reemplazar al tipo base sin romper contratos.
  * [ ] ISP: preferir interfaces grandes para evitar muchas pequeñas.
  * [ ] DIP: detalles dependen de abstracciones, no al revés.

#### Pregunta II

**(Selección Múltiple)** Marque cuáles de las siguientes son ventajas del patrón Decorador:

* [ ] Los decoradores son componentes reutilizables. Puede crear una librería de clases de decorador y aplicarlas a diferentes objetos y clases según sea necesario, reduciendo la duplicación de código.
* [ ] Los decoradores usan el principio de favorecer la composición sobre herencia: a diferencia de la herencia tradicional, que puede conducir a una jerarquía de clases profunda e inflexible, el patrón decorador utiliza la composición. Puede componer objetos con diferentes decoradores para lograr la funcionalidad deseada, evitando los inconvenientes de la herencia, como el acoplamiento fuerte y las jerarquías rígidas.
* [ ] El orden en que se aplican los decoradores no afecta el comportamiento final del objeto. Gestionar el orden de los decoradores no representa un problema.
* [ ] Debido a que es fácil agregar decoradores a los objetos, existe el riesgo de usar en exceso el patrón Decorador, lo que hace que el código base sea innecesariamente complejo.

#### Pregunta III

Explique con un ejemplo claro y concreto, por qué el patrón de diseño Estrategia favorece el cumplimiento del Principio Abierto-Cerrado (OCP) de SOLID. También debe explicar por qué este patrón hace uso de la composición con delegación.

#### Pregunta IV

**(Verdadero o Falso)** Sobre Interfaces y Clases Abstractas:

* [ ] Una clase puede implementar múltiples interfaces pero solo heredar de una clase abstracta.
* [ ] Las interfaces pueden contener implementación de métodos (código) en TypeScript.
* [ ] Las clases abstractas pueden tener tanto métodos abstractos (sin código) como métodos concretos (con código).
* [ ] Se deben preferir las clases abstractas para definir "Contratos" puros de comportamiento.
* [ ] Las interfaces son ideales para definir capacidades comunes entre objetos no relacionados (ej: `Volador` para Pájaro y Avión).

#### Pregunta V

**Cohesión y SRP:**

Explique la relación entre el Principio de Responsabilidad Única (SRP) y la Cohesión.

*   ¿Qué significa que una clase tenga "Alta Cohesión"? ¿Es deseable?
*   ¿Qué indica una "Baja Cohesión" sobre el diseño de una clase?
*   ¿Cómo se relaciona esto con "tener una sola razón para cambiar"?


---

### Práctica

#### Ejercicio I

Estudie con detenimiento el siguiente código, identifique las deficiencias que posee, y proponga un mejor diseño utilizando los principios SOLID. Debe indicar cuáles principios está utilizando en su solución.

```ts
class Factura {
    public _codigo: string;
    public fechaEmision: Date;
    public importeFactura: number;
    public importeIVA: number;
    public importeDeduccion: number;
    public importeTotal: number;
    public porcentajeDeduccion: number;

    // Método que calcula el total de la factura
    public calcularTotal(): void {
        // Calculamos la deduccion
        this.importeDeduccion = (this.importeFactura * this.porcentajeDeduccion) / 100;
        // Calculamos el IVA
        this.importeIVA = this.importeFactura * 0.16;
        // Calculamos el total
        this.importeTotal = (this.importeFactura - this.importeDeduccion) + this.importeIVA;
    }
}
```

#### Ejercicio II

Dado el siguiente código:

```typescript
export class ReportExporter {

    public exportAndNotify(reportName: string, connString: string, email: string): boolean {
        
        try {
            // 1) Leer datos (SQL directo)
            const rows: any[] = new SqlClient(connString).query(`SELECT * FROM reports WHERE name='${reportName}'`);

            // 2) Formatear CSV (a mano)
            // Asumimos que 'rows' es un array de objetos
            const csv = rows.map(r => `${r.id},${r.title},${r.amount}`).join("\n");

            // 3) Guardar en disco
            const path = `C:\\exports\\${reportName}.csv`;
            fs.writeFileSync(path, csv);

            // 4) Enviar correo (SMTP directo)
            new SmtpClient("smtp.local").send(email, "Reporte listo", `Descárguelo en ${path}`);

            return true;
            
        } catch (error) {
            console.error("Error exportando reporte", error);
            return false;
        }
    }
}
```

  * Identifique violaciones a SRP / DIP
  * Proponga interfaces (p. ej. IDataSource, IFormater, etc) e indique su responsabilidad.
  * Esboce código TypeScript del método refactorizado (solo la firma y el flujo general).

#### Ejercicio III

Dado el siguiente enunciado:

Se requiere agregar funcionalidades opcionales y combinables a un flujo de salida de datos: compresión, cifrado y firma. La solución debe permitir apilar responsabilidades sin modificar la clase base del escritor y sin herencias múltiples.


*Elija solo uno entre: Strategy, Composite, Decorator.*

  * Seleccione el patrón correcto y justifique por qué los otros dos no aplican al objetivo (4–6 líneas).
  * Dibuje UML con una interfaz `IWriter`, una implementación base (`FileWriter`) y decoradores (`CompressionWriter`, `EncryptionWriter`, `SigningWriter`). **Es importante que especifique los métodos.**
  * Esboce pseudocódigo de cómo el cliente compone un pipeline o composición de objetos para usar su solución propuesta.

---

## Programación Asíncrona

### Teoría

#### Pregunta I

Marque las afirmaciones correctas sobre Promesas y async/await:

  * [ ] Una Promesa puede estar en tres estados: pending, fulfilled y rejected.
  * [ ] El método `.then()` siempre retorna una nueva Promesa.
  * [ ] Una función `async` siempre retorna directamente el valor, no una Promesa.
  * [ ] `await` fuera de una función `async` genera un error de sintaxis.
  * [ ] `Promise.all()` espera a que todas las promesas se cumplan o falla si una de ellas falla.

#### Pregunta II

**(Selección Múltiple)** Marque cuáles de las siguientes afirmaciones sobre combinadores de Promesas (`all`, `race`, `any`, `allSettled`) son correctas:

* [ ] `Promise.all()` ejecuta las promesas en paralelo y espera a que todas se resuelvan exitosamente.
* [ ] `Promise.race()` retorna la primera promesa que se resuelva o rechace (la más rápida).
* [ ] `Promise.any()` espera a la primera promesa que se cumpla exitosamente, ignorando los rechazos (a menos que todas fallen).
* [ ] `Promise.allSettled()` espera a que todas las promesas finalicen, sin importar si fueron exitosas o rechazadas.
* [ ] Si una promesa falla en `Promise.all()`, la promesa combinada falla inmediatamente con ese error.
* [ ] `Promise.race()` espera siempre a que termine al menos una promesa con éxito.

#### Pregunta III

Explique la diferencia entre código bloqueante y no bloqueante. Proporcione un ejemplo de cada uno y explique por qué la programación asíncrona mejora la experiencia de usuario en aplicaciones web.

#### Pregunta IV

Dado el siguiente código, indique el orden en el que se imprimirán los mensajes en consola y justifique por qué:

```typescript
console.log("1. Inicio");

setTimeout(() => {
  console.log("2. Timeout callback");
}, 0);

Promise.resolve().then(() => {
  console.log("3. Promise then");
});

console.log("4. Fin");
```

---

### Práctica

#### Ejercicio I

Implementa una función `fetchWithTimeout<T>` que reciba una URL y un tiempo límite en milisegundos. La función debe:

- Hacer una petición fetch a la URL
- Si la respuesta tarda más que el timeout, rechazar con un error "Timeout"
- Retornar los datos parseados como JSON si tiene éxito

**Firma de la función:**
```typescript
function fetchWithTimeout<T>(url: string, timeout: number): Promise<T>
```

**Pista:** Usa `Promise.race()` con una promesa que rechace después del timeout.

#### Ejercicio II

Tienes que consumir datos de tres APIs diferentes que retornan información sobre un producto:
- `/api/product/:id` - Información básica del producto
- `/api/product/:id/reviews` - Reseñas del producto
- `/api/product/:id/inventory` - Estado del inventario

Implementa dos funciones:

1. `getProductSequential(id: string)`: Obtiene los datos **secuencialmente** (uno tras otro)
2. `getProductParallel(id: string)`: Obtiene los datos **en paralelo** (todos al mismo tiempo)

Ambas funciones deben retornar un objeto con `{ product, reviews, inventory }`.

**Pregunta adicional:** ¿Cuál de las dos implementaciones es más eficiente y por qué?

#### Ejercicio III

Implementa una función `retry<T>` que intente ejecutar una función asíncrona hasta N veces antes de fallar definitivamente. Entre cada reintento debe esperar un tiempo que aumenta exponencialmente (1s, 2s, 4s, etc.).

**Firma:**
```typescript
async function retry<T>(
  fn: () => Promise<T>, 
  maxRetries: number
): Promise<T>
```

**Ejemplo de uso:**
```typescript
const data = await retry(() => fetch('/api/unstable').then(r => r.json()), 3);
```

---

## Programación Orientada a Aspectos (POA)

### Teoría

#### Pregunta I

Marque las afirmaciones correctas sobre Cross-Cutting Concerns:

  * [ ] Son funcionalidades que "atraviesan" múltiples partes de la aplicación.
  * [ ] Ejemplos comunes son: logging, seguridad, transacciones y cache.
  * [ ] Deben implementarse siempre mediante herencia múltiple.
  * [ ] El patrón Decorator permite aplicar Cross-Cutting Concerns sin modificar el código original.
  * [ ] La POA busca reducir la duplicación de código causada por estas preocupaciones.

#### Pregunta II

**(Selección Múltiple)** Marque cuáles de las siguientes afirmaciones sobre el patrón Decorator aplicado a AOP son correctas:

* [ ] El Decorator implementa la misma interfaz que el objeto que decora.
* [ ] Los decoradores se pueden apilar o componer en cualquier orden.
* [ ] El Decorator modifica directamente el código de la clase decorada.
* [ ] El consumidor del servicio decorado no necesita saber que hay decoradores.
* [ ] El Decorator siempre debe llamar al método del objeto decorado (delegación).

#### Pregunta III

Explique qué es Command-Query Separation (CQS) y por qué es importante para aplicar POA. En su respuesta incluya:
- La diferencia entre Commands y Queries
- Por qué se separan en interfaces distintas
- Qué aspectos se aplican típicamente a cada tipo

#### Pregunta IV

Dado el siguiente código con violaciones de principios SOLID, identifique al menos 3 violaciones y mencione qué principio se viola en cada caso:

```typescript
class OrderService {
  private db = new MySqlConnection("localhost:3306");
  private logger = new FileLogger("/var/log/orders.log");
  
  processOrder(order: Order): void {
    this.logger.log("Processing order " + order.id);
    this.db.query(`INSERT INTO orders VALUES (...)`);
    this.sendEmail(order.customerEmail, "Order confirmed");
    this.logger.log("Order processed " + order.id);
  }
  
  private sendEmail(to: string, message: string): void {
    const smtp = new SmtpClient("smtp.gmail.com");
    smtp.send(to, message);
  }
  
  getOrderById(id: string): Order {
    this.logger.log("Getting order " + id);
    return this.db.query(`SELECT * FROM orders WHERE id = ?`, [id]);
  }
}
```

#### Pregunta V

¿Cuáles son las principales ventajas de utilizar **Parameter Objects** en el diseño de software? Mencione al menos tres ventajas y explique brevemente cada una.

---

### Práctica

#### Ejercicio I

Refactoriza el siguiente código aplicando SOLID y el patrón Decorator para separar la lógica de logging como un Cross-Cutting Concern:

```typescript
class UserRepository {
  private db: Database;
  private logger: Logger;
  
  save(user: User): void {
    this.logger.log(`Saving user ${user.id}`);
    try {
      this.db.insert("users", user);
      this.logger.log(`User ${user.id} saved successfully`);
    } catch (error) {
      this.logger.log(`Error saving user ${user.id}: ${error}`);
      throw error;
    }
  }
  
  findById(id: string): User {
    this.logger.log(`Finding user ${id}`);
    const user = this.db.findOne("users", { id });
    this.logger.log(`User ${id} found: ${user !== null}`);
    return user;
  }
}
```

Tu solución debe incluir:
- Una interfaz `IUserRepository`
- Una implementación limpia `UserRepository` sin logging
- Un decorador `LoggingUserRepositoryDecorator`

#### Ejercicio II

Dado el siguiente servicio de pagos, aplica el patrón de interfaces genéricas (`ICommandService<TCommand>`) y crea decoradores para:
1. **Auditoría**: Registra quién ejecutó el comando y cuándo
2. **Validación**: Verifica que el monto sea mayor a 0

```typescript
class PaymentService {
  constructor(private gateway: PaymentGateway) {}
  
  processPayment(customerId: string, amount: number, cardNumber: string): void {
    if (amount <= 0) throw new Error("Invalid amount");
    console.log(`Processing payment of ${amount} for customer ${customerId}`);
    this.gateway.charge(amount, cardNumber);
  }
}
```

Tu solución debe incluir:
- Una clase `ProcessPayment` (Parameter Object)
- Una interfaz `ICommandService<TCommand>`
- Un handler `ProcessPaymentHandler`
- Decoradores `AuditingDecorator` y `ValidationDecorator`
- Un ejemplo de composición de decoradores

#### Ejercicio III

Diseña un sistema de notificaciones que cumpla con OCP (Open/Closed Principle). El sistema debe poder enviar notificaciones por múltiples canales (Email, SMS, Push) y permitir agregar nuevos canales **sin modificar código existente**.

Requisitos:
1. Define una interfaz `INotificationChannel`
2. Implementa al menos 3 canales distintos
3. Crea un `NotificationService` que pueda enviar a múltiples canales
4. Muestra cómo agregar un nuevo canal (ej: Slack) sin modificar las clases existentes

#### Ejercicio IV

Dado el siguiente servicio con múltiples métodos y firmas inconsistentes, refactoriza usando **Parameter Objects** para lograr una interfaz uniforme:

```typescript
interface IOrderService {
  createOrder(customerId: string, items: OrderItem[], shippingAddress: Address): Order;
  cancelOrder(orderId: string, reason: string, refundAmount?: number): void;
  updateOrderStatus(orderId: string, newStatus: OrderStatus, updatedBy: string): void;
  addItemToOrder(orderId: string, item: OrderItem, quantity: number): void;
}
```

Tu solución debe incluir:

1. **Parameter Objects** para cada operación: `CreateOrder`, `CancelOrder`, `UpdateOrderStatus`, `AddItemToOrder`
2. Una interfaz genérica `ICommandHandler<TCommand, TResult>` (donde `TResult` puede ser `void` o un tipo específico)
3. Handlers específicos para cada comando
4. Muestra cómo los Parameter Objects pueden incluir validación en su constructor

**Ejemplo de estructura esperada:**
```typescript
class CreateOrder {
  constructor(
    public readonly customerId: string,
    public readonly items: OrderItem[],
    public readonly shippingAddress: Address
  ) {
    // Validación aquí
  }
}

class CreateOrderHandler implements ICommandHandler<CreateOrder, Order> {
  execute(command: CreateOrder): Order {
    // Lógica de negocio
  }
}
```

**Pregunta adicional:** ¿Por qué esta estructura facilita la aplicación de decoradores genéricos?

