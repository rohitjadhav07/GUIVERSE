
/// GUI Coin module for GUIverse Pets
/// Handles the $GUI token functionality required for the ecosystem
module guiverse_pets::gui_coin {
    use std::signer;
    use std::string::{Self, String};
    use aptos_framework::coin::{Self, Coin, MintCapability, BurnCapability, FreezeCapability};
    use aptos_framework::event;

    /// GUI Coin struct
    struct GUICoin has key {}

    /// Capabilities for managing GUI coin
    struct Capabilities has key {
        mint_cap: MintCapability<GUICoin>,
        burn_cap: BurnCapability<GUICoin>,
        freeze_cap: FreezeCapability<GUICoin>,
    }

    /// Events
    #[event]
    struct CoinMinted has drop, store {
        amount: u64,
        recipient: address,
    }

    #[event]
    struct CoinBurned has drop, store {
        amount: u64,
        burner: address,
    }

    /// Initialize GUI coin
    fun init_module(admin: &signer) {
        let (burn_cap, freeze_cap, mint_cap) = coin::initialize<GUICoin>(
            admin,
            string::utf8(b"GUI INU"),
            string::utf8(b"GUI"),
            8, // decimals
            true, // monitor_supply
        );

        move_to(admin, Capabilities {
            mint_cap,
            burn_cap,
            freeze_cap,
        });
    }

    /// Mint GUI coins (admin only)
    public entry fun mint(admin: &signer, to: address, amount: u64) acquires Capabilities {
        let caps = borrow_global<Capabilities>(signer::address_of(admin));
        let coins = coin::mint(amount, &caps.mint_cap);
        coin::deposit(to, coins);

        event::emit(CoinMinted {
            amount,
            recipient: to,
        });
    }

    /// Burn GUI coins
    public fun burn(coins: Coin<GUICoin>) acquires Capabilities {
        let amount = coin::value(&coins);
        let caps = borrow_global<Capabilities>(@guiverse_pets);
        coin::burn(coins, &caps.burn_cap);

        event::emit(CoinBurned {
            amount,
            burner: @guiverse_pets,
        });
    }

    /// Transfer GUI coins between accounts
    public entry fun transfer(from: &signer, to: address, amount: u64) {
        coin::transfer<GUICoin>(from, to, amount);
    }

    /// Get balance of GUI coins
    public fun balance(addr: address): u64 {
        coin::balance<GUICoin>(addr)
    }
}
