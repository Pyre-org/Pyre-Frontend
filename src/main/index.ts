import {
  app,
  shell,
  BrowserWindow,
  ipcMain,
  desktopCapturer,
  screen,
  globalShortcut,
  Tray,
  Menu,
  clipboard,
} from "electron";
import fs from "fs";
import { join } from "path";
import { electronApp, optimizer, is } from "@electron-toolkit/utils";
import notifier from "node-notifier";
import { Deeplink } from "electron-deeplink";
import icon from "../../resources/icon.png?asset";

app.commandLine.appendSwitch("ignore-certificate-errors");

let isRunning = false;

const windows = {
  main: null as BrowserWindow | null,
  screenshot: null as BrowserWindow | null,
  auth: null as BrowserWindow | null,
};

const appID = "Pyre";
const appName = "com.pyre.app";
const protocol = is.dev ? "pyre-dev" : "pyre";
const lock = app.requestSingleInstanceLock();
const deeplink = new Deeplink({
  app,
  // @ts-ignore - mainWindow is not null
  mainWindow: windows.main,
  isDev: is.dev,
  debugLogging: is.dev,
  protocol,
});

deeplink.on("received", (link: string) => {
  if (windows.main?.isMinimized() || !windows.main?.isVisible())
    windows.main?.show();
  windows.main?.focus();
  windows.main?.webContents.send("deeplink", link);
});

if (!lock) {
  app.quit();
} else {
  app.on("second-instance", () => {
    if (windows.main) {
      if (windows.main.isMinimized() || !windows.main.isVisible())
        windows.main.show();
      windows.main.focus();
    }
  });
}

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1080,
    height: 720,
    minWidth: 800,
    minHeight: 450,
    show: false,
    icon: join(__dirname, "../../resources/icon.png"),
    autoHideMenuBar: true,
    webPreferences: {
      preload: join(__dirname, "../preload/index.js"),
      sandbox: false,
    },
  });

  windows.main = mainWindow;

  mainWindow.on("ready-to-show", () => {
    mainWindow.show();
  });

  mainWindow.on("close", (e) => {
    if (!isRunning) {
      windows.main = null;
      return;
    }
    e.preventDefault();
    mainWindow.hide();

    notifier.notify({
      title: "Pyre",
      message: "앱이 백그라운드에서 실행 중입니다.",
      icon: join(__dirname, "../../resources/icon.png"),
      appID,
    });
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

function createScreenshotWindow() {
  if (windows.screenshot) {
    windows.screenshot.close();
    windows.screenshot = null;
  }
  const display = screen.getPrimaryDisplay();
  // create a screenshot area to select the area to capture
  const win = new BrowserWindow({
    width: display.size.width,
    height: display.size.height,
    x: 0,
    y: 0,
    show: false,
    frame: false,
    transparent: true,
    movable: false,
    resizable: false,
    fullscreen: true,
    skipTaskbar: true,
    hasShadow: false,
    alwaysOnTop: true,
    ...(process.platform === "linux" ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, "../preload/index.js"),
      sandbox: false,
    },
  });

  windows.screenshot = win;

  win.on("ready-to-show", () => {
    win.show();
  });

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env["ELECTRON_RENDERER_URL"]) {
    win.loadURL(`${process.env["ELECTRON_RENDERER_URL"]}/screenshot.html`);
  } else {
    win.loadFile(join(__dirname, "../renderer/screenshot.html"));
  }
}

function handleCloseScreenshotWindow() {
  if (windows.screenshot) {
    windows.screenshot.close();
    windows.screenshot = null;
  }
}

function openMainWindow() {
  if (!windows.main) {
    createWindow();
  }
  windows.main?.show();
}

function createTray() {
  const tray = new Tray(join(__dirname, "../../resources/icon.png"));
  const contextMenu = Menu.buildFromTemplate([
    {
      label: "앱 종료",
      click: () => {
        isRunning = false;
        app.quit();
      },
    },
  ]);

  tray.on("click", openMainWindow);
  tray.setToolTip("Pyre");
  tray.setContextMenu(contextMenu);
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  isRunning = true;
  globalShortcut.register("CommandOrControl+Shift+C", () => {
    createScreenshotWindow();
  });

  createTray();

  // Set app user model id for windows
  electronApp.setAppUserModelId(appID);

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
  // if (process.platform !== "darwin") {
  //   app.quit();
  // }
});

app.on("ready", () => app.setAppUserModelId(appName));

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

ipcMain.handle("DESKTOP_CAPTURER_CAPTURE_SCREEN_AREA", async (_, area) => {
  const display = screen.getPrimaryDisplay();
  const sources = await desktopCapturer.getSources({
    types: ["screen"],
    thumbnailSize: display.size,
  });
  const source = sources?.[0];
  if (!source) return;
  const name = `screenshot${Date.now()}.png`;
  const screenshotPath = join(app.getPath("pictures"), name);
  const image = source.thumbnail.crop(area);
  fs.writeFileSync(screenshotPath, image.toPNG());

  const res = {
    name,
    path: screenshotPath,
    width: image.getSize().width,
    height: image.getSize().height,
    dataURL: image.toDataURL(),
  };

  windows.main?.webContents.send("SCREENSHOT_CAPTURED", res);

  return res;
});

ipcMain.handle(
  "SHOW_CAPTURE_NOTIFICATION",
  (_, url: string, localPath: string) => {
    clipboard.writeText(url);
    notifier.notify(
      {
        title: "스크린샷이 저장되었습니다",
        message: url,
        icon: localPath,
        wait: true,
        appID,
      },
      (_, res) => {
        if (!res && url) {
          shell.openExternal(url);
        }
      },
    );
  },
);

ipcMain.handle("CLOSE_SCREENSHOT_WINDOW", () => {
  handleCloseScreenshotWindow();
});

ipcMain.handle("OPEN_PATH", (_, path: string) => {
  console.log(path);
  shell.openPath(path);
});

interface IOAuthLoginParams {
  authority: string;
  url: string;
}

ipcMain.handle("OAUTH_LOGIN", (_, { authority, url }: IOAuthLoginParams) => {
  if (windows.auth) {
    windows.auth.close();
    windows.auth = null;
  }

  const authWindow = new BrowserWindow({
    width: 700,
    height: 800,
    show: false,
    webPreferences: {
      nodeIntegration: false,
      webSecurity: false,
    },
  });
  windows.auth = authWindow;

  authWindow.loadURL(url, {
    userAgent: windows.main?.webContents.userAgent,
  });
  authWindow.show();

  let sent = false;
  const handler = (
    details: Electron.Event<Electron.WebContentsWillRedirectEventParams>,
  ) => {
    try {
      if (sent) return;
      const newUrl = details.url;
      const code = new URL(newUrl).searchParams.get("code");
      const state = new URL(newUrl).searchParams.get("state");
      if (code) {
        details.preventDefault();
        sent = true;
        windows.main?.webContents.send("oauth-login", {
          authority,
          code,
          state,
        });
        authWindow.close();
        windows.auth = null;
      }
    } catch (e) {
      console.error(e);
    }
  };

  authWindow.webContents.on("will-redirect", handler);
  authWindow.webContents.on("will-navigate", handler);

  authWindow.on("close", () => {
    windows.auth = null;
  });
});

ipcMain.handle("FOCUS_MAIN_WINDOW", () => {
  windows.main?.show();
  windows.main?.focus();
});
