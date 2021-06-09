/* eslint-disable no-magic-numbers */
// Disable the on-canvas tooltip
Chart.defaults.global.pointHitDetectionRadius = 1
Chart.defaults.global.tooltips.enabled = false
Chart.defaults.global.tooltips.mode = 'index'
Chart.defaults.global.tooltips.position = 'nearest'
Chart.defaults.global.tooltips.custom = coreui.ChartJS.customTooltips
Chart.defaults.global.defaultFontColor = '#646470'
Chart.defaults.global.responsiveAnimationDuration = 1

document.body.addEventListener('classtoggle', event => {
    if (event.detail.className === 'c-dark-theme') {
        if (document.body.classList.contains('c-dark-theme')) {
            cardChart1.data.datasets[0].pointBackgroundColor = coreui.Utils.getStyle('--primary-dark-theme')
            cardChart2.data.datasets[0].pointBackgroundColor = coreui.Utils.getStyle('--info-dark-theme')
            Chart.defaults.global.defaultFontColor = '#fff'
        } else {
            cardChart1.data.datasets[0].pointBackgroundColor = coreui.Utils.getStyle('--primary')
            cardChart2.data.datasets[0].pointBackgroundColor = coreui.Utils.getStyle('--info')
            Chart.defaults.global.defaultFontColor = '#646470'
        }

        cardChart1.update()
        cardChart2.update()
        cardChart3.update()
        mainChart.update()
    }
})

// eslint-disable-next-line no-unused-vars
// const cardChart1 = new Chart(document.getElementById('card-chart1'), {
//   type: 'line',
//   data: {
//     labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
//     datasets: [
//       {
//         label: 'My First dataset',
//         backgroundColor: 'transparent',
//         borderColor: 'rgba(255,255,255,.55)',
//         pointBackgroundColor: coreui.Utils.getStyle('--primary'),
//         data: [65, 59, 84, 84, 51, 55, 40]
//       }
//     ]
//   },
//   options: {
//     maintainAspectRatio: false,
//     legend: {
//       display: false
//     },
//     scales: {
//       xAxes: [{
//         gridLines: {
//           color: 'transparent',
//           zeroLineColor: 'transparent'
//         },
//         ticks: {
//           fontSize: 2,
//           fontColor: 'transparent'
//         }
//       }],
//       yAxes: [{
//         display: false,
//         ticks: {
//           display: false,
//           min: 35,
//           max: 89
//         }
//       }]
//     },
//     elements: {
//       line: {
//         borderWidth: 1
//       },
//       point: {
//         radius: 4,
//         hitRadius: 10,
//         hoverRadius: 4
//       }
//     }
//   }
// })

// eslint-disable-next-line no-unused-vars
const cardChart1 = new Chart(document.getElementById('card-chart1'), {
    type: 'line',
    data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thurs', 'Fri', 'Sat', 'Sun'],
        datasets: [
            {
                label: 'Sensors',
                backgroundColor: 'transparent',
                borderColor: 'rgba(255,255,255,.55)',
                pointBackgroundColor: coreui.Utils.getStyle('--info'),
                data: [0, 0, 0, 0, 0, 0, 0]
            }
        ]
    },
    options: {
        maintainAspectRatio: false,
        legend: {
            display: false
        },
        scales: {
            xAxes: [{
                gridLines: {
                    color: 'transparent',
                    zeroLineColor: 'transparent'
                },
                ticks: {
                    fontSize: 2,
                    fontColor: 'transparent'
                }
            }],
            yAxes: [{
                display: false,
                ticks: {
                    display: false,
                    min: -4,
                    max: 39
                }
            }]
        },
        elements: {
            line: {
                tension: 0.00001,
                borderWidth: 1
            },
            point: {
                radius: 4,
                hitRadius: 10,
                hoverRadius: 4
            }
        }
    }
})

// eslint-disable-next-line no-unused-vars
const cardChart2 = new Chart(document.getElementById('card-chart2'), {
    type: 'line',
    data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thurs', 'Fri', 'Sat', 'Sun'],
        datasets: [
            {
                label: 'Alert Frequency',
                backgroundColor: 'rgba(255,255,255,.2)',
                borderColor: 'rgba(255,255,255,.55)',
                data: [0, 0, 0, 0, 0, 0, 0]
            }
        ]
    },
    options: {
        maintainAspectRatio: false,
        legend: {
            display: false
        },
        scales: {
            xAxes: [{
                display: false
            }],
            yAxes: [{
                display: false
            }]
        },
        elements: {
            line: {
                borderWidth: 2
            },
            point: {
                radius: 0,
                hitRadius: 10,
                hoverRadius: 4
            }
        }
    }
})

// eslint-disable-next-line no-unused-vars
const cardChart3 = new Chart(document.getElementById('card-chart3'), {
    type: 'bar',
    data: {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        datasets: [
            {
                label: 'Downtime',
                backgroundColor: 'rgba(255,255,255,.2)',
                borderColor: 'rgba(255,255,255,.55)',
                data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                barPercentage: 0.6
            }
        ],
    },
    options: {
        maintainAspectRatio: false,
        legend: {
            display: false
        },
        scales: {
            xAxes: [{
                display: false
            }],
            yAxes: [{
                display: false
            }]
        }
    }
})


$(document).ready(function () {
    var chartColors = {
        red: 'rgb(255, 99, 132)',
        orange: 'rgb(255, 159, 64)',
        yellow: 'rgb(255, 205, 86)',
        green: 'rgb(75, 192, 192)',
        blue: 'rgb(54, 162, 235)',
        purple: 'rgb(153, 102, 255)',
        grey: 'rgb(201, 203, 207)'
    };
    multiplier = 1

    function randomScalingFactor() {
        if (multiplier != 100) {
            multiplier += 1;
        }

        let randomFactor = (Math.random() > 0.5 ? 1.0 : -1.0) * Math.round(Math.random() * multiplier);
        updatePoints(randomFactor);

        return randomFactor;
    }

    function updatePoints(randomFactor) {
        let lowestPoint = $('#lowest-point');
        let highestPoint = $('#highest-point');

        if (randomFactor < lowestPoint.find('strong').first().text()) {
            lowestPoint.find('strong').first().text(randomFactor);
            lowestPoint.find('.progress-bar').attr('style', 'width:' + Math.abs(randomFactor) + '%');
        }

        if (randomFactor > highestPoint.find('strong').first().text()) {
            highestPoint.find('strong').first().text(randomFactor);
            highestPoint.find('.progress-bar').attr('style', 'width:' + Math.abs(randomFactor) + '%');
        }
    }


    function onRefresh(chart) {
        chart.config.data.datasets.forEach(function (dataset) {
            dataset.data.push({
                x: Date.now(),
                y: 0
                // y: randomScalingFactor() // put updated data from websockets here...
            });
        });
    }

    var color = Chart.helpers.color;
    var config = {
        type: 'line',
        data: {
            datasets: []
            // datasets: [{
            //     label: 'Sensor 1',
            //     backgroundColor: color(chartColors.red).alpha(0.5).rgbString(),
            //     borderColor: chartColors.red,
            //     fill: false,
            //     lineTension: 0,
            //     borderDash: [8, 4],
            //     data: []
            // }, {
            //     label: 'Sensor 2',
            //     backgroundColor: color(chartColors.blue).alpha(0.5).rgbString(),
            //     borderColor: chartColors.blue,
            //     fill: false,
            //     cubicInterpolationMode: 'monotone',
            //     data: []
            // }, {
            //     label: 'Sensor 3',
            //     backgroundColor: color(chartColors.yellow).alpha(0.5).rgbString(),
            //     borderColor: chartColors.yellow,
            //     fill: false,
            //     lineTension: 0,
            //     data: []
            // }]
        },
        options: {
            title: {
                display: true,
                text: 'Current temp readings (updates every 5 seconds)'
            },
            scales: {
                xAxes: [{
                    type: 'realtime',
                    realtime: {
                        duration: 20000,
                        refresh: 3000,
                        delay: 3000,
                        onRefresh: onRefresh
                    }
                }],
                yAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'celcius'
                    }
                }]
            },
            tooltips: {
                mode: 'nearest',
                intersect: false
            },
            hover: {
                mode: 'nearest',
                intersect: false,
                animationDuration: 0
            },
            animation: {
                duration: 0
            },
            responsiveAnimationDuration: 0,
            plugins: {
                streaming: {
                    frameRate: 1
                }
            }
        }
    };

    var ctx = document.getElementById('main-chart');
    const mainChart = new Chart(ctx, config);

    // document.getElementById('randomizeData').addEventListener('click', function() {
    //     config.data.datasets.forEach(function(dataset) {
    //         dataset.data.forEach(function(dataObj) {
    //             dataObj.y = randomScalingFactor();
    //         });
    //     });
    //     window.mainChart.update();
    // });
    //

    var colorNames = Object.keys(chartColors);
    // document.getElementById('addDataset').addEventListener('click', function () {
    //     var colorName = colorNames[config.data.datasets.length % colorNames.length];
    //     var newColor = chartColors[colorName];
    //     var newDataset = {
    //         label: 'Sensor ' + (config.data.datasets.length + 1),
    //         backgroundColor: color(newColor).alpha(0.5).rgbString(),
    //         borderColor: newColor,
    //         fill: false,

    //         lineTension: 0,
    //         data: []
    //     };

    //     config.data.datasets.push(newDataset);
    //     mainChart.update();
    // });

    // document.getElementById('removeDataset').addEventListener('click', function () {
    //     config.data.datasets.pop();
    //     mainChart.update();
    // });

    // document.getElementById('addData').addEventListener('click', function() {
    //     onRefresh(mainChart);
    //     mainChart.update();
    // });

    function randomIntFromInterval(min, max) { // min and max included
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    // fade battery and wifi if it's 0 or not connected
    setInterval(function () {
        $('.cil-battery-0, .cil-battery-slash, .cil-battery-empty, .cil-wifi-signal-0, .cil-wifi-signal-off, .blink-danger')
            .css('fill', 'red').fadeTo('slow', 0.1).fadeTo('slow', 1.0);
    }, 1000);

    randomizeTemps();

    function randomizeTemps() {
        setInterval(function () {
            $('.sensor-temp').each(function () {
                let randNum = randomIntFromInterval(-30, 5);
                let tempText = $(this).find('strong');
                tempText.removeAttr('class');

                var status = 'text-info';

                if (randNum > -15) {
                    status = 'text-warning';
                }

                if (randNum > -5) {
                    status = 'text-danger';
                }

                tempText.text(randNum + '°C').addClass(status);
            });
        }, 3000);
    }

    /****** Get devices data *******/
    $(document).ready(function () {
        getData();
    });

    function getData() {
        let query = {
            "relations": ["hub"]
        };
        query = encodeURI(JSON.stringify(query));
        api.get('/sensors?query=' + query).then((res) => {
            let results = res.data.result;
            let uTable = $("#devices-table").DataTable({
                "searching": false,
                "paging": false,
                "info": false
            });
            uTable.clear().draw();
            console.log(results.length)
            $("#no-of-active-sensors").html(results.length);



            $.each(results, function () {
                let dt = $(this)[0];
                if (typeof dt === 'undefined') return false;


                // Add new sensor to main chart
                var colorName = colorNames[config.data.datasets.length % colorNames.length];
                var newColor = chartColors[colorName];
                var newDataset = {
                    label: dt.name + '(' + dt.serial + ')',
                    backgroundColor: color(newColor).alpha(0.5).rgbString(),
                    borderColor: newColor,
                    fill: false,
                    lineTension: 0,
                    data: []
                };

                config.data.datasets.push(newDataset);
                mainChart.update();

                console.log(dt)
                let newData = [
                    dt.name,
                    dt.serial,
                    dt.hub.name,
                    dt.currentTemp || 'N/A',
                    dt.minTemp || 'N/A',
                    dt.maxTemp || 'N/A',
                    dt.batteryStatus + '%',
                    dt.isConnected == 1 ? '<strong class="text-success">Connected</strong>' :
                        '<strong class="text-danger">Disconnected</strong>',

                    moment.unix(dt.lastSeen).fromNow(true),
                ];
                uTable.row.add(newData);
            });

            uTable.draw();
        }).catch((error) => {
            console.error(error)
        });
    }

});
