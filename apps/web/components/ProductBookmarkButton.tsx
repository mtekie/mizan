'use client';

import { useState } from 'react';
import { Bookmark, BookmarkCheck } from 'lucide-react';

export function ProductBookmarkButton({ productId, initialBookmarked = false }: { productId: string; initialBookmarked?: boolean }) {
  const [bookmarked, setBookmarked] = useState(initialBookmarked);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const toggle = async () => {
    setPending(true);
    setMessage(null);
    try {
      const response = await fetch(`/api/v1/products/${productId}/bookmark`, {
        method: bookmarked ? 'DELETE' : 'POST',
      });

      if (response.status === 401) {
        setMessage('Sign in to save products.');
        return;
      }

      if (!response.ok) {
        throw new Error('Could not update saved product.');
      }

      setBookmarked(value => !value);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Could not update saved product.');
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={toggle}
        disabled={pending}
        className={`flex items-center gap-2 rounded-full px-3 py-2 text-xs font-black transition-colors ${
          bookmarked
            ? 'bg-[#E8F5E9] text-[#3EA63B]'
            : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
        } disabled:opacity-60`}
      >
        {bookmarked ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
        {bookmarked ? 'Saved' : 'Save'}
      </button>
      {message && <p className="max-w-36 text-right text-[10px] font-semibold text-amber-700">{message}</p>}
    </div>
  );
}
