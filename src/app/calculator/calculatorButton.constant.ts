export type CalculatorButtonType = {
  label: string;
  className: string;
  action:
    | "number"
    | "operator"
    | "clear"
    | "allClear"
    | "sign"
    | "percentage"
    | "equals"
    | "close"
    | "backspace"; // เพิ่ม action ใหม่
  value?: string;
  colSpan?: number;
  tooltip?: string;
};

export const CALCULATOR_BUTTONS: CalculatorButtonType[] = [
  // แถวที่ 1
  {
    label: "AC",
    className: "bg-gray-500 hover:bg-gray-600 active:bg-gray-700",
    action: "allClear",
    tooltip: "Clear all",
  },
  {
    label: "+/-",
    className: "bg-gray-500 hover:bg-gray-600 active:bg-gray-700",
    action: "sign",
    tooltip: "Toggle sign",
  },
  {
    label: "%",
    className: "bg-gray-500 hover:bg-gray-600 active:bg-gray-700",
    action: "percentage",
  },
  {
    label: "÷",
    className: "bg-[#fea00a] hover:bg-orange-600 active:bg-orange-700",
    action: "operator",
    value: "/",
    tooltip: "Divide",
  },

  // แถวที่ 2
  {
    label: "7",
    className: "bg-gray-500 hover:bg-gray-600 active:bg-gray-700",
    action: "number",
    value: "7",
  },
  {
    label: "8",
    className: "bg-gray-500 hover:bg-gray-600 active:bg-gray-700",
    action: "number",
    value: "8",
  },
  {
    label: "9",
    className: "bg-gray-500 hover:bg-gray-600 active:bg-gray-700",
    action: "number",
    value: "9",
  },
  {
    label: "×",
    className: "bg-[#fea00a] hover:bg-orange-600 active:bg-orange-700",
    action: "operator",
    value: "*",
    tooltip: "Multiply",
  },

  // แถวที่ 3
  {
    label: "4",
    className: "bg-gray-500 hover:bg-gray-600 active:bg-gray-700",
    action: "number",
    value: "4",
  },
  {
    label: "5",
    className: "bg-gray-500 hover:bg-gray-600 active:bg-gray-700",
    action: "number",
    value: "5",
  },
  {
    label: "6",
    className: "bg-gray-500 hover:bg-gray-600 active:bg-gray-700",
    action: "number",
    value: "6",
  },
  {
    label: "−",
    className: "bg-[#fea00a] hover:bg-orange-600 active:bg-orange-700",
    action: "operator",
    value: "-",
    tooltip: "Subtract",
  },

  // แถวที่ 4
  {
    label: "1",
    className: "bg-gray-500 hover:bg-gray-600 active:bg-gray-700",
    action: "number",
    value: "1",
  },
  {
    label: "2",
    className: "bg-gray-500 hover:bg-gray-600 active:bg-gray-700",
    action: "number",
    value: "2",
  },
  {
    label: "3",
    className: "bg-gray-500 hover:bg-gray-600 active:bg-gray-700",
    action: "number",
    value: "3",
  },
  {
    label: "+",
    className: "bg-[#fea00a] hover:bg-orange-600 active:bg-orange-700",
    action: "operator",
    value: "+",
    tooltip: "Add",
  },

  // แถวที่ 5
  {
    label: "0",
    className: "bg-gray-500 hover:bg-gray-600 active:bg-gray-700",
    action: "number",
    value: "0",
    colSpan: 2,
  },
  {
    label: ".",
    className: "bg-gray-500 hover:bg-gray-600 active:bg-gray-700",
    action: "number",
    value: ".",
  },
  {
    label: "=",
    className: "bg-[#fea00a] hover:bg-orange-600 active:bg-orange-700",
    action: "equals",
  },
];

// ปุ่มปิดเครื่องคิดเลข (X)
export const CLOSE_BUTTON: CalculatorButtonType = {
  label: "X",
  className:
    "bg-[#ff5f57] hover:bg-red-600 active:bg-red-700 rounded-full w-3 h-3 flex items-center justify-center text-xs",
  action: "close",
  tooltip: "Close calculator",
};
