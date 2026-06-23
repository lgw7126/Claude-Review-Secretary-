import { useState } from 'react';

const STORAGE_KEY = 'boss_review_business_name';

export function useBusinessProfile() {
  const [businessName, setBusinessName] = useState(
    () => localStorage.getItem(STORAGE_KEY) || ''
  );

  function saveBusinessName(name) {
    const trimmed = name.trim();
    localStorage.setItem(STORAGE_KEY, trimmed);
    setBusinessName(trimmed);
  }

  return { businessName, saveBusinessName };
}
