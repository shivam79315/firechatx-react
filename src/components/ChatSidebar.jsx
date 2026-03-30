import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Plus, 
  Users, 
  MessageSquare, 
  Settings,
  X,
  Check
} from 'lucide-react';
import { users, groups, getUserById, getGroupById } from '../data/dummyData';
import { useAuth } from '../context/AuthContext';

const ChatSidebar = ({ 
  chats, 
  activeChat, 
  onSelectChat, 
  onCreateChat,
  onCreateGroup,
  isMobileOpen,
  onCloseMobile
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [showNewGroupModal, setShowNewGroupModal] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [groupName, setGroupName] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();

  const filteredChats = chats.filter(chat => {
    if (!searchQuery) return true;
    
    if (chat.isGroup) {
      const group = getGroupById(chat.groupId);
      return group?.name.toLowerCase().includes(searchQuery.toLowerCase());
    } else {
      const otherUserId = chat.participants.find(id => id !== user?.id);
      const otherUser = getUserById(otherUserId);
      return otherUser?.name.toLowerCase().includes(searchQuery.toLowerCase());
    }
  });

  const getChatInfo = (chat) => {
    if (chat.isGroup) {
      const group = getGroupById(chat.groupId);
      return {
        name: group?.name || 'Unknown Group',
        avatar: null,
        isGroup: true,
        memberCount: chat.participants.length
      };
    } else {
      const otherUserId = chat.participants.find(id => id !== user?.id);
      const otherUser = getUserById(otherUserId);
      return {
        name: otherUser?.name || 'Unknown User',
        avatar: otherUser?.avatar,
        status: otherUser?.status,
        isGroup: false
      };
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    if (diff < 60000) return 'Now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m`;
    if (diff < 86400000) return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  const handleCreateChat = (userId) => {
    onCreateChat(userId);
    setShowNewChatModal(false);
  };

  const handleCreateGroup = () => {
    if (groupName.trim() && selectedUsers.length > 0) {
      onCreateGroup(groupName, selectedUsers);
      setShowNewGroupModal(false);
      setGroupName('');
      setSelectedUsers([]);
    }
  };

  const toggleUserSelection = (userId) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const availableUsers = users.filter(u => u.id !== user?.id);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <>
      <motion.div 
        className={`
          glass-panel-strong h-full flex flex-col
          ${isMobileOpen ? 'fixed inset-0 z-50 md:relative' : 'hidden md:flex'}
        `}
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Header */}
        <div className="p-4 border-b" style={{ borderColor: 'var(--glass-border)' }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
              Messages
            </h2>
            <div className="flex items-center gap-2">
              <motion.button
                data-testid="open-settings-button"
                onClick={() => navigate('/profile')}
                className="p-2 rounded-xl glass-input"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Settings className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} />
              </motion.button>
              {isMobileOpen && (
                <motion.button
                  data-testid="close-sidebar-mobile"
                  onClick={onCloseMobile}
                  className="p-2 rounded-xl glass-input md:hidden"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <X className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} />
                </motion.button>
              )}
            </div>
          </div>

          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
            <input
              type="text"
              data-testid="chat-search-input"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="glass-input w-full pl-10 pr-4 py-2.5 rounded-xl text-sm"
            />
          </div>

          {/* Quick Actions */}
          <div className="flex gap-2">
            <motion.button
              data-testid="new-chat-button"
              onClick={() => setShowNewChatModal(true)}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl btn-primary text-sm font-medium"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Plus className="w-4 h-4" />
              New Chat
            </motion.button>
            <motion.button
              data-testid="new-group-button"
              onClick={() => setShowNewGroupModal(true)}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl glass-input text-sm font-medium"
              style={{ color: 'var(--text-primary)' }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Users className="w-4 h-4" />
              New Group
            </motion.button>
          </div>
        </div>

        {/* Chat List */}
        <motion.div 
          className="flex-1 overflow-y-auto p-2 space-y-1"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {filteredChats.map((chat) => {
            const chatInfo = getChatInfo(chat);
            const isActive = activeChat?.id === chat.id;
            
            return (
              <motion.button
                key={chat.id}
                data-testid={`chat-item-${chat.id}`}
                onClick={() => {
                  onSelectChat(chat);
                  onCloseMobile?.();
                }}
                className={`w-full p-3 rounded-2xl text-left transition-all sidebar-item ${isActive ? 'active' : ''}`}
                variants={itemVariants}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <div className="flex items-center gap-3">
                  {/* Avatar */}
                  <div className="relative flex-shrink-0">
                    {chatInfo.isGroup ? (
                      <div 
                        className="w-12 h-12 rounded-full flex items-center justify-center"
                        style={{ background: 'linear-gradient(135deg, #0054D1 0%, #3B8BF5 100%)' }}
                      >
                        <Users className="w-5 h-5 text-white" />
                      </div>
                    ) : (
                      <>
                        <img
                          src={chatInfo.avatar}
                          alt={chatInfo.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        {chatInfo.status === 'online' && (
                          <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full online-indicator" />
                        )}
                      </>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium truncate" style={{ color: 'var(--text-primary)' }}>
                        {chatInfo.name}
                      </span>
                      <span className="text-xs font-mono" style={{ color: 'var(--text-secondary)' }}>
                        {formatTime(chat.lastMessageTime)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm truncate" style={{ color: 'var(--text-secondary)' }}>
                        {chat.lastMessage}
                      </span>
                      {chat.unreadCount > 0 && (
                        <motion.span 
                          className="flex-shrink-0 ml-2 px-2 py-0.5 rounded-full text-xs font-medium text-white"
                          style={{ background: 'var(--primary-action)' }}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                        >
                          {chat.unreadCount}
                        </motion.span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.button>
            );
          })}

          {filteredChats.length === 0 && (
            <div className="text-center py-8">
              <MessageSquare className="w-12 h-12 mx-auto mb-3" style={{ color: 'var(--text-secondary)' }} />
              <p style={{ color: 'var(--text-secondary)' }}>
                {searchQuery ? 'No conversations found' : 'No conversations yet'}
              </p>
            </div>
          )}
        </motion.div>
      </motion.div>

      {/* New Chat Modal */}
      <AnimatePresence>
        {showNewChatModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowNewChatModal(false)}
          >
            <motion.div
              className="glass-panel-strong w-full max-w-md rounded-3xl p-6"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                  Start New Chat
                </h3>
                <motion.button
                  data-testid="close-new-chat-modal"
                  onClick={() => setShowNewChatModal(false)}
                  className="p-2 rounded-xl glass-input"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <X className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} />
                </motion.button>
              </div>

              <div className="space-y-2 max-h-80 overflow-y-auto">
                {availableUsers.map((u) => (
                  <motion.button
                    key={u.id}
                    data-testid={`select-user-${u.id}`}
                    onClick={() => handleCreateChat(u.id)}
                    className="w-full p-3 rounded-xl flex items-center gap-3 transition-all"
                    style={{ background: 'rgba(255,255,255,0.03)' }}
                    whileHover={{ scale: 1.02, background: 'rgba(255,255,255,0.08)' }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="relative">
                      <img
                        src={u.avatar}
                        alt={u.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      {u.status === 'online' && (
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full online-indicator" />
                      )}
                    </div>
                    <div className="text-left">
                      <p className="font-medium" style={{ color: 'var(--text-primary)' }}>{u.name}</p>
                      <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{u.email}</p>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* New Group Modal */}
      <AnimatePresence>
        {showNewGroupModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowNewGroupModal(false)}
          >
            <motion.div
              className="glass-panel-strong w-full max-w-md rounded-3xl p-6"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                  Create New Group
                </h3>
                <motion.button
                  data-testid="close-new-group-modal"
                  onClick={() => setShowNewGroupModal(false)}
                  className="p-2 rounded-xl glass-input"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <X className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} />
                </motion.button>
              </div>

              <input
                type="text"
                data-testid="group-name-input"
                placeholder="Group Name"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                className="glass-input w-full px-4 py-3 rounded-xl mb-4"
              />

              <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
                Select Members ({selectedUsers.length} selected)
              </p>

              <div className="space-y-2 max-h-60 overflow-y-auto mb-4">
                {availableUsers.map((u) => {
                  const isSelected = selectedUsers.includes(u.id);
                  return (
                    <motion.button
                      key={u.id}
                      data-testid={`group-select-user-${u.id}`}
                      onClick={() => toggleUserSelection(u.id)}
                      className={`w-full p-3 rounded-xl flex items-center gap-3 transition-all ${
                        isSelected ? 'ring-2 ring-blue-500' : ''
                      }`}
                      style={{ background: isSelected ? 'rgba(59, 130, 246, 0.1)' : 'rgba(255,255,255,0.03)' }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="relative">
                        <img
                          src={u.avatar}
                          alt={u.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        {isSelected && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center"
                            style={{ background: 'var(--primary-action)' }}
                          >
                            <Check className="w-3 h-3 text-white" />
                          </motion.div>
                        )}
                      </div>
                      <p className="font-medium" style={{ color: 'var(--text-primary)' }}>{u.name}</p>
                    </motion.button>
                  );
                })}
              </div>

              <motion.button
                data-testid="create-group-submit"
                onClick={handleCreateGroup}
                disabled={!groupName.trim() || selectedUsers.length === 0}
                className="w-full py-3 rounded-xl font-medium btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Create Group
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatSidebar;
