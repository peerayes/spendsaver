// app/page.tsx
"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import UsersPage from '@/app/users/page';


type Props = {};

const IndexPage = () => {
  const isLoggedIn = true; // ตรวจสอบว่าผู้ใช้อยู่ในสถานะล็อกอินหรือไม่

  return (
    <div>
      {isLoggedIn && <UsersPage />}
    </div>
  );
};

export default IndexPage;