// app/wallet/page.tsx
"use client";
import React, { ChangeEvent, useEffect, useState } from 'react';
import WalletHeader from '@/app/components/walletheader';
import styled from 'styled-components';
import buttonStyle from '@/app/assets/scss/buttons.module.scss';
import Wallet from '@/app/assets/scss/wallet.module.scss';
import Link from 'next/link';

const StyledImage = styled.img`
    width: 100%;
    height: auto;
`;

type Transaction = {
    id: string;
    text: string;
    amount: number;
    type: 'income' | 'expense';
    date: string;
    time?: string;
};

type UserData = {
    userName: string;
    transactions: { [key: string]: Transaction[] };
    formattedAmount: string;
    walletTotal: number;
    listWallet: number;
};

type Wallet = {
    date: string;
    listWallet: number;
};
type WalletData = {
    [key: string]: {
        data: {
            time: string;
            text: string;
            amount: number;
        }[];
    };
};

type WalletDataItem = {
    id: string;
    date: string;
    time: string;
    text: string;
    amount: number;
};

type SortedWalletData = {
    [key: string]: WalletDataItem[];
};
type Props = {
    transactions: Transaction[];
};

const WalletPage: React.FC = () => {
    const [walletAmount, setWalletAmount] = useState<number>(0);
    const [newMoney, setNewMoney] = useState<string>('');
    const [showAmount, setShowAmount] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [userData, setUserData] = useState<UserData>({ userName: '', transactions: {}, formattedAmount: 'xx.xx', walletTotal: 0, listWallet:0 });
    const [user, setUser] = useState<any>({ wallet: [] });
    const currentDate = new Date().toLocaleDateString('th-TH');
    const [text, setText] = useState<string>('');
    const [walletTotal, setWalletTotal] = useState<number>(0);
    const [walletData, setWalletData] = useState<SortedWalletData>({});
    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            const parsedUserData = JSON.parse(userData);
            console.log('WLP parsedUserData:', parsedUserData);
            setUserData(parsedUserData);
            if (parsedUserData && parsedUserData.wallet) {
                console.log('WLP parsedUserData.wallet', parsedUserData.wallet);
                const sortedWalletData: SortedWalletData = {};
                const thaiMonthNames = ["มกราคม","กุมภาพันธ์","มีนาคม","เมษายน","พฤษภาคม","มิถุนายน","กรกฎาคม","สิงหาคม","กันยายน","ตุลาคม","พฤศจิกายน","ธันวาคม"];
                let total = 0;
                for (const year in parsedUserData.wallet) {
                    for (const month in parsedUserData.wallet[year]) {
                        for (const date in parsedUserData.wallet[year][month]) {
                            const walletForCurrentDate = parsedUserData.wallet[year][month][date].data;
                            if (walletForCurrentDate && Array.isArray(walletForCurrentDate)) {
                                walletForCurrentDate.forEach((item: WalletDataItem) => {
                                    const monthYear = `${year}/${thaiMonthNames[parseInt(month, 10) - 1]}`;
                                    if (!sortedWalletData[monthYear]) {
                                        sortedWalletData[monthYear] = [];
                                    }
                                    sortedWalletData[monthYear].push(item);
                                    total += item.amount;
                                });
                            }
                        }
                    }
                }
                setWalletTotal(total);
                for (const monthYear in sortedWalletData) {
                    sortedWalletData[monthYear].sort((a: WalletDataItem, b: WalletDataItem) => {
                        const dateA = new Date(a.date).getTime();
                        const dateB = new Date(b.date).getTime();
                        return dateB - dateA;
                    }).reverse();
                }
                console.log('WLP sortedWalletData', sortedWalletData);
                setWalletData(sortedWalletData);
            }
        }
    }, []); 

    const handleDelete = (id: string) => {
        setWalletData(prevData => {
            const updatedWalletData = { ...prevData };
            for (const monthYear in updatedWalletData) {
                updatedWalletData[monthYear] = updatedWalletData[monthYear].filter(item => item.id !== id);
            }
            return updatedWalletData;
        });
        const newTotal = Object.values(walletData).reduce((acc, monthData) =>
            acc + monthData.reduce((monthTotal, item) => monthTotal + item.amount, 0), 0);
        setWalletTotal(newTotal);
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const updatedWallet: { [year: string]: { [month: string]: { [day: string]: { data: Transaction[], totalWallet: number } } } } = { ...user.wallet };
        for (const year in updatedWallet) {
            for (const month in updatedWallet[year]) {
                for (const date in updatedWallet[year][month]) {
                    updatedWallet[year][month][date].data = updatedWallet[year][month][date].data.filter((item: Transaction) => item.id !== id);
                    updatedWallet[year][month][date].totalWallet = updatedWallet[year][month][date].data.reduce((total: number, item: Transaction) => total + item.amount, 0);
                }
            }
        }
        localStorage.setItem('user', JSON.stringify({ ...user, wallet: updatedWallet }));
    };
    
    const handleAddMoney = () => {
        const parsedMoney = parseFloat(newMoney);
        if (!isNaN(parsedMoney)) {
            setIsLoading(true);
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            const updatedWallet: { [year: string]: { [month: string]: { [day: string]: { data: Transaction[], totalWallet: number } } } } = { ...user.wallet };
            const currentDate = new Date();
            const buddhistYear = currentDate.getFullYear() + 543;
            const year = buddhistYear.toString();
            const month = (currentDate.getMonth() + 1).toString();
            const day = currentDate.getDate().toString().padStart(2, '0');
            const dataKey = `${day}/${month}/${year}`;
            const currentTime = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
            const transaction: Transaction = {
                id: generateUniqueId(),
                date: `${day}/${month}/${year}`,
                time: currentTime,
                text: text,
                amount: parsedMoney,
                type: parsedMoney >= 0 ? 'income' : 'expense'
            };
            if (!updatedWallet[year]) {
                updatedWallet[year] = {};
            }
            if (!updatedWallet[year][month]) {
                updatedWallet[year][month] = {};
            }
            if (!updatedWallet[year][month][dataKey]) {
                updatedWallet[year][month][dataKey] = {
                    data: [],
                    totalWallet: 0,
                };
            }
            updatedWallet[year][month][dataKey].data.push(transaction);
            updatedWallet[year][month][dataKey].totalWallet += parsedMoney;
            localStorage.setItem('user', JSON.stringify({ ...user, wallet: updatedWallet }));
            const totalAmount = Object.values(updatedWallet).reduce((acc, year) =>
                acc + Object.values(year).reduce((accMonth, month) =>
                    accMonth + Object.values(month).reduce((accDay, day) =>
                        accDay + day.totalWallet, 0), 0), 0) as number;
            setWalletAmount(totalAmount);
            // setNewMoney('');
            // setText('');
            setTimeout(() => {
                setIsLoading(false);
                window.location.reload();
            }, 1000);
        } else {
            alert('โปรดกรอกจำนวนเงินที่ถูกต้อง');
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleOutsideClick);
        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, []);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewMoney(event.target.value);
    };
    const generateUniqueId = () => {
        return '_' + Math.random().toString(36).substr(2, 9);
    };
    const handleOutsideClick = (event: MouseEvent) => {
        const target = event.target as HTMLElement;
        const walletAmountElement = document.querySelector(`.${Wallet.wallet__bag__money}`);
        if (walletAmountElement && !walletAmountElement.contains(target)) {
            setShowAmount(false);
        }
    };
    const handleBackHome = () => {
        window.location.href = '/';
    };
    
    return (
        <div className={Wallet.wallet}>
            <header className={Wallet.wallet__header}>
                <h2>Wallet</h2>
                <button className={Wallet.wallet__header__span} onClick={handleBackHome}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="19" y1="12" x2="5" y2="12"></line>
                        <polyline points="12 19 5 12 12 5"></polyline>
                    </svg>
                </button>
            </header>
            <div className={Wallet.wallet__container}>
                <div className={Wallet.wallet__profile}>
                    <div className={Wallet.wallet__bag}>
                    <WalletHeader userName={userData.userName} formattedAmount={showAmount ? userData.formattedAmount : 'xx.xx'} walletTotal={userData.walletTotal} />
                        <div className={Wallet.wallet__bag__amount}>
                            {isLoading && (<div className={Wallet.preloader}></div>)}
                            <input 
                                className='' 
                                type="number" 
                                inputMode="numeric" 
                                placeholder="กรอกจำนวนเงิน"
                                pattern="[0-9]*"
                                value={newMoney}
                                onChange={handleInputChange}
                            />
                            <button className={`${buttonStyle.btn} ${buttonStyle.btn__addMoney}`} onClick={handleAddMoney}>+Add</button>
                        </div>
                        <div className={Wallet.wallet__bag__text}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" ><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                            <input 
                            type="text"
                            placeholder="Note(บันทึกช่วยจำ)..."
                            value={text}
                            onChange={(event) => setText(event.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className={Wallet.transaction}>
                <header className={Wallet.transaction__header}>
                    <h2>วันที่ {currentDate}</h2>
                    <Link href="/reports">
                        <button className={Wallet.transaction__button}>
                            <svg width="18" height="20" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" clipRule="evenodd" d="M13 0C13.5523 0 14 0.447715 14 1V2H15C15.7956 2 16.5587 2.31607 17.1213 2.87868C17.6839 3.44129 18 4.20435 18 5V9V17C18 17.7957 17.6839 18.5587 17.1213 19.1213C16.5587 19.6839 15.7957 20 15 20H3C2.20435 20 1.44129 19.6839 0.87868 19.1213C0.31607 18.5587 0 17.7957 0 17V9V5C0 4.20435 0.31607 3.44129 0.87868 2.87868C1.44129 2.31607 2.20435 2 3 2H4V1C4 0.447715 4.44772 0 5 0C5.55228 0 6 0.447715 6 1V2H12V1C12 0.447715 12.4477 0 13 0ZM16 5V8H2V5C2 4.73478 2.10536 4.48043 2.29289 4.29289C2.48043 4.10536 2.73478 4 3 4H4V5C4 5.55228 4.44772 6 5 6C5.55228 6 6 5.55228 6 5V4H12V5C12 5.55228 12.4477 6 13 6C13.5523 6 14 5.55228 14 5V4H15C15.2652 4 15.5196 4.10536 15.7071 4.29289C15.8946 4.48043 16 4.73478 16 5ZM16 10H2V17C2 17.2652 2.10536 17.5196 2.29289 17.7071C2.48043 17.8946 2.73478 18 3 18H15C15.2652 18 15.5196 17.8946 15.7071 17.7071C15.8946 17.5196 16 17.2652 16 17V10ZM4 11C3.44772 11 3 11.4477 3 12C3 12.5523 3.44772 13 4 13H4.013C4.56528 13 5.013 12.5523 5.013 12C5.013 11.4477 4.56528 11 4.013 11H4ZM6.01001 12C6.01001 11.4477 6.45773 11 7.01001 11H7.01501C7.56729 11 8.01501 11.4477 8.01501 12C8.01501 12.5523 7.56729 13 7.01501 13H7.01001C6.45773 13 6.01001 12.5523 6.01001 12ZM10.01 11C9.45772 11 9.01001 11.4477 9.01001 12C9.01001 12.5523 9.45772 13 10.01 13H10.015C10.5673 13 11.015 12.5523 11.015 12C11.015 11.4477 10.5673 11 10.015 11H10.01ZM12.015 12C12.015 11.4477 12.4627 11 13.015 11H13.02C13.5723 11 14.02 11.4477 14.02 12C14.02 12.5523 13.5723 13 13.02 13H13.015C12.4627 13 12.015 12.5523 12.015 12ZM10.015 14C9.46273 14 9.01501 14.4477 9.01501 15C9.01501 15.5523 9.46273 16 10.015 16H10.02C10.5723 16 11.02 15.5523 11.02 15C11.02 14.4477 10.5723 14 10.02 14H10.015ZM3.01001 15C3.01001 14.4477 3.45773 14 4.01001 14H4.01501C4.56729 14 5.01501 14.4477 5.01501 15C5.01501 15.5523 4.56729 16 4.01501 16H4.01001C3.45773 16 3.01001 15.5523 3.01001 15ZM7.01001 14C6.45773 14 6.01001 14.4477 6.01001 15C6.01001 15.5523 6.45773 16 7.01001 16H7.01501C7.56729 16 8.01501 15.5523 8.01501 15C8.01501 14.4477 7.56729 14 7.01501 14H7.01001Z" fill="#AD3D3D"/>
                            </svg>
                        </button>
                    </Link>
                </header>
                <ul className={Wallet.transaction__listitem}>
                {Object.keys(walletData).reverse().map(monthYear => {
                    const [month, year] = monthYear.split('/');
                    const thaiMonths = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];
                    const sortedTransactions = walletData[monthYear].slice().sort((a, b) => {
                        const dateA = new Date(`${a.date} ${a.time}`).getTime();
                        const dateB = new Date(`${b.date} ${b.time}`).getTime();
                        return dateB - dateA;
                    });
                    return (
                        <li key={monthYear} className={Wallet.transaction__listitem__items}>
                            <h3>
                                <span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg> {thaiMonths[parseInt(month) - 1]} {year}
                                </span>
                            </h3>
                            {sortedTransactions.map((dataItem: WalletDataItem, index: number) => (
                                <ol key={index} className={Wallet.transaction__listitem__daily}>
                                    <li className={Wallet.daily}>
                                        <div className={Wallet.daily__date}>{dataItem.date}</div>
                                        <div className={Wallet.daily__text}>{dataItem.text}</div>
                                        <div className={Wallet.daily__amount}>{dataItem.amount} บาท</div>
                                        <div className={Wallet.daily__btn}>
                                            <button className={Wallet.transaction__delete} onClick={() => handleDelete(dataItem.id)}>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                                    <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
                                                    <path d="M9 12l6 0" />
                                                </svg>
                                            </button>
                                        </div>
                                    </li>
                                </ol>
                            ))}
                        </li>
                    );
                })}
                </ul>

            </div>
        </div>
    );
};

export default WalletPage;
