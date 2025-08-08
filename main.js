const { app, BrowserWindow, ipcMain, Menu } = require("electron");
const macaddress = require("macaddress");
const mainWindow = require("./mainWindow");
// function createWindow() {
//   // Create the browser window.
//   const win = new BrowserWindow({
//     width: 800,
//     height: 600,
//     webPreferences: {
//       nodeIntegration: true,
//       enableRemoteModule: true,
//       contextIsolation: false,
//     },
//   });
//   win.loadURL(
//     isDev
//       ? "http://localhost:3000"
//       : `file://${path.join(__dirname, "./index.html")}`
//   );
// }

const isMac = process.platform === "darwin";

const template = [
  // { role: 'appMenu' }
  ...(isMac
    ? [
        {
          label: app.name,
          submenu: [
            { role: "about" },
            { type: "separator" },
            { role: "services" },
            { type: "separator" },
            { role: "hide" },
            { role: "hideOthers" },
            { role: "unhide" },
            { type: "separator" },
            { role: "quit" },
          ],
        },
      ]
    : []),
  // { role: 'fileMenu' }
  {
    label: "Menu",
    submenu: [
      {
        label: "🏨 Home",
        accelerator: isMac ? "Shift+command+H" : "Shift+ctrl+H",
        click: async () => {
          mainWindow.win.webContents.send("on-home-click", { click: true });
        },
      },
      {
        label: "◀︎ Back",
        accelerator: isMac ? "command+[" : "ctrl+[",
        click: async () => {
          mainWindow.win.webContents.send("on-back-click", { click: true });
        },
      },
      {
        label: "► Forward",
        accelerator: isMac ? "command+]" : "ctrl+]",
        click: async () => {
          mainWindow.win.webContents.send("on-forward-click", { click: true });
        },
      },
    ],
  },
  {
    label: "File",
    submenu: [isMac ? { role: "close" } : { role: "quit" }],
  },
  // { role: 'editMenu' }
  {
    label: "Edit",
    submenu: [
      { role: "undo" },
      { role: "redo" },
      { type: "separator" },
      { role: "cut" },
      { role: "copy" },
      { role: "paste" },
      ...(isMac
        ? [
            { role: "pasteAndMatchStyle" },
            { role: "delete" },
            { role: "selectAll" },
            { type: "separator" },
            {
              label: "Speech",
              submenu: [{ role: "startSpeaking" }, { role: "stopSpeaking" }],
            },
          ]
        : [{ role: "delete" }, { type: "separator" }, { role: "selectAll" }]),
    ],
  },
  // { role: 'viewMenu' }
  {
    label: "View",
    submenu: [
      { role: "reload" },
      { role: "forceReload" },
      { role: "toggleDevTools" },
      { type: "separator" },
      { role: "resetZoom" },
      { role: "zoomIn" },
      { role: "zoomOut" },
      { type: "separator" },
      { role: "togglefullscreen" },
    ],
  },
  // { role: 'windowMenu' }
  {
    label: "Window",
    submenu: [
      { role: "minimize" },
      { role: "zoom" },
      ...(isMac
        ? [
            { type: "separator" },
            { role: "front" },
            { type: "separator" },
            { role: "window" },
          ]
        : [{ role: "close" }]),
    ],
  },
  {
    role: "help",
    submenu: [
      {
        label: "Learn More",
        click: async () => {
          const { shell } = require("electron");
          await shell.openExternal("https://electronjs.org");
        },
      },
    ],
  },
];

const menu = Menu.buildFromTemplate(template);

app.on("ready", () => {
  // eslint-disable-next-line no-unused-expressions
  mainWindow.createWindow();
  Menu.setApplicationMenu(menu);
});

// Quit when all windows are closed.
app.on("window-all-closed", function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) mainWindow.createWindow();
});
// macaddress.one().then(function (mac) {
//   console.info("Mac address for this host: %s", mac);
//   // mainWindow.win.webContents.send("mac-address", {macaddress:mac})

// });

ipcMain.handle("mac-address", async (event, ...args) => {
  const result = await macaddress.one();
  return result;
});

ipcMain.on("send-data-event-name", (event, data) => {
  event.reply(
    "send-data-event-name-reply",
    "Hey react app processed your event"
  );
});
