import { Doughnut } from 'react-chartjs-2';

const DonutChart = ({legends, values, data }) => {
    const options = {
        responsive: true,
        scales: {
            x: {
                grid: {
                    display: false,
                    drawBorder: false
                },
                ticks: {
                    display: false
                }
            },
            y: {
                grid: {
                    display: false,
                    drawBorder: false
                }
                ,
                ticks: {
                    display: false
                }
            }
        },
        
    }

    return (
        <div>
            <Doughnut
                data={data}
                options={options}
                responsive="true"
                height={'100%'} width={'100%'}
                 />
        </div>
    );
};

export default DonutChart;
