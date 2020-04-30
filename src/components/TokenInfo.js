import React, { useContext, useEffect } from "react";
import styled from "styled-components";

import {
  Web3ConnectContext,
  CurrentUserContext,
  ContractContext,
} from "../contexts/Store.js";

const TokenP = styled.p`
  display: inline-block;
  text-align: right;
  width: 100%;
  float: right;
  margin-top: -32px;
  color: rgba(255, 255, 255, 0.85);
`;

export const TokenInfo = (props) => {
  const [web3Connect] = useContext(Web3ConnectContext);
  const [currentUser, setCurrentUser] = useContext(CurrentUserContext);
  const [contract] = useContext(ContractContext);

  useEffect(() => {
    const getInfo = async () => {
      // set wETH balance
      const wethBalanceInWei = await contract.methods
        .balanceOf(currentUser.username)
        .call();
      const wethBalance = web3Connect.web3.utils.fromWei("" + wethBalanceInWei);
      // get Eth Balance
      const ethBalanceInWei = await web3Connect.web3.eth.getBalance(
        currentUser.username
      );
      const ethBalance = web3Connect.web3.utils.fromWei("" + ethBalanceInWei);

      setCurrentUser({ ...currentUser, ...{ wethBalance, ethBalance } });
    };
    if (contract) {
      getInfo();
    }
    // eslint-disable-next-line
  }, [contract]);

  const forDisplay = (number) => {
    const truncated = Math.floor(+number * 100) / 100;
    return truncated ? truncated : 0;
  };

  return currentUser && props.Eth ? (
    <TokenP max={forDisplay(currentUser.ethBalance)}>
      ETH Balance: {forDisplay(currentUser.ethBalance)}
    </TokenP>
  ) : (
    <TokenP max={forDisplay(currentUser.wethBalance)}>
      wETH Balance: {forDisplay(currentUser.wethBalance)}
    </TokenP>
  );
};
