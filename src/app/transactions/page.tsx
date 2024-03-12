// app/transactions/page.tsx
"use client";
import React, { useState, useEffect } from 'react';
import TranSactions from '@/app/assets/scss/transaction.module.scss';

type Transaction = {
    id: string;
    text: string;
    amount: number;
    type: 'income' | 'expense';
    date: string;
};
type Props = {
    transactions: { [key: string]: Transaction[] };
    transactionsMonthTotalArray: { [key: string]: string[] };
    totalToday: number;
};
const TransactionList: React.FC<Props> = ({ transactions }) => {
    const currentDate = new Date().toLocaleDateString('th-TH');
    const [userData, setUserData] = useState<any>(null);
    const [currentTransactions, setCurrentTransactions] = useState<Transaction[]>([]);
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [sum, setSum] = useState<number>(0);
    const [walletTotal, setWalletTotal] = useState<number>(0);
    const [transactionsMonthTotal, setTransactionsMonthTotal] = useState<{ [key: string]: number }>({});
    const [transactionsMonthTotalArray, setTransactionsMonthTotalArray] = useState<{ [key: string]: string[] }>({});
    const [totalToday, setTotalToday] = useState<number>(0);

    useEffect(() => {
        const buddhistYear = new Date().getFullYear() + 543;
        const currentYear = buddhistYear.toString();
        const currentDate = `${new Date().getDate()}/${new Date().getMonth() + 1}/${new Date().getFullYear() + 543}`;
        console.log(currentDate);
        const userData = localStorage.getItem('user');
        if (userData) {
            const parsedUserData = JSON.parse(userData);
            console.log('transactions:',parsedUserData);
            if (parsedUserData && parsedUserData.transactions) {
                const transactionsForCurrentDate = parsedUserData.transactions?.[currentYear]?.[new Date().getMonth() + 1]?.[currentDate]?.data;
                console.log('TS transactionsForCurrentDate:', transactionsForCurrentDate);
                if (transactionsForCurrentDate && Array.isArray(transactionsForCurrentDate)) {
                    const sortedTransactions = transactionsForCurrentDate.slice().sort((a: Transaction, b: Transaction) => {
                        const dateA = new Date(a.date).getTime();
                        const dateB = new Date(b.date).getTime();
                        return dateB - dateA;
                    }).reverse();
                    setCurrentTransactions(sortedTransactions);
                }
            }
            let walletSum = 0;
            for (const key in parsedUserData?.wallet) {
                const walletEntry = parsedUserData?.wallet[key];
                if (walletEntry?.totalWallet !== undefined && walletEntry?.totalWallet !== null) {
                    walletSum += walletEntry.totalWallet;
                }
            }
            const thaiMonthNames = ["มกราคม","กุมภาพันธ์","มีนาคม","เมษายน","พฤษภาคม","มิถุนายน","กรกฎาคม","สิงหาคม","กันยายน","ตุลาคม","พฤศจิกายน","ธันวาคม"];
            let transactionsMonthTotal: { [key: string]: number } = {};
            let transactionsMonthTotalArray: { [key: string]: string[] } = {};
            let transactionsTotal = 0;
            let totalToday = 0;
            for (const year in parsedUserData?.transactions) {
                for (const month in parsedUserData.transactions[year]) {
                    for (const date in parsedUserData.transactions[year][month]) {
                        const transactionEntry = parsedUserData.transactions[year][month][date];
                        
                        if (transactionEntry?.totalToday !== undefined && transactionEntry?.totalToday !== null) {
                            transactionsTotal += transactionEntry.totalToday;
                            totalToday += transactionEntry.totalToday;
                        }
                        const [day, currentMonth, currentYear] = date.split('/');
                        const currentMonthName = thaiMonthNames[parseInt(currentMonth) - 1];
                        const currentMonthKey = `${year}/${currentMonthName}`;
                        if (!transactionsMonthTotal[currentMonthKey]) {
                            transactionsMonthTotal[currentMonthKey] = 0;
                            transactionsMonthTotalArray[currentMonthKey] = [];
                        }
                        transactionsMonthTotal[currentMonthKey] += transactionEntry.totalToday;
                        transactionsMonthTotalArray[currentMonthKey].push(`${day} = ${transactionEntry.totalToday}`);
                    }
                }
            }
            setSum(walletSum);
            setWalletTotal(walletSum + transactionsTotal);
            setTransactionsMonthTotal(transactionsMonthTotal);
            setTransactionsMonthTotalArray(transactionsMonthTotalArray);
            console.log("Wallet Total:", walletSum);
            console.log("Transactions Total:", transactionsTotal);
            console.log("Transactions Month Total:", transactionsMonthTotal);
            console.log("Transactions Month Total Array:", transactionsMonthTotalArray);
            
            const totalTodayForCurrentDate = parsedUserData?.transactions?.[currentYear]?.[new Date().getMonth() + 1]?.[currentDate]?.totalToday;
            console.log("Total Today for Current Date:", totalTodayForCurrentDate);
            if (totalTodayForCurrentDate !== undefined && totalTodayForCurrentDate !== null) {
                setTotalToday(totalTodayForCurrentDate);
            }

        }
    }, [currentDate]);
    
    const handleDateSelect = (date: string) => {
        setSelectedDate(date);
    };
    
    const handleDelete = (transactionId: string) => {
        const updatedTransactions = currentTransactions.filter((transaction: Transaction) => transaction.id !== transactionId);
        const sortedTransactions = updatedTransactions.sort((a: Transaction, b: Transaction) => {
            const dateA = new Date(a.date).getTime();
            const dateB = new Date(b.date).getTime();
            return dateB - dateA;
        });
        setCurrentTransactions(sortedTransactions);
        setCurrentTransactions(updatedTransactions);
        
        const userData = localStorage.getItem('user');
        if (userData) {
            const parsedUserData = JSON.parse(userData);
            const buddhistYear = new Date().getFullYear() + 543;
            const currentYear = buddhistYear.toString();
            const updatedUserData = {
                ...parsedUserData,
                transactions: {
                    ...parsedUserData.transactions,
                    [currentYear]: {
                        ...parsedUserData.transactions[currentYear],
                        [new Date().getMonth() + 1]: {
                            ...parsedUserData.transactions[currentYear][new Date().getMonth() + 1],
                            [currentDate]: {
                                data: updatedTransactions,
                                totalToday: updatedTransactions.reduce((total: number, transaction: Transaction) => {
                                    return total + (transaction.type === 'income' ? transaction.amount : -transaction.amount);
                                }, 0)
                            }
                        }
                    }
                }
            };
            localStorage.setItem('user', JSON.stringify(updatedUserData));
        }
    };
    
    return (
        <section className={TranSactions.section}>
            <header className={TranSactions.section__header}>
                <h2>รายการวันที่ {currentDate}/รายจ่ายวันนี้: {totalToday}</h2>
                <button className={TranSactions.section__header__button} onClick={() => handleDateSelect(currentDate)}>
                    <svg width="18" height="20" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" clipRule="evenodd" d="M13 0C13.5523 0 14 0.447715 14 1V2H15C15.7956 2 16.5587 2.31607 17.1213 2.87868C17.6839 3.44129 18 4.20435 18 5V9V17C18 17.7957 17.6839 18.5587 17.1213 19.1213C16.5587 19.6839 15.7957 20 15 20H3C2.20435 20 1.44129 19.6839 0.87868 19.1213C0.31607 18.5587 0 17.7957 0 17V9V5C0 4.20435 0.31607 3.44129 0.87868 2.87868C1.44129 2.31607 2.20435 2 3 2H4V1C4 0.447715 4.44772 0 5 0C5.55228 0 6 0.447715 6 1V2H12V1C12 0.447715 12.4477 0 13 0ZM16 5V8H2V5C2 4.73478 2.10536 4.48043 2.29289 4.29289C2.48043 4.10536 2.73478 4 3 4H4V5C4 5.55228 4.44772 6 5 6C5.55228 6 6 5.55228 6 5V4H12V5C12 5.55228 12.4477 6 13 6C13.5523 6 14 5.55228 14 5V4H15C15.2652 4 15.5196 4.10536 15.7071 4.29289C15.8946 4.48043 16 4.73478 16 5ZM16 10H2V17C2 17.2652 2.10536 17.5196 2.29289 17.7071C2.48043 17.8946 2.73478 18 3 18H15C15.2652 18 15.5196 17.8946 15.7071 17.7071C15.8946 17.5196 16 17.2652 16 17V10ZM4 11C3.44772 11 3 11.4477 3 12C3 12.5523 3.44772 13 4 13H4.013C4.56528 13 5.013 12.5523 5.013 12C5.013 11.4477 4.56528 11 4.013 11H4ZM6.01001 12C6.01001 11.4477 6.45773 11 7.01001 11H7.01501C7.56729 11 8.01501 11.4477 8.01501 12C8.01501 12.5523 7.56729 13 7.01501 13H7.01001C6.45773 13 6.01001 12.5523 6.01001 12ZM10.01 11C9.45772 11 9.01001 11.4477 9.01001 12C9.01001 12.5523 9.45772 13 10.01 13H10.015C10.5673 13 11.015 12.5523 11.015 12C11.015 11.4477 10.5673 11 10.015 11H10.01ZM12.015 12C12.015 11.4477 12.4627 11 13.015 11H13.02C13.5723 11 14.02 11.4477 14.02 12C14.02 12.5523 13.5723 13 13.02 13H13.015C12.4627 13 12.015 12.5523 12.015 12ZM10.015 14C9.46273 14 9.01501 14.4477 9.01501 15C9.01501 15.5523 9.46273 16 10.015 16H10.02C10.5723 16 11.02 15.5523 11.02 15C11.02 14.4477 10.5723 14 10.02 14H10.015ZM3.01001 15C3.01001 14.4477 3.45773 14 4.01001 14H4.01501C4.56729 14 5.01501 14.4477 5.01501 15C5.01501 15.5523 4.56729 16 4.01501 16H4.01001C3.45773 16 3.01001 15.5523 3.01001 15ZM7.01001 14C6.45773 14 6.01001 14.4477 6.01001 15C6.01001 15.5523 6.45773 16 7.01001 16H7.01501C7.56729 16 8.01501 15.5523 8.01501 15C8.01501 14.4477 7.56729 14 7.01501 14H7.01001Z" fill="#AD3D3D"/>
                    </svg>
                </button>
            </header>
            <ul className={TranSactions.section__listitem}>
                {currentTransactions && currentTransactions.length > 0 ? (
                    currentTransactions.map((transaction: Transaction) => (
                        <li key={transaction.id}>
                            <time>{transaction.date}</time>
                            <div>{transaction.text}</div>
                            <div className={transaction.type === 'expense' ? 'expense' : 'income'}>
                                {transaction.type === 'expense' && <span> - </span>}
                                <span style={transaction.type === 'income' ? { color: '#6FFF58' } : {}}>{transaction.amount} บาท</span>
                            </div>
                            <button className={TranSactions.delete} onClick={() => handleDelete(transaction.id)}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                    <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
                                    <path d="M9 12l6 0" />
                                </svg>
                            </button>
                        </li>
                    ))
                ) : (
                    <li>ไม่มีรายการธุรกรรมในวันที่ปัจจุบัน</li>
                )}
                {Object.entries(transactionsMonthTotal).map(([month, total]) => (
                    <li key={month}>
                        {month.substring(5)}: {total}
                    </li>
                ))}
                {Object.entries(transactionsMonthTotalArray).map(([month, dayTotalArray]) => (
                    <li key={month}>
                        <ol>
                            <li>{month.substring(5)}</li>
                            {dayTotalArray.map(dayTotal => (
                                <li key={dayTotal}>{dayTotal}</li>
                            ))}
                        </ol>
                    </li>
                ))}
            </ul>
        </section>
    );
};

export default TransactionList;