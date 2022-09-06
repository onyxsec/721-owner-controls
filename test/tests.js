const MyContract = artifacts.require("MyContract")
const {expectRevert} = require('@openzeppelin/test-helpers');

contract('MyContract', (accounts) => {
  it('should return zero balance on deploy', async () => {
    const instance = await MyContract.deployed()
    const balance = await instance.balanceOf.call(accounts[0])

    assert.equal(balance.valueOf(), 0, "should not have any tokens")
  })
  it('should not set owner if not owner', async () => {
    const instance = await MyContract.deployed()
    await expectRevert(instance.transferOwnership(accounts[0], {from: accounts[1]}), 'caller is not the owner')

    const owner = await instance.owner.call()
   assert.equal(owner, accounts[0], 'onwer is not correct address')
  })
  it('should set a new owner', async () => {
    const instance = await MyContract.deployed()
    await instance.transferOwnership(accounts[1], {from: accounts[0]})

    const owner = await instance.owner.call()
   assert.equal(owner, accounts[1], 'onwer is not correct address')
  })
  it('should not mint if paused', async () => {
    const instance = await MyContract.deployed()

    // Pause and attempt to mint
    await instance.setPause(true, {from: accounts[1]})
    await expectRevert(instance.mintNFT(accounts[0]), 'mint is paused')
    assert.equal(await instance.balanceOf.call(accounts[0]), 0)
  })
  it('should mint if conditions correct', async () => {
    const instance = await MyContract.deployed()

    // Unpause and attempt to mint
    await instance.setPause(false, {from: accounts[1]})
    await instance.mintNFT(accounts[0])
    assert.equal(await instance.balanceOf.call(accounts[0]), 1)
  })
  it('should get correct token URI', async () => {
    const instance = await MyContract.deployed()
    const tokenId = 0
    const base = 'baseUri/'

    await instance.setBaseURI(base, {from: accounts[1]})
    const tokenUri = await instance.tokenURI(tokenId)
    assert.equal(tokenUri, base + tokenId)
  })
})
