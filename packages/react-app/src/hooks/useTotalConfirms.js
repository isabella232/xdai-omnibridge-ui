import { useContext, useEffect, useState } from 'react';

import { Web3Context } from '../contexts/Web3Context';
import { fetchConfirmations } from '../lib/amb';
import { logError } from '../lib/helpers';

export const useTotalConfirms = () => {
  const { providerChainId, ethersProvider } = useContext(Web3Context);
  const [totalConfirms, setTotalConfirms] = useState(8);

  useEffect(() => {
    if (providerChainId && ethersProvider) {
      fetchConfirmations(providerChainId, ethersProvider)
        .then(total => setTotalConfirms(total))
        .catch(confirmsError => logError({ confirmsError }));
    }
  }, [setTotalConfirms, providerChainId, ethersProvider]);

  return totalConfirms;
};
