
import React, { useState } from 'react';
import { ShoppingBag, Star, Zap, Heart, Gift, Crown } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import NavBar from '@/components/NavBar';
import { useBlockchain } from '@/hooks/useBlockchain';

const Shop = () => {
  const [selectedCategory, setSelectedCategory] = useState('items');
  const { balance, isConnected, purchaseItem, mintPet, userInventory, isLoading } = useBlockchain();

  const categories = [
    { id: 'items', name: 'Power Items', icon: Zap, count: 24 },
    { id: 'cosmetics', name: 'Cosmetics', icon: Crown, count: 18 },
    { id: 'pets', name: 'New Pets', icon: Heart, count: 8 },
    { id: 'special', name: 'Limited Edition', icon: Star, count: 5 }
  ];

  const shopItems = {
    items: [
      {
        id: 1,
        name: 'Power Potion',
        description: 'Instantly restore 50 energy',
        price: 25,
        rarity: 'Common',
        emoji: '⚡',
        gradient: 'from-yellow-500 to-orange-500'
      },
      {
        id: 2,
        name: 'Meme Enhancer',
        description: '+20% meme battle damage for 24h',
        price: 75,
        rarity: 'Rare',
        emoji: '🎭',
        gradient: 'from-purple-500 to-pink-500'
      },
      {
        id: 3,
        name: 'XP Booster',
        description: 'Double XP gain for 2 hours',
        price: 100,
        rarity: 'Epic',
        emoji: '📈',
        gradient: 'from-green-500 to-emerald-500'
      },
      {
        id: 4,
        name: 'Legendary Treat',
        description: 'Permanently boost all stats by 5',
        price: 500,
        rarity: 'Legendary',
        emoji: '🍖',
        gradient: 'from-orange-500 to-red-500'
      }
    ],
    cosmetics: [
      {
        id: 5,
        name: 'Diamond Collar',
        description: 'Bling for your battle pet',
        price: 150,
        rarity: 'Epic',
        emoji: '💎',
        gradient: 'from-cyan-500 to-blue-500'
      },
      {
        id: 6,
        name: 'Neon Wings',
        description: 'Glowing wings cosmetic',
        price: 200,
        rarity: 'Epic',
        emoji: '🦋',
        gradient: 'from-pink-500 to-purple-500'
      },
      {
        id: 7,
        name: 'Crypto Crown',
        description: 'Show off your wealth',
        price: 300,
        rarity: 'Legendary',
        emoji: '👑',
        gradient: 'from-yellow-500 to-orange-500'
      }
    ],
    pets: [
      {
        id: 8,
        name: 'Mystic Dragon',
        description: 'Rare fire-breathing companion',
        price: 1000,
        rarity: 'Legendary',
        emoji: '🐲',
        gradient: 'from-red-500 to-orange-500'
      },
      {
        id: 9,
        name: 'Cyber Wolf',
        description: 'High-tech pack hunter',
        price: 750,
        rarity: 'Epic',
        emoji: '🤖',
        gradient: 'from-cyan-500 to-blue-500'
      }
    ],
    special: [
      {
        id: 10,
        name: 'Genesis Pet Egg',
        description: 'Hatch a unique legendary pet',
        price: 2000,
        rarity: 'Mythic',
        emoji: '🥚',
        gradient: 'from-purple-500 via-pink-500 to-orange-500',
        limited: true
      }
    ]
  };

  const getRarityStyle = (rarity: string) => {
    const styles = {
      'Common': 'bg-gray-500/20 text-gray-300 border-gray-400/30',
      'Rare': 'bg-blue-500/20 text-blue-300 border-blue-400/30',
      'Epic': 'bg-purple-500/20 text-purple-300 border-purple-400/30',
      'Legendary': 'bg-orange-500/20 text-orange-300 border-orange-400/30',
      'Mythic': 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-pink-300 border-pink-400/30'
    };
    return styles[rarity] || styles['Common'];
  };

  const handlePurchase = async (item: any) => {
    if (selectedCategory === 'pets') {
      // Handle pet minting
      await mintPet(item.name, item.name);
    } else {
      // Handle item purchase
      await purchaseItem(item.name, item.price);
    }
  };

  const isItemOwned = (itemName: string) => {
    return userInventory.includes(itemName);
  };

  const handleSpecialDeal = () => {
    purchaseItem('Mystery Box', 299);
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-900 via-emerald-900 to-teal-900">
        <NavBar />
        <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[70vh]">
          <Card className="bg-gradient-to-br from-green-800/50 to-emerald-800/50 border-green-400/30 backdrop-blur-sm p-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Connect Your Wallet</h2>
            <p className="text-green-200 mb-6">Connect your wallet to start shopping for your pets</p>
            <div className="text-6xl mb-4">🛒</div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-emerald-900 to-teal-900">
      <NavBar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-4 bg-gradient-to-r from-green-400 via-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            🛒 $GUI POWERED SHOP 🛒
          </h1>
          <p className="text-green-200 text-lg">Upgrade your pets with premium items and cosmetics!</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Category Sidebar */}
          <div>
            <Card className="bg-gradient-to-br from-green-800/50 to-emerald-800/50 border-green-400/30 backdrop-blur-sm mb-6">
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                  <ShoppingBag className="mr-2 text-green-400" />
                  Categories
                </h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${
                        selectedCategory === category.id
                          ? 'bg-white/20 text-white border border-white/30'
                          : 'bg-white/5 text-green-200 hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-center">
                        <category.icon className="w-4 h-4 mr-2" />
                        <span className="font-medium">{category.name}</span>
                      </div>
                      <span className="text-xs bg-green-500/30 px-2 py-1 rounded-full">
                        {category.count}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </Card>

            {/* Balance Card */}
            <Card className="bg-gradient-to-br from-yellow-800/50 to-orange-800/50 border-yellow-400/30 backdrop-blur-sm">
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                  <Star className="mr-2 text-yellow-400" />
                  Your Balance
                </h3>
                <div className="text-3xl font-bold text-yellow-400 mb-2">{balance.toLocaleString()} $GUI</div>
                <Button 
                  onClick={() => window.open('https://pancakeswap.finance', '_blank')}
                  className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:from-yellow-600 hover:to-orange-600 transition-all duration-200 font-medium"
                >
                  Buy More $GUI
                </Button>
              </div>
            </Card>
          </div>

          {/* Shop Items */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {shopItems[selectedCategory]?.map((item) => (
                <Card key={item.id} className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-400/30 backdrop-blur-sm hover:scale-105 transition-all duration-300 group cursor-pointer">
                  <div className="p-6 relative">
                    {item.limited && (
                      <div className="absolute top-2 right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs px-2 py-1 rounded-full font-bold animate-pulse">
                        LIMITED
                      </div>
                    )}
                    
                    {isItemOwned(item.name) && (
                      <div className="absolute top-2 left-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                        OWNED
                      </div>
                    )}
                    
                    <div className="text-center mb-4">
                      <div className="text-6xl mb-3 group-hover:scale-110 transition-transform duration-200">
                        {item.emoji}
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">{item.name}</h3>
                      <p className="text-gray-300 text-sm mb-3">{item.description}</p>
                      
                      <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${getRarityStyle(item.rarity)}`}>
                        {item.rarity}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <div className={`text-2xl font-bold bg-gradient-to-r ${item.gradient} bg-clip-text text-transparent`}>
                        {item.price} $GUI
                      </div>
                    </div>

                    <Button 
                      onClick={() => handlePurchase(item)}
                      disabled={isLoading || balance < item.price || isItemOwned(item.name)}
                      className={`w-full bg-gradient-to-r ${item.gradient} text-white hover:shadow-lg transition-all duration-200 font-bold group-hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      <Gift className="inline mr-2 w-4 h-4" />
                      {isItemOwned(item.name) ? 'Owned' : 
                       balance < item.price ? 'Insufficient Balance' : 
                       selectedCategory === 'pets' ? 'Mint Pet' : 'Purchase'}
                    </Button>
                  </div>
                </Card>
              ))}
            </div>

            {/* Featured Deal */}
            <Card className="mt-8 bg-gradient-to-r from-purple-900/50 via-pink-900/50 to-red-900/50 border-2 border-pink-400/50 backdrop-blur-sm">
              <div className="p-8 text-center">
                <h2 className="text-3xl font-bold text-white mb-4 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                  🎉 DAILY SPECIAL OFFER 🎉
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                  <div className="text-center">
                    <div className="text-8xl mb-2">🎁</div>
                    <h3 className="text-xl font-bold text-white">Mystery Box</h3>
                    <p className="text-pink-300">Random epic items</p>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-white mb-2">
                      <span className="line-through text-gray-400">500</span>
                      <span className="text-green-400 ml-2">299 $GUI</span>
                    </div>
                    <div className="text-red-400 font-bold">40% OFF</div>
                  </div>
                  <div>
                    <Button 
                      onClick={handleSpecialDeal}
                      disabled={isLoading || balance < 299}
                      className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:from-pink-600 hover:to-purple-600 transition-all duration-200 font-bold text-lg disabled:opacity-50"
                    >
                      🎊 Grab Deal!
                    </Button>
                    <p className="text-pink-300 text-sm mt-2">⏰ 4 hours remaining</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
