import { BridgeContext } from 'contexts/BridgeContext';
import { Web3Context } from 'contexts/Web3Context';
import { HOME_NETWORK } from 'lib/constants';
import { getBridgeNetwork } from 'lib/helpers';
import {
  combineRequestsWithExecutions,
  getExecutions,
  getRequests,
} from 'lib/history';
import { useContext, useEffect, useState } from 'react';
import { defer } from 'rxjs';

export const useClaimableTransfers = () => {
  const { account, providerChainId } = useContext(Web3Context);
  const { txHash } = useContext(BridgeContext);
  const [transfers, setTransfers] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!account || !providerChainId) return () => undefined;
    const chainId = HOME_NETWORK;
    const bridgeChainId = getBridgeNetwork(chainId);
    async function update() {
      setLoading(true);
      setTransfers();
      const { requests } = await getRequests(account, chainId);
      const { executions } = await getExecutions(bridgeChainId, requests);
      const xDaiTransfers = combineRequestsWithExecutions(
        requests,
        executions,
        chainId,
      )
        .sort((a, b) => b.timestamp - a.timestamp)
        .filter(t => !t.receivingTx);
      setTransfers(xDaiTransfers);
      setLoading(false);
    }
    const subscription = defer(() => update()).subscribe();
    return () => subscription.unsubscribe();
  }, [account, providerChainId, txHash]);

  return { transfers, loading };
};
