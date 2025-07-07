
import React, { useState } from 'react';
import { Heart, MessageSquare, Share, Trophy, Zap, Users, TrendingUp, Send } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import PetAvatar from '@/components/PetAvatar';
import NavBar from '@/components/NavBar';
import { useBlockchain } from '@/hooks/useBlockchain';

const SocialFeed = () => {
  const [activeTab, setActiveTab] = useState('feed');
  const [newPost, setNewPost] = useState('');
  const [postLikes, setPostLikes] = useState<{ [key: number]: number }>({
    1: 147, 2: 89, 3: 203, 4: 512
  });
  const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set());
  const { isConnected, tipUser, balance, isLoading } = useBlockchain();

  const feedPosts = [
    {
      id: 1,
      user: 'MemeKing2023',
      userAvatar: '👑',
      timestamp: '2 hours ago',
      type: 'battle_win',
      content: 'Just dominated the meme arena with my CryptoKitty! 🔥',
      pet: 'Cyber Cat',
      achievement: 'Won 5 battles in a row!',
      likes: postLikes[1] || 147,
      comments: 23,
      shares: 12,
      image: '🏆',
      address: '0x1234567890abcdef'
    },
    {
      id: 2,
      user: 'DiamondHands',
      userAvatar: '💎',
      timestamp: '4 hours ago',
      type: 'new_pet',
      content: 'Meet my new legendary dragon! Spent 2000 $GUI but totally worth it 🐲',
      pet: 'Mystic Dragon',
      achievement: 'New Pet Acquired!',
      likes: postLikes[2] || 89,
      comments: 34,
      shares: 8,
      image: '🐲',
      address: '0x2345678901bcdef1'
    },
    {
      id: 3,
      user: 'NFTLegend',
      userAvatar: '🚀',
      timestamp: '6 hours ago',
      type: 'training',
      content: 'My pet just completed legendary training! Stats are through the roof! 📈',
      pet: 'Cyber Wolf',
      achievement: 'Training Complete!',
      likes: postLikes[3] || 203,
      comments: 45,
      shares: 19,
      image: '💪',
      address: '0x3456789012cdef12'
    },
    {
      id: 4,
      user: 'MemeLord',
      userAvatar: '😂',
      timestamp: '8 hours ago',
      type: 'meme',
      content: 'When your pet wins but you\'re out of $GUI tokens 😭',
      pet: 'Shiba Warrior',
      achievement: 'Meme Master!',
      likes: postLikes[4] || 512,
      comments: 87,
      shares: 156,
      image: '😭',
      address: '0x456789123def1234'
    }
  ];

  const trendingTopics = [
    { tag: '#MemeMonday', posts: '2.3k' },
    { tag: '#DragonBreeding', posts: '1.8k' },
    { tag: '#GUIToken', posts: '4.2k' },
    { tag: '#LegendaryPets', posts: '892' },
    { tag: '#BattleArena', posts: '3.1k' }
  ];

  const topPlayers = [
    { name: 'CryptoMaster', pet: 'Cyber Dragon', wins: 2847, avatar: '🐲' },
    { name: 'MemeQueen', pet: 'Rainbow Cat', wins: 2156, avatar: '🐱' },
    { name: 'TokenKing', pet: 'Golden Wolf', wins: 1923, avatar: '🐺' }
  ];

  const getPostIcon = (type: string) => {
    const icons = {
      'battle_win': Trophy,
      'new_pet': Heart,
      'training': Zap,
      'meme': MessageSquare
    };
    return icons[type] || MessageSquare;
  };

  const getPostColor = (type: string) => {
    const colors = {
      'battle_win': 'from-yellow-500 to-orange-500',
      'new_pet': 'from-pink-500 to-purple-500',
      'training': 'from-blue-500 to-cyan-500',
      'meme': 'from-green-500 to-emerald-500'
    };
    return colors[type] || 'from-gray-500 to-gray-600';
  };

  const handleLike = (postId: number) => {
    if (!isConnected) return;
    
    setLikedPosts(prev => {
      const newLiked = new Set(prev);
      if (newLiked.has(postId)) {
        newLiked.delete(postId);
        setPostLikes(prevLikes => ({
          ...prevLikes,
          [postId]: (prevLikes[postId] || 0) - 1
        }));
      } else {
        newLiked.add(postId);
        setPostLikes(prevLikes => ({
          ...prevLikes,
          [postId]: (prevLikes[postId] || 0) + 1
        }));
      }
      return newLiked;
    });
  };

  const handleTip = (userAddress: string, userName: string) => {
    if (!isConnected) return;
    
    const tipAmount = 10;
    tipUser(userAddress, tipAmount, `Great post from ${userName}!`);
  };

  const handlePost = () => {
    if (!isConnected || !newPost.trim()) return;
    
    // Mock posting functionality
    console.log('Posting:', newPost);
    setNewPost('');
  };

  const handleShare = (postId: number) => {
    if (!isConnected) return;
    
    // Mock share functionality
    navigator.clipboard.writeText(`Check out this amazing post from GUIverse Pets! Post ID: ${postId}`);
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-900 via-purple-900 to-indigo-900">
        <NavBar />
        <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[70vh]">
          <Card className="bg-gradient-to-br from-purple-800/50 to-indigo-800/50 border-purple-400/30 backdrop-blur-sm p-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Join the Community</h2>
            <p className="text-purple-200 mb-6">Connect your wallet to interact with the GUIverse community</p>
            <div className="text-6xl mb-4">🌟</div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-900 via-purple-900 to-indigo-900">
      <NavBar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-4 bg-gradient-to-r from-violet-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            🌟 SOCIAL FEED 🌟
          </h1>
          <p className="text-purple-200 text-lg">Connect with the GUIverse community!</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Feed */}
          <div className="lg:col-span-3">
            {/* Post Creation */}
            <Card className="bg-gradient-to-br from-purple-800/50 to-indigo-800/50 border-purple-400/30 backdrop-blur-sm mb-6">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-2xl">
                    👤
                  </div>
                  <input 
                    type="text" 
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                    placeholder="Share your pet's latest achievement..."
                    className="flex-1 ml-4 bg-white/10 border border-purple-400/30 rounded-lg px-4 py-2 text-white placeholder-purple-300 focus:outline-none focus:border-purple-400"
                  />
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex space-x-2">
                    <button className="text-purple-300 hover:text-white transition-colors">📸</button>
                    <button className="text-purple-300 hover:text-white transition-colors">🎮</button>
                    <button className="text-purple-300 hover:text-white transition-colors">🏆</button>
                  </div>
                  <Button 
                    onClick={handlePost}
                    disabled={!newPost.trim() || isLoading}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transition-all duration-200 font-medium"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Post
                  </Button>
                </div>
              </div>
            </Card>

            {/* Feed Posts */}
            <div className="space-y-6">
              {feedPosts.map((post) => {
                const PostIcon = getPostIcon(post.type);
                const isLiked = likedPosts.has(post.id);
                
                return (
                  <Card key={post.id} className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-400/30 backdrop-blur-sm hover:border-purple-400/50 transition-all duration-300">
                    <div className="p-6">
                      {/* Post Header */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-xl">
                            {post.userAvatar}
                          </div>
                          <div className="ml-3">
                            <div className="text-white font-bold">{post.user}</div>
                            <div className="text-gray-400 text-sm">{post.timestamp}</div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className={`p-2 rounded-lg bg-gradient-to-r ${getPostColor(post.type)}`}>
                            <PostIcon className="w-5 h-5 text-white" />
                          </div>
                          <Button
                            onClick={() => handleTip(post.address, post.user)}
                            disabled={isLoading || balance < 10}
                            size="sm"
                            className="bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 text-xs"
                          >
                            Tip 10 $GUI
                          </Button>
                        </div>
                      </div>

                      {/* Post Content */}
                      <div className="mb-4">
                        <p className="text-white mb-3">{post.content}</p>
                        
                        {/* Achievement Badge */}
                        <div className="flex items-center justify-between bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-lg p-4 border border-purple-400/30">
                          <div className="flex items-center">
                            <PetAvatar petType={post.pet} size="small" />
                            <div className="ml-3">
                              <div className="text-white font-medium">{post.pet}</div>
                              <div className="text-purple-300 text-sm">{post.achievement}</div>
                            </div>
                          </div>
                          <div className="text-4xl">{post.image}</div>
                        </div>
                      </div>

                      {/* Post Actions */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                        <div className="flex space-x-6">
                          <button 
                            onClick={() => handleLike(post.id)}
                            className={`flex items-center transition-colors ${
                              isLiked ? 'text-pink-400' : 'text-gray-400 hover:text-pink-400'
                            }`}
                          >
                            <Heart className={`w-5 h-5 mr-1 ${isLiked ? 'fill-current' : ''}`} />
                            <span>{post.likes}</span>
                          </button>
                          <button className="flex items-center text-gray-400 hover:text-blue-400 transition-colors">
                            <MessageSquare className="w-5 h-5 mr-1" />
                            <span>{post.comments}</span>
                          </button>
                          <button 
                            onClick={() => handleShare(post.id)}
                            className="flex items-center text-gray-400 hover:text-green-400 transition-colors"
                          >
                            <Share className="w-5 h-5 mr-1" />
                            <span>{post.shares}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Trending Topics */}
            <Card className="bg-gradient-to-br from-pink-800/50 to-purple-800/50 border-pink-400/30 backdrop-blur-sm">
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                  <TrendingUp className="mr-2 text-pink-400" />
                  Trending
                </h3>
                <div className="space-y-3">
                  {trendingTopics.map((topic, index) => (
                    <button
                      key={index}
                      onClick={() => console.log(`Searching for ${topic.tag}`)}
                      className="w-full flex items-center justify-between hover:bg-white/5 rounded-lg p-2 cursor-pointer transition-colors text-left"
                    >
                      <div className="text-pink-400 font-medium">{topic.tag}</div>
                      <div className="text-gray-400 text-sm">{topic.posts}</div>
                    </button>
                  ))}
                </div>
              </div>
            </Card>

            {/* Top Players */}
            <Card className="bg-gradient-to-br from-orange-800/50 to-red-800/50 border-orange-400/30 backdrop-blur-sm">
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                  <Users className="mr-2 text-orange-400" />
                  Top Players
                </h3>
                <div className="space-y-3">
                  {topPlayers.map((player, index) => (
                    <button
                      key={index}
                      onClick={() => console.log(`Viewing ${player.name}'s profile`)}
                      className="w-full flex items-center justify-between bg-white/5 rounded-lg p-3 hover:bg-white/10 transition-colors"
                    >
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center text-lg">
                          {player.avatar}
                        </div>
                        <div className="ml-3 text-left">
                          <div className="text-white font-medium text-sm">{player.name}</div>
                          <div className="text-orange-300 text-xs">{player.pet}</div>
                        </div>
                      </div>
                      <div className="text-orange-400 font-bold text-sm">{player.wins}</div>
                    </button>
                  ))}
                </div>
              </div>
            </Card>

            {/* Community Stats */}
            <Card className="bg-gradient-to-br from-cyan-800/50 to-blue-800/50 border-cyan-400/30 backdrop-blur-sm">
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-4">Community</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-cyan-300">Total Players</span>
                    <span className="text-white font-bold">47.2k</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-cyan-300">Active Today</span>
                    <span className="text-green-400 font-bold">12.8k</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-cyan-300">Battles Today</span>
                    <span className="text-yellow-400 font-bold">89.3k</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-cyan-300">$GUI Burned</span>
                    <span className="text-purple-400 font-bold">2.1M</span>
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

export default SocialFeed;
