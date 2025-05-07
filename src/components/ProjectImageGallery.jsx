
import { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

import { ChevronLeft, ChevronRight, Maximize, Minimize, X } from 'lucide-react';
import ImageGallery from 'react-image-gallery';
// import stylesheet if you're not already using CSS @import
import 'react-image-gallery/styles/css/image-gallery.css';

export default function ProjectImageGallery({ gallery }) {
  const [ galleryIndex, setGalleryIndex ] = useState(-1);

  // Handlers
  const openAt = useCallback((idx) => setGalleryIndex(idx), []);
  const closeGallery = useCallback(() => setGalleryIndex(-1), []);

  useEffect(() => {
    if (galleryIndex < 0) return;
    const onKey = (e) => {
      if (e.key === 'Escape') closeGallery();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [ closeGallery, galleryIndex ]);
  
  return (
    <>
      {gallery.map((item, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          exit={{ opacity: 0, y: -20 }}
          whileHover={{ scale: 1.05, opacity: .9 }}
          transition={{ type: 'spring', stiffness: 300 }}
          className="overflow-hidden rounded-lg shadow-lg"
          onClick={() => openAt(idx)}
        >
          <img
            key={idx}
            src={item.img}
            alt={item.alt}
            className="object-cover cursor-pointer hover:scale-105 transition-transform duration-200"
          />
        </motion.div>
      ))}

      {galleryIndex >= 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
          <button
            className="group absolute top-4 right-4 text-white text-3xl p-2 bg-black/50 rounded-full60 transition"
            style={{ zIndex: 100 }}
            onClick={closeGallery}
          >
            <X className="w-5 h-5 text-white group-hover:text-red-200 transition" />
          </button>
          <div className="w-full h-full relative z-40">
            <ImageGallery
              items={gallery.map((item) => ({ original: item.img, thumbnail: item.img, description: item.alt }))}
              startIndex={galleryIndex}
              lazyLoad={true}
              showThumbnails={true}
              showPlayButton={false}
              showNav={true}
              showFullscreenButton={true}
              loading="lazy"
              additionalClass="!h-full"
              onSlide={(i) => setGalleryIndex(i)}
              onScreenChange={(fullScreen) => {
                if (!fullScreen) closeGallery();
              }}
              renderLeftNav={(onClick, disabled) => (
                <button
                  onClick={onClick}
                  disabled={disabled}
                  className="group absolute left-4 top-1/2 transform -translate-y-1/2 z-50 p-2 bg-black/50 rounded-full transition"
                  style={{ width: 32, height: 32 }}
                >
                  <ChevronLeft className="w-6 h-6 text-white group-hover:text-red-200 transition" />
                </button>
              )}
              renderRightNav={(onClick, disabled) => (
                <button
                  onClick={onClick}
                  disabled={disabled}
                  className="group absolute right-4 top-1/2 transform -translate-y-1/2 z-50 p-2 bg-black/50 rounded-full transition"
                  style={{ width: 32, height: 32 }}
                >
                  <ChevronRight className="w-6 h-6 text-white group-hover:text-red-200 transition" />
                </button>
              )}
              renderFullscreenButton={(onClick, isFullScreen) => {
                if (isFullScreen) {

                }
                return (
                  <button
                    onClick={onClick}
                    className="group absolute bottom-4 right-4 z-50 p-2 bg-black/50 rounded-full hover:text-red-200 transition"
                    style={{ width: 32, height: 32 }}
                  >
                    {
                      isFullScreen
                        ? <Minimize className="w-5 h-5 text-white group-hover:text-red-200 transition" />
                        : <Maximize className="w-5 h-5 text-white group-hover:text-red-200 transition" />
                    }
                  </button>
                )
              }}
            />
          </div>
        </div>
      )}
    </>
  )
}
