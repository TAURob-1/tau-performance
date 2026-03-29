import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { sendChatMessage } from '../../services/chatService';

export default function ChatPanel() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [context, setContext] = useState(null);
  const [contextLoading, setContextLoading] = useState(true);
  const messagesEndRef = useRef(null);

  // Fetch performance + skills context on mount
  useEffect(() => {
    async function loadContext() {
      try {
        const res = await fetch('/api/context/247cf', { credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          setContext(data);
        }
      } catch (e) {
        console.error('[Chat] Failed to load context:', e);
      } finally {
        setContextLoading(false);
      }
    }
    loadContext();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || loading) return;

    setInput('');
    const userMsg = { role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      const response = await sendChatMessage(text, {
        systemPrompt: 'You are a senior performance marketing strategist for TAU (The Independent Marketing Intelligence Architect), working with 247 CarFinance. You have deep expertise in paid search, Meta social advertising, attribution, and cross-channel strategy. Help analyse campaign performance, diagnose tracking issues, recommend optimisations, and provide strategic guidance. Be concise, actionable, and reference specific data points.',
        chatHistory: messages,
        dataContext: context?.performanceMachine || 'No performance data loaded.',
        skillsContext: context?.skills || '',
      });
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: `Error: ${error.message}` }]);
    } finally {
      setLoading(false);
    }
  };

  const suggestedQuestions = [
    'What are the biggest efficiency opportunities?',
    'Why is Meta car campaign not reporting conversions?',
    'How should we restructure the search campaign architecture?',
    "What's the attribution fix priority for 247CF?",
    'Should we scale Bad Credit Exact budget?',
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Performance Chat</h2>
        {contextLoading ? (
          <span className="text-xs text-gray-400">Loading context...</span>
        ) : context ? (
          <span className="text-xs text-green-600">Context loaded ({context.performanceMachineLines} lines data + {context.skillsLines} lines skills)</span>
        ) : (
          <span className="text-xs text-amber-500">No context available</span>
        )}
      </div>

      <div className="bg-white border border-gray-200 rounded-xl flex flex-col" style={{ height: 'calc(100vh - 280px)' }}>
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="text-center text-gray-400 py-12">
              <p className="text-sm font-medium">Ask about 247CF performance, strategy, or tracking issues</p>
              <p className="text-xs mt-1 text-gray-300">Powered by TAU methodology + 247CF data</p>
              <div className="mt-4 flex flex-wrap gap-2 justify-center">
                {suggestedQuestions.map(q => (
                  <button
                    key={q}
                    onClick={() => setInput(q)}
                    className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs text-gray-600 transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-xl px-4 py-3 text-sm ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {msg.role === 'assistant' ? (
                  <ReactMarkdown remarkPlugins={[remarkGfm]} className="prose prose-sm max-w-none">
                    {msg.content}
                  </ReactMarkdown>
                ) : msg.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-xl px-4 py-3 text-sm text-gray-500">Thinking...</div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t border-gray-200 p-3">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
              placeholder="Ask about performance, strategy, or tracking..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
            <button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium disabled:opacity-50 transition-colors"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
