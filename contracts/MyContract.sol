pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MyContract is ERC721, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter public _tokenIds;
    mapping(string => uint8) public hashes;
    bool public isPaused;
    string public baseUri;

    constructor() ERC721("MyContract", "MYC") {
        isPaused = true;
    }

    function mintNFT(address recipient) public returns (uint256) {
        require(!isPaused, "mint is paused");

        uint256 newItemId = _tokenIds.current();
        _tokenIds.increment();
        _mint(recipient, newItemId);

        return newItemId;
    }

    function setPause(bool state) public onlyOwner {
        isPaused = state;
    }

    function setBaseURI(string memory base) public onlyOwner {
        baseUri = base;
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return baseUri;
    }
}
