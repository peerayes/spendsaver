// app/users/page.tsx
"use client";
import React, { useState, useEffect } from 'react';
import Cards from '@/app/assets/scss/cards.module.scss';
import buttonStyle from '@/app/assets/scss/buttons.module.scss';
import WalletHeader from '@/app/components/walletheader';

import InputTransaction from '@/app/components/inputtransaction';
import TransactionList from '@/app/components/TransactionsList';

type Transaction = {
    id: string;
    text: string;
    amount: number;
    type: 'income' | 'expense';
    date: string;
};

interface UserData {
    userName: string;
    transactions: {
        [date: string]: Transaction[];
    };
    formattedAmount: string;
    walletTotal: number;    
}

const UsersPage = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showAmount, setShowAmount] = useState(false);
    const [showInputTransaction, setShowInputTransaction] = useState(false);
    const [totalToday, setTotalToday] = useState<number>(0);
    const [currentDate, setCurrentDate] = useState<string>(new Date().toLocaleDateString('th-TH'));
    const [transactionsMonthTotal, setTransactionsMonthTotal] = useState<number>(0);
    const [userData, setUserData] = useState<UserData>({
        userName: '',
        transactions: {},
        formattedAmount: 'xx.xx',
        walletTotal: 0,
    });
    
    const monthNames = [
        'มกราคม', 'กุมภาพันธ์', 'มีนาคม',
        'เมษายน', 'พฤษภาคม', 'มิถุนายน',
        'กรกฎาคม', 'สิงหาคม', 'กันยายน',
        'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
    ];
    const thaiMonth = monthNames[new Date().getMonth()];

    const toggleInputTransaction = () => {
        setShowInputTransaction(!showInputTransaction);
    };
    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        if (!savedUser) {
            window.location.href = '/login';
        } else {
            try {
                const parsedUserData = JSON.parse(savedUser);
                setIsLoggedIn(true);
                const buddhistYear = new Date().getFullYear() + 543;
                const currentYear = buddhistYear.toString();
                let transactionsMonthTotal = 0;
                for (const date in parsedUserData?.transactions?.[currentYear]?.[new Date().getMonth() + 1]) {
                    const transactionEntry = parsedUserData.transactions[currentYear][new Date().getMonth() + 1][date];
                    if (transactionEntry?.totalToday !== undefined && transactionEntry?.totalToday !== null) {
                        transactionsMonthTotal += transactionEntry.totalToday;
                    }
                }
                setTransactionsMonthTotal(transactionsMonthTotal);
                if (parsedUserData && parsedUserData.transactions) {
                    const totalTodayForCurrentDate = parsedUserData?.transactions?.[currentYear]?.[new Date().getMonth() + 1]?.[currentDate]?.totalToday;
                    if (totalTodayForCurrentDate !== undefined && totalTodayForCurrentDate !== null) {
                        setTotalToday(totalTodayForCurrentDate);
                    }
                }
                if (Array.isArray(parsedUserData.wallet)) {
                    setUserData({
                        userName: parsedUserData.userName,
                        formattedAmount: parsedUserData.wallet[currentDate]?.totalWallet.toFixed(2) || 'xx.xx',
                        transactions: parsedUserData.transactions,
                        walletTotal: parsedUserData.wallet[currentDate]?.totalWallet || 0,
                    });
                } else if (typeof parsedUserData.wallet === 'object' && parsedUserData.wallet !== null) {
                    setUserData({
                        userName: parsedUserData.userName,
                        formattedAmount: parsedUserData.wallet[currentDate]?.totalWallet.toFixed(2) || 'xx.xx',
                        transactions: parsedUserData.transactions,
                        walletTotal: parsedUserData.wallet[currentDate]?.totalWallet || 0,
                    });
                }
    
            } catch (error) {
                console.error('Error parsing user data:', error);
            }
        }
    }, [currentDate]);


    const toggleAmountDisplay = () => {
        setShowAmount(!showAmount);
    };

    const handleClose = () => {
        setShowInputTransaction(false);
    };

    return (
        <section className={Cards.section}>
            <header className={Cards.section__header}>
                <h1 className={Cards.h1}>Income & Expense</h1>
            </header>
            <div className={Cards.cards}>
                <div className={Cards.cards__container}>
                <WalletHeader userName={userData.userName} formattedAmount={showAmount ? userData.formattedAmount : 'xx.xx'} walletTotal={userData.walletTotal} />
                </div>
                <div className={Cards.cards__computed}>
                    <span className={Cards.cards__computed__text}>{totalToday} บาท</span>
                    <span className={Cards.cards__sum}>Total: <strong>{thaiMonth}: {transactionsMonthTotal}</strong> บาท</span>
                    <button className={`${buttonStyle.btn} ${buttonStyle.btn__addItem}`} onClick={toggleInputTransaction}>+ เพิ่มรายการธุรกรรม</button>
                </div>
            </div>
            <TransactionList transactions={userData.transactions}  />
            {showInputTransaction && <InputTransaction handleClose={handleClose} username={userData.userName}/>} 
        </section>
    );
};

export default UsersPage;
