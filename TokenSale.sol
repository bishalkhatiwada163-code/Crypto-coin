// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IERC20 {
    function transfer(address to, uint256 value) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

contract TokenSale {
    IERC20 public token;
    address public owner;
    uint256 public tokenPrice; // Price in wei per token (with 18 decimals)
    uint256 public tokensSold;
    bool public saleActive;
    
    event TokensPurchased(address indexed buyer, uint256 amount, uint256 cost);
    event SaleStatusChanged(bool active);
    event PriceUpdated(uint256 newPrice);
    
    constructor(address _tokenAddress, uint256 _tokenPrice) {
        token = IERC20(_tokenAddress);
        owner = msg.sender;
        tokenPrice = _tokenPrice;
        saleActive = true;
    }
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this");
        _;
    }
    
    // Buy tokens by sending ETH
    function buyTokens(uint256 _numberOfTokens) public payable {
        require(saleActive, "Sale is not active");
        require(_numberOfTokens > 0, "Must buy at least 1 token");
        
        // Calculate cost in wei (tokens have 18 decimals)
        uint256 cost = (_numberOfTokens * tokenPrice) / 1e18;
        require(msg.value >= cost, "Insufficient ETH sent");
        
        // Calculate token amount with 18 decimals
        uint256 tokenAmount = _numberOfTokens * 1e18;
        
        // Check contract has enough tokens
        require(token.balanceOf(address(this)) >= tokenAmount, "Not enough tokens in contract");
        
        // Transfer tokens to buyer
        require(token.transfer(msg.sender, tokenAmount), "Token transfer failed");
        
        tokensSold += _numberOfTokens;
        
        // Refund excess ETH
        if (msg.value > cost) {
            payable(msg.sender).transfer(msg.value - cost);
        }
        
        emit TokensPurchased(msg.sender, _numberOfTokens, cost);
    }
    
    // Update token price
    function setPrice(uint256 _newPrice) public onlyOwner {
        tokenPrice = _newPrice;
        emit PriceUpdated(_newPrice);
    }
    
    // Toggle sale status
    function setSaleStatus(bool _active) public onlyOwner {
        saleActive = _active;
        emit SaleStatusChanged(_active);
    }
    
    // Withdraw ETH from contract
    function withdrawETH() public onlyOwner {
        payable(owner).transfer(address(this).balance);
    }
    
    // Withdraw remaining tokens
    function withdrawTokens() public onlyOwner {
        uint256 balance = token.balanceOf(address(this));
        require(token.transfer(owner, balance), "Token transfer failed");
    }
    
    // Get contract ETH balance
    function getContractBalance() public view returns (uint256) {
        return address(this).balance;
    }
    
    // Get remaining tokens for sale
    function getRemainingTokens() public view returns (uint256) {
        return token.balanceOf(address(this));
    }
    
    // Calculate cost for a number of tokens
    function calculateCost(uint256 _numberOfTokens) public view returns (uint256) {
        return (_numberOfTokens * tokenPrice) / 1e18;
    }
    
    // Receive ETH directly (will be used for buyTokens with default amount)
    receive() external payable {
        // Calculate how many tokens can be bought with sent ETH
        uint256 tokensAmount = (msg.value * 1e18) / tokenPrice;
        require(tokensAmount > 0, "Not enough ETH to buy tokens");
        buyTokens(tokensAmount);
    }
}
