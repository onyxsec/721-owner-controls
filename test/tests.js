const MyContract = artifacts.require("MyContract")
const {expectRevert} = require('@openzeppelin/test-helpers');
const { it } = require('node:test');

contract('Exploitable', (accounts) => {
  it('should return zero balance on deploy', async () => {
    const instance = await MyContract.deployed()
    const balance = await instance.balanceOf.call(accounts[0])

    assert.equal(balance.valueOf(), 0, "should not have any tokens")
  })
  it('should set initial owner')
  it('should set a new owner')
  it('should have owner pause mint')
  it('should not have non-owner pause mint')
  it('should mint 1 token', async () => {
    const instance = await Exploitable.deployed()
    await instance.mint(accounts[0], 0)
    const balance = await instance.balanceOf.call(accounts[0])

    assert.equal(balance.valueOf(), 1, "should have minted 1 token")
  })

  it('should have ability to transfer before setOwner called', async () => {
    const instance = await Exploitable.deployed()

    // Caller has 1 token
    let balance
    balance = await instance.balanceOf.call(accounts[0])
    assert.equal(balance.valueOf(), 1, "should have minted 1 token")

    // Caller transfers 1 token
    await instance.transferFrom(accounts[0], accounts[1], 0)
    
    // Caller has 0 tokens
    balance = await instance.balanceOf.call(accounts[0])
    assert.equal(balance.valueOf(), 0, "should have minted 0 token")
  })

  it('should set owner only once', async () => {
    const instance = await Exploitable.deployed()
    await instance.setOwner(accounts[0])

    const newOwner = await instance.getOwner.call()
    assert.equal(newOwner, accounts[0], "owner should be account[0]")
    await expectRevert(instance.setOwner(accounts[0]), 'owner already set')
  })

  it('should be prevented from transfering tokens', async () => {
    const instance = await Exploitable.deployed()

    // Caller has 1 token
    let balance
    await instance.mint(accounts[0], 1)
    balance = await instance.balanceOf.call(accounts[0])
    assert.equal(balance.valueOf(), 1, "should have minted 1 token")

    // Reverted tx after owner set
    await expectRevert(instance.transferFrom(accounts[0], accounts[1], 1), 'ownership not revoked')
  })
})
