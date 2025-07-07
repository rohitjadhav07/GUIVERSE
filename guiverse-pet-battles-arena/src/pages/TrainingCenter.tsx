
import React, { useState } from 'react';
import { Dumbbell, Brain, Zap, Star, TrendingUp, Clock } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import PetAvatar from '@/components/PetAvatar';
import NavBar from '@/components/NavBar';
import { useToast } from '@/components/ui/use-toast';

const TrainingCenter = () => {
  const [selectedTraining, setSelectedTraining] = useState(null);
  const [selectedPet, setSelectedPet] = useState('CryptoKitty');
  const [trainingInProgress, setTrainingInProgress] = useState(false);
  const [guiBalance, setGuiBalance] = useState(12847);
  const { toast } = useToast();

  const trainingPrograms = [
    {
      id: 'strength',
      name: 'Strength Training',
      description: 'Boost your pet\'s attack power',
      icon: Dumbbell,
      cost: 50,
      duration: '2 hours',
      benefits: ['+5 Attack', '+2 Defense', 'Unlock: Power Strike'],
      gradient: 'from-red-500 to-orange-500',
      emoji: '💪'
    },
    {
      id: 'intelligence',
      name: 'AI Enhancement',
      description: 'Improve meme generation abilities',
      icon: Brain,
      cost: 75,
      duration: '3 hours',
      benefits: ['+8 Intelligence', '+3 Creativity', 'Unlock: Meme Master'],
      gradient: 'from-purple-500 to-pink-500',
      emoji: '🧠'
    },
    {
      id: 'speed',
      name: 'Agility Boost',
      description: 'Increase battle reaction time',
      icon: Zap,
      cost: 60,
      duration: '1.5 hours',
      benefits: ['+6 Speed', '+4 Evasion', 'Unlock: Lightning Strike'],
      gradient: 'from-yellow-500 to-orange-500',
      emoji: '⚡'
    },
    {
      id: 'special',
      name: 'Legendary Training',
      description: 'Unlock rare abilities and traits',
      icon: Star,
      cost: 200,
      duration: '8 hours',
      benefits: ['+10 All Stats', 'Random Legendary Trait', 'Prestige Points'],
      gradient: 'from-cyan-500 to-blue-500',
      emoji: '⭐'
    }
  ];

  const [ongoingTraining, setOngoingTraining] = useState([
    {
      id: 1,
      petName: 'CryptoKitty',
      training: 'Strength Training',
      progress: 65,
      timeLeft: '42 minutes',
      emoji: '💪'
    },
    {
      id: 2,
      petName: 'DiamondDoge',
      training: 'AI Enhancement',
      progress: 30,
      timeLeft: '2.1 hours',
      emoji: '🧠'
    }
  ]);

  const handleStartTraining = async () => {
    if (!selectedTraining) {
      toast({
        title: "❌ No Training Selected",
        description: "Please select a training program first!",
        variant: "destructive",
      });
      return;
    }

    const program = trainingPrograms.find(p => p.id === selectedTraining);
    
    if (guiBalance < program.cost) {
      toast({
        title: "❌ Insufficient $GUI",
        description: `You need ${program.cost} $GUI for this training!`,
        variant: "destructive",
      });
      return;
    }

    setTrainingInProgress(true);
    setGuiBalance(prev => prev - program.cost);

    toast({
      title: "🚀 Training Started!",
      description: `${selectedPet} is now training ${program.name.toLowerCase()}`,
    });

    // Add to ongoing training
    const newTraining = {
      id: Date.now(),
      petName: selectedPet,
      training: program.name,
      progress: 0,
      timeLeft: program.duration,
      emoji: program.emoji
    };

    setOngoingTraining(prev => [...prev, newTraining]);

    // Simulate training progress
    setTimeout(() => {
      setTrainingInProgress(false);
      toast({
        title: "✅ Training Complete!",
        description: `${selectedPet} has completed ${program.name}!`,
      });
    }, 5000);
  };

  const handleBuyGUI = async () => {
    toast({
      title: "💰 Purchase Initiated",
      description: "Redirecting to GUI token purchase...",
    });

    // Simulate GUI purchase
    setTimeout(() => {
      setGuiBalance(prev => prev + 1000);
      toast({
        title: "✅ Purchase Complete!",
        description: "Added 1000 $GUI to your balance!",
      });
    }, 2000);
  };

  const handleCompleteTraining = (trainingId) => {
    setOngoingTraining(prev => prev.filter(t => t.id !== trainingId));
    toast({
      title: "🎉 Training Completed!",
      description: "Your pet has gained new abilities!",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900">
      <NavBar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-4 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            🏋️ TRAINING CENTER 🏋️
          </h1>
          <p className="text-purple-200 text-lg">Power up your pets with $GUI-fueled training sessions!</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Training Programs */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {trainingPrograms.map((program) => (
                <Card 
                  key={program.id}
                  className={`cursor-pointer transition-all duration-300 hover:scale-105 border-2 ${
                    selectedTraining === program.id 
                      ? 'border-white bg-gradient-to-br from-white/20 to-white/10' 
                      : 'border-purple-400/30 bg-gradient-to-br from-purple-800/50 to-indigo-800/50'
                  } backdrop-blur-sm`}
                  onClick={() => setSelectedTraining(program.id)}
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-4xl">{program.emoji}</div>
                      <div className={`text-right px-3 py-1 rounded-full bg-gradient-to-r ${program.gradient} text-white font-bold text-sm`}>
                        {program.cost} $GUI
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-white mb-2">{program.name}</h3>
                    <p className="text-purple-200 text-sm mb-4">{program.description}</p>
                    
                    <div className="flex items-center text-cyan-400 text-sm mb-4">
                      <Clock className="w-4 h-4 mr-1" />
                      {program.duration}
                    </div>

                    <div className="space-y-1">
                      <p className="text-sm text-purple-300 font-medium">Benefits:</p>
                      {program.benefits.map((benefit, index) => (
                        <div key={index} className="text-xs text-green-400 flex items-center">
                          <span className="w-1 h-1 bg-green-400 rounded-full mr-2"></span>
                          {benefit}
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Training Interface */}
            {selectedTraining && (
              <Card className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 border-purple-400/30 backdrop-blur-sm">
                <div className="p-8">
                  <h2 className="text-3xl font-bold text-white mb-6 text-center">
                    🎯 Start Training Session
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Pet Selection */}
                    <div>
                      <h3 className="text-xl font-bold text-white mb-4">Select Pet</h3>
                      <div className="space-y-3">
                        {['CryptoKitty', 'DiamondDoge'].map((petName) => (
                          <div 
                            key={petName} 
                            className={`flex items-center rounded-lg p-4 hover:bg-white/10 transition-colors cursor-pointer border ${
                              selectedPet === petName ? 'bg-white/10 border-cyan-400' : 'bg-white/5 border-purple-400/30'
                            }`}
                            onClick={() => setSelectedPet(petName)}
                          >
                            <PetAvatar petType={petName === 'CryptoKitty' ? 'Cyber Cat' : 'Shiba Warrior'} size="small" />
                            <div className="ml-4 flex-1">
                              <div className="text-white font-bold">{petName}</div>
                              <div className="text-purple-300 text-sm">Level 12 • Ready</div>
                            </div>
                            <div className="text-green-400">
                              <TrendingUp className="w-5 h-5" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Training Details */}
                    <div>
                      <h3 className="text-xl font-bold text-white mb-4">Training Details</h3>
                      <div className="bg-gradient-to-br from-indigo-800/50 to-purple-800/50 rounded-lg p-4 border border-indigo-400/30">
                        <div className="text-center mb-4">
                          <div className="text-4xl mb-2">
                            {trainingPrograms.find(p => p.id === selectedTraining)?.emoji}
                          </div>
                          <div className="text-xl font-bold text-white">
                            {trainingPrograms.find(p => p.id === selectedTraining)?.name}
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-purple-300">Cost:</span>
                            <span className="text-yellow-400 font-bold">
                              {trainingPrograms.find(p => p.id === selectedTraining)?.cost} $GUI
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-purple-300">Duration:</span>
                            <span className="text-cyan-400 font-bold">
                              {trainingPrograms.find(p => p.id === selectedTraining)?.duration}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <Button 
                        onClick={handleStartTraining}
                        disabled={trainingInProgress}
                        className="w-full mt-6 bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 px-6 rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-200 font-bold text-lg"
                      >
                        🚀 {trainingInProgress ? 'Starting...' : 'Start Training!'}
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            )}
          </div>

          {/* Training Status Sidebar */}
          <div className="space-y-6">
            {/* Ongoing Training */}
            <Card className="bg-gradient-to-br from-orange-800/50 to-red-800/50 border-orange-400/30 backdrop-blur-sm">
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                  <Clock className="mr-2 text-orange-400" />
                  Training in Progress
                </h3>
                <div className="space-y-4">
                  {ongoingTraining.map((training) => (
                    <div key={training.id} className="bg-white/5 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-white font-medium text-sm">{training.petName}</div>
                        <div className="text-2xl">{training.emoji}</div>
                      </div>
                      <div className="text-orange-300 text-xs mb-2">{training.training}</div>
                      <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
                        <div 
                          className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${training.progress}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="text-orange-400 text-xs">{training.timeLeft} remaining</div>
                        {training.progress > 90 && (
                          <Button 
                            size="sm"
                            onClick={() => handleCompleteTraining(training.id)}
                            className="bg-green-500 hover:bg-green-600 text-xs"
                          >
                            Complete
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* $GUI Balance */}
            <Card className="bg-gradient-to-br from-green-800/50 to-emerald-800/50 border-green-400/30 backdrop-blur-sm">
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                  <Star className="mr-2 text-green-400" />
                  Training Budget
                </h3>
                <div className="text-3xl font-bold text-green-400 mb-2">{guiBalance.toLocaleString()} $GUI</div>
                <p className="text-green-300 text-sm mb-4">Available for training</p>
                <Button 
                  onClick={handleBuyGUI}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-2 px-4 rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-200 font-medium"
                >
                  Buy More $GUI
                </Button>
              </div>
            </Card>

            {/* Training Rewards */}
            <Card className="bg-gradient-to-br from-purple-800/50 to-pink-800/50 border-purple-400/30 backdrop-blur-sm">
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-4">Training Rewards</h3>
                <div className="space-y-3">
                  <div className="bg-white/5 rounded-lg p-3">
                    <div className="text-purple-300 text-sm">Daily Training Bonus</div>
                    <div className="text-yellow-400 font-bold">+50 $GUI</div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3">
                    <div className="text-purple-300 text-sm">Weekly Champion</div>
                    <div className="text-pink-400 font-bold">Special NFT Badge</div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3">
                    <div className="text-purple-300 text-sm">Training Streak</div>
                    <div className="text-cyan-400 font-bold">7 days 🔥</div>
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

export default TrainingCenter;
