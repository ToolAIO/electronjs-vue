"use strict";
const electron = require("electron");
const path = require("path");
const utils = require("@electron-toolkit/utils");
const icon = path.join(__dirname, "../../resources/icon.png");
function createWindow() {
  const mainWindow2 = new electron.BrowserWindow({
    // width: 900,
    width: 1200,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...process.platform === "linux" ? { icon } : {},
    webPreferences: {
      preload: path.join(__dirname, "../preload/index.js"),
      sandbox: false,
      nodeIntegration: true,
      // Bật Node Integration
      contextIsolation: false
      // Vô hiệu hóa cách ly ngữ cảnh
    }
  });
  mainWindow2.on("ready-to-show", () => {
    mainWindow2.show();
  });
  mainWindow2.webContents.setWindowOpenHandler((details) => {
    electron.shell.openExternal(details.url);
    return { action: "deny" };
  });
  if (utils.is.dev && process.env["ELECTRON_RENDERER_URL"]) {
    mainWindow2.loadURL(process.env["ELECTRON_RENDERER_URL"]);
  } else {
    mainWindow2.loadFile(path.join(__dirname, "../renderer/index.html"));
  }
}
electron.app.whenReady().then(() => {
  utils.electronApp.setAppUserModelId("com.electron");
  electron.app.on("browser-window-created", (_, window) => {
    utils.optimizer.watchWindowShortcuts(window);
  });
  createWindow();
  electron.app.on("activate", function() {
    if (electron.BrowserWindow.getAllWindows().length === 0)
      createWindow();
  });
});
electron.app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    electron.app.quit();
  }
});
const sendMenuEvent = async (data) => {
  mainWindow.webContents.send("change-view", data);
};
[
  {
    label: electron.app.name,
    submenu: [
      {
        label: "Home",
        accelerator: "CommandOrControl+H",
        click() {
          sendMenuEvent({ route: "/" });
        }
      },
      { type: "separator" },
      { role: "minimize" },
      { role: "togglefullscreen" },
      { type: "separator" },
      { role: "quit", accelerator: "Alt+F4" }
    ]
  },
  {
    role: "help",
    submenu: [
      {
        label: "Get Help",
        role: "help",
        accelerator: "F1",
        click() {
          sendMenuEvent({ route: "/help" });
        }
      },
      {
        label: "About",
        role: "about",
        accelerator: "CommandOrControl+A",
        click() {
          sendMenuEvent({ route: "/about" });
        }
      }
    ]
  }
];
