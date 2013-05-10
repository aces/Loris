        function updateSite() {
            var site = document.getElementById("site");
            var request = $.ajax({
                url: '/main.php?test_name=statistics&subtest=stats_reliability&dynamictabs=dynamictabs&site=' + site.value,
                type: 'GET',
                data: 'html',
                success: function(response, textStatus, jqXHR)
                {
                    $('#reliability').html(response);
                }
            });
        }

