import './css/assetstatus.css';
import ReactApexChart from 'react-apexcharts';
import { userStore } from '../../store';

const AssetStatus = () => {
  const { user } = userStore((state) => state);
  const donutData = {
    series: [user.memberassetAvailableAsset, user.memberassetStockAsset],
    options: {
      chart: {
        type: 'donut',
      },
      legend: {
        position: 'top',
        show: false,
      },
      responsive: [
        {
          breakpoint: 480,
          options: {},
        },
      ],
      grid: {
        padding: {
          bottom: -130,
        },
      },
      colors: ['#ccccff', '#ffccff'],
      labels: ['보유주식', '보유현금'],
      dataLabels: {
        enabled: false,
      },
      tooltip: {
        enabled: false,
      },
      plotOptions: {
        pie: {
          startAngle: -90,
          endAngle: 90,
          offsetY: 10,
          donut: {
            labels: {
              show: true,
              name: {
                show: true,
                fontSize: '22px',
                fontWeight: 600,
                fontFamily: 'D2coding',
                offsetY: -40,
              },
              total: {
                showAlways: true,
                show: true,
                label: '총 자산',
                fontSize: '16px',
                formatter: function (val) {
                  let asset =
                    user.memberassetTotalAsset.toLocaleString() + '원';
                  return asset;
                },
              },
              value: {
                offsetY: -30,
                fontSize: '16px',
                show: true,
              },
            },
          },
        },
      },
    },
  };

  return (
    <div className="asset-current">
      <div className="asset-nickname">
        <span style={{ fontWeight: 'bold' }}>{user.memberNickName}</span> 님의
        자산
      </div>
      <div className="asset-chart">
        <ReactApexChart
          type="donut"
          series={donutData.series}
          options={donutData.options}
        />
      </div>
      <hr id="lines" />
    </div>
  );
};

export default AssetStatus;
