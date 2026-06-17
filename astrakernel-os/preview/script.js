/* AstraKernel OS Visual Demo - JS Engine */
const state = {
    vmState: "desktop",
    focusedApp: null,
    zIndex: 100,
    bootTimer: null,
    logsTimer: null,
    apps: {
        welcome: { open: false, minimized: false, maximized: false, title: "Welcome to AstraKernel", icon: "hexagon", tpl: "tpl-win-welcome", w: 380, h: 440 },
        terminal: { open: false, minimized: false, maximized: false, title: "astra@astrakernel: ~", icon: "terminal", tpl: "tpl-win-terminal", w: 550, h: 350 },
        files: { open: false, minimized: false, maximized: false, title: "Home - Files", icon: "folder-open", tpl: "tpl-win-files", w: 500, h: 350 },
        browser: { open: false, minimized: false, maximized: false, title: "Astra Browser", icon: "compass", tpl: "tpl-win-browser", w: 600, h: 450 },
        code: { open: false, minimized: false, maximized: false, title: "main.js - Code Editor", icon: "code-2", tpl: "tpl-win-editor", w: 550, h: 400 },
        settings: { open: false, minimized: false, maximized: false, title: "Astra Control Center", icon: "settings", tpl: "tpl-win-settings", w: 550, h: 400 },
        docs: { open: false, minimized: false, maximized: false, title: "Documentation", icon: "align-left", tpl: "tpl-win-docs", w: 600, h: 450 },
        monitor: { open: false, minimized: false, maximized: false, title: "System Monitor", icon: "cpu", tpl: "tpl-win-sysmon", w: 400, h: 300 },
        about: { open: false, minimized: false, maximized: false, title: "About AstraKernel OS", icon: "box", tpl: "tpl-win-about", w: 350, h: 300 },
        installer: { open: false, minimized: false, maximized: false, title: "Install AstraKernel", icon: "check-square", tpl: "tpl-win-install", w: 450, h: 300 }
    }
};

const BOOT_MESSAGES = [
    "Loading Linux kernel 6.1.0-astra...", "Loading initial ramdisk...", "Running hook [udev]...",
    "Starting system services...", "Mounting root filesystem...", "Starting Network Manager...",
    "Loading desktop environment...", "Starting Astra services...", "Boot complete."
];

document.addEventListener('DOMContentLoaded', init);

function init() {
    if (window.lucide) lucide.createIcons();
    document.addEventListener('click', handleGlobalClick);
    startClock();
    startSysMonitor();
    setupDrag();
    showDesktop();
}

function handleGlobalClick(e) {
    const actionEl = e.target.closest('[data-action]');
    const appEl = e.target.closest('[data-app]');
    const menuEl = e.target.closest('.menu-wrapper');
    const isToggleAction = actionEl && actionEl.getAttribute('data-action').startsWith('toggleMenu');
    
    // Close popups when clicking outside
    if (!menuEl && !isToggleAction && !e.target.closest('.menu-popup')) {
        document.querySelectorAll('.menu-popup').forEach(m => m.classList.add('hidden'));
    }

    if (actionEl) {
        const action = actionEl.getAttribute('data-action');
        const val = actionEl.getAttribute('data-val');
        
        switch(action) {
            case 'startVM': startVM(); break;
            case 'restartVM': restartVM(); break;
            case 'shutdownVM': shutdownVM(); break;
            case 'showGrub': showGrubScreen(); break;
            case 'showBoot': showBootScreen(); break;
            case 'showLogin': showLoginScreen(); break;
            case 'showDesktop': showDesktop(); break;
            case 'toggleMenu': toggleMenu(val); break;
            case 'toggleFullscreen': toggleFullscreen(); break;
            case 'toast': showToast(val); break;
            case 'closeWindow':
            case 'close-window': closeWindow(val); break;
            case 'minimizeWindow':
            case 'minimize-window': minimizeWindow(val); break;
            case 'maximizeWindow':
            case 'maximize-window': maximizeWindow(val); break;
        }
    } else if (appEl) {
        const app = appEl.getAttribute('data-app');
        const type = appEl.getAttribute('data-type');
        
        if (type === 'dock') {
            if (state.apps[app].open && !state.apps[app].minimized) {
                if (state.focusedApp === app) minimizeWindow(app);
                else focusWindow(app);
            } else if (state.apps[app].minimized) {
                restoreWindow(app);
            } else {
                openWindow(app);
            }
        } else {
            openWindow(app);
        }
    }
}

function makeWindowDraggable(win) {
  const titlebar = win.querySelector(".window-titlebar");
  if (!titlebar) return;

  let isDragging = false;
  let offsetX = 0;
  let offsetY = 0;

  titlebar.addEventListener("mousedown", function(e) {
    if (e.target.closest("button") || e.target.closest(".window-control") || e.target.closest(".window-controls")) return;

    isDragging = true;
    focusWindow(win.dataset.app);

    const rect = win.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;

    win.classList.add("dragging");
    document.body.style.userSelect = "none";
  });

  document.addEventListener("mousemove", function(e) {
    if (!isDragging) return;

    const desktop = document.querySelector("#screen-desktop") || document.querySelector(".vm-screen") || document.body;
    const bounds = desktop.getBoundingClientRect();

    let x = e.clientX - bounds.left - offsetX;
    let y = e.clientY - bounds.top - offsetY;

    x = Math.max(0, Math.min(x, bounds.width - win.offsetWidth));
    y = Math.max(28, Math.min(y, bounds.height - win.offsetHeight)); // 28px top panel

    win.style.left = x + "px";
    win.style.top = y + "px";
    win.style.right = "auto";
    win.style.bottom = "auto";
    win.style.position = "absolute";
  });

  document.addEventListener("mouseup", function() {
    if (!isDragging) return;
    isDragging = false;
    win.classList.remove("dragging");
    document.body.style.userSelect = "";
  });
}

function setVmState(newState) {
    state.vmState = newState;
    ['screen-off', 'screen-grub', 'screen-boot', 'screen-login', 'screen-desktop', 'screen-shutdown'].forEach(id => {
        const el = document.getElementById(id);
        if(el) el.classList.add('hidden');
    });
    
    const screenMap = { 'poweredOff': 'screen-off', 'grub': 'screen-grub', 'boot': 'screen-boot', 'login': 'screen-login', 'desktop': 'screen-desktop', 'shutdown': 'screen-shutdown' };
    const targetEl = document.getElementById(screenMap[newState]);
    if(targetEl) targetEl.classList.remove('hidden');
    
    document.getElementById('vm-activity-dot').classList.toggle('hidden', ['poweredOff'].includes(newState));
    document.getElementById('status-hd').classList.toggle('text-green-600', ['boot', 'desktop'].includes(newState));
    document.getElementById('status-net').classList.toggle('text-green-600', ['login', 'desktop'].includes(newState));
}

function startVM() {
    if (state.vmState === 'desktop' || state.vmState === 'login') {
        return showToast("AstraKernel OS is already running.");
    }
    if (state.vmState !== 'poweredOff' && state.vmState !== 'shutdown') return;
    resetBootProgress();
    showGrubScreen();
}

function restartVM() {
    clearTimers();
    document.querySelectorAll('.menu-popup').forEach(m => m.classList.add('hidden'));
    document.getElementById('shutdown-text').innerHTML = "Restarting system...<br/>Stopping services...";
    setVmState('shutdown');
    setTimeout(() => {
        resetBootProgress();
        showGrubScreen();
    }, 1000);
}

function shutdownVM() {
    clearTimers();
    document.querySelectorAll('.menu-popup').forEach(m => m.classList.add('hidden'));
    Object.keys(state.apps).forEach(app => { 
        state.apps[app].open = false; 
        state.apps[app].minimized = false; 
    });
    document.getElementById('windows-container').innerHTML = '';
    updateDockIndicators();
    document.getElementById('shutdown-text').innerHTML = "AstraKernel OS is shutting down...<br/>Stopping Astra services...<br/>Saving session...<br/>Power off complete.";
    setVmState('shutdown');
    setTimeout(() => setVmState('poweredOff'), 2000);
}

function clearTimers() {
    if(state.bootTimer) clearTimeout(state.bootTimer);
    if(state.logsTimer) clearInterval(state.logsTimer);
}

function resetBootProgress() {
    clearTimers();
    const pBar = document.getElementById('boot-progress-bar');
    if(pBar) pBar.style.width = '0%';
    const logsContainer = document.getElementById('boot-logs-container');
    if(logsContainer) {
        logsContainer.innerHTML = '<div id="boot-loading-spinner" class="animate-pulse mt-1 text-cyan-500 flex gap-3 hidden"><span class="text-yellow-500">[ WAIT ]</span><span>Loading module...</span>_</div>';
    }
}

function showGrubScreen() {
    setVmState('grub');
    state.bootTimer = setTimeout(showBootScreen, 1200);
}

function showBootScreen() {
    setVmState('boot');
    resetBootProgress();
    const logsContainer = document.getElementById('boot-logs-container');
    const pBar = document.getElementById('boot-progress-bar');
    const loadingStr = document.getElementById('boot-loading-spinner');
    if(loadingStr) loadingStr.classList.remove('hidden');
    let step = 0;
    state.logsTimer = setInterval(() => {
        if (step < BOOT_MESSAGES.length) {
            const el = document.createElement('div');
            el.className = "flex gap-3 pb-1";
            el.innerHTML = `<span class="text-green-500">[  OK  ]</span><span>${BOOT_MESSAGES[step]}</span>`;
            logsContainer.insertBefore(el, loadingStr);
            pBar.style.width = ((step + 1) / BOOT_MESSAGES.length) * 100 + "%";
            step++;
        } else {
            clearInterval(state.logsTimer);
            if(loadingStr) loadingStr.classList.add('hidden');
            state.bootTimer = setTimeout(showLoginScreen, 500);
        }
    }, 150);
}

function showLoginScreen() {
    setVmState('login');
    const pwInput = document.getElementById('login-password');
    if(pwInput) pwInput.value = '';
    
    // Auto login animation for visual demo
    setTimeout(() => {
        if(pwInput && state.vmState === 'login') {
            pwInput.value = '********';
            setTimeout(() => {
                const btn = document.querySelector('[data-action="showDesktop"]');
                if(btn && state.vmState === 'login') btn.click();
            }, 400);
        }
    }, 1200);
}

function showDesktop() {
    setVmState('desktop');
    if (!state.apps.welcome.open && !state.apps.terminal.open && !state.apps.monitor.open && document.getElementById('windows-container').children.length === 0) {
        openWindow('welcome');
        openWindow('terminal');
        openWindow('monitor');
    }
    updateDockIndicators();
}

function toggleMenu(id) {
    document.querySelectorAll('.menu-popup').forEach(m => {
        if (m.id !== id) m.classList.add('hidden');
    });
    const el = document.getElementById(id);
    if(el) el.classList.toggle('hidden');
}

function toggleFullscreen() {
    const el = document.getElementById('vbox-container');
    const body = document.body;
    if (!document.fullscreenElement && !body.classList.contains('fullscreen-active')) {
        if (el.requestFullscreen) {
            el.requestFullscreen().catch(() => body.classList.add('fullscreen-active'));
        } else {
            body.classList.add('fullscreen-active');
        }
        el.classList.add('vbox-fullscreen');
    } else {
        if (document.exitFullscreen && document.fullscreenElement) {
            document.exitFullscreen();
        }
        body.classList.remove('fullscreen-active');
        el.classList.remove('vbox-fullscreen');
    }
}

document.addEventListener('fullscreenchange', () => {
    if (!document.fullscreenElement) {
        document.body.classList.remove('fullscreen-active');
        document.getElementById('vbox-container').classList.remove('vbox-fullscreen');
    }
});
document.addEventListener('keydown', e => { if (e.key === 'Escape') toggleFullscreen(); });

function showToast(msg) {
    const parent = document.getElementById('screen-wrapper');
    if(!parent) return;
    let c = document.getElementById('toast-container');
    if(!c) { c = document.createElement('div'); c.id = 'toast-container'; parent.appendChild(c); }
    const t = document.createElement('div');
    t.className = 'toast';
    t.innerHTML = `<i data-lucide="info" class="w-4 h-4 inline-block mr-2 align-text-bottom"></i>${msg}`;
    c.appendChild(t);
    if(window.lucide) lucide.createIcons({root: t});
    setTimeout(() => {
        t.style.opacity = '0';
        t.style.transition = 'opacity 0.3s ease';
        setTimeout(() => t.remove(), 300);
    }, 3000);
}

function openWindow(appName) {
    if(!state.apps[appName]) return;
    state.apps[appName].open = true;
    state.apps[appName].minimized = false;
    const container = document.getElementById('windows-container');
    let win = document.getElementById(`win-${appName}`);
    if (!win) {
        const conf = state.apps[appName];
        win = document.createElement('div');
        win.id = `win-${appName}`;
        win.className = `app-window active os-window`; // keep os-window for now for old css until updated
        win.dataset.app = appName;
        win.style.width = conf.w + 'px';
        win.style.height = conf.h + 'px';
        const offset = (container.children.length * 25);
        win.style.top = (50 + offset) + 'px';
        win.style.left = (100 + offset) + 'px';
        win.style.zIndex = ++state.zIndex;
        win.addEventListener('mousedown', () => focusWindow(appName));
        const tpl = document.getElementById(conf.tpl);
        const tplHtml = tpl ? tpl.innerHTML : '';
        win.innerHTML = `
            <div class="window-titlebar">
                <div class="window-controls">
                    <button class="win-btn win-red" data-action="close-window" data-val="${appName}"></button>
                    <button class="win-btn win-yellow" data-action="minimize-window" data-val="${appName}"></button>
                    <button class="win-btn win-green" data-action="maximize-window" data-val="${appName}"></button>
                </div>
                <div class="window-title"><i data-lucide="${conf.icon}" class="w-3.5 h-3.5 text-gray-400 border-none outline-none"></i> ${conf.title}</div>
            </div>
            <div class="window-body pointer-events-auto">${tplHtml}</div>
        `;
        container.appendChild(win);
        makeWindowDraggable(win);
        if(window.lucide) lucide.createIcons({root: win});
        if(appName === 'terminal') {
            const inp = win.querySelector('#terminal-input');
            if(inp) inp.addEventListener('keydown', handleTerminalInput);
            
            // Fake typing animation for terminal on first open
            if (!state.hasUsedTerminal && inp) {
                state.hasUsedTerminal = true;
                setTimeout(() => {
                    const cmd = "astra-info";
                    let i = 0;
                    const typeInt = setInterval(() => {
                        if(i < cmd.length) {
                            inp.value += cmd[i];
                            i++;
                        } else {
                            clearInterval(typeInt);
                            setTimeout(() => {
                                inp.dispatchEvent(new KeyboardEvent('keydown', {'key': 'Enter'}));
                            }, 300);
                        }
                    }, 80);
                }, 600);
            }
        }
        if(appName === 'browser') {
            const inp = win.querySelector('#browser-url');
            if(inp) inp.addEventListener('keydown', handleBrowserInput);
        }
    } else {
        win.style.display = 'flex';
    }
    focusWindow(appName);
    updateDockIndicators();
}

function closeWindow(app) {
    if(state.apps[app]) { state.apps[app].open = false; state.apps[app].minimized = false; state.apps[app].maximized = false; }
    const win = document.getElementById(`win-${app}`);
    if(win) win.remove();
    updateDockIndicators();
}

function minimizeWindow(app) {
    if(state.apps[app]) state.apps[app].minimized = true;
    const win = document.getElementById(`win-${app}`);
    if(win) win.style.display = 'none';
    state.focusedApp = null;
    updateDockIndicators();
}

function restoreWindow(app) {
    if(state.apps[app]) state.apps[app].minimized = false;
    const win = document.getElementById(`win-${app}`);
    if(win) win.style.display = 'flex';
    focusWindow(app);
    updateDockIndicators();
}

function maximizeWindow(app) {
    const win = document.getElementById(`win-${app}`);
    if(!win || !state.apps[app]) return;
    if(state.apps[app].maximized) {
        win.classList.remove('maximized');
        state.apps[app].maximized = false;
    } else {
        win.classList.add('maximized');
        state.apps[app].maximized = true;
    }
    focusWindow(app);
}

function focusWindow(app) {
    state.focusedApp = app;
    document.querySelectorAll('.app-window').forEach(w => w.classList.remove('active'));
    const win = document.getElementById(`win-${app}`);
    if(win) {
        win.classList.add('active');
        win.style.zIndex = ++state.zIndex;
    }
    updateDockIndicators();
    if(app === 'terminal') {
        const inp = document.getElementById('terminal-input');
        if(inp) inp.focus();
    }
}

function updateDockIndicators() {
    document.querySelectorAll('.dock-item').forEach(el => {
        const app = el.getAttribute('data-app');
        el.classList.toggle('focused', state.focusedApp === app);
        const dot = el.querySelector('.dock-dot');
        if(dot && state.apps[app]) dot.classList.toggle('active', state.apps[app].open);
    });
}

function setupDrag() {
    // Replaced by makeWindowDraggable
}

function handleTerminalInput(e) {
    if(e.key === 'Enter') {
        const val = e.target.value.trim();
        const out = document.getElementById('terminal-output');
        let res = '', outHtml = `<div class="text-green-400 font-bold mt-2 terminal-input-line">astra@astrakernel<span class="text-[#CDD6F4] font-normal">:$ ${val}</span></div>`;
        if (val === 'help') res = `Available commands:<br/>help, clear, neofetch, astra-info, astra-about, ls, pwd, whoami, date, uname -a, open [app], exit`;
        else if (val === 'clear') { out.innerHTML = ''; e.target.value = ''; return; }
        else if (['neofetch', 'astra-info'].includes(val)) res = `<div class="flex gap-6 mt-3 mb-3 items-center">
            <div class="text-cyan-400 font-bold leading-tight">
               \\  /<br/>
 -----------<br/>
 |  ASTRA  |<br/>
 -----------<br/>
               /  \\
            </div>
            <div class="text-xs">
                <div class="text-cyan-400 font-bold text-sm mb-1 border-b border-gray-600 pb-1">astra<span class="text-green-400">@</span>astrakernel</div>
                <div><span class="text-gray-400 font-bold">OS</span>: AstraKernel OS v0.1 Debian</div>
                <div><span class="text-gray-400 font-bold">Kernel</span>: 6.1.0-astra-generic</div>
                <div><span class="text-gray-400 font-bold">Uptime</span>: 0 mins</div>
                <div><span class="text-gray-400 font-bold">Packages</span>: 1,402 (dpkg)</div>
                <div><span class="text-gray-400 font-bold">Shell</span>: bash 5.1.16</div>
                <div><span class="text-gray-400 font-bold">DE</span>: XFCE 4.18 Custom</div>
                <div><span class="text-gray-400 font-bold">WM</span>: Xfwm4</div>
                <div class="flex gap-1 mt-2">
                    <div class="w-3 h-3 bg-black"></div><div class="w-3 h-3 bg-red-400"></div><div class="w-3 h-3 bg-green-400"></div><div class="w-3 h-3 bg-yellow-400"></div><div class="w-3 h-3 bg-blue-400"></div><div class="w-3 h-3 bg-purple-400"></div><div class="w-3 h-3 bg-cyan-400"></div><div class="w-3 h-3 bg-white"></div>
                </div>
            </div>
        </div>`;
        else if (val === 'astra-about') res = "AstraKernel OS is a custom high-performance Linux distro.";
        else if (val === 'ls') res = "Desktop  Documents  Downloads  README.md  settings.json";
        else if (val === 'pwd') res = "/home/astra";
        else if (val === 'whoami') res = "astra";
        else if (val === 'date') res = new Date().toString();
        else if (val === 'uname -a') res = "Linux astrakernel 6.1.0-astra x86_64 GNU/Linux";
        else if (val.startsWith('open ')) {
            const appTarget = val.split(' ')[1];
            if(state.apps[appTarget]) { openWindow(appTarget); res = `Opening ${appTarget}...`; } 
            else res = `App not found: ${appTarget}`;
        } else if (val === 'exit') { closeWindow('terminal'); return; }
        else if (val) res = `bash: ${val}: command not found`;
        
        if(res) outHtml += `<div class="mb-2 whitespace-pre-wrap">${res}</div>`;
        out.insertAdjacentHTML('beforeend', outHtml);
        e.target.value = '';
        setTimeout(() => e.target.scrollIntoView(), 10);
    }
}

function handleBrowserInput(e) {
    if(e.key === 'Enter') {
        const val = e.target.value;
        const pageMsg = document.getElementById('browser-content');
        if(pageMsg) pageMsg.innerHTML = `<div class="opacity-50 text-center"><i data-lucide="compass" class="w-16 h-16 text-blue-500 mb-4 mx-auto"></i><h2 class="text-xl font-bold">Navigating...</h2><p class="text-sm mt-2">Loading ${val}</p></div>`;
        showToast("Browser navigation handeled.");
    }
}

function startClock() {
    const update = () => {
        const d = new Date(), fmt = d.toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'});
        document.querySelectorAll('.system-clock').forEach(e => e.textContent = fmt);
        document.querySelectorAll('.system-clock-full').forEach(e => {
            e.textContent = d.toLocaleDateString([], {month:'short',day:'numeric'}) + ' ' + fmt;
        });
    };
    update(); setInterval(update, 60000);
}

function startSysMonitor() {
    let cpu = 12, ram = 20, net = 1.2;
    setInterval(() => {
        cpu = Math.max(5, Math.min(80, cpu + (Math.random()*10 - 5)));
        ram = Math.max(18, Math.min(30, ram + (Math.random()*2 - 1)));
        net = Math.max(0.1, Math.min(5, net + (Math.random() - 0.5)));
        ['sys-cpu-bar'].forEach(id => { const el = document.getElementById(id); if(el) el.style.width = cpu + '%'; });
        ['sys-cpu-text'].forEach(id => { const el = document.getElementById(id); if(el) el.textContent = cpu.toFixed(1) + '%'; });
        ['sys-ram-bar'].forEach(id => { const el = document.getElementById(id); if(el) el.style.width = ram + '%'; });
        ['sys-ram-text'].forEach(id => { const el = document.getElementById(id); if(el) el.textContent = (ram/100 * 4096).toFixed(0) + 'MB / 4GB'; });
        ['sys-net-text'].forEach(id => { const el = document.getElementById(id); if(el) el.textContent = net.toFixed(1) + ' MB/s ↓'; });
    }, 2000);
}
