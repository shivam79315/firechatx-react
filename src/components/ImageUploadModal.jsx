import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Upload, 
  Image as ImageIcon, 
  Trash2, 
  Check,
  CloudUpload
} from 'lucide-react';

const ImageUploadModal = ({ 
  isOpen, 
  onClose, 
  onImageSelect, 
  title = "Upload Image",
  subtitle = "Drag and drop an image or click to browse",
  aspectRatio = "square", // "square" | "wide" | "free"
  maxSizeMB = 5
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const validateFile = (file) => {
    // Check if it's an image
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file (PNG, JPG, GIF, WebP)');
      return false;
    }

    // Check file size
    const sizeMB = file.size / (1024 * 1024);
    if (sizeMB > maxSizeMB) {
      setError(`Image size must be less than ${maxSizeMB}MB`);
      return false;
    }

    setError('');
    return true;
  };

  const processFile = (file) => {
    if (!validateFile(file)) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview({
        url: e.target.result,
        name: file.name,
        size: (file.size / 1024).toFixed(1) + ' KB',
        file: file
      });
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  }, []);

  const handleFileSelect = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleConfirm = () => {
    if (preview) {
      onImageSelect(preview);
      handleClose();
    }
  };

  const handleClose = () => {
    setPreview(null);
    setError('');
    setIsDragging(false);
    onClose();
  };

  const clearPreview = () => {
    setPreview(null);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getAspectClass = () => {
    switch (aspectRatio) {
      case 'square': return 'aspect-square';
      case 'wide': return 'aspect-video';
      default: return '';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
        >
          <motion.div
            className="glass-panel-strong w-full max-w-lg rounded-3xl p-6 overflow-hidden"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                  {title}
                </h3>
                <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                  {subtitle}
                </p>
              </div>
              <motion.button
                data-testid="close-upload-modal"
                onClick={handleClose}
                className="p-2 rounded-xl glass-input"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <X className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} />
              </motion.button>
            </div>

            {/* Drop Zone */}
            {!preview ? (
              <motion.div
                data-testid="image-drop-zone"
                className={`
                  relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer
                  transition-all duration-300 ${getAspectClass()}
                  ${isDragging 
                    ? 'border-blue-500 bg-blue-500/10' 
                    : 'border-white/20 hover:border-white/40 hover:bg-white/5'
                  }
                `}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                animate={isDragging ? { scale: 1.02 } : { scale: 1 }}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                  data-testid="file-input"
                />

                <motion.div
                  className="flex flex-col items-center justify-center h-full"
                  animate={isDragging ? { y: -5 } : { y: 0 }}
                >
                  <motion.div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
                    style={{ background: isDragging ? 'linear-gradient(135deg, #0054D1 0%, #3B8BF5 100%)' : 'rgba(255,255,255,0.1)' }}
                    animate={isDragging ? { rotate: [0, -5, 5, 0], scale: 1.1 } : { rotate: 0, scale: 1 }}
                    transition={{ duration: 0.5, repeat: isDragging ? Infinity : 0 }}
                  >
                    {isDragging ? (
                      <CloudUpload className="w-8 h-8 text-white" />
                    ) : (
                      <ImageIcon className="w-8 h-8" style={{ color: 'var(--text-secondary)' }} />
                    )}
                  </motion.div>

                  <motion.p 
                    className="text-lg font-medium mb-2"
                    style={{ color: isDragging ? '#3B8BF5' : 'var(--text-primary)' }}
                  >
                    {isDragging ? 'Drop your image here' : 'Drag & drop image here'}
                  </motion.p>
                  
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    or <span className="text-blue-400 underline">browse files</span>
                  </p>
                  
                  <p className="text-xs mt-3" style={{ color: 'var(--text-secondary)' }}>
                    PNG, JPG, GIF, WebP up to {maxSizeMB}MB
                  </p>
                </motion.div>

                {/* Animated border effect when dragging */}
                {isDragging && (
                  <motion.div
                    className="absolute inset-0 rounded-2xl pointer-events-none"
                    style={{ 
                      background: 'linear-gradient(90deg, transparent, rgba(59, 139, 245, 0.3), transparent)',
                      backgroundSize: '200% 100%'
                    }}
                    animate={{ backgroundPosition: ['200% 0', '-200% 0'] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                  />
                )}
              </motion.div>
            ) : (
              /* Preview */
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative"
              >
                <div 
                  className={`relative rounded-2xl overflow-hidden ${getAspectClass()}`}
                  style={{ background: '#354050' }}
                >
                  <img
                    src={preview.url}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    data-testid="image-preview"
                  />
                  
                  {/* Overlay with info */}
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <div className="p-4 w-full">
                      <p className="text-white font-medium truncate">{preview.name}</p>
                      <p className="text-white/70 text-sm">{preview.size}</p>
                    </div>
                  </motion.div>
                </div>

                {/* Remove button */}
                <motion.button
                  data-testid="remove-preview"
                  onClick={clearPreview}
                  className="absolute top-3 right-3 p-2 rounded-full"
                  style={{ background: 'rgba(239, 68, 68, 0.9)' }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Trash2 className="w-4 h-4 text-white" />
                </motion.button>
              </motion.div>
            )}

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mt-4 p-3 rounded-xl text-sm text-red-400"
                  style={{ background: 'rgba(239, 68, 68, 0.1)' }}
                  data-testid="upload-error"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Actions */}
            <div className="flex gap-3 mt-6">
              <motion.button
                data-testid="cancel-upload"
                onClick={handleClose}
                className="flex-1 py-3 rounded-xl font-medium glass-input"
                style={{ color: 'var(--text-primary)' }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Cancel
              </motion.button>
              <motion.button
                data-testid="confirm-upload"
                onClick={handleConfirm}
                disabled={!preview}
                className="flex-1 py-3 rounded-xl font-medium flex items-center justify-center gap-2 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ background: preview ? 'linear-gradient(135deg, #0054D1 0%, #3B8BF5 100%)' : 'rgba(255,255,255,0.1)' }}
                whileHover={preview ? { scale: 1.02 } : {}}
                whileTap={preview ? { scale: 0.98 } : {}}
              >
                <Check className="w-5 h-5" />
                {title.includes('Profile') ? 'Set as Avatar' : 'Send Image'}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ImageUploadModal;
