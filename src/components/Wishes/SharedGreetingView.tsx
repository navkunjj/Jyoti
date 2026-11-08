import React, { useState } from 'react';
import { GreetingCardData } from '../../services/greetingService';
import { GreetingCardPreview } from './GreetingCardPreview';
import { downloadCardPNG, renderCardToBlob } from '../../utils/cardRenderer';
import { DiyaLogo } from '../UI/DiyaLogo';
import { Download, Share2, Check, ArrowRight, Sparkles, Home, Image as ImageIcon, MessageCircle } from 'lucide-react';
import { soundscape } from '../../utils/sound';

interface SharedGreetingViewProps {
  greeting: GreetingCardData;
  onCreateOwnWish: () => void;
  onNavigateHome: () => void;
}

export const SharedGreetingView: React.FC<SharedGreetingViewProps> = ({
  greeting,
  onCreateOwnWish,
  onNavigateHome,
}) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copiedImage, setCopiedImage] = useState(false);

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      soundscape.playDiyaChime();
      await downloadCardPNG({
        to: greeting.to,
        message: greeting.message,
        from: greeting.from,
      });
    } catch (err) {
      console.error('Failed to download card:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShareWithImage = async () => {
    soundscape.playClick();
    const shareUrl = window.location.href;
    const shareText = `🪔 A personalized Diwali Greeting from ${greeting.from || 'a loved one'} to ${greeting.to || 'you'}! ✨\n\n"${greeting.message}"\n\nView interactive card: ${shareUrl}`;

    try {
      const blob = await renderCardToBlob({
        to: greeting.to,
        message: greeting.message,
        from: greeting.from,
      });
      const safeName = (greeting.to || 'Greeting').replace(/[^a-zA-Z0-9]/g, '-');
      const imageFile = new File([blob], `Jyoti-Diwali-Wish-${safeName}.png`, { type: 'image/png' });

      if (navigator.canShare && navigator.canShare({ files: [imageFile] })) {
        try {
          await navigator.share({
            files: [imageFile],
            title: `Diwali Greeting for ${greeting.to || 'You'}`,
            text: shareText,
            url: shareUrl,
          });
          return;
        } catch (err: any) {
          if (err.name === 'AbortError') return;
        }
      }
    } catch (err) {
      console.warn('Image file creation for share failed:', err);
    }

    // Fallback: Copy link
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const handleCopyImage = async () => {
    try {
      const blob = await renderCardToBlob({
        to: greeting.to,
        message: greeting.message,
        from: greeting.from,
      });
      if (typeof ClipboardItem !== 'undefined' && navigator.clipboard && navigator.clipboard.write) {
        await navigator.clipboard.write([
          new ClipboardItem({
            'image/png': blob,
          }),
        ]);
        setCopiedImage(true);
        setTimeout(() => setCopiedImage(false), 2500);
      } else {
        await handleDownload();
      }
    } catch {
      await handleDownload();
    }
  };

  const handleWhatsAppShare = async () => {
    soundscape.playClick();
    await handleDownload();
    const text = encodeURIComponent(
      `🪔 Happy Diwali! Check out this special Diwali Greeting Card created on JYOTI™ ✨\n\n"${greeting.message}"\n\nView card: ${window.location.href}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#0A1B22] via-[#061116] to-[#040C10] text-[#F3EAE2] flex flex-col justify-between pt-24 sm:pt-28 pb-12 px-4 sm:px-8 select-none">
      {/* Top Branding Bar */}
      <div className="w-full max-w-4xl mx-auto flex items-center justify-between pb-6 border-b border-white/10">
        <button
          onClick={onNavigateHome}
          className="flex items-center space-x-3 text-left focus:outline-none group"
        >
          <DiyaLogo className="w-8 h-auto transition-transform group-hover:scale-105" glow />
          <div className="flex flex-col">
            <span className="font-serif text-xl tracking-[0.24em] text-[#F3EAE2] group-hover:text-[#F4C4D2] transition-colors">
              JYOTI™
            </span>
            <span className="text-[9px] uppercase tracking-[0.32em] text-[#A99BBF] font-sans">
              A Spark of Diwali
            </span>
          </div>
        </button>

        <button
          onClick={onNavigateHome}
          className="text-xs uppercase tracking-wider text-[#A99BBF] hover:text-[#F3EAE2] transition-colors flex items-center space-x-1.5 focus:outline-none"
        >
          <Home className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Explore Experience</span>
        </button>
      </div>

      {/* Main Centered Content */}
      <main className="w-full max-w-xl mx-auto my-auto py-8 space-y-8 flex flex-col items-center">
        {/* Editorial Greeting Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#E98EAF]/10 border border-[#E98EAF]/25 text-[#E98EAF] text-xs uppercase tracking-widest">
            <Sparkles className="w-3 h-3 text-[#FFE29A]" />
            <span>A Deepavali Blessing for You</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#F3EAE2] font-light">
            You Received a Diwali Greeting
          </h1>
          <p className="text-sm text-[#A99BBF] max-w-md mx-auto">
            Sent with warmth, sacred light, and fond wishes from{' '}
            <strong className="text-[#FFE29A] font-serif">{greeting.from || 'A Well-Wisher'}</strong>
          </p>
        </div>

        {/* 1:1 Square Card Preview */}
        <div className="w-full max-w-[480px]">
          <GreetingCardPreview
            to={greeting.to}
            message={greeting.message}
            from={greeting.from}
          />
        </div>

        {/* Interactive Action Controls */}
        <div className="w-full max-w-md space-y-3 pt-2">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            {/* Primary Share with Image file */}
            <button
              onClick={handleShareWithImage}
              className="w-full sm:flex-1 py-3.5 px-6 rounded-full bg-gradient-to-r from-[#D4AF37] via-[#FDB863] to-[#FFE29A] hover:brightness-110 text-[#1A0A00] font-semibold text-xs uppercase tracking-[0.2em] shadow-[0_4px_25px_rgba(253,184,99,0.35)] transition-all flex items-center justify-center space-x-2 focus:outline-none"
            >
              <Share2 className="w-4 h-4 text-[#1A0A00]" />
              <span>Share Card Image</span>
            </button>

            {/* Direct PNG download */}
            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="w-full sm:w-auto py-3.5 px-6 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 text-[#F3EAE2] text-xs uppercase tracking-wider transition-all flex items-center justify-center space-x-2 focus:outline-none disabled:opacity-60"
            >
              <Download className="w-4 h-4 text-[#FFE29A]" />
              <span>{isDownloading ? 'Saving...' : 'Save PNG'}</span>
            </button>
          </div>

          {/* Secondary Quick Actions: WhatsApp & Copy Image */}
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={handleWhatsAppShare}
              className="py-2.5 px-3 rounded-xl bg-[#25D366]/20 border border-[#25D366]/40 hover:bg-[#25D366]/30 text-[#25D366] text-xs font-medium flex items-center justify-center space-x-2 transition-all"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </button>

            <button
              type="button"
              onClick={handleCopyImage}
              className="py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-[#FFE29A] text-xs font-medium flex items-center justify-center space-x-2 transition-all"
            >
              {copiedImage ? (
                <>
                  <Check className="w-3.5 h-3.5 text-green-400" />
                  <span className="text-green-300">Copied!</span>
                </>
              ) : (
                <>
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>Copy Image</span>
                </>
              )}
            </button>
          </div>
        </div>
      </main>

      {/* Subtle Footer: Link to Wishes section */}
      <footer className="w-full max-w-4xl mx-auto pt-6 border-t border-white/10 text-center">
        <button
          onClick={onCreateOwnWish}
          className="group inline-flex items-center space-x-2 text-sm text-[#A99BBF] hover:text-[#FFE29A] transition-colors focus:outline-none"
        >
          <span>Create your own Diwali wish on <strong className="text-[#F3EAE2] font-serif">Jyoti™</strong></span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 text-[#E98EAF]" />
        </button>
      </footer>
    </div>
  );
};

