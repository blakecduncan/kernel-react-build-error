import React from 'react';
import { privateKeyToAccount } from 'viem/accounts';
import { createEcdsaKernelAccountClient } from '@kerneljs/presets/zerodev';
import { polygonMumbai } from 'viem/chains';
import { bundlerActions } from "permissionless";

import logo from './logo.svg';
import './App.css';

const ZERODEV_PROJECT_ID = 'c5416975-9cc6-41e3-a43c-cd49f6610b8e';

function App() {
  const sentTx = async () => {
    const PRIVATE_KEY = '0xe4021cf00f5bae0ace28ffa3613tc212f4781975679846a0d4e737286f12e8ed';
    const signer = privateKeyToAccount(PRIVATE_KEY);

    // Set up your Kernel client
    const kernelClient = await createEcdsaKernelAccountClient({
      chain: polygonMumbai,
      projectId: ZERODEV_PROJECT_ID,
      signer,
    });
    console.log('kernel address: ', kernelClient.account.address);
    console.log('sending empty user op')

    const userOpHash = await kernelClient.sendUserOperation({
      userOperation: {
          callData: await kernelClient.account.encodeCallData({
            to: "0x517CF7C9606B30a1b4723f2E40780033dBDD36e5",
            value: BigInt(0),
            data: "0x",
          }),
      },
    });

    console.log('userOpHash: ', userOpHash);

    const bundlerClient = kernelClient.extend(bundlerActions)
    const receipt = await bundlerClient.waitForUserOperationReceipt({ hash: userOpHash });
    console.log('receipt: ', receipt);
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <button onClick={sentTx}>Send Tx</button>
      </header>
    </div>
  );
}

export default App;
