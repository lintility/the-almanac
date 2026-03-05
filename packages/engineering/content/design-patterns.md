---
title: Design Patterns
chapter: engineering
type: pattern
difficulty: intermediate
prerequisites:
  - "[[Object-Oriented Programming]]"
  - "[[SOLID Principles]]"
related:
  - "[[Software Architecture]]"
  - "[[Refactoring]]"
  - "[[Code Quality]]"
tags:
  - design-patterns
  - software-architecture
  - oop
  - gang-of-four
  - code-reuse
status: draft
created: "2026-03-05"
updated: "2026-03-05"
author: Content Editor
---

# Design Patterns

## Overview

Design patterns are proven solutions to recurring problems in software design. They're templates for how to structure code to solve common challenges—not specific code you copy and paste, but general approaches you adapt to your situation.

Think of design patterns as architectural blueprints. When building a house, you don't reinvent how to frame a doorway every time—you follow established patterns that work. Similarly, design patterns capture decades of collective experience about what works well in software.

The most influential catalog of patterns comes from the "Gang of Four" book (Gamma, Helm, Johnson, Vlissides), which identified 23 fundamental patterns organized into three categories: Creational (how objects are created), Structural (how objects are composed), and Behavioral (how objects interact).

## Core Concept

Design patterns address specific design problems and propose solutions with known trade-offs. Each pattern has:

- **Intent**: What problem does it solve?
- **Structure**: How are the components organized?
- **Participants**: What classes or objects are involved?
- **Consequences**: What are the benefits and trade-offs?

Patterns aren't algorithms (step-by-step procedures) or data structures (ways to organize data). They're higher-level strategies for organizing code to be more flexible, maintainable, and understandable.

## Creational Patterns

Creational patterns control how objects are created, making systems independent of how objects are composed and represented.

### Singleton

**Intent:** Ensure a class has only one instance and provide a global access point to it.

**When to use:** Configuration managers, database connections, logging services—cases where exactly one instance must coordinate actions across the system.

**Example: Application Configuration**

**Problem without Singleton:**

```python
class AppConfig:
    def __init__(self):
        # Load configuration from file
        self.settings = self.load_settings()

    def load_settings(self):
        # Expensive operation: reading from disk
        return {"api_key": "secret123", "debug": True}

# Different parts of the app create multiple instances
config1 = AppConfig()  # Loads settings from disk
config2 = AppConfig()  # Loads settings from disk again
config3 = AppConfig()  # Loads settings from disk again

# Each instance loads separately, wasting resources
```

**Solution with Singleton:**

```python
class AppConfig:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance.settings = cls._instance.load_settings()
        return cls._instance

    def load_settings(self):
        # Expensive operation: reading from disk
        print("Loading settings from disk...")
        return {"api_key": "secret123", "debug": True}

# All references point to the same instance
config1 = AppConfig()  # Loads settings from disk
config2 = AppConfig()  # Returns existing instance
config3 = AppConfig()  # Returns existing instance

assert config1 is config2 is config3  # All the same object
```

**Thread-safe Singleton (for concurrent applications):**

```python
import threading

class AppConfig:
    _instance = None
    _lock = threading.Lock()

    def __new__(cls):
        if cls._instance is None:
            with cls._lock:
                # Double-check pattern: another thread might have created instance
                if cls._instance is None:
                    cls._instance = super().__new__(cls)
                    cls._instance.settings = cls._instance.load_settings()
        return cls._instance

    def load_settings(self):
        print("Loading settings from disk...")
        return {"api_key": "secret123", "debug": True}
```

**When NOT to use Singleton:**
- Makes testing harder (global state difficult to mock)
- Can hide dependencies (classes depend on global state instead of explicit parameters)
- Often overused when simple dependency injection would work better
- Consider alternatives: dependency injection, module-level variables, or accepting that multiple instances are fine

### Factory Method

**Intent:** Define an interface for creating objects, but let subclasses decide which class to instantiate.

**When to use:** When you don't know exactly which class you need to instantiate until runtime, or when you want to delegate instantiation to subclasses.

**Example: Document Creation**

**Problem without Factory Method:**

```python
class Application:
    def create_document(self, doc_type):
        if doc_type == "pdf":
            return PDFDocument()
        elif doc_type == "word":
            return WordDocument()
        elif doc_type == "text":
            return TextDocument()
        # Adding new document types requires modifying this method
```

**Solution with Factory Method:**

```python
from abc import ABC, abstractmethod

# Product interface
class Document(ABC):
    @abstractmethod
    def open(self):
        pass

    @abstractmethod
    def save(self, content):
        pass

# Concrete products
class PDFDocument(Document):
    def open(self):
        return "Opening PDF document"

    def save(self, content):
        return f"Saving to PDF: {content}"

class WordDocument(Document):
    def open(self):
        return "Opening Word document"

    def save(self, content):
        return f"Saving to Word: {content}"

class TextDocument(Document):
    def open(self):
        return "Opening text document"

    def save(self, content):
        return f"Saving to text file: {content}"

# Creator abstract class
class Application(ABC):
    @abstractmethod
    def create_document(self) -> Document:
        """Factory method - subclasses override this"""
        pass

    def new_document(self):
        # Uses factory method, doesn't need to know concrete class
        doc = self.create_document()
        return doc.open()

# Concrete creators
class PDFApplication(Application):
    def create_document(self) -> Document:
        return PDFDocument()

class WordApplication(Application):
    def create_document(self) -> Document:
        return WordDocument()

class TextApplication(Application):
    def create_document(self) -> Document:
        return TextDocument()

# Usage
pdf_app = PDFApplication()
print(pdf_app.new_document())  # Opening PDF document

word_app = WordApplication()
print(word_app.new_document())  # Opening Word document

# Adding new document type doesn't require changing existing code
class MarkdownDocument(Document):
    def open(self):
        return "Opening Markdown document"

    def save(self, content):
        return f"Saving to Markdown: {content}"

class MarkdownApplication(Application):
    def create_document(self) -> Document:
        return MarkdownDocument()
```

**Benefits:**
- Follows Open/Closed Principle: open for extension, closed for modification
- Eliminates coupling to specific classes
- Easy to add new document types

### Builder

**Intent:** Separate the construction of a complex object from its representation, allowing the same construction process to create different representations.

**When to use:** When an object has many optional parameters, or when object creation requires multiple steps that might vary.

**Example: HTTP Request Builder**

**Problem without Builder:**

```python
class HttpRequest:
    def __init__(self, url, method="GET", headers=None, body=None,
                 timeout=30, auth=None, params=None, cookies=None):
        self.url = url
        self.method = method
        self.headers = headers or {}
        self.body = body
        self.timeout = timeout
        self.auth = auth
        self.params = params or {}
        self.cookies = cookies or {}

# Hard to read, easy to make mistakes
request = HttpRequest(
    "https://api.example.com/users",
    "POST",
    {"Content-Type": "application/json"},
    '{"name": "Alice"}',
    60,
    ("username", "password"),
    {"page": 1},
    {"session": "abc123"}
)
```

**Solution with Builder:**

```python
class HttpRequest:
    def __init__(self, url):
        self.url = url
        self.method = "GET"
        self.headers = {}
        self.body = None
        self.timeout = 30
        self.auth = None
        self.params = {}
        self.cookies = {}

    def __repr__(self):
        return f"HttpRequest({self.method} {self.url})"

class HttpRequestBuilder:
    def __init__(self, url):
        self._request = HttpRequest(url)

    def method(self, method):
        """Set HTTP method"""
        self._request.method = method
        return self  # Return self for method chaining

    def header(self, key, value):
        """Add a header"""
        self._request.headers[key] = value
        return self

    def body(self, body):
        """Set request body"""
        self._request.body = body
        return self

    def timeout(self, seconds):
        """Set timeout"""
        self._request.timeout = seconds
        return self

    def auth(self, username, password):
        """Set authentication"""
        self._request.auth = (username, password)
        return self

    def param(self, key, value):
        """Add URL parameter"""
        self._request.params[key] = value
        return self

    def cookie(self, key, value):
        """Add cookie"""
        self._request.cookies[key] = value
        return self

    def build(self):
        """Return the constructed request"""
        return self._request

# Usage: fluent, readable, self-documenting
request = (HttpRequestBuilder("https://api.example.com/users")
    .method("POST")
    .header("Content-Type", "application/json")
    .header("Accept", "application/json")
    .body('{"name": "Alice"}')
    .timeout(60)
    .auth("username", "password")
    .param("page", "1")
    .cookie("session", "abc123")
    .build())

print(request)
print(f"Method: {request.method}")
print(f"Headers: {request.headers}")

# Simpler request using only needed parameters
simple_request = (HttpRequestBuilder("https://api.example.com/health")
    .timeout(5)
    .build())
```

**Benefits:**
- Readable and self-documenting
- Handles optional parameters elegantly
- Easy to add new configuration options
- Immutable objects possible (build() returns final object)

## Structural Patterns

Structural patterns deal with object composition, creating relationships between objects to form larger structures.

### Adapter

**Intent:** Convert the interface of a class into another interface clients expect. Allows classes with incompatible interfaces to work together.

**When to use:** When you want to use an existing class but its interface doesn't match what you need, or when you need to create reusable classes that work with unrelated classes.

**Example: Payment Gateway Integration**

**Problem: Incompatible interfaces**

```python
# Your application expects this interface
class PaymentProcessor:
    def process_payment(self, amount, currency):
        pass

# Third-party payment gateway has different interface
class StripeGateway:
    def charge(self, amount_cents, currency_code, card_token):
        return f"Stripe charged {amount_cents} cents {currency_code}"

class PayPalGateway:
    def make_payment(self, amount_dollars, currency_string, account_id):
        return f"PayPal charged ${amount_dollars} {currency_string}"

# Can't use these directly - interfaces don't match
```

**Solution with Adapter:**

```python
from abc import ABC, abstractmethod

# Target interface
class PaymentProcessor(ABC):
    @abstractmethod
    def process_payment(self, amount, currency):
        """Process payment with amount in dollars and currency code"""
        pass

# Adaptee 1
class StripeGateway:
    def charge(self, amount_cents, currency_code, card_token):
        return f"Stripe charged {amount_cents} cents {currency_code}"

# Adaptee 2
class PayPalGateway:
    def make_payment(self, amount_dollars, currency_string, account_id):
        return f"PayPal charged ${amount_dollars} {currency_string}"

# Adapter for Stripe
class StripeAdapter(PaymentProcessor):
    def __init__(self, stripe_gateway, card_token):
        self.stripe = stripe_gateway
        self.card_token = card_token

    def process_payment(self, amount, currency):
        # Convert dollars to cents
        amount_cents = int(amount * 100)
        # Delegate to Stripe with its expected interface
        return self.stripe.charge(amount_cents, currency, self.card_token)

# Adapter for PayPal
class PayPalAdapter(PaymentProcessor):
    def __init__(self, paypal_gateway, account_id):
        self.paypal = paypal_gateway
        self.account_id = account_id

    def process_payment(self, amount, currency):
        # PayPal expects currency as string name
        currency_name = {"USD": "US Dollars", "EUR": "Euros"}.get(currency, currency)
        # Delegate to PayPal with its expected interface
        return self.paypal.make_payment(amount, currency_name, self.account_id)

# Client code uses uniform interface
class CheckoutService:
    def __init__(self, payment_processor: PaymentProcessor):
        self.payment_processor = payment_processor

    def checkout(self, amount, currency):
        return self.payment_processor.process_payment(amount, currency)

# Usage - same interface for different gateways
stripe = StripeAdapter(StripeGateway(), "card_token_123")
paypal = PayPalAdapter(PayPalGateway(), "account_456")

checkout_with_stripe = CheckoutService(stripe)
print(checkout_with_stripe.checkout(50.00, "USD"))  # Stripe charged 5000 cents USD

checkout_with_paypal = CheckoutService(paypal)
print(checkout_with_paypal.checkout(50.00, "USD"))  # PayPal charged $50.0 US Dollars
```

**Benefits:**
- Integrates third-party code without modifying it
- Allows reuse of existing classes with incompatible interfaces
- Follows Open/Closed Principle

### Decorator

**Intent:** Attach additional responsibilities to an object dynamically. Provides flexible alternative to subclassing for extending functionality.

**When to use:** When you need to add features to objects without changing their structure, or when extension by subclassing is impractical (too many combinations).

**Example: Text Formatting**

**Problem without Decorator:**

```python
# Would need a class for every combination
class PlainText:
    def render(self):
        return "Hello"

class BoldText:
    def render(self):
        return "<b>Hello</b>"

class ItalicText:
    def render(self):
        return "<i>Hello</i>"

class BoldItalicText:
    def render(self):
        return "<b><i>Hello</i></b>"

class UnderlinedBoldItalicText:
    def render(self):
        return "<u><b><i>Hello</i></b></u>"

# Combinatorial explosion: N features = 2^N classes
```

**Solution with Decorator:**

```python
from abc import ABC, abstractmethod

# Component interface
class Text(ABC):
    @abstractmethod
    def render(self):
        pass

# Concrete component
class PlainText(Text):
    def __init__(self, content):
        self.content = content

    def render(self):
        return self.content

# Base decorator
class TextDecorator(Text):
    def __init__(self, text: Text):
        self._text = text

    def render(self):
        return self._text.render()

# Concrete decorators
class BoldDecorator(TextDecorator):
    def render(self):
        return f"<b>{self._text.render()}</b>"

class ItalicDecorator(TextDecorator):
    def render(self):
        return f"<i>{self._text.render()}</i>"

class UnderlineDecorator(TextDecorator):
    def render(self):
        return f"<u>{self._text.render()}</u>"

class CodeDecorator(TextDecorator):
    def render(self):
        return f"<code>{self._text.render()}</code>"

# Usage - compose decorators dynamically
text = PlainText("Hello, World!")
print(text.render())  # Hello, World!

bold_text = BoldDecorator(text)
print(bold_text.render())  # <b>Hello, World!</b>

italic_bold_text = ItalicDecorator(BoldDecorator(text))
print(italic_bold_text.render())  # <i><b>Hello, World!</b></i>

fully_decorated = UnderlineDecorator(ItalicDecorator(BoldDecorator(text)))
print(fully_decorated.render())  # <u><i><b>Hello, World!</b></i></u>

# Different combination - same decorators, different order
code_bold = BoldDecorator(CodeDecorator(PlainText("print('hello')")))
print(code_bold.render())  # <b><code>print('hello')</code></b>
```

**Real-world example: Stream processing**

```python
# Built-in Python uses decorator pattern for file streams
file = open("data.txt", "rb")  # Raw binary file
buffered = BufferedReader(file)  # Adds buffering
compressed = GZipFile(buffered)  # Adds decompression
# Each decorator adds functionality without modifying underlying stream
```

**Benefits:**
- Add features without modifying original classes
- Compose features at runtime
- Avoid class explosion from combinations
- Follows Single Responsibility and Open/Closed principles

### Facade

**Intent:** Provide a unified, simplified interface to a complex subsystem.

**When to use:** When you want to provide a simple interface to a complex system, or when you want to decouple clients from subsystem components.

**Example: Video Conversion**

**Problem without Facade:**

```python
# Client must understand and coordinate many subsystems
class VideoFile:
    def __init__(self, filename):
        self.filename = filename

class CodecFactory:
    @staticmethod
    def extract(file):
        # Complex codec detection logic
        return "H264Codec" if "mp4" in file.filename else "VP9Codec"

class BitrateReader:
    @staticmethod
    def read(filename, codec):
        # Complex bitrate extraction
        return "1500kbps"

class AudioMixer:
    def fix(self, result):
        # Complex audio processing
        return result

# Client code must orchestrate all these subsystems
file = VideoFile("video.mp4")
codec = CodecFactory.extract(file)
bitrate = BitrateReader.read(file.filename, codec)
audio = AudioMixer()
# ... many more steps
result = audio.fix(bitrate)
# Client needs deep knowledge of video processing pipeline
```

**Solution with Facade:**

```python
# Subsystem classes (complex implementation details)
class VideoFile:
    def __init__(self, filename):
        self.filename = filename
        self.codec_type = None

class CodecFactory:
    @staticmethod
    def extract(file):
        print(f"Detecting codec for {file.filename}")
        return "H264" if "mp4" in file.filename else "VP9"

class BitrateReader:
    @staticmethod
    def read(filename, codec):
        print(f"Reading bitrate with {codec} codec")
        return "1500kbps"

class AudioMixer:
    def fix(self, result):
        print("Fixing audio sync")
        return result

class VideoConverter:
    def convert(self, video_data):
        print("Converting video format")
        return video_data

# Facade - simple interface to complex subsystem
class VideoConversionFacade:
    def convert_video(self, filename, format):
        """Simple interface: give filename and format, get converted file"""
        print(f"Starting conversion of {filename} to {format}")

        # Facade coordinates complex subsystem interactions
        file = VideoFile(filename)
        codec = CodecFactory.extract(file)

        if format == "mp4":
            bitrate = BitrateReader.read(filename, codec)
            audio_mixer = AudioMixer()
            fixed_audio = audio_mixer.fix(bitrate)
            converter = VideoConverter()
            result = converter.convert(fixed_audio)
        else:
            # Different pipeline for different formats
            converter = VideoConverter()
            result = converter.convert(codec)

        print(f"Conversion complete: {result}")
        return result

# Client code - simple and clean
facade = VideoConversionFacade()
facade.convert_video("vacation.avi", "mp4")
# Starting conversion of vacation.avi to mp4
# Detecting codec for vacation.avi
# Reading bitrate with VP9 codec
# Fixing audio sync
# Converting video format
# Conversion complete: 1500kbps

# Client doesn't need to understand video processing internals
```

**Another example: Home Theater System**

```python
# Complex subsystems
class Amplifier:
    def on(self): return "Amplifier on"
    def set_volume(self, level): return f"Volume set to {level}"

class DVDPlayer:
    def on(self): return "DVD Player on"
    def play(self, movie): return f"Playing '{movie}'"

class Projector:
    def on(self): return "Projector on"
    def wide_screen_mode(self): return "Widescreen mode"

class Lights:
    def dim(self, level): return f"Lights dimmed to {level}%"

# Facade
class HomeTheaterFacade:
    def __init__(self, amp, dvd, projector, lights):
        self.amp = amp
        self.dvd = dvd
        self.projector = projector
        self.lights = lights

    def watch_movie(self, movie):
        """One method handles complex setup"""
        print("Get ready to watch a movie...")
        print(self.lights.dim(10))
        print(self.projector.on())
        print(self.projector.wide_screen_mode())
        print(self.amp.on())
        print(self.amp.set_volume(5))
        print(self.dvd.on())
        print(self.dvd.play(movie))

    def end_movie(self):
        """One method handles complex teardown"""
        print("Shutting down movie theater...")
        # Turn everything off in proper sequence

# Usage
theater = HomeTheaterFacade(
    Amplifier(), DVDPlayer(), Projector(), Lights()
)
theater.watch_movie("Inception")
# Get ready to watch a movie...
# Lights dimmed to 10%
# Projector on
# Widescreen mode
# Amplifier on
# Volume set to 5
# DVD Player on
# Playing 'Inception'
```

**Benefits:**
- Simplifies client code
- Reduces dependencies between clients and subsystems
- Doesn't prevent access to subsystem if needed
- Makes subsystem easier to use and understand

## Behavioral Patterns

Behavioral patterns focus on communication between objects, defining how they interact and distribute responsibility.

### Observer

**Intent:** Define a one-to-many dependency between objects so that when one object changes state, all its dependents are notified automatically.

**When to use:** When changes to one object require changing others, and you don't know how many objects need to be changed, or when an object should notify other objects without making assumptions about who those objects are.

**Example: Stock Market Monitoring**

```python
from abc import ABC, abstractmethod

# Observer interface
class Observer(ABC):
    @abstractmethod
    def update(self, subject):
        """Called when subject's state changes"""
        pass

# Subject interface
class Subject(ABC):
    def __init__(self):
        self._observers = []

    def attach(self, observer: Observer):
        """Register an observer"""
        if observer not in self._observers:
            self._observers.append(observer)

    def detach(self, observer: Observer):
        """Unregister an observer"""
        self._observers.remove(observer)

    def notify(self):
        """Notify all observers of state change"""
        for observer in self._observers:
            observer.update(self)

# Concrete subject
class Stock(Subject):
    def __init__(self, symbol, price):
        super().__init__()
        self._symbol = symbol
        self._price = price

    @property
    def symbol(self):
        return self._symbol

    @property
    def price(self):
        return self._price

    @price.setter
    def price(self, value):
        """When price changes, notify all observers"""
        self._price = value
        self.notify()

# Concrete observers
class StockDisplay(Observer):
    def update(self, stock: Stock):
        print(f"Display: {stock.symbol} is now ${stock.price:.2f}")

class StockLogger(Observer):
    def update(self, stock: Stock):
        print(f"Log: Price change for {stock.symbol}: ${stock.price:.2f}")

class AlertSystem(Observer):
    def __init__(self, threshold):
        self.threshold = threshold

    def update(self, stock: Stock):
        if stock.price > self.threshold:
            print(f"ALERT: {stock.symbol} exceeded ${self.threshold}!")

# Usage
apple = Stock("AAPL", 150.0)

# Create and attach observers
display = StockDisplay()
logger = StockLogger()
alert = AlertSystem(160.0)

apple.attach(display)
apple.attach(logger)
apple.attach(alert)

# Price changes automatically notify all observers
print("Setting price to $155...")
apple.price = 155.0
# Display: AAPL is now $155.00
# Log: Price change for AAPL: $155.00

print("\nSetting price to $165...")
apple.price = 165.0
# Display: AAPL is now $165.00
# Log: Price change for AAPL: $165.00
# ALERT: AAPL exceeded $160.0!

# Can remove observers
apple.detach(alert)

print("\nSetting price to $170...")
apple.price = 170.0
# Display: AAPL is now $170.00
# Log: Price change for AAPL: $170.00
# (No alert - observer was detached)
```

**Real-world example: Event listeners**

```python
# JavaScript event listeners use Observer pattern
# button.addEventListener('click', handleClick)  # Attach observer
# When button is clicked, all attached listeners are notified
```

**Benefits:**
- Loose coupling between subject and observers
- Dynamic relationships (add/remove observers at runtime)
- Broadcast communication (one-to-many)
- Supports Open/Closed Principle

**Trade-offs:**
- Observers notified in unpredictable order
- Can cause memory leaks if observers aren't properly detached
- Can trigger cascading updates if observers also trigger changes

### Strategy

**Intent:** Define a family of algorithms, encapsulate each one, and make them interchangeable. Strategy lets the algorithm vary independently from clients that use it.

**When to use:** When you have multiple algorithms for a specific task and want to switch between them, or when you want to avoid conditional statements for selecting algorithms.

**Example: Payment Processing**

```python
from abc import ABC, abstractmethod

# Strategy interface
class PaymentStrategy(ABC):
    @abstractmethod
    def pay(self, amount):
        pass

# Concrete strategies
class CreditCardStrategy(PaymentStrategy):
    def __init__(self, card_number, cvv):
        self.card_number = card_number
        self.cvv = cvv

    def pay(self, amount):
        return f"Paid ${amount:.2f} using Credit Card ending in {self.card_number[-4:]}"

class PayPalStrategy(PaymentStrategy):
    def __init__(self, email):
        self.email = email

    def pay(self, amount):
        return f"Paid ${amount:.2f} using PayPal account {self.email}"

class CryptoStrategy(PaymentStrategy):
    def __init__(self, wallet_address):
        self.wallet_address = wallet_address

    def pay(self, amount):
        return f"Paid ${amount:.2f} using Crypto wallet {self.wallet_address[:8]}..."

class BankTransferStrategy(PaymentStrategy):
    def __init__(self, account_number, routing_number):
        self.account_number = account_number
        self.routing_number = routing_number

    def pay(self, amount):
        return f"Paid ${amount:.2f} via bank transfer from account {self.account_number}"

# Context
class ShoppingCart:
    def __init__(self):
        self.items = []
        self.payment_strategy = None

    def add_item(self, item, price):
        self.items.append((item, price))

    def set_payment_strategy(self, strategy: PaymentStrategy):
        """Client chooses payment strategy at runtime"""
        self.payment_strategy = strategy

    def checkout(self):
        total = sum(price for _, price in self.items)

        if not self.payment_strategy:
            return "Please select a payment method"

        # Delegate to strategy
        result = self.payment_strategy.pay(total)
        self.items = []  # Clear cart
        return result

# Usage
cart = ShoppingCart()
cart.add_item("Book", 25.99)
cart.add_item("Headphones", 89.99)

# Customer 1: Pays with credit card
cart.set_payment_strategy(CreditCardStrategy("1234567890123456", "123"))
print(cart.checkout())
# Paid $115.98 using Credit Card ending in 3456

# Customer 2: Pays with PayPal
cart.add_item("Mouse", 29.99)
cart.set_payment_strategy(PayPalStrategy("user@example.com"))
print(cart.checkout())
# Paid $29.99 using PayPal account user@example.com

# Customer 3: Pays with cryptocurrency
cart.add_item("Keyboard", 79.99)
cart.set_payment_strategy(CryptoStrategy("0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"))
print(cart.checkout())
# Paid $79.99 using Crypto wallet 0x742d35...

# Easy to add new payment methods without changing ShoppingCart
class GiftCardStrategy(PaymentStrategy):
    def __init__(self, card_code):
        self.card_code = card_code

    def pay(self, amount):
        return f"Paid ${amount:.2f} using Gift Card {self.card_code}"

cart.add_item("Monitor", 299.99)
cart.set_payment_strategy(GiftCardStrategy("GIFT-1234-5678"))
print(cart.checkout())
# Paid $299.99 using Gift Card GIFT-1234-5678
```

**Another example: Sorting strategies**

```python
class DataProcessor:
    def __init__(self, sort_strategy):
        self.sort_strategy = sort_strategy

    def process(self, data):
        return self.sort_strategy(data)

# Different strategies as functions
def bubble_sort(data):
    # Bubble sort implementation
    return sorted(data)  # Simplified

def quick_sort(data):
    # Quick sort implementation
    return sorted(data)  # Simplified

def merge_sort(data):
    # Merge sort implementation
    return sorted(data)  # Simplified

# Choose strategy based on data size
data = [3, 1, 4, 1, 5, 9, 2, 6]
if len(data) < 10:
    processor = DataProcessor(bubble_sort)
elif len(data) < 1000:
    processor = DataProcessor(quick_sort)
else:
    processor = DataProcessor(merge_sort)

result = processor.process(data)
```

**Benefits:**
- Eliminates conditional statements for algorithm selection
- Easy to add new algorithms
- Algorithms can be swapped at runtime
- Follows Open/Closed Principle

**Trade-offs:**
- Clients must be aware of different strategies
- Increases number of classes/objects
- Overkill for algorithms that rarely change

### Command

**Intent:** Encapsulate a request as an object, allowing you to parameterize clients with different requests, queue requests, and support undoable operations.

**When to use:** When you want to parameterize objects with operations, queue operations, schedule operations, or support undo/redo.

**Example: Text Editor with Undo**

```python
from abc import ABC, abstractmethod

# Command interface
class Command(ABC):
    @abstractmethod
    def execute(self):
        pass

    @abstractmethod
    def undo(self):
        pass

# Receiver - the object that performs the actual work
class TextEditor:
    def __init__(self):
        self.content = ""

    def insert_text(self, position, text):
        self.content = self.content[:position] + text + self.content[position:]
        print(f"Inserted '{text}' at position {position}")

    def delete_text(self, position, length):
        deleted = self.content[position:position + length]
        self.content = self.content[:position] + self.content[position + length:]
        print(f"Deleted '{deleted}' from position {position}")
        return deleted

    def get_text(self):
        return self.content

# Concrete commands
class InsertCommand(Command):
    def __init__(self, editor: TextEditor, position, text):
        self.editor = editor
        self.position = position
        self.text = text

    def execute(self):
        self.editor.insert_text(self.position, self.text)

    def undo(self):
        self.editor.delete_text(self.position, len(self.text))

class DeleteCommand(Command):
    def __init__(self, editor: TextEditor, position, length):
        self.editor = editor
        self.position = position
        self.length = length
        self.deleted_text = None

    def execute(self):
        self.deleted_text = self.editor.delete_text(self.position, self.length)

    def undo(self):
        if self.deleted_text:
            self.editor.insert_text(self.position, self.deleted_text)

# Invoker - manages command execution and history
class CommandManager:
    def __init__(self):
        self.history = []
        self.undo_stack = []

    def execute_command(self, command: Command):
        """Execute command and add to history"""
        command.execute()
        self.history.append(command)
        self.undo_stack = []  # Clear redo stack when new command executed

    def undo(self):
        """Undo last command"""
        if not self.history:
            print("Nothing to undo")
            return

        command = self.history.pop()
        command.undo()
        self.undo_stack.append(command)
        print(f"Undid: {command.__class__.__name__}")

    def redo(self):
        """Redo last undone command"""
        if not self.undo_stack:
            print("Nothing to redo")
            return

        command = self.undo_stack.pop()
        command.execute()
        self.history.append(command)
        print(f"Redid: {command.__class__.__name__}")

# Usage
editor = TextEditor()
manager = CommandManager()

# Execute commands
cmd1 = InsertCommand(editor, 0, "Hello")
manager.execute_command(cmd1)
print(f"Content: '{editor.get_text()}'\n")
# Inserted 'Hello' at position 0
# Content: 'Hello'

cmd2 = InsertCommand(editor, 5, " World")
manager.execute_command(cmd2)
print(f"Content: '{editor.get_text()}'\n")
# Inserted ' World' at position 5
# Content: 'Hello World'

cmd3 = DeleteCommand(editor, 5, 6)
manager.execute_command(cmd3)
print(f"Content: '{editor.get_text()}'\n")
# Deleted ' World' from position 5
# Content: 'Hello'

# Undo operations
manager.undo()
print(f"Content: '{editor.get_text()}'\n")
# Inserted ' World' at position 5
# Undid: DeleteCommand
# Content: 'Hello World'

manager.undo()
print(f"Content: '{editor.get_text()}'\n")
# Deleted ' World' from position 5
# Undid: InsertCommand
# Content: 'Hello'

# Redo operations
manager.redo()
print(f"Content: '{editor.get_text()}'\n")
# Inserted ' World' at position 5
# Redid: InsertCommand
# Content: 'Hello World'
```

**Another example: Smart home automation**

```python
# Commands for smart home devices
class LightOnCommand(Command):
    def __init__(self, light):
        self.light = light

    def execute(self):
        self.light.turn_on()

    def undo(self):
        self.light.turn_off()

class ThermostatCommand(Command):
    def __init__(self, thermostat, temperature):
        self.thermostat = thermostat
        self.temperature = temperature
        self.previous_temp = None

    def execute(self):
        self.previous_temp = self.thermostat.get_temperature()
        self.thermostat.set_temperature(self.temperature)

    def undo(self):
        self.thermostat.set_temperature(self.previous_temp)

# Macro command - executes multiple commands
class MacroCommand(Command):
    def __init__(self, commands):
        self.commands = commands

    def execute(self):
        for cmd in self.commands:
            cmd.execute()

    def undo(self):
        for cmd in reversed(self.commands):
            cmd.undo()

# "Movie mode" - turns off lights, sets temperature, closes blinds
movie_mode = MacroCommand([
    LightOnCommand(living_room_light),
    ThermostatCommand(thermostat, 68),
    # ... more commands
])
```

**Benefits:**
- Decouples object that invokes operation from object that performs it
- Easy to add new commands
- Supports undo/redo
- Supports command queuing and logging
- Supports transactional behavior (rollback on failure)

**Trade-offs:**
- Increases number of classes (one per command)
- Can be overkill for simple operations

## Common Pitfalls

### Pattern Overuse

**Mistake:** Applying design patterns everywhere, even when simple code would work better.

**Impact:** Over-engineered code that's harder to understand than necessary.

**Fix:** Use patterns to solve actual problems, not preemptively. Simple is better than clever.

### Wrong Pattern Choice

**Mistake:** Using Strategy when you meant Decorator, or Singleton when you needed Factory.

**Impact:** Solution doesn't fit the problem, leading to awkward code.

**Fix:** Understand the intent and consequences of each pattern. Focus on the problem, not the pattern name.

### Ignoring SOLID Principles

**Mistake:** Applying patterns mechanically without considering underlying principles.

**Impact:** Patterns that don't improve design or maintainability.

**Fix:** Patterns should support SOLID principles. If a pattern makes code violate SOLID, reconsider.

### Premature Pattern Application

**Mistake:** Adding patterns "because we might need them later."

**Impact:** Complexity without immediate benefit.

**Fix:** Follow YAGNI (You Aren't Gonna Need It). Refactor to patterns when complexity emerges.

### Missing the Point

**Mistake:** Focusing on implementation details rather than the problem the pattern solves.

**Impact:** Pattern is technically correct but doesn't improve the design.

**Fix:** Understand why the pattern exists. Implementation details vary; the intent doesn't.

## When to Use Design Patterns

**Use patterns when:**
- You recognize a problem the pattern solves
- The pattern simplifies your design
- Benefits outweigh added complexity
- Team members understand the pattern

**Don't use patterns when:**
- Simple code would work better
- You're pattern-hunting instead of problem-solving
- Pattern adds complexity without clear benefit
- You're doing it "because best practices"

**Remember:** Patterns are tools, not goals. The goal is maintainable, understandable code. Patterns are means to that end.

## See Also

- [[SOLID Principles]]
- [[Object-Oriented Programming]]
- [[Software Architecture]]
- [[Refactoring]]
- [[Code Quality]]
- [[Dependency Injection]]
- [[Anti-Patterns]]

## References

- Design Patterns: Elements of Reusable Object-Oriented Software (Gamma, Helm, Johnson, Vlissides) - The "Gang of Four" book
- Head First Design Patterns (Freeman, Robson, Bates, Sierra)
- Refactoring: Improving the Design of Existing Code (Martin Fowler)
- Clean Architecture (Robert C. Martin)
- [Refactoring Guru - Design Patterns](https://refactoring.guru/design-patterns)
- [SourceMaking - Design Patterns](https://sourcemaking.com/design_patterns)
