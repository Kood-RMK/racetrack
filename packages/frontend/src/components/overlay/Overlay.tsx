"use client";


import React, { createContext, useContext, useState, ReactNode } from 'react';

type OverlayContextType = {
  openOverlay: (content: ReactNode) => void;
  closeOverlay: () => void;
};

const OverlayContext = createContext<OverlayContextType | undefined>(undefined);

export const useOverlay = (): OverlayContextType => {
  const context = useContext(OverlayContext);
  if (!context) throw new Error('useModal must be used within a ModalProvider');
  return context;
};

type ModalProviderProps = {
  children: ReactNode;
};

export const OverlayProvider: React.FC<ModalProviderProps> = ({ children }) => {
  const [overlayContent, setOverlayContent] = useState<ReactNode>(null);

  const openOverlay = (content: ReactNode) => setOverlayContent(content);
  const closeOverlay = () => setOverlayContent(null);

  return (
    <OverlayContext.Provider value={{ openOverlay, closeOverlay }}>
      {children}
      {overlayContent && (
        <div className="w-full h-full bg-black/50 absolute top-0 left-0 flex justify-center items-center z-50">
            {overlayContent}
        </div>
      )}
    </OverlayContext.Provider>
  );
};

export default OverlayProvider;
