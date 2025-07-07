
/// Governance module for GUIverse Pets
/// Allows staked users to vote on future features and competitions
module guiverse_pets::governance {
    use std::signer;
    use std::string::String;
    use std::vector;
    use aptos_framework::timestamp;
    use aptos_framework::event;
    use guiverse_pets::gui_coin;

    /// Minimum stake required to vote (100 GUI)
    const MIN_VOTING_STAKE: u64 = 10000000000;

    /// Proposal duration (7 days)
    const PROPOSAL_DURATION: u64 = 604800;

    /// Errors
    const E_INSUFFICIENT_STAKE: u64 = 1;
    const E_PROPOSAL_ENDED: u64 = 2;
    const E_ALREADY_VOTED: u64 = 3;
    const E_PROPOSAL_NOT_FOUND: u64 = 4;

    /// Proposal types
    const PROPOSAL_TYPE_TRAIT: u8 = 1;
    const PROPOSAL_TYPE_COMPETITION: u8 = 2;
    const PROPOSAL_TYPE_FEATURE: u8 = 3;

    /// Governance proposal
    struct Proposal has key, store {
        id: u64,
        title: String,
        description: String,
        proposal_type: u8,
        creator: address,
        created_at: u64,
        end_time: u64,
        votes_for: u64,
        votes_against: u64,
        voters: vector<address>,
        executed: bool,
    }

    /// Governance state
    struct GovernanceState has key {
        proposal_count: u64,
        active_proposals: vector<u64>,
    }

    /// User voting record
    struct VotingRecord has key {
        voted_proposals: vector<u64>,
        total_votes_cast: u64,
    }

    /// Events
    #[event]
    struct ProposalCreated has drop, store {
        proposal_id: u64,
        creator: address,
        title: String,
        proposal_type: u8,
    }

    #[event]
    struct VoteCast has drop, store {
        proposal_id: u64,
        voter: address,
        vote_for: bool,
        voting_power: u64,
    }

    /// Initialize governance system
    fun init_module(admin: &signer) {
        move_to(admin, GovernanceState {
            proposal_count: 0,
            active_proposals: vector::empty(),
        });
    }

    /// Create a new proposal
    public entry fun create_proposal(
        creator: &signer,
        title: String,
        description: String,
        proposal_type: u8,
    ) acquires GovernanceState {
        let creator_addr = signer::address_of(creator);
        
        // Check minimum stake requirement
        assert!(gui_coin::balance(creator_addr) >= MIN_VOTING_STAKE, E_INSUFFICIENT_STAKE);
        
        let state = borrow_global_mut<GovernanceState>(@guiverse_pets);
        let proposal_id = state.proposal_count + 1;
        state.proposal_count = proposal_id;
        
        let now = timestamp::now_seconds();
        let proposal = Proposal {
            id: proposal_id,
            title,
            description,
            proposal_type,
            creator: creator_addr,
            created_at: now,
            end_time: now + PROPOSAL_DURATION,
            votes_for: 0,
            votes_against: 0,
            voters: vector::empty(),
            executed: false,
        };

        move_to(creator, proposal);
        vector::push_back(&mut state.active_proposals, proposal_id);

        event::emit(ProposalCreated {
            proposal_id,
            creator: creator_addr,
            title,
            proposal_type,
        });
    }

    /// Cast a vote on a proposal
    public entry fun vote(
        voter: &signer,
        proposal_id: u64,
        vote_for: bool,
    ) acquires Proposal, VotingRecord {
        let voter_addr = signer::address_of(voter);
        
        // Check voting power (based on GUI balance)
        let voting_power = gui_coin::balance(voter_addr);
        assert!(voting_power >= MIN_VOTING_STAKE, E_INSUFFICIENT_STAKE);
        
        // Find and check proposal
        assert!(exists<Proposal>(@guiverse_pets), E_PROPOSAL_NOT_FOUND);
        let proposal = borrow_global_mut<Proposal>(@guiverse_pets);
        assert!(timestamp::now_seconds() <= proposal.end_time, E_PROPOSAL_ENDED);
        assert!(!vector::contains(&proposal.voters, &voter_addr), E_ALREADY_VOTED);
        
        // Record vote
        if (vote_for) {
            proposal.votes_for = proposal.votes_for + voting_power;
        } else {
            proposal.votes_against = proposal.votes_against + voting_power;
        };
        
        vector::push_back(&mut proposal.voters, voter_addr);
        
        // Update voter record
        if (!exists<VotingRecord>(voter_addr)) {
            move_to(voter, VotingRecord {
                voted_proposals: vector::empty(),
                total_votes_cast: 0,
            });
        };
        
        let record = borrow_global_mut<VotingRecord>(voter_addr);
        vector::push_back(&mut record.voted_proposals, proposal_id);
        record.total_votes_cast = record.total_votes_cast + 1;

        event::emit(VoteCast {
            proposal_id,
            voter: voter_addr,
            vote_for,
            voting_power,
        });
    }

    /// Get proposal details
    public fun get_proposal(proposal_id: u64): (String, String, u8, u64, u64, bool) acquires Proposal {
        let proposal = borrow_global<Proposal>(@guiverse_pets);
        (
            proposal.title,
            proposal.description,
            proposal.proposal_type,
            proposal.votes_for,
            proposal.votes_against,
            proposal.executed
        )
    }

    /// Check if proposal passed
    public fun proposal_passed(proposal_id: u64): bool acquires Proposal {
        let proposal = borrow_global<Proposal>(@guiverse_pets);
        timestamp::now_seconds() > proposal.end_time && 
        proposal.votes_for > proposal.votes_against
    }
}
