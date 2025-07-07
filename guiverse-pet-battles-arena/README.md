Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm install

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

# GUIverse Pets Smart Contracts

This repository contains the complete Move smart contract implementation for GUIverse Pets, a Web3 social-AI gaming platform on the Aptos blockchain.

## Overview

GUIverse Pets allows users to:
- 🐾 Mint AI-powered NFT pets with unique traits
- 🎯 Stake $GUI tokens to train and upgrade pets
- 💝 Tip other players with $GUI tokens
- 🛍️ Purchase cosmetic items and boosts from the shop
- 🗳️ Participate in governance decisions

## Contract Architecture

### Core Modules

1. **`gui_coin.move`** - $GUI token implementation
   - ERC-20 compatible fungible token
   - Mint, burn, and transfer functionality
   - Event emissions for off-chain indexing

2. **`pet_nft.move`** - Pet NFT management
   - Mint unique pet NFTs with on-chain traits
   - Store intelligence, meme-skill, and energy attributes
   - Integration with Aptos Token Objects standard

3. **`training.move`** - Pet training and upgrades
   - Stake $GUI tokens to improve pet traits
   - Time-locked training sessions with cooldowns
   - Level progression system

4. **`tipping.move`** - Social tipping system
   - Send $GUI tips between users
   - Track statistics for leaderboards
   - Anti-spam and validation mechanisms

5. **`shop.move`** - In-game marketplace
   - Purchase cosmetic items and boosts
   - Automatic $GUI burning mechanism (5% of purchases)
   - Inventory management

6. **`governance.move`** - Decentralized governance
   - Create and vote on proposals
   - Stake-weighted voting system
   - Community-driven feature development

## Key Features

### 🔐 Security
- Comprehensive input validation
- Overflow protection
- Access control mechanisms
- Anti-double-spending protections

### 🎮 Gaming Mechanics
- Progressive pet leveling system
- Training cooldowns and resource management
- Social features with tipping and leaderboards
- Economic sinks through shop purchases

### 🌐 Web3 Integration
- Full compatibility with Aptos ecosystem
- Event emissions for off-chain indexing
- NFT standard compliance
- DeFi token mechanics

### 📊 Economics
- Deflationary tokenomics through burning
- Staking rewards and incentives
- Fair distribution mechanisms
- Sustainable game economy

## Deployment

### Prerequisites
- Aptos CLI installed
- Move compiler setup
- Testnet account with sufficient APT for gas

### Deploy Commands
```bash
# Compile contracts
aptos move compile

# Deploy to testnet
aptos move publish --profile testnet

# Initialize modules
aptos move run --function-id 0x1::gui_coin::init_module --profile testnet
```

### Testing
```bash
# Run all tests
aptos move test

# Run specific test module
aptos move test --filter test_guiverse_pets
```

## Usage Examples

### Mint a Pet NFT
```move
// Mint a Cyber Cat named "Pixel"
pet_nft::mint_pet(
    &user_signer,
    string::utf8(b"Pixel"),
    4, // CYBER_CAT type
    string::utf8(b"https://metadata.uri/pixel")
);
```

### Train Pet Intelligence
```move
// Start training session
training::start_training(&user_signer, pet_address, 1);

// Complete after cooldown
training::complete_training(&user_signer, session_address);
```

### Send a Tip
```move
// Tip 5 GUI to another player
tipping::tip_user(
    &user_signer,
    recipient_address,
    500000000, // 5 GUI (8 decimals)
    string::utf8(b"Great pet!")
);
```

### Purchase Shop Item
```move
// Buy golden collar
shop::purchase_item(
    &user_signer,
    string::utf8(b"Golden Collar")
);
```

## Integration Notes

### Trust Wallet Compatibility
- Standard Aptos token interface
- Full coin capability support
- Transaction signing compatibility

### Cross-chain (Joule Network)
- Event-based architecture for bridge monitoring
- Standardized token interfaces
- Metadata preservation across chains

### Panora Swap Integration
- Standard coin interface for DEX integration
- Liquidity pool compatibility
- Price oracle readiness

### Wapal Marketplace
- NFT metadata standard compliance
- Transfer mechanism compatibility
- Royalty support ready

## Events for Off-chain Indexing

All major actions emit events:
- `PetMinted` - New pet creation
- `TrainingStarted/Completed` - Training sessions
- `TipSent` - Social interactions
- `ItemPurchased` - Shop transactions
- `VoteCast` - Governance participation

## Token Economics

### $GUI Token Distribution
- **Pet Minting**: 100 GUI per pet
- **Training Costs**: 50+ GUI (scaling with level)
- **Shop Purchases**: 10-20 GUI per item
- **Burn Rate**: 5% of all shop purchases
- **Minimum Stakes**: 100 GUI for governance

### Deflationary Mechanisms
- Shop purchase burns
- Training token locks
- Staking requirements

## Testing on Devnet

Use the following devnet token address for testing:
```
GUI_TOKEN_ADDRESS = "0x1::gui_coin::GUICoin"
```

Test operations:
1. Mint test GUI tokens
2. Create pet NFTs
3. Execute training sessions
4. Test tipping functionality
5. Verify shop purchases and burns

## Security Auditing

Key areas reviewed:
- ✅ Integer overflow protection
- ✅ Access control validation
- ✅ Resource management
- ✅ Event emission integrity
- ✅ Economic exploit prevention

## Contributing

1. Fork the repository
2. Create feature branch
3. Add comprehensive tests
4. Submit pull request

## License

MIT License - see LICENSE file for details

## Support

For questions and support:
rohitjadhav45074507@gmail.com
