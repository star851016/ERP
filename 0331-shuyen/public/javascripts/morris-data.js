$(function() {

    Morris.Area({
        element: 'morris-area-chart',
        data: [{
            period: '2014 Q1',
            輪胎: 2666,
            機油: null,
            火星塞: 2647
        }, {
            period: '2014 Q2',
            輪胎: 2778,
            機油: 2294,
            火星塞: 2441
        }, {
            period: '2014 Q3',
            輪胎: 4912,
            機油: 1969,
            火星塞: 2501
        }, {
            period: '2014 Q4',
            輪胎: 3767,
            機油: 3597,
            火星塞: 5689
        }, {
            period: '2015 Q1',
            輪胎: 6810,
            機油: 1914,
            火星塞: 2293
        }, {
            period: '2015 Q2',
            輪胎: 5670,
            機油: 4293,
            火星塞: 1881
        }, {
            period: '2015 Q3',
            輪胎: 4820,
            機油: 3795,
            火星塞: 1588
        }, {
            period: '2015 Q4',
            輪胎: 15073,
            機油: 5967,
            火星塞: 5175
        }, {
            period: '2016 Q1',
            輪胎: 10687,
            機油: 4460,
            火星塞: 2028
        }, {
            period: '2016 Q2',
            輪胎: 8432,
            機油: 5713,
            火星塞: 1791
        }],
        xkey: 'period',
        ykeys: ['輪胎', '機油', '火星塞'],
        labels: ['輪胎', '機油', '火星塞'],
        pointSize: 2,
        hideHover: 'auto',
        resize: true
    });

    Morris.Donut({
        element: 'morris-donut-chart',
        data: [{
            label: "疑難雜症",
            value: 30
        }, {
            label: "基本保養",
            value: 40
        }, {
            label: "正常維護",
            value: 30
        }],
        resize: true
    });


    $.ajax({
            url: "http://localhost:3000/purSalesReport",
            dataType:'html',
            type : 'GET',

            success: function(data){
                alert(data);
                Morris.Bar({
                    element: 'morris-bar-chart',
                    data: data,
                    xkey: 'y',
                    ykeys: ['a', 'b'],
                    labels: ['銷貨額', '進貨額'],
                    hideHover: 'auto',
                    resize: true
                });

            },

             error:function(xhr, ajaxOptions, thrownError){
                alert(xhr.status);
                alert(thrownError);
             }

     });


});
