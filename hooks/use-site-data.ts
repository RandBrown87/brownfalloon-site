"use client";

import { useCallback, useEffect, useState } from "react";
import {
  CONTENT_UPDATED_EVENT,
  defaultSiteData,
  fetchSiteData,
  resetSiteData,
  type SiteData,
  writeSiteData,
} from "@/lib/site-data";

export function useSiteData() {
  const [data, setData] = useState<SiteData>(defaultSiteData);

  const refresh = useCallback(async () => {
    const next = await fetchSiteData();
    setData(next);
  }, []);

  useEffect(() => {
    void refresh();

    const handleUpdate = () => {
      void refresh();
    };
    window.addEventListener(CONTENT_UPDATED_EVENT, handleUpdate);

    return () => {
      window.removeEventListener(CONTENT_UPDATED_EVENT, handleUpdate);
    };
  }, [refresh]);

  const updateData = useCallback(async (next: SiteData) => {
    await writeSiteData(next);
    setData(next);
  }, []);

  const resetData = useCallback(async () => {
    const value = await resetSiteData();
    setData(value);
  }, []);

  return { data, updateData, resetData, refresh };
}
