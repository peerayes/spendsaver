// components/inputtransaction.tsx
"use client";
import React, { useState, useEffect, useRef } from 'react';
import buttonStyle from '@/app/assets/scss/buttons.module.scss';
import InputTransactions from '@/app/assets/scss/inputtransaction.module.scss';
interface TransactionData {
    id: string;
    text: string;
    amount: number;
    type: 'income' | 'expense';
    date: string;
}
// ปรับโครงสร้างข้อมูล transactions เป็นรายเดือน
interface TransactionMonth {
    [key: string]: {
        data: TransactionData[];
        totalToday: number;
    };
}
// ปรับโครงสร้างข้อมูล transactions เป็นรายปี
interface Transactions {
    [key: string]: TransactionMonth;
}
type InputTransactionsProps = {
    username: string;
    handleClose: () => void;
}
const InputTranSactions: React.FC<InputTransactionsProps> = ({ handleClose, username }) => {
    const [text, setText] = useState('');
    const [amount, setAmount] = useState('');
    const [selectedOption, setSelectedOption] = useState<'income' | 'expense'>('income');
    const [userName, setUsername] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const saveButtonRef = useRef<HTMLButtonElement>(null);
    const currentDate = new Date().toLocaleDateString('th-TH');

    useEffect(() => {
        setSelectedOption('income');
        if (text.trim() !== '' && amount.trim() !== '') {
            setIsSaving(false);
        } else {
            setIsSaving(true);
        }
    }, [text, amount]);

    useEffect(() => {
        const userData = localStorage.getItem('user');
        const user = userData ? JSON.parse(userData) : null;
        if (user && user.userName) {
            setUsername(user.userName);
        }
    }, []);

    const generateUniqueId = () => {
        return '_' + Math.random().toString(36).substr(2, 9);
    };

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const newTransaction = {
            id: generateUniqueId(),
            text: text,
            amount: +amount,
            type: selectedOption,
            date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
        };
        const userData = localStorage.getItem('user');
        const user = userData ? JSON.parse(userData) : { transactions: {} };
        const currentDate = new Date();
        const buddhistYear = currentDate.getFullYear() + 543;
        const currentYear = buddhistYear.toString();
        const currentMonth = (currentDate.getMonth() + 1).toString();
        const currentDay = currentDate.getDate().toString();
        const key = `${currentDay}/${currentMonth}/${currentYear}`; // สร้าง key จากวันที่ปัจจุบัน
        const updatedTransactions: Transactions = {
            ...user.transactions,
            [currentYear]: {
                ...user.transactions?.[currentYear],
                [currentMonth]: {
                    ...user.transactions?.[currentYear]?.[currentMonth],
                    [key]: {
                        data: [...(user.transactions?.[currentYear]?.[currentMonth]?.[key]?.data || []), newTransaction], // เพิ่มข้อมูลใหม่ลงใน key นี้
                        totalToday: selectedOption === 'income'
                            ? (user.transactions?.[currentYear]?.[currentMonth]?.[key]?.totalToday || 0) + (+amount)
                            : (user.transactions?.[currentYear]?.[currentMonth]?.[key]?.totalToday || 0) - (+amount),
                    },
                },
            },
        };
        const updatedUser = {
            ...(user || {}),
            transactions: updatedTransactions,
        };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        // setText(''); //ไม่ล้างค่าในช่องInput
        // setAmount(''); //ไม่ล้างค่าในช่องInput
        setIsSaving(true);
    };
    const handleClick = () => {
        const saveButton = saveButtonRef.current;
        if (saveButton) {
            saveButton.disabled = false;
            saveButton.classList.add(`${buttonStyle.btn__loading}`);
            saveButton.innerHTML = '<span>กำลังบันทึก</span>';
            setIsSaving(false);
            setTimeout(() => {
                saveButton.innerHTML = '<span>บันทึกสำเร็จ</span>';
                setTimeout(() => {
                    setIsSaving(true); 
                    saveButton.classList.remove('loading');
                    window.location.href = '/';
                }, 1500);
            }, 1500);
        }
    };
    const handleCancel = () => {
        handleClose();
    };
    return (
        <section className={InputTransactions.section}>
            <header className={InputTransactions.section__header}>
                <h2 className='section__header__title'>Add new transactions</h2>
            </header>
            <form className={InputTransactions.inputsection} onSubmit={onSubmit}>
                <div className={InputTransactions.inputsection__section}>
                    <label className={InputTransactions.inputsection__label}>
                        <span>วันที่: {currentDate}</span>
                        <span>สวัสดี: {username}</span>
                    </label>
                </div>
                <div className={InputTransactions.inputsection__section}>
                    <div className={InputTransactions.inputsection__section__container}>
                        <div className={InputTransactions.inputsection__select}>
                            <div className={InputTransactions.inputsection__select__type}>
                                <label className={selectedOption === 'income' ? InputTransactions.checked : ''}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="12" y1="18" x2="12" y2="12"></line><line x1="9" y1="15" x2="15" y2="15"></line></svg>
                                <input
                                    type="radio"
                                    name="income-expense"
                                    value="income"
                                    checked={selectedOption === 'income'}
                                    onChange={() => setSelectedOption('income')}
                                /> Income
                                </label>
                            </div>
                            <div className={InputTransactions.inputsection__select__type}>
                                <label className={selectedOption === 'expense' ? InputTransactions.checked : ''}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="9" y1="15" x2="15" y2="15"></line></svg>
                                <input
                                    type="radio"
                                    name="income-expense"
                                    value="expense"
                                    checked={selectedOption === 'expense'}
                                    onChange={() => setSelectedOption('expense')}
                                /> Expense
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={InputTransactions.inputsection__section}>
                    <div className={InputTransactions.inputsection__section__container}>
                        <input 
                            type="text" 
                            placeholder="รายการ"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                        />
                        {text && (
                            <span onClick={() => setText('')}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#97958f" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </span>
                        )}
                    </div>
                </div>
                <div className={InputTransactions.inputsection__section}>
                    <div className={InputTransactions.inputsection__section__container}>
                        <input 
                            type="number"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="จำนวนเงิน"
                        />
                        {amount && (
                            <span onClick={() => setAmount('')}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#97958f" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </span>
                        )}
                    </div>
                </div>
                <footer className={InputTransactions.inputsection__section__footer}>
                    <button type="button" className={`${buttonStyle.btn} ${buttonStyle.btn__backbefore}`} onClick={handleCancel}>
                        Cancel
                    </button>
                    <button type="submit" className={`${buttonStyle.btn} ${buttonStyle.btn__primary}`} 
                    ref={saveButtonRef} 
                    onClick={handleClick}
                    disabled={isSaving}
                    >
                        <span>Add</span>
                    </button>
                </footer>
            </form>
        </section>
    )
}

export default InputTranSactions;