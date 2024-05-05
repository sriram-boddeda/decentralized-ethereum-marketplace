import { ethers } from "ethers";

export const getSigner = (index = 0) => {
	const provider = new ethers.providers.Web3Provider((window as any).ethereum);
	const signer = provider.getSigner(index);
	return signer;
};

export const getContract = (
	address: string,
	abi: ethers.ContractInterface,
	signerIndex: number | undefined
) => {
	const signer = getSigner(signerIndex);
	const contract = new ethers.Contract(address, abi, signer);
	return contract;
};
