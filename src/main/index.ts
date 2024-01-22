import {
  app,
  shell,
  BrowserWindow,
  ipcMain,
  desktopCapturer,
  screen,
  globalShortcut,
} from "electron";
import fs from "fs";
import { join } from "path";
import { electronApp, optimizer, is } from "@electron-toolkit/utils";
import icon from "../../resources/icon.png?asset";

app.commandLine.appendSwitch("ignore-certificate-errors");

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1080,
    height: 720,
    minWidth: 800,
    minHeight: 450,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === "linux" ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, "../preload/index.js"),
      sandbox: false,
    },
  });

  mainWindow.on("ready-to-show", () => {
    mainWindow.show();
  });

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: "deny" };
  });

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env["ELECTRON_RENDERER_URL"]) {
    mainWindow.loadURL(process.env["ELECTRON_RENDERER_URL"]);
  } else {
    mainWindow.loadFile(join(__dirname, "../renderer/index.html"));
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  globalShortcut.register("CommandOrControl+R", () => {
    handleScreenshot();
  });
  // Set app user model id for windows
  electronApp.setAppUserModelId("com.electron");

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on("browser-window-created", (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  createWindow();

  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.

function downloadURI(uri, name) {
  const data = uri.replace(/^data:image\/\w+;base64,/, "");
  const buf = Buffer.from(data, "base64");
  fs.writeFile(name, buf, () => console.log("done"));
}

ipcMain.handle("DESKTOP_CAPTURER_GET_SOURCES", async (_, opts) => {
  const res = await desktopCapturer.getSources(opts);
  res.map((i, idx) => downloadURI(i.thumbnail.toDataURL(), `test${idx}.png`));
  return res;
});

ipcMain.handle("DESKTOP_CAPTURER_GET_PRIMARY_SCREEN", async () => {
  const res = screen.getPrimaryDisplay();
  return res;
});

function handleScreenshot() {
  const display = screen.getPrimaryDisplay();
  const options: Electron.SourcesOptions = {
    types: ["screen"],
    thumbnailSize: display.size,
  };
  desktopCapturer.getSources(options).then((sources) => {
    const source = sources?.[0];
    if (!source) return;
    const screenshotPath = join(app.getPath("pictures"), "screenshot.png");
    console.log(screenshotPath);
    fs.writeFile(screenshotPath, source.thumbnail.toPNG(), (error) => {
      if (error) {
        console.error(error);
        return;
      }
      shell.openPath(screenshotPath);
    });
  });
}
