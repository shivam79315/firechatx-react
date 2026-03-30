import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ChatSidebar from '../components/ChatSidebar';
import ChatWindow from '../components/ChatWindow';
import BackgroundOrbs from '../components/BackgroundOrbs';
import { initialChats, initialMessages, users } from '../data/dummyData';
import { useAuth } from '../context/AuthContext';

const DashboardPage = () => {
  const [chats, setChats] = useState(initialChats);
  const [messages, setMessages] = useState(initialMessages);
  const [activeChat, setActiveChat] = useState(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const { user } = useAuth();

  const handleSelectChat = (chat) => {
    setActiveChat(chat);
    // Clear unread count
    setChats(prev => prev.map(c => 
      c.id === chat.id ? { ...c, unreadCount: 0 } : c
    ));
  };

  const handleSendMessage = (messageData) => {
    if (!activeChat) return;

    const newMessage = {
      id: `msg-${Date.now()}`,
      senderId: user?.id || 'user-1',
      content: messageData.content,
      timestamp: new Date().toISOString(),
      status: 'sent',
      type: messageData.type,
      file: messageData.file
    };

    // Add message
    setMessages(prev => ({
      ...prev,
      [activeChat.id]: [...(prev[activeChat.id] || []), newMessage]
    }));

    // Update chat's last message
    setChats(prev => prev.map(c => 
      c.id === activeChat.id 
        ? { 
            ...c, 
            lastMessage: messageData.content || `Sent a ${messageData.type}`,
            lastMessageTime: new Date().toISOString()
          } 
        : c
    ));

    // Simulate message status updates
    setTimeout(() => {
      setMessages(prev => ({
        ...prev,
        [activeChat.id]: prev[activeChat.id].map(m => 
          m.id === newMessage.id ? { ...m, status: 'delivered' } : m
        )
      }));
    }, 1000);

    setTimeout(() => {
      setMessages(prev => ({
        ...prev,
        [activeChat.id]: prev[activeChat.id].map(m => 
          m.id === newMessage.id ? { ...m, status: 'read' } : m
        )
      }));
    }, 2500);

    // Simulate reply for demo
    if (Math.random() > 0.5) {
      setTimeout(() => {
        const replyerId = activeChat.participants.find(id => id !== user?.id);
        const replier = users.find(u => u.id === replyerId);
        
        const replyMessage = {
          id: `msg-reply-${Date.now()}`,
          senderId: replyerId,
          content: getRandomReply(),
          timestamp: new Date().toISOString(),
          status: 'read',
          type: 'text'
        };

        setMessages(prev => ({
          ...prev,
          [activeChat.id]: [...(prev[activeChat.id] || []), replyMessage]
        }));

        setChats(prev => prev.map(c => 
          c.id === activeChat.id 
            ? { 
                ...c, 
                lastMessage: replyMessage.content,
                lastMessageTime: replyMessage.timestamp
              } 
            : c
        ));
      }, 3000 + Math.random() * 2000);
    }
  };

  const getRandomReply = () => {
    const replies = [
      "That's great to hear!",
      "I'll check and get back to you.",
      "Sounds good!",
      "Thanks for letting me know.",
      "Perfect, I agree!",
      "Let me think about it.",
      "Absolutely!",
      "I'll send over the details soon."
    ];
    return replies[Math.floor(Math.random() * replies.length)];
  };

  const handleCreateChat = (userId) => {
    // Check if chat already exists
    const existingChat = chats.find(c => 
      !c.isGroup && c.participants.includes(userId) && c.participants.includes(user?.id)
    );

    if (existingChat) {
      setActiveChat(existingChat);
      return;
    }

    const newChat = {
      id: `chat-new-${Date.now()}`,
      participants: [user?.id || 'user-1', userId],
      isGroup: false,
      lastMessage: 'Start a conversation',
      lastMessageTime: new Date().toISOString(),
      unreadCount: 0
    };

    setChats(prev => [newChat, ...prev]);
    setMessages(prev => ({ ...prev, [newChat.id]: [] }));
    setActiveChat(newChat);
  };

  const handleCreateGroup = (name, memberIds) => {
    const newGroupId = `group-new-${Date.now()}`;
    const newChatId = `group-chat-new-${Date.now()}`;

    const newChat = {
      id: newChatId,
      groupId: newGroupId,
      participants: [user?.id || 'user-1', ...memberIds],
      isGroup: true,
      lastMessage: 'Group created',
      lastMessageTime: new Date().toISOString(),
      unreadCount: 0
    };

    setChats(prev => [newChat, ...prev]);
    setMessages(prev => ({ ...prev, [newChatId]: [] }));
    setActiveChat(newChat);
  };

  // Sort chats by last message time
  const sortedChats = [...chats].sort((a, b) => 
    new Date(b.lastMessageTime) - new Date(a.lastMessageTime)
  );

  return (
    <div 
      className="h-screen flex overflow-hidden relative"
      style={{ background: 'var(--background)' }}
      data-testid="dashboard-page"
    >
      <BackgroundOrbs />
      
      <div className="relative z-10 flex w-full h-full">
        {/* Sidebar */}
        <motion.div 
          className="w-full md:w-80 lg:w-96 flex-shrink-0"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <ChatSidebar
            chats={sortedChats}
            activeChat={activeChat}
            onSelectChat={handleSelectChat}
            onCreateChat={handleCreateChat}
            onCreateGroup={handleCreateGroup}
            isMobileOpen={isMobileSidebarOpen}
            onCloseMobile={() => setIsMobileSidebarOpen(false)}
          />
        </motion.div>

        {/* Chat Window */}
        <motion.div 
          className="flex-1 hidden md:flex"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <ChatWindow
            chat={activeChat}
            messages={activeChat ? messages[activeChat.id] || [] : []}
            onSendMessage={handleSendMessage}
            onOpenSidebar={() => setIsMobileSidebarOpen(true)}
          />
        </motion.div>

        {/* Mobile Chat Window */}
        {activeChat && !isMobileSidebarOpen && (
          <motion.div 
            className="fixed inset-0 z-40 md:hidden"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
          >
            <ChatWindow
              chat={activeChat}
              messages={messages[activeChat.id] || []}
              onSendMessage={handleSendMessage}
              onOpenSidebar={() => setIsMobileSidebarOpen(true)}
            />
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
