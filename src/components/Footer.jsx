'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useForm, ValidationError } from '@formspree/react';
import { toast, ToastContainer } from 'react-toastify';

const GITHUB_SOCIAL_IMG_BASE_URL =
  'https://vudoan1708-cyber.github.io/logos/portfolio/socials';

const SOCIALS = [
  {
    href: 'https://github.com/vudoan1708-cyber',
    label: 'GitHub',
    icon: `${GITHUB_SOCIAL_IMG_BASE_URL}/github.webp`,
  },
  {
    href: 'https://www.linkedin.com/in/vu-doan-812490154/',
    label: 'LinkedIn',
    icon: `${GITHUB_SOCIAL_IMG_BASE_URL}/linkedin.webp`,
  },
  {
    href: 'https://www.youtube.com/channel/UCgNT0Z2gaKgba8_zCRhIZrA?view_as=subscriber',
    label: 'YouTube',
    icon: `${GITHUB_SOCIAL_IMG_BASE_URL}/youtube.webp`,
  },
  {
    href: 'https://www.fiverr.com/vu_doan?public_mode=true',
    label: 'Fiverr',
    icon: `${GITHUB_SOCIAL_IMG_BASE_URL}/fiverr.svg`,
  },
];

export default function Footer() {
  const [state, handleSubmit] = useForm('xqaqbqjj');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const disabled = state.submitting || !email || !message;

  useEffect(() => {
    if (state.succeeded) {
      toast.success('Your message has been sent. Thank you for reaching out.');
      setEmail('');
      setMessage('');
    }
  }, [state.succeeded]);

  return (
    <>
      <footer className="relative z-10 bg-black border-t border-white/5 text-white py-16 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 justify-between">
          <div>
            <h3 className="text-2xl font-semibold mb-2">Get in touch</h3>
            <p className="text-white/60 mb-6 text-sm">
              Whether you have a project in mind or simply want to connect, I would be glad to hear from you.
            </p>
            <form
              action="https://formspree.io/f/xqaqbqjj"
              method="POST"
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              <input
                type="email"
                name="email"
                required
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:border-rose-300/60 focus:bg-white/10 transition"
              />
              <ValidationError prefix="Email" field="email" errors={state.errors} />
              <textarea
                name="message"
                required
                placeholder="Your message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/40 h-32 focus:outline-none focus:border-rose-300/60 focus:bg-white/10 transition"
              />
              <ValidationError prefix="Message" field="message" errors={state.errors} />
              <button
                type="submit"
                title={
                  disabled
                    ? 'Please fill in your email and message before submitting'
                    : undefined
                }
                className={`${
                  disabled
                    ? 'bg-white/10 text-white/40 cursor-not-allowed'
                    : 'bg-rose-500 hover:bg-rose-400 text-white cursor-pointer'
                } transition px-6 py-3 rounded-lg font-medium`}
                disabled={disabled}
              >
                Send
              </button>
            </form>
          </div>

          <div className="space-y-4 md:justify-self-end">
            <h3 className="text-2xl font-semibold">Contact details</h3>
            <ul className="space-y-2 text-white/80">
              <li>📞 +44 7877 854 757</li>
              <li>✉️ vutd1708@gmail.com</li>
              <li>🏠 Skinner Lane, Leeds, UK</li>
            </ul>
            <div className="flex space-x-3 pt-2">
              {SOCIALS.map((s) => (
                <motion.a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.label}
                  whileHover={{ scale: 1.08, opacity: 0.9 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  className="block"
                >
                  <Image
                    src={s.icon}
                    alt={s.label}
                    width={32}
                    height={32}
                    className="w-8 h-8 rounded"
                  />
                </motion.a>
              ))}
            </div>
            <p className="pt-8 text-xs text-white/40">
              © {new Date().getFullYear()} Vu Doan. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
      <ToastContainer position="bottom-center" autoClose={3000} theme="dark" />
    </>
  );
}
