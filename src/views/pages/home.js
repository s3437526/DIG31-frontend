import App from './../../App'
import { html, render } from 'lit-html'
import { gotoRoute, anchorRoute } from './../../Router'
import Auth from './../../Auth'
import Utils from './../../Utils'
import FetchAPI from './../../FetchAPI'
import {
    Chart,
    ArcElement,
    LineElement,
    BarElement,
    PointElement,
    BarController,
    BubbleController,
    DoughnutController,
    LineController,
    PieController,
    PolarAreaController,
    RadarController,
    ScatterController,
    CategoryScale,
    LinearScale,
    LogarithmicScale,
    RadialLinearScale,
    TimeScale,
    TimeSeriesScale,
    Decimation,
    Filler,
    Legend,
    Title,
    Tooltip
} from 'chart.js';
import { _numWithUnitExp } from 'gsap/gsap-core'

Chart.register(
    ArcElement,
    LineElement,
    BarElement,
    PointElement,
    BarController,
    BubbleController,
    DoughnutController,
    LineController,
    PieController,
    PolarAreaController,
    RadarController,
    ScatterController,
    CategoryScale,
    LinearScale,
    LogarithmicScale,
    RadialLinearScale,
    TimeScale,
    TimeSeriesScale,
    Decimation,
    Filler,
    Legend,
    Title,
    Tooltip
);
class HomeView {
    async init() {
        console.log('HomeView.init')
        document.title = 'Overview'
        let users = await FetchAPI.getUsersAsync()
        let items = await FetchAPI.getItemsAsync()
        let places = await FetchAPI.getPlacesAsync()
        await this.render()
        await this.renderCharts(users, items, places)
        Utils.pageIntroAnim()
    }

    handleClick() {
        // console.log(`User selected... ${JSON.stringify(users)}`)
    }

    async renderCharts(users, items, places) {

        let ctx1 = document.getElementById('myChart1').getContext('2d');
        Chart.defaults.color = '#fff'
        let myChart1 = new Chart(ctx1, {
            type: 'bar',
            data: {
                labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
                datasets: [{
                    label: '# of Votes',
                    data: [12, 19, 3, 5, 2, 3],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    hoverBackgroundColor: [
                        'rgba(255, 99, 132, 0.5)',
                        'rgba(54, 162, 235, 0.5)',
                        'rgba(255, 206, 86, 0.5)',
                        'rgba(75, 192, 192, 0.5)',
                        'rgba(153, 102, 255, 0.5)',
                        'rgba(255, 159, 64, 0.5)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                },
                responsive: true,
                maintainAspectRatio: false
            }
        });
        let ctx2 = document.getElementById('myChart2').getContext('2d');
        console.log(items)
        Chart.defaults.color = '#fff'
        let i, j
        let labels = []
        let temp = []
        let durations = []
        let colours = []
        console.log(durations)
        items.forEach(item => {
            labels.push(`${item.name} duration`)
            temp.push(item.activityHistory.activityDuration)
                // colours.push()
        });
        console.log(temp)

        for (i = 0; i < temp.length; i++) {
            let counter = 0
            for (j = 0; j < temp[i].length; j++) {
                counter += temp[i][j]
            }
            durations.push(counter)
        }
        console.log(durations)
        let myChart2 = new Chart(ctx2, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Most used device',
                    data: durations,
                    backgroundColor: [ // this will be random generated and other colours are opacity variations
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)'
                    ],
                    hoverBackgroundColor: [
                        'rgba(255, 99, 132, 0.5)',
                        'rgba(54, 162, 235, 0.5)',
                        'rgba(255, 206, 86, 0.5)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                },
                responsive: true,
                maintainAspectRatio: false
            }
        });
        let ctx3 = document.getElementById('myChart3').getContext('2d');
        Chart.defaults.color = '#fff'
        let myChart3 = new Chart(ctx3, {
            type: 'line',
            data: {
                labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
                datasets: [{
                    label: '# of Votes',
                    data: [12, 19, 3, 5, 2, 3],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                },
                responsive: true,
                maintainAspectRatio: false
            }
        });
        let ctx4 = document.getElementById('myChart4').getContext('2d');
        Chart.defaults.color = '#fff'
        let myChart4 = new Chart(ctx4, {
            type: 'radar',
            data: {
                labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
                datasets: [{
                    label: '# of Votes',
                    data: [12, 19, 3, 5, 2, 3],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                },
                responsive: true,
                maintainAspectRatio: false
            }
        });
        let ctx5 = document.getElementById('myChart5').getContext('2d');
        Chart.defaults.color = '#fff'
        let myChart5 = new Chart(ctx5, {
            type: 'polarArea',
            data: {
                labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
                datasets: [{
                    label: '# of Votes',
                    data: [12, 19, 3, 5, 2, 3],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                },
                responsive: true,
                maintainAspectRatio: false
            }
        });
        let ctx6 = document.getElementById('myChart6').getContext('2d');
        Chart.defaults.color = '#fff'
        let myChart6 = new Chart(ctx6, {
            type: 'pie',
            data: {
                labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
                datasets: [{
                    label: '# of Votes',
                    data: [12, 19, 3, 5, 2, 3],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                },
                responsive: true,
                maintainAspectRatio: false
            }
        });
    }

    async render() {
        const template = html `
        <style>
            .charts-container{
                width: 100%;
                display: flex;
                flex-wrap: wrap;
                justify-content: space-between;
                align-items: center;
            }
            
            .chart-container{
                position: relative; 
                margin: auto;
                width: 500px;
                height: 500px;
                min-width: 400px;
                min-height: 400px;
                padding: 1rem;
            }

            /* RESPONSIVE - SMALLER MONITORS -------------------*/
            @media all and (max-width: 1611px) {
                .charts-container{
                    justify-content: space-evenly;
            }
                .chart-container{
                    width: 50%;
                    min-width: 300px;
                    min-height: 300px;
                }
            }

            /* RESPONSIVE - TABLET LRG -------------------*/
            @media all and (max-width: 1023px) {
                .chart-container{
                    width: 100%;
                    height: 100%;
                }
            }

            /* RESPONSIVE - MOBILE -------------------*/
            @media all and (max-width: 359px) {
                .chart-container{
                    height: 100%;
                }
            }
        </style>

        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
        <va-app-header title="Dashboard" user=${JSON.stringify(Auth.currentUser)}></va-app-header>
        <div class="page-content">
            <aa-panel-template title=${document.title}>
            <div class="charts-container" slot="body">
                <div class="chart-container">
                    <canvas class="charts" id="myChart1"></canvas>
                </div>
                <div class="chart-container">
                    <canvas class="charts" id="myChart2"></canvas>
                </div>
                <div class="chart-container">
                    <canvas class="charts" id="myChart3"></canvas>
                </div>
                <div class="chart-container">
                    <canvas class="charts" id="myChart4"></canvas>
                </div>
                <div class="chart-container">
                    <canvas class="charts" id="myChart5"></canvas>
                </div>
                <div class="chart-container">
                    <canvas class="charts" id="myChart6"></canvas>
                </div>
            </div>
            </aa-panel-template>
        </div>
        `
        render(template, App.rootEl)
    }
}

export default new HomeView()