const API_URL = 'https://api.banghasan.com'

function status(response) {
    return response.status !== 200 ? Promise.reject(new Error(response.status)) : Promise.resolve(response)
}

function json(response) {
    return response.json()
}

function error(e) {
    console.error(e)
}

function dateNow() {
    var d   = new Date(),
    day     = '' + d.getDate(),
    month   = '' + (d.getMonth() + 1),
    year    = d.getFullYear()

    if (month.length < 2) month = '0' + month
    if (day.length < 2) day = '0' + day

    return [year, month, day].join('-')
}

$(function() {

    console.log(dateNow())

    $('#btn-search-shalat').click(function(e) {
        e.preventDefault()

        $('.toast').toast('show')

        let cityName = $('input[type="text"]').val()

        fetch(API_URL + '/sholat/format/json/kota/nama/' + cityName)
            .then(status)
            .then(json)
            .then(function(response) {
                let cityCode = response.kota[0].id

                fetch(API_URL + '/sholat/format/json/jadwal/kota/' + cityCode + '/tanggal/' + dateNow())
                    .then(status)
                    .then(json)
                    .then(function(response) {
                        $('#text-imsak').text(response.jadwal.data.imsak)
                        $('#text-subuh').text(response.jadwal.data.subuh)
                        $('#text-dzuhur').text(response.jadwal.data.dzuhur)
                        $('#text-ashar').text(response.jadwal.data.ashar)
                        $('#text-maghrib').text(response.jadwal.data.maghrib)
                        $('#text-isya').text(response.jadwal.data.isya)

                        $('#city-name').text(cityName)

                        $('.toast').toast('hide')
                    })
                    .catch(error)
            })
            .catch(error)
    })

})