
export let myPieChart = new Chart(document.getElementById('myPieChart').getContext('2d'), {
    type: 'doughnut',
    data: {
        labels: ['Entertainment', 'Rent', 'Shopping', 'Food & Health', 'Others'],
        datasets: [{
            label: 'Expense Distribution',
            data: [0, 0, 0, 0, 0],
            backgroundColor: ['lightgreen', 'red', 'orange', 'skyblue', 'black'],
            borderWidth: 1,
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: {
                position: 'bottom',
            },
            tooltip: {
                enabled: true
            }
        }
    }
});

export function updatePieChart(percentages) {
    myPieChart.data.datasets[0].data = percentages;
    myPieChart.update();
}