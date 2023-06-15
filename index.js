const {
	app,
	BrowserWindow,
	screen,
	Menu,
	MenuItem,
	session
} = require('electron')
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;


async function createWindow() {
	const { width, height } = screen.getPrimaryDisplay().workAreaSize
	// Create the browser window.
	win = new BrowserWindow({
		height: parseInt(height * 0.75),
		width: parseInt(width * 0.75),
		webPreferences: {
			nodeIntegration: false, // is default value after Electron v5
			contextIsolation: true, // protect against prototype pollution
			enableRemoteModule: false, // turn off remote
		}
	})
	const menu = new Menu()
	session.defaultSession.webRequest.onBeforeRequest({ urls: ['*://*/*'] }, function (details, callback) {
		var test_url = details.url;
		//console.log(test_url);
		callback({ cancel: checkBlocked(test_url) })

	})
	menu.append(new MenuItem({
		label: 'Exit',
		submenu: [{
			role: 'exit',
			accelerator: process.platform === 'darwin' ? 'Alt+F4' : 'Alt+F4',
			click: () => {
				win.destroy()
				app.quit()
				console.log('Electron closed!')
			}
		}]
	}))

	Menu.setApplicationMenu(menu)
	//Menu.setApplicationMenu(null)

	win.loadURL('https://google.com/search?q='+encodeURIComponent(process.argv[1])+'+meaning')
	win.on('closed', function () {
		app.quit()
	})
}

app.on('ready', createWindow)

function checkBlocked(url) {
	blockedArr = ['googleadservices.com', 'doubleclick.net']
	for (let b of blockedArr) {
		if (url.includes(b))
			return true;
	}
	return false;
}