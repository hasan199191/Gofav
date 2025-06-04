import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { PeraWalletConnect } from '@perawallet/connect';
import { WalletState } from '../types';
import { profileApi } from '../utils/api';
import { useAuth } from './AuthContext';

interface WalletContextType extends WalletState {
  connect: () => Promise<void>;
  disconnect: () => void;
}

const initialState: WalletState = {
  connected: false,
  address: null,
  connecting: false,
  provider: null,
  error: null,
};

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}

export function WalletProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<WalletState>(initialState);
  const { user, updateUser, isAuthenticated } = useAuth();
  const [peraWallet, setPeraWallet] = useState<PeraWalletConnect | null>(null);

  useEffect(() => {
    // Initialize Pera Wallet
    const pera = new PeraWalletConnect();
    setPeraWallet(pera);

    // Check if wallet was previously connected
    const reconnectWallet = async () => {
      if (user?.walletAddress) {
        try {
          const accounts = await pera.reconnectSession();
          if (accounts && accounts.length > 0 && accounts[0] === user.walletAddress) {
            setState({
              connected: true,
              address: accounts[0],
              connecting: false,
              provider: pera,
              error: null,
            });
          }
        } catch (error) {
          console.error("Failed to reconnect wallet:", error);
        }
      }
    };

    if (isAuthenticated) {
      reconnectWallet();
    }

    return () => {
      if (pera) {
        pera.disconnect();
      }
    };
  }, [isAuthenticated, user?.walletAddress]);

  const connect = async () => {
    if (!peraWallet) return;
    
    try {
      setState({
        ...state,
        connecting: true,
        error: null,
      });
      
      const accounts = await peraWallet.connect();
      
      if (accounts && accounts.length > 0) {
        // Save wallet address to backend
        if (isAuthenticated) {
          const response = await profileApi.connectWallet(accounts[0]);
          
          if (response.success && response.data && user) {
            updateUser({
              ...user,
              walletAddress: accounts[0],
            });
          }
        }
        
        setState({
          connected: true,
          address: accounts[0],
          connecting: false,
          provider: peraWallet,
          error: null,
        });
      }
    } catch (error) {
      console.error("Wallet connection error:", error);
      setState({
        ...state,
        connecting: false,
        error: 'Failed to connect wallet',
      });
    }
  };

  const disconnect = () => {
    if (peraWallet && state.connected) {
      peraWallet.disconnect();
      setState(initialState);
    }
  };

  const value = {
    ...state,
    connect,
    disconnect,
  };

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
}