# Notes App - Electron Desktop Application

A modern, cross-platform desktop notes application built with Electron, React, TypeScript, and Redux Toolkit. This application provides a clean, intuitive interface for managing personal notes with features like tagging, pinning, and real-time search.

## 📋 Application Description

### Features
- **Note Management**: Create, edit, and delete notes
- **Pin Notes**: Pin important notes to the top of the list for quick access
- **Tag System**: Organize notes with custom tags for better categorization
- **Real-time Search**: Search through note titles and content with instant results

### Technology Stack
- **Frontend**: React + TypeScript
- **State Management**: Redux Toolkit

## 🛠️ Setup Instructions

### Prerequisites
- **Node.js** (version 18 or higher)
  - Download from [nodejs.org](https://nodejs.org/)
  - Verify: `node --version`
- **npm** (comes with Node.js)
  - Verify: `npm --version`

### Installation Steps

1. **Clone the Repository**
   ```bash
   git clone <your-repository-url>
   cd electron
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

### Development Scripts
- `npm run dev` - Start development environment (React + Electron)
- `npm run dev:react` - Start React development server only
- `npm run dev:electron` - Compile and start Electron only
- `npm run build` - Build for production
- `npm test` - Run tests

## 🏗️ Build Instructions

### Development Build
```bash
npm run build
```
This compiles TypeScript and builds the React application.

### Production Distribution

**Windows:**
```bash
npm run dist:win
```

**macOS:**
```bash
npm run dist:mac
```

**Linux:**
```bash
npm run dist:linux
```

### Build Output
- Distribution packages are created in the `dist/` folder
- Windows: `.exe` (portable) and `.msi` (installer)
- macOS: `.dmg` installer
- Linux: `.AppImage` package

## 🏛️ Architecture Decisions

### 1. **Electron Architecture**
- **Main Process**: Handles file system operations, IPC communication, and application lifecycle
- **Renderer Process**: React application for the user interface
- **Preload Script**: Secure bridge between main and renderer processes

My goal was to to interact with the Electron main process as if it was a node.js server to manage my resources, and communicate via "controllers" that are exposed via the preload script.
I devided the main process to relevant layers (controllers, services, repositories) to keep seprations of concerns. The main process is also implemented with interfaces and dependancy injection design pattern so it would be flexible and easy to perform unit tests.
The data layer is currently using the file system (json files) to manage the data.
For the frontend (renderer) I used redux toolkit to manage the app state, and lavarage the async opertation life cycle managment. The structure I decided to use is to devide it to common components, pages and app features that handles resources from the backend. 

## ⚠️ Known Limitations
- **No Cloud Sync**: Data is stored locally only
- **No Rich Text**: Plain text only, no formatting
- **Large Datasets**: Performance may degrade with 1000+ notes
- **Memory Usage**: Electron applications have higher memory footprint
- **No Database**: File-based storage limits scalability
- **No Offline Sync**: No synchronization when online

## 🧪 Testing
### Running Tests
```bash
npm test                    # Run all tests
npm run test:watch         # Run tests in watch mode
npm run test:coverage      # Generate coverage report
```
- Unit test for Note Service CRUD operations


