import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function LandingPage() {
  const [showPopup, setShowPopup] = useState(true);

  // Auto-close the popup after 1 seconds
  useEffect(() => {
    if (showPopup) {
      const timer = setTimeout(() => {
        setShowPopup(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [showPopup]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-[#EAE0CF] font-sans flex flex-col relative overflow-hidden">
      
      {/* Pop-up Animasi Tengah Layar Putih */}
      {showPopup && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white transition-opacity duration-500">
          <img 
            src="/image/Logo_only.png" 
            alt="Digo Logo" 
            className="w-32 h-32 md:w-48 md:h-48 object-contain animate-bounce mix-blend-multiply"
          />
          <img 
            src="/image/textdigo.png" 
            alt="Digo Text" 
            className="w-72 md:w-96 mt-4 object-contain mix-blend-multiply"
          />
        </div>
      )}

      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-4 bg-white border-b-2 border-[#7288AE]">
        <div className="flex items-center space-x-3">
          {/* Real Logo Icon */}
          <div className="w-10 h-10 flex items-center justify-center">
            <img src="/image/Logo_only.png" alt="Digo Logo" className="w-full h-full object-contain mix-blend-multiply" />
          </div>
          <span className="font-bold text-[#111844] text-xl tracking-wide">
            Digo Bot
          </span>
        </div>

        <div className="flex items-center space-x-4">
          <Link
            to="/admin"
            className="px-6 py-2 bg-[#111844] text-[#EAE0CF] text-sm font-semibold rounded-full shadow hover:bg-[#4B5694] transition-colors"
          >
            Login
          </Link>
        </div>
      </nav>

      {/* Main Hero Section */}
      <main className="flex-1 max-w-7xl mx-auto px-8 py-16 grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-center">
        {/* Left Content */}
        <div className="space-y-6">
          <h1 className="text-6xl md:text-7xl font-black bg-gradient-to-r from-[#111844] to-[#4B5694] bg-clip-text text-transparent pb-4 leading-tight">
            Digo Bot
          </h1>
          <p className="text-[#111844] leading-relaxed text-lg text-justify max-w-lg opacity-80">
            Sebagai bentuk inovasi, kami menghadirkan layanan asisten virtual cerdas yang dirancang untuk membantu Anda memperoleh informasi seputar layanan dan produk kami dengan cepat dan mudah. Melalui halaman ini, Anda dapat berinteraksi secara langsung dengan chatbot yang mampu menjawab pertanyaan dan memberikan panduan secara instan.
          </p>
          <div className="pt-4">
            <Link
              to="/chat"
              className="inline-flex items-center gap-3 px-8 py-4 bg-[#111844] text-[#EAE0CF] text-lg font-semibold rounded-full shadow-lg hover:bg-[#4B5694] transition-transform transform hover:-translate-y-1 border border-[#7288AE]"
            >
              <span>Try Chat Bot</span>
              {/* Outline Send Icon */}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Right Content - Phone Mockup UI */}
        <div className="relative flex justify-center">
          <div className="relative w-80 h-[500px] bg-white border border-[#7288AE] rounded-[2.5rem] shadow-2xl p-4 flex flex-col">
            {/* User Avatar Badge Right Top */}
            <div className="absolute top-6 right-6 p-1 border border-[#7288AE] rounded-full bg-white z-10 shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#4B5694]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>

            {/* Chat Area */}
            <div className="flex-1 mt-12 space-y-8 overflow-hidden relative">
              {/* Bot Bubble 1 */}
              <div className="relative">
                <div className="absolute -left-12 top-0 w-10 h-10 flex items-center justify-center">
                  <img src="/image/Logo_only.png" alt="Bot" className="w-full h-full object-contain mix-blend-multiply" />
                </div>
                <div className="bg-[#EAE0CF] border-none text-[#111844] text-xs p-3 rounded-2xl rounded-tl-none w-5/6 shadow-sm">
                  Halo, Apakah ada yg bisa aku bantu?
                </div>
              </div>

              {/* User Bubble 1 */}
              <div className="flex justify-end">
                <div className="bg-[#4B5694] text-white text-xs p-3 rounded-2xl rounded-tr-none shadow-sm">
                  Apa itu Digo Bot?
                </div>
              </div>

              {/* Bot Bubble 2 */}
              <div className="relative">
                <div className="absolute -left-12 top-0 w-10 h-10 flex items-center justify-center">
                  <img src="/image/Logo_only.png" alt="Bot" className="w-full h-full object-contain mix-blend-multiply" />
                </div>
                <div className="bg-[#EAE0CF] border-none text-[#111844] text-xs p-3 rounded-2xl rounded-tl-none w-11/12 shadow-sm leading-relaxed">
                  Digo Bot adalah asisten AI yang dirancang untuk membangun komunikasi yang lebih efisien dan mudah.
                </div>
              </div>
            </div>

            {/* Chat Input */}
            <div className="absolute -bottom-6 -left-4 -right-4 bg-white border border-[#7288AE] rounded-full px-4 py-3 flex items-center shadow-lg">
              <input 
                type="text" 
                placeholder="Type a message here!" 
                className="flex-1 outline-none text-sm px-2 text-[#111844] bg-transparent"
                readOnly
              />
              <div className="flex items-center space-x-2 text-[#4B5694]">
                {/* Paperclip Outline Icon */}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 hover:text-[#111844] cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                </svg>
                {/* Send Outline Icon */}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 hover:text-[#111844] cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
