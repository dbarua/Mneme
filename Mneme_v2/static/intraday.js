function getIntradayHighChart(chart_div){
	Highcharts.setOptions({colors: ['#747474', 'rgba(0, 0, 0, 0)']});

	var chart = new Highcharts.Chart({

	    chart: {
		renderTo: chart_div
	    },

	    xAxis: {
		categories: ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00','07:00', '08:00', '09:00', '10:00', '11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00','21:00', '22:00','23:00'],
		labels: {
		    step: 5
		},
		max:23,
	    },

	    tooltip: {
		shared: true,
		crosshairs: true,
		style: {
			color: '#fff',
			fontSize: '9pt',
			padding: '5px'
		},
		formatter: function() {
		    var s = '<b>'+ this.x +'</b><br/>';
		    //console.log(this.points);
		    var high;
		    var low;
		    
		    $.each(this.points, function(i, point) {
		        if(point.series.name === 'high'){
		            high = point.y;
		        }
		        else{ low = point.y }
		    });
		    s += 'Active Score:' + (high) + '<br/>';
		    //s += 'Low: Active Score'+ low + '<br/>';
		    
		    return s;
		},
	    },
	    
	  plotOptions: {
		 column: {
		    stacking: 'normal',
		     shadow: false,
		 }
	      },
	     
	    // This data is not the usual stock info as this represents the day high and day low rather than
	    // the start day end day.
	    
	    legend:false,
	    series: [{
		name:"high",
		type:'column',
		data: [0, 0, 0, 0, 0, 0, 0, 50.0, 60.0, 100.0, 112.0, 60.0, 80.0, 75.0, 89.0, 70.0, 60.0, 100.0, 75.0, 59.0, 10.0, 10.0, 0 ]
            }]
        });
}
