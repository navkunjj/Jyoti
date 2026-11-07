import React, { useState, useEffect } from 'react';
import { DiyaLogo } from '../UI/DiyaLogo';
import { Volume2, VolumeX, Menu, X } from 'lucide-react';
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

    const unsubscribe = soundscape.subscribe((playing) => {
      setIsPlayingAudio(playing);
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      unsubscribe();
    };
  }, []);

  const toggleSound = () => {
    soundscape.toggle();
  };

  const navLinks = [
    { id: 'welcome', label: 'Home' },
    { id: 'celebration', label: 'Stories' },
    { id: 'wishes', label: 'Wishes' },
    { id: 'light-the-world', label: 'Light the World' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 select-none ${
          scrolled
            ? 'py-4 bg-[#061116]/90 backdrop-blur-md border-b border-[#A99BBF]/15'
            : 'py-6 bg-gradient-to-b from-[#061116]/80 via-[#061116]/20 to-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-10 flex items-center justify-between">
          {/* Brand Logo & Editorial Typography */}
          <button
            onClick={() => onNavigate('welcome')}
            className="group flex items-center space-x-3 text-left focus:outline-none"
            aria-label="JYOTI Home"
          >
            <DiyaLogo className="w-8 sm:w-9 h-auto transition-transform duration-500 group-hover:scale-105" glow />
            <div className="flex flex-col">
              <span className="font-serif text-2xl tracking-[0.24em] text-[#F3EAE2] transition-colors group-hover:text-[#F4C4D2] font-normal leading-tight">
                JYOTI
              </span>
              <span className="text-[9px] uppercase tracking-[0.32em] text-[#A99BBF] font-sans font-light">
                A Spark of Diwali
              </span>
            </div>
          </button>

          {/* Clean Editorial Navigation Links */}
          <nav className="hidden md:flex items-center space-x-9 lg:space-x-12">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => onNavigate(link.id)}
                  className={`text-xs uppercase tracking-[0.24em] transition-colors duration-300 relative py-1 focus:outline-none ${
                    isActive
                      ? 'text-[#F3EAE2] font-medium'
                      : 'text-[#F3EAE2]/70 hover:text-[#E98EAF]'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute -bottom-1 left-0 right-0 h-[1px] bg-[#E98EAF]" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Minimal Unobtrusive Audio Control */}
          <div className="hidden sm:flex items-center">
            <button
              onClick={toggleSound}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 border focus:outline-none ${
                isPlayingAudio
                  ? 'border-[#E98EAF]/70 text-[#F4C4D2] bg-[#E98EAF]/10'
                  : 'border-[#A99BBF]/20 text-[#A99BBF] hover:text-[#F3EAE2] hover:border-[#A99BBF]/50'
              }`}
              title={isPlayingAudio ? 'Mute Diwali background music' : 'Play Diwali background music'}
              aria-label={isPlayingAudio ? 'Mute background music' : 'Play background music'}
            >
              {isPlayingAudio ? (
                <Volume2 className="w-4 h-4 text-[#E98EAF]" />
              ) : (
                <VolumeX className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex md:hidden items-center space-x-3">
            <button
              onClick={toggleSound}
              className="w-8 h-8 rounded-full flex items-center justify-center border border-[#A99BBF]/25 text-[#A99BBF]"
              aria-label="Toggle sound"
            >
              {isPlayingAudio ? <Volume2 className="w-3.5 h-3.5 text-[#E98EAF]" /> : <VolumeX className="w-3.5 h-3.5" />}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 text-[#F3EAE2] hover:text-[#E98EAF] focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Clean Mobile Drawer Menu */}
      <div
        className={`fixed inset-0 z-40 bg-[#061116]/98 backdrop-blur-xl transition-all duration-300 md:hidden flex flex-col justify-center px-8 ${
          mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex flex-col space-y-6 text-center max-w-xs mx-auto w-full">
          <div className="flex justify-center mb-1">
            <DiyaLogo className="w-12 h-auto" glow />
          </div>
          <span className="font-serif text-2xl tracking-[0.25em] text-[#F3EAE2]">
            JYOTI
          </span>
          <div className="w-12 h-[1px] bg-[#A99BBF]/20 mx-auto my-1" />

          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => {
                onNavigate(link.id);
                setMobileMenuOpen(false);
              }}
              className={`text-sm tracking-[0.24em] uppercase py-2.5 transition-colors ${
                activeSection === link.id ? 'text-[#E98EAF] font-medium' : 'text-[#F3EAE2]/80 hover:text-[#F4C4D2]'
              }`}
            >
              {link.label}
            </button>
          ))}
        </div>
      </div>
    </>
  );
};
