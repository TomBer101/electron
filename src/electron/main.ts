import { app, BrowserWindow } from 'electron'
import path from 'path'
import { isDev } from './util.js'
import { NotesService } from './services/NotesService.js'
import { FileDataSource } from './lib/dataSources/FileDataSource.js'
import { NotesRepository } from './repositories/NotesRepository.js'
import fs from 'fs'
import { ControllerManager } from './controllers/index.js'


console.log('=== MAIN PROCESS STARTING ===')

let mainWindow: BrowserWindow | null = null
const gotTheLock = app.requestSingleInstanceLock()

if(!gotTheLock) {
    app.quit()
} else {
    app.on('second-instance', (event, commandLine, workingDirectory) => {
        if(mainWindow) {
            if(mainWindow.isMinimized()) {
                mainWindow.restore()
            }
            mainWindow.focus()
        } else {
            createMainWindow()
        }
    })
}


function createMainWindow(): void {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 800,
        center: true,
        title: 'Take a Note',
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false,
            sandbox: false
        }
    })




    if (isDev()) {
        
    mainWindow.webContents.openDevTools()

        mainWindow.loadURL('http://localhost:5123')
    } else {
        mainWindow.loadFile(path.join(app.getAppPath(), '../../dist-react/index.html'))
    }
}

function initializeServices(): { notesService: NotesService } {
    const userDataPath = app.getPath('userData')
    const notesFilePath = path.join(userDataPath, 'notes.json')

    if(!fs.existsSync(notesFilePath)) {
        fs.writeFileSync(notesFilePath, '[]', 'utf-8')
    }

    const notesRepository = new NotesRepository(new FileDataSource(notesFilePath))
    const notesService = new NotesService(notesRepository)

    return { notesService }
}

async function initializeControllers(notesService: NotesService): Promise<void> {
    const { NotesController } = await import('./controllers/index.js')
    const notesController = new NotesController(notesService)
    const controllerManager = new ControllerManager(notesController)
    controllerManager.registerHandlers()
}


app.whenReady().then(async () => {
    const { notesService } = await initializeServices()
    await initializeControllers(notesService)
    createMainWindow()


    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createMainWindow()
    })
})


app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})