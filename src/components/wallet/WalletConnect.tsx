import { useEffect } from 'react';
import { Wallet, Wallet as WalletX } from 'lucide-react';
import { useWallet } from '../../contexts/WalletContext';
import Button from '../ui/Button';
import { truncateAddress } from '../../utils/format';

interface WalletConnectProps {
  isMobile?: boolean;
}

const WalletConnect = ({ isMobile = false }: WalletConnectProps) => {
  const { connected, address, connecting, connect, disconnect, error } = useWallet();

  useEffect(() => {
    if (error) {
      console.error('Wallet error:', error);
    }
  }, [error]);

  if (connected && address) {
    return (
      <div className={isMobile ? "w-full" : ""}>
        <Button
          variant="outline"
          size={isMobile ? "lg" : "md"}
          className={isMobile ? "w-full justify-center" : ""}
          leftIcon={<Wallet className="w-4 h-4" />}
          onClick={disconnect}
        >
          {truncateAddress(address)}
        </Button>
      </div>
    );
  }

  return (
    <div className={isMobile ? "w-full" : ""}>
      <Button
        variant="outline"
        size={isMobile ? "lg" : "md"}
        className={isMobile ? "w-full justify-center" : ""}
        leftIcon={<WalletX className="w-4 h-4" />}
        isLoading={connecting}
        onClick={connect}
      >
        Connect Wallet
      </Button>
    </div>
  );
};

export default WalletConnect;