# Walle Design System

## Start new project

1. `curl -fsSL https://raw.githubusercontent.com/FabrizioCafolla/walle-design-system/main/walle.sh | bash -s -- init --project-name <project-name>`

   Replace `<project-name>` with the desired value.

   You can also specify directory path where initialize walle desisgn system with option `--dir-path <dir-path>`.

## Devmode

### With Dev Container (Recommended)

1. Requirements: `Docker >=24`
2. Open the project in Visual Studio Code
3. Install the Dev Containers extension
4. Reopen in container when prompted
5. Website automatically starts at [http://localhost:4321](http://localhost:4321)

### Without Dev Container

1. **Requirements**

   | pkg  | version  |
   | ---- | -------- |
   | Docker | `>=24` |
   | Node   | `>=22` |
   | Yarn | `^1.22`|

2. **Setup the project:**

   ```bash
   make setup
   ```

3. **Start development server:**

   ```bash
   make dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:4321](http://localhost:4321)

---

<div align="center">License © All right reserved.</div>
