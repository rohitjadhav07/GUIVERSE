
/// Training module for GUIverse Pets
/// Handles staking GUI tokens to upgrade pet traits
module guiverse_pets::training {
    use std::signer;
    use aptos_framework::timestamp;
    use aptos_framework::event;
    use aptos_framework::coin;
    use guiverse_pets::gui_coin::{Self, GUICoin};
    use guiverse_pets::pet_nft::{Self, PetTraits};

    /// Training costs and durations
    const TRAINING_COST_BASE: u64 = 5000000000; // 50 GUI
    const TRAINING_DURATION: u64 = 3600; // 1 hour in seconds
    const MAX_TRAIT_VALUE: u64 = 100;

    /// Errors
    const E_INSUFFICIENT_BALANCE: u64 = 1;
    const E_NOT_PET_OWNER: u64 = 2;
    const E_TRAINING_COOLDOWN: u64 = 3;
    const E_MAX_TRAIT_REACHED: u64 = 4;

    /// Training session
    struct TrainingSession has key {
        pet_addr: address,
        owner: address,
        stake_amount: u64,
        trait_type: u8, // 1=intelligence, 2=meme_skill, 3=energy
        start_time: u64,
        end_time: u64,
        completed: bool,
    }

    /// Events
    #[event]
    struct TrainingStarted has drop, store {
        pet_addr: address,
        owner: address,
        trait_type: u8,
        stake_amount: u64,
        duration: u64,
    }

    #[event]
    struct TrainingCompleted has drop, store {
        pet_addr: address,
        owner: address,
        trait_type: u8,
        old_value: u64,
        new_value: u64,
    }

    /// Start training a pet trait
    public entry fun start_training(
        user: &signer,
        pet_addr: address,
        trait_type: u8, // 1=intelligence, 2=meme_skill, 3=energy
    ) {
        let user_addr = signer::address_of(user);
        
        // Verify pet ownership
        assert!(pet_nft::is_pet_owner(pet_addr, user_addr), E_NOT_PET_OWNER);
        
        // Get current pet traits
        let (_, _, current_traits, _) = pet_nft::get_pet_info(pet_addr);
        
        // Check cooldown
        assert!(current_traits.training_cooldown <= timestamp::now_seconds(), E_TRAINING_COOLDOWN);
        
        // Calculate training cost based on current trait level
        let current_value = get_trait_value(current_traits, trait_type);
        assert!(current_value < MAX_TRAIT_VALUE, E_MAX_TRAIT_REACHED);
        
        let training_cost = TRAINING_COST_BASE * (current_traits.level + 1);
        
        // Check GUI balance
        assert!(gui_coin::balance(user_addr) >= training_cost, E_INSUFFICIENT_BALANCE);
        
        // Lock GUI tokens
        let gui_coins = coin::withdraw<GUICoin>(user, training_cost);
        coin::deposit(@guiverse_pets, gui_coins);
        
        // Create training session
        let session_addr = account::create_resource_address(&user_addr, b"training_session");
        let session_signer = account::create_signer_with_capability(
            &account::create_resource_account(user, b"training_session")
        );
        
        let now = timestamp::now_seconds();
        move_to(&session_signer, TrainingSession {
            pet_addr,
            owner: user_addr,
            stake_amount: training_cost,
            trait_type,
            start_time: now,
            end_time: now + TRAINING_DURATION,
            completed: false,
        });

        // Update pet cooldown
        let mut new_traits = current_traits;
        new_traits.training_cooldown = now + TRAINING_DURATION;
        pet_nft::update_traits(pet_addr, new_traits);

        event::emit(TrainingStarted {
            pet_addr,
            owner: user_addr,
            trait_type,
            stake_amount: training_cost,
            duration: TRAINING_DURATION,
        });
    }

    /// Complete training and upgrade trait
    public entry fun complete_training(
        user: &signer,
        session_addr: address,
    ) acquires TrainingSession {
        let user_addr = signer::address_of(user);
        let session = borrow_global_mut<TrainingSession>(session_addr);
        
        // Verify ownership and completion time
        assert!(session.owner == user_addr, E_NOT_PET_OWNER);
        assert!(timestamp::now_seconds() >= session.end_time, E_TRAINING_COOLDOWN);
        assert!(!session.completed, E_TRAINING_COOLDOWN);
        
        // Get current pet traits
        let (_, _, current_traits, _) = pet_nft::get_pet_info(session.pet_addr);
        let old_value = get_trait_value(current_traits, session.trait_type);
        
        // Calculate trait improvement (10-20 points based on stake)
        let improvement = 10 + (session.stake_amount / TRAINING_COST_BASE);
        let new_value = if (old_value + improvement > MAX_TRAIT_VALUE) {
            MAX_TRAIT_VALUE
        } else {
            old_value + improvement
        };
        
        // Update traits
        let mut new_traits = current_traits;
        set_trait_value(&mut new_traits, session.trait_type, new_value);
        new_traits.training_cooldown = 0;
        
        // Level up if all traits improved significantly
        if (new_traits.intelligence > 80 && new_traits.meme_skill > 80 && new_traits.energy > 80) {
            new_traits.level = new_traits.level + 1;
        };
        
        pet_nft::update_traits(session.pet_addr, new_traits);
        session.completed = true;

        event::emit(TrainingCompleted {
            pet_addr: session.pet_addr,
            owner: user_addr,
            trait_type: session.trait_type,
            old_value,
            new_value,
        });
    }

    /// Helper function to get trait value
    fun get_trait_value(traits: PetTraits, trait_type: u8): u64 {
        if (trait_type == 1) {
            traits.intelligence
        } else if (trait_type == 2) {
            traits.meme_skill
        } else {
            traits.energy
        }
    }

    /// Helper function to set trait value
    fun set_trait_value(traits: &mut PetTraits, trait_type: u8, value: u64) {
        if (trait_type == 1) {
            traits.intelligence = value;
        } else if (trait_type == 2) {
            traits.meme_skill = value;
        } else {
            traits.energy = value;
        }
    }
}
