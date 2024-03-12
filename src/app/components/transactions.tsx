// components/transactions.tsx
"use client";
import React from 'react';
import TranSactions from '@/app/assets/scss/transaction.module.scss';

type Props = {
    params: any;
}

export default function transaction() {
    return (
        <section className={TranSactions.section}>
            <header className={TranSactions.section__header}>
                <h2>รายการวันที่ 13/12/2023</h2>
                <button>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                    <path d="M4 7a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12z" />
                    <path d="M16 3v4" />
                    <path d="M8 3v4" />
                    <path d="M4 11h16" />
                    <path d="M7 14h.013" />
                    <path d="M10.01 14h.005" />
                    <path d="M13.01 14h.005" />
                    <path d="M16.015 14h.005" />
                    <path d="M13.015 17h.005" />
                    <path d="M7.01 17h.005" />
                    <path d="M10.01 17h.005" />
                </svg>
                </button>
            </header>

            <ul className={TranSactions.section__listitem}>
                <li>
                    <time>17:14</time>
                    <div>รายการธุรกรรม</div>
                    <div>00.00 บาท</div>
                    <button className={TranSactions.delete}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                            <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
                            <path d="M9 12l6 0" />
                        </svg>
                    </button>
                </li>
                <li>
                    <time>17:14</time>
                    <div>รายการธุรกรรม</div>
                    <div>00.00 บาท</div>
                    <button className={TranSactions.delete}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                            <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
                            <path d="M9 12l6 0" />
                        </svg>
                    </button>
                </li>
                <li>
                    <time>17:14</time>
                    <div>รายการธุรกรรม</div>
                    <div>00.00 บาท</div>
                    <button className={TranSactions.delete}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                            <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
                            <path d="M9 12l6 0" />
                        </svg>
                    </button>
                </li>
                <li>
                    <time>17:14</time>
                    <div>รายการธุรกรรม</div>
                    <div>00.00 บาท</div>
                    <button className={TranSactions.delete}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                            <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
                            <path d="M9 12l6 0" />
                        </svg>
                    </button>
                </li>
            </ul>
        </section>
    )
}