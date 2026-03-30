import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  Paperclip, 
  Image, 
  FileText, 
  File,
  X,
  Download,
  Check,
  CheckCheck,
  Menu,
  MoreVertical,
  Phone,
  Video,
  Users,
  Upload
} from 'lucide-react';
import { getUserById, getGroupById } from '../data/dummyData';
import { useAuth } from '../context/AuthContext';
import ImageUploadModal from './ImageUploadModal';

const ChatWindow = ({ 
  chat, 
  messages, 
  onSendMessage, 
  onOpenSidebar 
}) => {
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [attachedFile, setAttachedFile] = useState(null);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const { user } = useAuth();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Simulate typing indicator
  useEffect(() => {
    if (chat) {
      const interval = setInterval(() => {
        setIsTyping(prev => !prev && Math.random() > 0.7);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [chat]);

  const getChatInfo = () => {
    if (!chat) return null;
    
    if (chat.isGroup) {
      const group = getGroupById(chat.groupId);
      return {
        name: group?.name || 'Unknown Group',
        avatar: null,
        isGroup: true,
        members: chat.participants.map(id => getUserById(id)).filter(Boolean)
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

  const chatInfo = getChatInfo();

  const handleSend = () => {
    if (!inputValue.trim() && !attachedFile) return;

    const newMessage = {
      content: inputValue.trim(),
      type: attachedFile ? attachedFile.type : 'text',
      file: attachedFile
    };

    onSendMessage(newMessage);
    setInputValue('');
    setAttachedFile(null);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileSelect = (type) => {
    setShowAttachMenu(false);
    
    if (type === 'image') {
      // Open the drag-drop image upload modal
      setShowImageUpload(true);
      return;
    }
    
    // Simulate file selection with dummy data for non-image files
    const dummyFiles = {
      pdf: {
        name: 'document_' + Date.now() + '.pdf',
        type: 'pdf',
        url: '#',
        size: '2.4 MB'
      },
      document: {
        name: 'file_' + Date.now() + '.docx',
        type: 'document',
        url: '#',
        size: '856 KB'
      }
    };

    setAttachedFile(dummyFiles[type]);
  };

  const handleImageUpload = (imageData) => {
    setAttachedFile({
      name: imageData.name,
      type: 'image',
      url: imageData.url,
      size: imageData.size
    });
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'sent':
        return <Check className="w-3 h-3" />;
      case 'delivered':
        return <CheckCheck className="w-3 h-3" />;
      case 'read':
        return <CheckCheck className="w-3 h-3 text-blue-400" />;
      default:
        return null;
    }
  };

  const bubbleVariants = {
    initial: { opacity: 0, y: 20, scale: 0.9, filter: 'blur(5px)' },
    animate: { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' },
    exit: { opacity: 0, scale: 0.9 }
  };

  if (!chat) {
    return (
      <div className="flex-1 flex items-center justify-center glass-panel-strong">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <motion.div
            className="w-20 h-20 mx-auto mb-4 rounded-2xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #0054D1 0%, #3B8BF5 100%)' }}
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          >
            <Send className="w-8 h-8 text-white" />
          </motion.div>
          <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
            Select a conversation
          </h3>
          <p style={{ color: 'var(--text-secondary)' }}>
            Choose a chat from the sidebar to start messaging
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div 
      className="flex-1 flex flex-col glass-panel-strong overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: 'var(--glass-border)' }}>
        <div className="flex items-center gap-3">
          <motion.button
            data-testid="open-sidebar-mobile"
            onClick={onOpenSidebar}
            className="p-2 rounded-xl glass-input md:hidden"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Menu className="w-5 h-5" style={{ color: 'var(--text-primary)' }} />
          </motion.button>

          {chatInfo.isGroup ? (
            <div 
              className="w-11 h-11 rounded-full flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #0054D1 0%, #3B8BF5 100%)' }}
            >
              <Users className="w-5 h-5 text-white" />
            </div>
          ) : (
            <div className="relative">
              <img
                src={chatInfo.avatar}
                alt={chatInfo.name}
                className="w-11 h-11 rounded-full object-cover"
              />
              {chatInfo.status === 'online' && (
                <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full online-indicator" />
              )}
            </div>
          )}

          <div>
            <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>
              {chatInfo.name}
            </h3>
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
              {chatInfo.isGroup 
                ? `${chatInfo.members?.length} members`
                : chatInfo.status === 'online' ? 'Online' : 'Offline'
              }
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <motion.button
            data-testid="video-call-button"
            className="p-2.5 rounded-xl glass-input"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Video className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} />
          </motion.button>
          <motion.button
            data-testid="voice-call-button"
            className="p-2.5 rounded-xl glass-input"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Phone className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} />
          </motion.button>
          <motion.button
            data-testid="chat-options-button"
            className="p-2.5 rounded-xl glass-input"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <MoreVertical className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} />
          </motion.button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 smooth-scroll">
        <AnimatePresence>
          {messages.map((message, index) => {
            const isSent = message.senderId === user?.id;
            const sender = getUserById(message.senderId);
            const showAvatar = chat.isGroup && !isSent && 
              (index === 0 || messages[index - 1]?.senderId !== message.senderId);

            return (
              <motion.div
                key={message.id}
                className={`flex ${isSent ? 'justify-end' : 'justify-start'}`}
                variants={bubbleVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ type: 'spring', stiffness: 260, damping: 20 }}
              >
                {!isSent && chat.isGroup && (
                  <div className="w-8 mr-2">
                    {showAvatar && (
                      <img
                        src={sender?.avatar}
                        alt={sender?.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    )}
                  </div>
                )}

                <div className={`max-w-[75%] ${isSent ? 'items-end' : 'items-start'} flex flex-col`}>
                  {showAvatar && (
                    <span className="text-xs mb-1 ml-1" style={{ color: 'var(--text-secondary)' }}>
                      {sender?.name}
                    </span>
                  )}

                  <div
                    className={`
                      ${isSent ? 'chat-bubble-sent rounded-2xl rounded-tr-sm' : 'chat-bubble-received rounded-2xl rounded-tl-sm'}
                      px-4 py-2.5 shadow-lg
                    `}
                  >
                    {/* File Content */}
                    {message.type === 'image' && message.file && (
                      <motion.div 
                        className="mb-2 rounded-xl overflow-hidden image-preview-container"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        whileHover={{ scale: 1.02 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                      >
                        <motion.img
                          src={message.file.url}
                          alt="Shared image"
                          className="max-w-full rounded-lg"
                          style={{ maxHeight: '200px' }}
                          whileHover={{ brightness: 1.1 }}
                        />
                      </motion.div>
                    )}

                    {(message.type === 'pdf' || message.type === 'document' || message.type === 'file') && message.file && (
                      <motion.div 
                        className="file-preview p-3 rounded-xl mb-2 flex items-center gap-3"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        whileHover={{ scale: 1.03, y: -2 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                      >
                        <motion.div 
                          className="p-2 rounded-lg" 
                          style={{ background: message.file?.type === 'pdf' ? 'linear-gradient(135deg, #EF4444 0%, #F87171 100%)' : 'linear-gradient(135deg, #0054D1 0%, #3B8BF5 100%)' }}
                          whileHover={{ rotate: [0, -5, 5, 0] }}
                          transition={{ duration: 0.4 }}
                        >
                          {message.file?.type === 'pdf' ? (
                            <FileText className="w-5 h-5 text-white" />
                          ) : (
                            <File className="w-5 h-5 text-white" />
                          )}
                        </motion.div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate text-white">
                            {message.file.name}
                          </p>
                          <p className="text-xs text-white/70">
                            {message.file.size}
                          </p>
                        </div>
                        <motion.button
                          data-testid={`download-file-${message.id}`}
                          className="p-2 rounded-lg"
                          style={{ background: 'rgba(255,255,255,0.15)' }}
                          whileHover={{ scale: 1.15, background: 'rgba(255,255,255,0.25)' }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Download className="w-4 h-4 text-white" />
                        </motion.button>
                      </motion.div>
                    )}

                    {/* Text Content */}
                    {message.content && (
                      <p className={isSent ? 'text-white' : ''} style={{ color: isSent ? 'white' : undefined }}>
                        {message.content}
                      </p>
                    )}

                    {/* Timestamp & Status */}
                    <div className={`flex items-center gap-1 mt-1 ${isSent ? 'justify-end' : 'justify-start'}`}>
                      <span className="font-mono text-[10px]" style={{ color: isSent ? 'rgba(255,255,255,0.6)' : 'var(--text-secondary)' }}>
                        {formatTime(message.timestamp)}
                      </span>
                      {isSent && (
                        <span style={{ color: message.status === 'read' ? '#60A5FA' : 'rgba(255,255,255,0.6)' }}>
                          {getStatusIcon(message.status)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Typing Indicator */}
        <AnimatePresence>
          {isTyping && (
            <motion.div
              className="flex justify-start"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
            >
              <div className="chat-bubble-received rounded-2xl rounded-tl-sm px-4 py-3">
                <div className="flex gap-1">
                  <span className="typing-dot w-2 h-2 rounded-full" style={{ background: 'var(--text-secondary)' }} />
                  <span className="typing-dot w-2 h-2 rounded-full" style={{ background: 'var(--text-secondary)' }} />
                  <span className="typing-dot w-2 h-2 rounded-full" style={{ background: 'var(--text-secondary)' }} />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={messagesEndRef} />
      </div>

      {/* Attached File Preview */}
      <AnimatePresence>
        {attachedFile && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="mx-4 mb-2"
          >
            <motion.div 
              className="file-preview p-3 rounded-xl flex items-center gap-3"
              whileHover={{ scale: 1.02 }}
            >
              {attachedFile.type === 'image' ? (
                <motion.div 
                  className="image-preview-container"
                  whileHover={{ scale: 1.05 }}
                >
                  <img 
                    src={attachedFile.url} 
                    alt="Preview" 
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                </motion.div>
              ) : (
                <motion.div 
                  className="p-2 rounded-lg" 
                  style={{ background: attachedFile.type === 'pdf' ? 'linear-gradient(135deg, #EF4444 0%, #F87171 100%)' : 'linear-gradient(135deg, #0054D1 0%, #3B8BF5 100%)' }}
                  whileHover={{ rotate: [0, -5, 5, 0] }}
                  transition={{ duration: 0.4 }}
                >
                  {attachedFile.type === 'pdf' ? (
                    <FileText className="w-5 h-5 text-white" />
                  ) : (
                    <File className="w-5 h-5 text-white" />
                  )}
                </motion.div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate text-white">
                  {attachedFile.name}
                </p>
                <p className="text-xs text-white/70">
                  {attachedFile.size}
                </p>
              </div>
              <motion.button
                data-testid="remove-attached-file"
                onClick={() => setAttachedFile(null)}
                className="p-1.5 rounded-lg"
                style={{ background: 'rgba(239, 68, 68, 0.2)' }}
                whileHover={{ scale: 1.1, background: 'rgba(239, 68, 68, 0.4)' }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="w-4 h-4 text-red-400" />
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input Area */}
      <div className="p-4 border-t" style={{ borderColor: 'var(--glass-border)' }}>
        <div className="flex items-center gap-3">
          {/* Attachment Button */}
          <div className="relative">
            <motion.button
              data-testid="attachment-button"
              onClick={() => setShowAttachMenu(!showAttachMenu)}
              className="p-3 rounded-xl glass-input"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Paperclip className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} />
            </motion.button>

            <AnimatePresence>
              {showAttachMenu && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 10 }}
                  className="absolute bottom-full mb-2 left-0 glass-panel-strong rounded-xl p-2 min-w-[160px]"
                >
                  {[
                    { icon: Upload, label: 'Upload Image', type: 'image', description: 'Drag & drop' },
                    { icon: FileText, label: 'PDF', type: 'pdf', description: 'Document' },
                    { icon: File, label: 'Document', type: 'document', description: 'Word, Excel' }
                  ].map((item) => (
                    <motion.button
                      key={item.type}
                      data-testid={`attach-${item.type}`}
                      onClick={() => handleFileSelect(item.type)}
                      className="w-full flex items-center gap-3 p-2.5 rounded-lg text-sm"
                      style={{ color: 'var(--text-primary)' }}
                      whileHover={{ background: 'rgba(255,255,255,0.08)' }}
                    >
                      <div 
                        className="p-1.5 rounded-lg"
                        style={{ background: item.type === 'image' ? 'linear-gradient(135deg, #0054D1 0%, #3B8BF5 100%)' : 'rgba(255,255,255,0.1)' }}
                      >
                        <item.icon className="w-4 h-4" style={{ color: item.type === 'image' ? 'white' : 'var(--text-secondary)' }} />
                      </div>
                      <div className="text-left">
                        <p className="font-medium">{item.label}</p>
                        <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{item.description}</p>
                      </div>
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Text Input */}
          <div className="flex-1 relative">
            <input
              type="text"
              data-testid="message-input"
              placeholder="Type a message..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              className="glass-input w-full px-4 py-3 rounded-xl pr-12"
            />
          </div>

          {/* Send Button */}
          <motion.button
            data-testid="send-message-button"
            onClick={handleSend}
            disabled={!inputValue.trim() && !attachedFile}
            className="p-3 rounded-xl btn-primary disabled:opacity-50 disabled:cursor-not-allowed relative z-10"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Send className="w-5 h-5" />
          </motion.button>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={(e) => console.log(e.target.files)}
      />

      {/* Image Upload Modal */}
      <ImageUploadModal
        isOpen={showImageUpload}
        onClose={() => setShowImageUpload(false)}
        onImageSelect={handleImageUpload}
        title="Send Image"
        subtitle="Drag and drop or browse to send an image"
        aspectRatio="wide"
        maxSizeMB={10}
      />
    </motion.div>
  );
};

export default ChatWindow;
