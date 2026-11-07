import React, { useState } from 'react';
import { LotusIcon } from '../UI/LotusIcon';
import { Copy, Check, Send } from 'lucide-react';
import { soundscape } from '../../utils/sound';
import { fireworks } from '../../fireworks';

interface WishGreetingCardProps {
  onReleaseLantern: (text: string) => void;
}

export const WishGreetingCard: React.FC<WishGreetingCardProps> = ({ onReleaseLantern }) => {
  const [sender, setSender] = useState('');
  const [recipient, setRecipient] = useState('');
  const [blessingType, setBlessingType] = useState<'light' | 'prosperity' | 'peace' | 'joy'>('light');
  const [customMessage, setCustomMessage] = useState(
    'May the divine glow of Diwali illuminate your path with infinite hope, prosperity, and joy.'
  );
  const [copied, setCopied] = useState(false);

  const blessingPresets = {
    light: {
      label: 'Jyoti (Light & Wisdom)',
      shloka: 'तमसो मा ज्योतिर्गमय',
      meaning: 'Lead us from darkness into radiant light.',
      defaultMsg: 'May the sacred flame of the diya banish all shadows from your hearth and fill your journey with wisdom and peace.',
    },
    prosperity: {
      label: 'Shubh Labh (Prosperity)',
      shloka: 'शुभं करोति कल्याणमारोग्यं धनसंपदा',
      meaning: 'May auspiciousness, health, and abundant wealth grace your home.',
      defaultMsg: 'Wishing you and your family Goddess Lakshmi’s boundless blessings of abundance, good fortune, and noble success.',
    },
    peace: {
      label: 'Shanti (Peace & Serenity)',
      shloka: 'ॐ द्यौः शान्तिरन्तरिक्षं शान्तिः',
      meaning: 'May celestial peace descend upon all realms.',
      defaultMsg: 'May this Diwali usher in deep inner quietude, quiet strength, and harmonious bonds with everyone you cherish.',
    },
    joy: {
      label: 'Anand (Joy & Reunion)',
      shloka: 'आनन्दो ब्रह्मेति व्यजानात्',
      meaning: 'Realize that supreme bliss is the very essence of creation.',
      defaultMsg: 'May your home resonate with the laughter of loved ones, the sweetness of shared mithai, and memories that shine forever.',
    },
  };

  const handleSelectBlessing = (type: 'light' | 'prosperity' | 'peace' | 'joy') => {
    setBlessingType(type);
    setCustomMessage(blessingPresets[type].defaultMsg);
  };

  const handleSendWish = (e: React.FormEvent) => {
    e.preventDefault();
    soundscape.playLanternSound();

    const lanternText = `${recipient ? `For ${recipient}: ` : ''}${blessingPresets[blessingType].shloka}`;
    onReleaseLantern(lanternText);

    // Launch celebratory aerial firework in world coordinates
    const rx = typeof window !== 'undefined' ? (window.innerWidth * 0.5 + (Math.random() - 0.5) * 120) : 400;
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

  const handleCopyWish = () => {
    const fullText = `🪔 Happy Diwali from JYOTI 🪔\n\nTo: ${recipient || 'Beloved Friend'}\n${customMessage}\n\n"${blessingPresets[blessingType].shloka}" — ${blessingPresets[blessingType].meaning}\n\nWith warm wishes,\n${sender || 'A Friend'}\n\nhttps://jyoti-diwali.experience`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start select-none">
      {/* 1. Left Form Editor (7 cols) */}
      <form
        onSubmit={handleSendWish}
        className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#102C38]/70 to-[#0A1B22]/85 border border-[#A99BBF]/25 shadow-xl backdrop-blur-md space-y-6"
      >
        <div className="space-y-1">
          <span className="text-xs uppercase tracking-[0.28em] text-[#E98EAF] font-medium">
            Send a Diwali Greeting
          </span>
          <h3 className="font-serif text-2xl sm:text-3xl text-[#F3EAE2]">
            Personalize Your Spark
          </h3>
          <p className="text-xs text-[#F3EAE2]/70">
            Kindle a heartfelt digital blessing and release a glowing sky lantern into the night sky.
          </p>
        </div>

        {/* Sender and Recipient Input Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-[11px] uppercase tracking-wider text-[#A99BBF] block">
              Your Name (Sender)
            </label>
            <input
              type="text"
              placeholder="e.g. Aarav"
              value={sender}
              onChange={(e) => setSender(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-[#061116]/80 border border-[#A99BBF]/30 text-[#F3EAE2] placeholder-[#A99BBF]/40 text-sm focus:outline-none focus:border-[#E98EAF] transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] uppercase tracking-wider text-[#A99BBF] block">
              Recipient Name
            </label>
            <input
              type="text"
              placeholder="e.g. Ananya & Family"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-[#061116]/80 border border-[#A99BBF]/30 text-[#F3EAE2] placeholder-[#A99BBF]/40 text-sm focus:outline-none focus:border-[#E98EAF] transition-colors"
            />
          </div>
        </div>

        {/* Blessing Type Selector */}
        <div className="space-y-2">
          <label className="text-[11px] uppercase tracking-wider text-[#A99BBF] block">
            Choose Auspicious Blessing
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {(['light', 'prosperity', 'peace', 'joy'] as const).map((type) => {
              const active = blessingType === type;
              return (
                <button
                  type="button"
                  key={type}
                  onClick={() => handleSelectBlessing(type)}
                  className={`px-3 py-2 rounded-xl text-xs uppercase tracking-wider transition-all duration-300 border text-center ${
                    active
                      ? 'border-[#E98EAF] bg-[#E98EAF]/15 text-[#F4C4D2] shadow-[0_0_12px_rgba(233,142,175,0.3)] font-medium'
                      : 'border-[#A99BBF]/20 hover:border-[#A99BBF]/50 text-[#A99BBF]'
                  }`}
                >
                  {type}
                </button>
              );
            })}
          </div>
        </div>

        {/* Message Body Input */}
        <div className="space-y-1.5">
          <label className="text-[11px] uppercase tracking-wider text-[#A99BBF] block">
            Heartfelt Message
          </label>
          <textarea
            rows={3}
            value={customMessage}
            onChange={(e) => setCustomMessage(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-[#061116]/80 border border-[#A99BBF]/30 text-[#F3EAE2] placeholder-[#A99BBF]/40 text-sm focus:outline-none focus:border-[#E98EAF] transition-colors resize-none leading-relaxed"
          />
        </div>

        {/* Submit Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            type="submit"
            className="flex-1 py-3 px-6 rounded-full border border-[#E98EAF] bg-[#E98EAF]/15 hover:bg-[#E98EAF]/25 text-[#F3EAE2] font-medium text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center space-x-2 focus:outline-none"
          >
            <Send className="w-3.5 h-3.5 text-[#E98EAF]" />
            <span>Release Sky Lantern & Send</span>
          </button>

          <button
            type="button"
            onClick={handleCopyWish}
            className="py-3 px-5 rounded-full border border-[#A99BBF]/20 hover:border-[#E98EAF]/50 text-[#F3EAE2] text-xs uppercase tracking-wider transition-all flex items-center justify-center space-x-2 focus:outline-none"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-green-400" />
                <span className="text-green-300">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-[#FFE29A]" />
                <span>Copy Wish</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* 2. Right Live Card Preview (5 cols) */}
      <div className="lg:col-span-5 relative">
        <div className="p-7 sm:p-8 rounded-3xl bg-[#0A1B22]/90 border border-[#A99BBF]/25 shadow-xl relative flex flex-col justify-between min-h-[380px]">
          {/* Top of Card */}
          <div>
            <div className="flex items-center justify-between border-b border-[#A99BBF]/15 pb-4 mb-5">
              <div className="flex items-center space-x-2.5">
                <LotusIcon size={24} glow />
                <span className="font-serif tracking-[0.22em] text-lg text-[#F3EAE2]">
                  JYOTI
                </span>
              </div>
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#FFE29A]">
                Deepavali Blessing
              </span>
            </div>

            {/* Recipient Greeting */}
            <div className="mb-3">
              <span className="text-[11px] uppercase tracking-wider text-[#A99BBF] block">
                To
              </span>
              <h4 className="font-serif text-2xl text-[#F4C4D2]">
                {recipient || 'Dearest Friend'}
              </h4>
            </div>

            {/* Custom Message */}
            <p className="text-xs sm:text-sm text-[#F3EAE2]/85 leading-relaxed font-light mb-6 italic">
              "{customMessage}"
            </p>
          </div>

          {/* Bottom Sanskrit Shloka & Sender */}
          <div className="border-t border-[#A99BBF]/15 pt-4 space-y-3">
            <div className="text-center p-2.5 rounded-xl bg-[#061116]/60 border border-[#A99BBF]/15">
              <div className="font-serif text-sm text-[#FFE29A] tracking-wider">
                {blessingPresets[blessingType].shloka}
              </div>
              <div className="text-[10px] text-[#A99BBF] mt-0.5">
                {blessingPresets[blessingType].meaning}
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <span className="text-[11px] text-[#A99BBF]">
                From: <strong className="text-[#F3EAE2] font-medium">{sender || 'A Well-Wisher'}</strong>
              </span>
              <span className="text-[10px] text-[#E98EAF] uppercase tracking-widest">
                Happy Diwali
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

