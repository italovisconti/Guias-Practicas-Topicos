# Ejercicio Práctico: Sistema de Pedidos

Vas a refactorizar un sistema de pedidos siguiendo el enfoque AOP.

### Situación Inicial

```typescript
//  Código problemático
class OrderService {
  constructor(
    private orderRepo: IOrderRepository,
    private emailService: IEmailService,
    private logger: ILogger
  ) {}
  
  createOrder(customerId: string, items: OrderItem[]): void {
    this.logger.log("Creating order"); // Cross-cutting
    
    const order = new Order(customerId, items);
    this.orderRepo.save(order);
    
    this.emailService.send(
      order.customerId,
      "Order Confirmation",
      `Your order ${order.id} has been created`
    ); // Cross-cutting
  }
  
  cancelOrder(orderId: string): void {
    this.logger.log("Cancelling order"); // Cross-cutting (REPETIDO)
    
    const order = this.orderRepo.getById(orderId);
    order.status = "CANCELLED";
    this.orderRepo.save(order);
    
    this.emailService.send(
      order.customerId,
      "Order Cancelled",
      `Your order ${orderId} has been cancelled`
    ); // Cross-cutting (REPETIDO)
  }
  
  // ... más métodos con los mismos patterns repetidos
}
```

### Parte 1: Definir Commands

Crea los **Parameter Objects** que representan las intenciones del negocio. Cada comando debe encapsular todos los datos necesarios para ejecutar una operación.

> **Pista**: Piensa en cada operación como un "mensaje" que le envías al sistema.

<details>
<summary>💡 Ver solución</summary>

```typescript
// Parameter Objects que representan intenciones
class CreateOrder {
  constructor(
    public customerId: string,
    public items: OrderItem[]
  ) {}
}

class CancelOrder {
  constructor(
    public orderId: string,
    public reason: string
  ) {}
}

class ShipOrder {
  constructor(
    public orderId: string,
    public trackingNumber: string
  ) {}
}
```

**Explicación**: Cada comando es un **objeto de datos** que encapsula todos los parámetros necesarios para ejecutar una operación. El nombre de la clase define la intención del negocio.

</details>

---

### Parte 2: Implementar Handlers

Implementa un **handler** para cada comando. Cada handler debe:
- Implementar `ICommandService<TCommand>`
- Contener **solo** la lógica de negocio (sin logging, sin emails)
- Recibir sus dependencias por constructor

<details>
<summary>💡 Ver solución</summary>

```typescript
// Una clase por comando
class CreateOrderHandler implements ICommandService<CreateOrder> {
  constructor(
    private orderRepo: IOrderRepository
  ) {}
  
  execute(command: CreateOrder): void {
    const order = new Order(command.customerId, command.items);
    this.orderRepo.save(order);
  }
}

class CancelOrderHandler implements ICommandService<CancelOrder> {
  constructor(
    private orderRepo: IOrderRepository
  ) {}
  
  execute(command: CancelOrder): void {
    const order = this.orderRepo.getById(command.orderId);
    
    if (order.status === "SHIPPED") {
      throw new Error("Cannot cancel shipped order");
    }
    
    order.status = "CANCELLED";
    order.cancellationReason = command.reason;
    this.orderRepo.save(order);
  }
}

class ShipOrderHandler implements ICommandService<ShipOrder> {
  constructor(
    private orderRepo: IOrderRepository
  ) {}
  
  execute(command: ShipOrder): void {
    const order = this.orderRepo.getById(command.orderId);
    
    if (order.status !== "CONFIRMED") {
      throw new Error("Only confirmed orders can be shipped");
    }
    
    order.status = "SHIPPED";
    order.trackingNumber = command.trackingNumber;
    this.orderRepo.save(order);
  }
}
```

**Explicación**: Cada handler tiene **una única responsabilidad** (SRP). La lógica de negocio está aislada, sin mezclarse con logging, emails, o transacciones.

</details>

---

### Parte 3: Crear Decorators

Implementa dos decorators:
1. `LoggingCommandDecorator` - registra inicio, fin y errores de cada comando
2. `EmailNotificationDecorator` - envía emails después de ejecutar ciertos comandos

> **Recuerda**: El decorator debe implementar la misma interfaz que decora.

<details>
<summary>💡 Ver solución</summary>

```typescript
// Decorator de logging
class LoggingCommandDecorator<TCommand> 
  implements ICommandService<TCommand> {
  
  constructor(
    private decoratee: ICommandService<TCommand>,
    private logger: ILogger
  ) {}
  
  execute(command: TCommand): void {
    const commandName = command.constructor.name;
    const startTime = Date.now();
    
    this.logger.info(`Executing ${commandName}`, command);
    
    try {
      this.decoratee.execute(command);
      const duration = Date.now() - startTime;
      this.logger.info(`${commandName} completed in ${duration}ms`);
    } catch (error) {
      this.logger.error(`${commandName} failed`, error);
      throw error;
    }
  }
}

// Decorator de notificación por email
class EmailNotificationDecorator<TCommand> 
  implements ICommandService<TCommand> {
  
  constructor(
    private decoratee: ICommandService<TCommand>,
    private emailService: IEmailService,
    private orderRepo: IOrderRepository
  ) {}
  
  execute(command: TCommand): void {
    // Ejecuta el comando principal
    this.decoratee.execute(command);
    
    // Después del éxito, envía email según el tipo de comando
    if (command instanceof CreateOrder) {
      this.emailService.send(
        command.customerId,
        "Order Confirmation",
        `Your order has been created successfully`
      );
    } else if (command instanceof CancelOrder) {
      const order = this.orderRepo.getById(command.orderId);
      this.emailService.send(
        order.customerId,
        "Order Cancelled",
        `Your order has been cancelled. Reason: ${command.reason}`
      );
    } else if (command instanceof ShipOrder) {
      const order = this.orderRepo.getById(command.orderId);
      this.emailService.send(
        order.customerId,
        "Order Shipped",
        `Your order has been shipped. Tracking: ${command.trackingNumber}`
      );
    }
  }
}
```

**Explicación**: Los decorators **envuelven** el comportamiento principal. Cada uno tiene su propia responsabilidad (SRP) y puede ser agregado/removido sin modificar el código existente (OCP).

</details>

---

### Parte 4: Componer en el Composition Root

Crea una función `composeOrderController()` que:
1. Instancie el handler base
2. Lo envuelva con los decorators en el orden correcto
3. Inyecte el resultado en el controller

> **Orden sugerido** (de afuera hacia adentro): Security → Logging → Transaction → Handler

<details>
<summary>💡 Ver solución</summary>

```typescript
class OrderController {
  constructor(
    private createOrderService: ICommandService<CreateOrder>,
    private cancelOrderService: ICommandService<CancelOrder>,
    private shipOrderService: ICommandService<ShipOrder>
  ) {}
  
  async createOrder(req: Request, res: Response): Promise<void> {
    const command = new CreateOrder(
      req.body.customerId,
      req.body.items
    );
    
    this.createOrderService.execute(command);
    res.json({ success: true });
  }
  
  async cancelOrder(req: Request, res: Response): Promise<void> {
    const command = new CancelOrder(
      req.params.orderId,
      req.body.reason
    );
    
    this.cancelOrderService.execute(command);
    res.json({ success: true });
  }
  
  async shipOrder(req: Request, res: Response): Promise<void> {
    const command = new ShipOrder(
      req.params.orderId,
      req.body.trackingNumber
    );
    
    this.shipOrderService.execute(command);
    res.json({ success: true });
  }
}

// Composition Root
function composeOrderController(): OrderController {
  const orderRepo = new SqlOrderRepository(connectionString);
  const logger = new ConsoleLogger();
  const emailService = new SmtpEmailService();
  const transactionManager = new DbTransactionManager();
  
  // Función helper para decorar cualquier handler
  function decorate<T>(handler: ICommandService<T>): ICommandService<T> {
    // Orden: Logging → Email → Transaction → Handler
    const withTransaction = new TransactionCommandDecorator(
      handler,
      transactionManager
    );
    
    const withEmail = new EmailNotificationDecorator(
      withTransaction,
      emailService,
      orderRepo
    );
    
    const withLogging = new LoggingCommandDecorator(
      withEmail,
      logger
    );
    
    return withLogging;
  }
  
  return new OrderController(
    decorate(new CreateOrderHandler(orderRepo)),
    decorate(new CancelOrderHandler(orderRepo)),
    decorate(new ShipOrderHandler(orderRepo))
  );
}
```

**Explicación**: El controller no sabe sobre transacciones, logging, o emails. Solo conoce la interfaz `ICommandService<T>`. Toda la composición de aspectos sucede en el **Composition Root**, manteniendo el código de negocio limpio.

</details>

---

## 8. Ventajas del Enfoque AOP por Diseño

### Sin Herramientas Especiales
- No dependes de bibliotecas de AOP
- No necesitas proxies dinámicos
- El código compila y es verificable en tiempo de compilación

### Mantenibilidad
- **Agregar nueva funcionalidad**: Solo creas un comando y su handler
- **Agregar nuevo aspecto**: Solo creas un nuevo Decorator
- **Cambiar un aspecto**: Solo modificas un Decorator

### Testabilidad
```typescript
describe('CancelOrderHandler', () => {
  it('should cancel confirmed order', () => {
    // Test sin aspectos
    const mockRepo = new MockOrderRepository();
    const handler = new CancelOrderHandler(mockRepo);
    
    const command = new CancelOrder('order-123', 'Customer request');
    handler.execute(command);
    
    expect(mockRepo.lastSavedOrder.status).toBe('CANCELLED');
  });
});

describe('LoggingDecorator', () => {
  it('should log command execution', () => {
    // Test del aspecto aislado
    const mockLogger = new MockLogger();
    const mockHandler = new MockCommandService();
    const decorator = new LoggingCommandDecorator(mockHandler, mockLogger);
    
    decorator.execute(new CancelOrder('order-123', 'test'));
    
    expect(mockLogger.logs).toContain('Executing CancelOrder');
  });
});
```

---

## 9. Conclusión

> **AOP no requiere herramientas especiales. Se logra con buen diseño orientado a objetos.**

### Principios Clave

1. **Aplicar SOLID rigurosamente**
   - SRP: Una responsabilidad por clase
   - OCP: Extender sin modificar
   - LSP: Decorators intercambiables
   - ISP: Interfaces pequeñas y específicas
   - DIP: Depender de abstracciones

2. **Separar comandos de queries** (CQS)
   - Commands modifican estado, no retornan valor
   - Queries solo leen, no modifican estado

3. **Usar Parameter Objects**
   - Encapsulan intención de negocio
   - Permiten interfaces unificadas (`ICommandService<T>`)

4. **Aplicar Decorator pattern**
   - Un decorator por aspecto
   - Composición en el Composition Root

### El Flujo Completo

```
1. Identificar violaciones SOLID en el código
              ↓
2. Separar operaciones (CQS: Commands vs Queries)
              ↓
3. Extraer Parameter Objects
              ↓
4. Unificar con interfaz genérica (ICommandService<T>)
              ↓
5. Crear Decorators para Cross-Cutting Concerns
              ↓
6. Componer en el Composition Root
```

---

## Preguntas de Reflexión

1. ¿Por qué es importante que los Decorators cumplan con LSP?
2. Si tienes 10 aspectos y 20 comandos, ¿cuántos Decorators necesitas con este enfoque vs. el enfoque tradicional?
3. ¿Qué aspectos serían candidatos para aplicar **solo a queries** y cuáles **solo a commands**?
4. ¿Cómo afecta el orden de composición de Decorators al comportamiento final?
5. ¿En qué casos sería justificable usar herramientas de AOP en lugar de diseño SOLID?