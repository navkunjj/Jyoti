import React, { useState, useEffect } from 'react';
import { LotusIcon } from '../UI/LotusIcon';
import { Volume2, VolumeX, Menu, X, Sparkles } from 'lucide-react';
import { soundscape } from '../../utils/sound';

interface NavbarProps {
  onNavigate: (sectionId: string) => void;
  activeSection: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate, activeSection }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleSound = () => {
    const playing = soundscape.toggle();
    setIsPlayingAudio(playing);
  };

  const navLinks = [
    { id: 'welcome', label: 'Home' },
    { id: 'art', label: 'Traditions' },
    { id: 'across-india', label: 'Across India' },
    { id: 'celebration', label: 'Stories' },
    { id: 'wishes', label: 'Wishes' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'py-3.5 bg-[#061116]/85 backdrop-blur-md border-b border-[#A99BBF]/15 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)]'
            : 'py-6 bg-gradient-to-b from-[#061116]/80 via-[#061116]/30 to-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-8 flex items-center justify-between">
          {/* Brand Logo & Name */}
          <button
            onClick={() => onNavigate('welcome')}
            className="group flex items-center space-x-3.5 text-left focus:outline-none"
          >
            <div className="relative">
              <LotusIcon className="w-8 h-8 transition-transform duration-500 group-hover:scale-110" glow />
            </div>
            <div>
              <span className="font-serif text-2xl sm:text-3xl tracking-[0.22em] text-[#F3EAE2] group-hover:text-[#F4C4D2] transition-colors font-medium">
                JYOTI
              </span>
              <span className="block text-[9px] uppercase tracking-[0.35em] text-[#A99BBF] font-sans -mt-1 font-light">
                A Spark of Diwali
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8 lg:space-x-10">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => onNavigate(link.id)}
                  className={`text-sm tracking-[0.18em] uppercase transition-all duration-300 relative py-1 focus:outline-none ${
                    isActive
                      ? 'text-[#F3EAE2] font-medium'
                      : 'text-[#F3EAE2]/70 hover:text-[#E98EAF]'
                  }`}
                >
                  {link.label}
                  <span
                    className={`absolute bottom-0 left-0 h-[1.5px] bg-gradient-to-r from-[#E98EAF] to-[#FDB863] transition-all duration-300 ${
                      isActive ? 'w-full' : 'w-0 group-hover:w-full'
                    }`}
                  />
                </button>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center space-x-4">
            {/* Meditative Ambient Soundscape Toggle */}
            <button
              onClick={toggleSound}
              className={`p-2.5 rounded-full border transition-all duration-300 flex items-center space-x-2 text-xs tracking-wider uppercase focus:outline-none ${
                isPlayingAudio
                  ? 'border-[#E98EAF] bg-[#E98EAF]/15 text-[#F4C4D2] shadow-[0_0_15px_rgba(233,142,175,0.3)]'
                  : 'border-[#A99BBF]/30 hover:border-[#A99BBF]/70 text-[#A99BBF] hover:text-[#F3EAE2]'
              }`}
              title={isPlayingAudio ? "Mute ambient soundscape" : "Play meditative raga soundscape"}
            >
              {isPlayingAudio ? (
                <>
                  <Volume2 className="w-4 h-4 text-[#E98EAF] animate-pulse" />
                  <span className="hidden lg:inline text-[11px] text-[#F4C4D2]">Sound On</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-4 h-4 text-[#A99BBF]" />
                  <span className="hidden lg:inline text-[11px]">Sound Off</span>
                </>
              )}
            </button>

            {/* Primary CTA: Send Wishes */}
            <button
              onClick={() => onNavigate('wishes')}
              className="relative group overflow-hidden px-5 py-2.5 rounded-full border border-[#E98EAF]/60 bg-gradient-to-r from-[#102C38]/90 to-[#101B35]/90 text-[#F3EAE2] text-xs uppercase tracking-[0.2em] font-medium transition-all duration-300 hover:border-[#E98EAF] hover:shadow-[0_0_20px_rgba(233,142,175,0.4)] focus:outline-none"
            >
              <span className="relative z-10 flex items-center space-x-2">
                <Sparkles className="w-3.5 h-3.5 text-[#FDB863] transition-transform duration-300 group-hover:rotate-12" />
                <span>Send Wishes</span>
              </span>
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-0 bg-gradient-to-r from-[#E98EAF]/30 to-[#FDB863]/30 transition-transform duration-500 ease-out" />
            </button>
          </div>

          {/* Mobile Menu & Audio Hamburger */}
          <div className="flex md:hidden items-center space-x-3">
            <button
              onClick={toggleSound}
              className="p-2 rounded-full border border-[#A99BBF]/30 text-[#A99BBF] hover:text-[#F3EAE2]"
              aria-label="Toggle Sound"
            >
              {isPlayingAudio ? <Volume2 className="w-4 h-4 text-[#E98EAF]" /> : <VolumeX className="w-4 h-4" />}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#F3EAE2] hover:text-[#E98EAF] focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      <div
        className={`fixed inset-0 z-40 bg-[#061116]/95 backdrop-blur-xl transition-all duration-500 md:hidden flex flex-col justify-center px-8 ${
          mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex flex-col space-y-6 text-center">
          <div className="flex justify-center mb-2">
            <LotusIcon size={44} glow />
          </div>
          <span className="font-serif text-3xl tracking-[0.25em] text-[#F3EAE2]">
            JYOTI
          </span>
          <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-[#E98EAF] to-transparent mx-auto my-2" />

          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => {
                onNavigate(link.id);
                setMobileMenuOpen(false);
              }}
              className={`text-lg tracking-[0.22em] uppercase py-2 transition-colors ${
                activeSection === link.id ? 'text-[#E98EAF] font-medium' : 'text-[#F3EAE2]/80 hover:text-[#F4C4D2]'
              }`}
            >
              {link.label}
            </button>
          ))}

          <div className="pt-6">
            <button
              onClick={() => {
                onNavigate('wishes');
                setMobileMenuOpen(false);
              }}
              className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#E98EAF] to-[#FDB863] text-[#061116] font-medium uppercase tracking-[0.2em] text-xs shadow-lg"
            >
              Send Diwali Wishes
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

