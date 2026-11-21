import { useEffect } from 'react'
import { TonConnectButton, useTonConnectUI, useTonWallet, THEME } from '@tonconnect/ui-react'

const TON_MAINNET_CHAIN_ID = '-239'
const TON_TESTNET_CHAIN_ID = '-3'
// Production builds use Mainnet for Telegram Wallet compatibility;
// local development remains on Testnet. No transactions are enabled.

export default function WalletConnect() {
  const wallet = useTonWallet()
  const [tonConnectUI] = useTonConnectUI()

  useEffect(() => {
    tonConnectUI.uiOptions = { language: 'ru', uiPreferences: { theme: THEME.DARK } }
    // TON Connect requires the target network to be selected before opening
    // the wallet picker. Production uses Mainnet; local dev uses Testnet.
    // Existing restored sessions are left untouched.
    if (!wallet) {
      try {
        tonConnectUI.setConnectionNetwork(import.meta.env.DEV ? TON_TESTNET_CHAIN_ID : TON_MAINNET_CHAIN_ID)
      } catch {
        // A restored connection can race this effect; the connected chain
        // is still checked below and no transaction is enabled in this build.
      }
    }
  }, [tonConnectUI, wallet])

  const isTestnet = wallet?.account.chain === TON_TESTNET_CHAIN_ID
  const isMainnet = wallet?.account.chain === TON_MAINNET_CHAIN_ID

  return <div className="wallet-connect">
    <TonConnectButton />
    {wallet && <span className={isTestnet ? 'wallet-network testnet' : 'wallet-network warning'}>
      {isTestnet ? 'TON TESTNET' : isMainnet ? 'TON MAINNET' : 'Неизвестная сеть'}
    </span>}
  </div>
}
