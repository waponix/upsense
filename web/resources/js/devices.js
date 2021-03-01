$(document).ready(function () {
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
                y: randomScalingFactor()
            });
        });
    }

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
});

function loadSensorModal(page) {
    $('#sensorModal .modal-body').load('http://192.168.0.111:3000/sensors/' + page, function () {

       var sensorModal = new coreui.Modal(document.getElementById('sensorModal'));
       sensorModal.show();
        // $('#sensorModal').modal('show');
        return false;

    });
}
