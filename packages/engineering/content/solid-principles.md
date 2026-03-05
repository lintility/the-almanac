---
title: SOLID Principles
chapter: engineering
type: pattern
difficulty: intermediate
prerequisites:
  - "[[Object-Oriented Programming]]"
  - "[[Engineering Design Process]]"
related:
  - "[[Design Patterns]]"
  - "[[Trade-offs and Constraints]]"
  - "[[Code Quality]]"
  - "[[Refactoring]]"
tags:
  - solid
  - design-principles
  - oop
  - software-architecture
  - code-quality
status: draft
created: "2026-03-05"
updated: "2026-03-05"
author: Content Editor
---

# SOLID Principles

## Overview

SOLID is an acronym for five design principles that make software more understandable, flexible, and maintainable. Introduced by Robert C. Martin (Uncle Bob), these principles guide how you structure classes and manage dependencies in object-oriented programming.

Think of SOLID as architectural guidelines for code. Just as building codes prevent houses from collapsing, SOLID principles prevent software from becoming a tangled mess that's impossible to change without breaking everything.

## Core Concept

Each SOLID principle addresses a specific way that code can become rigid, fragile, or hard to understand. Together, they create a framework for making design decisions:

- **S** - Single Responsibility Principle: One class, one reason to change
- **O** - Open/Closed Principle: Open for extension, closed for modification
- **L** - Liskov Substitution Principle: Subtypes must be substitutable for their base types
- **I** - Interface Segregation Principle: Clients shouldn't depend on methods they don't use
- **D** - Dependency Inversion Principle: Depend on abstractions, not concretions

These aren't rules you must follow 100% of the time. They're tools for recognizing design problems and guiding solutions.

## Single Responsibility Principle (SRP)

**Definition:** A class should have one, and only one, reason to change.

**What it means:** Each class should do one thing and do it well. If you need to change class A because of a change in how data is displayed AND because of a change in how data is stored, class A has too many responsibilities.

### Example: User Management

**Violates SRP:**

```python
class User:
    def __init__(self, name, email):
        self.name = name
        self.email = email

    def save_to_database(self):
        # Database logic here
        connection = database.connect()
        connection.execute(f"INSERT INTO users VALUES ('{self.name}', '{self.email}')")

    def send_welcome_email(self):
        # Email logic here
        email_client = EmailClient()
        email_client.send(self.email, "Welcome!", f"Hello {self.name}!")

    def generate_report(self):
        # Report generation logic
        return f"User Report:\nName: {self.name}\nEmail: {self.email}"
```

**Problems:**
- Changes to database structure require modifying User class
- Changes to email system require modifying User class
- Changes to report format require modifying User class
- Hard to test (needs mock database, email client, etc.)

**Follows SRP:**

```python
class User:
    def __init__(self, name, email):
        self.name = name
        self.email = email

class UserRepository:
    def save(self, user):
        connection = database.connect()
        connection.execute(f"INSERT INTO users VALUES ('{user.name}', '{user.email}')")

class EmailService:
    def send_welcome_email(self, user):
        email_client = EmailClient()
        email_client.send(user.email, "Welcome!", f"Hello {user.name}!")

class UserReportGenerator:
    def generate(self, user):
        return f"User Report:\nName: {user.name}\nEmail: {user.email}"
```

**Benefits:**
- Each class has one reason to change
- Easy to test each component independently
- Can swap implementations (different database, email provider, etc.)
- Easier to understand what each class does

### When to Apply SRP

**Use SRP when:**
- A class is growing large and doing many things
- Changes in one area of the system force changes to unrelated classes
- Testing requires extensive mocking
- You struggle to name a class concisely

**Don't overdo it when:**
- Creating tiny classes for every minor responsibility creates unnecessary complexity
- The responsibilities are so tightly coupled they'll always change together
- You're prematurely optimizing simple code

## Open/Closed Principle (OCP)

**Definition:** Software entities should be open for extension but closed for modification.

**What it means:** You should be able to add new functionality without changing existing code. Use abstractions and polymorphism to allow behavior changes without touching working code.

### Example: Payment Processing

**Violates OCP:**

```python
class PaymentProcessor:
    def process_payment(self, amount, payment_type):
        if payment_type == "credit_card":
            # Credit card processing logic
            print(f"Processing ${amount} via credit card")
        elif payment_type == "paypal":
            # PayPal processing logic
            print(f"Processing ${amount} via PayPal")
        elif payment_type == "bitcoin":
            # Bitcoin processing logic
            print(f"Processing ${amount} via Bitcoin")
        # Every new payment method requires modifying this class
```

**Problem:** Adding a new payment method requires modifying and retesting PaymentProcessor.

**Follows OCP:**

```python
from abc import ABC, abstractmethod

class PaymentMethod(ABC):
    @abstractmethod
    def process(self, amount):
        pass

class CreditCardPayment(PaymentMethod):
    def process(self, amount):
        print(f"Processing ${amount} via credit card")

class PayPalPayment(PaymentMethod):
    def process(self, amount):
        print(f"Processing ${amount} via PayPal")

class BitcoinPayment(PaymentMethod):
    def process(self, amount):
        print(f"Processing ${amount} via Bitcoin")

class PaymentProcessor:
    def process_payment(self, amount, payment_method: PaymentMethod):
        # No modification needed for new payment methods
        payment_method.process(amount)

# Usage
processor = PaymentProcessor()
processor.process_payment(100, CreditCardPayment())
processor.process_payment(50, PayPalPayment())

# Adding new method doesn't change PaymentProcessor
class ApplePayPayment(PaymentMethod):
    def process(self, amount):
        print(f"Processing ${amount} via Apple Pay")

processor.process_payment(75, ApplePayPayment())  # Works without changing existing code
```

**Benefits:**
- Add new payment methods without touching tested code
- Each payment method is isolated and testable
- Reduces risk of breaking existing functionality

### When to Apply OCP

**Use OCP when:**
- You anticipate needing to add new behaviors/types
- Modification of core classes risks breaking existing functionality
- You want to allow third-party extensions

**Don't overdo it when:**
- The abstraction is more complex than the problem
- The variations are unlikely to grow
- Premature abstraction makes code harder to understand

## Liskov Substitution Principle (LSP)

**Definition:** Objects of a superclass should be replaceable with objects of a subclass without breaking the application.

**What it means:** If you have code that works with a base class, it should work with any subclass without needing special handling. Subclasses must honor the contract established by the base class.

### Example: Shape Areas

**Violates LSP:**

```python
class Rectangle:
    def __init__(self, width, height):
        self.width = width
        self.height = height

    def set_width(self, width):
        self.width = width

    def set_height(self, height):
        self.height = height

    def area(self):
        return self.width * self.height

class Square(Rectangle):
    def set_width(self, width):
        # Square maintains equal sides
        self.width = width
        self.height = width

    def set_height(self, height):
        # Square maintains equal sides
        self.width = height
        self.height = height

# This breaks LSP
def test_rectangle(rectangle):
    rectangle.set_width(5)
    rectangle.set_height(4)
    assert rectangle.area() == 20  # Fails for Square!

rect = Rectangle(0, 0)
test_rectangle(rect)  # Works: 5 * 4 = 20

square = Square(0, 0)
test_rectangle(square)  # Fails: 4 * 4 = 16, not 20
```

**Problem:** Square can't substitute Rectangle because it changes the behavior of `set_width` and `set_height`.

**Follows LSP:**

```python
from abc import ABC, abstractmethod

class Shape(ABC):
    @abstractmethod
    def area(self):
        pass

class Rectangle(Shape):
    def __init__(self, width, height):
        self.width = width
        self.height = height

    def area(self):
        return self.width * self.height

class Square(Shape):
    def __init__(self, side):
        self.side = side

    def area(self):
        return self.side * self.side

# Both honor Shape contract, no substitution issues
def print_area(shape: Shape):
    print(f"Area: {shape.area()}")

print_area(Rectangle(5, 4))  # Area: 20
print_area(Square(5))         # Area: 25
```

**Benefits:**
- Predictable behavior across inheritance hierarchies
- Code that depends on base class works reliably with all subclasses
- Prevents subtle bugs from broken contracts

### When to Apply LSP

**Use LSP when:**
- Designing inheritance hierarchies
- Subclass behavior differs from parent in surprising ways
- You find yourself using `isinstance()` checks to handle subclasses differently

**Common LSP violations:**
- Subclass throws exceptions base class doesn't throw
- Subclass has stricter preconditions than base class
- Subclass weakens postconditions (returns less specific results)
- Subclass changes expected behavior (like Square changing Rectangle's side-setting)

## Interface Segregation Principle (ISP)

**Definition:** No client should be forced to depend on methods it doesn't use.

**What it means:** Keep interfaces small and focused. Don't create fat interfaces that bundle unrelated methods. Clients should only know about methods they actually need.

### Example: Worker Interfaces

**Violates ISP:**

```python
from abc import ABC, abstractmethod

class Worker(ABC):
    @abstractmethod
    def work(self):
        pass

    @abstractmethod
    def eat(self):
        pass

    @abstractmethod
    def sleep(self):
        pass

class HumanWorker(Worker):
    def work(self):
        print("Human working")

    def eat(self):
        print("Human eating")

    def sleep(self):
        print("Human sleeping")

class RobotWorker(Worker):
    def work(self):
        print("Robot working")

    def eat(self):
        # Robots don't eat!
        pass  # Empty implementation, violates ISP

    def sleep(self):
        # Robots don't sleep!
        pass  # Empty implementation, violates ISP
```

**Problem:** RobotWorker is forced to implement methods it doesn't need, creating a meaningless contract.

**Follows ISP:**

```python
from abc import ABC, abstractmethod

class Workable(ABC):
    @abstractmethod
    def work(self):
        pass

class Eatable(ABC):
    @abstractmethod
    def eat(self):
        pass

class Sleepable(ABC):
    @abstractmethod
    def sleep(self):
        pass

class HumanWorker(Workable, Eatable, Sleepable):
    def work(self):
        print("Human working")

    def eat(self):
        print("Human eating")

    def sleep(self):
        print("Human sleeping")

class RobotWorker(Workable):
    def work(self):
        print("Robot working")

    # No need to implement eat() or sleep()

# Usage
def manage_work(worker: Workable):
    worker.work()

def manage_break(worker: Eatable):
    worker.eat()

manage_work(HumanWorker())  # Works
manage_work(RobotWorker())  # Works
manage_break(HumanWorker())  # Works
# manage_break(RobotWorker())  # Type error, as expected
```

**Benefits:**
- Classes only depend on interfaces they actually use
- Changes to one interface don't affect unrelated clients
- Clearer contracts and responsibilities

### When to Apply ISP

**Use ISP when:**
- Interfaces have methods unrelated to some implementations
- You find empty or stub implementations
- Changes to one method force changes to unrelated clients

**Don't overdo it when:**
- Creating an interface for every method adds unnecessary complexity
- Methods are genuinely related and will always be used together

## Dependency Inversion Principle (DIP)

**Definition:** High-level modules should not depend on low-level modules. Both should depend on abstractions. Abstractions should not depend on details; details should depend on abstractions.

**What it means:** Your business logic shouldn't directly depend on implementation details like databases, APIs, or frameworks. Instead, both should depend on interfaces. This makes your code flexible and testable.

### Example: Order Processing

**Violates DIP:**

```python
class MySQLDatabase:
    def save_order(self, order_data):
        print(f"Saving order to MySQL: {order_data}")

class EmailService:
    def send_confirmation(self, email, message):
        print(f"Sending email to {email}: {message}")

class OrderProcessor:
    def __init__(self):
        # High-level OrderProcessor depends on low-level concrete classes
        self.database = MySQLDatabase()
        self.email_service = EmailService()

    def process_order(self, order_data, customer_email):
        self.database.save_order(order_data)
        self.email_service.send_confirmation(customer_email, "Order confirmed!")
```

**Problems:**
- Can't test OrderProcessor without MySQL and email service
- Can't switch to PostgreSQL or different email provider without changing OrderProcessor
- High-level business logic tied to low-level implementation details

**Follows DIP:**

```python
from abc import ABC, abstractmethod

# Abstractions
class OrderRepository(ABC):
    @abstractmethod
    def save(self, order_data):
        pass

class NotificationService(ABC):
    @abstractmethod
    def send(self, recipient, message):
        pass

# Low-level implementations
class MySQLOrderRepository(OrderRepository):
    def save(self, order_data):
        print(f"Saving order to MySQL: {order_data}")

class PostgreSQLOrderRepository(OrderRepository):
    def save(self, order_data):
        print(f"Saving order to PostgreSQL: {order_data}")

class EmailNotification(NotificationService):
    def send(self, recipient, message):
        print(f"Sending email to {recipient}: {message}")

class SMSNotification(NotificationService):
    def send(self, recipient, message):
        print(f"Sending SMS to {recipient}: {message}")

# High-level business logic
class OrderProcessor:
    def __init__(self, repository: OrderRepository, notification: NotificationService):
        # Depends on abstractions, not concrete implementations
        self.repository = repository
        self.notification = notification

    def process_order(self, order_data, customer_contact):
        self.repository.save(order_data)
        self.notification.send(customer_contact, "Order confirmed!")

# Usage - inject dependencies
processor_mysql_email = OrderProcessor(
    MySQLOrderRepository(),
    EmailNotification()
)

processor_postgres_sms = OrderProcessor(
    PostgreSQLOrderRepository(),
    SMSNotification()
)

# Easy to test with mocks
class MockRepository(OrderRepository):
    def save(self, order_data):
        self.saved_data = order_data

class MockNotification(NotificationService):
    def send(self, recipient, message):
        self.last_message = message

test_processor = OrderProcessor(MockRepository(), MockNotification())
```

**Benefits:**
- Business logic independent of implementation details
- Easy to swap implementations without changing core code
- Easy to test with mock objects
- Flexible and maintainable

### When to Apply DIP

**Use DIP when:**
- Business logic depends on external systems (database, APIs, file system)
- You need to unit test without external dependencies
- You want to swap implementations (different database, message queue, etc.)

**Don't overdo it when:**
- Abstraction adds complexity without flexibility benefit
- Implementation is unlikely to change
- You're creating interfaces for every class out of habit

## How SOLID Principles Work Together

SOLID principles reinforce each other:

- **SRP** keeps classes focused, making them easier to extend (**OCP**)
- **OCP** uses abstractions, which helps with **DIP**
- **LSP** ensures abstractions work correctly with polymorphism
- **ISP** keeps interfaces focused, supporting **SRP** at the interface level
- **DIP** uses abstractions, which are easier to substitute when **LSP** is followed

**Example combining principles:**

```python
# SRP: Each class has one responsibility
# OCP: Can add new payment methods without modifying existing code
# LSP: All payment methods can substitute PaymentMethod
# ISP: PaymentMethod interface is focused (just process)
# DIP: PaymentService depends on PaymentMethod abstraction

from abc import ABC, abstractmethod

# DIP: Abstraction
class PaymentMethod(ABC):
    @abstractmethod
    def process(self, amount):
        pass

# OCP: Can extend with new payment methods
class CreditCard(PaymentMethod):
    def process(self, amount):
        return f"Charged ${amount} to credit card"

class PayPal(PaymentMethod):
    def process(self, amount):
        return f"Charged ${amount} to PayPal"

# SRP: PaymentService only handles payment processing
class PaymentService:
    def __init__(self, payment_method: PaymentMethod):
        self.payment_method = payment_method

    def execute_payment(self, amount):
        # DIP: Depends on abstraction, not concrete class
        # LSP: Works with any PaymentMethod subclass
        return self.payment_method.process(amount)

# Usage
service = PaymentService(CreditCard())
print(service.execute_payment(100))

service = PaymentService(PayPal())
print(service.execute_payment(50))
```

## Common Pitfalls

### Over-Engineering

**Mistake:** Applying all SOLID principles everywhere, creating layers of abstraction for simple problems.

**Impact:** Code becomes harder to understand than necessary.

**Fix:** Apply principles when they solve actual problems, not preemptively. Start simple, refactor when complexity grows.

### Misunderstanding LSP

**Mistake:** Thinking inheritance = substitutability. Creating inheritance hierarchies based on "is-a" without considering behavioral compatibility.

**Impact:** Subtle bugs when subclasses violate parent contracts.

**Fix:** Favor composition over inheritance. Use inheritance only when subclass truly honors parent behavior.

### Interface Explosion (ISP Gone Wrong)

**Mistake:** Creating an interface for every method, fragmenting related functionality.

**Impact:** Too many tiny interfaces, hard to understand system structure.

**Fix:** Group related methods. Only split interfaces when clients genuinely need different subsets.

### Premature Abstraction (OCP/DIP Misapplied)

**Mistake:** Creating abstractions for future flexibility you don't need yet.

**Impact:** Complexity without benefit. YAGNI violation ("You Aren't Gonna Need It").

**Fix:** Follow the Rule of Three: Wait until you need something in three places before abstracting.

### Ignoring Performance

**Mistake:** Adding abstraction layers without considering performance implications.

**Impact:** Excessive indirection can slow critical paths.

**Fix:** Profile first. Optimize hot paths. Apply SOLID where maintainability matters most.

## When to Use SOLID Principles

**Apply SOLID when:**
- Building systems expected to evolve over time
- Working on shared codebases with multiple developers
- Code becomes hard to change without breaking things
- Testing requires extensive mocking and setup

**Don't obsess over SOLID when:**
- Writing scripts or prototypes
- Problem domain is simple and well-understood
- Code is unlikely to change (rare, but happens)
- Team is small and communication is easy

**SOLID is a tool, not a religion.** The goal is maintainable code, not perfect adherence to principles.

## See Also

- [[Design Patterns]]
- [[Object-Oriented Programming]]
- [[Refactoring]]
- [[Code Quality]]
- [[Trade-offs and Constraints]]
- [[Test-Driven Development]]
- [[Dependency Injection]]

## References

- Agile Software Development, Principles, Patterns, and Practices (Robert C. Martin)
- Clean Architecture (Robert C. Martin)
- [SOLID Principles on Uncle Bob's Blog](http://blog.cleancoder.com/)
- Design Patterns: Elements of Reusable Object-Oriented Software (Gang of Four)
- Refactoring: Improving the Design of Existing Code (Martin Fowler)
- [The Principles of OOD (Object Mentor)](http://www.butunclebob.com/ArticleS.UncleBob.PrinciplesOfOod)
