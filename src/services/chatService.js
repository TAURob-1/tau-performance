// TAU Performance Chat Service
// Uses Haiku (cost-conscious) with performance data + TAU skills context

export async function sendChatMessage(message, chatContext) {
  const { systemPrompt, chatHistory, dataContext, skillsContext } = chatContext;

  let systemContent = systemPrompt;

  if (skillsContext) {
    systemContent += `\n\n${skillsContext}`;
  }

  systemContent += `\n\n[247CF Performance Data]\n${dataContext || 'No performance data loaded yet.'}`;

  const messages = [];
  const recentHistory = (chatHistory || []).slice(-8);
  for (const msg of recentHistory) {
    messages.push({
      role: msg.role === 'assistant' ? 'assistant' : 'user',
      content: msg.content,
    });
  }
  messages.push({ role: 'user', content: message });

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 4096,
        system: systemContent,
        messages,
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    return extractText(data);
  } catch (error) {
    console.error('[Chat] Error:', error);
    throw new Error(`Failed to get response: ${error.message}`);
  }
}

function extractText(data) {
  const content = data.content;
  if (!Array.isArray(content) || content.length === 0) return 'No response';
  return content
    .filter(b => b.type === 'text' && b.text)
    .map(b => b.text)
    .join('\n\n') || 'No response';
}
