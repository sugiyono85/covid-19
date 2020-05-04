const API_URL           = 'https://corona-api.com/countries/ID'

const ELEM_POSITIVE     = $('#total-positive')
const ELEM_RECOVERED    = $('#total-recovered')
const ELEM_DEATHS       = $('#total-deaths')

const CTX_CHART_CASES               = $('#chart-cases')[0].getContext('2d')
const CTX_CHART_ADDITION_POSITIVE   = $('#chart-addition-positive')[0].getContext('2d')
const CTX_CHART_ADDITION_RECOVERED  = $('#chart-addition-recovered')[0].getContext('2d')
const CTX_CHART_ADDITION_DEATHS     = $('#chart-addition-deaths')[0].getContext('2d')
const CTX_CHART_PERSENTASE          = $('#chart-persentase')[0].getContext('2d')

function status(response) {
    return response.status !== 200 ? Promise.reject(new Error(response.status)) : Promise.resolve(response)
}

function json(response) {
    return response.json()
}

function error(e) {
    console.error(e)
}

function addData(chart, label, data) {
    if (label !== false) chart.data.labels.push(label)
    chart.data.datasets.forEach((dataset, index) => {
        if (Array.isArray(data[index])) {
            dataset.data = data[index]
        } else {
            dataset.data.push(data[index])
        }
    })
    chart.update()
}


function changeDateFormat($str_date) {
    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']

    return $str_date.split('-').map((v, i) => {
        return i !== 0 ? i === 1 ? months[v - 1] : v : ''
    }).reverse().join(' ')
}

$(function() {

    $('canvas').each(function() { $(this).parent().height(400) })

    const chartCases    = new Chart(CTX_CHART_CASES, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Terkonfirmasi',
                data: [],
                backgroundColor: 'rgba(110, 110, 110, 0.2)',
                borderColor: 'rgba(66, 147, 245, 0.8)'
            },
            {
                label: 'Sembuh',
                data: [],
                backgroundColor: 'rgba(110, 110, 110, 0.2)',
                borderColor: 'rgba(66, 245, 111, 0.8)'
            },
            {
                label: 'Meninggal',
                data: [],
                backgroundColor: 'rgba(110, 110, 110, 0.2)',
                borderColor: 'rgba(245, 84, 66, 0.8)'
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            },
            responsive: true,
            maintainAspectRatio: false
        }
    })


    const chartAdditionPositive = new Chart(CTX_CHART_ADDITION_POSITIVE, {
        type: 'bar',
        data: {
            labels: [],
            datasets: [{
                label: 'Penambahan Pasien Positif',
                data: [],
                backgroundColor: 'rgba(66, 147, 245, 0.8)'
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            },
            responsive: true,
            maintainAspectRatio: false
        }
    })


    const chartAdditionRecovered = new Chart(CTX_CHART_ADDITION_RECOVERED, {
        type: 'bar',
        data: {
            labels: [],
            datasets: [{
                label: 'Penambahan Pasien Sembuh',
                data: [],
                backgroundColor: 'rgba(66, 245, 111, 0.8)'
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            },
            responsive: true,
            maintainAspectRatio: false
        }
    })


    const chartAdditionDeaths = new Chart(CTX_CHART_ADDITION_DEATHS, {
        type: 'bar',
        data: {
            labels: [],
            datasets: [{
                label: 'Penambahan Pasien Meninggal',
                data: [],
                backgroundColor: 'rgba(245, 84, 66, 0.8)'
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            },
            responsive: true,
            maintainAspectRatio: false
        }
    })


    const chartPersentase = new Chart(CTX_CHART_PERSENTASE, {
        type: 'pie',
        data: {
            labels: ['Dirawat', 'Sembuh', 'Meninggal'],
            datasets: [{
                data: [0, 0, 0],
                backgroundColor: [
                    'rgba(66, 147, 245, 0.8)',
                    'rgba(66, 245, 111, 0.8)',
                    'rgba(245, 84, 66, 0.8)'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    })


    fetch(API_URL)
        .then(status)
        .then(json)
        .then(function(response) {
            ELEM_POSITIVE.text(response.data.latest_data.confirmed)
            ELEM_RECOVERED.text(response.data.latest_data.recovered)
            ELEM_DEATHS.text(response.data.latest_data.deaths)

            console.log(response)

            response.data.timeline.reverse().forEach((data, index, array) => {
                addData(
                    chartCases, 
                    changeDateFormat(data.date), 
                    {   
                        0: data.confirmed, 
                        1: data.recovered, 
                        2: data.deaths
                    })

                addData(
                    chartAdditionPositive,
                    changeDateFormat(data.date), 
                    {
                        0: data.new_confirmed
                    }
                )

                addData(
                    chartAdditionRecovered,
                    changeDateFormat(data.date), 
                    {
                        0: data.new_recovered
                    }
                )

                addData(
                    chartAdditionDeaths,
                    changeDateFormat(data.date), 
                    {
                        0: data.new_deaths
                    }
                )

            })

            const recovery_rate = response.data.latest_data.calculated.recovery_rate
            const death_rate    = response.data.latest_data.calculated.death_rate
            const treated_rate  = 100 - (recovery_rate + death_rate)

            addData(
                chartPersentase,
                false,
                {
                    0: [treated_rate, recovery_rate, death_rate]
                }
            )

            $('.splash-screen').css('display', 'none')

        })
        .catch(error)

})