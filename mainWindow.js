// Modules
const { BrowserWindow } = require("electron");
const isDev = require("electron-is-dev");
const path = require("path");

// export mainWindow
exports.createWindow = () => {
  // BrowserWindow options
  // https://electronjs.org/docs/api/browser-window#new-browserwindowoptions
  this.win = new BrowserWindow({
    width: 800,
    height: 600,
    icon: "favicon.ico",
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
      contextIsolation: false,
    },
  });

  // Devtools
  //   this.win.webContents.openDevTools();

  // Load main window content
  this.win.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "./index.html")}`
  );

  // Handle window closed
  this.win.on("closed", () => {
    this.win = null;
  });
};
