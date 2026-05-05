/**
 * Minimal interface to interact with the MiniPay injected wallet
 * on the Opera Mini browser for Celo transactions.
 */

// Global type for Ethereum provider (MiniPay injects window.ethereum)
declare global {
  interface Window {
    ethereum?: any;
  }
}

export class MiniPayService {
  /**
   * Check if MiniPay (or any compatible ethereum provider) is installed.
   */
  static isInstalled(): boolean {
    return typeof window !== "undefined" && typeof window.ethereum !== "undefined";
  }

  /**
   * Connect to the wallet and request accounts.
   * @returns an array of connected addresses.
   */
  static async connectWallet(): Promise<string[]> {
    if (!this.isInstalled()) {
      throw new Error("MiniPay / Ethereum Provider is not installed.");
    }
    
    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      return accounts as string[];
    } catch (error) {
      console.error("User denied account access or error occurred", error);
      throw error;
    }
  }

  /**
   * Example wrapper to send a transaction directly,
   * though typically you use viem/ethers.
   */
  static async sendTransaction(to: string, value: string): Promise<string> {
    if (!this.isInstalled()) {
      throw new Error("No provider installed.");
    }

    const accounts = await window.ethereum.request({ method: "eth_accounts" });
    if (!accounts || accounts.length === 0) {
      throw new Error("Wallet not connected.");
    }

    const txHash = await window.ethereum.request({
      method: "eth_sendTransaction",
      params: [
        {
          from: accounts[0],
          to,
          value, // hex encoded wei
        },
      ],
    });
    return txHash as string;
  }
}
