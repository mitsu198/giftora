import { useEffect } from 'react'
import { TonConnectButton, useTonConnectUI, useTonWallet, THEME } from '@tonconnect/ui-react'

const TON_TESTNET_CHAIN_ID = '-3'

export default function WalletConnect() {
  const wallet = useTonWallet()
  const [tonConnectUI] = useTonConnectUI()

  useEffect(() => {
    tonConnectUI.uiOptions = { language: 'ru', uiPreferences: { theme: THEME.DARK } }
    // TON Connect requires the target network to be selected before opening
    // the wallet picker. Existing restored sessions are left untouched.
    if (!wallet) {
      try {
        tonConnectUI.setConnectionNetwork(TON_TESTNET_CHAIN_ID)
      } catch {
        // A restored connection can race this effect; the connected chain
        // is still checked below and no transaction is enabled in this build.
      }
    }
  }, [tonConnectUI, wallet])

  const isTestnet = wallet?.account.chain === TON_TESTNET_CHAIN_ID

  return <div className="wallet-connect">
    <TonConnectButton />
    {wallet && <span className={isTestnet ? 'wallet-network testnet' : 'wallet-network warning'}>
      {isTestnet ? 'TON TESTNET' : 'Подключён не Testnet'}
    </span>}
  </div>
}
