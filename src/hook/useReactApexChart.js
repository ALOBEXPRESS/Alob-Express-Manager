"use client";

import dynamic from "next/dynamic";
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

import { useTranslations } from "next-intl";

const useReactApexChart = () => {
  const t = useTranslations("dashboard");
  // --- Area Chart (Existing) ---
  let chartSeries = [
    {
      name: "This month",
      data: [10, 20, 12, 30, 14, 35, 16, 32, 14, 25, 13, 28],
    },
  ];

  let chartOptions = {
    chart: {
      height: 264,
      type: "area",
      toolbar: { show: false },
      zoom: { enabled: false },
      dropShadow: {
        enabled: false,
        top: 6,
        left: 0,
        blur: 4,
        color: "#000",
        opacity: 0.1,
      },
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        inverseColors: false,
        opacityFrom: 0,
        opacityTo: 0,
        stops: [0, 90, 100],
      },
    },
    dataLabels: { enabled: false },
    stroke: {
      curve: "smooth",
      colors: ["#487FFF"],
      width: 3,
    },
    markers: {
      size: 0,
      strokeWidth: 3,
      hover: { size: 8 },
    },
    tooltip: {
      enabled: true,
      x: { show: true },
      y: { show: false },
      z: { show: false },
    },
    grid: {
      row: {
        colors: ["transparent", "transparent"],
        opacity: 0.5,
      },
      borderColor: "#D1D5DB",
      strokeDashArray: 3,
    },
    yaxis: {
      labels: {
        formatter: function (value) {
          return "$" + value + "k";
        },
        style: { fontSize: "14px" },
      },
    },
    xaxis: {
      categories: [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
      ],
      labels: { style: { fontSize: "14px" } },
    },
  };

  // --- Helper to create simple Area Sparklines Options & Series ---
  const getAreaSparklineConfig = (color, height = 50, width = 100) => {
    const series = [{
      name: "Data",
      data: [10, 20, 15, 30, 25, 40, 35, 50]
    }];
    const options = {
      chart: {
        type: "area",
        height: height,
        sparkline: { enabled: true },
        toolbar: { show: false }
      },
      stroke: { curve: "smooth", width: 2, colors: [color] },
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.4,
          opacityTo: 0.1,
          stops: [0, 100]
        }
      },
      tooltip: { fixed: { enabled: false }, x: { show: false }, marker: { show: false } },
      colors: [color]
    };
    return { series, options };
  };

  // --- Helper to create simple Area Sparklines Component ---
  const createAreaSparkline = (color, height = 50, width = 100) => {
    const { series, options } = getAreaSparklineConfig(color, height, width);
    
    return (
      <ReactApexChart
        options={options}
        series={series}
        type="area"
        height={height}
        width={width}
      />
    );
  };

  // --- Helper Functions ---
  const createChart = (color) => createAreaSparkline(color, 50, 100);
  const createChartConfig = (color) => getAreaSparklineConfig(color, 50, 100);
  
  const createChartTwo = (color, height) => createAreaSparkline(color, height, "100%");
  const createChartTwoConfig = (color, height) => getAreaSparklineConfig(color, height, "100%");
  
  const createChartThree = (color) => createAreaSparkline(color, 60, 120);
  const createChartThreeConfig = (color) => getAreaSparklineConfig(color, 60, 120);
  
  const createChartFive = (color) => createAreaSparkline(color, 60, 100);
  const createChartFiveConfig = (color) => getAreaSparklineConfig(color, 60, 100);
  
  const createChartNine = (color = "#487fff") => createAreaSparkline(color, 40, 80);
  const createChartNineConfig = (color = "#487fff") => getAreaSparklineConfig(color, 40, 80);

  // --- Gauge / Radial ---
  const semiCircleGaugeSeriesOne = [75];
  const semiCircleGaugeOptionsOne = {
    chart: { type: "radialBar", sparkline: { enabled: true } },
    plotOptions: {
      radialBar: {
        startAngle: -90,
        endAngle: 90,
        track: { background: "#E5E7EB", strokeWidth: "97%", margin: 5 },
        dataLabels: {
          name: { show: false },
          value: { offsetY: -2, fontSize: "22px" }
        }
      }
    },
    colors: ["#487FFF"],
    labels: ["Conversion"]
  };

  const dailyIconBarChartSeriesOne = [{ name: "Income", data: [20, 40, 30, 50, 40, 60, 50] }];
  const dailyIconBarChartOptionsOne = {
    chart: { type: "bar", toolbar: { show: false }, sparkline: { enabled: true } },
    plotOptions: { bar: { columnWidth: "50%", borderRadius: 4 } },
    colors: ["#487FFF"],
    xaxis: { categories: ["M", "T", "W", "T", "F", "S", "S"] },
    tooltip: { enabled: false }
  };

  // --- Bar Chart (TotalSubscriberOne) ---
  const barChartSeries = [{ name: "Subscribers", data: [10, 20, 15, 25, 18, 30, 20] }];
  const barChartOptions = {
    chart: { type: "bar", height: 264, toolbar: { show: false } },
    colors: ["#487fff"],
    plotOptions: { bar: { borderRadius: 4, horizontal: false, columnWidth: "50%" } },
    dataLabels: { enabled: false },
    xaxis: { categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] }
  };

  // --- Donut Chart (BasicDonutChart) ---
  const basicDonutChartSeries = [12, 22, 12, 12, 7, 7];
  const basicDonutChartOptions = {
    labels: ["Label 1", "Label 2", "Label 3", "Label 4", "Label 5", "Label 6"],
    colors: ["#28a745", "#487fff", "#17a2b8", "#dc3545", "#fd7e14", "#ffc107"],
    legend: { show: false },
    plotOptions: {
      pie: {
        donut: {
          size: "65%",
          labels: {
            show: true,
            name: { show: false },
            value: {
              show: true,
              fontSize: "24px",
              fontWeight: 600,
              offsetY: 10,
              formatter: function (val) {
                return val;
              }
            },
            total: {
              show: true,
              fontSize: "16px",
              label: "Total Value",
              formatter: function (w) {
                return w.globals.seriesTotals.reduce((a, b) => a + b, 0);
              }
            }
          }
        }
      }
    },
    dataLabels: { enabled: false },
  };

  // --- Polar Area Chart (MultipleSeries) ---
  const multipleSeriesChartSeries = [14, 23, 21, 17, 15, 10, 12, 17, 21];
  const multipleSeriesChartOptions = {
    chart: { type: 'polarArea', height: 264, toolbar: { show: false } },
    stroke: { colors: ['#fff'] },
    fill: { opacity: 0.8 },
    labels: ['Vote A', 'Vote B', 'Vote C', 'Vote D', 'Vote E', 'Vote F', 'Vote G', 'Vote H', 'Vote I'],
    legend: { show: true, position: 'bottom' },
    colors: ['#487fff', '#28a745', '#ffcf5c', '#dc3545', '#6c757d', '#17a2b8', '#6610f2', '#e83e8c', '#fd7e14'],
    yaxis: { show: false },
    grid: { show: false, padding: { left: 0, right: 0 } },
    plotOptions: {
      polarArea: {
        rings: { strokeWidth: 0 },
        spokes: { strokeWidth: 0 }
      }
    }
  };

  // --- Column Chart (ColumnChartLayer) ---
  const columnChartSeriesOne = [{
    name: 'Net Profit',
    data: [44, 55, 57, 56, 61, 58, 63, 60, 66]
  }, {
    name: 'Revenue',
    data: [76, 85, 101, 98, 87, 105, 91, 114, 94]
  }, {
    name: 'Free Cash Flow',
    data: [35, 41, 36, 26, 45, 48, 52, 53, 41]
  }];
  const columnChartOptionsOne = {
    chart: { type: 'bar', height: 350, toolbar: { show: false } },
    plotOptions: {
      bar: { horizontal: false, columnWidth: '55%', endingShape: 'rounded' },
    },
    dataLabels: { enabled: false },
    stroke: { show: true, width: 2, colors: ['transparent'] },
    xaxis: {
      categories: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
    },
    yaxis: { title: { text: '$ (thousands)' } },
    fill: { opacity: 1 },
    tooltip: {
      y: {
        formatter: function (val) {
          return "$ " + val + " thousands"
        }
      }
    },
    colors: ['#487fff', '#28a745', '#ffcf5c']
  };

  const columnChartSeriesTwo = [{
    name: 'Inflation',
    data: [2.3, 3.1, 4.0, 10.1, 4.0, 3.6, 3.2, 2.3, 1.4, 0.8, 0.5, 0.2]
  }];
  const columnChartOptionsTwo = {
    chart: { type: 'bar', height: 350, toolbar: { show: false } },
    plotOptions: {
      bar: { borderRadius: 10, dataLabels: { position: 'top' } }
    },
    dataLabels: {
      enabled: true,
      formatter: function (val) {
        return val + "%";
      },
      offsetY: -20,
      style: { fontSize: '12px', colors: ["#304758"] }
    },
    xaxis: {
      categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      position: 'top',
      axisBorder: { show: false },
      axisTicks: { show: false },
      crosshairs: {
        fill: {
          type: 'gradient',
          gradient: {
            colorFrom: '#D8E3F0',
            colorTo: '#BED1E6',
            stops: [0, 100],
            opacityFrom: 0.4,
            opacityTo: 0.5,
          }
        }
      },
      tooltip: { enabled: true, }
    },
    yaxis: {
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: { show: false, formatter: function (val) { return val + "%"; } }
    },
    title: {
      text: 'Monthly Inflation in Argentina, 2002',
      floating: true,
      offsetY: 330,
      align: 'center',
      style: { color: '#444' }
    },
    colors: ['#487fff']
  };

  const columnChartSeriesThree = [{
    name: 'PRODUCT A',
    data: [44, 55, 41, 67, 22, 43]
  }, {
    name: 'PRODUCT B',
    data: [13, 23, 20, 8, 13, 27]
  }, {
    name: 'PRODUCT C',
    data: [11, 17, 15, 15, 21, 14]
  }, {
    name: 'PRODUCT D',
    data: [21, 7, 25, 13, 22, 8]
  }];
  const columnChartOptionsThree = {
    chart: { type: 'bar', height: 350, stacked: true, toolbar: { show: false }, zoom: { enabled: true } },
    responsive: [{
      breakpoint: 480,
      options: { legend: { position: 'bottom', offsetX: -10, offsetY: 0 } }
    }],
    plotOptions: { bar: { horizontal: false, borderRadius: 10 } },
    xaxis: {
      type: 'datetime',
      categories: ['01/01/2011 GMT', '01/02/2011 GMT', '01/03/2011 GMT', '01/04/2011 GMT', '01/05/2011 GMT', '01/06/2011 GMT'],
    },
    legend: { position: 'right', offsetY: 40 },
    fill: { opacity: 1 },
    colors: ['#487fff', '#28a745', '#ffcf5c', '#dc3545']
  };

  const columnChartSeriesFour = [{
    data: [21, 22, 10, 28, 16, 21, 13, 30]
  }];
  const columnChartOptionsFour = {
    chart: { height: 350, type: 'bar', events: { click: function (chart, w, e) { } }, toolbar: { show: false } },
    colors: ['#487fff', '#28a745', '#ffcf5c', '#dc3545', '#6c757d', '#17a2b8', '#6610f2', '#e83e8c'],
    plotOptions: {
      bar: { columnWidth: '45%', distributed: true, borderRadius: 8 }
    },
    dataLabels: { enabled: false },
    legend: { show: false },
    xaxis: {
      categories: [['John', 'Doe'], ['Joe', 'Smith'], ['Jake', 'Williams'], 'Amber', ['Peter', 'Brown'], ['Mary', 'Evans'], ['David', 'Wilson'], ['Lily', 'Roberts']],
      labels: { style: { colors: ['#487fff', '#28a745', '#ffcf5c', '#dc3545', '#6c757d', '#17a2b8', '#6610f2', '#e83e8c'], fontSize: '12px' } }
    }
  };

  // --- Pie Chart (PieChartLayer) ---
  const pieChartSeriesOne = [44, 55, 13, 43, 22];
  const pieChartOptionsTwo = {
    labels: ["Team A", "Team B", "Team C", "Team D", "Team E"],
    colors: ["#487fff", "#ffcf5c", "#28a745", "#dc3545", "#6c757d"],
    legend: { show: true, position: "bottom" }
  };

  const userOverviewDonutChartSeries = [44, 55, 41, 17];
  const userOverviewDonutChartOptions = {
    labels: ["Direct", "Social", "Referral", "Organic"],
    colors: ["#487fff", "#ffcf5c", "#28a745", "#dc3545"],
    legend: { show: true, position: "bottom" }
  };
  
  const userOverviewDonutChartSeriesOne = [30, 40, 30]; // Support Tracker
  const userOverviewDonutChartOptionsOne = {
      labels: ["Resolved", "Pending", "Open"],
      colors: ["#28a745", "#ffcf5c", "#dc3545"],
      legend: { show: false }
  };

  const userOverviewDonutChartSeriesTwo = [50, 20, 30]; // Overall Report
  const userOverviewDonutChartOptionsTwo = {
      labels: ["Sales", "Profit", "Growth"],
      colors: ["#487fff", "#ffcf5c", "#28a745"],
      legend: { show: false }
  };

  const statisticsDonutChartSeriesThree = [20, 50, 30]; // UserActivatesTwo
  const statisticsDonutChartOptionsThree = {
      labels: ["Active", "Inactive", "Banned"],
      colors: ["#28a745", "#6c757d", "#dc3545"],
      legend: { show: false }
  };

  const expenseStatisticsSeries = [44, 55, 13, 33];
  const expenseStatisticsOptions = {
      labels: ["Rent", "Utilities", "Salaries", "Supplies"],
      colors: ["#487fff", "#ffcf5c", "#28a745", "#dc3545"],
      legend: { show: true, position: 'bottom' }
  };

  // --- Double Line Chart (DoubleLineChart) ---
  const doubleLineChartSeries = [{
    name: 'High - 2013',
    data: [28, 29, 33, 36, 32, 32, 33]
  }, {
    name: 'Low - 2013',
    data: [12, 11, 14, 18, 17, 13, 13]
  }];
  const doubleLineChartOptions = {
    chart: { height: 350, type: 'line', dropShadow: { enabled: true, color: '#000', top: 18, left: 7, blur: 10, opacity: 0.2 }, toolbar: { show: false } },
    colors: ['#487fff', '#28a745'],
    dataLabels: { enabled: true },
    stroke: { curve: 'smooth' },
    title: { text: 'Average High & Low Temperature', align: 'left' },
    grid: { borderColor: '#e7e7e7', row: { colors: ['#f3f3f3', 'transparent'], opacity: 0.5 } },
    markers: { size: 1 },
    xaxis: { categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'], title: { text: 'Month' } },
    yaxis: { title: { text: 'Temperature' }, min: 5, max: 40 },
    legend: { position: 'top', horizontalAlign: 'right', floating: true, offsetY: -25, offsetX: -5 }
  };

  // --- Line Data Label (LineDataLabel) ---
  const lineDataLabelSeries = [{
    name: "Desktops",
    data: [10, 41, 35, 51, 49, 62, 69, 91, 148]
  }];
  const lineDataLabelOptions = {
    chart: { height: 350, type: 'line', zoom: { enabled: false }, toolbar: { show: false } },
    dataLabels: { enabled: false },
    stroke: { curve: 'straight' },
    title: { text: 'Product Trends by Month', align: 'left' },
    grid: { row: { colors: ['#f3f3f3', 'transparent'], opacity: 0.5 } },
    xaxis: { categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'] },
    colors: ['#487fff']
  };

  // --- Gradient Line Chart (GradientLineChart) ---
  const gradientLineChartSeries = [{
    name: 'Sales',
    data: [4, 3, 10, 9, 29, 19, 22, 9, 12, 7, 19, 5, 13, 9, 17, 2, 7, 5]
  }];
  const gradientLineChartOptions = {
    chart: { height: 350, type: 'line', toolbar: { show: false } },
    stroke: { width: 7, curve: 'smooth' },
    xaxis: { type: 'datetime', categories: ['1/11/2000', '2/11/2000', '3/11/2000', '4/11/2000', '5/11/2000', '6/11/2000', '7/11/2000', '8/11/2000', '9/11/2000', '10/11/2000', '11/11/2000', '12/11/2000', '1/11/2001', '2/11/2001', '3/11/2001', '4/11/2001', '5/11/2001', '6/11/2001'], tickAmount: 10, labels: { formatter: function (value, timestamp, opts) { return opts.dateFormatter(new Date(timestamp), 'dd MMM') } } },
    title: { text: 'Social Media', align: 'left', style: { fontSize: "16px", color: '#666' } },
    fill: { type: 'gradient', gradient: { shade: 'dark', gradientToColors: ['#FDD835'], shadeIntensity: 1, type: 'horizontal', opacityFrom: 1, opacityTo: 1, stops: [0, 100, 100, 100] } },
    markers: { size: 4, colors: ["#FFA41B"], strokeColors: "#fff", strokeWidth: 2, hover: { size: 7 } },
    yaxis: { min: -10, max: 40, title: { text: 'Engagement' } },
    colors: ['#487fff']
  };

  // --- Line Charts ---
  const defaultLineChartSeries = [{ name: "Desktops", data: [10, 41, 35, 51, 49, 62, 69, 91, 148] }];
  const defaultLineChartOptions = {
    chart: { type: "line", zoom: { enabled: false }, toolbar: { show: false } },
    dataLabels: { enabled: false },
    stroke: { curve: "straight" },
    grid: { row: { colors: ["#f3f3f3", "transparent"], opacity: 0.5 } }
  };

  const stepLineChartSeries = [{ data: [34, 44, 54, 21, 12, 43, 33, 23, 66, 66, 58] }];
  const stepLineChartOptions = {
    chart: { type: "line", toolbar: { show: false } },
    stroke: { curve: "stepline" },
    dataLabels: { enabled: false }
  };

  const transactionLineChartSeries = [{ name: "Transactions", data: [10, 20, 15, 30, 25, 40, 35, 50] }];
  const transactionLineChartOptions = {
    chart: { type: "line", toolbar: { show: false } },
    stroke: { curve: "smooth", width: 2 },
    colors: ["#487fff"]
  };

  const zoomAbleLineChartSeries = [{ name: "XYZ MOTORS", data: [10, 20, 15, 30, 25, 40, 35, 50] }];
  const zoomAbleLineChartOptions = {
      chart: { type: "area", stacked: false, height: 350, zoom: { type: "x", enabled: true, autoScaleYaxis: true }, toolbar: { autoSelected: "zoom" } },
      dataLabels: { enabled: false },
      markers: { size: 0 },
      fill: { type: "gradient", gradient: { shadeIntensity: 1, inverseColors: false, opacityFrom: 0.5, opacityTo: 0, stops: [0, 90, 100] } },
      yaxis: { labels: { formatter: function (val) { return (val / 1000000).toFixed(0); } } },
      xaxis: { type: "datetime", categories: ["2018-09-19T00:00:00.000Z", "2018-09-19T01:30:00.000Z", "2018-09-19T02:30:00.000Z", "2018-09-19T03:30:00.000Z", "2018-09-19T04:30:00.000Z", "2018-09-19T05:30:00.000Z", "2018-09-19T06:30:00.000Z"] },
      tooltip: { shared: false, y: { formatter: function (val) { return (val / 1000000).toFixed(0); } } }
  };

  // --- Radar Chart ---
  const radarChartSeries = [{ name: "Series 1", data: [80, 50, 30, 40, 100, 20] }];
  const radarChartOptions = {
    chart: { height: 350, type: "radar", toolbar: { show: false } },
    xaxis: { categories: ["January", "February", "March", "April", "May", "June"] }
  };

  // --- StatisticsOne ---
  const dailyIconBarChartSeriesTwo = [{ name: "Sales", data: [44, 55, 41, 67, 22, 43] }];
  const dailyIconBarChartOptionsTwo = {
    chart: { type: "bar", height: 350, toolbar: { show: false } },
    plotOptions: { bar: { horizontal: false, columnWidth: "55%", borderRadius: 4 } },
    dataLabels: { enabled: false },
    stroke: { show: true, width: 2, colors: ["transparent"] },
    xaxis: { categories: ["Feb", "Mar", "Apr", "May", "Jun", "Jul"] },
    fill: { opacity: 1 },
    tooltip: { y: { formatter: function (val) { return "$ " + val + " thousands"; } } }
  };

  // --- AverageDailySales ---
  const barChartSeriesOne = [{ name: "Sales", data: [10, 20, 15, 25, 18, 30, 20] }];
  const barChartOptionsOne = {
      chart: { type: "bar", height: 264, toolbar: { show: false } },
      colors: ["#28a745"],
      plotOptions: { bar: { borderRadius: 4, horizontal: false, columnWidth: "50%" } },
      dataLabels: { enabled: false },
      xaxis: { categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] }
  };

  const paymentStatusChartSeries = [{
    name: "Payment Status",
    data: [10, 20, 15, 30, 25, 40, 35, 50, 45, 60, 55, 70]
  }];
  const paymentStatusChartOptions = {
    chart: { type: "bar", height: 250, toolbar: { show: false } },
    colors: ["#487fff"],
    plotOptions: { bar: { borderRadius: 4, columnWidth: "50%" } },
    dataLabels: { enabled: false },
    xaxis: { categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] }
  };

  // --- CandleStick Chart (CoinAnalyticsOne) ---
  const candleStickChartSeries = [{
    data: [
      { x: new Date(1538778600000), y: [6629.81, 6650.5, 6623.04, 6633.33] },
      { x: new Date(1538780400000), y: [6632.01, 6643.59, 6620, 6630.11] },
      { x: new Date(1538782200000), y: [6630.71, 6648.95, 6623.34, 6635.65] },
      { x: new Date(1538784000000), y: [6635.65, 6651, 6629.67, 6638.24] },
      { x: new Date(1538785800000), y: [6638.24, 6640, 6620, 6624.47] },
      { x: new Date(1538787600000), y: [6624.53, 6636.03, 6621.68, 6624.31] },
      { x: new Date(1538789400000), y: [6624.61, 6632.2, 6617, 6626.02] },
      { x: new Date(1538791200000), y: [6627, 6627.62, 6584.22, 6603.02] },
      { x: new Date(1538793000000), y: [6605, 6608.03, 6598.95, 6604.01] },
      { x: new Date(1538794800000), y: [6604.5, 6614.4, 6602.26, 6608.02] }
    ]
  }];
  const candleStickChartOptions = {
    chart: { type: "candlestick", height: 350, toolbar: { show: false } },
    xaxis: { type: "datetime" },
    yaxis: { tooltip: { enabled: true } }
  };

  // --- Helper for StatisticsOne ---
  const createChartEight = (color) => createAreaSparkline(color, 80, 160);
  const createChartEightConfig = (color) => getAreaSparklineConfig(color, 80, 160);
  
  // --- Helper for CoinAnalyticsTwo ---
  const createChartFour = (color, height, width) => createAreaSparkline(color, height, width);
  const createChartFourConfig = (color, height, width) => getAreaSparklineConfig(color, height, width);

  // --- Helper for UnitCountFive ---
  const createChartSixConfig = (color1, color2) => {
    const series = [
      { name: "Paid", data: [10, 20, 15, 30, 25, 40, 35, 50] },
      { name: "Free", data: [5, 15, 10, 25, 20, 35, 30, 45] }
    ];
    const options = {
      chart: { type: "area", height: 264, toolbar: { show: false } },
      colors: [color1, color2],
      fill: { type: "gradient", gradient: { shadeIntensity: 1, opacityFrom: 0.4, opacityTo: 0.1, stops: [0, 100] } },
      dataLabels: { enabled: false },
      stroke: { curve: "smooth", width: 2 },
      xaxis: { categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"], labels: { show: false }, axisBorder: { show: false }, axisTicks: { show: false } },
      yaxis: { show: false },
      grid: { show: false, padding: { left: 0, right: 0 } },
      tooltip: { x: { show: false } },
      legend: { show: false }
    };
    return { series, options };
  };

  const createChartSix = (color1, color2) => {
    const { series, options } = createChartSixConfig(color1, color2);
    return <ReactApexChart options={options} series={series} type="area" height={264} />;
  };

  // --- Helper for ETHPriceOne ---
  const createChartSeven = (color) => createAreaSparkline(color, 80, 160);
  const createChartSevenConfig = (color) => getAreaSparklineConfig(color, 80, 160);

  // --- Helper for Metrics ---
  const createChartTen = (color) => createAreaSparkline(color, 50, 80);
  const createChartTenConfig = (color) => getAreaSparklineConfig(color, 50, 80);
  const createChatEleven = (color) => createAreaSparkline(color, 50, 80); // Note spelling match with component
  const createChatElevenConfig = (color) => getAreaSparklineConfig(color, 50, 80);

  // --- Payment Status Chart One (CourseActivityOne) ---
  const paymentStatusChartSeriesOne = [{
    name: "Course Activity",
    data: [500, 300]
  }];
  const paymentStatusChartOptionsOne = {
    chart: { type: "bar", height: 250, toolbar: { show: false } },
    colors: ["#ffcf5c", "#28a745"],
    plotOptions: { bar: { distributed: true, borderRadius: 4, columnWidth: "50%" } },
    dataLabels: { enabled: false },
    xaxis: { categories: ["Paid", "Free"] },
    legend: { show: false }
  };

  // --- Bar Chart Two (EarningStaticOne) ---
  const barChartSeriesTwo = [{
    name: "Earnings",
    data: [20, 30, 25, 40, 35, 50, 45]
  }];
  const barChartOptionsTwo = {
    chart: { type: "bar", height: 350, toolbar: { show: false } },
    colors: ["#487fff"],
    plotOptions: { bar: { borderRadius: 4, columnWidth: "50%" } },
    dataLabels: { enabled: false },
    xaxis: { categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] }
  };

  // --- Payment Status Chart Two (ClientPaymentOne) ---
  const paymentStatusChartSeriesTwo = [{
    name: "Payment Status",
    data: [500, 500, 1500]
  }];
  const paymentStatusChartOptionsTwo = {
    chart: { type: "bar", height: 350, toolbar: { show: false } },
    colors: ["#28a745", "#487fff", "#ffcf5c"],
    plotOptions: { bar: { distributed: true, borderRadius: 4, columnWidth: "50%" } },
    dataLabels: { enabled: false },
    xaxis: { categories: ["Paid", "Pending", "Overdue"] },
    legend: { show: false }
  };

  // --- Donut Chart Two (CampaignStaticOne) ---
  const donutChartSeriesTwo = [44, 55, 41, 17];
  const donutChartOptionsTwo = {
    labels: ["Email", "Referral", "Social", "Organic"],
    colors: ["#487fff", "#ffcf5c", "#28a745", "#dc3545"],
    legend: { show: false }
  };

  // --- Up Down Bar Chart (RevenueStatisticsOne) ---
  const upDownBarChartSeries = [{
    name: 'Cash Flow',
    data: [1.45, 5.42, 5.9, -0.42, -12.6, -18.1, -18.2, -14.16, -11.1, -6.09, 0.34, 3.88, 13.07,
      5.8, 2, 7.37, 8.1, 13.57, 15.75, 17.1, 19.8, -27.03, -54.4, -47.2, -43.3, -18.6, -
      48.6, -41.1, -39.6, -37.6, -29.4, -21.4, -2.4
    ]
  }];
  const upDownBarChartOptions = {
    chart: { type: 'bar', height: 350, toolbar: { show: false } },
    plotOptions: {
      bar: {
        colors: {
          ranges: [{ from: -100, to: -46, color: '#dc3545' }, { from: -45, to: 0, color: '#dc3545' }]
        },
        columnWidth: '80%',
      }
    },
    dataLabels: { enabled: false },
    yaxis: {
      labels: {
        formatter: function (y) { return y.toFixed(0) + "%"; }
      }
    },
    xaxis: {
      categories: [
        '2011-01-01', '2011-02-01', '2011-03-01', '2011-04-01', '2011-05-01', '2011-06-01',
        '2011-07-01', '2011-08-01', '2011-09-01', '2011-10-01', '2011-11-01', '2011-12-01',
        '2012-01-01', '2012-02-01', '2012-03-01', '2012-04-01', '2012-05-01', '2012-06-01',
        '2012-07-01', '2012-08-01', '2012-09-01', '2012-10-01', '2012-11-01', '2012-12-01',
        '2013-01-01', '2013-02-01', '2013-03-01', '2013-04-01', '2013-05-01', '2013-06-01',
        '2013-07-01', '2013-08-01', '2013-09-01'
      ],
      labels: { rotate: -90 }
    }
  };

  // --- Balance Statistic ---
  const balanceStatisticsSeries = [{
    name: 'Balance',
    data: [44, 55, 41, 67, 22, 43, 21, 33, 45, 31, 87, 65]
  }];
  const balanceStatisticsOptions = {
    chart: { type: 'bar', height: 250, toolbar: { show: false } },
    plotOptions: { bar: { borderRadius: 4, horizontal: false, columnWidth: '55%' } },
    dataLabels: { enabled: false },
    stroke: { show: true, width: 2, colors: ['transparent'] },
    xaxis: { categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] },
    fill: { opacity: 1 },
    colors: ['#487fff'],
    tooltip: { y: { formatter: function (val) { return "$ " + val + " thousands" } } }
  };

  // --- Revenue Report One (PaymentStatusChartThree) ---
  const paymentStatusChartSeriesThree = [{
    name: 'Earning',
    data: [44, 55, 57, 56, 61, 58, 63, 60, 66]
  }, {
    name: 'Expense',
    data: [76, 85, 101, 98, 87, 105, 91, 114, 94]
  }];
  const paymentStatusChartOptionsThree = {
    chart: { type: 'bar', height: 250, toolbar: { show: false } },
    plotOptions: { bar: { horizontal: false, columnWidth: '55%', borderRadius: 5 } },
    dataLabels: { enabled: false },
    stroke: { show: true, width: 2, colors: ['transparent'] },
    xaxis: { categories: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'] },
    yaxis: { title: { text: '$ (thousands)' } },
    fill: { opacity: 1 },
    colors: ['#487fff', '#ffcf5c'],
    tooltip: { y: { formatter: function (val) { return "$ " + val + " thousands" } } }
  };

  // --- Revenue Statistic One ---
  const revenueChartSeriesOne = [{
    name: 'Profit',
    data: [31, 40, 28, 51, 42, 109, 100]
  }, {
    name: 'Loss',
    data: [11, 32, 45, 32, 34, 52, 41]
  }];
  const revenueChartOptionsOne = {
    chart: { height: 150, type: 'area', toolbar: { show: false }, sparkline: { enabled: true } },
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth', width: 2 },
    xaxis: { type: 'datetime', categories: ["2018-09-19T00:00:00.000Z", "2018-09-19T01:30:00.000Z", "2018-09-19T02:30:00.000Z", "2018-09-19T03:30:00.000Z", "2018-09-19T04:30:00.000Z", "2018-09-19T05:30:00.000Z", "2018-09-19T06:30:00.000Z"] },
    tooltip: { x: { format: 'dd/MM/yy HH:mm' } },
    colors: ['#487fff', '#dc3545'],
    fill: { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.4, opacityTo: 0.1, stops: [0, 100] } }
  };

  // --- Income Vs Expense ---
  const incomeExpenseSeries = [{
    name: 'Income',
    data: [31, 40, 28, 51, 42, 109, 100]
  }, {
    name: 'Expense',
    data: [11, 32, 45, 32, 34, 52, 41]
  }];
  const incomeExpenseOptions = {
    chart: { height: 270, type: 'area', toolbar: { show: false } },
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth' },
    xaxis: { type: 'datetime', categories: ["2018-09-19T00:00:00.000Z", "2018-09-19T01:30:00.000Z", "2018-09-19T02:30:00.000Z", "2018-09-19T03:30:00.000Z", "2018-09-19T04:30:00.000Z", "2018-09-19T05:30:00.000Z", "2018-09-19T06:30:00.000Z"] },
    tooltip: { x: { format: 'dd/MM/yy HH:mm' } },
    colors: ['#487fff', '#ffcf5c'],
    fill: { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.4, opacityTo: 0.1, stops: [0, 100] } }
  };

  // --- Purchase and Sales ---
  const purchaseSaleChartSeries = [{
    name: 'Purchase',
    data: [12, 22, 12, 12, 7, 7, 12, 22]
  }, {
    name: 'Sales',
    data: [22, 12, 22, 22, 12, 12, 22, 12]
  }];
  const purchaseSaleChartOptions = {
    chart: { type: 'bar', height: 300, toolbar: { show: false } },
    plotOptions: { bar: { horizontal: false, columnWidth: '50%', borderRadius: 4 } },
    dataLabels: { enabled: false },
    stroke: { show: true, width: 2, colors: ['transparent'] },
    xaxis: { categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'] },
    fill: { opacity: 1 },
    colors: ['#487fff', '#ffcf5c'],
    tooltip: { y: { formatter: function (val) { return "$ " + val + " thousands" } } }
  };

  // --- Customers Statistics One ---
  const statisticsDonutChartSeries = [20000, 25000];
  const statisticsDonutChartOptions = {
    labels: ["Male", "Female"],
    colors: ["#487fff", "#ffcf5c"],
    legend: { show: false },
    plotOptions: {
      pie: {
        donut: {
          size: "65%",
          labels: {
            show: true,
            total: {
              show: true,
              label: 'Customers',
              fontSize: '16px',
              formatter: () => '45k'
            }
          }
        }
      }
    },
    dataLabels: { enabled: false }
  };

  // --- Added for missing charts ---
  const enrollmentChartSeries = chartSeries;
  const enrollmentChartOptions = chartOptions;

  const radialMultipleBarSeries = [80, 40, 10];
  const radialMultipleBarOptions = {
    chart: { type: "radialBar", height: 300 },
    plotOptions: {
      radialBar: {
        hollow: { size: '50%' },
        dataLabels: {
          name: { show: false },
          value: { show: false }
        }
      }
    },
    colors: ["#487FFF", "#FF9F43", "#28C76F"],
    labels: ["Cardiology", "Psychiatry", "Pediatrics"]
  };

  const paymentStatusChartSeriesFour = barChartSeries;
  const paymentStatusChartOptionsFour = barChartOptions;

  const statisticsDonutChartSeriesTwo = basicDonutChartSeries;
  const statisticsDonutChartOptionsTwo = basicDonutChartOptions;

  return {
    chartOptions,
    chartSeries,
    timeSeriesChartOptions: chartOptions,
    timeSeriesChartSeries: chartSeries,
    createChart,
    createChartConfig,
    createChartTwo,
    createChartTwoConfig,
    createChartThree,
    createChartThreeConfig,
    createChartFour,
    createChartFourConfig,
    createChartFive,
    createChartFiveConfig,
    createChartSix,
    createChartSixConfig,
    createChartSeven,
    createChartSevenConfig,
    createChartNine,
    createChartNineConfig,
    createChartEight,
    createChartEightConfig,
    createChartTen,
    createChartTenConfig,
    createChatEleven,
    createChatElevenConfig,
    semiCircleGaugeSeriesOne,
    semiCircleGaugeOptionsOne,
    dailyIconBarChartSeriesOne,
    dailyIconBarChartOptionsOne,
    barChartSeries,
    barChartOptions,
    barChartSeriesTwo,
    barChartOptionsTwo,
    basicDonutChartSeries,
    basicDonutChartOptions,
    multipleSeriesChartSeries,
    multipleSeriesChartOptions,
    pieChartSeriesOne,
    pieChartOptionsTwo,
    userOverviewDonutChartSeries,
    userOverviewDonutChartOptions,
    userOverviewDonutChartSeriesOne,
    userOverviewDonutChartOptionsOne,
    userOverviewDonutChartSeriesTwo,
    userOverviewDonutChartOptionsTwo,
    statisticsDonutChartSeriesThree,
    statisticsDonutChartOptionsThree,
    expenseStatisticsSeries,
    expenseStatisticsOptions,
    defaultLineChartSeries,
    defaultLineChartOptions,
    stepLineChartSeries,
    stepLineChartOptions,
    transactionLineChartSeries,
    transactionLineChartOptions,
    zoomAbleLineChartSeries,
    zoomAbleLineChartOptions,
    doubleLineChartSeries,
    doubleLineChartOptions,
    lineDataLabelSeries,
    lineDataLabelOptions,
    gradientLineChartSeries,
    gradientLineChartOptions,
    radarChartSeries,
    radarChartOptions,
    dailyIconBarChartSeriesTwo,
    dailyIconBarChartOptionsTwo,
    columnChartSeriesOne,
    columnChartOptionsOne,
    columnChartSeriesTwo,
    columnChartOptionsTwo,
    columnChartSeriesThree,
    columnChartOptionsThree,
    columnChartSeriesFour,
    columnChartOptionsFour,
    barChartSeriesOne,
    barChartOptionsOne,
    donutChartSeries: userOverviewDonutChartSeries,
    donutChartOptions: userOverviewDonutChartOptions,
    paymentStatusChartSeries,
    paymentStatusChartOptions,
    paymentStatusChartSeriesOne,
    paymentStatusChartOptionsOne,
    candleStickChartSeries,
    candleStickChartOptions,
    paymentStatusChartSeriesTwo,
    paymentStatusChartOptionsTwo,
    donutChartSeriesTwo,
    donutChartOptionsTwo,
    upDownBarChartSeries,
    upDownBarChartOptions,
    balanceStatisticsSeries,
    balanceStatisticsOptions,
    paymentStatusChartSeriesThree,
    paymentStatusChartOptionsThree,
    revenueChartSeriesOne,
    revenueChartOptionsOne,
    incomeExpenseSeries,
    incomeExpenseOptions,
    purchaseSaleChartSeries,
    purchaseSaleChartOptions,
    statisticsDonutChartSeries,
    statisticsDonutChartOptions,
    enrollmentChartSeries,
    enrollmentChartOptions,
    radialMultipleBarSeries,
    radialMultipleBarOptions,
    paymentStatusChartSeriesFour,
    paymentStatusChartOptionsFour,
    statisticsDonutChartSeriesTwo,
    statisticsDonutChartOptionsTwo
  };
};

export default useReactApexChart;
