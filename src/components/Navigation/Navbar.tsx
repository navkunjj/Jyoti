import React, { useState, useEffect } from 'react';
import { LotusIcon } from '../UI/LotusIcon';
import { Volume2, VolumeX, Menu, X } from 'lucide-react';
import { soundscape } from '../../utils/sound';
import { useRouter } from '../../router';

interface NavbarProps {
  onNavigate?: (sectionId: string) => void;
  activeSection?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate, activeSection }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const { pathname, navigate } = useRouter();

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
    { id: 'welcome', label: 'Home', path: '/' },
    { id: 'explore-india', label: 'Explore India', path: '/explore-india' },
    { id: 'art', label: 'Traditions', path: '/#art' },
    { id: 'across-india', label: 'Across India', path: '/#across-india' },
    { id: 'celebration', label: 'Stories', path: '/#celebration' },
    { id: 'wishes', label: 'Wishes', path: '/#wishes' },
  ];

  const handleLinkClick = (link: { id: string; label: string; path: string }) => {
    setMobileMenuOpen(false);

    if (link.id === 'explore-india') {
      navigate('/explore-india');
      return;
    }

    if (link.id === 'welcome' && pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (pathname !== '/') {
      navigate(link.path);
    } else {
      if (onNavigate) {
        onNavigate(link.id);
      } else {
        const el = document.getElementById(link.id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

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
            onClick={() => navigate('/')}
            className="group flex items-center space-x-3 text-left focus:outline-none"
            aria-label="JYOTI Home"
          >
            <LotusIcon className="w-7 h-7 text-[#F4C4D2] transition-transform duration-500 group-hover:scale-105" glow />
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
          <nav className="hidden md:flex items-center space-x-7 lg:space-x-10">
            {navLinks.map((link) => {
              const isActive =
                link.id === 'explore-india'
                  ? pathname.startsWith('/explore-india')
                  : pathname === '/' && activeSection === link.id;

              return (
                <button
                  key={link.id}
                  onClick={() => handleLinkClick(link)}
                  className={`text-xs uppercase tracking-[0.22em] transition-colors duration-300 relative py-1 focus:outline-none ${
                    isActive
                      ? 'text-[#F3EAE2] font-medium'
                      : 'text-[#F3EAE2]/70 hover:text-[#E8A1BC]'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute -bottom-1 left-0 right-0 h-[1.5px] bg-[#E8A1BC]" />
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
                  ? 'border-[#E8A1BC]/70 text-[#F4C4D2] bg-[#E8A1BC]/10'
                  : 'border-[#A99BBF]/20 text-[#A99BBF] hover:text-[#F3EAE2] hover:border-[#A99BBF]/50'
              }`}
              title={isPlayingAudio ? 'Mute ambient soundscape' : 'Play meditative soundscape'}
              aria-label={isPlayingAudio ? 'Mute soundscape' : 'Play soundscape'}
            >
              {isPlayingAudio ? (
                <Volume2 className="w-4 h-4 text-[#E8A1BC]" />
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
              {isPlayingAudio ? <Volume2 className="w-3.5 h-3.5 text-[#E8A1BC]" /> : <VolumeX className="w-3.5 h-3.5" />}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 text-[#F3EAE2] hover:text-[#E8A1BC] focus:outline-none"
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
            <LotusIcon size={36} glow />
          </div>
          <span className="font-serif text-2xl tracking-[0.25em] text-[#F3EAE2]">
            JYOTI
          </span>
          <div className="w-12 h-[1px] bg-[#A99BBF]/20 mx-auto my-1" />

          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleLinkClick(link)}
              className={`text-sm tracking-[0.24em] uppercase py-2.5 transition-colors ${
                (link.id === 'explore-india' && pathname.startsWith('/explore-india')) ||
                (pathname === '/' && activeSection === link.id)
                  ? 'text-[#E8A1BC] font-medium'
                  : 'text-[#F3EAE2]/80 hover:text-[#F4C4D2]'
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
