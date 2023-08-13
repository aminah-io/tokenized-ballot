import { ethers } from "hardhat";
import { MyToken } from "../typechain-types";
import { expect } from "chai";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { defaultMaxListeners } from "events";

describe("MyToken", () => {
  
  let myTokenContract: MyToken;
  let deployer: any, acct1: any, acct2: any;
  async function deployContract () {
    // Get contract from the contract factory
    const myTokenFactory = await ethers.getContractFactory(
      "MyToken"
    );
    // Deploy the contract
    myTokenContract = await myTokenFactory.connect(deployer).deploy();
    await myTokenContract.waitForDeployment();
    const myTokenContractAddress = myTokenContract.getAddress();

    return myTokenContract;
  }

  describe("when the contract is deployed", async () => {
    beforeEach(async function () {
      const [deployerAccount, acct1Account, acct2Account] = await ethers.getSigners();
      deployer = deployerAccount;
      acct1 = acct1Account;
      acct2 = acct2Account;
      myTokenContract = await loadFixture(deployContract);
    });

    it("gives the deployer address the default admin role", async () => {
      const DEFAULT_ADMIN_ROLE = await myTokenContract.DEFAULT_ADMIN_ROLE();
      const deployerDefaultAdminRole = await myTokenContract.hasRole(DEFAULT_ADMIN_ROLE, deployer.address)
      expect(deployerDefaultAdminRole).to.eq(true);
    });

    it("allows the default admin role to grant the minter role to another address", async () => {
      const MINTER_ROLE = await myTokenContract.MINTER_ROLE();
      
      const giveMinterRoleTx = await myTokenContract.grantRole(MINTER_ROLE, acct1.address);
      await giveMinterRoleTx.wait();
      const hasMinterRole = await myTokenContract.hasRole(MINTER_ROLE, acct1.address);
      expect(hasMinterRole).to.eq(true);
    });

    it("allows token minting", async () => {
      const MINT_VALUE = ethers.parseUnits("1");
      const mintTx = await myTokenContract.mint(acct1.address, MINT_VALUE);
      await mintTx.wait();
      const balanceBN = await myTokenContract.balanceOf(acct1.address);
      expect(balanceBN).to.eq(MINT_VALUE);
    });

    it("", async () => {

    });
  });
});