// app/login/page.tsx
"use client";
import React, { useState, useEffect } from 'react';

import FormLogin from '@/app/assets/scss/formlogin.module.scss';
import buttonStyle from '@/app/assets/scss/buttons.module.scss';

interface Transaction {}

interface User {
    userName: string;
    email: string;
    password: string;
    transactions: Transaction[];
    wallet: number[];
}


const RegisterForm: React.FC = () => {
    const [userName, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const setUser = (newUser: User) => {
        localStorage.setItem('user', JSON.stringify(newUser));
    };

    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
    }, []);

    const handleCancel = () => {
        window.location.href = '/';
    };
    const handleRegister = () => {
        if (email && userName && password) {
            const savedUser = localStorage.getItem('user');
            const parsedUser: User = savedUser ? JSON.parse(savedUser) : {};
            const newTransaction: Transaction = {}; // ข้อมูลธุรกรรมใหม่
            const updatedTransactions: Transaction[] = parsedUser.transactions
                ? [...parsedUser.transactions, newTransaction]
                : [newTransaction];
            const updatedWallet: number[] = parsedUser.wallet ? [...parsedUser.wallet, 0] : [0];
            const newUser: User = {
                ...parsedUser,
                userName,
                email,
                password,
                transactions: updatedTransactions,
                wallet: updatedWallet,
            };
            localStorage.setItem('user', JSON.stringify(newUser));

            window.location.href = '/';
        } else {
            alert('กรุณากรอกข้อมูลให้ครบถ้วน');
        }
        
    };

    return (
        <div className={FormLogin.form}>
        <header className={FormLogin.form__header}>
            <h2 className={FormLogin.h2}>เข้าใช้งาน(V.Beta)</h2>
        </header>
            <div className={FormLogin.form__container}>
                <div className={FormLogin.form__section}>
                    <input 
                    className={FormLogin.form__section__input} 
                    type="email" 
                    placeholder="Email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className={FormLogin.form__section}>
                    <input 
                    className={FormLogin.form__section__input} 
                    type="text" 
                    placeholder="Username" 
                    value={userName}
                    onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div className={FormLogin.form__section}>
                    <input 
                    className={FormLogin.form__section__input} 
                    type="password" 
                    placeholder="Password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
            </div>
            <div className={FormLogin.form__footer}>
                <button className={`${buttonStyle.btn} ${buttonStyle.btn__cancel}`} onClick={handleCancel}>ยกเลิก</button>
                <button className={`${buttonStyle.btn} ${buttonStyle.btn__primary}`} onClick={handleRegister}><span>สมัครใช้งาน</span></button>
            </div>
        </div>
    );
};

export default RegisterForm;

