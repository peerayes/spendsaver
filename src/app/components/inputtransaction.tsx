"use client";
import buttonStyle from "@/app/assets/scss/buttons.module.scss";
import InputTransactions from "@/app/assets/scss/inputtransaction.module.scss";
import React, { useCallback, useEffect, useRef, useState } from "react";
interface TransactionData {
  id: string;
  text: string;
  amount: number;
  type: "income" | "expense";
  date: string;
}

interface TransactionMonth {
  [key: string]: {
    data: TransactionData[];
    totalToday: number;
  };
}

interface Transactions {
  [key: string]: TransactionMonth;
}
type InputTransactionsProps = {
  username: string;
  handleClose: () => void;
};

const InputTranSactions: React.FC<InputTransactionsProps> = ({
  handleClose,
  username,
}) => {
  const [userName, setUsername] = useState("");
  const [text, setText] = useState("");
  const [amount, setAmount] = useState("");
  const [selectedOption, setSelectedOption] = useState<"income" | "expense">(
    "income"
  );
  const [isSaving, setIsSaving] = useState(false);
  const saveButtonRef = useRef<HTMLButtonElement>(null);
  const currentDate = new Date().toLocaleDateString("th-TH");
  const [calculation, setCalculation] = useState("");

  useEffect(() => {
    setSelectedOption("income");
    if (text && calculation) {
      setIsSaving(false);
    } else {
      setIsSaving(true);
    }
  }, [text, amount, calculation]);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    const user = userData ? JSON.parse(userData) : null;
    if (user && user.userName) {
      setUsername(user.userName);
    }
  }, []);

  const generateUniqueId = useCallback(() => {
    return "_" + Math.random().toString(36).substring(2, 9);
  }, []);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newTransaction = {
      id: generateUniqueId(),
      text: text,
      amount: parseFloat(calculation),
      type: selectedOption,
      date: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }),
    };
    const userData = localStorage.getItem("user");
    const user = userData ? JSON.parse(userData) : { transactions: {} };
    const currentDate = new Date();
    const buddhistYear = currentDate.getFullYear() + 543;
    const currentYear = buddhistYear.toString();
    const currentMonth = (currentDate.getMonth() + 1).toString();
    const currentDay = currentDate.getDate().toString();
    const key = `${currentDay}/${currentMonth}/${currentYear}`;
    const updatedTransactions: Transactions = {
      ...user.transactions,
      [currentYear]: {
        ...user.transactions?.[currentYear],
        [currentMonth]: {
          ...user.transactions?.[currentYear]?.[currentMonth],
          [key]: {
            data: [
              ...(user.transactions?.[currentYear]?.[currentMonth]?.[key]
                ?.data || []),
              newTransaction,
            ],
            totalToday:
              selectedOption === "income"
                ? (user.transactions?.[currentYear]?.[currentMonth]?.[key]
                    ?.totalToday || 0) + +calculation
                : (user.transactions?.[currentYear]?.[currentMonth]?.[key]
                    ?.totalToday || 0) - +calculation,
          },
        },
      },
    };
    console.log("Updated Transactions:", updatedTransactions);
    const updatedUser = {
      ...(user || {}),
      transactions: updatedTransactions,
    };

    localStorage.setItem("user", JSON.stringify(updatedUser));
    setIsSaving(true);
    console.log("user", user);
  };

  const handleClick = () => {
    const saveButton = saveButtonRef.current;
    if (saveButton) {
      saveButton.disabled = false;
      saveButton.classList.add(`${buttonStyle.btn__loading}`);
      saveButton.innerHTML = "<span>กำลังบันทึก</span>";
      setIsSaving(false);
      setTimeout(() => {
        saveButton.innerHTML = "<span>บันทึกสำเร็จ</span>";
        setTimeout(() => {
          setIsSaving(true);
          saveButton.classList.remove("loading");
          window.location.href = "/";
        }, 1500);
      }, 1500);
    }
  };
  const handleCancel = () => {
    handleClose();
  };
  const addToCalculation = (value: string) => {
    setCalculation((prevCalculation) => prevCalculation + value);
  };
  const calculateResult = () => {
    try {
      const result = eval(calculation);
      setCalculation(result.toString());
    } catch (error) {
      setCalculation("Error");
    }
  };
  const clearCalculation = () => {
    setCalculation("");
    setAmount("");
  };

  return (
    <section className={InputTransactions.section}>
      <header className={InputTransactions.section__header}>
        <h2 className="section__header__title">Add new transactions</h2>
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
              <div
                className={InputTransactions.inputsection__select__type}
                onClick={() => setSelectedOption("income")}
              >
                <label
                  className={
                    selectedOption === "income" ? InputTransactions.checked : ""
                  }
                >
                  <svg
                    style={{ pointerEvents: "none" }}
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="12" y1="18" x2="12" y2="12"></line>
                    <line x1="9" y1="15" x2="15" y2="15"></line>
                  </svg>
                  <input
                    type="radio"
                    name="income-expense"
                    value="income"
                    checked={selectedOption === "income"}
                    onChange={() => setSelectedOption("income")}
                    style={{
                      position: "absolute",
                      opacity: 0,
                      width: "100%",
                      height: "100%",
                      left: "87px",
                      top: "34px",
                      margin: 0,
                      cursor: "pointer",
                      zIndex: 50,
                    }}
                  />{" "}
                  Income
                </label>
              </div>
              <div
                className={InputTransactions.inputsection__select__type}
                onClick={() => setSelectedOption("expense")}
              >
                <label
                  className={
                    selectedOption === "expense"
                      ? InputTransactions.checked
                      : ""
                  }
                >
                  <svg
                    style={{ pointerEvents: "none" }}
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="9" y1="15" x2="15" y2="15"></line>
                  </svg>
                  <input
                    type="radio"
                    name="income-expense"
                    value="expense"
                    checked={selectedOption === "expense"}
                    onChange={() => setSelectedOption("expense")}
                    style={{
                      position: "absolute",
                      opacity: 0,
                      width: "100%",
                      height: "100%",
                      right: "36px",
                      top: "34px",
                      margin: 0,
                      cursor: "pointer",
                      zIndex: 50,
                    }}
                  />{" "}
                  Expense
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
              <span onClick={() => setText("")}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="#97958f"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </span>
            )}
          </div>
        </div>
        <div className={InputTransactions.inputsection__section}>
          <div className={InputTransactions.inputsection__section__container}>
            <input
              type="text"
              inputMode="numeric"
              pattern="^[0-9\+\-]*$"
              value={calculation}
              placeholder="จำนวนเงิน"
              onChange={(e) => setCalculation(e.target.value)}
              onKeyDown={(e) => {
                const allowedKeys = [
                  "+",
                  "-",
                  ".",
                  "Backspace",
                  "Delete",
                  "ArrowLeft",
                  "ArrowRight",
                ];
                const keyPressed = e.key;
                const isNumber = /^[0-9]$/.test(keyPressed);
                const isAllowedKey = allowedKeys.includes(keyPressed);
                const isModifierKey = ["Shift", "Control", "Alt"].includes(
                  keyPressed
                );
                if (!isNumber && !isAllowedKey && !isModifierKey) {
                  e.preventDefault();
                }
              }}
            />
            {calculation && (
              <span onClick={clearCalculation}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="#97958f"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </span>
            )}
          </div>
        </div>

        <footer className={InputTransactions.inputsection__section__footer}>
          <button
            type="button"
            className={`${buttonStyle.btn} ${buttonStyle.btn__backbefore}`}
            onClick={handleCancel}
          >
            Cancel
          </button>

          <button
            type="submit"
            className={`${buttonStyle.btn} ${buttonStyle.btn__primary}`}
            ref={saveButtonRef}
            onClick={handleClick}
            disabled={isSaving || !calculation}
          >
            <span>Add</span>
          </button>
        </footer>
      </form>

      <div className={InputTransactions.calculator}>
        <div className={InputTransactions.calculator__wrap}>
          <button
            type="button"
            className={InputTransactions.calculator__wrap__item}
            onClick={() => addToCalculation("1")}
          >
            1
          </button>
          <button
            type="button"
            className={InputTransactions.calculator__wrap__item}
            onClick={() => addToCalculation("2")}
          >
            2
          </button>
          <button
            type="button"
            className={InputTransactions.calculator__wrap__item}
            onClick={() => addToCalculation("3")}
          >
            3
          </button>
          <button
            type="button"
            className={InputTransactions.calculator__wrap__item}
            onClick={() => addToCalculation("+")}
          >
            +
          </button>
          <button
            type="button"
            className={InputTransactions.calculator__wrap__item}
            onClick={() => addToCalculation("4")}
          >
            4
          </button>
          <button
            type="button"
            className={InputTransactions.calculator__wrap__item}
            onClick={() => addToCalculation("5")}
          >
            5
          </button>
          <button
            type="button"
            className={InputTransactions.calculator__wrap__item}
            onClick={() => addToCalculation("6")}
          >
            6
          </button>
          <button
            type="button"
            className={InputTransactions.calculator__wrap__item}
            onClick={() => addToCalculation("-")}
          >
            -
          </button>
          <button
            type="button"
            className={InputTransactions.calculator__wrap__item}
            onClick={() => addToCalculation("7")}
          >
            7
          </button>
          <button
            type="button"
            className={InputTransactions.calculator__wrap__item}
            onClick={() => addToCalculation("8")}
          >
            8
          </button>
          <button
            type="button"
            className={InputTransactions.calculator__wrap__item}
            onClick={() => addToCalculation("9")}
          >
            9
          </button>
          <button
            type="button"
            className={InputTransactions.calculator__wrap__item}
            onClick={clearCalculation}
          >
            AC
          </button>
          <button
            type="button"
            className={InputTransactions.calculator__wrap__item}
            onClick={() => addToCalculation("0")}
          >
            0
          </button>
          <button
            type="button"
            className={InputTransactions.calculator__wrap__item}
            onClick={calculateResult}
          >
            =
          </button>
        </div>
      </div>
    </section>
  );
};

export default InputTranSactions;
