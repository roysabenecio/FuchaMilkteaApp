import Box from '@mui/material/Box';
import { Line } from 'react-chartjs-2';
import Chart from 'chart.js/auto'

const LineChart = ({ width, height, labels, legend, values, data }) => {
    // const data = {
    //     labels: labels,
    //     datasets: [{
    //         label: legend,
    //         data: values,
    //         borderColor: "green",
    //         tension: 0.5
    //     },
    //     ],
    // }

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

    return (
        <Box p={'2em'}>
            <Line
                data={data}
                options={options}
                width={width}
                height={height}
                responsive="true"

            />
        </Box>
    );
};

export default LineChart;
