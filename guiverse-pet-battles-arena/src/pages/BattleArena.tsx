
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Sword, Shield, Zap, Heart, Trophy, Coins, Clock } from 'lucide-react';
import PetAvatar from '@/components/PetAvatar';
import StatBar from '@/components/StatBar';
import NavBar from '@/components/NavBar';
import { useToast } from '@/components/ui/use-toast';

const BattleArena = () => {
  const [selectedPet, setSelectedPet] = useState(null);
  const [battleMode, setBattleMode] = useState('meme');
  const [battleInProgress, setBattleInProgress] = useState(false);
  const { toast } = useToast();

  const battleTypes = [
    {
      id: 'meme',
      name: 'Meme Battle',
      description: 'Battle with memes and jokes',
      reward: '50-200 $GUI',
      icon: '😂',
      gradient: 'from-pink-500 to-purple-500'
    },
    {
      id: 'ranked',
      name: 'Ranked Battle',
      description: 'Competitive battles for glory',
      reward: '100-500 $GUI',
      icon: '🏆',
      gradient: 'from-orange-500 to-red-500'
    }
  ];

  const leaderboard = [
    { rank: 1, name: "MemeKing2023", pet: "Cyber Cat", wins: 247, avatar: "🐱" },
    { rank: 2, name: "DiamondHands", pet: "Shiba Warrior", wins: 234, avatar: "🐕" },
    { rank: 3, name: "CryptoPunk", pet: "Neon Dragon", wins: 198, avatar: "🐲" },
    { rank: 4, name: "DeFiMaster", pet: "Moon Wolf", wins: 187, avatar: "🐺" },
    { rank: 5, name: "NFTLegend", pet: "Pixel Phoenix", wins: 156, avatar: "🔥" }
  ];

  const handleStartBattle = async () => {
    setBattleInProgress(true);
    toast({
      title: "🎮 Battle Started!",
      description: "Your pet is entering the arena...",
    });

    // Simulate battle logic
    setTimeout(() => {
      const isWin = Math.random() > 0.4;
      const reward = isWin ? Math.floor(Math.random() * 150) + 50 : 0;
      
      setBattleInProgress(false);
      toast({
        title: isWin ? "🎉 Victory!" : "😔 Defeat",
        description: isWin ? `You won ${reward} $GUI!` : "Better luck next time!",
      });
    }, 3000);
  };

  const handleQuickMatch = async () => {
    toast({
      title: "🔍 Finding Opponent...",
      description: "Matching you with a suitable opponent",
    });

    setTimeout(() => {
      toast({
        title: "⚡ Quick Match Found!",
        description: "Opponent found! Starting battle...",
      });
      handleStartBattle();
    }, 2000);
  };

  const handleTournamentRegister = async () => {
    toast({
      title: "🏆 Tournament Registration",
      description: "You've been registered for the weekly championship!",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-red-900">
      <NavBar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-4 bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
            ⚔️ MEME BATTLE ARENA ⚔️
          </h1>
          <p className="text-purple-200 text-lg">Where legends are born and memes come to life!</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Battle Selection */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {battleTypes.map((battle) => (
                <Card 
                  key={battle.id}
                  className={`cursor-pointer transition-all duration-300 hover:scale-105 border-2 ${
                    battleMode === battle.id 
                      ? 'border-white bg-gradient-to-br from-white/20 to-white/10' 
                      : 'border-purple-400/30 bg-gradient-to-br from-purple-800/50 to-indigo-800/50'
                  } backdrop-blur-sm`}
                  onClick={() => setBattleMode(battle.id)}
                >
                  <div className="p-6 text-center">
                    <div className="text-6xl mb-4">{battle.icon}</div>
                    <h3 className="text-2xl font-bold text-white mb-2">{battle.name}</h3>
                    <p className="text-purple-200 mb-4">{battle.description}</p>
                    <div className={`inline-block px-4 py-2 rounded-full bg-gradient-to-r ${battle.gradient} text-white font-bold`}>
                      {battle.reward}
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Battle Interface */}
            <Card className="bg-gradient-to-br from-indigo-900/50 to-purple-900/50 border-purple-400/30 backdrop-blur-sm">
              <div className="p-8">
                <h2 className="text-3xl font-bold text-white mb-6 text-center">
                  {battleMode === 'meme' ? '🎭 Meme Showdown' : '🏆 Ranked Arena'}
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                  {/* Player Pet */}
                  <div className="text-center">
                    <div className="bg-gradient-to-br from-cyan-800/50 to-blue-800/50 rounded-xl p-4 border border-cyan-400/30">
                      <h3 className="text-xl font-bold text-cyan-400 mb-2">Your Pet</h3>
                      <PetAvatar petType="Cyber Cat" size="large" />
                      <div className="mt-4">
                        <div className="text-white font-bold">CryptoKitty</div>
                        <div className="text-cyan-300">Level 12</div>
                        <div className="flex justify-center space-x-2 mt-2">
                          <div className="flex items-center text-red-400">
                            <Heart className="w-4 h-4 mr-1" />
                            <span>85</span>
                          </div>
                          <div className="flex items-center text-yellow-400">
                            <Zap className="w-4 h-4 mr-1" />
                            <span>92</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* VS */}
                  <div className="text-center">
                    <div className="text-6xl animate-pulse">⚡</div>
                    <div className="text-3xl font-bold text-white bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                      VS
                    </div>
                    {battleInProgress && (
                      <div className="mt-4">
                        <Progress value={66} className="w-full" />
                        <p className="text-purple-300 text-sm mt-2">Battle in progress...</p>
                      </div>
                    )}
                  </div>

                  {/* Opponent */}
                  <div className="text-center">
                    <div className="bg-gradient-to-br from-red-800/50 to-orange-800/50 rounded-xl p-4 border border-red-400/30">
                      <h3 className="text-xl font-bold text-red-400 mb-2">Opponent</h3>
                      <PetAvatar petType="Shiba Warrior" size="large" />
                      <div className="mt-4">
                        <div className="text-white font-bold">DiamondDoge</div>
                        <div className="text-red-300">Level 10</div>
                        <div className="flex justify-center space-x-2 mt-2">
                          <div className="flex items-center text-red-400">
                            <Heart className="w-4 h-4 mr-1" />
                            <span>78</span>
                          </div>
                          <div className="flex items-center text-yellow-400">
                            <Zap className="w-4 h-4 mr-1" />
                            <span>89</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex justify-center space-x-4">
                  <Button 
                    onClick={handleStartBattle}
                    disabled={battleInProgress}
                    className="bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 px-8 rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-200 font-bold text-lg"
                  >
                    <Sword className="mr-2" />
                    {battleInProgress ? 'Battle in Progress...' : 'Start Battle!'}
                  </Button>
                  <Button 
                    onClick={handleQuickMatch}
                    disabled={battleInProgress}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-8 rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-200 font-bold text-lg"
                  >
                    <Shield className="mr-2" />
                    Quick Match
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Leaderboard Sidebar */}
          <div>
            <Card className="bg-gradient-to-br from-yellow-800/50 to-orange-800/50 border-yellow-400/30 backdrop-blur-sm">
              <div className="p-6">
                <h3 className="text-2xl font-bold text-white mb-4 flex items-center">
                  <Trophy className="mr-2 text-yellow-400" />
                  Top Battlers
                </h3>
                <div className="space-y-3">
                  {leaderboard.map((player) => (
                    <div key={player.rank} className="flex items-center justify-between bg-white/5 rounded-lg p-3 hover:bg-white/10 transition-colors">
                      <div className="flex items-center">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mr-3 ${
                          player.rank === 1 ? 'bg-yellow-500 text-black' :
                          player.rank === 2 ? 'bg-gray-400 text-black' :
                          player.rank === 3 ? 'bg-orange-600 text-white' :
                          'bg-purple-600 text-white'
                        }`}>
                          {player.rank}
                        </div>
                        <div>
                          <div className="text-white font-medium text-sm">{player.name}</div>
                          <div className="text-gray-400 text-xs">{player.pet}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-yellow-400 font-bold text-sm">{player.wins}</div>
                        <div className="text-gray-400 text-xs">wins</div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 p-4 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-lg border border-purple-400/30">
                  <h4 className="text-white font-bold mb-2 flex items-center">
                    <Clock className="mr-2 w-4 h-4" />
                    Tournament
                  </h4>
                  <p className="text-purple-200 text-sm mb-3">Weekly Meme Championship starts in:</p>
                  <div className="text-2xl font-bold text-pink-400 text-center">02:15:43</div>
                  <Button 
                    onClick={handleTournamentRegister}
                    className="w-full mt-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2 px-4 rounded-lg hover:from-pink-600 hover:to-purple-600 transition-all duration-200 text-sm font-medium"
                  >
                    Register Now
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

export default BattleArena;
