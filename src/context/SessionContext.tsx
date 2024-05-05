import React, { createContext, useState } from 'react';

const SubscriptionContext = createContext<{loadData: () => void}>({loadData: () => {}});

const SubscriptionProvider = ({ children, loadData }: { children: React.ReactNode, loadData: () => void }) => {
  return (
    <SubscriptionContext.Provider value={{ loadData }}>
      {children}
    </SubscriptionContext.Provider>
  );
};

export { SubscriptionProvider, SubscriptionContext };