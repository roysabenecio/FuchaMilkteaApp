import Box from '@mui/material/Box';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js'
import { useGetCurrentYearMonthlySalesQuery } from '../sales-report/apiSlice';
import CircularProgress from '@mui/material/CircularProgress';

const LineGraph = ({ width, height, monthlySales}) => {

    // console.log(ms.map(x => x))

    const options = {
        responsive: true,
        scales: {
            x: {
                grid: {
                    display: false
                }
            },
            y: {
                grid: {
                    display: false
                }
            }
        },
    }

    // const data = 1

    ChartJS.register(
        CategoryScale,
        LinearScale,
        PointElement,
        LineElement,
        Title,
        Tooltip,
        Legend
    );

    //    const options = {
    //     responsive: true,
    //     plugins: {
    //       legend: {
    //         position: 'top' as const,
    //       },
    //       title: {
    //         display: true,
    //         text: 'Chart.js Line Chart',
    //       },
    //     },
    //   };

    // const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
    const labels = monthlySales.map(x => x.month)
    const d = monthlySales.map(x => x.totalSale)

    // console.log(Object.keys(ms[0]).map(x => x))

    const datas = {
        labels,
        datasets: [
            {
                label: "Sales (PHP)",
                data: d,
                borderColor: "green",
                // backgroundColor: 'rgba(53, 162, 235, 0.5)',
                tension: 0.5
            },
            // {
            //     label: 'Dataset 2',
            //     data: [7, 6, 3, 4, 5, 1, 2],
            //     borderColor: 'rgb(53, 162, 235)',
            //     backgroundColor: 'rgba(53, 162, 235, 0.5)',
            // },
        ],
        // datasets: [{
        //     label: "Sales (PHP)",
        //     data: filteredValues,
        //     borderColor: "green",
        //     tension: 0.5
        // }],
    };

    // if (labels === undefined) {
    //     return (<div><CircularProgress /></div>);
    // }

    return (
        <Box p={'2em'}>
            <Line
                data={datas}
                options={options}
            width={width}
            height={height}
            // responsive="true"
            />
        </Box>
    );
};

export default LineGraph;