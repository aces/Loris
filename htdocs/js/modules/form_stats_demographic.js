        function updateReliabilitySite()
        {
            var site = document.getElementById("site");
            var instrument = document.getElementById("instrument");
            var request = $.ajax({
                url: '/main.php?test_name=statistics&subtest=stats_demographic&dynamictabs=dynamictabs&site=' + site.value + '&instrument=' + instrument.value,
                type: 'GET',
                data: 'html',
                success: function(response, textStatus, jqXHR)
                {
                    $('#demographics').html(response);
                }
            });
        }

