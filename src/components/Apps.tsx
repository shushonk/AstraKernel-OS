import React, { useState, useEffect, useRef } from 'react';
import { Terminal, Hexagon, Folder, FolderOpen, AlignLeft, CheckSquare, Settings, CpuIcon, Compass, ArrowLeft, ArrowRight as ArrowForward, RefreshCw, Home } from 'lucide-react';

export function TerminalApp({ openApp }: { openApp: (app: string) => void }) {
  const [history, setHistory] = useState<{type: 'cmd'|'out', text: string|React.ReactNode}[]>([
    { type: 'out', text: 'Welcome to AstraKernel OS v0.1' },
    { type: 'out', text: 'Type \'help\' to see available commands.' }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Initial typing animation
    let i = 0;
    const cmd = "astra-info";
    const interval = setInterval(() => {
      setInput(cmd.substring(0, i + 1));
      i++;
      if (i >= cmd.length) {
        clearInterval(interval);
        setTimeout(() => {
          handleCommand(cmd);
          setInput("");
          setIsTyping(false);
        }, 400);
      }
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const handleCommand = (cmd: string) => {
    const val = cmd.trim();
    if (!val) {
      setHistory(h => [...h, { type: 'cmd', text: val }]);
      return;
    }
    
    let res: React.ReactNode = '';
    if (val === 'help') res = "Available commands:\nhelp, clear, neofetch, astra-info, astra-about, ls, pwd, whoami, date, uname -a, open [app], exit";
    else if (val === 'clear') { setHistory([]); return; }
    else if (['neofetch', 'astra-info'].includes(val)) {
      res = (
        <div className="flex flex-col sm:flex-row gap-6 mt-2 mb-2 items-center sm:items-start">
          <div className="text-[#89B4FA] font-bold leading-tight whitespace-pre drop-shadow-md">
{`   \\  /
---------
| ASTRA |
---------
   /  \\`}
          </div>
          <div className="flex-1">
            <div className="text-cyan-400 font-bold border-b border-gray-600 pb-1 mb-1">astra<span className="text-green-400">@</span>astrakernel</div>
            <div><span className="text-gray-400 font-bold w-20 inline-block">OS</span>: AstraKernel OS v0.1</div>
            <div><span className="text-gray-400 font-bold w-20 inline-block">Host</span>: Visual Demo</div>
            <div><span className="text-gray-400 font-bold w-20 inline-block">Kernel</span>: 6.1.0-astra</div>
            <div><span className="text-gray-400 font-bold w-20 inline-block">Uptime</span>: 0 mins</div>
            <div><span className="text-gray-400 font-bold w-20 inline-block">Packages</span>: 1,402 (dpkg)</div>
            <div><span className="text-gray-400 font-bold w-20 inline-block">Shell</span>: bash 5.1.16</div>
            <div><span className="text-gray-400 font-bold w-20 inline-block">DE</span>: Custom (React)</div>
            <div className="flex gap-1.5 mt-3">
              <div className="w-3 h-3 rounded-sm bg-black"></div>
              <div className="w-3 h-3 rounded-sm bg-red-400"></div>
              <div className="w-3 h-3 rounded-sm bg-green-400"></div>
              <div className="w-3 h-3 rounded-sm bg-yellow-400"></div>
              <div className="w-3 h-3 rounded-sm bg-blue-400"></div>
              <div className="w-3 h-3 rounded-sm bg-purple-400"></div>
              <div className="w-3 h-3 rounded-sm bg-cyan-400"></div>
              <div className="w-3 h-3 rounded-sm bg-white"></div>
            </div>
          </div>
        </div>
      );
    }
    else if (val === 'astra-about') res = "AstraKernel OS is a custom high-performance Linux distro preview.";
    else if (val === 'ls') res = "Desktop  Documents  Downloads  README.md  settings.json";
    else if (val === 'pwd') res = "/home/astra";
    else if (val === 'whoami') res = "astra";
    else if (val.startsWith('open ')) {
      const app = val.substring(5).trim();
      const validMap: Record<string, string> = {
        'browser': 'browser', 'files': 'files', 'settings': 'settings', 'docs': 'docs', 'monitor': 'monitor', 'terminal': 'terminal', 'welcome': 'welcome'
      };
      if (validMap[app]) {
        openApp(validMap[app]);
        res = `Opening ${app}...`;
      } else {
        res = `App not found. Try: browser, files, settings, docs, monitor, welcome.`;
      }
    }
    else if (val === 'date') res = new Date().toString();
    else if (val === 'uname -a') res = "Linux astrakernel 6.1.0-astra #1 SMP PREEMPT_DYNAMIC x86_64 GNU/Linux";
    else if (val === 'exit') res = "Terminal closed. (Not actually closing in demo)";
    else res = `bash: ${val}: command not found`;

    setHistory(h => [...h, { type: 'cmd', text: val }, { type: 'out', text: res }]);
  };

  return (
    <div className="w-full h-full bg-[#11111B] text-[#CDD6F4] font-mono text-[13px] p-4 overflow-auto" onClick={() => inputRef.current?.focus()}>
      {history.map((item, i) => (
        <div key={i} className="mb-1">
          {item.type === 'cmd' ? (
            <div><span className="text-green-400 font-bold">astra@astrakernel</span><span className="text-[#CDD6F4]">:$</span> {item.text}</div>
          ) : (
            <div className="whitespace-pre-wrap">{item.text}</div>
          )}
        </div>
      ))}
      <div className="flex items-center gap-2 text-green-400 font-bold mt-2">
        astra@astrakernel<span className="text-[#CDD6F4] font-normal">:$ </span>
        <input 
          ref={inputRef}
          type="text" 
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              handleCommand(input);
              setInput('');
            }
          }}
          className="flex-1 bg-transparent border-none outline-none text-white font-normal shadow-none" 
          autoComplete="off" 
          spellCheck="false" 
          autoFocus 
        />
      </div>
    </div>
  );
}

export function BrowserApp() {
  const [url, setUrl] = useState("https://astrakernel.local");
  const [content, setContent] = useState("home");
  
  return (
    <div className="flex flex-col h-full bg-white text-black w-full">
      <div className="flex items-center gap-3 p-2 bg-gray-100 border-b border-gray-300">
        <div className="flex gap-2 text-gray-500">
          <ArrowLeft size={16} className="cursor-pointer hover:text-black" />
          <ArrowForward size={16} className="cursor-pointer hover:text-black" />
          <RefreshCw size={16} className="cursor-pointer hover:text-black" />
          <Home size={16} className="cursor-pointer hover:text-black" onClick={() => { setUrl("https://astrakernel.local"); setContent("home"); }}/>
        </div>
        <div className="flex-1 flex items-center bg-white border border-gray-300 rounded px-3 py-1 shadow-inner focus-within:border-blue-400">
          <input 
            type="text" 
            value={url}
            onChange={e => setUrl(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') setContent('other') }}
            className="flex-1 text-sm outline-none bg-transparent"
          />
        </div>
        <Settings size={16} className="text-gray-600 cursor-pointer" />
      </div>
      <div className="flex-1 p-8 overflow-auto flex justify-center">
        { content === 'home' || url === 'https://astrakernel.local' ? (
          <div className="max-w-2xl text-center mt-12 animate-in fade-in slide-in-from-bottom-4">
            <div className="w-20 h-20 bg-blue-600 mask-squircle mx-auto flex items-center justify-center mb-6 rounded-2xl shadow-xl">
              <Compass size={40} className="text-white" />
            </div>
            <h1 className="text-4xl font-bold mb-4 text-gray-800 tracking-tight">Astra Web Browser</h1>
            <p className="text-gray-500 text-lg mb-8">Welcome to the visual demo internet experience.</p>
            <div className="grid grid-cols-3 gap-6">
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 shadow-sm cursor-pointer hover:shadow-md hover:border-blue-300 transition-all">
                <Hexagon size={24} className="text-cyan-500 mx-auto mb-2" />
                <div className="font-medium text-gray-700">Astra Docs</div>
              </div>
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 shadow-sm cursor-pointer hover:shadow-md hover:border-blue-300 transition-all">
                <Terminal size={24} className="text-green-500 mx-auto mb-2" />
                <div className="font-medium text-gray-700">Web Terminal</div>
              </div>
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 shadow-sm cursor-pointer hover:shadow-md hover:border-blue-300 transition-all">
                <Settings size={24} className="text-purple-500 mx-auto mb-2" />
                <div className="font-medium text-gray-700">Settings</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center mt-20 text-gray-400 max-w-lg">
            <Compass size={48} className="mx-auto mb-4 opacity-50" />
            <h2 className="text-2xl font-semibold mb-2">Simulated Page</h2>
            <p>You navigated to <strong className="text-gray-600">{url}</strong></p>
            <p className="text-sm mt-4">In a real environment, this would render remote content. This is a visual demo boundary.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export function WelcomeApp({ openApp }: { openApp: (app: string) => void }) {
  return (
    <div className="p-8 h-full bg-gradient-to-br from-[#1E1E2E] to-[#11111B] flex flex-col justify-center">
      <div className="flex items-center gap-6 mb-8">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 transform rotate-3">
          <Hexagon size={48} className="text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Welcome</h1>
          <p className="text-cyan-400 text-sm font-mono tracking-wide mt-1">AstraKernel OS v0.1</p>
        </div>
      </div>
      
      <p className="text-gray-300 text-base mb-8 leading-relaxed max-w-sm">
        A high-performance custom Linux distribution structured for rapid development and aesthetic clarity.
      </p>

      <div className="grid grid-cols-2 gap-4">
        <button className="group flex items-center gap-3 bg-[#2A2A3C] hover:bg-[#34344A] text-white p-4 rounded-xl transition-all border border-gray-700/50 hover:border-cyan-500/30 shadow-sm" onClick={() => openApp('terminal')}>
          <div className="p-2 bg-black/30 rounded-lg group-hover:scale-110 transition-transform"><Terminal size={18} className="text-green-400" /></div>
          <span className="text-sm font-medium">Terminal</span>
        </button>
        <button className="group flex items-center gap-3 bg-[#2A2A3C] hover:bg-[#34344A] text-white p-4 rounded-xl transition-all border border-gray-700/50 hover:border-blue-500/30 shadow-sm" onClick={() => openApp('files')}>
          <div className="p-2 bg-black/30 rounded-lg group-hover:scale-110 transition-transform"><Folder size={18} className="text-blue-400" /></div>
          <span className="text-sm font-medium">Browse Files</span>
        </button>
        <button className="group flex items-center gap-3 bg-[#2A2A3C] hover:bg-[#34344A] text-white p-4 rounded-xl transition-all border border-gray-700/50 hover:border-gray-400/30 shadow-sm" onClick={() => openApp('settings')}>
          <div className="p-2 bg-black/30 rounded-lg group-hover:scale-110 transition-transform"><Settings size={18} className="text-gray-400" /></div>
          <span className="text-sm font-medium">Settings</span>
        </button>
        <button className="group flex items-center gap-3 bg-[#2A2A3C] hover:bg-[#34344A] text-white p-4 rounded-xl transition-all border border-gray-700/50 hover:border-purple-500/30 shadow-sm" onClick={() => openApp('docs')}>
          <div className="p-2 bg-black/30 rounded-lg group-hover:scale-110 transition-transform"><AlignLeft size={18} className="text-purple-400" /></div>
          <span className="text-sm font-medium">Read Docs</span>
        </button>
      </div>
    </div>
  );
}

export function FilesApp() {
  return (
    <div className="flex h-full bg-[#181825] text-gray-200">
      <div className="w-40 border-r border-gray-700/50 p-2 flex flex-col gap-1 bg-[#11111b]">
        <div className="bg-blue-600/20 text-blue-400 font-medium px-3 py-2 rounded text-sm cursor-pointer border border-blue-500/20">Home</div>
        <div className="px-3 py-2 rounded text-sm cursor-pointer hover:bg-white/5 font-medium">Desktop</div>
        <div className="px-3 py-2 rounded text-sm cursor-pointer hover:bg-white/5 font-medium">Documents</div>
        <div className="px-3 py-2 rounded text-sm cursor-pointer hover:bg-white/5 font-medium">Downloads</div>
        <div className="px-3 py-2 rounded text-sm cursor-pointer hover:bg-white/5 font-medium">Pictures</div>
        <div className="px-3 py-2 rounded text-sm cursor-pointer hover:bg-white/5 font-medium">Videos</div>
        <div className="mt-4 px-3 py-1 text-xs text-gray-500 uppercase tracking-widest font-bold">Devices</div>
        <div className="px-3 py-2 rounded text-sm cursor-pointer hover:bg-white/5 font-medium">System Drive</div>
      </div>
      <div className="flex-1 p-6 overflow-y-auto">
        <h2 className="text-lg font-bold text-white mb-6">Home</h2>
        <div className="grid grid-cols-4 sm:grid-cols-5 gap-4 text-center text-xs text-gray-300">
          <div className="flex flex-col items-center gap-2 cursor-pointer hover:bg-white/10 p-3 rounded-lg group transition-colors">
            <Folder className="text-blue-400 fill-blue-500/20 group-hover:scale-110 transition-transform" size={48}/> 
            <span className="font-medium">Desktop</span>
          </div>
          <div className="flex flex-col items-center gap-2 cursor-pointer hover:bg-white/10 p-3 rounded-lg group transition-colors">
            <Folder className="text-blue-400 fill-blue-500/20 group-hover:scale-110 transition-transform" size={48}/> 
            <span className="font-medium">Documents</span>
          </div>
          <div className="flex flex-col items-center gap-2 cursor-pointer hover:bg-white/10 p-3 rounded-lg group transition-colors">
            <Folder className="text-blue-400 fill-blue-500/20 group-hover:scale-110 transition-transform" size={48}/> 
            <span className="font-medium">Downloads</span>
          </div>
          <div className="flex flex-col items-center gap-2 cursor-pointer hover:bg-white/10 p-3 rounded-lg group transition-colors">
            <Folder className="text-blue-400 fill-blue-500/20 group-hover:scale-110 transition-transform" size={48}/> 
            <span className="font-medium">Pictures</span>
          </div>
          <div className="flex flex-col items-center gap-2 cursor-pointer hover:bg-white/10 p-3 rounded-lg group transition-colors">
            <Folder className="text-blue-400 fill-blue-500/20 group-hover:scale-110 transition-transform" size={48}/> 
            <span className="font-medium">Videos</span>
          </div>
          <div className="flex flex-col items-center gap-2 cursor-pointer hover:bg-white/10 p-3 rounded-lg group transition-colors">
            <Folder className="text-blue-400 fill-blue-500/20 group-hover:scale-110 transition-transform" size={48}/> 
            <span className="font-medium">Projects</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export function SettingsApp() {
  const [activeTab, setActiveTab] = useState('appearance');
  const [theme, setTheme] = useState('dark');
  const [accentColor, setAccentColor] = useState('cyan');

  return (
    <div className="flex h-full bg-[#11111B] text-gray-200 select-none">
      <div className="w-1/3 border-r border-gray-700/50 p-3 flex flex-col gap-1.5 bg-[#181825]">
        <button onClick={() => setActiveTab('appearance')} className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === 'appearance' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 shadow-sm' : 'hover:bg-white/5 text-gray-300 cursor-pointer'}`}>Appearance</button>
        <button onClick={() => setActiveTab('system')} className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === 'system' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 shadow-sm' : 'hover:bg-white/5 text-gray-300 cursor-pointer'}`}>System Info</button>
        <button onClick={() => setActiveTab('users')} className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === 'users' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 shadow-sm' : 'hover:bg-white/5 text-gray-300 cursor-pointer'}`}>Users</button>
        <button onClick={() => setActiveTab('network')} className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === 'network' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 shadow-sm' : 'hover:bg-white/5 text-gray-300 cursor-pointer'}`}>Network</button>
      </div>
      <div className="w-2/3 p-8 overflow-y-auto">
        {activeTab === 'appearance' && (
          <div className="animate-in fade-in">
            <h3 className="text-2xl font-bold mb-2 text-white tracking-tight">Appearance</h3>
            <p className="text-sm text-gray-400 mb-8 border-b border-gray-800 pb-6">Choose your system theme and accent colors for AstraKernel OS.</p>
            
            <h4 className="text-sm font-bold text-gray-300 mb-4 uppercase tracking-widest">Theme Mode</h4>
            <div className="flex gap-6 mb-10">
              <div 
                className={`w-32 h-24 rounded-xl border-2 flex items-center justify-center text-xs shadow-lg cursor-pointer flex-col gap-3 relative transition-transform hover:-translate-y-1 ${theme === 'dark' ? 'bg-[#1e1e2e] border-cyan-500 text-white shadow-cyan-500/10' : 'bg-[#1e1e2e] border-gray-700 text-gray-400'}`}
                onClick={() => setTheme('dark')}
              >
                  {theme === 'dark' && <span className="w-5 h-5 rounded-full bg-cyan-500 absolute top-2 right-2 flex items-center justify-center shadow-sm"><CheckSquare size={12} className="text-black"/></span>}
                  <div className="w-16 h-10 bg-[#11111b] rounded-md border border-gray-700"></div> 
                  <span className="font-semibold text-cyan-400">Dark Theme</span>
              </div>
              <div 
                className={`w-32 h-24 rounded-xl border-2 flex items-center justify-center text-xs shadow-lg cursor-pointer flex-col gap-3 relative transition-transform hover:-translate-y-1 ${theme === 'light' ? 'bg-gray-100 border-cyan-500 text-black shadow-cyan-500/10' : 'bg-gray-100 border-transparent hover:border-gray-300 text-black opacity-50'}`}
                onClick={() => setTheme('light')}
              >
                  {theme === 'light' && <span className="w-5 h-5 rounded-full bg-cyan-500 absolute top-2 right-2 flex items-center justify-center shadow-sm"><CheckSquare size={12} className="text-black"/></span>}
                  <div className="w-16 h-10 bg-white rounded-md border border-gray-300 shadow-sm"></div> 
                  <span className="font-semibold">Light Theme</span>
              </div>
            </div>

            <h4 className="text-sm font-bold text-gray-300 mb-4 uppercase tracking-widest">Accent Color</h4>
            <div className="flex gap-4">
              {['cyan', 'blue', 'purple', 'green', 'red'].map(color => (
                <div 
                  key={color}
                  onClick={() => setAccentColor(color)}
                  className={`w-8 h-8 rounded-full bg-${color}-500 ring-offset-[#11111B] cursor-pointer ${accentColor === color ? `ring-2 ring-${color}-500 ring-offset-2 shadow-lg shadow-${color}-500/20` : `hover:ring-2 ring-${color}-500 ring-offset-2`}`}
                ></div>
              ))}
            </div>
          </div>
        )}
        
        {activeTab === 'system' && (
          <div className="animate-in fade-in">
            <h3 className="text-2xl font-bold mb-2 text-white tracking-tight">System Info</h3>
            <p className="text-sm text-gray-400 mb-8 border-b border-gray-800 pb-6">Hardware and software specifications.</p>
            <div className="space-y-4 text-sm mt-4 bg-white/5 p-6 rounded-xl border border-white/10">
               <div className="flex items-center gap-4 mb-4 pb-4 border-b border-white/5">
                 <div className="w-16 h-16 bg-blue-500/20 rounded-xl flex items-center justify-center">
                   <Hexagon className="text-blue-400" size={32} />
                 </div>
                 <div>
                   <div className="text-lg font-bold text-white">AstraKernel OS (Demo)</div>
                   <div className="text-gray-400">Version 0.1</div>
                 </div>
               </div>
               <div><span className="text-gray-500 w-32 inline-block">OS Type:</span> 64-bit</div>
               <div><span className="text-gray-500 w-32 inline-block">Kernel:</span> Linux 6.1.0-astra</div>
               <div><span className="text-gray-500 w-32 inline-block">Processor:</span> Virtual CPU @ 3.40GHz</div>
               <div><span className="text-gray-500 w-32 inline-block">Memory:</span> 4.0 GiB</div>
               <div><span className="text-gray-500 w-32 inline-block">Graphics:</span> Virtual Display</div>
               <div><span className="text-gray-500 w-32 inline-block">Disk Capacity:</span> 120 GB</div>
            </div>
          </div>
        )}
        
        {activeTab === 'users' && (
          <div className="animate-in fade-in">
            <h3 className="text-2xl font-bold mb-2 text-white tracking-tight">Users</h3>
            <p className="text-sm text-gray-400 mb-8 border-b border-gray-800 pb-6">Manage system user accounts.</p>
            <div className="flex items-center gap-4 bg-white/5 p-4 rounded-lg border border-white/10 mt-4 cursor-pointer hover:bg-white/10 transition-colors">
               <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-xl font-bold shadow-lg">A</div>
               <div className="flex-1">
                  <div className="font-bold text-white flex items-center gap-2">astra <span className="bg-cyan-500/20 text-cyan-400 text-[10px] px-2 py-0.5 rounded uppercase tracking-wider">Current Info</span></div>
                  <div className="text-xs text-gray-400 mt-0.5">Administrator</div>
               </div>
               <button className="px-4 py-1.5 bg-white/10 hover:bg-white/20 rounded text-sm transition-colors">Edit</button>
            </div>
            <button className="mt-4 px-4 py-2 border border-dashed border-gray-600 text-gray-400 hover:text-white hover:border-gray-400 rounded-lg text-sm w-full transition-colors">+ Add User</button>
          </div>
        )}
        
        {activeTab === 'network' && (
          <div className="animate-in fade-in">
            <h3 className="text-2xl font-bold mb-2 text-white tracking-tight">Network</h3>
            <p className="text-sm text-gray-400 mb-8 border-b border-gray-800 pb-6">Network interface status and configuration.</p>
            <div className="space-y-4 mt-4">
              <div className="flex justify-between items-center bg-white/5 p-4 rounded-lg border border-white/10 hover:bg-white/10 transition-colors cursor-pointer">
                 <div className="flex items-center gap-4">
                   <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                     <span className="w-3 h-3 bg-green-500 rounded-full shadow-[0_0_8px_#22c55e]"></span>
                   </div>
                   <div>
                      <div className="font-bold text-white">Ethernet (eth0)</div>
                      <div className="text-xs text-green-400 font-medium">Connected</div>
                   </div>
                 </div>
                 <div className="text-sm text-gray-400 font-mono">192.168.56.101</div>
              </div>
              <div className="flex justify-between items-center bg-white/5 p-4 rounded-lg border border-white/10 hover:bg-white/10 transition-colors cursor-pointer opacity-70">
                 <div className="flex items-center gap-4">
                   <div className="w-10 h-10 bg-gray-500/20 rounded-full flex items-center justify-center">
                     <span className="w-3 h-3 bg-gray-500 rounded-full"></span>
                   </div>
                   <div>
                      <div className="font-bold text-gray-300">Wi-Fi (wlan0)</div>
                      <div className="text-xs text-gray-500">Disconnected</div>
                   </div>
                 </div>
                 <button className="text-sm text-blue-400 hover:text-blue-300 bg-blue-500/10 px-3 py-1 rounded">Connect</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export function DocsApp() {
  return (
    <div className="p-8 text-gray-300 h-full overflow-y-auto bg-[#181825]">
      <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3"><Hexagon className="text-cyan-400" size={32}/> AstraKernel OS Documentation</h1>
      <p className="mb-6 text-sm text-gray-400 border-b border-gray-700/50 pb-6">Version 0.1 • Custom Linux Distribution</p>
      
      <div className="bg-blue-500/10 border border-blue-500/30 text-blue-200 p-5 rounded-xl mb-8 text-sm leading-relaxed shadow-inner">
         <strong>Important Notice:</strong> You are currently viewing the <strong className="text-cyan-400">Visual Demo Mode</strong>. This preview shows how AstraKernel OS looks. The real functional OS is built into <code>AstraKernelOS.iso</code> using the provided <code>build.sh</code> script.
      </div>
      
      <h2 className="text-xl font-bold text-white mt-8 mb-4">Core Principles</h2>
      <ul className="list-none space-y-3 text-sm text-gray-300 mb-8 ml-1">
         <li className="flex items-center gap-3"><span className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center"><CheckSquare size={14} className="text-green-400"/></span> Debian/Ubuntu Base for extreme stability</li>
         <li className="flex items-center gap-3"><span className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center"><CheckSquare size={14} className="text-green-400"/></span> Custom XFCE Desktop with modern styling</li>
         <li className="flex items-center gap-3"><span className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center"><CheckSquare size={14} className="text-green-400"/></span> Pre-configured Developer Tools (gcc, python, node)</li>
         <li className="flex items-center gap-3"><span className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center"><CheckSquare size={14} className="text-green-400"/></span> Squashfs automated ISO build system</li>
      </ul>

      <h2 className="text-xl font-bold text-white mt-8 mb-4">Custom CLI Tooling</h2>
      <div className="bg-[#11111b] p-4 rounded-xl font-mono text-sm border border-gray-800 text-cyan-300 shadow-inner">
        <p className="mb-1"><span className="text-gray-500">$</span> astra-info     <span className="text-gray-500"># View system architecture details</span></p>
        <p className="mb-1"><span className="text-gray-500">$</span> astra-update   <span className="text-gray-500"># Run apt sync and upgrade safely</span></p>
        <p className="mb-1"><span className="text-gray-500">$</span> astra-sysmon   <span className="text-gray-500"># Open enhanced system monitor</span></p>
      </div>
    </div>
  )
}

export function SystemMonitorApp() {
  const [cpu, setCpu] = useState(12);
  const [ram, setRam] = useState(20);
  const [net, setNet] = useState(1.2);

  useEffect(() => {
    const i = setInterval(() => {
      setCpu(prev => Math.max(5, Math.min(90, prev + (Math.random() * 14 - 7))));
      setRam(prev => Math.max(18, Math.min(40, prev + (Math.random() * 4 - 2))));
      setNet(prev => Math.max(0.1, Math.min(10, prev + (Math.random() * 2 - 1))));
    }, 1500);
    return () => clearInterval(i);
  }, []);

  return (
    <div className="h-full bg-[#181825] p-6 text-gray-200 flex flex-col">
      <div className="flex items-center gap-3 text-white font-bold mb-6 pb-4 border-b border-gray-700">
        <CpuIcon size={24} className="text-cyan-400" /> 
        <span className="text-lg tracking-wide bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">ASTRA SYSTEM MONITOR</span>
      </div>
      
      <div className="space-y-8 flex-1">
        <div>
          <div className="flex justify-between mb-2 text-sm font-semibold">
            <span className="text-gray-300">CPU Usage</span>
            <span className="font-mono text-cyan-400">{cpu.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-black/60 rounded-full h-2.5 overflow-hidden shadow-inner flex">
            <div className="bg-cyan-400 h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_12px_rgba(34,211,238,0.8)]" style={{width: `${cpu}%`}}></div>
          </div>
        </div>
        
        <div>
          <div className="flex justify-between mb-2 text-sm font-semibold">
            <span className="text-gray-300">Memory</span>
            <span className="font-mono text-[#A6E3A1]">{(ram/100 * 4096).toFixed(0)} MB / 4096 MB</span>
          </div>
          <div className="w-full bg-black/60 rounded-full h-2.5 overflow-hidden shadow-inner flex">
            <div className="bg-[#A6E3A1] h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_12px_rgba(166,227,161,0.8)]" style={{width: `${ram}%`}}></div>
          </div>
        </div>

        <div>
          <div className="flex justify-between mb-2 text-sm font-semibold">
            <span className="text-gray-300">Root Filesystem</span>
            <span className="font-mono text-[#F9E2AF]">12% (14.2 GB / 120 GB)</span>
          </div>
          <div className="w-full bg-black/60 rounded-full h-2.5 shadow-inner flex overflow-hidden">
            <div className="bg-[#F9E2AF] h-full rounded-full w-[12%] shadow-[0_0_12px_rgba(249,226,175,0.8)]"></div>
          </div>
        </div>
      </div>
      
      <div className="pt-4 border-t border-gray-700 flex justify-between items-center text-sm text-gray-400 mt-auto">
        <div className="flex items-center gap-2 font-medium">
          <div className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_10px_#22c55e]"></div>
          Network Activity
        </div>
        <span className="font-mono text-white transition-all duration-300 bg-gray-800 px-3 py-1 rounded shadow-inner border border-gray-700">{net.toFixed(1)} MB/s ↓</span>
      </div>
    </div>
  )
}
