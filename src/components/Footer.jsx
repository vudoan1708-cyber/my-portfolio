import React, { useState } from 'react';

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: wire up your email-sending API here
    toast.success('Your message has been sent to me! 🎉');
    setEmail('');
    setMessage('');
  };
  return (
    <>
     <footer className="bg-black text-white py-12 px-4 sm:px-8">
       <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
         {/* Left: contact form */}
         <div>
           <h3 className="text-2xl font-semibold mb-4">Get in Touch</h3>
           <form onSubmit={handleSubmit} className="space-y-4">
             <input
               type="email"
               required
               placeholder="Your email"
               value={email}
               onChange={e => setEmail(e.target.value)}
               className="w-full p-3 rounded bg-white text-black focus:outline-none"
             />
             <textarea
               required
               placeholder="Your message"
               value={message}
               onChange={e => setMessage(e.target.value)}
               className="w-full p-3 rounded bg-white text-black h-32 focus:outline-none"
             />
             <button
               type="submit"
               className="bg-gray-700 hover:bg-gray-600 transition px-6 py-3 rounded"
             >
               Send
             </button>
           </form>
         </div>

         {/* Right: contact info + social links */}
         <div className="space-y-4">
           <h3 className="text-2xl font-semibold">Contact Info</h3>
           <p>📞 +44 1234 567890</p>
           <p>✉️ youremail@example.com</p>
           <p>🏠 123 Your Street, City, Country</p>
           <div className="flex space-x-4 mt-4">
             <a href="https://github.com/yourusername" target="_blank" rel="noreferrer">
               <img src="/icons/github.svg" alt="GitHub" className="w-6 h-6" />
             </a>
             <a href="https://linkedin.com/in/yourusername" target="_blank" rel="noreferrer">
               <img src="/icons/linkedin.svg" alt="LinkedIn" className="w-6 h-6" />
             </a>
             <a href="https://youtube.com/yourchannel" target="_blank" rel="noreferrer">
               <img src="/icons/youtube.svg" alt="YouTube" className="w-6 h-6" />
             </a>
           </div>
         </div>
       </div>
     </footer>
     {/* Toast container for message feedback */}
     <ToastContainer position="bottom-center" autoClose={3000} />
   </>
  );
}
