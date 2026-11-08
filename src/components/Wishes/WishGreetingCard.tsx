import React, { useState, useEffect } from 'react';
import { GreetingCardPreview } from './GreetingCardPreview';
import { downloadCardPNG, renderCardToBlob } from '../../utils/cardRenderer';
import { greetingService } from '../../services/greetingService';
import { soundscape } from '../../utils/sound';
import { fireworks } from '../../fireworks';
import {
  Download,
  Share2,
  Copy,
  Check,
  Send,
  Sparkles,
  ExternalLink,
  Flame,
  MessageCircle,
  Image as ImageIcon,
} from 'lucide-react';

interface WishGreetingCardProps {
  onReleaseLantern: (text: string) => void;
}

export const WishGreetingCard: React.FC<WishGreetingCardProps> = ({ onReleaseLantern }) => {
  const [recipient, setRecipient] = useState('');
  const [sender, setSender] = useState('');
  const [customMessage, setCustomMessage] = useState(
    'May this Diwali bring happiness, good health, prosperity, and new beginnings into your life.'
  );

  const [isDownloading, setIsDownloading] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [imageBlob, setImageBlob] = useState<Blob | null>(null);
  const [copied, setCopied] = useState(false);
  const [copiedImage, setCopiedImage] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showDesktopWhatsAppHint, setShowDesktopWhatsAppHint] = useState(false);

  // Pre-generate the 1080x1080 card image in the background whenever inputs change
  // This ensures the image is instantly available with ZERO delay when user taps Share/WhatsApp
  useEffect(() => {
    let isCurrent = true;
    const timer = setTimeout(async () => {
      try {
        const blob = await renderCardToBlob({
          to: recipient,
          message: customMessage,
          from: sender,
        });
        if (isCurrent) {
          setImageBlob(blob);
        }
      } catch (err) {
        console.warn('Background card render error:', err);
      }
    }, 250);

    return () => {
      isCurrent = false;
      clearTimeout(timer);
    };
  }, [recipient, customMessage, sender]);

  // Helper to get or lazily render image blob
  const ensureImageBlob = async (): Promise<Blob> => {
    if (imageBlob) return imageBlob;
    const blob = await renderCardToBlob({
      to: recipient,
      message: customMessage,
      from: sender,
    });
    setImageBlob(blob);
    return blob;
  };

  // Curated Diwali Blessing Presets
  const blessingPresets = [
    {
      id: 'prosperity',
      label: 'Prosperity & Joy',
      msg: 'May this Diwali bring happiness, good health, prosperity, and new beginnings into your life.',
    },
    {
      id: 'wisdom',
      label: 'Light & Wisdom',
      msg: 'May the sacred flame of the diya banish all shadows from your hearth and fill your journey with wisdom and peace.',
    },
    {
      id: 'peace',
      label: 'Peace & Serenity',
      msg: 'May celestial peace, harmonious bonds, and quiet strength grace your home and family this Diwali.',
    },
    {
      id: 'celebration',
      label: 'Reunion & Sweetness',
      msg: 'May your home resonate with the laughter of loved ones, the sweetness of shared mithai, and memories that shine forever.',
    },
  ];

  const handleSelectPreset = (msg: string) => {
    soundscape.playClick();
    setCustomMessage(msg);
  };

  // Download high-res 1080x1080 PNG
  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      soundscape.playDiyaChime();
      await downloadCardPNG({
        to: recipient,
        message: customMessage,
        from: sender,
      });
    } catch (err) {
      console.error('Download failed:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  // Share Greeting via Firestore & Image File
  const handleShareGreeting = async () => {
    try {
      setIsSharing(true);
      soundscape.playDiyaChime();

      // 1. Render 1080x1080 image blob
      const blob = await renderCardToBlob({
        to: recipient,
        message: customMessage,
        from: sender,
      });
      setImageBlob(blob);

      // 2. Save greeting in Firebase Firestore
      const id = await greetingService.saveGreeting({
        to: recipient,
        message: customMessage,
        from: sender,
      });

      // 3. Construct public URLs
      const currentOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://jyoti---a-spark-of-diwali.web.app';
      const isLocal = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
      const publicUrl = isLocal
        ? `https://jyoti---a-spark-of-diwali.web.app/?wish=${id}#wishes`
        : `${currentOrigin}/?wish=${id}#wishes`;

      setShareUrl(publicUrl);

      // 4. Launch celebratory firework
      const rx = typeof window !== 'undefined' ? window.innerWidth * 0.5 : 400;
      fireworks.launch({
        startX: rx,
        targetX: rx + (Math.random() - 0.5) * 80,
        targetY: typeof window !== 'undefined' ? window.innerHeight * 0.2 : 150,
        type: 'chrysanthemum',
        color: '#FDB863',
        secondaryColor: '#FFE29A',
        particleCount: 110,
      });

      // 5. Try Native Mobile Web Share API with ATTACHED IMAGE FILE
      const safeName = (recipient || 'Greeting').replace(/[^a-zA-Z0-9]/g, '-');
      const imageFile = new File([blob], `Jyoti-Diwali-Wish-${safeName}.png`, { type: 'image/png' });

      if (typeof navigator !== 'undefined' && navigator.canShare && navigator.canShare({ files: [imageFile] })) {
        try {
          await navigator.share({
            files: [imageFile],
            title: `Diwali Greeting from ${sender || 'Jyoti'} to ${recipient || 'You'}`,
            text: `🪔 Happy Diwali! "${customMessage}" — From ${sender || 'a loved one'}\n\nView interactive card: ${publicUrl}`,
          });
          setIsSharing(false);
          return;
        } catch (err: any) {
          if (err.name === 'AbortError') {
            setIsSharing(false);
            return;
          }
        }
      }

      // 6. If native file share is unavailable or dismissed, open the rich Share Modal
      setShowShareModal(true);
    } catch (err: any) {
      console.error('Sharing failed:', err);
      const msg = err?.message || 'Please check your connection and try again.';
      alert(`Unable to generate shareable link: ${msg}`);
    } finally {
      setIsSharing(false);
    }
  };

  // Copy Image directly to clipboard so users can paste (Ctrl+V) into WhatsApp / chats
  const handleCopyImage = async () => {
    try {
      let blob = imageBlob;
      if (!blob) {
        blob = await renderCardToBlob({
          to: recipient,
          message: customMessage,
          from: sender,
        });
        setImageBlob(blob);
      }

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
    } catch (err) {
      console.warn('Direct image clipboard copy failed, falling back to download:', err);
      await handleDownload();
    }
  };

  // Dedicated WhatsApp share handler that guarantees the card image is shared
  const handleWhatsAppShare = async () => {
    soundscape.playDiyaChime();
    setIsSharing(true);

    try {
      // 1. Get pre-rendered or instant image blob
      const blob = await ensureImageBlob();
      const safeName = (recipient || 'Greeting').replace(/[^a-zA-Z0-9]/g, '-');
      const imageFile = new File([blob], `Jyoti-Diwali-Wish-${safeName}.png`, { type: 'image/png' });

      // 2. Ensure greeting is saved in Firestore to get link
      let publicUrl = shareUrl;
      if (!publicUrl) {
        try {
          const id = await greetingService.saveGreeting({
            to: recipient,
            message: customMessage,
            from: sender,
          });
          publicUrl = `https://jyoti---a-spark-of-diwali.web.app/?wish=${id}#wishes`;
          setShareUrl(publicUrl);
        } catch {
          publicUrl = `https://jyoti---a-spark-of-diwali.web.app/#wishes`;
        }
      }

      const captionText = `🪔 Happy Diwali! I created a special Diwali Greeting Card for you on JYOTI™ ✨\n\n"${customMessage}"\n\n— From ${sender || 'a loved one'}\n\nView interactive card: ${publicUrl}`;

      // 3. Native mobile share with image file directly to WhatsApp/Apps
      if (typeof navigator !== 'undefined' && navigator.canShare && navigator.canShare({ files: [imageFile] })) {
        try {
          await navigator.share({
            files: [imageFile],
            title: `Diwali Greeting for ${recipient || 'You'}`,
            text: captionText,
          });
          setIsSharing(false);
          return;
        } catch (err: any) {
          if (err.name === 'AbortError') {
            setIsSharing(false);
            return;
          }
        }
      }

      // 4. Desktop / Fallback:
      // A) Copy image to clipboard so user can press Ctrl+V in WhatsApp Web
      try {
        if (typeof ClipboardItem !== 'undefined' && navigator.clipboard && navigator.clipboard.write) {
          await navigator.clipboard.write([
            new ClipboardItem({
              'image/png': blob,
            }),
          ]);
          setCopiedImage(true);
          setTimeout(() => setCopiedImage(false), 3500);
        }
      } catch (err) {
        console.warn('Clipboard write error:', err);
      }

      // B) Download PNG image
      await downloadCardPNG({
        to: recipient,
        message: customMessage,
        from: sender,
      });

      // C) Open WhatsApp Web/App
      const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(captionText)}`;
      window.open(waUrl, '_blank');

      // D) Show guidance hint
      setShowDesktopWhatsAppHint(true);
    } catch (err) {
      console.error('WhatsApp share error:', err);
    } finally {
      setIsSharing(false);
    }
  };

  // Release Sky Lantern (Preserve existing ritual functionality)
  const handleReleaseLantern = (e: React.FormEvent) => {
    e.preventDefault();
    soundscape.playLanternSound();

    const lanternText = `${recipient ? `For ${recipient}: ` : ''}${customMessage.slice(0, 45)}...`;
    onReleaseLantern(lanternText);

    // Launch celebratory aerial firework
    const rx = typeof window !== 'undefined' ? window.innerWidth * 0.5 + (Math.random() - 0.5) * 120 : 400;
    fireworks.launch({
      startX: rx,
      targetX: rx + (Math.random() - 0.5) * 60,
      targetY: typeof window !== 'undefined' ? window.innerHeight * 0.18 : 150,
      type: 'willow',
      color: '#FFE29A',
      secondaryColor: '#E98EAF',
      particleCount: 95,
    });
  };

  const handleCopyLink = async () => {
    if (!shareUrl) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

  return (
    <div className="w-full space-y-8 select-none">
      {/* 2-Column Responsive Layout: Editor Form on Left, Live 1:1 Preview on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column: Form Controls (7 cols) */}
        <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-[#0A1B22]/85 border border-[#A99BBF]/20 shadow-2xl backdrop-blur-md space-y-6">
          {/* Header */}
          <div className="space-y-1.5 pb-2 border-b border-white/10">
            <div className="inline-flex items-center space-x-2 text-xs uppercase tracking-[0.28em] text-[#E98EAF] font-medium">
              <Sparkles className="w-3.5 h-3.5 text-[#FDB863]" />
              <span>Card Creator</span>
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl text-[#F3EAE2] font-light">
              Create Your Diwali Greeting
            </h3>
            <p className="text-xs text-[#A99BBF] font-sans leading-relaxed">
              Personalize an authentic 1:1 Diwali greeting card with traditional diya artwork, custom blessings, and instant download or sharing.
            </p>
          </div>

          {/* Input Fields: To & From */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[11px] uppercase tracking-wider text-[#A99BBF] font-medium flex items-center justify-between">
                <span>To (Recipient)</span>
                <span className="text-[10px] text-white/30 font-mono">Cartouche Header</span>
              </label>
              <input
                type="text"
                maxLength={30}
                placeholder="Enter recipient's name..."
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#061116]/80 border border-[#A99BBF]/30 text-[#F3EAE2] placeholder-[#A99BBF]/40 text-sm focus:outline-none focus:border-[#FDB863] transition-colors font-serif italic text-base"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] uppercase tracking-wider text-[#A99BBF] font-medium flex items-center justify-between">
                <span>From (Sender)</span>
                <span className="text-[10px] text-white/30 font-mono">Cartouche Footer</span>
              </label>
              <input
                type="text"
                maxLength={30}
                placeholder="Enter your name..."
                value={sender}
                onChange={(e) => setSender(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#061116]/80 border border-[#A99BBF]/30 text-[#F3EAE2] placeholder-[#A99BBF]/40 text-sm focus:outline-none focus:border-[#FDB863] transition-colors font-serif italic text-base"
              />
            </div>
          </div>

          {/* Quick Blessing Presets */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[11px] uppercase tracking-wider text-[#A99BBF] font-medium">
                Choose Blessing Theme
              </label>
              <span className="text-[10px] text-[#FDB863]">Click to apply</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {blessingPresets.map((preset) => {
                const isActive = customMessage === preset.msg;
                return (
                  <button
                    type="button"
                    key={preset.id}
                    onClick={() => handleSelectPreset(preset.msg)}
                    className={`px-3 py-2 rounded-xl text-left text-xs transition-all duration-300 border flex flex-col justify-center ${
                      isActive
                        ? 'border-[#FDB863] bg-[#FDB863]/15 text-[#FFE29A] shadow-[0_0_12px_rgba(253,184,99,0.25)] font-medium'
                        : 'border-[#A99BBF]/20 hover:border-[#A99BBF]/45 text-[#A99BBF] bg-[#061116]/40'
                    }`}
                  >
                    <span className="font-sans font-medium text-[11px] text-[#F3EAE2]">
                      {preset.label}
                    </span>
                    <span className="text-[10px] opacity-70 truncate font-serif italic mt-0.5">
                      {preset.msg}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Wish Message Textarea */}
          <div className="space-y-1.5">
            <label className="text-[11px] uppercase tracking-wider text-[#A99BBF] font-medium flex items-center justify-between">
              <span>Custom Wish Message</span>
              <span className="text-[10px] text-white/30 font-mono">
                {customMessage.length}/280
              </span>
            </label>
            <textarea
              rows={3}
              maxLength={280}
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              placeholder="Write your personal Diwali wish..."
              className="w-full px-4 py-3 rounded-xl bg-[#061116]/80 border border-[#A99BBF]/30 text-[#F3EAE2] placeholder-[#A99BBF]/40 text-sm focus:outline-none focus:border-[#FDB863] transition-colors resize-none leading-relaxed font-serif italic text-base"
            />
          </div>

          {/* Primary Action Buttons */}
          <div className="pt-2 space-y-3">
            {/* Top Row: Direct WhatsApp Share (with Image) */}
            <button
              type="button"
              onClick={handleWhatsAppShare}
              disabled={isSharing}
              className="w-full py-3.5 px-6 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-[#0A1B22] font-semibold text-xs uppercase tracking-[0.18em] shadow-[0_4px_20px_rgba(37,211,102,0.35)] transition-all flex items-center justify-center space-x-2.5 focus:outline-none disabled:opacity-60"
            >
              <MessageCircle className="w-4 h-4 fill-current text-[#0A1B22]" />
              <span>Share Card on WhatsApp (With Image)</span>
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* 1. Download 1080x1080 PNG */}
              <button
                type="button"
                onClick={handleDownload}
                disabled={isDownloading}
                className="py-3 px-5 rounded-full bg-gradient-to-r from-[#D4AF37] via-[#FDB863] to-[#FFE29A] hover:brightness-110 text-[#1A0A00] font-semibold text-xs uppercase tracking-[0.18em] shadow-[0_4px_20px_rgba(253,184,99,0.3)] transition-all flex items-center justify-center space-x-2 focus:outline-none disabled:opacity-60"
              >
                <Download className="w-4 h-4 text-[#1A0A00]" />
                <span>{isDownloading ? 'Preparing...' : 'Download Card (PNG)'}</span>
              </button>

              {/* 2. Share with unique URL */}
              <button
                type="button"
                onClick={handleShareGreeting}
                disabled={isSharing}
                className="py-3 px-5 rounded-full border border-[#E98EAF]/50 bg-[#E98EAF]/15 hover:bg-[#E98EAF]/25 text-[#F3EAE2] font-semibold text-xs uppercase tracking-[0.18em] transition-all flex items-center justify-center space-x-2 focus:outline-none disabled:opacity-60 shadow-[0_0_15px_rgba(233,142,175,0.2)]"
              >
                <Share2 className="w-4 h-4 text-[#E98EAF]" />
                <span>{isSharing ? 'Saving...' : 'Share Link & More'}</span>
              </button>
            </div>

            {/* 3. Also Release Sky Lantern into the Sky */}
            <div className="pt-1 flex items-center justify-center">
              <button
                type="button"
                onClick={handleReleaseLantern}
                className="text-xs text-[#A99BBF] hover:text-[#FFE29A] transition-colors flex items-center space-x-1.5 focus:outline-none py-1 px-3 rounded-full hover:bg-white/5"
              >
                <Flame className="w-3.5 h-3.5 text-[#FDB863]" />
                <span>Release this blessing as a glowing sky lantern ↑</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Live 1:1 Preview (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between px-2">
            <span className="text-[11px] uppercase tracking-widest text-[#A99BBF] font-medium">
              Live Card Preview (1:1)
            </span>
            <span className="text-[10px] text-[#FDB863] bg-[#FDB863]/10 px-2 py-0.5 rounded-full border border-[#FDB863]/25 font-mono">
              1080 × 1080 HD
            </span>
          </div>

          <GreetingCardPreview
            to={recipient}
            message={customMessage}
            from={sender}
          />

          <div className="text-center px-4">
            <p className="text-[11px] text-[#A99BBF]/80 font-sans">
              Instant live preview. Updates automatically as you type recipient, message, and sender.
            </p>
          </div>
        </div>
      </div>

      {/* Share Modal Dialog */}
      {showShareModal && shareUrl && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto"
        >
          <div className="relative w-full max-w-lg p-6 sm:p-7 rounded-3xl bg-[#0D222B] border border-[#FDB863]/30 shadow-2xl text-left space-y-5 my-8">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="inline-flex items-center space-x-1.5 px-3 py-0.5 rounded-full bg-[#FDB863]/15 border border-[#FDB863]/30 text-[#FFE29A] text-[11px] font-medium">
                  <Sparkles className="w-3 h-3 text-[#FDB863]" />
                  <span>Greeting Ready to Share</span>
                </div>
                <h4 className="font-serif text-2xl text-[#F3EAE2] font-light">
                  Share Your Diwali Card
                </h4>
              </div>

              <button
                type="button"
                onClick={() => setShowShareModal(false)}
                className="text-xs text-[#A99BBF] hover:text-[#F3EAE2] p-1.5 rounded-full hover:bg-white/5 transition-colors focus:outline-none"
              >
                ✕
              </button>
            </div>

            {/* Card Thumbnail & Image Share Actions */}
            <div className="flex flex-col sm:flex-row items-center gap-4 p-3.5 rounded-2xl bg-[#061116]/80 border border-[#FDB863]/20">
              <div className="w-28 sm:w-32 aspect-square flex-shrink-0 rounded-xl overflow-hidden shadow-md border border-[#E98EAF]/30">
                <GreetingCardPreview
                  to={recipient}
                  message={customMessage}
                  from={sender}
                />
              </div>

              <div className="flex-1 space-y-2 text-center sm:text-left w-full">
                <div className="text-xs text-[#E6DACF] font-serif">
                  1080×1080 High Definition Card
                </div>
                <p className="text-[11px] text-[#A99BBF] leading-tight">
                  Share the image directly with family and friends on WhatsApp, Instagram, or messages.
                </p>

                <div className="flex flex-wrap gap-2 pt-1">
                  {/* WhatsApp with Image Download */}
                  <button
                    type="button"
                    onClick={handleWhatsAppShare}
                    className="flex-1 py-2 px-3 rounded-xl bg-[#25D366]/20 border border-[#25D366]/50 hover:bg-[#25D366]/30 text-[#25D366] text-xs font-medium flex items-center justify-center space-x-1.5 transition-all"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </button>

                  {/* Copy Image directly to clipboard */}
                  <button
                    type="button"
                    onClick={handleCopyImage}
                    className="py-2 px-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-[#FFE29A] text-xs font-medium flex items-center justify-center space-x-1.5 transition-all"
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

                  {/* Download PNG */}
                  <button
                    type="button"
                    onClick={handleDownload}
                    className="py-2 px-3 rounded-xl bg-[#FDB863]/20 hover:bg-[#FDB863]/30 border border-[#FDB863]/40 text-[#FFE29A] text-xs font-medium flex items-center justify-center space-x-1.5 transition-all"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Save PNG</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Generated Link Box */}
            <div className="space-y-1.5">
              <label className="text-[11px] uppercase tracking-wider text-[#A99BBF] block">
                Interactive Greeting Web Link
              </label>
              <div className="p-2.5 rounded-xl bg-[#061116] border border-white/10 flex items-center space-x-2">
                <input
                  type="text"
                  readOnly
                  value={shareUrl}
                  className="bg-transparent text-xs text-[#E6DACF] flex-1 outline-none font-mono truncate select-all"
                />
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="py-1 px-3 rounded-lg bg-[#FDB863] text-[#1A0A00] text-xs font-semibold hover:brightness-110 transition-all flex items-center space-x-1"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Link</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Direct Open Link */}
            <div className="pt-1 flex items-center justify-between text-xs">
              <a
                href={shareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#FFE29A] hover:underline flex items-center space-x-1"
              >
                <span>Preview Interactive Card</span>
                <ExternalLink className="w-3 h-3" />
              </a>

              <button
                type="button"
                onClick={() => setShowShareModal(false)}
                className="text-[#A99BBF] hover:text-[#F3EAE2] transition-colors focus:outline-none"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop WhatsApp Instructions Modal */}
      {showDesktopWhatsAppHint && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
        >
          <div className="relative w-full max-w-md p-6 sm:p-7 rounded-3xl bg-[#0D222B] border border-[#25D366]/40 shadow-2xl text-left space-y-4">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="inline-flex items-center space-x-1.5 px-3 py-0.5 rounded-full bg-[#25D366]/15 border border-[#25D366]/30 text-[#25D366] text-xs font-medium">
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp Photo Share</span>
                </div>
                <h4 className="font-serif text-2xl text-[#F3EAE2] font-light">
                  Card Image Ready to Send!
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setShowDesktopWhatsAppHint(false)}
                className="text-xs text-[#A99BBF] hover:text-[#F3EAE2] p-1.5"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-[#E6DACF] leading-relaxed">
              We have <strong>copied the card image directly to your clipboard</strong> and downloaded it to your device.
            </p>

            <div className="p-3.5 rounded-2xl bg-[#061116] border border-[#25D366]/30 space-y-2">
              <div className="text-xs font-semibold text-[#FFE29A] flex items-center space-x-1.5">
                <span>👉 How to send the image in WhatsApp:</span>
              </div>
              <ol className="text-xs text-[#A99BBF] space-y-1.5 list-decimal list-inside">
                <li>Switch to the opened WhatsApp Web / App chat window.</li>
                <li>Press <strong className="text-white bg-white/10 px-1.5 py-0.5 rounded font-mono">Ctrl + V</strong> (or right-click → Paste).</li>
                <li>The complete 1080×1080 greeting card image will paste directly as a photo!</li>
              </ol>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setShowDesktopWhatsAppHint(false)}
                className="py-2.5 px-5 rounded-full bg-[#25D366] text-[#0A1B22] font-semibold text-xs uppercase tracking-wider"
              >
                Got It!
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
