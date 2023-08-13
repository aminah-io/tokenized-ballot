import { ethers } from "hardhat";
import { MyToken__factory } from "../typechain-types";
import * as dotenv from "dotenv";
dotenv.config();

async function main() {
  const args = process.argv.slice(2);

  // Instantiate a new provider using the RPC endpoint url
  const provider = new ethers.JsonRpcProvider(process.env.RPC_ENDPOINT_URL ?? "");
  // Instantiate a new wallet using either the private key or the provider
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? "", provider);

  console.log(`Using address ${wallet.address}`);

  // Instantiate a new contract factory using the wallet
  const contractFactory = new MyToken__factory(wallet);

  // Deploy the contract
  const contract = await contractFactory.deploy();

  // Wait for the deployment
  await contract.waitForDeployment();
  const contractAddress = await contract.getAddress();

  console.log(`Token contract deployed at address ${contractAddress}`);


  // // Check the voting power
  // const votes = await contract.getVotes(acct1.address);
  // console.log(
  //   `Account ${acct1.address} has ${votes.toString()} units of voitng power.`
  // );

  // // Transfer tokens
  // const transferTx = await contract
  //   .connect(acct1)
  //   .transfer(acct2.address, MINT_VALUE / 2n);
  // await transferTx.wait();

  // // Check the voting power
  // const votes1AfterTransfer = await contract.getVotes(acct1.address);
  // console.log(
  //   `Account ${
  //     acct1.address
  //   } has ${votes1AfterTransfer.toString()} units of voting power after transferring\n`
  // );
  // const votes2AfterTransfer = await contract.getVotes(acct2.address);
  // console.log(
  //   `Account ${
  //     acct2.address
  //   } has ${votes2AfterTransfer.toString()} units of voting power after receiving a transfer\n`
  // );
  // // Check past voting power
  // const lastBlock = await ethers.provider.getBlock("latest");
  // const lastBlockNumber = lastBlock?.number ?? 0;

  // for (let index = lastBlockNumber - 1; index > 0; index--) {
  //   const pastVotes = await contract.getPastVotes(
  //     acct1.address,
  //     index
  //   );
  //   console.log(
  //     `Account ${
  //       acct1.address
  //     } had ${pastVotes.toString()} units of voting power at block ${index}\n`
  //   );
  // }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

// Deploy the token contract and mint the...then do the rest of the homework