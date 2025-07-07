
/// Shop module for GUIverse Pets
/// Handles purchasing cosmetic items and behavior packs
module guiverse_pets::shop {
    use std::signer;
    use std::string::String;
    use aptos_framework::event;
    use aptos_framework::coin;
    use guiverse_pets::gui_coin::{Self, GUICoin};

    /// Shop item types
    const ITEM_TYPE_COSMETIC: u8 = 1;
    const ITEM_TYPE_BEHAVIOR: u8 = 2;
    const ITEM_TYPE_BOOST: u8 = 3;

    /// Burn percentage (5%)
    const BURN_PERCENTAGE: u64 = 5;

    /// Errors
    const E_INSUFFICIENT_BALANCE: u64 = 1;
    const E_ITEM_NOT_FOUND: u64 = 2;
    const E_ITEM_NOT_AVAILABLE: u64 = 3;

    /// Shop item definition
    struct ShopItem has key, store {
        name: String,
        description: String,
        price: u64,
        item_type: u8,
        available: bool,
        total_sold: u64,
    }

    /// User's purchased items
    struct UserInventory has key {
        items: vector<String>, // item names
        total_spent: u64,
    }

    /// Shop configuration
    struct ShopConfig has key {
        items: vector<String>, // available item names
        total_revenue: u64,
        total_burned: u64,
    }

    /// Events
    #[event]
    struct ItemPurchased has drop, store {
        buyer: address,
        item_name: String,
        price: u64,
        burn_amount: u64,
    }

    #[event]
    struct ItemAdded has drop, store {
        name: String,
        price: u64,
        item_type: u8,
    }

    /// Initialize shop with default items
    fun init_module(admin: &signer) {
        let config = ShopConfig {
            items: vector::empty(),
            total_revenue: 0,
            total_burned: 0,
        };
        move_to(admin, config);

        // Add default cosmetic items
        add_shop_item(admin, 
            string::utf8(b"Golden Collar"),
            string::utf8(b"A shiny golden collar for your pet"),
            2000000000, // 20 GUI
            ITEM_TYPE_COSMETIC
        );

        add_shop_item(admin,
            string::utf8(b"Meme Glasses"),
            string::utf8(b"Cool sunglasses to boost meme skills"),
            1500000000, // 15 GUI
            ITEM_TYPE_COSMETIC
        );

        add_shop_item(admin,
            string::utf8(b"Energy Drink"),
            string::utf8(b"Temporarily boost your pet's energy"),
            1000000000, // 10 GUI
            ITEM_TYPE_BOOST
        );
    }

    /// Add a new item to the shop (admin only)
    public entry fun add_shop_item(
        admin: &signer,
        name: String,
        description: String,
        price: u64,
        item_type: u8,
    ) acquires ShopConfig {
        let admin_addr = signer::address_of(admin);
        assert!(admin_addr == @guiverse_pets, E_ITEM_NOT_FOUND);

        let item = ShopItem {
            name,
            description,
            price,
            item_type,
            available: true,
            total_sold: 0,
        };

        move_to(admin, item);

        let config = borrow_global_mut<ShopConfig>(@guiverse_pets);
        vector::push_back(&mut config.items, name);

        event::emit(ItemAdded {
            name,
            price,
            item_type,
        });
    }

    /// Purchase an item from the shop
    public entry fun purchase_item(
        user: &signer,
        item_name: String,
    ) acquires ShopItem, UserInventory, ShopConfig {
        let user_addr = signer::address_of(user);
        
        // Check if item exists and is available
        assert!(exists<ShopItem>(@guiverse_pets), E_ITEM_NOT_FOUND);
        let item = borrow_global_mut<ShopItem>(@guiverse_pets);
        assert!(item.available, E_ITEM_NOT_AVAILABLE);
        
        // Check user balance
        assert!(gui_coin::balance(user_addr) >= item.price, E_INSUFFICIENT_BALANCE);
        
        // Calculate burn amount
        let burn_amount = (item.price * BURN_PERCENTAGE) / 100;
        let revenue_amount = item.price - burn_amount;
        
        // Transfer tokens
        let payment = coin::withdraw<GUICoin>(user, item.price);
        let burn_coins = coin::extract(&mut payment, burn_amount);
        
        // Burn portion of payment
        gui_coin::burn(burn_coins);
        
        // Send remaining to treasury
        coin::deposit(@guiverse_pets, payment);
        
        // Initialize user inventory if needed
        if (!exists<UserInventory>(user_addr)) {
            move_to(user, UserInventory {
                items: vector::empty(),
                total_spent: 0,
            });
        };
        
        // Add item to user inventory
        let inventory = borrow_global_mut<UserInventory>(user_addr);
        vector::push_back(&mut inventory.items, item_name);
        inventory.total_spent = inventory.total_spent + item.price;
        
        // Update item and shop stats
        item.total_sold = item.total_sold + 1;
        
        let config = borrow_global_mut<ShopConfig>(@guiverse_pets);
        config.total_revenue = config.total_revenue + revenue_amount;
        config.total_burned = config.total_burned + burn_amount;

        event::emit(ItemPurchased {
            buyer: user_addr,
            item_name,
            price: item.price,
            burn_amount,
        });
    }

    /// Get user's inventory
    public fun get_user_inventory(user_addr: address): vector<String> acquires UserInventory {
        if (!exists<UserInventory>(user_addr)) {
            return vector::empty()
        };
        
        let inventory = borrow_global<UserInventory>(user_addr);
        inventory.items
    }

    /// Get shop statistics
    public fun get_shop_stats(): (u64, u64) acquires ShopConfig {
        let config = borrow_global<ShopConfig>(@guiverse_pets);
        (config.total_revenue, config.total_burned)
    }

    /// Check if user owns an item
    public fun owns_item(user_addr: address, item_name: String): bool acquires UserInventory {
        if (!exists<UserInventory>(user_addr)) {
            return false
        };
        
        let inventory = borrow_global<UserInventory>(user_addr);
        vector::contains(&inventory.items, &item_name)
    }
}
