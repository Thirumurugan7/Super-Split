use starknet::ContractAddress;
use array::ArrayTrait;
use starknet::get_caller_address;
use starknet::get_block_timestamp;
use starknet::storage::Map;

#[derive(Copy, Drop, Serde, starknet::Store)]
struct Subscription {
    id: u256,
    name: felt252,
    description: felt252,
    service_provider: ContractAddress,
    base_amount: u256,
    token: ContractAddress,
    start_time: u64,
    frequency: Frequency,
    active: bool,
}

#[derive(Copy, Drop, Serde, starknet::Store)]
enum Frequency {
    Monthly,
    Quarterly,
    HalfYearly,
    Annually,
}

#[derive(Copy, Drop, Serde, starknet::Store)]
struct Transaction {
    sender: ContractAddress,
    receiver: ContractAddress,
    amount: u256,
    token: ContractAddress,
    timestamp: u64,
}

#[derive(Copy, Drop, Serde, starknet::Store)]
struct UserSubscription {
    subscription_id: u256,
    next_payment_due: u64,
    amount: u256,
}

#[starknet::interface]
trait IERC20<TContractState> {
    fn transfer(ref self: TContractState, recipient: ContractAddress, amount: u256) -> bool;
    fn transfer_from(
        ref self: TContractState,
        sender: ContractAddress,
        recipient: ContractAddress,
        amount: u256
    ) -> bool;
}

#[starknet::interface]
trait ISuperSplit<TContractState> {
    fn create_subscription(
        ref self: TContractState,
        name: felt252,
        description: felt252,
        base_amount: u256,
        token: ContractAddress
    );
    fn select_subscription(ref self: TContractState, subscription_id: u256, frequency: Frequency);
    fn send_payment(
        ref self: TContractState,
        receiver: ContractAddress,
        amount: u256,
        token: ContractAddress
    );
    fn get_subscription_details(
        self: @TContractState,
        subscription_id: u256
    ) -> (felt252, felt252, ContractAddress, u256, ContractAddress, bool);
    fn calculate_cost(self: @TContractState, base_amount: u256, frequency: Frequency) -> u256;
    fn get_interval(self: @TContractState, frequency: Frequency) -> u64;
    fn get_all_subscriptions(self: @TContractState) -> Array<Subscription>;
    fn get_user_subscriptions(self: @TContractState, user: ContractAddress) -> Array<UserSubscription>;
    fn get_subscription_count(self: @TContractState) -> u256;
    fn get_user_transaction_history(self: @TContractState, user: ContractAddress) -> Transaction;
    fn update_subscription(
        ref self: TContractState,
        subscription_id: u256,
        name: felt252,
        description: felt252,
        base_amount: u256,
        active: bool
    );
    fn cancel_subscription(ref self: TContractState, subscription_id: u256);
    fn process_payment(ref self: TContractState, subscription_id: u256);
    fn get_next_payment_date(self: @TContractState, subscription_id: u256, user: ContractAddress) -> u64;
}

#[starknet::contract]
mod super_split {
    use super::{
        Subscription, Frequency, Transaction, UserSubscription, ContractAddress, IERC20Dispatcher,
        IERC20DispatcherTrait
    };
    use starknet::{get_caller_address, get_block_timestamp};
    use array::ArrayTrait;
    use starknet::storage::Map;

    #[storage]
    struct Storage {
        next_subscription_id: u256,
        subscriptions: Map<u256, Subscription>,
        user_subscriptions: Map<(ContractAddress, u256), UserSubscription>,
        transaction_history: Map<ContractAddress, Transaction>,
    }

    #[constructor]
    fn constructor(ref self: ContractState) {
        self.next_subscription_id.write(1.into());
    }

    #[abi(embed_v0)]
    impl SuperSplit of super::ISuperSplit<ContractState> {
        fn create_subscription(
            ref self: ContractState,
            name: felt252,
            description: felt252,
            base_amount: u256,
            token: ContractAddress
        ) {
            let caller = get_caller_address();
            let current_id = self.next_subscription_id.read();
            let new_subscription = Subscription {
                id: current_id,
                name: name,
                description: description,
                service_provider: caller,
                base_amount: base_amount,
                token: token,
                start_time: get_block_timestamp(),
                frequency: Frequency::Monthly,
                active: true,
            };

            self.subscriptions.write(current_id, new_subscription);
            self.next_subscription_id.write(current_id + 1.into());
        }

        fn select_subscription(
            ref self: ContractState,
            subscription_id: u256,
            frequency: Frequency
        ) {
            let current_subscription = self.subscriptions.read(subscription_id);
            assert(current_subscription.active, 'Subscription not active');

            let amount = self.calculate_cost(current_subscription.base_amount, frequency);
            let next_payment_due = get_block_timestamp() + self.get_interval(frequency);
            let caller = get_caller_address();

            let token_dispatcher = IERC20Dispatcher { contract_address: current_subscription.token };
            token_dispatcher.transfer_from(
                caller, current_subscription.service_provider, amount
            );

            let new_user_subscription = UserSubscription {
                subscription_id: subscription_id,
                next_payment_due: next_payment_due,
                amount: amount,
            };
            self.user_subscriptions.write((caller, subscription_id), new_user_subscription);
        }

        fn send_payment(
            ref self: ContractState,
            receiver: ContractAddress,
            amount: u256,
            token: ContractAddress
        ) {
            assert(!receiver.is_zero(), 'Invalid receiver');
            assert(amount > 0.into(), 'Amount must be greater than 0');

            let caller = get_caller_address();
            let token_dispatcher = IERC20Dispatcher { contract_address: token };
            token_dispatcher.transfer_from(caller, receiver, amount);

            let new_transaction = Transaction {
                sender: caller,
                receiver: receiver,
                amount: amount,
                token: token,
                timestamp: get_block_timestamp(),
            };
            self.transaction_history.write(caller, new_transaction);
        }

        fn get_subscription_details(
            self: @ContractState,
            subscription_id: u256
        ) -> (felt252, felt252, ContractAddress, u256, ContractAddress, bool) {
            let subscription = self.subscriptions.read(subscription_id);
            (
                subscription.name,
                subscription.description,
                subscription.service_provider,
                subscription.base_amount,
                subscription.token,
                subscription.active
            )
        }

        fn calculate_cost(
            self: @ContractState, 
            base_amount: u256, 
            frequency: Frequency
        ) -> u256 {
            match frequency {
                Frequency::Monthly => base_amount,
                Frequency::Quarterly => base_amount * 3.into(),
                Frequency::HalfYearly => base_amount * 6.into(),
                Frequency::Annually => base_amount * 12.into(),
            }
        }

        fn get_interval(
            self: @ContractState, 
            frequency: Frequency
        ) -> u64 {
            match frequency {
                Frequency::Monthly => 30 * 24 * 60 * 60, // 30 days in seconds
                Frequency::Quarterly => 90 * 24 * 60 * 60,
                Frequency::HalfYearly => 180 * 24 * 60 * 60,
                Frequency::Annually => 365 * 24 * 60 * 60,
            }
        }

        fn get_all_subscriptions(self: @ContractState) -> Array<Subscription> {
            let mut subscriptions = ArrayTrait::new();
            let count = self.next_subscription_id.read();
            let mut i: u256 = 1.into();
            
            loop {
                if i >= count {
                    break;
                }
                
                let subscription = self.subscriptions.read(i);
                if subscription.active {
                    subscriptions.append(subscription);
                }
                i += 1.into();
            };
            
            subscriptions
        }

        fn get_user_subscriptions(
            self: @ContractState, 
            user: ContractAddress
        ) -> Array<UserSubscription> {
            let mut user_subs = ArrayTrait::new();
            let count = self.next_subscription_id.read();
            let mut i: u256 = 1.into();
            
            loop {
                if i >= count {
                    break;
                }
                
                let user_sub = self.user_subscriptions.read((user, i));
                if user_sub.subscription_id != 0.into() {
                    user_subs.append(user_sub);
                }
                i += 1.into();
            };
            
            user_subs
        }

        fn get_subscription_count(self: @ContractState) -> u256 {
            self.next_subscription_id.read() - 1.into()
        }

        fn get_user_transaction_history(
            self: @ContractState, 
            user: ContractAddress
        ) -> Transaction {
            self.transaction_history.read(user)
        }

        fn update_subscription(
            ref self: ContractState,
            subscription_id: u256,
            name: felt252,
            description: felt252,
            base_amount: u256,
            active: bool
        ) {
            let mut subscription = self.subscriptions.read(subscription_id);
            assert(get_caller_address() == subscription.service_provider, 'Not authorized');
            
            subscription.name = name;
            subscription.description = description;
            subscription.base_amount = base_amount;
            subscription.active = active;
            
            self.subscriptions.write(subscription_id, subscription);
        }

        fn cancel_subscription(ref self: ContractState, subscription_id: u256) {
            let caller = get_caller_address();
            let mut subscription = self.subscriptions.read(subscription_id);
            assert(caller == subscription.service_provider, 'Not authorized');
            
            subscription.active = false;
            self.subscriptions.write(subscription_id, subscription);
        }

        fn process_payment(ref self: ContractState, subscription_id: u256) {
            let caller = get_caller_address();
            let subscription = self.subscriptions.read(subscription_id);
            assert(subscription.active, 'Subscription not active');
            
            let user_sub = self.user_subscriptions.read((caller, subscription_id));
            assert(user_sub.subscription_id != 0.into(), 'No subscription found');
            assert(get_block_timestamp() >= user_sub.next_payment_due, 'Payment not due');

            let token_dispatcher = IERC20Dispatcher { contract_address: subscription.token };
            token_dispatcher.transfer_from(
                caller, subscription.service_provider, user_sub.amount
            );

            // Update next payment due date
            let new_user_sub = UserSubscription {
                subscription_id: subscription_id,
                next_payment_due: get_block_timestamp() + self.get_interval(subscription.frequency),
                amount: user_sub.amount,
            };
            self.user_subscriptions.write((caller, subscription_id), new_user_sub);
        }

        fn get_next_payment_date(
            self: @ContractState,
            subscription_id: u256,
            user: ContractAddress
        ) -> u64 {
            let user_sub = self.user_subscriptions.read((user, subscription_id));
            assert(user_sub.subscription_id != 0.into(), 'No subscription found');
            user_sub.next_payment_due
        }
    }
}