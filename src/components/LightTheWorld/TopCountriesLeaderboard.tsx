import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { CountryStats, diyaService } from '../../services/diyaService';

interface TopCountriesLeaderboardProps {
  onSelectCountry?: (country: CountryStats) => void;
  selectedCountryId?: string | null;
}

export const TopCountriesLeaderboard: React.FC<TopCountriesLeaderboardProps> = ({
  onSelectCountry,
  selectedCountryId,
}) => {
  const [countries, setCountries] = useState<CountryStats[]>(diyaService.getCountries());
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    const update = () => {
      setCountries(diyaService.getCountries());
    };
    const unsub = diyaService.subscribe(update);
    window.addEventListener('jyoti:diya-updated', update);
    return () => {
      unsub();
      window.removeEventListener('jyoti:diya-updated', update);
    };
  }, []);

  const topCountries = countries.slice(0, 8);

  const filteredCountries = countries.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full space-y-6 select-none">
      {/* Editorial Header */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-[11px] uppercase tracking-widest text-[#9E8D9F] font-sans">
            Participation / By Geography
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="text-xs text-[#9E8D9F] hover:text-[#F5ECE3] transition-colors focus:outline-none flex items-center space-x-1"
          >
            <span>All Nations ({countries.length})</span>
            <span>→</span>
          </button>
        </div>
        <h3 className="font-serif text-3xl sm:text-4xl text-[#F5ECE3] font-light tracking-tight">
          Roll of Nations
        </h3>
      </div>

      {/* Typographic Ledger Table */}
      <div className="border-t border-white/10 divide-y divide-white/5">
        {topCountries.map((country, idx) => {
          const isSelected = selectedCountryId === country.id;
          const rankNumber = (idx + 1).toString().padStart(2, '0');

          return (
            <div
              key={country.id}
              onClick={() => onSelectCountry && onSelectCountry(country)}
              className={`group py-3.5 px-2 flex items-center justify-between cursor-pointer transition-colors ${
                isSelected
                  ? 'bg-white/5 text-[#F5ECE3]'
                  : 'hover:bg-white/[0.02]'
              }`}
            >
              {/* Left: Index + Country Name + Code */}
              <div className="flex items-baseline space-x-4 min-w-0">
                <span className="font-mono text-xs text-[#9E8D9F] w-5">
                  {rankNumber}
                </span>
                <span className="font-serif text-base text-[#F5ECE3] group-hover:text-white transition-colors truncate">
                  {country.name}
                </span>
                <span className="font-mono text-[10px] text-[#9E8D9F] uppercase tracking-widest hidden sm:inline">
                  {country.code}
                </span>
              </div>

              {/* Right: Diya Count */}
              <div className="flex items-baseline space-x-2 pl-4">
                <span className="font-serif text-sm sm:text-base text-[#ECE0D4]">
                  {country.diyas.toLocaleString()}
                </span>
                <span className="text-[11px] text-[#9E8D9F] font-sans hidden sm:inline">
                  flames
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Minimalist Museum-Style Modal */}
      {isModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
        >
          <div className="relative w-full max-w-xl max-h-[80vh] bg-[#120614] border border-white/15 flex flex-col overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <div>
                <h4 className="font-serif text-2xl text-[#F5ECE3] font-light">
                  All Participating Nations
                </h4>
                <div className="text-xs text-[#9E8D9F] font-sans mt-0.5">
                  {countries.length} nations united in the global offering
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-[#9E8D9F] hover:text-[#F5ECE3] p-1.5 focus:outline-none"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Minimalist Search Bar */}
            <div className="p-4 sm:p-6 border-b border-white/10">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-[#9E8D9F] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter by nation or code..."
                  className="w-full pl-9 pr-4 py-2 bg-[#0e0410] border border-white/10 text-xs text-[#F5ECE3] placeholder-[#9E8D9F]/40 focus:outline-none focus:border-white/30 transition-colors"
                />
              </div>
            </div>

            {/* Ledger Listing */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 divide-y divide-white/5">
              {filteredCountries.length === 0 ? (
                <div className="text-center py-12 text-xs text-[#9E8D9F]">
                  No nations found matching your search.
                </div>
              ) : (
                filteredCountries.map((c, index) => (
                  <div
                    key={c.id}
                    onClick={() => {
                      if (onSelectCountry) onSelectCountry(c);
                      setIsModalOpen(false);
                    }}
                    className="py-2.5 px-2 flex items-center justify-between hover:bg-white/5 cursor-pointer transition-colors"
                  >
                    <div className="flex items-baseline space-x-3">
                      <span className="font-mono text-xs text-[#9E8D9F] w-6">
                        {(index + 1).toString().padStart(2, '0')}
                      </span>
                      <span className="font-serif text-base text-[#F5ECE3]">
                        {c.name}
                      </span>
                    </div>
                    <span className="font-serif text-sm text-[#ECE0D4]">
                      {c.diyas.toLocaleString()} flames
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
