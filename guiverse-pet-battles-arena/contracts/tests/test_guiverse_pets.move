
/// Tests for GUIverse Pets smart contracts
#[test_only]
module guiverse_pets::test_guiverse_pets {
    use std::signer;
    use std::string;
    use aptos_framework::account;
    use aptos_framework::timestamp;
    use aptos_framework::coin;
    use guiverse_pets::gui_coin;
    use guiverse_pets::pet_nft;
    use guiverse_pets::training;
    use guiverse_pets::tipping;
    use guiverse_pets::shop;

    // Test addresses
    const ADMIN: address = @0x1;
    const USER1: address = @0x2;
    const USER2: address = @0x3;

    #[test(admin = @guiverse_pets, user1 = @0x2, user2 = @0x3)]
    fun test_full_workflow(admin: &signer, user1: &signer, user2: &signer) {
        // Initialize timestamp
        timestamp::set_time_has_started_for_testing(&account::create_signer_for_test(@0x1));
        
        // Initialize GUI coin
        gui_coin::init_module(admin);
        
        // Mint initial GUI tokens for testing
        gui_coin::mint(admin, signer::address_of(user1), 50000000000); // 500 GUI
        gui_coin::mint(admin, signer::address_of(user2), 30000000000); // 300 GUI
        
        // Test minting pets
        pet_nft::mint_pet(
            user1,
            string::utf8(b"Doge Supreme"),
            1, // DOGE type
            string::utf8(b"https://metadata.uri/1")
        );
        
        pet_nft::mint_pet(
            user2,
            string::utf8(b"Cyber Kitty"),
            4, // CYBER_CAT type
            string::utf8(b"https://metadata.uri/2")
        );
        
        // Test tipping
        tipping::tip_user(
            user1,
            signer::address_of(user2),
            500000000, // 5 GUI
            string::utf8(b"Great pet!")
        );
        
        // Test shop purchase
        shop::purchase_item(
            user1,
            string::utf8(b"Golden Collar")
        );
        
        // Verify balances and ownership
        let user1_balance = gui_coin::balance(signer::address_of(user1));
        let user2_balance = gui_coin::balance(signer::address_of(user2));
        
        // User1 should have: 500 - 100 (mint) - 5 (tip) - 20 (shop) = 375 GUI
        assert!(user1_balance == 37500000000, 1);
        
        // User2 should have: 300 - 100 (mint) + 5 (tip) = 205 GUI
        assert!(user2_balance == 20500000000, 2);
        
        // Check shop item ownership
        assert!(shop::owns_item(signer::address_of(user1), string::utf8(b"Golden Collar")), 3);
        
        // Check tip stats
        let (sent, received, _, _) = tipping::get_tip_stats(signer::address_of(user1));
        assert!(sent == 500000000, 4);
        
        let (_, received2, _, _) = tipping::get_tip_stats(signer::address_of(user2));
        assert!(received2 == 500000000, 5);
    }

    #[test(admin = @guiverse_pets, user = @0x2)]
    fun test_training_workflow(admin: &signer, user: &signer) {
        // Setup
        timestamp::set_time_has_started_for_testing(&account::create_signer_for_test(@0x1));
        gui_coin::init_module(admin);
        gui_coin::mint(admin, signer::address_of(user), 20000000000); // 200 GUI
        
        // Mint a pet
        pet_nft::mint_pet(
            user,
            string::utf8(b"Training Pet"),
            2, // CATTO type
            string::utf8(b"https://metadata.uri/training")
        );
        
        // Get pet address (simplified for test)
        let pet_addr = signer::address_of(user); // In practice, this would be the NFT token address
        
        // Start training
        training::start_training(user, pet_addr, 1); // Train intelligence
        
        // Fast forward time
        timestamp::fast_forward_seconds(3601); // 1 hour + 1 second
        
        // Complete training
        let session_addr = account::create_resource_address(&signer::address_of(user), b"training_session");
        training::complete_training(user, session_addr);
        
        // Verify training completion (would check pet traits in practice)
        let balance_after = gui_coin::balance(signer::address_of(user));
        // Should have spent 50 GUI for training: 200 - 100 (mint) - 50 (training) = 50 GUI
        assert!(balance_after == 5000000000, 1);
    }

    #[test(admin = @guiverse_pets)]
    fun test_shop_burn_mechanism(admin: &signer) {
        // Setup
        gui_coin::init_module(admin);
        shop::init_module(admin);
        
        let user = account::create_signer_for_test(@0x4);
        gui_coin::mint(admin, signer::address_of(&user), 5000000000); // 50 GUI
        
        // Purchase item
        shop::purchase_item(&user, string::utf8(b"Energy Drink"));
        
        // Check shop stats
        let (revenue, burned) = shop::get_shop_stats();
        assert!(burned == 50000000, 1); // 5% of 10 GUI = 0.5 GUI burned
        assert!(revenue == 950000000, 2); // 95% of 10 GUI = 9.5 GUI revenue
    }
}
