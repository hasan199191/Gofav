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
    // Initialize Pera Wallet with proper configuration
    const pera = new PeraWalletConnect({
      chainId: 416001, // Algorand MainNet
      shouldShowSignTxnToast: false,
      network: 'mainnet',
      metadata: {
        name: 'GoFav',
        description: 'SocialFi Platform for Algorand',
        url: 'https://gofav.vercel.app',
        icons: ['https://gofav.vercel.app/favicon.ico']
      }
    });

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
    if (!peraWallet) {
      console.error("Pera Wallet not initialized");
      return;
    }
    
    try {
      setState({
        ...state,
        connecting: true,
        error: null,
      });
      
      // Add timeout for connection
      const connectPromise = peraWallet.connect();
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Connection timeout')), 30000)
      );
      
      const accounts = await Promise.race([connectPromise, timeoutPromise]) as string[];
      
      if (accounts && accounts.length > 0) {
        // Save wallet address to backend
        if (isAuthenticated) {
          try {
            const response = await profileApi.connectWallet(accounts[0]);
            
            if (response.success && response.data && user) {
              updateUser({
                ...user,
                walletAddress: accounts[0],
              });
            }
          } catch (apiError) {
            console.error("Failed to save wallet to backend:", apiError);
            // Continue with wallet connection even if backend fails
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
        error: error instanceof Error ? error.message : 'Failed to connect wallet',
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