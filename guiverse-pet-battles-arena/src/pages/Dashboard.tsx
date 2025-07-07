
import React from 'react';
import { Heart, Zap, Star, TrendingUp, Gamepad2, Plus } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import PetAvatar from '@/components/PetAvatar';
import StatBar from '@/components/StatBar';
import NavBar from '@/components/NavBar';
import { useBlockchain } from '@/hooks/useBlockchain';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { userPets, balance, isConnected, trainPet, battlePet, claimRewards, isLoading } = useBlockchain();
  const navigate = useNavigate();

  const handleMintPet = () => {
    navigate('/shop');
  };

  const handleTrainPet = (petId: number) => {
    trainPet(petId, 'Intelligence Boost');
  };

  const handleBattlePet = (petId: number) => {
    battlePet(petId);
  };

  const handleJoinBattle = () => {
    navigate('/battle');
  };

  const handleVisitShop = () => {
    navigate('/shop');
  };

  const totalWins = userPets.reduce((sum, pet) => sum + pet.wins, 0);
  const totalLosses = userPets.reduce((sum, pet) => sum + pet.losses, 0);
  const winRate = totalWins + totalLosses > 0 ? Math.round((totalWins / (totalWins + totalLosses)) * 100) : 0;

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <NavBar />
        <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[70vh]">
          <Card className="bg-gradient-to-br from-purple-800/50 to-indigo-800/50 border-purple-400/30 backdrop-blur-sm p-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Welcome to GUIverse Pets!</h2>
            <p className="text-purple-200 mb-6">Connect your wallet to start your pet adventure</p>
            <div className="text-6xl mb-4">🎮</div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <NavBar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
            Your Pet Collection
          </h1>
          <p className="text-purple-200">Manage your AI-powered NFT companions</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Pet Cards */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {userPets.map((pet) => (
                <Card key={pet.id} className="bg-gradient-to-br from-purple-800/50 to-indigo-800/50 border-purple-400/30 backdrop-blur-sm hover:scale-105 transition-all duration-300 cursor-pointer group">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-white">{pet.name}</h3>
                        <p className="text-purple-300">{pet.type}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-cyan-400">Lv.{pet.level}</div>
                        <div className={`text-sm px-2 py-1 rounded-full ${
                          pet.rarity === 'Epic' ? 'bg-orange-500/20 text-orange-300' : 
                          pet.rarity === 'Rare' ? 'bg-blue-500/20 text-blue-300' :
                          'bg-gray-500/20 text-gray-300'
                        }`}>
                          {pet.rarity}
                        </div>
                      </div>
                    </div>

                    <PetAvatar petType={pet.type} className="mx-auto mb-4" />

                    <div className="space-y-3">
                      <StatBar icon={Heart} label="Health" value={pet.health} color="red" />
                      <StatBar icon={Zap} label="Energy" value={pet.energy} color="yellow" />
                      <StatBar icon={Star} label="Happiness" value={pet.happiness} color="pink" />
                    </div>

                    <div className="mt-4">
                      <p className="text-sm text-purple-300 mb-2">Traits:</p>
                      <div className="flex flex-wrap gap-1">
                        {pet.traits.map((trait, index) => (
                          <span key={index} className="text-xs bg-gradient-to-r from-pink-500/20 to-purple-500/20 text-pink-300 px-2 py-1 rounded-full border border-pink-400/30">
                            {trait}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mt-4">
                      <p className="text-sm text-purple-300 mb-2">Battle Record:</p>
                      <div className="flex gap-4 text-xs">
                        <span className="text-green-400">Wins: {pet.wins}</span>
                        <span className="text-red-400">Losses: {pet.losses}</span>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-4">
                      <Button 
                        onClick={() => handleTrainPet(pet.id)}
                        disabled={isLoading || pet.energy < 20}
                        className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:from-pink-600 hover:to-purple-600 transition-all duration-200 text-sm font-medium"
                      >
                        Train (50 $GUI)
                      </Button>
                      <Button 
                        onClick={() => handleBattlePet(pet.id)}
                        disabled={isLoading || pet.energy < 20}
                        className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-600 hover:to-blue-600 transition-all duration-200 text-sm font-medium"
                      >
                        Battle
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
              
              {/* Add New Pet Card */}
              <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-400/30 backdrop-blur-sm hover:scale-105 transition-all duration-300 cursor-pointer group">
                <div className="p-6 flex flex-col items-center justify-center h-full min-h-[400px]">
                  <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-200">
                    ➕
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Mint New Pet</h3>
                  <p className="text-gray-300 text-center mb-4">Add a new companion to your collection</p>
                  <Button 
                    onClick={handleMintPet}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transition-all duration-200 font-medium"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Mint Pet (100 $GUI)
                  </Button>
                </div>
              </Card>
            </div>
          </div>

          {/* Stats Sidebar */}
          <div className="space-y-6">
            <Card className="bg-gradient-to-br from-green-800/50 to-emerald-800/50 border-green-400/30 backdrop-blur-sm">
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                  <TrendingUp className="mr-2 text-green-400" />
                  $GUI Balance
                </h3>
                <div className="text-3xl font-bold text-green-400 mb-2">{balance.toLocaleString()}</div>
                <p className="text-green-300 text-sm">+247 earned today</p>
                <Button 
                  onClick={claimRewards}
                  disabled={isLoading}
                  className="w-full mt-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 transition-all duration-200 font-medium"
                >
                  Claim Rewards
                </Button>
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-orange-800/50 to-red-800/50 border-orange-400/30 backdrop-blur-sm">
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                  <Gamepad2 className="mr-2 text-orange-400" />
                  Battle Stats
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-orange-300">Wins</span>
                    <span className="text-white font-bold">{totalWins}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-orange-300">Losses</span>
                    <span className="text-white font-bold">{totalLosses}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-orange-300">Win Rate</span>
                    <span className="text-green-400 font-bold">{winRate}%</span>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-pink-800/50 to-purple-800/50 border-pink-400/30 backdrop-blur-sm">
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-4">Quick Actions</h3>
                <div className="space-y-2">
                  <Button 
                    onClick={handleMintPet}
                    className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:from-pink-600 hover:to-purple-600 transition-all duration-200 text-sm"
                  >
                    Mint New Pet
                  </Button>
                  <Button 
                    onClick={handleJoinBattle}
                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-600 hover:to-blue-600 transition-all duration-200 text-sm"
                  >
                    Join Battle
                  </Button>
                  <Button 
                    onClick={handleVisitShop}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 transition-all duration-200 text-sm"
                  >
                    Visit Shop
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
