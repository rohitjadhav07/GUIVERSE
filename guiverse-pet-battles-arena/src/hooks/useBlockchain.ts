
import { useState, useCallback, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';

// Mock blockchain integration - replace with actual Aptos SDK calls
export const useBlockchain = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [account, setAccount] = useState<string | null>(null);
  const [balance, setBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [userPets, setUserPets] = useState([
    {
      id: 1,
      name: "CryptoKitty",
      type: "Cyber Cat",
      level: 12,
      health: 85,
      energy: 92,
      happiness: 78,
      rarity: "Epic",
      traits: ["Meme Lord", "DeFi Genius", "Battle Ready"],
      wins: 23,
      losses: 5
    },
    {
      id: 2,
      name: "DiamondDoge",
      type: "Shiba Warrior",
      level: 8,
      health: 95,
      energy: 67,
      happiness: 88,
      rarity: "Rare",
      traits: ["Diamond Hands", "Hodler", "Meme Machine"],
      wins: 15,
      losses: 3
    }
  ]);
  const [userInventory, setUserInventory] = useState<string[]>([]);
  const { toast } = useToast();

  // Check if wallet is already connected on load
  useEffect(() => {
    const checkWalletConnection = async () => {
      try {
        // Mock check for existing wallet connection
        const savedAccount = localStorage.getItem('walletAccount');
        const savedBalance = localStorage.getItem('walletBalance');
        
        if (savedAccount && savedBalance) {
          setAccount(savedAccount);
          setBalance(parseInt(savedBalance));
          setIsConnected(true);
        }
      } catch (error) {
        console.log('No existing wallet connection');
      }
    };

    checkWalletConnection();
  }, []);

  const connectWallet = useCallback(async () => {
    setIsLoading(true);
    try {
      // Mock wallet connection - replace with actual wallet integration
      setTimeout(() => {
        const mockAccount = '0x1234567890abcdef1234567890abcdef12345678';
        const mockBalance = 12847;
        
        setIsConnected(true);
        setAccount(mockAccount);
        setBalance(mockBalance);
        
        // Save to localStorage for persistence
        localStorage.setItem('walletAccount', mockAccount);
        localStorage.setItem('walletBalance', mockBalance.toString());
        
        toast({
          title: "🔗 Wallet Connected",
          description: "Successfully connected to your wallet!",
        });
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      toast({
        title: "❌ Connection Failed",
        description: "Failed to connect wallet. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  }, [toast]);

  const disconnectWallet = useCallback(() => {
    setIsConnected(false);
    setAccount(null);
    setBalance(0);
    localStorage.removeItem('walletAccount');
    localStorage.removeItem('walletBalance');
    toast({
      title: "🔌 Wallet Disconnected",
      description: "Your wallet has been disconnected.",
    });
  }, [toast]);

  const mintPet = useCallback(async (petName: string, petType: string) => {
    if (!isConnected) {
      toast({
        title: "❌ Wallet Not Connected",
        description: "Please connect your wallet first.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      toast({
        title: "🔄 Minting Pet...",
        description: "Transaction submitted to blockchain",
      });

      // Mock mint transaction
      setTimeout(() => {
        const mintCost = 100;
        if (balance >= mintCost) {
          const newPet = {
            id: userPets.length + 1,
            name: petName,
            type: petType,
            level: 1,
            health: 100,
            energy: 100,
            happiness: 100,
            rarity: "Common",
            traits: ["Newborn", "Fresh"],
            wins: 0,
            losses: 0
          };
          
          setUserPets(prev => [...prev, newPet]);
          setBalance(prev => prev - mintCost);
          localStorage.setItem('walletBalance', (balance - mintCost).toString());
          
          toast({
            title: "🎉 Pet Minted!",
            description: `${petName} has been minted successfully!`,
          });
        } else {
          toast({
            title: "❌ Insufficient Balance",
            description: "Not enough $GUI tokens to mint.",
            variant: "destructive",
          });
        }
        setIsLoading(false);
      }, 3000);
    } catch (error) {
      toast({
        title: "❌ Mint Failed",
        description: "Failed to mint pet. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  }, [toast, isConnected, balance, userPets]);

  const trainPet = useCallback(async (petId: number, trainingType: string) => {
    if (!isConnected) {
      toast({
        title: "❌ Wallet Not Connected",
        description: "Please connect your wallet first.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    const trainingCost = 50;
    
    if (balance < trainingCost) {
      toast({
        title: "❌ Insufficient Balance",
        description: "Not enough $GUI tokens for training.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      toast({
        title: "🔄 Training Pet...",
        description: `Starting ${trainingType} training session`,
      });

      setTimeout(() => {
        setUserPets(prev => prev.map(pet => 
          pet.id === petId 
            ? { 
                ...pet, 
                level: pet.level + 1,
                health: Math.min(100, pet.health + 5),
                energy: Math.min(100, pet.energy + 5),
                happiness: Math.min(100, pet.happiness + 5)
              } 
            : pet
        ));
        
        setBalance(prev => prev - trainingCost);
        localStorage.setItem('walletBalance', (balance - trainingCost).toString());
        
        toast({
          title: "✅ Training Complete!",
          description: `Your pet completed ${trainingType} training!`,
        });
        setIsLoading(false);
      }, 2000);
    } catch (error) {
      toast({
        title: "❌ Training Failed",
        description: "Failed to train pet. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  }, [toast, isConnected, balance]);

  const battlePet = useCallback(async (petId: number) => {
    if (!isConnected) {
      toast({
        title: "❌ Wallet Not Connected",
        description: "Please connect your wallet first.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      toast({
        title: "⚔️ Entering Battle...",
        description: "Finding opponent on blockchain",
      });

      setTimeout(() => {
        const isWin = Math.random() > 0.4;
        const reward = isWin ? Math.floor(Math.random() * 150) + 50 : 0;
        
        setUserPets(prev => prev.map(pet => 
          pet.id === petId 
            ? { 
                ...pet, 
                wins: isWin ? pet.wins + 1 : pet.wins,
                losses: isWin ? pet.losses : pet.losses + 1,
                energy: Math.max(0, pet.energy - 20)
              } 
            : pet
        ));
        
        if (isWin) {
          setBalance(prev => prev + reward);
          localStorage.setItem('walletBalance', (balance + reward).toString());
        }

        toast({
          title: isWin ? "🎉 Victory!" : "😔 Defeat",
          description: isWin ? `You won ${reward} $GUI!` : "Better luck next time!",
        });
        setIsLoading(false);
      }, 4000);
    } catch (error) {
      toast({
        title: "❌ Battle Failed",
        description: "Failed to start battle. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  }, [toast, isConnected, balance]);

  const purchaseItem = useCallback(async (itemName: string, price: number) => {
    if (!isConnected) {
      toast({
        title: "❌ Wallet Not Connected",
        description: "Please connect your wallet first.",
        variant: "destructive",
      });
      return;
    }

    if (balance < price) {
      toast({
        title: "❌ Insufficient Balance",
        description: "Not enough $GUI tokens for this purchase.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      toast({
        title: "🔄 Purchasing Item...",
        description: "Transaction submitted to blockchain",
      });

      setTimeout(() => {
        setBalance(prev => prev - price);
        setUserInventory(prev => [...prev, itemName]);
        localStorage.setItem('walletBalance', (balance - price).toString());
        
        toast({
          title: "🛍️ Purchase Complete!",
          description: `${itemName} added to your inventory!`,
        });
        setIsLoading(false);
      }, 2000);
    } catch (error) {
      toast({
        title: "❌ Purchase Failed",
        description: "Failed to purchase item. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  }, [toast, isConnected, balance]);

  const tipUser = useCallback(async (recipientAddress: string, amount: number, message: string) => {
    if (!isConnected) {
      toast({
        title: "❌ Wallet Not Connected",
        description: "Please connect your wallet first.",
        variant: "destructive",
      });
      return;
    }

    if (balance < amount) {
      toast({
        title: "❌ Insufficient Balance",
        description: "Not enough $GUI tokens for this tip.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      toast({
        title: "🔄 Sending Tip...",
        description: "Transaction submitted to blockchain",
      });

      setTimeout(() => {
        setBalance(prev => prev - amount);
        localStorage.setItem('walletBalance', (balance - amount).toString());
        
        toast({
          title: "💝 Tip Sent!",
          description: `Sent ${amount} $GUI with your message!`,
        });
        setIsLoading(false);
      }, 2000);
    } catch (error) {
      toast({
        title: "❌ Tip Failed",
        description: "Failed to send tip. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  }, [toast, isConnected, balance]);

  const claimRewards = useCallback(async () => {
    if (!isConnected) {
      toast({
        title: "❌ Wallet Not Connected",
        description: "Please connect your wallet first.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      toast({
        title: "🔄 Claiming Rewards...",
        description: "Processing your daily rewards",
      });

      setTimeout(() => {
        const dailyReward = 247;
        setBalance(prev => prev + dailyReward);
        localStorage.setItem('walletBalance', (balance + dailyReward).toString());
        
        toast({
          title: "🎉 Rewards Claimed!",
          description: `You received ${dailyReward} $GUI tokens!`,
        });
        setIsLoading(false);
      }, 2000);
    } catch (error) {
      toast({
        title: "❌ Claim Failed",
        description: "Failed to claim rewards. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  }, [toast, isConnected, balance]);

  return {
    isConnected,
    account,
    balance,
    isLoading,
    userPets,
    userInventory,
    connectWallet,
    disconnectWallet,
    mintPet,
    trainPet,
    battlePet,
    purchaseItem,
    tipUser,
    claimRewards,
  };
};
