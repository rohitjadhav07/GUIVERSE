
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Sword, Dumbbell, ShoppingBag, Users, Star, Wallet, LogOut } from 'lucide-react';
import { useBlockchain } from '@/hooks/useBlockchain';
import { Button } from '@/components/ui/button';

const NavBar = () => {
  const { isConnected, account, balance, connectWallet, disconnectWallet, isLoading } = useBlockchain();
  
  const navItems = [
    { to: '/', icon: Home, label: 'Dashboard' },
    { to: '/battle', icon: Sword, label: 'Battle Arena' },
    { to: '/training', icon: Dumbbell, label: 'Training' },
    { to: '/shop', icon: ShoppingBag, label: 'Shop' },
    { to: '/social', icon: Users, label: 'Social' }
  ];

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <nav className="bg-black/20 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              🎮 GUIverse Pets
            </div>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center px-4 py-2 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`
                }
              >
                <item.icon className="w-4 h-4 mr-2" />
                {item.label}
              </NavLink>
            ))}
          </div>

          {/* User Section */}
          <div className="flex items-center space-x-4">
            {isConnected && (
              <div className="flex items-center bg-gradient-to-r from-green-600/20 to-emerald-600/20 px-3 py-1 rounded-full border border-green-400/30">
                <Star className="w-4 h-4 text-green-400 mr-1" />
                <span className="text-green-400 font-bold">{balance.toLocaleString()}</span>
                <span className="text-green-300 ml-1 text-sm">$GUI</span>
              </div>
            )}
            
            {isConnected ? (
              <div className="flex items-center space-x-2">
                <div className="flex items-center bg-gradient-to-r from-purple-600/20 to-pink-600/20 px-3 py-1 rounded-full border border-purple-400/30">
                  <span className="text-purple-300 text-sm">{formatAddress(account!)}</span>
                </div>
                <Button
                  onClick={disconnectWallet}
                  variant="ghost"
                  size="sm"
                  className="text-red-300 hover:text-red-100 hover:bg-red-500/20"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <Button
                onClick={connectWallet}
                disabled={isLoading}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transition-all duration-200"
              >
                <Wallet className="w-4 h-4 mr-2" />
                {isLoading ? 'Connecting...' : 'Connect Wallet'}
              </Button>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center justify-around py-2 space-x-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center px-2 py-1 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-white/20 text-white'
                    : 'text-gray-300 hover:text-white'
                }`
              }
            >
              <item.icon className="w-5 h-5 mb-1" />
              <span className="text-xs">{item.label}</span>
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
