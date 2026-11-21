import { useEffect } from 'react'
import { TonConnectButton, useTonConnectUI, useTonWallet, THEME } from '@tonconnect/ui-react'

export default function WalletConnect() {
  const wallet = useTonWallet()
  const [tonConnectUI] = useTonConnectUI()

  useEffect(() => {
    tonConnectUI.uiOptions = { language: 'ru', uiPreferences: { theme: THEME.DARK } }
  }, [tonConnectUI])

  const isTestnet = wallet?.account.chain === '-3'

  return <div className="wallet-connect">
    <TonConnectButton />
    {wallet && <span className={isTestnet ? 'wallet-network testnet' : 'wallet-network warning'}>
      {isTestnet ? 'TON TESTNET' : 'Подключён не Testnet'}
    </span>}
  </div>
}
