// components/login.tsx
import React from 'react'
import FormLogin from '@/app/assets/scss/formlogin.module.scss';
import buttonStyle from '@/app/assets/scss/buttons.module.scss';

type Props = {}

export default function Login({}: Props) {
    return (
        <div className={FormLogin.form}>
            <h2 className={FormLogin.h2}>เข้าใช้งาน(Ver.Beta)</h2>
            <div className={FormLogin.form__container}>
                <div className={FormLogin.form__section}>
                    <input className={FormLogin.form__section__input} type="email" placeholder="Email" />
                </div>
                <div className={FormLogin.form__section}>
                    <input className={FormLogin.form__section__input} type="text" placeholder="Username" />
                </div>
                <div className={FormLogin.form__section}>
                    <input className={FormLogin.form__section__input} type="password" placeholder="Password" />
                </div>
            </div>
            <div className={FormLogin.form__footer}>
                <button className={`${buttonStyle.btn} ${buttonStyle.btn__cancel}`}>ยกเลิก</button>
                <button className={`${buttonStyle.btn} ${buttonStyle.btn__primary}`}><span>สมัครใช้งาน</span></button>
            </div>
        </div>
    )
}