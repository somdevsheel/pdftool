'use client';

import { useState, useCallback } from 'react';
import { UploadedFile } from '../types/web.types';

export function useFiles(maxFiles = 20) {
  const [files, setFiles] = useState<UploadedFile[]>([]);

  const add = useCallback((newFiles: UploadedFile[]) => {
    setFiles((prev) => {
      const merged = [...prev, ...newFiles];
      return merged.slice(0, maxFiles);
    });
  }, [maxFiles]);

  const remove = useCallback((fileId: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== fileId));
  }, []);

  const reorder = useCallback((fromIdx: number, toIdx: number) => {
    setFiles((prev) => {
      const arr = [...prev];
      const [item] = arr.splice(fromIdx, 1);
      arr.splice(toIdx, 0, item);
      return arr;
    });
  }, []);

  const clear = useCallback(() => setFiles([]), []);

  return { files, add, remove, reorder, clear };
}
