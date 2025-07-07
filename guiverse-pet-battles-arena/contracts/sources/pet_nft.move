
/// Pet NFT module for GUIverse Pets
/// Handles minting and management of AI-powered pet NFTs
module guiverse_pets::pet_nft {
    use std::signer;
    use std::string::{Self, String};
    use std::vector;
    use std::option;
    use aptos_framework::account;
    use aptos_framework::event;
    use aptos_framework::timestamp;
    use aptos_framework::coin;
    use aptos_framework::object;
    use aptos_token_objects::collection;
    use aptos_token_objects::token;
    use guiverse_pets::gui_coin::{Self, GUICoin};

    /// Pet types
    const PET_TYPE_DOGE: u8 = 1;
    const PET_TYPE_CATTO: u8 = 2;
    const PET_TYPE_SHIBA: u8 = 3;
    const PET_TYPE_CYBER_CAT: u8 = 4;
    const PET_TYPE_MYSTIC_DRAGON: u8 = 5;

    /// Mint cost in GUI tokens (with 8 decimals)
    const MINT_COST: u64 = 10000000000; // 100 GUI

    /// Errors
    const E_INSUFFICIENT_BALANCE: u64 = 1;
    const E_INVALID_PET_TYPE: u64 = 2;
    const E_COLLECTION_NOT_FOUND: u64 = 3;

    /// Pet traits stored on-chain
    struct PetTraits has key, store, copy, drop {
        intelligence: u64,
        meme_skill: u64,
        energy: u64,
        level: u64,
        training_cooldown: u64,
    }

    /// Pet NFT resource
    struct Pet has key {
        name: String,
        pet_type: u8,
        traits: PetTraits,
        owner: address,
        created_at: u64,
        metadata_uri: String,
    }

    /// Collection info
    struct CollectionInfo has key {
        collection_name: String,
        total_minted: u64,
    }

    /// Events
    #[event]
    struct PetMinted has drop, store {
        pet_id: address,
        owner: address,
        name: String,
        pet_type: u8,
        traits: PetTraits,
        cost: u64,
    }

    #[event]
    struct PetTraitsUpdated has drop, store {
        pet_id: address,
        owner: address,
        new_traits: PetTraits,
    }

    /// Initialize the Pet NFT system
    fun init_module(admin: &signer) {
        let collection_name = string::utf8(b"GUIverse Pets");
        let description = string::utf8(b"AI-powered NFT pets in the GUIverse ecosystem");
        let uri = string::utf8(b"https://guiverse.pets/collection");

        collection::create_unlimited_collection(
            admin,
            description,
            collection_name,
            option::none(),
            uri,
        );

        move_to(admin, CollectionInfo {
            collection_name,
            total_minted: 0,
        });
    }

    /// Mint a new pet NFT
    public entry fun mint_pet(
        user: &signer,
        name: String,
        pet_type: u8,
        metadata_uri: String,
    ) acquires CollectionInfo {
        let user_addr = signer::address_of(user);
        
        // Validate pet type
        assert!(pet_type >= 1 && pet_type <= 5, E_INVALID_PET_TYPE);
        
        // Check GUI balance and charge mint cost
        assert!(gui_coin::balance(user_addr) >= MINT_COST, E_INSUFFICIENT_BALANCE);
        
        // Transfer GUI tokens for minting
        let gui_coins = coin::withdraw<GUICoin>(user, MINT_COST);
        gui_coin::burn(gui_coins);

        // Generate base traits based on pet type
        let traits = generate_base_traits(pet_type);

        // Create token
        let collection_info = borrow_global_mut<CollectionInfo>(@guiverse_pets);
        let token_name = name;
        let description = string::utf8(b"An AI-powered pet in the GUIverse");
        
        let constructor_ref = token::create_named_token(
            user,
            collection_info.collection_name,
            description,
            token_name,
            option::none(),
            metadata_uri,
        );

        let token_signer = object::generate_signer(&constructor_ref);
        let token_addr = signer::address_of(&token_signer);

        // Store pet data
        move_to(&token_signer, Pet {
            name,
            pet_type,
            traits,
            owner: user_addr,
            created_at: timestamp::now_seconds(),
            metadata_uri,
        });

        collection_info.total_minted = collection_info.total_minted + 1;

        // Emit event
        event::emit(PetMinted {
            pet_id: token_addr,
            owner: user_addr,
            name,
            pet_type,
            traits,
            cost: MINT_COST,
        });
    }

    /// Generate base traits for a pet type
    fun generate_base_traits(pet_type: u8): PetTraits {
        let (intelligence, meme_skill, energy) = if (pet_type == PET_TYPE_DOGE) {
            (50, 80, 70)
        } else if (pet_type == PET_TYPE_CATTO) {
            (70, 60, 60)
        } else if (pet_type == PET_TYPE_SHIBA) {
            (60, 90, 80)
        } else if (pet_type == PET_TYPE_CYBER_CAT) {
            (90, 70, 50)
        } else {
            (80, 85, 75) // MYSTIC_DRAGON
        };

        PetTraits {
            intelligence,
            meme_skill,
            energy,
            level: 1,
            training_cooldown: 0,
        }
    }

    /// Update pet traits (called by training module)
    public fun update_traits(pet_addr: address, new_traits: PetTraits) acquires Pet {
        let pet = borrow_global_mut<Pet>(pet_addr);
        pet.traits = new_traits;

        event::emit(PetTraitsUpdated {
            pet_id: pet_addr,
            owner: pet.owner,
            new_traits,
        });
    }

    /// Get pet information
    public fun get_pet_info(pet_addr: address): (String, u8, PetTraits, address) acquires Pet {
        let pet = borrow_global<Pet>(pet_addr);
        (pet.name, pet.pet_type, pet.traits, pet.owner)
    }

    /// Check if address owns a pet
    public fun is_pet_owner(pet_addr: address, user_addr: address): bool acquires Pet {
        if (!exists<Pet>(pet_addr)) {
            return false
        };
        let pet = borrow_global<Pet>(pet_addr);
        pet.owner == user_addr
    }
}
