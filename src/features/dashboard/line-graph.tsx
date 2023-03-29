import Box from '@mui/material/Box';
import { Line } from 'react-chartjs-2';

const LineGraph = ({ width, height, data }) => {

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

export default LineGraph;