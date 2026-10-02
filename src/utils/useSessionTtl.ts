import { useState, useEffect, useCallback, useRef } from 'react';
import type { CitationItem } from '../types/citation';

const SESSION_TTL_SECONDS = 900; // 15 minutes = 900 seconds

export function useSessionTtl() {
  const [items, setItems] = useState<CitationItem[]>([]);
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);
  const [remainingSeconds, setRemainingSeconds] = useState<number>(SESSION_TTL_SECONDS);
  const [isExpired, setIsExpired] = useState(false);
  const [expirationNotice, setExpirationNotice] = useState<string | null>(null);

  const timerRef = useRef<any>(null);

  // Clear everything on expiry
  const handleExpire = useCallback(() => {
    setItems([]);
    setSessionStartTime(null);
    setIsExpired(true);
    setExpirationNotice('Phiên trích dẫn đã hết hạn. Dữ liệu tạm thời đã được xóa.');
    setRemainingSeconds(0);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  }, []);

  // Tick timer
  useEffect(() => {
    if (!sessionStartTime || items.length === 0) {
      if (timerRef.current) clearInterval(timerRef.current);
      setRemainingSeconds(SESSION_TTL_SECONDS);
      return;
    }

    timerRef.current = setInterval(() => {
      const elapsed = Math.floor((Date.now() - sessionStartTime) / 1000);
      const left = SESSION_TTL_SECONDS - elapsed;
      if (left <= 0) {
        handleExpire();
      } else {
        setRemainingSeconds(left);
      }
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [sessionStartTime, items.length, handleExpire]);

  const addItem = useCallback((item: CitationItem) => {
    setIsExpired(false);
    setExpirationNotice(null);
    setItems(prev => {
      if (prev.length === 0) {
        // Start 15-minute clock from first addition
        setSessionStartTime(Date.now());
        setRemainingSeconds(SESSION_TTL_SECONDS);
      }
      return [item, ...prev];
    });
  }, []);

  const updateItem = useCallback((updated: CitationItem) => {
    setItems(prev => prev.map(c => (c.id === updated.id ? updated : c)));
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems(prev => {
      const next = prev.filter(c => c.id !== id);
      if (next.length === 0) {
        setSessionStartTime(null);
        setRemainingSeconds(SESSION_TTL_SECONDS);
      }
      return next;
    });
  }, []);

  const clearSession = useCallback(() => {
    setItems([]);
    setSessionStartTime(null);
    setRemainingSeconds(SESSION_TTL_SECONDS);
    setIsExpired(false);
    setExpirationNotice(null);
  }, []);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return {
    items,
    remainingSeconds,
    remainingFormatted: formatTime(remainingSeconds),
    isExpired,
    expirationNotice,
    dismissNotice: () => setExpirationNotice(null),
    addItem,
    updateItem,
    removeItem,
    clearSession,
    hasActiveSession: items.length > 0 && sessionStartTime !== null
  };
}
