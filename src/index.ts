
import { readFile } from "fs/promises";
import { program } from "commander";
import { ContractTransactionReceipt, ContractTransactionResponse, ethers, JsonRpcProvider, Network, Wallet } from "ethers";
import overlays from "./owner_overlay.json";

const OVERLAYS: StringMap = overlays as StringMap;
const OLD_STAKING_CONTRACT = "0x781c6D1f0eaE6F1Da1F604c6cDCcdB8B76428ba7";

const abi = [
    {
        inputs: [
            {
                internalType: "bytes32",
                name: "overlay",
                type: "bytes32",
            },
        ],
        name: "stakeOfOverlay",
        outputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "bytes32",
                name: "overlay",
                type: "bytes32",
            },
            {
                internalType: "uint256",
                name: "amount",
                type: "uint256",
            },
        ],
        name: "withdrawFromStake",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
];

const typedAbi: ABI = abi as ABI;

export async function unlockV3(keyFilePath: string, password: string) {
    const json = await readFile(keyFilePath, "utf8");
    return Wallet.fromEncryptedJson(json, password);
}

async function main() {
    program
        .name("bzz-unstake-cli")
        .description("CLI to unstake xBZZ")
        .version("0.0.1");

    program
        .command("unstake")
        .description("Unstake xBZZ")
        .argument("<swarm-key-file>", "path to swarm.key file")
        .argument("<password>", "password")
        .argument('<gnosis-rpc>', 'Gnosis RPC URL')
        .option('-uc, --unstake-contract <contract-address>', 'Paused staking contract address to unstake from', OLD_STAKING_CONTRACT)
        .action(async (keyFilePath, password, gnosisRPC, options) => {
           
            const contractAddress = options.unstakeContract;
            if (keyFilePath && password && gnosisRPC && contractAddress) {
                const { privateKey, address } = await unlockV3(keyFilePath, password);
                const provider = new JsonRpcProvider(gnosisRPC, Network.from(100), { staticNetwork: true });
                const wallet = new ethers.Wallet(privateKey, provider);

                try {
                    await provider.getBlockNumber();
                } catch (error) {
                    console.error("Error: Unable to connect to Ethereum node.");
                    process.exit(1);
                }
                let ethAddressChecksum: string;
                let contractAddressChecksum: string;
                try {
                    ethAddressChecksum = ethers.getAddress(address);
                    contractAddressChecksum = ethers.getAddress(contractAddress);
                } catch (error: any) {
                    console.error(`Invalid Ethereum address provided: ${error.message}`);
                    process.exit(1);
                }
                const contract = new ethers.Contract(contractAddress, typedAbi, wallet);

                const overlay = OVERLAYS[address.toLowerCase()];
                const amount = await contract.stakeOfOverlay(overlay);
                console.log(`Staked amount available for withdrawal: ${amount}`);
                if (amount > 0) {
                    try {
                        const tx: ContractTransactionResponse = await contract.withdrawFromStake(overlay, amount);
                        console.log("Withdraw stake transaction sent:", tx.hash);
                        const receipt: ContractTransactionReceipt | null = await tx.wait();
                        console.log("Withdraw stake transaction completed!");
                    } catch (error) {
                        console.error("Error sending transaction:", error);
                    }
                }
            }
        });

    program.parse();
}

main();
