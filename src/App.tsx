import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, RotateCcw, Square, Maximize, Box, HardDrive, Video, Network, Usb, 
  Volume2, Monitor, Hexagon, Wifi, Battery, Power, Settings, FolderOpen, 
  Terminal as TerminalIcon, AlignLeft, Code2, Compass, Cpu, CheckSquare, Search, User, ArrowRight, Folder, X
} from 'lucide-react';

import { 
  TerminalApp, BrowserApp, WelcomeApp, FilesApp, 
  SettingsApp, DocsApp, SystemMonitorApp 
} from './components/Apps';

type VmState = 'poweredOff' | 'grub' | 'booting' | 'login' | 'desktop' | 'shutdown';

type WindowId = 'welcome' | 'terminal' | 'browser' | 'files' | 'settings' | 'docs' | 'installer' | 'code' | 'monitor';

interface WindowState {
  open: boolean;
  minimized: boolean;
  maximized: boolean;
  x: number;
  y: number;
  z: number;
  w: number | string;
  h: number | string;
}

const INITIAL_WINDOWS: Record<WindowId, WindowState> = {
  welcome: { open: false, minimized: false, maximized: false, x: 250, y: 120, z: 10, w: 450, h: 480 },
  terminal: { open: false, minimized: false, maximized: false, x: 100, y: 150, z: 1, w: 600, h: 400 },
  monitor: { open: false, minimized: false, maximized: false, x: 50, y: 50, z: 1, w: 340, h: 420 },
  browser: { open: false, minimized: false, maximized: false, x: 150, y: 100, z: 1, w: 800, h: 550 },
  files: { open: false, minimized: false, maximized: false, x: 200, y: 120, z: 1, w: 700, h: 450 },
  settings: { open: false, minimized: false, maximized: false, x: 250, y: 140, z: 1, w: 700, h: 500 },
  docs: { open: false, minimized: false, maximized: false, x: 300, y: 160, z: 1, w: 700, h: 550 },
  installer: { open: false, minimized: false, maximized: false, x: 350, y: 180, z: 1, w: 500, h: 400 },
  code: { open: false, minimized: false, maximized: false, x: 120, y: 130, z: 1, w: 800, h: 550 },
};

const BOOT_LOGS = [
  "Loading Linux kernel 6.1.0-astra...",
  "Loading initial ramdisk...",
  "Running hook [udev]...",
  "Starting system services...",
  "Mounting root filesystem...",
  "Mounting local filesystems...",
  "Starting Network Manager...",
  "Loading desktop environment...",
  "Starting Astra services...",
  "Boot complete."
];

export default function App() {
  const [vmState, setVmState] = useState<VmState>('poweredOff');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const vmRef = useRef<HTMLDivElement>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [bootProgress, setBootProgress] = useState(0);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [activePopup, setActivePopup] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const [password, setPassword] = useState("");

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const closeMenus = () => {
    setActiveMenu(null);
    setActivePopup(null);
  };

  const handleStart = () => {
    if (vmState !== 'poweredOff') return;
    setLogs([]);
    setBootProgress(0);
    setPassword("");
    setVmState('grub');
  };

  const handleRestart = () => {
    setVmState('shutdown');
    setTimeout(() => {
      setVmState('poweredOff');
      setTimeout(handleStart, 800);
    }, 1500);
  };

  const handleShutdown = () => {
    setVmState('shutdown');
    setTimeout(() => {
      setVmState('poweredOff');
    }, 1500);
  };

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (vmState === 'grub') {
      timeout = setTimeout(() => {
        setVmState('booting');
      }, 3000);
    } else if (vmState === 'booting') {
      let step = 0;
      const interval = setInterval(() => {
        if (step < BOOT_LOGS.length) {
          setLogs(p => [...p, BOOT_LOGS[step]]);
          setBootProgress(((step + 1) / BOOT_LOGS.length) * 100);
          step++;
        } else {
          clearInterval(interval);
          setTimeout(() => setVmState('login'), 800);
        }
      }, 300);
      return () => clearInterval(interval);
    } else if (vmState === 'login') {
      // Auto login animation for preview
      timeout = setTimeout(() => {
        if (vmState === 'login') {
          setPassword("********");
          setTimeout(() => {
             setVmState('desktop');
          }, 400);
        }
      }, 1500);
    }
    return () => clearTimeout(timeout);
  }, [vmState]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      vmRef.current?.requestFullscreen().catch(() => {
         setIsFullscreen(true); // CSS fallback
      });
    } else {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    const handleFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const toggleMenu = (menu: string) => {
     setActiveMenu(activeMenu === menu ? null : menu);
  };

  return (
    <div className={`min-h-screen bg-[#0E1117] flex flex-col font-sans ${isFullscreen ? 'fixed inset-0 z-50' : 'p-4'} text-white`} onClick={closeMenus}>
      
      {toast && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-black/80 text-white px-4 py-2 rounded shadow-lg z-[999999] animate-in fade-in slide-in-from-bottom-5 toast border border-white/10 text-sm">
          {toast}
        </div>
      )}
      {!isFullscreen && (
        <div className="max-w-7xl w-full mx-auto mb-4 mt-2">
          <div className="flex flex-wrap gap-3">
            <button onClick={handleStart} disabled={vmState !== 'poweredOff'} className="flex items-center gap-1.5 bg-[#238636] hover:bg-[#2EA043] disabled:opacity-50 text-white px-3 py-1.5 rounded text-sm font-medium transition-colors">
              <Play size={16} /> Start VM
            </button>
            <button onClick={handleRestart} disabled={vmState === 'poweredOff'} className="flex items-center gap-1.5 bg-[#1F6FEB] hover:bg-[#388BFD] disabled:opacity-50 text-white px-3 py-1.5 rounded text-sm font-medium transition-colors">
              <RotateCcw size={16} /> Restart
            </button>
            <button onClick={handleShutdown} disabled={vmState === 'poweredOff'} className="flex items-center gap-1.5 bg-[#DA3633] hover:bg-[#F85149] disabled:opacity-50 text-white px-3 py-1.5 rounded text-sm font-medium transition-colors">
              <Square size={16} /> Shutdown
            </button>
            
            <div className="flex-grow"></div>
            
            <button onClick={toggleFullscreen} className="flex items-center gap-1.5 bg-[#21262D] hover:bg-[#30363D] text-[#C9D1D9] border border-[#30363D] rounded px-3 py-1.5 text-sm transition-colors">
              <Maximize size={16} /> Fullscreen
            </button>
          </div>
        </div>
      )}

      <div 
        ref={vmRef}
        className={`bg-[#F0F0F0] border border-[#30363D] shadow-2xl flex flex-col overflow-hidden mx-auto transition-all duration-300 relative ${
          isFullscreen ? 'w-full h-full rounded-none border-0' : 'w-full max-w-7xl aspect-video rounded-lg'
        }`}
      >
        <div className="bg-[#E5E5E5] border-b border-[#D4D4D4] px-4 py-1.5 flex items-center justify-between text-black select-none">
          <div className="flex items-center gap-3">
            <Box size={16} className="text-blue-600" />
            <span className="text-xs font-semibold tracking-wide flex items-center gap-2">
              AstraKernel OS [Running] - Oracle VM VirtualBox
            </span>
          </div>
          <div className="flex gap-2">
            <button className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E] hover:bg-red-400 p-0" onClick={(e) => { e.stopPropagation(); handleShutdown(); }}></button>
            <button className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123] hover:bg-yellow-400 p-0" onClick={(e) => { e.stopPropagation(); showToast("VM minimized"); }}></button>
            <button className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29] hover:bg-green-400 p-0" onClick={(e) => { e.stopPropagation(); toggleFullscreen(); }}></button>
          </div>
        </div>

        <div className="bg-[#F0F0F0] border-b border-[#D4D4D4] px-2 py-1 flex items-center gap-4 text-xs text-black relative select-none">
          {['Machine', 'View', 'Input', 'Devices', 'Help'].map(m => (
             <div key={m} className="relative">
               <button className={`px-2 py-0.5 rounded cursor-default vbox-menu-item ${activeMenu === m ? 'bg-blue-500 text-white' : 'hover:bg-[#D4D4D4]'}`} onClick={(e) => { e.stopPropagation(); setActivePopup(null); toggleMenu(m); }}>
                  {m}
               </button>
                 {activeMenu === m && (
                   <div className="absolute top-full left-0 mt-1 min-w-[200px] bg-white border border-gray-300 shadow-xl rounded py-1 z-[99999] text-black vbox-dropdown text-left shadow-lg" onClick={e => e.stopPropagation()}>
                      {m === 'Machine' && <>
                        <button className="w-full text-left px-4 py-1.5 hover:bg-blue-500 hover:text-white block" onClick={() => { handleStart(); closeMenus(); }}>Start</button>
                        <button className="w-full text-left px-4 py-1.5 hover:bg-blue-500 hover:text-white block" onClick={() => { handleRestart(); closeMenus(); }}>Restart</button>
                        <button className="w-full text-left px-4 py-1.5 hover:bg-blue-500 hover:text-white block" onClick={() => { handleShutdown(); closeMenus(); }}>Shutdown</button>
                        <div className="h-px bg-gray-200 my-1"></div>
                        <button className="w-full text-left px-4 py-1.5 hover:bg-blue-500 hover:text-white block" onClick={() => { handleShutdown(); closeMenus(); }}>Close</button>
                      </>}
                      {m === 'View' && <>
                        <button className="w-full text-left px-4 py-1.5 hover:bg-blue-500 hover:text-white block" onClick={() => { toggleFullscreen(); closeMenus(); }}>Fullscreen</button>
                        <button className="w-full text-left px-4 py-1.5 hover:bg-blue-500 hover:text-white block" onClick={() => { showToast("Scale Mode enabled"); closeMenus(); }}>Scale Mode</button>
                        <button className="w-full text-left px-4 py-1.5 hover:bg-blue-500 hover:text-white block" onClick={() => { showToast("Zoom reset"); closeMenus(); }}>Reset Zoom</button>
                      </>}
                      {m === 'Input' && <>
                        <button className="w-full text-left px-4 py-1.5 hover:bg-blue-500 hover:text-white block" onClick={() => { showToast("Keyboard captured"); closeMenus(); }}>Keyboard</button>
                        <button className="w-full text-left px-4 py-1.5 hover:bg-blue-500 hover:text-white block" onClick={() => { showToast("Mouse integration enabled"); closeMenus(); }}>Mouse Integration</button>
                        <button className="w-full text-left px-4 py-1.5 hover:bg-blue-500 hover:text-white block" onClick={() => { showToast("Input captured"); closeMenus(); }}>Capture Input</button>
                      </>}
                      {m === 'Devices' && <>
                        <button className="w-full text-left px-4 py-1.5 hover:bg-blue-500 hover:text-white block" onClick={() => { showToast("AstraKernelOS.iso mounted"); closeMenus(); }}>Optical Drives</button>
                        <button className="w-full text-left px-4 py-1.5 hover:bg-blue-500 hover:text-white block" onClick={() => { closeMenus(); setActivePopup('network'); }}>Network</button>
                        <button className="w-full text-left px-4 py-1.5 hover:bg-blue-500 hover:text-white block" onClick={() => { showToast("No USB device attached"); closeMenus(); }}>USB</button>
                        <button className="w-full text-left px-4 py-1.5 hover:bg-blue-500 hover:text-white block" onClick={() => { showToast("Shared clipboard enabled"); closeMenus(); }}>Shared Clipboard</button>
                      </>}
                      {m === 'Help' && <>
                        <button className="w-full text-left px-4 py-1.5 hover:bg-blue-500 hover:text-white block" onClick={() => { showToast("VirtualBox Preview Mode"); closeMenus(); }}>About VirtualBox Preview</button>
                        <button className="w-full text-left px-4 py-1.5 hover:bg-blue-500 hover:text-white block" onClick={() => { showToast("AstraKernel OS v0.1"); closeMenus(); }}>About AstraKernel OS</button>
                      </>}
                   </div>
                 )}
             </div>
          ))}
        </div>

        <div className="flex-1 overflow-hidden relative bg-black text-white selection:bg-cyan-500/30">
          <VmScreen 
            state={vmState} 
            bootLogs={logs} 
            bootProgress={bootProgress}
            password={password}
            setPassword={setPassword}
            onLogin={() => setVmState('desktop')}
            handleShutdown={handleShutdown}
            handleRestart={handleRestart}
            toggleFullscreen={toggleFullscreen}
            activePopup={activePopup}
            setActivePopup={setActivePopup}
            activeMenu={activeMenu}
            setActiveMenu={setActiveMenu}
            closeMenus={closeMenus}
            showToast={showToast}
          />
        </div>

        <div className="bg-[#F0F0F0] border-t border-[#D4D4D4] px-3 py-1 flex justify-between items-center text-gray-600 text-[10px] select-none">
          <div className="flex items-center gap-4">
            <span className="font-semibold text-blue-600">Right Ctrl</span>
          </div>
          <div className="flex items-center gap-3">
            {vmState !== 'poweredOff' && <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse mr-2"></div>}
            <HardDrive size={14} className={vmState === 'booting' || vmState === 'desktop' ? 'text-green-600' : ''} />
            <span className="text-gray-400">|</span>
            <Video size={14} />
            <span className="text-gray-400">|</span>
            <Network size={14} className={(vmState === 'desktop' || vmState === 'login') ? "text-green-600" : ""} />
            <span className="text-gray-400">|</span>
            <Usb size={14} />
            <span className="text-gray-400">|</span>
            <Folder size={14} />
            <span className="text-gray-400">|</span>
            <Volume2 size={14} />
          </div>
        </div>
      </div>
    </div>
  );
}

function VmScreen({ state, bootLogs, bootProgress, password, setPassword, onLogin, handleShutdown, handleRestart, toggleFullscreen, activePopup, setActivePopup, activeMenu, setActiveMenu, closeMenus, showToast }: any) {
  if (state === 'poweredOff') {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-black">
        <Monitor size={64} className="text-[#30363D]" />
        <p className="text-[#8B949E] mt-4 font-mono text-sm">Powered Off</p>
      </div>
    );
  }

  if (state === 'shutdown') {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-black">
        <Hexagon size={64} className="text-cyan-400/50 animate-pulse" />
        <p className="text-[#8B949E] mt-4 font-mono text-sm">Shutting down system...</p>
      </div>
    );
  }

  if (state === 'grub') {
    return (
      <div className="w-full h-full bg-black text-[#A5D6FF] font-mono p-8 text-sm sm:text-base border-[12px] border-blue-900/30">
        <div className="border-2 border-[#A5D6FF]/50 mx-auto mt-10 max-w-2xl bg-black">
          <div className="bg-blue-900 text-white text-center font-bold py-1">GNU GRUB version 2.06</div>
          <div className="p-4 space-y-1">
            <div className="bg-white text-black px-2 py-0.5 shadow-sm">*AstraKernel OS</div>
            <div className="px-2 py-0.5 text-gray-400"> Advanced options for AstraKernel OS</div>
            <div className="px-2 py-0.5 text-gray-400"> Memory test (memtest86+)</div>
          </div>
        </div>
        <div className="max-w-2xl mx-auto mt-4 text-xs text-gray-400 leading-relaxed text-center">
          Use the &#8593; and &#8595; keys to select which entry is highlighted.<br/>
          Press enter to boot the selected OS.<br/><br/>
          <span className="text-blue-400 animate-pulse">The highlighted entry will be executed automatically in a few seconds...</span>
        </div>
      </div>
    );
  }

  if (state === 'booting') {
    return (
      <div className="w-full h-full bg-[#050B14] flex flex-col relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/10 to-transparent"></div>
        <div className="flex-1 flex flex-col items-center justify-center z-10 gap-8">
          <div className="relative">
            <Hexagon size={96} className="text-cyan-400 animate-pulse" />
            <div className="absolute inset-0 blur-xl bg-cyan-400/20 rounded-full"></div>
          </div>
          <div className="text-center">
            <h2 className="text-3xl font-light tracking-[0.2em] text-white">ASTRA<span className="font-bold text-cyan-400">KERNEL</span></h2>
            <p className="text-gray-400 mt-2 font-mono text-xs">Initializing system...</p>
          </div>
          <div className="w-64 mt-10 bg-gray-900 rounded-full h-1 overflow-hidden border border-gray-800">
            <div className="bg-cyan-400 h-full transition-all duration-300 ease-out shadow-[0_0_10px_rgba(34,211,238,0.8)]" style={{ width: `${bootProgress}%` }}></div>
          </div>
        </div>
        <div className="h-48 bg-black/80 font-mono text-xs text-gray-300 p-4 flex flex-col justify-end relative z-10 border-t border-gray-800">
          {bootLogs.map((log: string, i: number) => (
             <div key={i} className="flex gap-3 pb-1"><span className="text-green-500">[  OK  ]</span><span>{log}</span></div>
          ))}
          {bootProgress < 100 && (
             <div className="animate-pulse mt-1 text-cyan-500 flex gap-3"><span className="text-yellow-500">[ WAIT ]</span><span>Loading module..._</span></div>
          )}
        </div>
      </div>
    );
  }

  if (state === 'login') {
    return (
      <div className="w-full h-full relative flex flex-col items-center justify-center animate-in fade-in duration-700 bg-cover bg-center" style={{ backgroundImage: 'linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.6)), url("https://images.unsplash.com/photo-1542224566-6e85f2e6772f?q=80&w=2000&auto=format&fit=crop")' }}>
        <div className="p-10 rounded-2xl flex flex-col items-center shadow-2xl w-[340px] bg-black/40 backdrop-blur-xl border border-white/10 animate-in zoom-in duration-500">
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 mb-6 flex items-center justify-center shadow-lg border-4 border-white/10">
            <User size={48} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-1">astra</h2>
          <p className="text-gray-300 text-sm mb-6">AstraKernel OS</p>
          <div className="w-full relative">
            <input 
              type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && onLogin()}
              className="w-full bg-black/40 border border-white/20 text-white rounded-lg px-4 py-3 outline-none focus:border-cyan-400 focus:bg-black/60 transition-all shadow-inner backdrop-blur-md"
              autoFocus
            />
            <button onClick={onLogin} className="absolute right-2 top-2 bottom-2 bg-cyan-500 hover:bg-cyan-400 text-white rounded-md w-10 flex items-center justify-center transition-colors">
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
      <DesktopEnvironment 
         onShutdown={handleShutdown} 
         onRestart={handleRestart} 
         onToggleFullscreen={toggleFullscreen} 
         activePopup={activePopup}
         setActivePopup={setActivePopup}
         activeMenu={activeMenu}
         setActiveMenu={setActiveMenu}
         closeMenus={closeMenus}
         showToast={showToast}
      />
  );
}

function Clock({ onClick }: { onClick: () => void }) {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);
  const formatted = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const date = time.toLocaleDateString([], { month: 'short', day: 'numeric' });
  return <button onClick={(e) => { e.stopPropagation(); onClick(); }} className="font-semibold text-xs tracking-wide hover:text-gray-300 panel-menu-item">{date}  {formatted}</button>;
}

function DesktopEnvironment({ onShutdown, onRestart, onToggleFullscreen, activePopup, setActivePopup, activeMenu, setActiveMenu, closeMenus, showToast }: any) {
  const [windows, setWindows] = useState<Record<WindowId, WindowState>>(() => {
     // Start with only Welcome window opened
     const startWindows = { ...INITIAL_WINDOWS };
     startWindows.welcome.open = true;
     return startWindows;
  });
  const [maxZ, setMaxZ] = useState(20);
  const [launcherOpen, setLauncherOpen] = useState(false);

  const togglePopup = (popup: string) => {
    setActivePopup(activePopup === popup ? null : popup);
  };

  const desktopRef = useRef<HTMLDivElement>(null);
  const dragState = useRef<{ id: WindowId | null, startX: number, startY: number, winX: number, winY: number }>({ id: null, startX: 0, startY: 0, winX: 0, winY: 0 });

  const openApp = (id: string) => {
    closeMenus();
    const winId = id as WindowId;
    if (!windows[winId]) return;
    setWindows(prev => {
      const win = prev[winId];
      return { 
         ...prev, 
         [winId]: { ...win, open: true, minimized: false, z: maxZ + 1 } 
      };
    });
    setMaxZ(z => z + 1);
  };

  const closeWindow = (id: WindowId) => {
    setWindows(prev => ({ ...prev, [id]: { ...prev[id], open: false } }));
  };

  const minimizeWindow = (id: WindowId) => {
    setWindows(prev => ({ ...prev, [id]: { ...prev[id], minimized: true } }));
  };

  const maximizeWindow = (id: WindowId) => {
    setWindows(prev => ({ ...prev, [id]: { ...prev[id], maximized: !prev[id].maximized, z: maxZ + 1 } }));
    setMaxZ(z => z + 1);
  };

  const focusWindow = (id: WindowId) => {
    setWindows(prev => {
      if (prev[id].z === maxZ) return prev;
      return { ...prev, [id]: { ...prev[id], minimized: false, z: maxZ + 1 } };
    });
    setMaxZ(z => z + 1);
  };

  const startDrag = (id: WindowId, e: React.PointerEvent) => {
     // Ignore drag if clicking window controls
     if ((e.target as HTMLElement).closest('.window-ctrl')) return;
     if (windows[id].maximized) return; // Can't drag maximized
     
     focusWindow(id);
     dragState.current = {
        id,
        startX: e.clientX,
        startY: e.clientY,
        winX: windows[id].x,
        winY: windows[id].y
     };
     document.addEventListener('pointermove', onDrag);
     document.addEventListener('pointerup', stopDrag);
  };

  const onDrag = (e: PointerEvent) => {
     const { id, startX, startY, winX, winY } = dragState.current;
     if (!id) return;
     
     let newX = winX + (e.clientX - startX);
     let newY = winY + (e.clientY - startY);
     
     // Clamp inside VM viewport approximation
     if (newY < 0) newY = 0;
     if (newY > window.innerHeight - 100) newY = window.innerHeight - 100;
     
     setWindows(prev => ({ ...prev, [id]: { ...prev[id], x: newX, y: newY } }));
  };

  const stopDrag = () => {
     dragState.current.id = null;
     document.removeEventListener('pointermove', onDrag);
     document.removeEventListener('pointerup', stopDrag);
  };

  return (
    <div 
      className="w-full h-full relative flex flex-col overflow-hidden text-sm animate-in fade-in duration-500 bg-cover bg-center"
      style={{ backgroundImage: 'linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.6)), url("https://images.unsplash.com/photo-1542224566-6e85f2e6772f?q=80&w=2000&auto=format&fit=crop")' }}
      onClick={closeMenus}
      ref={desktopRef}
    >
      <div className="absolute top-8 left-1/2 -translate-x-1/2 bg-yellow-500/90 text-black text-[10px] font-bold px-4 py-1.5 rounded-b-md shadow-lg z-[0] flex flex-col items-center pointer-events-none border border-yellow-400">
         <span className="uppercase tracking-widest block">Visual Demo Mode</span>
         <span className="text-[8px] opacity-80 mt-0.5 normal-case font-medium">Real ISO builder available separately</span>
      </div>

      <div className="h-7 bg-black/40 backdrop-blur-md border-b border-white/10 flex items-center justify-between px-3 text-white text-xs select-none shadow-sm z-[99999] sticky top-0" onClick={e => e.stopPropagation()}>
        <div className="flex-1 flex items-center gap-4 relative">
          <button className={`flex items-center gap-1.5 font-bold hover:text-cyan-400 cursor-pointer transition-colors panel-menu-item ${activePopup === 'applications' ? 'text-cyan-400' : ''}`} onClick={(e) => { e.stopPropagation(); togglePopup('applications'); }}>
            <Hexagon size={14} className="text-cyan-400" /> Applications
          </button>
          
          <span className="w-px h-3 bg-white/30 hidden sm:block"></span>
          
          <div className="relative">
             <button className="hidden sm:block hover:text-gray-300 cursor-pointer panel-menu-item" onClick={(e) => { e.stopPropagation(); togglePopup('places'); }}>Places</button>
             {activePopup === 'places' && (
                <div className="absolute top-full left-0 mt-1 min-w-[200px] bg-black/90 backdrop-blur-xl border border-white/10 rounded-b-xl shadow-2xl z-[99999] p-2 animate-in slide-in-from-top-2 duration-200 panel-dropdown text-left text-white" onClick={e => e.stopPropagation()}>
                   <button className="w-full text-left p-2 hover:bg-white/10 rounded cursor-pointer block" onClick={() => openApp('files')}>Home</button>
                   <button className="w-full text-left p-2 hover:bg-white/10 rounded cursor-pointer block" onClick={() => openApp('files')}>Desktop</button>
                   <button className="w-full text-left p-2 hover:bg-white/10 rounded cursor-pointer block" onClick={() => openApp('files')}>Documents</button>
                   <button className="w-full text-left p-2 hover:bg-white/10 rounded cursor-pointer block" onClick={() => openApp('files')}>Downloads</button>
                   <div className="h-px bg-white/10 my-1"></div>
                   <button className="w-full text-left p-2 hover:bg-white/10 rounded cursor-pointer block text-gray-300" onClick={() => { closeMenus(); showToast("Showing Computer system wrapper"); }}>Computer</button>
                </div>
             )}
          </div>
          
          <button className="hidden sm:block hover:text-gray-300 cursor-pointer panel-menu-item" onClick={(e) => { e.stopPropagation(); openApp('terminal'); }}>Terminal</button>
        </div>
        
        <div className="flex-1 flex justify-center items-center">
          <Clock onClick={() => togglePopup('calendar')} />
          {activePopup === 'calendar' && (
             <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-[280px] bg-black/90 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl z-[99999] p-4 animate-in slide-in-from-top-2 duration-200 calendar-popup text-center" onClick={e => e.stopPropagation()}>
                <div className="text-lg font-bold text-white mb-2">{new Date().toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}</div>
                <div className="text-cyan-400 font-medium mb-4">{new Date().toLocaleTimeString()}</div>
                <div className="bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-gray-300 text-left">
                   <div className="font-bold text-white flex items-center gap-2 mb-1"><Hexagon size={14} className="text-cyan-400"/> AstraKernel OS v0.1</div>
                   <div>Visual Demo Preview</div>
                </div>
             </div>
          )}
        </div>
        
        <div className="flex-1 flex items-center justify-end gap-3.5 relative">
          <button className="cursor-pointer hover:text-cyan-400 panel-menu-item" onClick={(e) => { e.stopPropagation(); togglePopup('network'); }}><Wifi size={14} /></button>
          {activePopup === 'network' && (
             <div className="absolute top-full right-24 mt-1 w-64 bg-black/90 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl z-[99999] p-4 animate-in slide-in-from-top-2 duration-200 status-popup text-left text-white" onClick={e => e.stopPropagation()}>
               <div className="font-bold text-white flex items-center gap-2 mb-3 border-b border-gray-700 pb-2"><Wifi size={16} className="text-blue-400" /> Network Status</div>
               <div className="text-sm mb-1"><span className="text-gray-400">Status:</span> Connected</div>
               <div className="text-sm mb-1"><span className="text-gray-400">SSID:</span> AstraNet</div>
               <div className="text-sm mb-1"><span className="text-gray-400">IP:</span> 192.168.56.101</div>
               <div className="text-sm text-green-400 mt-2 font-mono">Speed: 1.9 MB/s</div>
             </div>
          )}
          
          <button className="cursor-pointer hover:text-cyan-400 panel-menu-item" onClick={(e) => { e.stopPropagation(); togglePopup('volume'); }}><Volume2 size={14} /></button>
          {activePopup === 'volume' && (
             <div className="absolute top-full right-16 mt-1 w-64 bg-black/90 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl z-[99999] p-4 animate-in slide-in-from-top-2 duration-200 status-popup text-left text-white" onClick={e => e.stopPropagation()}>
               <div className="font-bold text-white flex items-center gap-2 mb-3"><Volume2 size={16} className="text-cyan-400" /> Output Volume</div>
               <input type="range" className="w-full accent-cyan-500" defaultValue={75} />
               <div className="flex justify-between mt-2 text-xs text-gray-400">
                 <span>0%</span>
                 <span>75%</span>
                 <span>100%</span>
               </div>
               <button className="w-full mt-3 py-1.5 bg-white/10 hover:bg-white/20 rounded text-sm text-center">Mute</button>
             </div>
          )}

          <button className="cursor-pointer hover:text-cyan-400 panel-menu-item" onClick={(e) => { e.stopPropagation(); togglePopup('battery'); }}><Battery size={14} /></button>
          {activePopup === 'battery' && (
             <div className="absolute top-full right-10 mt-1 w-64 bg-black/90 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl z-[99999] p-4 animate-in slide-in-from-top-2 duration-200 status-popup text-left text-white" onClick={e => e.stopPropagation()}>
               <div className="font-bold text-white flex items-center gap-2 mb-3 border-b border-gray-700 pb-2"><Battery size={16} className="text-green-400" /> System Power</div>
               <div className="text-sm mb-1"><span className="text-gray-400">Battery:</span> 87%</div>
               <div className="text-sm mb-1"><span className="text-gray-400">Display:</span> 1920x1080</div>
               <div className="text-sm mt-3"><span className="text-gray-400">Power Mode:</span> Balanced</div>
             </div>
          )}

          <span className="w-px h-3 bg-white/30"></span>
          
          <button className="cursor-pointer hover:text-gray-300 panel-menu-item" onClick={(e) => { e.stopPropagation(); openApp('settings'); }}><Settings size={14} /></button>
          
          <button className="cursor-pointer hover:text-red-400 panel-menu-item" onClick={(e) => { e.stopPropagation(); togglePopup('power'); }}><Power size={14} /></button>
          {activePopup === 'power' && (
             <div className="absolute top-full right-0 mt-1 w-48 bg-black/90 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl z-[99999] p-2 animate-in slide-in-from-top-2 duration-200 status-popup text-left text-white" onClick={e => e.stopPropagation()}>
               <button className="w-full text-left p-2 hover:bg-white/10 rounded cursor-pointer flex items-center gap-3" onClick={() => { closeMenus(); showToast("Locked"); }}><User size={16} /> Lock</button>
               <button className="w-full text-left p-2 hover:bg-red-500/20 text-red-300 rounded cursor-pointer flex items-center gap-3" onClick={() => { closeMenus(); onRestart(); }}><RotateCcw size={16}/> Restart</button>
               <button className="w-full text-left p-2 hover:bg-red-500/20 text-red-300 rounded cursor-pointer flex items-center gap-3" onClick={() => { closeMenus(); onShutdown(); }}><Power size={16}/> Shutdown</button>
             </div>
          )}
        </div>
      </div>

      {activePopup === 'applications' && (
        <div className="absolute top-7 left-3 w-64 bg-black/80 backdrop-blur-xl border border-white/10 rounded-b-xl shadow-2xl z-[99999] p-2 animate-in slide-in-from-top-2 duration-200 panel-dropdown text-white" onClick={e => e.stopPropagation()}>
           <button className="w-full text-left p-2 hover:bg-white/10 rounded cursor-pointer flex items-center gap-3" onClick={() => openApp('browser')}><Compass size={16} className="text-blue-300"/> Browser</button>
           <button className="w-full text-left p-2 hover:bg-white/10 rounded cursor-pointer flex items-center gap-3" onClick={() => openApp('files')}><FolderOpen size={16} className="text-blue-400"/> Files</button>
           <button className="w-full text-left p-2 hover:bg-white/10 rounded cursor-pointer flex items-center gap-3" onClick={() => openApp('terminal')}><TerminalIcon size={16} className="text-green-400"/> Terminal</button>
           <button className="w-full text-left p-2 hover:bg-white/10 rounded cursor-pointer flex items-center gap-3" onClick={() => openApp('code')}><Code2 size={16} className="text-blue-400"/> Code Editor</button>
           <button className="w-full text-left p-2 hover:bg-white/10 rounded cursor-pointer flex items-center gap-3" onClick={() => openApp('settings')}><Settings size={16} className="text-gray-400"/> Settings</button>
           <button className="w-full text-left p-2 hover:bg-white/10 rounded cursor-pointer flex items-center gap-3" onClick={() => openApp('docs')}><AlignLeft size={16} className="text-purple-400"/> Documentation</button>
           <button className="w-full text-left p-2 hover:bg-white/10 rounded cursor-pointer flex items-center gap-3" onClick={() => openApp('installer')}><CheckSquare size={16} className="text-green-400"/> Installer</button>
           <button className="w-full text-left p-2 hover:bg-white/10 rounded cursor-pointer flex items-center gap-3" onClick={() => openApp('monitor')}><Cpu size={16} className="text-cyan-400"/> System Monitor</button>
           <button className="w-full text-left p-2 hover:bg-white/10 rounded cursor-pointer flex items-center gap-3" onClick={() => openApp('welcome')}><Hexagon size={16} className="text-cyan-400"/> Astra Welcome</button>
           <div className="h-px bg-white/10 my-1"></div>
           <button className="w-full text-left p-2 hover:bg-red-500/20 text-red-300 rounded cursor-pointer flex items-center gap-3" onClick={() => { closeMenus(); onShutdown(); }}><Power size={16}/> Shutdown</button>
        </div>
      )}

      {/* Desktop Icons */}
      <div className="flex flex-col gap-6 pt-8 pl-6 items-center z-10 w-24">
         <DesktopIcon icon={<FolderOpen size={40} className="text-blue-400 fill-blue-500/20 drop-shadow-lg" />} label="Home" onClick={() => openApp('files')} />
         <DesktopIcon icon={<TerminalIcon size={40} className="text-green-400 drop-shadow-lg" />} label="Terminal" onClick={() => openApp('terminal')} />
         <DesktopIcon icon={<Compass size={40} className="text-gray-100 drop-shadow-lg" />} label="Browser" onClick={() => openApp('browser')} />
         <DesktopIcon icon={<AlignLeft size={40} className="text-purple-400 drop-shadow-lg" />} label="README" onClick={() => openApp('docs')} />
         <DesktopIcon icon={<Cpu size={40} className="text-cyan-400 drop-shadow-lg" />} label="System" onClick={() => openApp('monitor')} />
         <DesktopIcon icon={<CheckSquare size={40} className="text-green-500 drop-shadow-lg" />} label="Install" onClick={() => openApp('installer')} />
      </div>

      {/* Windows Layer */}
      <div className="absolute inset-0 z-20 pointer-events-none">
         <WindowFrame id="welcome" title="Welcome to AstraKernel" icon={<Hexagon size={14}/>} winState={windows.welcome} onClose={closeWindow} onMinimize={minimizeWindow} onMaximize={maximizeWindow} onFocus={focusWindow} onPointerDown={startDrag}>
            <WelcomeApp openApp={openApp} />
         </WindowFrame>
         
         <WindowFrame id="terminal" title="astra@astrakernel: ~" icon={<TerminalIcon size={14}/>} winState={windows.terminal} onClose={closeWindow} onMinimize={minimizeWindow} onMaximize={maximizeWindow} onFocus={focusWindow} onPointerDown={startDrag}>
            <TerminalApp openApp={openApp} />
         </WindowFrame>
         
         <WindowFrame id="browser" title="Astra Browser" icon={<Compass size={14}/>} winState={windows.browser} onClose={closeWindow} onMinimize={minimizeWindow} onMaximize={maximizeWindow} onFocus={focusWindow} onPointerDown={startDrag}>
            <BrowserApp />
         </WindowFrame>
         
         <WindowFrame id="files" title="Home - Files" icon={<FolderOpen size={14}/>} winState={windows.files} onClose={closeWindow} onMinimize={minimizeWindow} onMaximize={maximizeWindow} onFocus={focusWindow} onPointerDown={startDrag}>
            <FilesApp />
         </WindowFrame>
         
         <WindowFrame id="settings" title="Astra Control Center" icon={<Settings size={14}/>} winState={windows.settings} onClose={closeWindow} onMinimize={minimizeWindow} onMaximize={maximizeWindow} onFocus={focusWindow} onPointerDown={startDrag}>
            <SettingsApp />
         </WindowFrame>
         
         <WindowFrame id="docs" title="Documentation - AstraKernel" icon={<AlignLeft size={14}/>} winState={windows.docs} onClose={closeWindow} onMinimize={minimizeWindow} onMaximize={maximizeWindow} onFocus={focusWindow} onPointerDown={startDrag}>
            <DocsApp />
         </WindowFrame>

         <WindowFrame id="monitor" title="System Monitor" icon={<Cpu size={14}/>} winState={windows.monitor} onClose={closeWindow} onMinimize={minimizeWindow} onMaximize={maximizeWindow} onFocus={focusWindow} onPointerDown={startDrag}>
            <SystemMonitorApp />
         </WindowFrame>

         <WindowFrame id="code" title="Astra Code Editor" icon={<Code2 size={14}/>} winState={windows.code} onClose={closeWindow} onMinimize={minimizeWindow} onMaximize={maximizeWindow} onFocus={focusWindow} onPointerDown={startDrag}>
            <div className="flex items-center justify-center h-full bg-[#1e1e2e] text-gray-400 font-mono text-xl">Editor Ready</div>
         </WindowFrame>

         <WindowFrame id="installer" title="Astra OS Installer" icon={<CheckSquare size={14}/>} winState={windows.installer} onClose={closeWindow} onMinimize={minimizeWindow} onMaximize={maximizeWindow} onFocus={focusWindow} onPointerDown={startDrag}>
            <div className="flex flex-col items-center justify-center h-full bg-[#11111b] text-gray-300 p-8 text-center">
               <CheckSquare size={48} className="text-green-500 mb-4"/>
               <h2 className="text-2xl font-bold text-white mb-2">Install AstraKernel OS</h2>
               <p className="text-sm text-gray-400 mb-6 max-w-sm">This is the visual demo. To install the operating system, you must clone the repository and run build.sh locally on your hardware.</p>
               <button className="bg-green-600 hover:bg-green-500 text-white px-6 py-2 rounded font-medium disabled:opacity-50" disabled>Start Installation</button>
            </div>
         </WindowFrame>
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[40]">
        <div className="bg-black/60 backdrop-blur-xl px-4 py-2.5 rounded-2xl flex items-center justify-center gap-4 border border-white/10 shadow-[0_15px_40px_rgba(0,0,0,0.8)] pointer-events-auto">
          <DockIcon icon={<Compass size={24} />} color="text-blue-400" bg="bg-[#1E1E2E]" name="Browser" isActive={windows.browser.open && !windows.browser.minimized} onClick={() => openApp('browser')} />
          <DockIcon icon={<FolderOpen size={24} />} color="text-white" bg="bg-blue-600" name="Files" isActive={windows.files.open && !windows.files.minimized} onClick={() => openApp('files')} />
          <DockIcon icon={<TerminalIcon size={24} />} color="text-green-400" bg="bg-gray-800" name="Terminal" isActive={windows.terminal.open && !windows.terminal.minimized} onClick={() => openApp('terminal')} />
          <DockIcon icon={<Code2 size={24} />} color="text-blue-400" bg="bg-gray-900" name="Code Editor" isActive={windows.code.open && !windows.code.minimized} onClick={() => openApp('code')} />
          <DockIcon icon={<Settings size={24} />} color="text-gray-300" bg="bg-gray-700" name="Settings" isActive={windows.settings.open && !windows.settings.minimized} onClick={() => openApp('settings')} />
          <div className="w-px h-8 bg-white/20 mx-1"></div>
          <DockIcon icon={<AlignLeft size={24} />} color="text-white" bg="bg-purple-600" name="Docs" isActive={windows.docs.open && !windows.docs.minimized} onClick={() => openApp('docs')} />
          <DockIcon icon={<CheckSquare size={24} />} color="text-white" bg="bg-green-700" name="Installer" isActive={windows.installer.open && !windows.installer.minimized} onClick={() => openApp('installer')} />
          <DockIcon icon={<Hexagon size={24} />} color="text-white" bg="bg-cyan-600" name="Astra Welcome" isActive={windows.welcome.open && !windows.welcome.minimized} onClick={() => openApp('welcome')} />
        </div>
      </div>
    </div>
  );
}

function WindowFrame({ id, title, icon, winState, onClose, onMinimize, onMaximize, onFocus, onPointerDown, children }: any) {
   if (!winState.open || winState.minimized) return null;
   
   return (
      <div 
         className={`absolute flex flex-col bg-[#1B1B26] rounded-xl shadow-[0_20px_70px_rgba(0,0,0,0.8)] border border-gray-700/60 overflow-hidden pointer-events-auto transition-all ${winState.maximized ? 'inset-0 !w-full !h-full rounded-none duration-200' : 'duration-0'}`}
         style={!winState.maximized ? { top: winState.y, left: winState.x, width: winState.w, height: winState.h, zIndex: winState.z } : { zIndex: winState.z }}
         onPointerDown={() => onFocus(id)}
      >
         <div 
            className="h-8 bg-[#2A2A3C] flex items-center justify-between px-3 select-none border-b border-white/5 title-bar cursor-grab active:cursor-grabbing"
            onPointerDown={(e) => onPointerDown(id, e)}
            onDoubleClick={() => onMaximize(id)}
         >
            <div className="flex gap-2 window-ctrl pointer-events-auto">
               <div className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E] cursor-pointer hover:bg-red-400 flex items-center justify-center p-[2px]" onClick={(e) => { e.stopPropagation(); onClose(id); }}>
                   {false && <X size={10} className="text-red-900 opacity-0 hover:opacity-100"/>}
               </div>
               <div className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123] cursor-pointer hover:bg-yellow-400" onClick={(e) => { e.stopPropagation(); onMinimize(id); }}></div>
               <div className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29] cursor-pointer hover:bg-green-400" onClick={(e) => { e.stopPropagation(); onMaximize(id); }}></div>
            </div>
            <div className="text-gray-300 font-medium text-[11px] tracking-wide flex items-center gap-2 pointer-events-none opacity-80">
               {icon} {title}
            </div>
            <div className="w-12"></div>
         </div>
         <div className="flex-1 overflow-hidden bg-[#1E1E2E] flex flex-col pointer-events-auto">
            {children}
         </div>
      </div>
   )
}

function DesktopIcon({ icon, label, onClick }: { icon: React.ReactNode, label: string, onClick?: () => void }) {
  return (
    <div className="flex flex-col items-center gap-1.5 cursor-pointer group w-20 pointer-events-auto" onDoubleClick={onClick} onClick={onClick}>
      <div className="p-2.5 rounded-xl group-hover:bg-white/10 transition-colors pointer-events-auto">
        {icon}
      </div>
      <span className="text-xs font-semibold text-white shadow-black drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] text-center line-clamp-2 leading-tight px-1 outline-none group-hover:bg-blue-600/70 rounded py-0.5">{label}</span>
    </div>
  );
}

function DockIcon({ icon, color, bg, name, isActive, onClick }: { icon: React.ReactNode, color: string, bg: string, name: string, isActive?: boolean, onClick?: () => void }) {
  return (
    <div className="relative group dock-icon cursor-pointer pointer-events-auto" onClick={onClick}>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${bg} shadow-lg border border-white/10 relative transition-transform duration-200 group-hover:scale-125 group-hover:-translate-y-3 origin-bottom pointer-events-none`}>
        <div className={color}>{icon}</div>
      </div>
      <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-black/80 text-white text-[10px] font-semibold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap border border-white/20 pointer-events-none transform translate-y-2 group-hover:translate-y-0">
        {name}
      </div>
      {(isActive !== undefined) && 
         <div className={`absolute -bottom-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full shadow-[0_0_5px_rgba(34,211,238,0.8)] pointer-events-none transition-colors ${isActive ? 'bg-cyan-400' : 'bg-transparent'}`}></div>
      }
    </div>
  );
}
