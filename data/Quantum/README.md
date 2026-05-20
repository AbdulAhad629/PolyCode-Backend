# Quantum Programming Language

**Quantum** is a multi-syntax programming language: write Python-style and C++-style code in the same `.sa` file. Quantum understands both and runs them as one program.

```sa
n = input("Enter")
cout << n
```

This repository is the **official Quantum course** — structured lessons from basic to advanced, with per-topic quizzes and a project showcase.

---

## Commands

| Tool | Command | Description |
|------|---------|-------------|
| **Interpreter** | `qrun file.sa` | Run immediately (no extra output files) |
| **Compiler** | `quantum file.sa` | Build a native executable (e.g. `.exe` on Windows) |

---

## Example

```sa
print("Hello, Quantum!")
```

```sa
n = input("Enter")
cout << n
```

---

## Repository structure

```
Quantum/
├── README.md
├── .gitignore
├── data/                         # Lessons (in order)
│   ├── 01-basic/                 # 1 — start here
│   ├── 02-intermediate/          # 2
│   └── 03-advanced/              # 3
└── projects/
    ├── beginner-projects/
    ├── intermediate-projects/
    └── advanced-projects/
```

---

## Curriculum (in order)

### 1. Basic — `data/01-basic/`

1. What is Quantum  
2. Installation  
3. First program  
4. Input / output  
5. Mixed syntax  
6. Variables  
7. Conditions  
8. Loops  
9. Functions  
10. Basic projects  

### 2. Intermediate — `data/02-intermediate/`

1. Memory sharing  
2. Language communication  
3. File handling  
4. Modules  
5. Error handling  
6. Python + C++ integration  
7. Python + C integration  
8. Advanced mixing  
9. Intermediate projects  

### 3. Advanced — `data/03-advanced/`

1. Runtime system  
2. Execution engine  
3. Performance  
4. AI integration  
5. Web integration  
6. API development  
7. Custom modules  
8. Compiler internals  
9. Advanced projects  

---

## Topic layout

```
data/<level>/<topic>/
├── README.md
├── example1.sa
├── example2.sa
└── quizzes.md
```

---

## Projects

Submit capstone work under `projects/beginner-projects/`, `projects/intermediate-projects/`, or `projects/advanced-projects/`.

---

## Status

Lesson and quiz content are **placeholders** — structure is ready for content authors.
