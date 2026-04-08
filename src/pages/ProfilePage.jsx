import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import GlassCard from '../components/GlassCard';
import BackgroundOrbs from '../components/BackgroundOrbs';
import ImageUploadModal from '../components/ImageUploadModal';
import { 
  ArrowLeft, 
  Camera, 
  User, 
  Mail, 
  Sun, 
  Moon, 
  LogOut, 
  Loader2,
  Check,
  MessageCircle,
  Image,
  FileText,
  Link2,
  Calendar,
  MapPin,
  Briefcase,
  Edit3,
  X,
  Download,
  Upload
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const { user, updateProfile, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState('media');
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [showAvatarUpload, setShowAvatarUpload] = useState(false);
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    avatar: user?.avatar || '',
    bio: user?.bio || 'Hey there! I am using LiquidChat.',
    location: user?.location || 'San Francisco, CA',
    work: user?.work || 'Software Developer'
  });

  console.log("ProfilePage render - user:", user);


  const avatarOptions = [
    'https://images.pexels.com/photos/764529/pexels-photo-764529.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=150&w=150',
    'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=150&w=150',
    'https://images.pexels.com/photos/2444708/pexels-photo-2444708.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=150&w=150',
    'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=150&w=150',
    'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=150&w=150',
    'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=150&w=150',
  ];

  // Dummy shared media
  const sharedMedia = [
    // { id: 1, type: 'image', url: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=400', date: '2 days ago' },
  ];

  const sharedDocs = [
    { id: 1, name: 'Project_Proposal.pdf', type: 'pdf', size: '2.4 MB', date: 'Jan 15, 2026' },
    { id: 2, name: 'Design_Specs.docx', type: 'document', size: '1.8 MB', date: 'Jan 12, 2026' },
    { id: 3, name: 'Meeting_Notes.pdf', type: 'pdf', size: '856 KB', date: 'Jan 10, 2026' },
    { id: 4, name: 'Budget_Report.xlsx', type: 'document', size: '3.2 MB', date: 'Jan 8, 2026' },
  ];

  const sharedLinks = [
    { id: 1, title: 'Figma Design Board', url: 'figma.com/file/abc123', date: 'Jan 16, 2026' },
    { id: 2, title: 'GitHub Repository', url: 'github.com/project/repo', date: 'Jan 14, 2026' },
    { id: 3, title: 'Documentation Wiki', url: 'notion.so/team-docs', date: 'Jan 11, 2026' },
  ];

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateProfile(formData);
      setShowSuccess(true);
      setIsEditing(false);
      setTimeout(() => setShowSuccess(false), 2000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen p-4 md:p-8 relative overflow-hidden" style={{ background: 'var(--background)' }}>
      <BackgroundOrbs />
      
      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <motion.div 
          className="flex items-center gap-4 mb-8"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <motion.button
            data-testid="back-to-chat-button"
            onClick={() => navigate('/chat')}
            className="p-2.5 rounded-xl glass-panel"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft className="w-5 h-5" style={{ color: 'var(--text-primary)' }} />
          </motion.button>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Profile & Settings
          </h1>
        </motion.div>

        {/* Profile Card */}
        <GlassCard className="p-6 md:p-8 mb-6">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8">
            {/* Avatar with Animation */}
            <motion.div 
              className="relative"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
            >
              <motion.div
                className="relative"
                whileHover={{ scale: 1.08 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                {/* Animated ring */}
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{ 
                    background: 'linear-gradient(135deg, #0054D1 0%, #3B8BF5 50%, #0054D1 100%)',
                    padding: '4px'
                  }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                />
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{ 
                    background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.3) 50%, transparent 70%)',
                  }}
                  animate={{ rotate: -360 }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                />
                <img
                  src={formData.avatar || user?.avatar}
                  alt={user?.name}
                  className="w-32 h-32 rounded-full object-cover border-4 relative z-10"
                  style={{ borderColor: 'var(--background)' }}
                />
                {/* Online pulse */}
                <motion.div
                  className="absolute bottom-2 right-2 w-5 h-5 rounded-full bg-green-500 border-2 z-20"
                  style={{ borderColor: 'var(--background)' }}
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </motion.div>
              {isEditing && (
                <motion.button
                  data-testid="open-avatar-upload"
                  onClick={() => setShowAvatarUpload(true)}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute bottom-0 right-0 p-2.5 rounded-full z-30"
                  style={{ background: 'linear-gradient(135deg, #0054D1 0%, #3B8BF5 100%)' }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Camera className="w-4 h-4 text-white" />
                </motion.button>
              )}
            </motion.div>
            
            {/* User Info */}
            <motion.div 
              className="flex-1 text-center md:text-left"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              {isEditing ? (
                <input
                  type="text"
                  data-testid="profile-name-input"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="glass-input text-xl font-semibold px-4 py-2 rounded-xl w-full max-w-xs mb-2"
                />
              ) : (
                <h2 className="text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                  {user?.name}
                </h2>
              )}
              <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
                {user?.email}
              </p>
              
              {/* Bio */}
              {isEditing ? (
                <textarea
                  data-testid="profile-bio-input"
                  value={formData.bio}
                  onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                  className="glass-input text-sm px-4 py-2 rounded-xl w-full resize-none"
                  rows={2}
                  placeholder="Write something about yourself..."
                />
              ) : (
                <p className="text-sm mb-4" style={{ color: 'var(--text-primary)' }}>
                  {formData.bio}
                </p>
              )}
              
              {/* Quick Info */}
              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                <motion.div 
                  className="flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                >
                  <MapPin className="w-4 h-4" style={{ color: 'var(--primary-action)' }} />
                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                        className="glass-input text-sm px-2 py-1 rounded-lg w-32"
                      />
                    ) : formData.location}
                  </span>
                </motion.div>
                <motion.div 
                  className="flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                >
                  <Briefcase className="w-4 h-4" style={{ color: 'var(--primary-action)' }} />
                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.work}
                        onChange={(e) => setFormData(prev => ({ ...prev, work: e.target.value }))}
                        className="glass-input text-sm px-2 py-1 rounded-lg w-40"
                      />
                    ) : formData.work}
                  </span>
                </motion.div>
                <motion.div 
                  className="flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                >
                  <Calendar className="w-4 h-4" style={{ color: 'var(--primary-action)' }} />
                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    Joined Jan 2026
                  </span>
                </motion.div>
              </div>
            </motion.div>

            {/* Edit Button */}
            <motion.button
              data-testid="edit-profile-button"
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
              className="p-3 rounded-xl"
              style={{ background: 'linear-gradient(135deg, #0054D1 0%, #3B8BF5 100%)' }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isSaving ? (
                <Loader2 className="w-5 h-5 text-white animate-spin" />
              ) : isEditing ? (
                <Check className="w-5 h-5 text-white" />
              ) : (
                <Edit3 className="w-5 h-5 text-white" />
              )}
            </motion.button>
          </div>

          {/* Avatar Selection */}
          <AnimatePresence>
            {isEditing && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6"
              >
                <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
                  Choose Avatar
                </p>
                <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                  {avatarOptions.map((avatar, idx) => (
                    <motion.button
                      key={idx}
                      data-testid={`avatar-option-${idx}`}
                      onClick={() => setFormData(prev => ({ ...prev, avatar }))}
                      className="relative"
                      whileHover={{ scale: 1.15, rotate: 5 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <img
                        src={avatar}
                        alt={`Avatar ${idx + 1}`}
                        className={`w-14 h-14 rounded-full object-cover border-2 transition-all ${
                          formData.avatar === avatar 
                            ? 'border-blue-500 ring-2 ring-blue-500/50' 
                            : 'border-transparent'
                        }`}
                      />
                      {formData.avatar === avatar && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center"
                          style={{ background: 'linear-gradient(135deg, #0054D1 0%, #3B8BF5 100%)' }}
                        >
                          <Check className="w-3 h-3 text-white" />
                        </motion.div>
                      )}
                    </motion.button>
                  ))}
                </div>
                
                <motion.button
                  data-testid="cancel-edit-button"
                  onClick={() => {
                    setIsEditing(false);
                    setFormData({ 
                      name: user?.name, 
                      avatar: user?.avatar,
                      bio: user?.bio || 'Hey there! I am using LiquidChat.',
                      location: user?.location || 'San Francisco, CA',
                      work: user?.work || 'Software Developer'
                    });
                  }}
                  className="mt-4 px-4 py-2 rounded-xl glass-input text-sm"
                  style={{ color: 'var(--text-primary)' }}
                  whileHover={{ scale: 1.02 }}
                >
                  Cancel
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Success Message */}
          <AnimatePresence>
            {showSuccess && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mb-4 p-3 rounded-xl text-center text-green-400"
                style={{ background: 'rgba(34, 197, 94, 0.1)' }}
              >
                Profile updated successfully!
              </motion.div>
            )}
          </AnimatePresence>

          {/* Shared Content Tabs */}
          <div className="border-t pt-6" style={{ borderColor: 'var(--glass-border)' }}>
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
              {[
                { id: 'media', icon: Image, label: 'Media' },
                { id: 'docs', icon: FileText, label: 'Documents' },
                { id: 'links', icon: Link2, label: 'Links' }
              ].map((tab) => (
                <motion.button
                  key={tab.id}
                  data-testid={`tab-${tab.id}`}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                    activeTab === tab.id ? 'text-white' : ''
                  }`}
                  style={{ 
                    background: activeTab === tab.id 
                      ? 'linear-gradient(135deg, #0054D1 0%, #3B8BF5 100%)' 
                      : 'rgba(255,255,255,0.05)',
                    color: activeTab === tab.id ? 'white' : 'var(--text-secondary)'
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </motion.button>
              ))}
            </div>

            {/* Media Grid */}
            {activeTab === 'media' && (
              <motion.div 
                className="grid grid-cols-3 gap-3"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {sharedMedia.map((media, idx) => (
                  <motion.button
                    key={media.id}
                    data-testid={`media-item-${media.id}`}
                    variants={itemVariants}
                    className="relative aspect-square rounded-xl overflow-hidden group"
                    style={{ background: '#354050' }}
                    onClick={() => setSelectedMedia(media)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <img
                      src={media.url}
                      alt={`Shared media ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <motion.div 
                      className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                      initial={false}
                    >
                      <span className="text-white text-xs">{media.date}</span>
                    </motion.div>
                  </motion.button>
                ))}
              </motion.div>
            )}

            {/* Documents List */}
            {activeTab === 'docs' && (
              <motion.div 
                className="space-y-3"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {sharedDocs.map((doc) => (
                  <motion.div
                    key={doc.id}
                    data-testid={`doc-item-${doc.id}`}
                    variants={itemVariants}
                    className="file-preview p-4 rounded-xl flex items-center gap-4"
                    whileHover={{ scale: 1.02, y: -2 }}
                  >
                    <motion.div 
                      className="p-3 rounded-xl"
                      style={{ background: doc.type === 'pdf' ? 'linear-gradient(135deg, #EF4444 0%, #F87171 100%)' : 'linear-gradient(135deg, #0054D1 0%, #3B8BF5 100%)' }}
                      whileHover={{ rotate: [0, -5, 5, 0] }}
                      transition={{ duration: 0.4 }}
                    >
                      <FileText className="w-5 h-5 text-white" />
                    </motion.div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate text-white">{doc.name}</p>
                      <p className="text-xs text-white/60">{doc.size} • {doc.date}</p>
                    </div>
                    <motion.button
                      className="p-2 rounded-lg"
                      style={{ background: 'rgba(255,255,255,0.1)' }}
                      whileHover={{ scale: 1.1, background: 'rgba(255,255,255,0.2)' }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Download className="w-4 h-4 text-white" />
                    </motion.button>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* Links List */}
            {activeTab === 'links' && (
              <motion.div 
                className="space-y-3"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {sharedLinks.map((link) => (
                  <motion.a
                    key={link.id}
                    href={`https://${link.url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-testid={`link-item-${link.id}`}
                    variants={itemVariants}
                    className="file-preview p-4 rounded-xl flex items-center gap-4 block"
                    whileHover={{ scale: 1.02, y: -2 }}
                  >
                    <motion.div 
                      className="p-3 rounded-xl"
                      style={{ background: 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)' }}
                      whileHover={{ rotate: [0, -5, 5, 0] }}
                      transition={{ duration: 0.4 }}
                    >
                      <Link2 className="w-5 h-5 text-white" />
                    </motion.div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate text-white">{link.title}</p>
                      <p className="text-xs text-white/60 truncate">{link.url} • {link.date}</p>
                    </div>
                  </motion.a>
                ))}
              </motion.div>
            )}
          </div>
        </GlassCard>

        {/* Settings Card */}
        <GlassCard className="p-6 md:p-8">
          <h3 className="text-lg font-semibold mb-6" style={{ color: 'var(--text-primary)' }}>
            Preferences
          </h3>

          {/* Theme Toggle */}
          <div className="flex items-center justify-between p-4 rounded-xl mb-4" style={{ background: 'rgba(255,255,255,0.03)' }}>
            <div className="flex items-center gap-3">
              {theme === 'dark' ? (
                <Moon className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} />
              ) : (
                <Sun className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} />
              )}
              <div>
                <p className="font-medium" style={{ color: 'var(--text-primary)' }}>Theme</p>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                  {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
                </p>
              </div>
            </div>
            <motion.button
              data-testid="theme-toggle-button"
              onClick={toggleTheme}
              className="relative w-14 h-8 rounded-full p-1 transition-colors"
              style={{ background: theme === 'dark' ? 'linear-gradient(135deg, #0054D1 0%, #3B8BF5 100%)' : 'rgba(255,255,255,0.2)' }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                className="w-6 h-6 rounded-full bg-white shadow-lg flex items-center justify-center"
                animate={{ x: theme === 'dark' ? 22 : 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              >
                {theme === 'dark' ? (
                  <Moon className="w-3 h-3 text-blue-600" />
                ) : (
                  <Sun className="w-3 h-3 text-yellow-500" />
                )}
              </motion.div>
            </motion.button>
          </div>

          {/* Logout Button */}
          <motion.button
            data-testid="logout-button"
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 p-4 rounded-xl text-red-400 transition-colors"
            style={{ background: 'rgba(239, 68, 68, 0.1)' }}
            whileHover={{ scale: 1.02, background: 'rgba(239, 68, 68, 0.2)' }}
            whileTap={{ scale: 0.98 }}
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Sign Out</span>
          </motion.button>
        </GlassCard>
      </div>

      {/* Media Lightbox */}
      <AnimatePresence>
        {selectedMedia && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedMedia(null)}
          >
            <motion.div
              className="relative max-w-3xl w-full"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <motion.button
                className="absolute -top-12 right-0 p-2 rounded-full glass-panel"
                onClick={() => setSelectedMedia(null)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="w-6 h-6" style={{ color: 'var(--text-primary)' }} />
              </motion.button>
              <img
                src={selectedMedia.url}
                alt="Full size media"
                className="w-full rounded-2xl"
                style={{ background: '#354050' }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Avatar Upload Modal */}
      <ImageUploadModal
        isOpen={showAvatarUpload}
        onClose={() => setShowAvatarUpload(false)}
        onImageSelect={(imageData) => {
          setFormData(prev => ({ ...prev, avatar: imageData.url }));
        }}
        title="Update Profile Picture"
        subtitle="Upload a new avatar image"
        aspectRatio="square"
        maxSizeMB={5}
      />
    </div>
  );
};

export default ProfilePage;
