import { JsonRpcSigner, Web3Provider } from '@ethersproject/providers';
import { AddressZero } from '@ethersproject/constants';
import { Contract } from '@ethersproject/contracts';
import { getAddress } from '@ethersproject/address';
import { ethers } from 'ethers';
import { formatUnits } from 'ethers/lib/utils';
import BigNumber from 'bignumber.js';

import { checkEnoughBalance, convertEToNumber } from 'utils/contract';

import Erc20ABI from 'constants/abi/erc20abi.json';
import Erc721ABI from 'constants/abi/erc721abi.json';
import Erc1155ABI from 'constants/abi/erc1155abi.json';
import ExchangeABI from 'constants/abi/exchange.json';
import { WALLET_STATUS } from 'constants/common';
import { NFT_STANDARD, NFT_TRANSACTION_STATUS } from 'constants/nft';
import { CONTRACT_ERC20_ADDRESS, MAX_ALLOWANCE, PROXY_ADDRESS } from 'connectors/constants';

const { SUCCESS, FAILED } = NFT_TRANSACTION_STATUS;

export function isAddress(address: string) {
  try {
    return getAddress(address);
  } catch {
    return false;
  }
}

export function getSigner(library: Web3Provider, account: string): JsonRpcSigner {
  return library?.getSigner(account).connectUnchecked();
}

// account is optional
function getProviderOrSigner(library: Web3Provider, account?: string): Web3Provider | JsonRpcSigner {
  return account ? getSigner(library, account) : library;
}

export function getContract(address: string, ABI: any, library: Web3Provider, account?: string): Contract {
  if (!isAddress(address) || isNativeToken(address)) {
    throw Error(`Invalid 'address' parameter '${address}'.`);
  }

  return new Contract(address, ABI, getProviderOrSigner(library, account) as any);
}

export function isNativeToken(address: string) {
  return address === AddressZero;
}

export default class BaseWalletService {
  address: string | null;
  needTobeInitiated: any;
  initUnit256: any;

  constructor(props: any) {
    this.address = props?.address;
  }

  checkBuyerBalance = async ({
    library,
    address,
    tokenAddress,
    price,
    quantity,
  }: {
    library: any;
    address: string;
    tokenAddress: string;
    price: any;
    quantity: number;
  }) => {
    const balances = await this.getBalance({ library, address, tokenAddress });
    const balance = balances.balance;
    return checkEnoughBalance(price, quantity, balance);
  };

  getBalance = async ({
    library,
    tokenAddress,
    address,
    currencyDecimal,
  }: {
    library: any;
    tokenAddress: string;
    address: string;
    currencyDecimal?: number;
  }) => {
    try {
      if (address) {
        let tokenInst, balance, balanceFlat, decimals;
        if (isNativeToken(tokenAddress)) {
          balance = await library?.getBalance(address);
          balanceFlat = formatUnits(balance, 'wei');
          decimals = currencyDecimal;
        } else {
          tokenInst = getContract(CONTRACT_ERC20_ADDRESS, Erc20ABI.output.abi, library, address);
          balance = await tokenInst.balanceOf(address);
          balanceFlat = formatUnits(balance, 'wei');
          decimals = await tokenInst.decimals();
        }

        return {
          balance: convertEToNumber(balanceFlat, decimals),
        };
      }

      return {
        balance: 0,
      };
    } catch (e) {
      return {
        balance: 0,
      };
    }
  };

  isAdmin = async (library: any, account: string) => {
    try {
      const contract = getContract(PROXY_ADDRESS, ExchangeABI.output.abi, library, account);
      const response = await contract.isAdmin(account);
      return response;
    } catch (error) {
      return false;
    }
  };

  verifyLoginSignature = async ({
    library,
    creator,
    cancelMetamask,
  }: {
    library: any;
    creator: string;
    cancelMetamask: () => void;
  }) => {
    let signVerify: any = null;
    let hashVerify = null;

    try {
      hashVerify = ethers.utils.solidityKeccak256(['address'], [creator]);

      const signHashBytes = ethers.utils.arrayify(hashVerify);

      if (library?.provider?.wc) {
        const wcMessage = ethers.utils.hexlify(signHashBytes);
        signVerify = await library.provider.wc.signPersonalMessage([wcMessage, creator]);
      } else {
        const signer = await library.getSigner(creator);
        signVerify = await signer.signMessage(signHashBytes);
      }
      return signVerify;
    } catch (error: any) {
      if (WALLET_STATUS.CANCEL_METAMASK === error?.code) {
        cancelMetamask && cancelMetamask();
      } else {
      }
    }
  };

  getAllowanceERC20 = async ({ account, library }: { account?: string; library?: any }) => {
    try {
      const contract = getContract(CONTRACT_ERC20_ADDRESS, Erc20ABI.output.abi, library, account);

      const response = await contract.allowance(account, PROXY_ADDRESS);
      return new BigNumber(response.toString());
    } catch (e) {
      return 0;
    }
  };

  setAllowanceERC20 = async ({
    account,
    library,
    onSuccess,
    onError,
    onCancelMetamask,
  }: {
    account?: string;
    library?: any;
    onCancelMetamask?: () => void;
    onSuccess?: () => void;
    onError?: () => void;
  }) => {
    try {
      const contract = getContract(CONTRACT_ERC20_ADDRESS, Erc20ABI.output.abi, library, account);
      const response = await contract.increaseAllowance(PROXY_ADDRESS, MAX_ALLOWANCE);

      if (response?.hash) {
        const receipt = await response.wait();
        if (receipt?.status) {
          onSuccess && onSuccess();
        } else {
          return;
        }
      }
    } catch (error: any) {
      if (WALLET_STATUS.CANCEL_METAMASK === error?.code) {
        onCancelMetamask && onCancelMetamask();
      } else {
        onError && onError();
      }
    }
  };

  buyNFT = async ({
    account,
    library,
    data,
    onCancelMetamask,
    onCallback,
    onServerError,
    onContractError,
    isSecondary,
    onUpdateTransactionHash,
  }: {
    account?: string;
    library?: any;
    data?: Array<any> | any;
    onCancelMetamask?: () => void;
    onCallback?: (data?: any) => void;
    onServerError?: () => void;
    onContractError?: (data: any) => void;
    isSecondary?: boolean;
    onUpdateTransactionHash?: (hash: string) => void;
  }) => {
    const contract = getContract(PROXY_ADDRESS, ExchangeABI.output.abi, library, account);

    try {
      let response;
      if (!isSecondary) {
        response = await contract.handleMintRequest(...data);
      } else {
        response = await contract.handleBuyRequest(...data);
      }

      if (response?.hash) {
        if (isSecondary) {
          onUpdateTransactionHash && onUpdateTransactionHash(response?.hash);
        }
        const receipt = await response.wait();
        if (receipt?.status) {
          onCallback && onCallback({ hash: receipt?.transactionHash, status: SUCCESS });
        } else {
          onContractError && onContractError({ hash: receipt?.transactionHash, status: FAILED });
        }
      }
    } catch (error: any) {
      if (WALLET_STATUS.CANCEL_METAMASK === error?.code) {
        onCancelMetamask && onCancelMetamask();
      } else {
        onServerError && onServerError();
      }
    }
  };

  cancelSellOrder = async ({
    account,
    library,
    data,
    onCallback,
    onCancelMetamask,
    onServerError,
    onContractError,
  }: {
    account?: string;
    library?: any;
    data?: Array<any> | any;
    onCancelMetamask?: () => void;
    onCallback?: (hash?: any) => void;
    onServerError?: () => void;
    onContractError?: (data: any) => void;
  }) => {
    const contract = getContract(PROXY_ADDRESS, ExchangeABI.output.abi, library, account);

    try {
      const response = await contract.handleCancelOrder(...data);

      if (response?.hash) {
        const receipt = await response.wait();

        if (receipt?.status) {
          onCallback && onCallback({ hash: receipt?.transactionHash, status: SUCCESS });
        } else {
          onContractError && onContractError({ hash: receipt?.transactionHash, status: FAILED });
        }
      }
    } catch (error: any) {
      if (WALLET_STATUS.CANCEL_METAMASK === error?.code) {
        onCancelMetamask && onCancelMetamask();
      } else {
        onServerError && onServerError();
      }
    }
  };

  checkListForSaleNftApproved = async ({ account, library, contractAddress, standard }: any) => {
    try {
      const contract = getContract(
        contractAddress,
        standard === NFT_STANDARD[0].value ? Erc721ABI.output.abi : Erc1155ABI.output.abi,
        library,
        account,
      );
      const response = await contract.isApprovedForAll(account, PROXY_ADDRESS);
      return response;
    } catch (e) {
      console.error(e);
    }
  };

  setListForSaleNftApproved = async ({
    account,
    library,
    contractAddress,
    approved,
    standard,
    onSuccess,
    onCancelMetamask,
    onError,
  }: {
    account?: string;
    library?: any;
    onCancelMetamask?: () => void;
    onSuccess?: () => void;
    onError?: () => void;
    contractAddress: string;
    approved?: boolean;
    standard?: string | number;
  }) => {
    try {
      const contract = getContract(
        contractAddress,
        standard === NFT_STANDARD[0].value ? Erc721ABI.output.abi : Erc1155ABI.output.abi,
        library,
        account,
      );
      const response = await contract.setApprovalForAll(PROXY_ADDRESS, approved);
      if (response?.hash) {
        const receipt = await response.wait();
        if (receipt?.status) {
          onSuccess && onSuccess();
        } else {
          return;
        }
      }
    } catch (error: any) {
      if (WALLET_STATUS.CANCEL_METAMASK === error?.code) {
        onCancelMetamask && onCancelMetamask();
      } else {
        onError && onError();
      }
    }
  };
}
