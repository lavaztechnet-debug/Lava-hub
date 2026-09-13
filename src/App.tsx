/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Library, FileText, Send, Copy, Search, Plus, Moon, Sun, Printer, ChevronLeft, Star, X, MoreVertical, Trash2, Eye, Edit3, Volume2, Square, Bold, Italic, Link, List, Mic, MicOff, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Markdown from 'react-markdown';

export default function App() {
  const [activeTab, setActiveTab] = useState<'chat' | 'prompts' | 'notes'>('chat');
  const [isDark, setIsDark] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <div className="flex flex-col h-[100dvh] max-w-md mx-auto w-full relative pb-[calc(5rem+env(safe-area-inset-bottom))] transition-colors duration-300">
      {/* Header */}
      <header className="px-4 py-4 sm:px-6 sm:py-6 flex justify-between items-center">
        <span className="text-neon-cobalt font-bold">
          {activeTab === 'chat' && 'Lava-Bot'}
          {activeTab === 'prompts' && 'Lava-Prompts'}
          {activeTab === 'notes' && 'Lava-Notes'}
        </span>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsSettingsOpen(true)}
            className="neo-button p-3 rounded-full flex items-center justify-center"
          >
            <Settings size={20} />
          </button>
          <button 
            onClick={() => setIsDark(!isDark)}
            className="neo-button p-3 rounded-full flex items-center justify-center"
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-h-0 px-4 sm:px-6 pb-6 relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="flex-1 flex flex-col min-h-0"
          >
            {activeTab === 'chat' && <ChatScreen />}
            {activeTab === 'prompts' && <PromptsScreen />}
            {activeTab === 'notes' && <NotesScreen />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Navigation */}
      <nav className="absolute bottom-0 left-0 right-0 h-[calc(5rem+env(safe-area-inset-bottom))] px-4 sm:px-6 pb-[env(safe-area-inset-bottom)] flex items-center justify-between z-10" style={{ background: 'var(--neo-bg)' }}>
        <div className="neo-flat flex w-full h-14 items-center justify-around px-2" style={{ borderRadius: '24px' }}>
          <NavButton 
            icon={<MessageSquare size={20} />} 
            label="Lava-Bot" 
            isActive={activeTab === 'chat'} 
            onClick={() => setActiveTab('chat')} 
          />
          <NavButton 
            icon={<Library size={20} />} 
            label="Lava-Prompts" 
            isActive={activeTab === 'prompts'} 
            onClick={() => setActiveTab('prompts')} 
          />
          <NavButton 
            icon={<FileText size={20} />} 
            label="Lava-Notes" 
            isActive={activeTab === 'notes'} 
            onClick={() => setActiveTab('notes')} 
          />
        </div>
      </nav>

      {/* Settings Modal */}
      <AnimatePresence>
        {isSettingsOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm"
            onClick={() => setIsSettingsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-[var(--neo-bg)] w-full max-w-sm rounded-[2rem] p-6 relative flex flex-col gap-6"
              style={{ boxShadow: 'var(--neo-shadow-light) -10px -10px 20px, var(--neo-shadow-dark) 10px 10px 20px' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center">
                <h2 className="font-bold text-xl">Settings & Info</h2>
                <button 
                  onClick={() => setIsSettingsOpen(false)}
                  className="neo-button p-2 rounded-full"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="neo-pressed rounded-2xl p-5 flex flex-col gap-4 text-sm text-[var(--neo-text)] text-center">
                <div>
                  <span className="font-bold block mb-1">App Version</span>
                  <span className="text-[var(--neo-text-muted)]">v1.0.0</span>
                </div>
                
                <div className="h-px bg-[var(--neo-shadow-dark)] w-full my-2"></div>
                
                <div>
                  <p className="font-medium leading-relaxed">
                    This Application Was Created By: Russell Bedford, Creator Of: A LAVAZLIFE Creation. LAVAZ LIFE DESIGNS, LLD ™️.
                  </p>
                </div>
                
                <div className="h-px bg-[var(--neo-shadow-dark)] w-full my-2"></div>
                
                <div>
                  <p className="text-[var(--neo-text-muted)] mb-3">
                    If this app made your day easier please help me out at:
                  </p>
                  <a 
                    href="https://buymeacoffee.com/liquidlava5" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="neo-button py-3 px-4 font-bold text-blue-500 rounded-xl inline-block w-full transition-transform hover:scale-95"
                  >
                    buymeacoffee.com/liquidlava5
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- Screens ---

function ChatScreen() {
  const [messages, setMessages] = useState<{role: string, content: string}[]>(() => {
    const saved = localStorage.getItem('neo_chat_history');
    if (saved) return JSON.parse(saved);
    return [
      { role: 'assistant', content: 'Hello, how can I help you be more productive today?' }
    ];
  });
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [speakingIdx, setSpeakingIdx] = useState<number | null>(null);

  useEffect(() => {
    localStorage.setItem('neo_chat_history', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const handleClearChat = () => {
    window.speechSynthesis.cancel();
    setSpeakingIdx(null);
    setMessages([{ role: 'assistant', content: 'Hello, how can I help you be more productive today?' }]);
  };

  const handleSpeak = (text: string, idx: number) => {
    if (speakingIdx === idx) {
      window.speechSynthesis.cancel();
      setSpeakingIdx(null);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    
    utterance.onend = () => setSpeakingIdx(null);
    utterance.onerror = () => setSpeakingIdx(null);
    
    setSpeakingIdx(idx);
    window.speechSynthesis.speak(utterance);
  };

  const handleSend = async () => {
    if (!inputText.trim()) return;
    
    const newMessages = [...messages, { role: 'user', content: inputText }];
    setMessages(newMessages);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ messages: newMessages })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch response');
      }
      
      setMessages([...newMessages, { 
        role: 'assistant', 
        content: data.content
      }]);
    } catch (error: any) {
      setMessages([...newMessages, {
        role: 'assistant',
        content: `Error: ${error.message}. Please check if your GEMINI_API_KEY is configured correctly.`
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full gap-6">
      <div className="flex justify-between items-center shrink-0">
        <h2 className="font-semibold text-lg">AI Assistant</h2>
        <button 
          onClick={handleClearChat} 
          className="neo-button p-2 flex items-center px-3 text-sm"
        >
          Clear Chat
        </button>
      </div>
      <div className="neo-pressed flex-1 min-h-0 p-4 overflow-y-auto no-scrollbar flex flex-col gap-5">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className="max-w-[85%] relative group">
              <div className={`neo-flat p-4 text-sm ${msg.role === 'user' ? 'rounded-br-none' : 'rounded-bl-none'}`}>
                <div className="markdown-body text-sm leading-relaxed">
                  <Markdown>{msg.content}</Markdown>
                </div>
              </div>
              {msg.role === 'assistant' && (
                <button
                  onClick={() => handleSpeak(msg.content, idx)}
                  className={`absolute -right-10 bottom-0 p-2 rounded-full transition-all duration-200 ${
                    speakingIdx === idx ? 'neo-pressed text-blue-500' : 'neo-button text-[var(--neo-text-muted)] opacity-0 group-hover:opacity-100'
                  }`}
                  title={speakingIdx === idx ? "Stop speaking" : "Read aloud"}
                >
                  {speakingIdx === idx ? <Square size={14} fill="currentColor" /> : <Volume2 size={14} />}
                </button>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex w-full justify-start">
            <div className="max-w-[85%]">
              <div className="neo-flat p-4 rounded-bl-none flex gap-1.5 items-center justify-center h-[52px]">
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Input area */}
      <div className="flex gap-4 items-center">
        <input 
          type="text" 
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Type a message..." 
          className="neo-input flex-1 h-12 text-base px-4"
        />
        <button 
          onClick={handleSend}
          disabled={isLoading}
          className="neo-button h-12 w-12 flex items-center justify-center rounded-full flex-shrink-0 disabled:opacity-50"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}

function PromptsScreen() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState<'Newest' | 'Alphabetical' | 'Usage Count'>('Newest');
  
  const [favorites, setFavorites] = useState<number[]>(() => {
    const saved = localStorage.getItem('neo_prompt_favorites');
    return saved ? JSON.parse(saved) : [];
  });
  const [inspectingPrompt, setInspectingPrompt] = useState<any>(null);

  const categories = ['All', 'Starred', 'Coding', 'Review', 'Writing', 'System', 'Creative', 'Business'];

  const prompts = [
    { id: 1, title: 'Senior Developer Persona', category: 'Coding', text: 'Act as a Senior Developer and UI/UX expert. I need you to build a complete, production-ready app using...', usageCount: 45, timestamp: 1700000000000 },
    { id: 2, title: 'Code Review Master', category: 'Review', text: 'Review the following code block for performance bottlenecks, security vulnerabilities, and adherence to clean architecture principles...', usageCount: 12, timestamp: 1701000000000 },
    { id: 3, title: 'Marketing Copywriter', category: 'Writing', text: 'Generate 5 high-converting email subject lines for a new SaaS product launch aimed at enterprise clients...', usageCount: 89, timestamp: 1690000000000 },
    { id: 4, title: 'System Prompt Architect', category: 'System', text: 'Act as an expert prompt engineer. I want you to write a comprehensive system prompt for an AI agent that specializes in...', usageCount: 78, timestamp: 1702000000000 },
    { id: 5, title: 'Algorithm Optimizer', category: 'Coding', text: 'Analyze this algorithm and provide a more efficient implementation with lower time and space complexity, explaining your optimizations...', usageCount: 34, timestamp: 1703000000000 },
    { id: 6, title: 'Database Schema Designer', category: 'Coding', text: 'Design a normalized relational database schema for a [insert app type] application. Include table definitions, foreign keys, and necessary indexes...', usageCount: 56, timestamp: 1704000000000 },
    { id: 7, title: 'Bug Squasher', category: 'Coding', text: 'I am getting the following error in my code. Please analyze the stack trace and the code snippet, identify the root cause, and provide a fix...', usageCount: 110, timestamp: 1705000000000 },
    { id: 8, title: 'Technical Doc Writer', category: 'Writing', text: 'Write comprehensive developer documentation for the following API endpoints, including parameter descriptions, request/response examples, and error codes...', usageCount: 23, timestamp: 1706000000000 },
    { id: 9, title: 'PR Description Generator', category: 'Review', text: 'Based on the following commit messages and code diffs, write a clear and concise Pull Request description outlining the changes, motivations, and testing instructions...', usageCount: 41, timestamp: 1707000000000 },
    { id: 10, title: 'UX/UI Critique', category: 'Review', text: 'Act as a Senior UX/UI Designer. I will describe my user interface layout, and you will provide a critique focusing on usability, accessibility, and visual hierarchy...', usageCount: 18, timestamp: 1708000000000 },
    { id: 11, title: 'Product Manager Brainstorm', category: 'Business', text: 'Act as a Product Manager. We are building a feature for [insert target audience]. Help me brainstorm user stories, edge cases, and success metrics...', usageCount: 29, timestamp: 1709000000000 },
    { id: 12, title: 'Creative Story Outliner', category: 'Creative', text: 'Create a 5-act narrative outline for a story about [insert theme]. Include character arcs, key plot points, and the central conflict...', usageCount: 67, timestamp: 1710000000000 },
    { id: 13, title: 'Regex Master', category: 'Coding', text: 'Write a regular expression that precisely matches [insert requirement], and provide a detailed breakdown of how each part of the regex works...', usageCount: 82, timestamp: 1711000000000 },
    { id: 14, title: 'API Endpoint Designer', category: 'Coding', text: 'Design a RESTful API for a [insert service] service. List the endpoints, HTTP methods, expected payload structures, and response schemas...', usageCount: 50, timestamp: 1712000000000 },
    { id: 15, title: 'Business Pitch Generator', category: 'Business', text: 'Write a persuasive 2-minute elevator pitch for a startup that does [insert startup idea]. Focus on the problem, solution, market size, and traction...', usageCount: 38, timestamp: 1713000000000 },
    { id: 16, title: 'Social Media Strategy', category: 'Business', text: 'Develop a one-month content calendar and strategy for a [insert niche] brand on Twitter and LinkedIn. Include post themes and engagement tactics...', usageCount: 54, timestamp: 1714000000000 },
    { id: 17, title: 'Code Refactoring Expert', category: 'Review', text: 'Refactor this code to make it more readable, modular, and adhering to SOLID principles. Explain the design patterns you introduced...', usageCount: 95, timestamp: 1715000000000 },
    { id: 18, title: 'Security Audit Advisor', category: 'Review', text: 'Act as a Cybersecurity Expert. Review this application architecture for potential security vulnerabilities like XSS, CSRF, and SQL Injection, and suggest mitigations...', usageCount: 27, timestamp: 1716000000000 },
    { id: 19, title: 'TypeScript Type Wizard', category: 'Coding', text: 'Write advanced TypeScript utility types for the following data structures. Ensure strict type safety and infer as much as possible...', usageCount: 61, timestamp: 1717000000000 },
    { id: 20, title: 'Prompt Optimizer', category: 'System', text: 'Take my rough prompt: "[insert prompt]" and rewrite it using best practices (context, role, constraints, formatting) to get the best possible output from an LLM...', usageCount: 104, timestamp: 1718000000000 },
    { id: 21, title: 'Tone & Style Mimic', category: 'Writing', text: 'Analyze the tone, style, and vocabulary of the provided text sample. Then, rewrite my draft text to perfectly mimic that exact style and voice...', usageCount: 42, timestamp: 1719000000000 },
    { id: 22, title: 'Character Dialogue Gen', category: 'Creative', text: 'Write a tense dialogue scene between two characters: [Character A] who is hiding a secret, and [Character B] who is suspicious. Show, don’t tell...', usageCount: 31, timestamp: 1720000000000 },
    { id: 23, title: 'Executive Summary', category: 'Writing', text: 'Condense this long technical report into a 3-bullet-point executive summary aimed at non-technical stakeholders, highlighting only ROI and timeline impacts...', usageCount: 76, timestamp: 1721000000000 }
  ];

  useEffect(() => {
    localStorage.setItem('neo_prompt_favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (id: number) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(fId => fId !== id) : [...prev, id]
    );
  };

  let processedPrompts = prompts.filter(p => {
    if (selectedCategory === 'Starred') return favorites.includes(p.id);
    if (selectedCategory === 'All') return true;
    return p.category === selectedCategory;
  });
  
  processedPrompts = processedPrompts.sort((a, b) => {
    if (sortBy === 'Newest') return b.timestamp - a.timestamp;
    if (sortBy === 'Usage Count') return b.usageCount - a.usageCount;
    if (sortBy === 'Alphabetical') return a.title.localeCompare(b.title);
    return 0;
  });

  return (
    <div className="flex flex-col h-full overflow-y-auto no-scrollbar gap-6 pb-2">
      {/* Header & Total Count */}
      <div className="flex justify-between items-center shrink-0">
        <h2 className="font-semibold text-lg">Prompt Library</h2>
        <div className="neo-pressed px-3 py-1.5 rounded-full text-xs font-bold text-[var(--neo-text-muted)]">
          {processedPrompts.length} {processedPrompts.length === 1 ? 'Prompt' : 'Prompts'}
        </div>
      </div>

      {/* Search */}
      <div className="relative shrink-0">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--neo-text-muted)]" size={18} />
        <input 
          type="text" 
          placeholder="Search Meta-Prompts..." 
          className="neo-input w-full h-12 pl-12 text-base"
        />
      </div>
      
      {/* Filters and Sort */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center shrink-0">
        {/* Filter Bar */}
        <div className="flex gap-3 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide w-full sm:w-auto">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all ${
                selectedCategory === cat ? 'neo-pressed font-bold text-blue-500' : 'neo-button text-[var(--neo-text-muted)]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Sort Dropdown */}
        <div className="relative w-full sm:w-auto">
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value as any)}
            className="neo-button appearance-none w-full sm:w-auto px-4 py-2 pr-8 text-sm outline-none cursor-pointer text-[var(--neo-text)] bg-transparent"
          >
            <option value="Newest" className="bg-[var(--neo-bg)]">Newest</option>
            <option value="Alphabetical" className="bg-[var(--neo-bg)]">Alphabetical</option>
            <option value="Usage Count" className="bg-[var(--neo-bg)]">Usage Count</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[var(--neo-text-muted)]">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Prompts List */}
      <div className="flex flex-col gap-6 shrink-0">
        {processedPrompts.map(prompt => (
          <div key={prompt.id} className="neo-flat p-5 flex flex-col gap-3">
            <div className="flex justify-between items-start">
              <div className="flex-1 cursor-pointer" onClick={() => setInspectingPrompt(prompt)}>
                <h3 className="font-bold">{prompt.title}</h3>
                <div className="flex gap-2 items-center mt-1">
                  <span className="text-[10px] font-bold text-[var(--neo-text-muted)] uppercase tracking-wider">{prompt.category}</span>
                  <span className="text-[10px] font-bold text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded-full">{prompt.usageCount} uses</span>
                </div>
              </div>
              <div className="flex gap-2 relative z-10">
                <button 
                  className={`p-2 transition-colors ${favorites.includes(prompt.id) ? 'neo-pressed text-yellow-500' : 'neo-button text-[var(--neo-text-muted)]'}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(prompt.id);
                  }}
                  title={favorites.includes(prompt.id) ? "Remove from Starred" : "Add to Starred"}
                >
                  <Star size={16} fill={favorites.includes(prompt.id) ? "currentColor" : "none"} />
                </button>
                <button 
                  className="neo-button p-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigator.clipboard.writeText(prompt.text);
                  }}
                  title="Copy to clipboard"
                >
                  <Copy size={16} />
                </button>
              </div>
            </div>
            <p 
              className="text-sm line-clamp-2 mt-1 italic text-[var(--neo-text-muted)] cursor-pointer"
              onClick={() => setInspectingPrompt(prompt)}
            >
              "{prompt.text}"
            </p>
          </div>
        ))}
      </div>

      {/* Inspect Modal */}
      <AnimatePresence>
        {inspectingPrompt && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm"
            onClick={() => setInspectingPrompt(null)}
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-lg bg-[var(--neo-bg)] rounded-2xl p-6 flex flex-col gap-6 relative"
              style={{
                boxShadow: 'var(--neo-shadow-light) -10px -10px 20px, var(--neo-shadow-dark) 10px 10px 20px'
              }}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold">{inspectingPrompt.title}</h3>
                  <span className="text-xs font-bold text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded-full inline-block mt-2">
                    {inspectingPrompt.category}
                  </span>
                </div>
                <button onClick={() => setInspectingPrompt(null)} className="neo-button p-2">
                  <X size={20} />
                </button>
              </div>
              
              <div className="neo-pressed p-4 rounded-xl text-sm leading-relaxed max-h-[60vh] overflow-y-auto">
                {inspectingPrompt.text}
              </div>
              
              <div className="flex justify-end gap-3">
                <button 
                  className="neo-button px-4 py-2 text-sm font-semibold flex gap-2 items-center"
                  onClick={() => {
                    navigator.clipboard.writeText(inspectingPrompt.text);
                    setInspectingPrompt(null);
                  }}
                >
                  <Copy size={16} /> Copy Prompt
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

type Note = {
  id: string;
  title: string;
  content: string;
  category: 'Work' | 'Personal' | 'Ideas' | 'None';
  timestamp: number;
  createdAt: number;
};

function NotesScreen() {
  const [notes, setNotes] = useState<Note[]>(() => {
    const saved = localStorage.getItem('neo_notes_list');
    if (saved) return JSON.parse(saved);
    const now = Date.now();
    return [{
      id: '1',
      title: 'Project Architecture Notes',
      content: '- Use MVVM pattern\n- Room DB for local storage\n- Hilt for Dependency Injection\n- Jetpack Compose for UI',
      category: 'Work',
      timestamp: now,
      createdAt: now
    }];
  });

  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'Last Modified' | 'Created Date'>('Last Modified');
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<any>(null);

  // Save to local storage on change
  useEffect(() => {
    localStorage.setItem('neo_notes_list', JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    if (typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      
      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        
        if (finalTranscript && activeNote) {
          setNotes(prevNotes => prevNotes.map(n => {
            if (n.id === activeNoteId) {
              const currentContent = n.content;
              const separator = currentContent && !currentContent.endsWith(' ') && !currentContent.endsWith('\n') ? ' ' : '';
              return { ...n, content: currentContent + separator + finalTranscript, timestamp: Date.now() };
            }
            return n;
          }));
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setIsRecording(false);
      };

      recognitionRef.current.onend = () => {
        setIsRecording(false);
      };
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [activeNoteId]);

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in your browser.");
      return;
    }
    
    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsRecording(true);
      } catch (e) {
        console.error("Error starting speech recognition:", e);
      }
    }
  };

  const activeNote = notes.find(n => n.id === activeNoteId);

  const handleNewNote = () => {
    const now = Date.now();
    const newNote: Note = {
      id: now.toString(),
      title: '',
      content: '',
      category: 'Ideas',
      timestamp: now,
      createdAt: now
    };
    setNotes([newNote, ...notes]);
    setActiveNoteId(newNote.id);
    setShowQuickActions(false);
    setIsPreviewMode(false);
  };

  const updateActiveNote = (updates: Partial<Note>) => {
    setNotes(notes.map(n => n.id === activeNoteId ? { ...n, ...updates, timestamp: Date.now() } : n));
  };

  const insertMarkdown = (prefix: string, suffix: string = '') => {
    if (!activeNote || !textareaRef.current) return;
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    
    const content = activeNote.content;
    const selectedText = content.substring(start, end);
    const newContent = content.substring(0, start) + prefix + selectedText + suffix + content.substring(end);
    
    updateActiveNote({ content: newContent });
    
    // Defer focusing back to textarea so React has time to render the new value
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, end + prefix.length);
    }, 0);
  };

  const handleDuplicateNote = () => {
    if (!activeNote) return;
    const now = Date.now();
    const duplicatedNote: Note = {
      ...activeNote,
      id: now.toString(),
      title: activeNote.title ? `${activeNote.title} (Copy)` : 'Untitled (Copy)',
      timestamp: now,
      createdAt: now
    };
    setNotes([duplicatedNote, ...notes]);
    setActiveNoteId(duplicatedNote.id);
    setShowQuickActions(false);
    setIsPreviewMode(false);
  };

  const handleTrashNote = () => {
    if (!activeNote) return;
    setNotes(notes.filter(n => n.id !== activeNoteId));
    setActiveNoteId(null);
    setShowQuickActions(false);
    setIsPreviewMode(false);
  };

  const sortedNotes = [...notes].sort((a, b) => {
    if (sortBy === 'Last Modified') return b.timestamp - a.timestamp;
    if (sortBy === 'Created Date') {
      const createdA = a.createdAt || a.timestamp;
      const createdB = b.createdAt || b.timestamp;
      return createdB - createdA;
    }
    return 0;
  });

  if (activeNote) {
    return (
      <div className="flex flex-col h-full gap-6 relative">
        <div className="flex justify-between items-center shrink-0">
          <button onClick={() => {
            setActiveNoteId(null);
            setIsPreviewMode(false);
          }} className="neo-button p-2 flex items-center gap-1 px-3 text-sm">
            <ChevronLeft size={16} /> Back
          </button>
          <div className="flex gap-3">
            <button 
              onClick={() => setIsPreviewMode(!isPreviewMode)} 
              className={`neo-button p-2 flex items-center gap-2 px-3 text-sm transition-colors ${isPreviewMode ? 'neo-pressed text-blue-500' : ''}`}
            >
              {isPreviewMode ? <Edit3 size={16} /> : <Eye size={16} />}
              {isPreviewMode ? 'Edit' : 'Preview'}
            </button>
            <button onClick={() => window.print()} className="neo-button p-2 flex items-center gap-1 px-3 text-sm">
              <Printer size={16} /> Export
            </button>
          </div>
        </div>
        <div className="neo-pressed flex-1 min-h-0 p-4 flex flex-col gap-4 overflow-y-auto no-scrollbar">
          {isPreviewMode ? (
            <h1 className="font-bold text-xl mb-1" style={{ color: 'var(--neo-text)' }}>
              {activeNote.title || 'Untitled Note'}
            </h1>
          ) : (
            <input 
              type="text" 
              value={activeNote.title}
              onChange={(e) => updateActiveNote({ title: e.target.value })}
              placeholder="Note Title" 
              className="bg-transparent border-none outline-none font-bold text-xl placeholder-[var(--neo-text-muted)]"
              style={{ color: 'var(--neo-text)' }}
            />
          )}
          
          <div className="flex gap-2 mb-2 overflow-x-auto no-scrollbar shrink-0 pb-1">
            {(['Work', 'Personal', 'Ideas', 'None'] as const).map(cat => (
              <button 
                key={cat}
                disabled={isPreviewMode}
                onClick={() => updateActiveNote({ category: cat })}
                className={`text-xs px-2 py-1 rounded-md transition-colors shrink-0 ${activeNote.category === cat ? 'neo-pressed font-bold text-blue-500' : 'neo-flat text-[var(--neo-text-muted)] hover:opacity-80'} ${isPreviewMode ? 'opacity-70 cursor-default' : ''}`}
              >
                {cat}
              </button>
            ))}
          </div>
          
          {!isPreviewMode && (
            <div className="flex gap-2 mb-2 p-1.5 rounded-lg bg-[var(--neo-shadow-light)] shadow-[inset_2px_2px_5px_var(--neo-shadow-dark),_inset_-2px_-2px_5px_var(--neo-bg)] overflow-x-auto no-scrollbar shrink-0">
              <button onClick={() => insertMarkdown('**', '**')} className="p-1.5 rounded text-[var(--neo-text-muted)] hover:text-[var(--neo-text)] hover:bg-[var(--neo-bg)] transition-colors shrink-0" title="Bold"><Bold size={16} /></button>
              <button onClick={() => insertMarkdown('*', '*')} className="p-1.5 rounded text-[var(--neo-text-muted)] hover:text-[var(--neo-text)] hover:bg-[var(--neo-bg)] transition-colors shrink-0" title="Italic"><Italic size={16} /></button>
              <button onClick={() => insertMarkdown('[', '](url)')} className="p-1.5 rounded text-[var(--neo-text-muted)] hover:text-[var(--neo-text)] hover:bg-[var(--neo-bg)] transition-colors shrink-0" title="Link"><Link size={16} /></button>
              <button onClick={() => insertMarkdown('- ')} className="p-1.5 rounded text-[var(--neo-text-muted)] hover:text-[var(--neo-text)] hover:bg-[var(--neo-bg)] transition-colors shrink-0 mr-2" title="Bullet List"><List size={16} /></button>
              
              <div className="w-[1px] bg-[var(--neo-text-muted)] opacity-20 my-1 shrink-0"></div>
              
              <button 
                onClick={toggleRecording} 
                className={`p-1.5 rounded transition-all shrink-0 ml-2 ${isRecording ? 'text-red-500 bg-[var(--neo-bg)] shadow-[inset_2px_2px_5px_var(--neo-shadow-dark),_inset_-2px_-2px_5px_var(--neo-shadow-light)]' : 'text-[var(--neo-text-muted)] hover:text-[var(--neo-text)] hover:bg-[var(--neo-bg)]'}`}
                title={isRecording ? "Stop dictation" : "Start dictation"}
              >
                {isRecording ? <MicOff size={16} className="animate-pulse" /> : <Mic size={16} />}
              </button>
            </div>
          )}
          
          {isPreviewMode ? (
            <div className="flex-1 overflow-y-auto markdown-body">
              <Markdown>{activeNote.content || '*Empty note*'}</Markdown>
            </div>
          ) : (
            <textarea 
              ref={textareaRef}
              value={activeNote.content}
              onChange={(e) => updateActiveNote({ content: e.target.value })}
              placeholder="Start typing your Markdown note here..." 
              className="bg-transparent border-none outline-none resize-none flex-1 placeholder-[var(--neo-text-muted)] text-base p-1"
              style={{ color: 'var(--neo-text)' }}
            />
          )}
          
          <div className="flex justify-end gap-4 text-xs font-medium text-[var(--neo-text-muted)] mt-2 pb-16">
            <span>{activeNote.content.trim() ? activeNote.content.trim().split(/\s+/).length : 0} words</span>
            <span>{activeNote.content.length} characters</span>
          </div>
        </div>

        {/* Quick Actions Floating Menu */}
        <div className="absolute bottom-4 right-2 sm:bottom-6 sm:right-6 flex flex-col items-end gap-3 z-50">
          <AnimatePresence>
            {showQuickActions && (
              <motion.div
                initial={{ opacity: 0, y: 15, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 15, scale: 0.9 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                className="flex flex-col gap-2 bg-[var(--neo-bg)] p-3 rounded-2xl"
                style={{ boxShadow: 'var(--neo-shadow-light) -5px -5px 15px, var(--neo-shadow-dark) 5px 5px 15px' }}
              >
                <button 
                  onClick={handleDuplicateNote} 
                  className="flex items-center gap-3 neo-button px-4 py-3 text-sm font-semibold rounded-xl text-[var(--neo-text)]"
                >
                  <Copy size={16} /> Duplicate Note
                </button>
                <button 
                  onClick={handleTrashNote} 
                  className="flex items-center gap-3 neo-button px-4 py-3 text-sm font-semibold rounded-xl text-red-500"
                >
                  <Trash2 size={16} /> Move to Trash
                </button>
              </motion.div>
            )}
          </AnimatePresence>
          <button 
            onClick={() => setShowQuickActions(!showQuickActions)}
            className={`neo-button h-14 w-14 rounded-full flex items-center justify-center transition-all duration-300 ${showQuickActions ? 'neo-pressed rotate-90 text-blue-500' : 'text-[var(--neo-text-muted)]'}`}
          >
            {showQuickActions ? <X size={24} /> : <MoreVertical size={24} />}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-y-auto no-scrollbar gap-6 pb-2">
      <div className="flex justify-between items-center mb-2 shrink-0">
        <h2 className="font-semibold text-lg">My Notes</h2>
        <div className="flex gap-4 items-center">
          <div className="relative">
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value as any)}
              className="neo-button appearance-none px-4 py-2 pr-8 text-sm outline-none cursor-pointer text-[var(--neo-text)] bg-transparent"
            >
              <option value="Last Modified" className="bg-[var(--neo-bg)]">Last Modified</option>
              <option value="Created Date" className="bg-[var(--neo-bg)]">Created Date</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[var(--neo-text-muted)]">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
          <button onClick={handleNewNote} className="neo-button p-2 flex items-center gap-1 px-3 text-sm">
            <Plus size={16} /> New
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-4 shrink-0">
        {sortedNotes.map(note => (
          <div 
            key={note.id} 
            onClick={() => setActiveNoteId(note.id)}
            className="neo-flat p-4 flex flex-col gap-2 cursor-pointer hover:opacity-80 transition-opacity"
          >
            <div className="flex justify-between items-start">
              <h3 className="font-bold line-clamp-1">{note.title || "Untitled Note"}</h3>
              <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-1 neo-pressed rounded text-blue-500">
                {note.category}
              </span>
            </div>
            <p className="text-sm line-clamp-2 text-[var(--neo-text-muted)]">
              {note.content || "No content..."}
            </p>
          </div>
        ))}
        {notes.length === 0 && (
          <div className="text-center text-[var(--neo-text-muted)] mt-10">No notes yet. Create one!</div>
        )}
      </div>
    </div>
  );
}

// --- Components ---

function NavButton({ icon, label, isActive, onClick }: { icon: React.ReactNode, label: string, isActive: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center justify-center w-16 h-12 rounded-xl transition-all duration-200 ${isActive ? 'neo-pressed text-blue-500' : 'text-[var(--neo-text-muted)] hover:text-[var(--neo-text)]'}`}
    >
      {icon}
      <span className="text-[10px] font-medium mt-1">{label}</span>
    </button>
  );
}
