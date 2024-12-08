// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";


contract SuperSplit is ReentrancyGuard {

    struct Subscription {
        uint256 id;
        string name;
        string description;
        address serviceProvider;
        uint256 baseAmount; 
        address token;
        uint256 startTime;
        Frequency frequency;
        bool active;
    }

    enum Frequency {
        Monthly,
        Quarterly,
        HalfYearly,
        Annually
    }

    struct Group {
        uint256 id;
        string name;
        address[] members;
        mapping(address => uint256) payments;
        uint256 totalPayments;
        mapping(address => Transaction[]) expenses; 
        bool active;
    }

    struct Transaction {
        address sender;
        address receiver;
        uint256 amount;
        address token;
        uint256 timestamp;
    }


    struct UserSubscription {
        uint256 subscriptionId;
        uint256 nextPaymentDue;
        uint256 amount;
    }
    
    uint256 private nextSubscriptionId = 1;
    uint256 private nextGroupId = 1;


    mapping(uint256 => Subscription) public subscriptions; 
    mapping(address => UserSubscription[]) public userSubscriptions; 
    mapping(uint256 => Group) public groups;
    mapping(address => Transaction[]) public transactionLogs;

    event SubscriptionCreated(
        uint256 indexed subscriptionId,
        string name,
        string description,
        address indexed serviceProvider,
        uint256 baseAmount,
        address token
    );
   event SubscriptionSelected(
        address indexed user,
        uint256 indexed subscriptionId,
        uint256 amount,
        uint256 nextPaymentDue
    );


    modifier subscriptionExists(uint256 subscriptionId) {
        require(subscriptions[subscriptionId].serviceProvider != address(0), "Subscription does not exist");
        _;
    }


    event DirectPayment(
        address indexed sender,
        address indexed receiver,
        address token,
        uint256 amount,
        uint256 timestamp
    );

    event SubscriptionUpdated(
        bytes32 indexed subscriptionId,
        uint256 newAmount,
        uint256 newInterval
    );

    event PaymentWithdrawn(uint256 indexed groupId, address indexed member, uint256 amount);
    event MemberRemoved(uint256 indexed groupId, address indexed member);
    event GroupCreated(uint256 indexed groupId, string name, address[] members);
    event ExpenseAdded(uint256 indexed groupId, address indexed member, uint256 amount);
    event PaymentReleased(uint256 indexed subscriptionId, uint256 amount, uint256 timestamp);
    event GroupDeactivated(uint256 indexed groupId);

    modifier onlyMember(uint256 groupId) {
        bool isMember = false;
        for (uint256 i = 0; i < groups[groupId].members.length; i++) {
            if (groups[groupId].members[i] == msg.sender) {
                isMember = true;
                break;
            }
        }
        require(isMember, "Not a group member");
        _;
    }

    modifier groupExists(uint256 groupId) {
        require(groups[groupId].active, "Group does not exist or is inactive");
        _;
    }

    function sendPayment(
        address receiver,
        uint256 amount,
        address token
    ) external nonReentrant {
        require(receiver != address(0), "Receiver address invalid");
        require(amount > 0, "Amount must be greater than zero");

        IERC20(token).transferFrom(msg.sender, receiver, amount);

        transactionLogs[msg.sender].push(
            Transaction({
                sender: msg.sender,
                receiver: receiver,
                amount: amount,
                token: token,
                timestamp: block.timestamp
            })
        );

        emit DirectPayment(msg.sender, receiver, token, amount, block.timestamp);
    }

    function getTransactionHistory(address user) external view returns (Transaction[] memory) {
        return transactionLogs[user];
    }

    function createSubscription(
        string calldata name,
        string calldata description,
        uint256 baseAmount, 
        address token
    ) external nonReentrant {
        subscriptions[nextSubscriptionId] = Subscription({
            id: nextSubscriptionId,
            name: name,
            description: description,
            serviceProvider: msg.sender,
            baseAmount: baseAmount,
            token: token,
            startTime: block.timestamp,
            frequency: Frequency.Monthly,
            active: true
        });

        emit SubscriptionCreated(nextSubscriptionId, name, description, msg.sender, baseAmount, token);

        nextSubscriptionId++;
    }



    function selectSubscription(
        uint256 subscriptionId,
        Frequency frequency
    ) external nonReentrant subscriptionExists(subscriptionId) {
        Subscription storage subscription = subscriptions[subscriptionId];
        require(subscription.active, "Subscription is inactive");

        uint256 amount = calculateCost(subscription.baseAmount, frequency);
        uint256 nextPaymentDue = block.timestamp + getInterval(frequency);

        IERC20(subscription.token).transferFrom(msg.sender, subscription.serviceProvider, amount);

        userSubscriptions[msg.sender].push(UserSubscription({
            subscriptionId: subscriptionId,
            nextPaymentDue: nextPaymentDue,
            amount: amount
        }));

        emit SubscriptionSelected(msg.sender, subscriptionId, amount, nextPaymentDue);
    }

    function calculateCost(uint256 baseAmount, Frequency frequency) public pure returns (uint256) {
        if (frequency == Frequency.Monthly) {
            return baseAmount;
        } else if (frequency == Frequency.Quarterly) {
            return baseAmount * 3;
        } else if (frequency == Frequency.HalfYearly) {
            return baseAmount * 6;
        } else if (frequency == Frequency.Annually) {
            return baseAmount * 12;
        }
        return 0;
    }

    function getInterval(Frequency frequency) public pure returns (uint256) {
        if (frequency == Frequency.Monthly) {
            return 30 days;
        } else if (frequency == Frequency.Quarterly) {
            return 90 days;
        } else if (frequency == Frequency.HalfYearly) {
            return 180 days;
        } else if (frequency == Frequency.Annually) {
            return 365 days;
        }
        return 0;
    }

    function getAllSubscriptions() external view returns (Subscription[] memory) {
        Subscription[] memory allSubscriptions = new Subscription[](nextSubscriptionId - 1);
        for (uint256 i = 1; i < nextSubscriptionId; i++) {
            allSubscriptions[i - 1] = subscriptions[i];
        }
        return allSubscriptions;
    }

    function getUserSubscriptions(address user) external view returns (UserSubscription[] memory) {
        return userSubscriptions[user];
    }

    function getSubscriptionDetails(uint256 subscriptionId)
        external
        view
        subscriptionExists(subscriptionId)
        returns (
            string memory name,
            string memory description,
            address serviceProvider,
            uint256 baseAmount,
            address token,
            bool active
        )
    {
        Subscription storage subscription = subscriptions[subscriptionId];
        return (
            subscription.name,
            subscription.description,
            subscription.serviceProvider,
            subscription.baseAmount,
            subscription.token,
            subscription.active
        );
    }


    function createGroup(string calldata name, address[] calldata members) external nonReentrant {
        require(members.length > 0, "Group must have at least one member");

        Group storage group = groups[nextGroupId];
        group.id = nextGroupId;
        group.name = name;
        group.members = members;
        group.active = true;

        emit GroupCreated(nextGroupId, name, members);
        nextGroupId++;
    }


    function addExpense(uint256 groupId, uint256 amount, address token) external nonReentrant groupExists(groupId) onlyMember(groupId) {
        Group storage group = groups[groupId];
        require(amount > 0, "Amount must be greater than zero");

        IERC20(token).transferFrom(msg.sender, address(this), amount);
        group.payments[msg.sender] += amount;
        group.totalPayments += amount;

        group.expenses[msg.sender].push(Transaction({
            sender: msg.sender,
            receiver: address(this),
            amount: amount,
            token: token,
            timestamp: block.timestamp
        }));

        emit ExpenseAdded(groupId, msg.sender, amount);
    }

    function getUserExpenses(uint256 groupId, address user) external view groupExists(groupId) returns (Transaction[] memory) {
        return groups[groupId].expenses[user];
    }

    function getAllGroups() external view returns (uint256[] memory, string[] memory, uint256[] memory, bool[] memory) {
        uint256 count = nextGroupId - 1;

        uint256[] memory ids = new uint256[](count);
        string[] memory names = new string[](count);
        uint256[] memory totalPayments = new uint256[](count);
        bool[] memory activeStatuses = new bool[](count);

        for (uint256 i = 1; i <= count; i++) {
            Group storage group = groups[i];
            ids[i - 1] = group.id;
            names[i - 1] = group.name;
            totalPayments[i - 1] = group.totalPayments;
            activeStatuses[i - 1] = group.active;
        }

        return (ids, names, totalPayments, activeStatuses);
    }

    function withdrawPayment(
        uint256 groupId,
        uint256 amount,
        address token
    ) external nonReentrant groupExists(groupId) onlyMember(groupId) {
        Group storage group = groups[groupId];
        require(group.payments[msg.sender] >= amount, "Insufficient payment balance");

        group.payments[msg.sender] -= amount;
        group.totalPayments -= amount;
        IERC20(token).transfer(msg.sender, amount);

        emit PaymentWithdrawn(groupId, msg.sender, amount);
    }

    function removeMember(uint256 groupId, address member) external nonReentrant groupExists(groupId) {
        Group storage group = groups[groupId];
        bool removed = false;

        for (uint256 i = 0; i < group.members.length; i++) {
            if (group.members[i] == member) {
                group.members[i] = group.members[group.members.length - 1];
                group.members.pop();
                removed = true;
                break;
            }
        }
        require(removed, "Member not found in the group");

        uint256 memberBalance = group.payments[member];
        group.totalPayments -= memberBalance;

        if (memberBalance > 0) {
            IERC20(group.members[0]).transfer(member, memberBalance); 
        }

        emit MemberRemoved(groupId, member);
    }

    function deactivateGroup(uint256 groupId) external nonReentrant groupExists(groupId) {
        groups[groupId].active = false;

        emit GroupDeactivated(groupId);
    }

    function releasePayment(uint256 subscriptionId, uint256 groupId) external nonReentrant {
        Subscription storage subscription = subscriptions[subscriptionId];
        require(subscription.active, "Subscription is not active");

        uint256 interval = getInterval(subscription.frequency);
        require(
            block.timestamp >= subscription.startTime &&
                (block.timestamp - subscription.startTime) % interval == 0,
            "Not time for payment"
        );

        Group storage group = groups[groupId];
        require(group.totalPayments >= subscription.baseAmount, "Insufficient funds in group");

        IERC20(subscription.token).transfer(subscription.serviceProvider, subscription.baseAmount);
        group.totalPayments -= subscription.baseAmount;

        emit PaymentReleased(subscriptionId, subscription.baseAmount, block.timestamp);
    }



    function checkSubscriptionDue(uint256 subscriptionId) external view subscriptionExists(subscriptionId) returns (bool) {
        Subscription storage subscription = subscriptions[subscriptionId];
        uint256 interval = getInterval(subscription.frequency);
        return (block.timestamp >= subscription.startTime &&
            (block.timestamp - subscription.startTime) % interval == 0);
    }


    function getGroupMembers(uint256 groupId) external view groupExists(groupId) returns (address[] memory) {
        return groups[groupId].members;
    }

    function getGroupPayments(uint256 groupId, address member) external view groupExists(groupId) returns (uint256) {
        return groups[groupId].payments[member];
    }

  





    function getGroupDetails(uint256 groupId)
        external
        view
        groupExists(groupId)
        returns (uint256 id, string memory name, address[] memory members, uint256 totalPayments, bool active)
    {
        Group storage group = groups[groupId];
        return (group.id, group.name, group.members, group.totalPayments, group.active);
    }


    function payGroupExpense(
    uint256 groupId,
    uint256 amount,
    address token
) external nonReentrant groupExists(groupId) onlyMember(groupId) {
    require(amount > 0, "Amount must be greater than zero");
    
    Group storage group = groups[groupId];
    
    // Transfer tokens from user to contract
    IERC20(token).transferFrom(msg.sender, address(this), amount);
    
    // Update payment tracking
    group.payments[msg.sender] -= amount;
    group.totalPayments -= amount;
    
    // Record the transaction
    group.expenses[msg.sender].push(Transaction({
        sender: msg.sender,
        receiver: address(this),
        amount: amount,
        token: token,
        timestamp: block.timestamp
    }));
    
    // Emit payment event
    emit DirectPayment(msg.sender, address(this), token, amount, block.timestamp);
}

}