// components/user.tsx
"use client";
import React from "react";
import Image from 'next/image';
import Cards from '@/app/assets/scss/cards.module.scss';
import buttonStyle from '@/app/assets/scss/buttons.module.scss';
import Link from 'next/link';

type UserProps = {
    params: any;
}

const UserComponent = () => {
    let userName = null;
    if (typeof window !== 'undefined') {
        const savedUser = localStorage.getItem('user');
        const userData = savedUser ? JSON.parse(savedUser) : null;
        userName = userData ? userData.userName : null;
    }

    return (
        <section className={Cards.section}>
            <header className={Cards.section__header}>
                <h1 className={Cards.h1}>Income & Expense</h1>
            </header>
            <div className={Cards.cards}>
                <div className={Cards.cards__container}>
                    <div className={Cards.cards__users}>
                        <Image src="/profile-admin.jpg" width={50} height={50} className={Cards.images} alt="Profile Image"/>
                        {userName ? (
                            <button className={`${buttonStyle.btn} ${buttonStyle.btn__profile}`} onClick={() => { window.location.href = '/wallet'; }}>
                                <span>{userName}</span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                    <path d="M17 8v-3a1 1 0 0 0 -1 -1h-10a2 2 0 0 0 0 4h12a1 1 0 0 1 1 1v3m0 4v3a1 1 0 0 1 -1 1h-12a2 2 0 0 1 -2 -2v-12" />
                                    <path d="M20 12v4h-4a2 2 0 0 1 0 -4h4" />
                                </svg>
                            </button>
                        ) : (
                            <Link href="/login">
                                <button className={`${buttonStyle.btn} ${buttonStyle.btn__profile}`}>
                                    <span>เข้าใช้งาน</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                        <path d="M17 8v-3a1 1 0 0 0 -1 -1h-10a2 2 0 0 0 0 4h12a1 1 0 0 1 1 1v3m0 4v3a1 1 0 0 1 -1 1h-12a2 2 0 0 1 -2 -2v-12" />
                                        <path d="M20 12v4h-4a2 2 0 0 1 0 -4h4" />
                                    </svg>
                                </button>
                            </Link>
                        )}
                    </div>
                    <div className={Cards.cards__wallet}>
                        <span>xx.xx บาท</span>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 27.55 14.993">
                            <path d="M13.775 14.993a16.909 16.909 0 0 1-9.642-3.5A24.41 24.41 0 0 1 .19 8.007a.779.779 0 0 1 0-1.02 24.413 24.413 0 0 1 3.943-3.483 16.91 16.91 0 0 1 9.642-3.5 16.909 16.909 0 0 1 9.642 3.5 24.413 24.413 0 0 1 3.943 3.483.779.779 0 0 1 0 1.02 24.412 24.412 0 0 1-3.943 3.483 16.909 16.909 0 0 1-9.642 3.503zm-11.928-7.5a24.587 24.587 0 0 0 3.222 2.747 15.659 15.659 0 0 0 8.706 3.192 15.659 15.659 0 0 0 8.706-3.192 24.588 24.588 0 0 0 3.222-2.747 24.586 24.586 0 0 0-3.222-2.747 15.659 15.659 0 0 0-8.706-3.192 15.659 15.659 0 0 0-8.706 3.192 24.581 24.581 0 0 0-3.222 2.751z" data-name="Path 320"/>
                            <path d="M13.775 12.327a4.83 4.83 0 1 1 3.182-8.465.78.78 0 0 1-1.027 1.172 3.272 3.272 0 1 0 1.117 2.462.779.779 0 1 1 1.558 0 4.836 4.836 0 0 1-4.83 4.831z" data-name="Path 321"/>
                            <path d="M13.775 9.055a1.558 1.558 0 1 1 1.558-1.558 1.56 1.56 0 0 1-1.558 1.558z" data-name="Path 322"/>
                        </svg>
                    </div>
                </div>
                <div className={Cards.cards__computed}>
                    <span className={Cards.cards__computed__text}>0.00 <small>บาท</small></span>
                    <button className={`${buttonStyle.btn} ${buttonStyle.btn__addItem}`}><span>เพิ่มรายการธุรกรรม</span></button>
                </div>
            </div>
        </section>
    );
};

export default UserComponent;