import { useEffect, useState } from 'react';

interface Props {
  amount: number;
  size?: 'sm' | 'md' | 'lg';
}

export default function CoinCounter({ amount, size = 'md' }: Props) {
  const [displayed, setDisplayed] = useState(amount);

  useEffect(() => {
    if (displayed === amount) return;
    const diff = amount - displayed;
    const step = Math.ceil(Math.abs(diff) / 20);
    const interval = setInterval(() => {
      setDisplayed(prev => {
        const next = diff > 0 ? Math.min(prev + step, amount) : Math.max(prev - step, amount);
        if (next === amount) clearInterval(interval);
        return next;
      });
    }, 30);
    return () => clearInterval(interval);
  }, [amount, displayed]);

  const sizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg font-semibold',
  };

  return (
    <span className={`inline-flex items-center gap-1 ${sizes[size]}`}>
      <span className="text-gold">🪙</span>
      <span className="text-gold font-medium tabular-nums">{displayed.toLocaleString()}</span>
    </span>
  );
}
