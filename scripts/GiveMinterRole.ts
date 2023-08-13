import { ethers } from "hardhat";
import { MyToken, MyToken__factory } from "../typechain-types";
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

  // Grant minter role
  const minterAddress = args[0];
  const MINTER_ROLE = await myTokenContract.MINTER_ROLE();
  console.log(`Giving minter role to address ${minterAddress}`);
  await myTokenContract.grantRole(MINTER_ROLE, minterAddress);

  console.log(`${minterAddress} now has the minter role!`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
