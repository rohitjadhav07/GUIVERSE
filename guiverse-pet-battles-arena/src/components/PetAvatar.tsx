
import React from 'react';

interface PetAvatarProps {
  petType: string;
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

const PetAvatar: React.FC<PetAvatarProps> = ({ petType, size = 'medium', className = '' }) => {
  const getPetEmoji = (type: string) => {
    const pets = {
      'Cyber Cat': '🐱',
      'Shiba Warrior': '🐕',
      'Mystic Dragon': '🐲',
      'Cyber Wolf': '🐺',
      'Neon Dragon': '🦄',
      'Moon Wolf': '🌙',
      'Pixel Phoenix': '🔥',
      'Rainbow Cat': '🌈'
    };
    return pets[type] || '🐾';
  };

  const getSize = () => {
    switch (size) {
      case 'small':
        return 'w-12 h-12 text-2xl';
      case 'large':
        return 'w-24 h-24 text-6xl';
      default:
        return 'w-16 h-16 text-4xl';
    }
  };

  const getGradient = (type: string) => {
    const gradients = {
      'Cyber Cat': 'from-cyan-500 to-blue-500',
      'Shiba Warrior': 'from-orange-500 to-red-500',
      'Mystic Dragon': 'from-red-500 to-purple-500',
      'Cyber Wolf': 'from-gray-500 to-blue-500',
      'Neon Dragon': 'from-purple-500 to-pink-500',
      'Moon Wolf': 'from-indigo-500 to-purple-500',
      'Pixel Phoenix': 'from-orange-500 to-yellow-500',
      'Rainbow Cat': 'from-pink-500 to-cyan-500'
    };
    return gradients[type] || 'from-purple-500 to-pink-500';
  };

  return (
    <div className={`
      ${getSize()} 
      rounded-full 
      bg-gradient-to-br ${getGradient(petType)}
      flex items-center justify-center 
      border-2 border-white/20 
      shadow-lg 
      hover:scale-110 
      transition-all duration-300 
      cursor-pointer
      animate-pulse
      ${className}
    `}>
      <span className="drop-shadow-lg">
        {getPetEmoji(petType)}
      </span>
    </div>
  );
};

export default PetAvatar;
