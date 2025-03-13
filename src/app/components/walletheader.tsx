"use client";
import Wallet from "@/app/assets/scss/wallet.module.scss";
import Link from "next/link";
import { useEffect, useState } from "react";
import styled from "styled-components";

const StyledImageSmall = styled.img`
  width: 48px;
  height: 48px;
  box-sizing: border-box;
  border-radius: 100%;
  border: 2px solid #fff;
  margin: 0;
`;

interface WalletHeaderProps {
  userName: string;
  formattedAmount: string;
  walletTotal: number;
}

const WalletHeader = ({ userName }: WalletHeaderProps) => {
  const [walletTotal, setWalletTotal] = useState<number>(0);
  const [showFormattedAmount, setShowFormattedAmount] = useState<boolean>(true);
  const [walletSum, setWalletSum] = useState<number>(0);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsedUserData = JSON.parse(userData);
      let walletSum = 0;
      for (const year in parsedUserData.wallet) {
        for (const month in parsedUserData.wallet[year]) {
          for (const date in parsedUserData.wallet[year][month]) {
            walletSum += parsedUserData.wallet[year][month][date].totalWallet;
          }
        }
      }
      let transactionsTotal = 0;
      for (const year in parsedUserData?.transactions) {
        for (const month in parsedUserData.transactions[year]) {
          for (const date in parsedUserData.transactions[year][month]) {
            const transactionEntry =
              parsedUserData.transactions[year][month][date];
            if (
              transactionEntry?.totalToday !== undefined &&
              transactionEntry?.totalToday !== null
            ) {
              transactionsTotal += transactionEntry.totalToday;
            }
          }
        }
      }
      setWalletSum(walletSum);
      setWalletTotal(walletSum + transactionsTotal);
      // console.log("WH Wallet Total:", walletSum);
      // console.log("WH Transactions Total:", transactionsTotal);
    }
  }, []);

  const toggleAmountDisplay = () => {
    setShowFormattedAmount(!showFormattedAmount);
  };
  return (
    <div className={Wallet.wallet__bag__container}>
      <div className={Wallet.wallet__user}>
        <picture className={Wallet.wallet__bag__img}>
          <StyledImageSmall
            src="/profile-admin.jpg"
            alt="Profile Image"
            className={Wallet.wallet__profile}
          />
        </picture>
        <Link href="/wallet" className={Wallet.wallet__user__link}>
          <div className={Wallet.wallet__bag__name}>
            <span>{userName}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M17 8v-3a1 1 0 0 0 -1 -1h-10a2 2 0 0 0 0 4h12a1 1 0 0 1 1 1v3m0 4v3a1 1 0 0 1 -1 1h-12a2 2 0 0 1 -2 -2v-12" />
              <path d="M20 12v4h-4a2 2 0 0 1 0 -4h4" />
            </svg>
          </div>
        </Link>
      </div>
      <div className={Wallet.wallet__bag__money} onClick={toggleAmountDisplay}>
        <span>
          {showFormattedAmount ? "xx.xx" : walletTotal} <small>บาท</small>
        </span>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 27.55 14.993">
          <path
            d="M13.775 14.993a16.909 16.909 0 0 1-9.642-3.5A24.41 24.41 0 0 1 .19 8.007a.779.779 0 0 1 0-1.02 24.413 24.413 0 0 1 3.943-3.483 16.91 16.91 0 0 1 9.642-3.5 16.909 16.909 0 0 1 9.642 3.5 24.413 24.413 0 0 1 3.943 3.483.779.779 0 0 1 0 1.02 24.412 24.412 0 0 1-3.943 3.483 16.909 16.909 0 0 1-9.642 3.503zm-11.928-7.5a24.587 24.587 0 0 0 3.222 2.747 15.659 15.659 0 0 0 8.706 3.192 15.659 15.659 0 0 0 8.706-3.192 24.588 24.588 0 0 0 3.222-2.747 24.586 24.586 0 0 0-3.222-2.747 15.659 15.659 0 0 0-8.706-3.192 15.659 15.659 0 0 0-8.706 3.192 24.581 24.581 0 0 0-3.222 2.751z"
            data-name="Path 320"
          />
          <path
            d="M13.775 12.327a4.83 4.83 0 1 1 3.182-8.465.78.78 0 0 1-1.027 1.172 3.272 3.272 0 1 0 1.117 2.462.779.779 0 1 1 1.558 0 4.836 4.836 0 0 1-4.83 4.831z"
            data-name="Path 321"
          />
          <path
            d="M13.775 9.055a1.558 1.558 0 1 1 1.558-1.558 1.56 1.56 0 0 1-1.558 1.558z"
            data-name="Path 322"
          />
        </svg>
      </div>
    </div>
  );
};

export default WalletHeader;
