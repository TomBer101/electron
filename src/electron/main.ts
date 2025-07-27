import { app, BrowserWindow } from 'electron'
import path from 'path'
import { isDev } from './util.js'
import { NotesService } from './services/NotesService.js'
import { FileDataSource } from './lib/dataSources/FileDataSource.js'
import { NotesRepository } from './repositories/NotesRepository.js'
import fs from 'fs'
import { ControllerManager } from './controllers/index.js'
import { TagsRepository } from './repositories/tagsRepository.js'
import { TagsService } from './services/TagsService.js'


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
        mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
            console.error('Failed to load URL:', errorCode, errorDescription)
        })
        mainWindow.loadURL('http://localhost:5123')
    } else {
        mainWindow.loadFile(path.join(app.getAppPath(), '../../dist-react/index.html'))
    }
}

function initializeServices(): { notesService: NotesService, tagsService: TagsService } {
    const userDataPath = app.getPath('userData')
    const notesFilePath = path.join(userDataPath, 'notes.json')
    const tagsFilePath = path.join(userDataPath, 'tags.json')

    if(!fs.existsSync(notesFilePath)) {
        fs.writeFileSync(notesFilePath, '[]', 'utf-8')
    }

    const notesRepository = new NotesRepository(new FileDataSource(notesFilePath))
    const notesService = new NotesService(notesRepository)

    if(!fs.existsSync(tagsFilePath)) {
        fs.writeFileSync(tagsFilePath, '[]', 'utf-8')
    }

    const tagsRepository = new TagsRepository(new FileDataSource(tagsFilePath))
    const tagsService = new TagsService(tagsRepository, notesService)

    return { notesService, tagsService }
}

async function initializeControllers(notesService: NotesService, tagsService: TagsService): Promise<void> {
    const { NotesController, TagsController } = await import('./controllers/index.js')
    const notesController = new NotesController(notesService)
    const tagsController = new TagsController(tagsService)
    const controllerManager = new ControllerManager(notesController, tagsController)
    controllerManager.registerHandlers()
}


app.whenReady().then(async () => {
    const { notesService, tagsService } = await initializeServices()
    await initializeControllers(notesService, tagsService)
    createMainWindow()


    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createMainWindow()
    })
})


app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})