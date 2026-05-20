# Quantum — Getting Started Guide

Welcome to **Quantum**, a hybrid programming language that lets you write code in several familiar styles inside one `.sa` source file. This guide helps you install the tools, run your first program, and learn the core ideas step by step.

---

## Table of contents

1. [Introduction](#1-introduction)
2. [Installation](#2-installation)
3. [First program](#3-first-program)
4. [Language styles](#4-language-styles)
5. [Variables and data types](#5-variables-and-data-types)
6. [Conditions](#6-conditions)
7. [Loops](#7-loops)
8. [Functions](#8-functions)
9. [CLI commands](#9-cli-commands)
10. [Errors](#10-errors)
11. [Folder structure](#11-folder-structure)

---

## 1. Introduction

### What is Quantum?

**Quantum** is a multi-style programming language. You can mix syntax that looks like **Python**, **C**, **C++**, **JavaScript**, and basic **Rust-style** type hints in the same program. Quantum reads a single source file (`.sa`) and runs it as one unified program.

Example — Python-style input and C++-style output in one file:

```sa
n = input("Enter your name: ")
cout << n
```

### Why it exists

Many learners know more than one language. Quantum reduces context-switching: you can use the syntax you already know while learning how different language styles work together in one runtime.

### Who should use it

- Beginners learning programming for the first time  
- Students who know Python and want to explore C/C++-style code gradually  
- Developers experimenting with multi-syntax or polyglot-style design  
- Anyone building tutorials, courses, or small tools on top of the Quantum CLI  

---

## 2. Installation

These steps assume you install Quantum from **GitHub** (source or release package).

### Prerequisites

- **Git** — to clone the repository  
- A **C++ compiler** (for building the toolchain from source), such as:
  - Windows: [MSYS2](https://www.msys2.org/) / MinGW, or Visual Studio Build Tools  
  - macOS: Xcode Command Line Tools  
  - Linux: `g++` or `clang++`  

### Step 1 — Clone the repository

```bash
git clone https://github.com/YOUR_ORG/quantum.git
cd quantum
```

Replace `YOUR_ORG/quantum` with your actual GitHub repository URL.

### Step 2 — Build the toolchain

Follow the build instructions in the repository’s main `README` (typically `make` or `cmake`). After a successful build, you should have:

- `qrun` — interpreter  
- `quantum` — compiler / project CLI  

### Step 3 — Add Quantum to your PATH

Copy or link the built binaries to a folder on your system `PATH`, or add the build output directory to `PATH`.

**Windows (PowerShell, current session):**

```powershell
$env:PATH += ";C:\path\to\quantum\build"
```

**Linux / macOS:**

```bash
export PATH="/path/to/quantum/build:$PATH"
```

### Step 4 — Verify installation

```bash
quantum version
```

You should see a version string. If the command is not found, check your `PATH` and build step.

### Editor tip (important)

Save all `.sa` files as **UTF-8 without BOM**. In VS Code or Cursor: status bar → encoding → **Save with Encoding** → **UTF-8**. A hidden BOM byte at the start of a file causes `LexError` (see [Errors](#10-errors)).

---

## 3. First program

Create a file named `hello.sa`:

```sa
print("Hello, Quantum!")
```

### Run with the interpreter

From the folder that contains `hello.sa`:

```bash
qrun hello.sa
```

**Expected output:**

```text
Hello, Quantum!
```

The interpreter runs your code immediately and does not leave extra build artifacts in the folder.

### Build with the compiler (optional)

To produce a native executable:

```bash
quantum build
```

Or compile a single file (if your toolchain supports it):

```bash
quantum hello.sa
```

On Windows you may get `hello.exe`; run that executable to see the same output.

---

## 4. Language styles

Quantum’s main idea is **flexibility**: one file, multiple syntax families. Below are small examples for each style. You can often combine them in the same `.sa` file.

### Python-style syntax

Indentation-friendly, `print`, `input`, and simple assignments.

```sa
name = input("Name: ")
print("Hello,", name)

x = 10
y = 20
print(x + y)
```

### C-style syntax

Semicolons, `printf`-style output, and classic control flow.

```sa
#include <stdio.h>

int main() {
    printf("Hello from C-style Quantum\n");
    return 0;
}
```

> **Note:** Exact C preprocessor and `main` support may depend on your Quantum version. Use the style your toolchain documents.

### C++-style syntax

Streams and C++-like output with `cout`.

```sa
cout << "Hello from C++-style Quantum"
cout << endl

message = "Quantum is multi-syntax"
cout << message
```

Mixed with Python in one file:

```sa
n = input("Enter a number: ")
cout << n
```

### JavaScript-style syntax

`console.log`, `let` / `const`, and familiar expression syntax.

```sa
let title = "Quantum"
console.log(title)

const version = 1
console.log("Version:", version)
```

> **Note:** Support for `let` and `const` varies by version; prefer the style that your installed toolchain accepts.

### Rust-inspired type syntax

Basic type annotations on variables (partial Rust-like feature).

```sa
let count: i32 = 42
let name: str = "Quantum"
let active: bool = true

print(count)
print(name)
print(active)
```

Type annotations help document intent and can assist the runtime with simple checks where implemented.

### Mixing styles (recommended learning path)

```sa
# Python-style setup
let score: i32 = 100
print("Score:", score)

# C++-style display
cout << "Final score: "
cout << score
```

---

## 5. Variables and data types

Variables store values. In Quantum you can use simple assignment (Python-like) or annotated declarations (Rust-inspired).

### Assignment without explicit types

```sa
age = 25
price = 19.99
letter = "A"
is_ready = true

print(age)
print(price)
print(letter)
print(is_ready)
```

### Assignment with type annotations

```sa
let count: i32 = 10
let pi: f64 = 3.14
let label: str = "Quantum"
let flag: bool = false
```

### Common type names

| Type   | Meaning              | Example        |
|--------|----------------------|----------------|
| `i32`  | 32-bit integer       | `42`           |
| `f64`  | 64-bit floating point| `3.14`         |
| `str`  | Text string          | `"hello"`      |
| `bool` | True or false        | `true`         |

### Updating a variable

```sa
x = 5
print(x)

x = x + 1
print(x)
```

---

## 6. Conditions

Use conditions to run code only when a test is true.

### Python-style `if` / `elif` / `else`

```sa
score = 85

if score >= 90:
    print("Grade: A")
elif score >= 80:
    print("Grade: B")
else:
    print("Grade: C")
```

### C-style `if` / `else`

```sa
int age = 18;

if (age >= 18) {
    printf("Adult\n");
} else {
    printf("Minor\n");
}
```

### Simple comparison example

```sa
n = input("Enter a number: ")
# treat input as numeric when your runtime supports conversion
if n == "0":
    print("Zero")
else:
    print("Non-zero (as text)")
```

---

## 7. Loops

Loops repeat code until a condition is met or a sequence is finished.

### Python-style `while`

```sa
count = 1
while count <= 5:
    print(count)
    count = count + 1
```

### Python-style `for`

```sa
for i in range(1, 6):
    print(i)
```

### C-style `for`

```sa
int i;
for (i = 1; i <= 5; i++) {
    printf("%d\n", i);
}
```

### Loop with mixed output

```sa
for i in range(3):
    cout << "Step "
    cout << i
    cout << endl
```

---

## 8. Functions

Functions group reusable logic. Quantum supports Python-like `def` and C-style functions depending on your file style.

### Python-style function

```sa
def greet(name):
    print("Hello,", name)

greet("Quantum")
```

### Function with return value

```sa
def add(a, b):
    return a + b

result = add(3, 4)
print(result)
```

### C-style function

```sa
int double_value(int x) {
    return x * 2;
}

int main() {
    int n = double_value(21);
    printf("%d\n", n);
    return 0;
}
```

### Best practice

- Use one clear style per small project until you are comfortable mixing.  
- Name functions descriptively: `calculate_total`, `read_input`, etc.  

---

## 9. CLI commands

Quantum ships with a small command-line interface.

### `qrun` — run a program immediately

```bash
qrun program.sa
```

| Aspect | Description |
|--------|-------------|
| Purpose | Interpret and execute `.sa` source |
| Output | Program output in the terminal |
| Artifacts | No executable file (by design) |
| Best for | Learning, quick tests, homework |

**Example:**

```bash
qrun hello.sa
```

---

### `quantum init` — create a new project

```bash
quantum init my_app
cd my_app
```

| Aspect | Description |
|--------|-------------|
| Purpose | Scaffold a new Quantum project |
| Typical files | `main.sa`, config, build folders (layout may vary by version) |
| Best for | Starting a multi-file app |

---

### `quantum build` — compile the project

```bash
quantum build
```

| Aspect | Description |
|--------|-------------|
| Purpose | Compile the current project to a native binary |
| Output | Executable (e.g. `my_app.exe` on Windows) |
| Best for | Sharing apps, performance, distribution |

Run the produced executable from your build directory after a successful build.

---

### `quantum version` — show toolchain version

```bash
quantum version
```

Use this when reporting bugs or checking that your install matches documentation.

---

### Quick reference

| Command | Action |
|---------|--------|
| `qrun file.sa` | Run one source file |
| `quantum init name` | Create a new project |
| `quantum build` | Compile the project |
| `quantum version` | Print version info |
| `quantum file.sa` | Compile a single file (when supported) |

---

## 10. Errors

### LexError

A **LexError** means the lexer could not read your source — often at a specific line.

**Example message:**

```text
X LexError at line 1
  Unexpected character:
```

#### Common causes

| Cause | Fix |
|-------|-----|
| **UTF-8 BOM** at start of file | Re-save as UTF-8 **without** BOM |
| **Wrong encoding** (UTF-16) | Convert file to UTF-8 |
| **Invalid symbol** | Remove smart quotes `“ ”`, emojis, or paste glitches |
| **Unsupported character** | Use plain ASCII quotes `"` and standard operators |
| **Typo in keyword** | Check spelling: `print`, `cout`, `def`, etc. |

#### BOM example

If your editor adds a BOM, the first character is invisible and line 1 may fail even when code looks correct.

**Fix in Cursor / VS Code:**

1. Open the `.sa` file  
2. Click encoding in the status bar  
3. **Save with Encoding** → **UTF-8** (not “UTF-8 with BOM”)  

### Other beginner mistakes

- **Wrong file extension** — Quantum source should be `.sa`  
- **Wrong directory** — run `qrun` from the folder that contains the file, or pass the correct path  
- **Mixing styles carelessly** — combine syntax only after each style works alone  
- **Missing quotes** — strings need matching `"` or `'`  
- **Forgetting colons** — Python-style blocks often need `:` after `if`, `for`, `def`  

### Getting help

1. Read the error line number  
2. Open that line in your editor  
3. Check encoding and invisible characters  
4. Simplify the program to the smallest example that still fails  
5. Compare with a known-good file such as `example1.sa` in this course repo  

---

## 11. Folder structure

A clear folder layout keeps projects and courses organized.

### Single-file practice (learning)

```text
my-practice/
├── hello.sa
└── mixed.sa
```

Run:

```bash
qrun hello.sa
```

### CLI project (application)

After `quantum init my_app`:

```text
my_app/
├── main.sa          # Entry point
├── src/             # Extra modules (if used)
├── build/           # Compiled output (generated)
└── quantum.toml     # Project config (name may vary)
```

Build:

```bash
cd my_app
quantum build
```

### Course / documentation repository (this repo style)

```text
Quantum/
├── GUIDE.md           # This guide
├── README.md
├── .gitignore
├── .editorconfig      # UTF-8, no BOM for .sa files
├── data/              # Lessons
│   ├── 01-basic/
│   ├── 02-intermediate/
│   └── 03-advanced/
└── projects/          # Capstone projects
    ├── beginner-projects/
    ├── intermediate-projects/
    └── advanced-projects/
```

Each lesson topic:

```text
data/01-basic/03-first-program/
├── README.md
├── example1.sa
├── example2.sa
└── quizzes.md
```

### Naming tips

- Use **lowercase** and **hyphens** for folders: `01-what-is-quantum`  
- One main idea per `.sa` file when learning  
- Keep filenames short: `hello.sa`, `loops-demo.sa`  

---

## Next steps

1. Complete the topics in `data/01-basic/` in order.  
2. Run every `example1.sa` and `example2.sa` with `qrun`.  
3. Try the exercises in each `quizzes.md`.  
4. Build a small project under `projects/beginner-projects/`.  
5. Move on to `data/02-intermediate/` when basics feel comfortable.  

---

## Summary

| Topic | Remember |
|-------|----------|
| File extension | `.sa` |
| Fast run | `qrun file.sa` |
| Project | `quantum init` → `quantum build` |
| Mixed syntax | Python + C++ in one file is a core feature |
| Encoding | UTF-8, no BOM |
| Errors | Read line number; check LexError causes first |

Happy coding with Quantum.
