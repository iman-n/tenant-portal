import React, { useState, useEffect, useRef } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { CHAT_MESSAGE, GET_CONVERSATION_HISTORY } from '../../types/ticket';

interface Message {
  id: string;
  content: string;
  createdAt: string;
}

interface ChatResponse {
  message: string;
  done: boolean;
}

export const TicketForm = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [sessionId] = useState(() => `session_${Date.now()}`);
  const [messages, setMessages] = useState<Message[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const handleNavigateToDashboard = () => {
    navigate('/dashboard');
  };

  // Query to get conversation history
  const { data: historyData } = useQuery(GET_CONVERSATION_HISTORY, {
    variables: { sessionId },
    fetchPolicy: 'network-only',
  });

  const [sendMessage, { loading }] = useMutation<{ chatMessage: ChatResponse }>(CHAT_MESSAGE, {
    onCompleted: (data) => {
      if (data.chatMessage.done) {
        // Handle ticket creation completion
        console.log(data.chatMessage.message);
      }
    },
  });

  useEffect(() => {
    if (historyData?.getConversationHistory) {
      setMessages(historyData.getConversationHistory);
    }
  }, [historyData]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const userMessage = message;
    setMessage('');

    // Add user message to chat
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      content: userMessage,
      createdAt: new Date().toISOString(),
    }]);

    try {
      const { data } = await sendMessage({
        variables: {
          input: {
            message: userMessage,
            sessionId,
          },
        },
      });

      if (data?.chatMessage) {
        // Add bot response to chat
        setMessages(prev => [...prev, {
          id: `bot_${Date.now()}`,
          content: data.chatMessage.message,
          createdAt: new Date().toISOString(),
        }]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-2xl mx-auto overflow-hidden">
      <div className="flex-1 scrollable-container p-4 space-y-4 bg-gray-50 rounded-t-lg mt-8">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`max-w-[80%] p-3 rounded-lg ${
              msg.id.startsWith('bot_')
                ? 'bg-blue-100 ml-auto'
                : 'bg-white'
            }`}
          >
            {msg.content}
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-4 bg-white border-t">
        <div className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            // className="flex-1 rounded-md border-gray-300 shadow-sm"
            placeholder="Type your message..."
            disabled={loading}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm 
                     focus:border-blue-500 focus:ring-blue-500 sm:text-sm
                     p-2 border"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:bg-blue-300"
          >
            {loading ? 'Sending...' : 'Send'}
          </button>
        </div>
      </form>
      <div className="flex flex-col mx-auto">
        <button
          onClick={handleNavigateToDashboard}
          className="self-end mb-4 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors duration-200"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
};