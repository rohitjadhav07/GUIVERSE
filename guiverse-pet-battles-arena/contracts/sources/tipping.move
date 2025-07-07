
/// Tipping module for GUIverse Pets
/// Handles GUI token tips between pet owners
module guiverse_pets::tipping {
    use std::signer;
    use aptos_framework::event;
    use aptos_framework::coin;
    use aptos_framework::account;
    use guiverse_pets::gui_coin::{Self, GUICoin};

    /// Minimum tip amount
    const MIN_TIP_AMOUNT: u64 = 100000000; // 1 GUI

    /// Errors
    const E_INSUFFICIENT_BALANCE: u64 = 1;
    const E_INVALID_TIP_AMOUNT: u64 = 2;
    const E_SELF_TIP: u64 = 3;

    /// Tip statistics for each user
    struct TipStats has key {
        total_tips_sent: u64,
        total_tips_received: u64,
        tip_count_sent: u64,
        tip_count_received: u64,
    }

    /// Events
    #[event]
    struct TipSent has drop, store {
        from: address,
        to: address,
        amount: u64,
        message: String,
    }

    /// Initialize tipping stats for a user
    fun init_tip_stats(user: &signer) {
        if (!exists<TipStats>(signer::address_of(user))) {
            move_to(user, TipStats {
                total_tips_sent: 0,
                total_tips_received: 0,
                tip_count_sent: 0,
                tip_count_received: 0,
            });
        }
    }

    /// Send a tip to another pet owner
    public entry fun tip_user(
        from: &signer,
        to: address,
        amount: u64,
        message: String,
    ) acquires TipStats {
        let from_addr = signer::address_of(from);
        
        // Validation
        assert!(from_addr != to, E_SELF_TIP);
        assert!(amount >= MIN_TIP_AMOUNT, E_INVALID_TIP_AMOUNT);
        assert!(gui_coin::balance(from_addr) >= amount, E_INSUFFICIENT_BALANCE);
        
        // Initialize stats if needed
        init_tip_stats(from);
        if (!exists<TipStats>(to)) {
            let to_signer = account::create_signer_with_capability(
                &account::create_resource_account(from, b"tip_init")
            );
            move_to(&to_signer, TipStats {
                total_tips_sent: 0,
                total_tips_received: 0,
                tip_count_sent: 0,
                tip_count_received: 0,
            });
        };
        
        // Transfer GUI tokens
        gui_coin::transfer(from, to, amount);
        
        // Update sender stats
        let from_stats = borrow_global_mut<TipStats>(from_addr);
        from_stats.total_tips_sent = from_stats.total_tips_sent + amount;
        from_stats.tip_count_sent = from_stats.tip_count_sent + 1;
        
        // Update receiver stats
        let to_stats = borrow_global_mut<TipStats>(to);
        to_stats.total_tips_received = to_stats.total_tips_received + amount;
        to_stats.tip_count_received = to_stats.tip_count_received + 1;

        event::emit(TipSent {
            from: from_addr,
            to,
            amount,
            message,
        });
    }

    /// Get tip statistics for a user
    public fun get_tip_stats(user_addr: address): (u64, u64, u64, u64) acquires TipStats {
        if (!exists<TipStats>(user_addr)) {
            return (0, 0, 0, 0)
        };
        
        let stats = borrow_global<TipStats>(user_addr);
        (
            stats.total_tips_sent,
            stats.total_tips_received,
            stats.tip_count_sent,
            stats.tip_count_received
        )
    }

    /// Get leaderboard ranking based on tips received
    public fun get_tip_leaderboard_score(user_addr: address): u64 acquires TipStats {
        if (!exists<TipStats>(user_addr)) {
            return 0
        };
        
        let stats = borrow_global<TipStats>(user_addr);
        stats.total_tips_received
    }
}
