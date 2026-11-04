import React, { useState } from 'react';
import { Lock, Delete } from 'lucide-react';

interface PinLockModalProps {
  onUnlock: () => void;
}

export const PinLockModal: React.FC<PinLockModalProps> = ({ onUnlock }) => {
  const [pin, setPin] = useState<string>('');
  const [error, setError] = useState<boolean>(false);

  // Demo default PIN is 1234 or any 4 digits
  const handleDigit = (digit: string) => {
    if (pin.length < 4) {
      const nextPin = pin + digit;
      setPin(nextPin);
      setError(false);

      if (nextPin.length === 4) {
        // Unlock on 4 digits
        setTimeout(() => {
          onUnlock();
        }, 150);
      }
    }
  };

  const handleDelete = () => {
    setPin((prev) => prev.slice(0, -1));
    setError(false);
  };

  return (
    <div className="fixed inset-0 z-70 bg-[#1B3B2B] text-white flex flex-col items-center justify-between py-12 px-6 max-w-md mx-auto">
      <div className="flex flex-col items-center mt-8">
        <div className="w-16 h-16 rounded-3xl bg-white/10 flex items-center justify-center mb-6">
          <Lock size={32} className="text-[#8EE0B0]" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-white mb-2">
          DompetKu
        </h2>
        <p className="text-xs text-[#B0C4B8]">
          Masukkan 4 digit PIN untuk membuka aplikasi
        </p>

        {/* PIN Dots */}
        <div className="flex items-center gap-4 mt-8">
          {[0, 1, 2, 3].map((idx) => (
            <div
              key={idx}
              className={`w-3.5 h-3.5 rounded-full transition-all duration-200 ${
                pin.length > idx
                  ? 'bg-white scale-110'
                  : 'bg-white/20'
              } ${error ? 'bg-red-400 animate-shake' : ''}`}
            />
          ))}
        </div>
      </div>

      {/* Numeric Keypad */}
      <div className="w-full max-w-xs grid grid-cols-3 gap-4 mb-4 text-center">
        {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
          <button
            key={digit}
            onClick={() => handleDigit(digit)}
            className="w-16 h-16 mx-auto rounded-full bg-white/5 hover:bg-white/15 active:bg-white/25 text-2xl font-semibold flex items-center justify-center transition-colors"
          >
            {digit}
          </button>
        ))}
        <div />
        <button
          onClick={() => handleDigit('0')}
          className="w-16 h-16 mx-auto rounded-full bg-white/5 hover:bg-white/15 active:bg-white/25 text-2xl font-semibold flex items-center justify-center transition-colors"
        >
          0
        </button>
        <button
          onClick={handleDelete}
          className="w-16 h-16 mx-auto rounded-full bg-white/5 hover:bg-white/15 active:bg-white/25 flex items-center justify-center text-[#B0C4B8] transition-colors"
        >
          <Delete size={22} />
        </button>
      </div>

      <p className="text-[11px] text-[#B0C4B8]/70">
        Demo PIN: masukkan 4 angka apa saja untuk masuk
      </p>
    </div>
  );
};

