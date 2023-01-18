import { Wallet, Provider, utils, Contract } from "zksync-web3";
import * as ethers from "ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { Deployer } from "@matterlabs/hardhat-zksync-deploy";

// load env file
import dotenv from "dotenv";
dotenv.config();

const PRIVATE_KEY = process.env.WALLET_PRIVATE_KEY || "";

if (!PRIVATE_KEY)
  throw "⛔️ Private key not detected! Add it to the .env file!";

// load contract artifact. Make sure to compile first!
import * as ContractArtifact from "../artifacts-zk/contracts/zkToken.sol/zkToken.json";

// Address of the contract on zksync testnet
const TOKEN_ADDRESS = "";

// 0x address of the destination wallet
const DESTINATION_WALLET = "";

if (!TOKEN_ADDRESS) throw "⛔️ ERC20 token address not provided";

// An example of a deploy script that will deploy and call a simple contract.
export default async function (hre: HardhatRuntimeEnvironment) {
  console.log(`Running script to transfer token ${TOKEN_ADDRESS}`);

  // Initialize the signer.
  // @ts-ignore
  const provider = new Provider(hre.userConfig.networks?.zkSyncTestnet?.url);
  const signer = new Wallet(PRIVATE_KEY, provider);

  const tokenContract = new Contract(
    TOKEN_ADDRESS,
    ContractArtifact.abi,
    signer
  );

  const AMOUNT = "12";

  // transfer tokens
  const transferHandle = await tokenContract.transfer(
    DESTINATION_WALLET,
    ethers.utils.parseEther(AMOUNT)
  );

  // Wait until the transaction is processed on zkSync
  await transferHandle.wait();

  console.log(`Transfer completed in trx ${transferHandle.hash}`);
}
