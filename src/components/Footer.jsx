import React, { useEffect, useState } from 'react';

import { motion } from 'framer-motion';

import { useForm, ValidationError } from '@formspree/react';

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const GITHUB_SOCIAL_IMG_BASE_URL = 'https://vudoan1708-cyber.github.io/logos/portfolio/socials';

export default function Footer() {
  const [ state, handleSubmit ] = useForm('xqaqbqjj');
  const [ email, setEmail ] = useState('');
  const [ message, setMessage ] = useState('');

  useEffect(() => {
    if (state.succeeded) {
      toast.success('Your message has been sent to me! 🎉');
      setEmail('');
      setMessage('');
      // If you want to allow another submission, you can call reset() here
    }
  }, [ state.succeeded ]);
  return (
    <>
     <footer className="bg-black text-white py-12 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 justify-between">
         {/* Left: contact form */}
          <div>
            <h3 className="text-2xl font-semibold mb-4">Get in Touch</h3>
            <form action="https://formspree.io/f/xqaqbqjj" method="POST" onSubmit={handleSubmit} className="space-y-4">
              <input
                type="email"
                name="email"
                required
                placeholder="Your email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full p-3 rounded bg-white text-black focus:outline-none"
              />
              <ValidationError 
                prefix="Email" 
                field="email"
                errors={state.errors}
              />
             <textarea
                name="message"
                required
                placeholder="Your message"
                value={message}
                onChange={e => setMessage(e.target.value)}
                className="w-full p-3 rounded bg-white text-black h-32 focus:outline-none"
              />
              <ValidationError 
                prefix="Message" 
                field="message"
                errors={state.errors}
              />
              <button
                type="submit"
                className="bg-gray-700 hover:bg-gray-600 transition px-6 py-3 rounded"
                disabled={state.submitting || !email || !message}
              >
                Send
              </button>
            </form>
          </div>

          {/* Right: contact info + social links */}
          <div className="space-y-4 sm:justify-self-end">
            <h3 className="text-2xl font-semibold">Contact Info</h3>
            <p>📞 +44 7877 854 757</p>
            <p>✉️ vutd1708@gmail.com</p>
            <p>🏠 Skinner Lane, Leeds, UK</p>
            <div className="flex space-x-4 mt-4">
              <motion.a
                href="https://github.com/vudoan1708-cyber"
                target="_blank"
                rel="noreferrer"
                whileHover={{ scale: 1.05, opacity: .9 }}
                transition={{ type: 'spring', stiffness: 300 }}>
                <img src={`${GITHUB_SOCIAL_IMG_BASE_URL}/github.webp`} alt="GitHub" className="w-8 h-8 rounded" />
              </motion.a>
              <motion.a
                href="https://www.linkedin.com/in/vu-doan-812490154/"
                target="_blank"
                rel="noreferrer"
                whileHover={{ scale: 1.05, opacity: .9 }}
                transition={{ type: 'spring', stiffness: 300 }}>
                <img src={`${GITHUB_SOCIAL_IMG_BASE_URL}/linkedin.webp`} alt="LinkedIn" className="w-8 h-8 rounded" />
              </motion.a>
              <motion.a
                href="https://www.youtube.com/channel/UCgNT0Z2gaKgba8_zCRhIZrA?view_as=subscriber"
                target="_blank"
                rel="noreferrer"
                whileHover={{ scale: 1.05, opacity: .9 }}
                transition={{ type: 'spring', stiffness: 300 }}>
                <img src={`${GITHUB_SOCIAL_IMG_BASE_URL}/youtube.webp`} alt="YouTube" className="w-8 h-8 rounded" />
              </motion.a>
              <motion.a
                href="https://www.fiverr.com/vu_doan?public_mode=true"
                target="_blank"
                rel="noreferrer"
                whileHover={{ scale: 1.05, opacity: .9 }}
                transition={{ type: 'spring', stiffness: 300 }}>
                <img src={`${GITHUB_SOCIAL_IMG_BASE_URL}/fiverr.svg`} alt="YouTube" className="w-8 h-8 rounded" />
              </motion.a>
            </div>
          </div>
        </div>
      </footer>
      {/* Toast container for message feedback */}
      <ToastContainer position="bottom-center" autoClose={3000} />
   </>
  );
}
