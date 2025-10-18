import React, { createContext, ReactNode, useContext, useState } from 'react';

interface InstructorDrawerContextType {
  isInstructorDrawerOpen: boolean;
  setIsInstructorDrawerOpen: (open: boolean) => void;
}

const InstructorDrawerContext = createContext<InstructorDrawerContextType | undefined>(undefined);

export const useInstructorDrawer = () => {
  const context = useContext(InstructorDrawerContext);
  if (!context) {
    throw new Error('useInstructorDrawer must be used within an InstructorDrawerProvider');
  }
  return context;
};

interface InstructorDrawerProviderProps {
  children: ReactNode;
}

export const InstructorDrawerProvider: React.FC<InstructorDrawerProviderProps> = ({ children }) => {
  const [isInstructorDrawerOpen, setIsInstructorDrawerOpen] = useState(false);

  return (
    <InstructorDrawerContext.Provider value={{ isInstructorDrawerOpen, setIsInstructorDrawerOpen }}>
      {children}
    </InstructorDrawerContext.Provider>
  );
};
