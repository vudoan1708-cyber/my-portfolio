'use client';

import { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Maximize, Minimize, X } from 'lucide-react';
import ImageGallery from 'react-image-gallery';

export default function ProjectImageGallery({ gallery }) {
  const [galleryIndex, setGalleryIndex] = useState(-1);

  const openAt = useCallback((idx) => setGalleryIndex(idx), []);
  const closeGallery = useCallback(() => setGalleryIndex(-1), []);

  useEffect(() => {
    if (galleryIndex < 0) return;
    const onKey = (e) => {
      if (e.key === 'Escape') closeGallery();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [closeGallery, galleryIndex]);

  return (
    <>
      {gallery.map((item, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          whileHover={{ scale: 1.03, opacity: 0.95 }}
          transition={{ type: 'spring', stiffness: 300 }}
          className="overflow-hidden rounded-xl shadow-lg ring-1 ring-white/10 cursor-pointer"
          onClick={() => openAt(idx)}
        >
          <img
            src={item.img}
            alt={item.alt}
            className="object-cover w-full h-full transition-transform duration-300"
            loading="lazy"
          />
        </motion.div>
      ))}

      {galleryIndex >= 0 && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center">
          <button
            className="group absolute top-4 right-4 text-white p-2 bg-black/60 rounded-full transition hover:bg-black/80"
            style={{ zIndex: 100 }}
            onClick={closeGallery}
            aria-label="Close gallery"
          >
            <X className="w-5 h-5 text-white group-hover:text-rose-300 transition" />
          </button>
          <div className="w-full h-full relative z-40">
            <ImageGallery
              items={gallery.map((item) => ({
                original: item.img,
                thumbnail: item.img,
                description: item.alt,
              }))}
              startIndex={galleryIndex}
              lazyLoad
              showThumbnails
              showPlayButton={false}
              showNav
              showFullscreenButton
              additionalClass="!h-full"
              onSlide={(i) => setGalleryIndex(i)}
              onScreenChange={(fullScreen) => {
                if (!fullScreen) closeGallery();
              }}
              renderLeftNav={(onClick, disabled) => (
                <button
                  onClick={onClick}
                  disabled={disabled}
                  className="group absolute left-4 top-1/2 -translate-y-1/2 z-50 p-2 bg-black/60 rounded-full transition hover:bg-black/80"
                  style={{ width: 40, height: 40 }}
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-6 h-6 text-white group-hover:text-rose-300 transition" />
                </button>
              )}
              renderRightNav={(onClick, disabled) => (
                <button
                  onClick={onClick}
                  disabled={disabled}
                  className="group absolute right-4 top-1/2 -translate-y-1/2 z-50 p-2 bg-black/60 rounded-full transition hover:bg-black/80"
                  style={{ width: 40, height: 40 }}
                  aria-label="Next image"
                >
                  <ChevronRight className="w-6 h-6 text-white group-hover:text-rose-300 transition" />
                </button>
              )}
              renderFullscreenButton={(onClick, isFullScreen) => (
                <button
                  onClick={onClick}
                  className="group absolute bottom-4 right-4 z-50 p-2 bg-black/60 rounded-full transition hover:bg-black/80"
                  style={{ width: 40, height: 40 }}
                  aria-label="Toggle fullscreen"
                >
                  {isFullScreen ? (
                    <Minimize className="w-5 h-5 text-white group-hover:text-rose-300 transition" />
                  ) : (
                    <Maximize className="w-5 h-5 text-white group-hover:text-rose-300 transition" />
                  )}
                </button>
              )}
            />
          </div>
        </div>
      )}
    </>
  );
}
