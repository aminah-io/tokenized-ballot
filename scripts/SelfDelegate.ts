import { ethers } from "hardhat";
import { MyToken__factory, MyToken } from "../typechain-types";
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
  const myTokenFactory = new MyToken__factory(wallet);

  const myTokenContract = myTokenFactory.attach("0x83555B198FB77d64B296d5963203B4a160C241bc") as MyToken;

  const contractAddress = await myTokenContract.getAddress();
  console.log(`Token contract deployed at address ${contractAddress}`);

  // Self delegate
  const delegateTx = await myTokenContract.connect(wallet).delegate(wallet.address);
  await delegateTx.wait()

  // Check the voting power
  const votes = await myTokenContract.getVotes(wallet.address);
  console.log(
    `Account ${wallet.address} has ${votes.toString()} units of voitng power.`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});