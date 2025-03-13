"use client";
import ReportStyle from "@/app/assets/scss/report.module.scss";
import WalletHeader from "@/app/components/walletheader";
import "chart.js/auto";
import { ChartOptions } from "chart.js/auto";
import { format } from "date-fns";
import th from "date-fns/locale/th";
import { useCallback, useEffect, useState } from "react";
import { Doughnut, Line } from "react-chartjs-2";

interface Transaction {
  [key: string]: any;
  id: string;
  text: string;
  amount: number;
  type: string;
  date: string;
}

interface TransactionsData {
  [formattedDate: string]: Transaction;
}
interface UserData {
  userName: string;
  transactions: TransactionsData;
  formattedAmount: string;
  walletTotal: number;
}

const MyReports = () => {
  const [userData, setUserData] = useState<UserData>({
    userName: "",
    transactions: {},
    formattedAmount: "xx.xx",
    walletTotal: 0,
  });
  const [currentTransactions, setCurrentTransactions] = useState<Transaction[]>(
    []
  );
  const [walletTotal, setWalletTotal] = useState<number>(0);
  const [transactionsMonthTotal, setTransactionsMonthTotal] = useState<{
    [key: string]: number;
  }>({});
  const [transactionsMonthTotalArray, setTransactionsMonthTotalArray] =
    useState<{ [key: string]: string[] }>({});
  const [totalToday, setTotalToday] = useState<number>(0);
  const [monthsWithTransactions, setMonthsWithTransactions] = useState<
    string[]
  >([]);
  const [currentYear, setCurrentYear] = useState<string>("");
  const [walletSum, setWalletSum] = useState<number>(0);
  const [currentMonth, setCurrentMonth] = useState<string>("");
  const [last7DaysData, setLast7DaysData] = useState<string[][]>([]);
  const [graphData, setGraphData] = useState<any>({ labels: [], datasets: [] });
  const [isOpen, setIsOpen] = useState(false);
  const [yearlyAverage, setYearlyAverage] = useState(0);

  const showAmount = true;
  const currentDate = new Date().toLocaleDateString("th-TH");
  const toggleDropdown = useCallback(() => {
    setIsOpen((prevIsOpen) => !prevIsOpen);
  }, [setIsOpen]);

  const [last7DaysWalletData, setLast7DaysWalletData] = useState<string[][]>(
    []
  );
  const [walletsMonthTotal, setWalletsMonthTotal] = useState<{
    [key: string]: number;
  }>({});
  const [transactionSumLast7Days, setTransactionSumLast7Days] =
    useState<number>(0);
  const [totalWalletSumLast7Days, setTotalWalletSumLast7Days] =
    useState<number>(0);
  const [selectedMonthAverage, setSelectedMonthAverage] = useState<
    number | null
  >(null);
  const [dataDoughnut, setDataDoughnut] = useState({
    labels: ["ค่าใช้จ่ายรวม", "Wallet Total"],
    datasets: [
      {
        data: [0, 0],
        backgroundColor: ["#D9A04C", "#4E7F87"],
        hoverBackgroundColor: ["#D9A04C", "#4E7F87"],
      },
    ],
  });

  const generateDoughnutData = useCallback(
    (
      option: string,
      transactionSumLast7Days: number,
      totalWalletSumLast7Days: number
    ) => {
      let data: number[] = [];
      if (option === "7 วันล่าสุด") {
        data = [transactionSumLast7Days, Math.abs(totalWalletSumLast7Days)];
      } else if (option.startsWith("ปี")) {
        const year = option.split(" ")[1];
        if (walletsMonthTotal) {
          const monthsOfYear = Object.keys(transactionsMonthTotal).filter(
            (key) => key.includes(year)
          );
          const totalExpenseOfYear = monthsOfYear.reduce(
            (acc, curr) => acc + transactionsMonthTotal[curr],
            0
          );
          const totalWalletOfYear = monthsOfYear.reduce(
            (acc, curr) => acc + walletsMonthTotal[curr],
            0
          );
          data = [totalExpenseOfYear, totalWalletOfYear];
        }
      } else {
        const monthDataExpens =
          transactionsMonthTotal[`${currentYear}/${option}`];
        const monthDataWallet = walletsMonthTotal[`${currentYear}/${option}`];
        if (monthDataExpens && monthDataWallet) {
          data = [monthDataExpens, monthDataWallet];
        }
      }
      setDataDoughnut((prevData) => ({
        ...prevData,
        datasets: [
          {
            ...prevData.datasets[0],
            data,
          },
        ],
      }));
    },
    [transactionsMonthTotal, walletsMonthTotal, currentYear]
  );

  // useEffect(() => {
  //     console.log('dataDoughnut:', dataDoughnut);
  // }, [dataDoughnut]);

  useEffect(() => {
    const buddhistYear = new Date().getFullYear() + 543;
    const currentYear = buddhistYear.toString();
    const currentDate = `${new Date().getDate()}/${new Date().getMonth() + 1}/${
      new Date().getFullYear() + 543
    }`;
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsedUserData = JSON.parse(userData);
      setUserData(parsedUserData);
      if (parsedUserData && parsedUserData.transactions) {
        const transactionsForCurrentDate =
          parsedUserData.transactions?.[currentYear]?.[
            new Date().getMonth() + 1
          ]?.[currentDate]?.data;
        if (
          transactionsForCurrentDate &&
          Array.isArray(transactionsForCurrentDate)
        ) {
          const sortedTransactions = transactionsForCurrentDate
            .slice()
            .sort((a: Transaction, b: Transaction) => {
              const dateA = new Date(a.date).getTime();
              const dateB = new Date(b.date).getTime();
              return dateB - dateA;
            })
            .reverse();
          setCurrentTransactions(sortedTransactions);
        }
        const thaiMonthNames = [
          "มกราคม",
          "กุมภาพันธ์",
          "มีนาคม",
          "เมษายน",
          "พฤษภาคม",
          "มิถุนายน",
          "กรกฎาคม",
          "สิงหาคม",
          "กันยายน",
          "ตุลาคม",
          "พฤศจิกายน",
          "ธันวาคม",
        ];
        let transactionsMonthTotal: { [key: string]: number } = {};
        let last7DaysDataObject: { [key: string]: string[] } = {};
        let transactionsMonthTotalArray: { [key: string]: string[] } = {};
        let transactionsTotal = 0;
        let totalToday = 0;
        for (const year in parsedUserData?.transactions) {
          for (const month in parsedUserData.transactions[year]) {
            for (const date in parsedUserData.transactions[year][month]) {
              const transactionEntry =
                parsedUserData.transactions[year][month][date];
              if (
                transactionEntry?.totalToday !== undefined &&
                transactionEntry?.totalToday !== null
              ) {
                transactionsTotal += transactionEntry.totalToday;
                totalToday += transactionEntry.totalToday;
              }
              const [day, currentMonth, currentYear] = date.split("/");
              const currentMonthName =
                thaiMonthNames[parseInt(currentMonth) - 1];
              const currentMonthKey = `${year}/${currentMonthName}`;
              if (!transactionsMonthTotal[currentMonthKey]) {
                transactionsMonthTotal[currentMonthKey] = 0;
                last7DaysDataObject[currentMonthKey] = [];
                transactionsMonthTotalArray[currentMonthKey] = [];
              }
              transactionsMonthTotal[currentMonthKey] +=
                transactionEntry.totalToday;
              last7DaysDataObject[currentMonthKey].push(
                `${day} = ${transactionEntry.totalToday}`
              );
              transactionsMonthTotalArray[currentMonthKey].push(
                `${day} = ${transactionEntry.totalToday}`
              );
            }
          }
        }
        const last7DaysDataArray = Object.keys(last7DaysDataObject)
          .reduce((acc: string[][], month) => {
            const transactions = last7DaysDataObject[month];
            if (transactions.length > 7) {
              const slicedTransactions = transactions.slice(-7);
              const formattedTransactions = slicedTransactions.map(
                (transaction) => {
                  const [day, value] = transaction.split(" = ");
                  return [`${day}, ${parseInt(value)}`];
                }
              );
              return [...acc, ...formattedTransactions];
            } else {
              const formattedTransactions = transactions.map((transaction) => {
                const [day, value] = transaction.split(" = ");
                return [`${day}, ${parseInt(value)}`];
              });
              return [...acc, ...formattedTransactions];
            }
          }, [])
          .slice(-7);
        const transactionSumLast7Days = last7DaysDataArray.reduce(
          (sum, dayData) => {
            const [day, totalToday] = dayData[0].split(", ");
            return sum + parseInt(totalToday);
          },
          0
        );
        setLast7DaysData(last7DaysDataArray);
        setTransactionsMonthTotal(transactionsMonthTotal);
        setTransactionsMonthTotalArray(transactionsMonthTotalArray);
        setWalletTotal(walletSum + transactionsTotal);
        setTransactionSumLast7Days(transactionSumLast7Days);
      }
      if (parsedUserData && parsedUserData.wallet) {
        let walletsMonthTotal: { [key: string]: number } = {};
        let last7DaysWalletsObj: { [key: string]: string[] } = {};
        let totalWallets = 0;
        let walletSum = 0;
        const thaiMonthNames = [
          "มกราคม",
          "กุมภาพันธ์",
          "มีนาคม",
          "เมษายน",
          "พฤษภาคม",
          "มิถุนายน",
          "กรกฎาคม",
          "สิงหาคม",
          "กันยายน",
          "ตุลาคม",
          "พฤศจิกายน",
          "ธันวาคม",
        ];
        for (const year in parsedUserData?.wallet) {
          for (const month in parsedUserData.wallet[year]) {
            for (const date in parsedUserData.wallet[year][month]) {
              walletSum += parsedUserData.wallet[year][month][date].totalWallet;
              const walletEntry = parsedUserData.wallet[year][month][date];
              if (
                walletEntry?.totalWallet !== undefined &&
                walletEntry?.totalWallet !== null
              ) {
                totalWallets += walletEntry.totalWallet;
              }
              const [day, currentMonth, currentYear] = date.split("/");
              const currentMonthName =
                thaiMonthNames[parseInt(currentMonth) - 1];
              const currentMonthKey = `${year}/${currentMonthName}`;
              if (!walletsMonthTotal[currentMonthKey]) {
                walletsMonthTotal[currentMonthKey] = 0;
                last7DaysWalletsObj[currentMonthKey] = [];
              }
              walletsMonthTotal[currentMonthKey] += walletEntry.totalWallet;
              last7DaysWalletsObj[currentMonthKey].push(
                `${day} = ${walletEntry.totalWallet}`
              );
            }
          }
        }
        const walletLast7DaysDataArray = Object.keys(last7DaysWalletsObj)
          .reduce((acc: string[][], month) => {
            const transactions = last7DaysWalletsObj[month];
            const formattedTransactions = transactions.map((transaction) => {
              const [day, value] = transaction.split(" = ");
              return [`${parseInt(value)}`];
            });
            return [...acc, ...formattedTransactions];
          }, [])
          .slice(-7);
        const totalWalletSumLast7Days = walletLast7DaysDataArray.reduce(
          (sum, dayData) => {
            const totalwallet = parseInt(dayData[0]);
            return sum + totalwallet;
          },
          0
        );
        setWalletSum(walletSum);
        setLast7DaysWalletData(walletLast7DaysDataArray);
        setWalletsMonthTotal(walletsMonthTotal);
        setTotalWalletSumLast7Days(totalWalletSumLast7Days);
      }
      const totalTodayForCurrentDate =
        parsedUserData?.transactions?.[currentYear]?.[
          new Date().getMonth() + 1
        ]?.[currentDate]?.totalToday;
      if (
        totalTodayForCurrentDate !== undefined &&
        totalTodayForCurrentDate !== null
      ) {
        setTotalToday(totalTodayForCurrentDate);
      }
    }
  }, [currentDate, walletSum]);

  useEffect(() => {
    const currentDate = new Date();
    const currentMonthIndex = currentDate.getMonth();
    const months = [
      "มกราคม",
      "กุมภาพันธ์",
      "มีนาคม",
      "เมษายน",
      "พฤษภาคม",
      "มิถุนายน",
      "กรกฎาคม",
      "สิงหาคม",
      "กันยายน",
      "ตุลาคม",
      "พฤศจิกายน",
      "ธันวาคม",
    ];
    const currentMonthName = months[currentMonthIndex];
    setCurrentMonth(currentMonthName);
    const monthsWithTransactions = Object.keys(transactionsMonthTotalArray).map(
      (monthKey) => {
        return monthKey.split("/")[1];
      }
    );
    setMonthsWithTransactions(monthsWithTransactions);
  }, [transactionsMonthTotalArray, setCurrentMonth, setMonthsWithTransactions]);

  const generateGraphData = useCallback(
    (option: string) => {
      let labels: string[] = [];
      let datasetData: number[] = [];
      if (option === "7 วันล่าสุด") {
        labels = last7DaysData.map(
          (transaction) => transaction[0].split(", ")[0]
        );
        datasetData = last7DaysData.map((transaction) =>
          parseInt(transaction[0].split(", ")[1])
        );
      } else if (option.startsWith("ปี")) {
        const year = option.split(" ")[1];
        if (transactionsMonthTotal) {
          labels = Object.keys(transactionsMonthTotal).map(
            (month) => month.split("/")[1]
          );
          datasetData = Object.values(transactionsMonthTotal);
        }
      } else {
        const monthData =
          transactionsMonthTotalArray[`${currentYear}/${option}`];
        if (monthData) {
          labels = monthData.map((entry) => entry.split(" = ")[0]);
          datasetData = monthData.map((entry) =>
            parseInt(entry.split(" = ")[1])
          );
        }
      }
      const data = {
        labels: labels,
        datasets: [
          {
            label: "Data",
            data: datasetData,
            borderWidth: 1,
            pointStyle: "circle",
            pointRadius: 6,
            pointHoverRadius: 16,
            borderColor: "#ffeb3b",
            backgroundColor: "#D9A04C",
          },
        ],
      };
      return data;
    },
    [
      currentYear,
      last7DaysData,
      transactionsMonthTotal,
      transactionsMonthTotalArray,
    ]
  );

  const logButtonClick = (optionName: string) => {
    console.log(`Clicked: ${optionName}`);
  };

  const options: ChartOptions<"line"> = {
    scales: {
      x: {
        ticks: {
          color: "#F2E9D7",
        },
      },
      y: {
        ticks: {
          color: "#F2E9D7",
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          color: "#ffeb3b",
        },
      },
    },
  };

  const optionsDoughnut: ChartOptions<"doughnut"> = {
    plugins: {
      legend: {
        position: "top",
        align: "start",
        labels: {
          color: "#6c6a45",
        },
      },
    },
  };

  const calculateYearlyAverage = (
    transactionsMonthTotalArray: { [key: string]: string[] },
    transactionsMonthTotal: { [key: string]: number }
  ) => {
    let totalExpense = 0;
    let totalDays = 0;
    for (const monthKey in transactionsMonthTotalArray) {
      const monthData = transactionsMonthTotalArray[monthKey];
      const monthDays = monthData.length;
      totalDays += monthDays;
      const monthExpense = transactionsMonthTotal[monthKey];
      totalExpense += monthExpense;
    }
    if (totalDays > 0) {
      const yearlyAverage = totalExpense / totalDays;
      const roundedYearlyAverage = parseFloat(yearlyAverage.toFixed(2));
      return roundedYearlyAverage;
    }
    return 0;
  };

  useEffect(() => {
    const calculatedAverage = calculateYearlyAverage(
      transactionsMonthTotalArray,
      transactionsMonthTotal
    );
    setYearlyAverage(calculatedAverage);
  }, [transactionsMonthTotalArray, transactionsMonthTotal]);

  const calculateMonthlyAverages = (transactionsMonthTotalArray: {
    [key: string]: string[];
  }) => {
    const monthlyAverages: { [key: string]: number } = {};
    for (const monthKey in transactionsMonthTotalArray) {
      const monthData = transactionsMonthTotalArray[monthKey];
      const totalExpense = monthData.reduce((acc, curr) => {
        const [, value] = curr.split(" = ");
        return acc + parseInt(value);
      }, 0);
      const numberOfDays = monthData.length;
      const monthlyAverage =
        Math.round((totalExpense / numberOfDays) * 100) / 100;
      const monthName = monthKey.substring(5);
      monthlyAverages[monthName] = monthlyAverage;
    }
    return monthlyAverages;
  };

  const monthlyAverages = calculateMonthlyAverages(transactionsMonthTotalArray);

  const renderMonthButtons = () => {
    return monthsWithTransactions.map((monthName) => (
      <li
        key={monthName}
        className={currentMonth === monthName ? "text-white --active" : ""}
      >
        <button
          onClick={() => {
            handleOptionClick(monthName);
            console.log(`Clicked: ${monthName}`);
          }}
        >
          - {monthName}
        </button>
      </li>
    ));
  };

  const [selectedOption, setSelectedOption] = useState("7 วันล่าสุด");
  useEffect(() => {
    generateDoughnutData(
      selectedOption,
      transactionSumLast7Days,
      totalWalletSumLast7Days
    );
  }, [
    selectedOption,
    transactionSumLast7Days,
    totalWalletSumLast7Days,
    generateDoughnutData,
  ]);

  useEffect(() => {
    const newTransactionSumLast7Days = last7DaysData.reduce((sum, dayData) => {
      const [day, totalToday] = dayData[0].split(", ");
      return sum + parseInt(totalToday);
    }, 0);

    const newTotalWalletSumLast7Days = last7DaysWalletData.reduce(
      (sum, dayData) => {
        const totalwallet = parseInt(dayData[0]);
        return sum + totalwallet;
      },
      0
    );

    generateDoughnutData(
      selectedOption,
      newTransactionSumLast7Days,
      newTotalWalletSumLast7Days
    );
  }, [
    last7DaysData,
    last7DaysWalletData,
    selectedOption,
    generateDoughnutData,
  ]);

  useEffect(() => {
    const currentOption = selectedOption || "7 วันล่าสุด";
    const newGraphData = generateGraphData(currentOption);
    setGraphData(newGraphData);
  }, [selectedOption, setGraphData, generateGraphData]);

  const handleOptionClick = (option: string) => {
    setSelectedOption(option);
    if (option !== "7 วันล่าสุด") {
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear() + 543;
      setCurrentYear(currentYear.toString());
      setCurrentMonth(option);
      setSelectedMonthAverage(monthlyAverages[option]);
      generateDoughnutData(
        option,
        transactionSumLast7Days,
        totalWalletSumLast7Days
      );
    }
    toggleDropdown();
  };
  const handleBackHome = () => {
    window.location.href = "/";
  };

  return (
    <div className={ReportStyle.report}>
      <header className={ReportStyle.report__header}>
        <h1 className={ReportStyle.h1}>Reports</h1>
        <button
          className="absolute left-4 inline-flex p-2 bg-transparent rounded-full border border-yellow-400"
          onClick={handleBackHome}
        >
          <svg
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
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
        </button>
      </header>
      <div className={ReportStyle.report__container}>
        <div className={ReportStyle.report__container__profile}>
          <WalletHeader
            userName={userData.userName}
            formattedAmount={showAmount ? userData.formattedAmount : "xx.xx"}
            walletTotal={userData.walletTotal}
          />
        </div>

        <div className={ReportStyle.report__container__filter}>
          <div className={ReportStyle.report__container__filter__dropdown}>
            <button
              type="button"
              className={ReportStyle.report__container__filter__toggle}
              onClick={toggleDropdown}
            >
              <span>รายงาน: {selectedOption || "7 วันล่าสุด"}</span>
              <svg
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
                <line x1="4" y1="21" x2="4" y2="14"></line>
                <line x1="4" y1="10" x2="4" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12" y2="3"></line>
                <line x1="20" y1="21" x2="20" y2="16"></line>
                <line x1="20" y1="12" x2="20" y2="3"></line>
                <line x1="1" y1="14" x2="7" y2="14"></line>
                <line x1="9" y1="8" x2="15" y2="8"></line>
                <line x1="17" y1="16" x2="23" y2="16"></line>
              </svg>
            </button>
            {isOpen && (
              <ul className={ReportStyle.report__container__filter__list}>
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      handleOptionClick("7 วันล่าสุด");
                      logButtonClick("7 วันล่าสุด");
                    }}
                    className="text-white"
                  >
                    7 วันล่าสุด
                  </button>
                </li>
                <ol>
                  <li>รายเดือน</li>
                  {renderMonthButtons()}
                </ol>
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      handleOptionClick("ปี 2567");
                      logButtonClick("ปี 2567");
                    }}
                    className="text-white"
                  >
                    ปี 2567
                  </button>
                </li>
              </ul>
            )}
          </div>
        </div>

        <div className={ReportStyle.report__container__chart}>
          <Line data={graphData} options={options} />
        </div>
      </div>
      <div className={ReportStyle.report__summary}>
        <div className={ReportStyle.report__summary__left}>
          <Doughnut data={dataDoughnut} options={optionsDoughnut} />
        </div>
        <div className={ReportStyle.report__summary__right}>
          <h3 className={ReportStyle.report__summary__right_title}>
            <strong>ค่าเฉลี่ย</strong>
            <small>
              วัน{format(new Date(), "EEEE", { locale: th })},{currentDate}
            </small>
          </h3>
          <p className={ReportStyle.report__summary__right_desc}>
            วันนี้: <strong>{totalToday}฿</strong>
          </p>
          <p className={ReportStyle.report__summary__right_desc}>
            สัปดาห์:{" "}
            <strong>{Math.round(transactionSumLast7Days / 7)}฿/วัน</strong>
          </p>
          <p
            className={
              selectedOption !== "7 วันล่าสุด" && selectedOption !== "ปี 2567"
                ? ReportStyle.report__summary__right_desc
                : "hidden"
            }
          >
            {`${selectedOption}`} <strong>{selectedMonthAverage}฿/วัน</strong>
          </p>

          <p className={ReportStyle.report__summary__right_desc}>
            ปี: <strong>{yearlyAverage}฿/วัน</strong>
          </p>
        </div>
      </div>
    </div>
  );
};

export default MyReports;
