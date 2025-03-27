"use client";
import React, { useState } from "react";
import {
  CALCULATOR_BUTTONS,
  CLOSE_BUTTON,
  CalculatorButtonType,
} from "./calculatorButton.constant";

// ค่า constant สำหรับปุ่มบนแป้นพิมพ์
type KeypadButtonProps = {
  label: string | React.ReactNode;
  className: string;
  onClick: () => void;
  colSpan?: number;
  tooltip?: string;
};

// สร้าง component สำหรับปุ่มเครื่องคิดเลข
const KeypadButton: React.FC<KeypadButtonProps> = ({
  label,
  className,
  onClick,
  colSpan,
  tooltip,
}) => (
  <button
    className={`p-4 text-xl font-medium text-white ${className} ${
      colSpan ? `col-span-${colSpan}` : ""
    } relative group`}
    onClick={onClick}
    title={tooltip} // HTML native tooltip
  >
    {label}
    {tooltip && (
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
        {tooltip}
      </div>
    )}
  </button>
);

const Calculator: React.FC = () => {
  const [calculation, setCalculation] = useState("");
  const [displayValue, setDisplayValue] = useState("0");
  const [previousValue, setPreviousValue] = useState<string | null>(null);
  const [currentOperator, setCurrentOperator] = useState<string | null>(null);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(true);
  const [isInputStarted, setIsInputStarted] = useState(false);

  // ตรวจสอบว่าค่าที่จะเพิ่มซ้ำกับตัวสุดท้ายหรือไม่
  const isRepeatingOperator = (value: string, current: string): boolean => {
    if (
      value === "+" ||
      value === "-" ||
      value === "*" ||
      value === "/" ||
      value === "÷" ||
      value === "×"
    ) {
      const lastChar = current.slice(-1);
      return (
        lastChar === "+" ||
        lastChar === "-" ||
        lastChar === "*" ||
        lastChar === "/" ||
        lastChar === "÷" ||
        lastChar === "×"
      );
    }
    return false;
  };

  const addToCalculation = (value: string) => {
    setCalculation((prevCalculation) => {
      // ป้องกันการซ้ำเครื่องหมาย
      if (isRepeatingOperator(value, prevCalculation)) {
        // ถ้าเป็นเครื่องหมายซ้ำ ให้แทนที่ตัวสุดท้าย
        return prevCalculation.slice(0, -1) + value;
      }
      const newCalculation = prevCalculation + value;
      return newCalculation;
    });

    // อัพเดทค่าที่แสดงบนหน้าจอ
    setDisplayValue((prevDisplay) => {
      if (
        prevDisplay === "0" &&
        value !== "." &&
        value !== "+" &&
        value !== "-" &&
        value !== "*" &&
        value !== "/" &&
        value !== "÷" &&
        value !== "×"
      ) {
        return value;
      } else {
        // ป้องกันการซ้ำเครื่องหมาย
        if (isRepeatingOperator(value, prevDisplay)) {
          // ถ้าเป็นเครื่องหมายซ้ำ ให้แทนที่ตัวสุดท้าย
          return prevDisplay.slice(0, -1) + value;
        }
        return prevDisplay + value;
      }
    });

    // เมื่อมีการเริ่มป้อนข้อมูล
    if (!isInputStarted) {
      setIsInputStarted(true);
    }
  };

  const calculateResult = () => {
    try {
      // ตรวจสอบว่ามีค่าที่จะคำนวณหรือไม่
      if (calculation.trim() === "") {
        setDisplayValue("0");
        return;
      }

      // ตรวจสอบกรณีที่ค่าที่แสดงเป็น Error อยู่แล้ว
      if (displayValue === "Error") {
        clearAll();
        return;
      }

      // ตรวจสอบว่าสิ้นสุดด้วยเครื่องหมายหรือไม่
      const lastChar = calculation.slice(-1);
      if (
        lastChar === "+" ||
        lastChar === "-" ||
        lastChar === "*" ||
        lastChar === "/" ||
        lastChar === "÷" ||
        lastChar === "×"
      ) {
        // ตัดเครื่องหมายสุดท้ายออก
        setCalculation(calculation.slice(0, -1));
        setDisplayValue(displayValue.slice(0, -1));
        return;
      }

      // แก้ไขการแปลงสัญลักษณ์เพื่อให้ JavaScript คำนวณได้ถูกต้อง
      let processedCalculation = calculation
        .replace(/÷/g, "/")
        .replace(/×/g, "*");

      // ทำการคำนวณโดยยึดตามลำดับการคำนวณทางคณิตศาสตร์ (PEMDAS)
      const calculationFunction = new Function(
        "return " + processedCalculation
      );
      const result = calculationFunction();

      // ตรวจสอบว่าผลลัพธ์เป็นตัวเลขที่ถูกต้องหรือไม่
      if (isNaN(result) || !isFinite(result)) {
        throw new Error("Invalid calculation");
      }

      // แปลงเป็น string และตัดทศนิยมที่ไม่จำเป็นออก
      const resultStr =
        typeof result === "number" && result % 1 === 0
          ? result.toString()
          : parseFloat(result.toFixed(10)).toString();

      // เก็บค่าผลลัพธ์เพื่อใช้ในการคำนวณครั้งต่อไป
      setPreviousValue(resultStr);
      setCalculation(resultStr);
      setDisplayValue(resultStr);

      // รีเซ็ตสถานะการเริ่มต้นป้อนข้อมูล
      setIsInputStarted(false);
    } catch (error) {
      console.error("Calculation error:", error);
      setCalculation("");
      setDisplayValue("Error");
      setIsInputStarted(false);
    }
  };

  // ล้างทั้งหมด (ปุ่ม AC)
  const clearAll = () => {
    setCalculation("");
    setDisplayValue("0");
    setPreviousValue(null);
    setCurrentOperator(null);
    setIsInputStarted(false);
  };

  // ฟังก์ชันใหม่สำหรับการลบตัวอักษรสุดท้าย (Backspace)
  const handleBackspace = () => {
    if (displayValue === "Error") {
      clearAll();
      return;
    }

    if (calculation.length > 0) {
      const newCalculation = calculation.slice(0, -1);
      setCalculation(newCalculation);

      // อัพเดทค่าที่แสดงบนหน้าจอ
      if (newCalculation.length === 0) {
        setDisplayValue("0");
        setIsInputStarted(false);
      } else {
        // พยายามแสดงผลที่ตรงกับการคำนวณ
        setDisplayValue(newCalculation);
      }
    }
  };

  // เพิ่มฟังก์ชันสำหรับตรวจสอบการกดปุ่มเมื่อแสดง Error
  const handleButtonClick = (action: () => void) => {
    // ถ้ามีการแสดง Error ให้ล้างค่าก่อน
    if (displayValue === "Error") {
      clearAll();
      return;
    }
    // ดำเนินการตามปกติ
    action();
  };

  const toggleSign = () => {
    try {
      if (calculation !== "") {
        const currentValue = parseFloat(calculation);
        const negatedValue = -currentValue;
        setCalculation(negatedValue.toString());
        setDisplayValue(negatedValue.toString());
      }
    } catch (error) {
      setCalculation("Error");
      setDisplayValue("Error");
    }
  };

  const calculatePercentage = () => {
    try {
      if (calculation !== "") {
        const value = parseFloat(calculation);
        const percentValue = value / 100;
        setCalculation(percentValue.toString());
        setDisplayValue(percentValue.toString());
      }
    } catch (error) {
      setCalculation("Error");
      setDisplayValue("Error");
    }
  };

  // ฟังก์ชันสำหรับปิดเครื่องคิดเลข
  const closeCalculator = () => {
    setIsCalculatorOpen(false);
  };

  // แปลง button data เป็น button configuration ที่มี onClick handler
  const calculatorButtons = CALCULATOR_BUTTONS.map(
    (button: CalculatorButtonType) => {
      // แทนที่ปุ่ม AC ด้วยปุ่ม Backspace เมื่อมีการเริ่มป้อนข้อมูล
      if (button.action === "allClear" && isInputStarted) {
        return {
          ...button,
          label: "⌫",
          action: "backspace",
          tooltip: "Backspace",
          onClick: handleBackspace,
        };
      }

      let onClick;
      switch (button.action) {
        case "number":
        case "operator":
          onClick = () =>
            handleButtonClick(() => addToCalculation(button.value || ""));
          break;
        case "clear": // ปุ่ม C ถูกเปลี่ยนเป็น +/- ใน constant
          onClick = () => handleButtonClick(toggleSign);
          break;
        case "allClear":
          onClick = clearAll;
          break;
        case "sign":
          onClick = () => handleButtonClick(toggleSign);
          break;
        case "percentage":
          onClick = () => handleButtonClick(calculatePercentage);
          break;
        case "equals":
          onClick = () => handleButtonClick(calculateResult);
          break;
        case "close":
          onClick = closeCalculator;
          break;
        default:
          onClick = () => {};
      }

      return {
        ...button,
        onClick,
      };
    }
  );

  // จัดกลุ่มปุ่มแบ่งตามแถว
  const rows = [
    calculatorButtons.slice(0, 4),
    calculatorButtons.slice(4, 8),
    calculatorButtons.slice(8, 12),
    calculatorButtons.slice(12, 16),
    calculatorButtons.slice(16, 19),
  ];

  // ถ้าเครื่องคิดเลขถูกปิด ไม่ต้องแสดงอะไรเลย
  if (!isCalculatorOpen) {
    return null;
  }

  return (
    <section className="bg-gray-800 overflow-hidden shadow-lg">
      <div className="flex items-center justify-between bg-[#52514f] py-4 px-2">
        <div className="flex space-x-2 py-1">
          {/* ปุ่มคำสั่งระบบ - ปุ่มแรกเป็นปุ่มปิด */}
          <div
            className={CLOSE_BUTTON.className}
            onClick={closeCalculator}
            title={CLOSE_BUTTON.tooltip}
          >
            {CLOSE_BUTTON.label}
          </div>
          <div className="w-3 h-3 rounded-full bg-[#febc2e]"></div>
          <div className="w-3 h-3 rounded-full bg-[#28c840]"></div>
        </div>
      </div>

      {/* หน้าจอแสดงผล */}
      <div className="bg-[#52514f] p-4 text-right">
        <div className="text-white text-4xl font-light">{displayValue}</div>
      </div>

      {/* แป้นพิมพ์เครื่องคิดเลขใช้ KeypadButton component และ constant */}
      <div className="grid grid-cols-4 gap-px">
        {rows.map((row, rowIndex) => (
          <React.Fragment key={`row-${rowIndex}`}>
            {row.map((button, buttonIndex) => (
              <KeypadButton
                key={`button-${rowIndex}-${buttonIndex}`}
                label={button.label}
                className={button.className}
                onClick={button.onClick}
                colSpan={button.colSpan}
                tooltip={button.tooltip}
              />
            ))}
          </React.Fragment>
        ))}
      </div>
    </section>
  );
};

export default Calculator;
