function getjsonSizeData(){
       var chart_type = 'pie';
       var chart_div = 'container';
       var action_url1 = '/show_size';
	
       var myStorage = [], myUsage=[], data1 = [], data2 = [];
		//Calls the JSON action method
		jQuery.getJSON(action_url1, null, function (items) {
         //Plotting each data point from the response JSON object
         //console.log(items);
	      $.each(items, function (itemNo, item) { 
                //array, function(index, value)
               console.log(item);
               if(item.context == 'Free Space'){
                    myStorage.push({name: 'Free Space',y: 50, sliced: true,selected: true})
                }
		       else
               myStorage.push([item.context, parseFloat(item.size)]);
                                  
		  });
		  getSizePieChart(chart_type, chart_div, myStorage);
  });
}
function getSizePieChart(chart_type, chart_div, myDataPie) {
               
                var type = chart_type;
                var container = chart_div
		        var options ={            
                   chart: {
	                renderTo: container,
	                plotBackgroundColor: null,
	                plotBorderWidth: null,
	                plotShadow: false
	            },
	            title: {
	                text: 'Personis User Model Storage Analytics'
	            },
  	            subtitle: {
				 text: 'Source: Personis Server'
    	            },
	            tooltip: {
	                formatter: function() {
                            if(this.point.name){
		                    return '<b>'+ this.point.name +'</b>: '+ Math.round(this.percentage) +' %';
                            }else{
	                            return 'Storage used in '+this.x  +': '+ this.y+' KB';
			   }
	                }
	            },
	            plotOptions: {
	                pie: {
	                    allowPointSelect: true,
	                    cursor: 'pointer',
	                    dataLabels: {
	                        enabled: false
	                    },
	                    showInLegend: true
	                }
	            },
	            series: [{
	                type: type,
	                name: 'Mneme Storage Pie Distribution',
					center: [80, 80],
					size: '50%',
	                data: []
	            },{
			//data: [129.3, 131.5, 138.9, 148.3, 158.5, 168, 173.9, 172.3, 174.7, 176.1, 180.9, 184.8], 
			data: [0, 0, 0, 0,0,0,0,0],
			type: 'line', 
			name: 'Monthly Growth of Mneme Storage Usage'
		    }],
		   xAxis: [
			{
			//categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"], 
            categories: ["Jan", "Feb", "Mar", "Apr", "May","Jun","Jul", "Aug"],
			title: {
				text: 'Month'
				}
			}
		   ],
		  yAxis: [
			{
			title:{
				text: "KB Used"
			   },
			min:0
           }]
          	};

              
               options.series[0].data = myDataPie;                                
               var chart = new Highcharts.Chart(options);

	    }

function getHighStockChart(chart_type, chart_div, myArray) {
                var type = chart_type;
                var container = chart_div
		        var options = {
			      chart: {
				     renderTo: container,
			         defaultSeriesType: type
			      },
			      
			      title: {
				    text: 'Daily Activity and Health Records'
			      },
			      
			      subtitle: {
				     text: 'Source: Personis Server'
			      },
			      
			      xAxis: {
				     type: 'datetime',
				     tickInterval: 14 * 24 * 3600 * 1000, // one week
				     tickWidth: 0,
				     gridLineWidth: 1,
				     labels: {
				        align: 'left',
				        x: 3,
				        y: -3 
				 }
			      },
			      
			      yAxis: [{ // left y axis
				    title: {
				    text: null
				    },
				    labels: {
				    align: 'left',
				    x: 3,
				    y: 16,
				    formatter: function() {
				       return Highcharts.numberFormat(this.value, 0);
				      }
				    },
				    showFirstLabel: false
			      }, { // right y axis
				 linkedTo: 0,
				 gridLineWidth: 0,
				 opposite: true,
				 title: {
				    text: null
				 },
				 labels: {
				    align: 'right',
				    x: 0,
				    y: 16,
				    formatter: function() {
				       return Highcharts.numberFormat(this.value, 0);
				    }
				 },
				 showFirstLabel: false
			      }],
			      
			     legend: {
				 align: 'left',
				 verticalAlign: 'top',
				 y: 20,
				 floating: true,
				 borderWidth: 0
			      },
			      
			      tooltip: {
				 shared: true,
				 crosshairs: true
			      },
			      
			      plotOptions: {
				 series: {
				    cursor: 'pointer',
				    point: {
				       events: {
					  click: function() {
					     hs.htmlExpand(null, {
						pageOrigin: {
						   x: this.pageX, 
						   y: this.pageY
						},
						headingText: this.series.name,
						maincontentText: Highcharts.dateFormat('%e. %b %Y', this.x) +':<br/> '+ 
						   this.series.name+": "+this.y + 
                                                   '<br/>Sticky Notes:<input type="text"/><br/><input type="button" value="Save"/>',
						width: 200
					     });
					  }
				       }
				    },
				    marker: {
				       lineWidth: 1
				    }
				 }
			      },
      			      series: [{
				 name: 'Steps',
				 lineWidth: 4,
				 marker: {
				    radius: 4
				 }
			      },{
				 name: 'Active Hours'
			      }, {
				 name: 'Calorie burnt'
			      }
                          ]
			};
                        var series = {
	                        data: []
                        };
                       /*for(var i=0;i<myArray.length;i++){
                       
 	               	  options.series[i].data = myArray[i];
                       } */                               
		       options.series[0].data = myArray[0];
		       options.series[1].data = myArray[1];
                       options.series[2].data = myArray[2];

	               var chart = new Highcharts.StockChart(options);
                       
	    }


function randomData(len) {
			var arr = [];
			
			for (var i = 0; i < len; i++) {
				arr.push(Math.random());
			}
			return arr;
		}

function getIntradayStackChart(chart_div, myActive,myTitle){
	//Highcharts.setOptions({colors: ['#747474', 'rgba(0, 0, 0, 0)']});
        console.log(chart_div);
        var options = {

	    chart: {
		renderTo: chart_div                
		
	    },
         title: {
		 text: myTitle
		},
			      
	    subtitle: {
		 text: 'Source: Personis Server'
	      },

	    xAxis: [{
			categories: ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00','07:00', '08:00', '09:00', '10:00', '11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00','21:00', '22:00','23:00'],
			labels: {
			    step: 5
			},
			max:23,
 	         }],
	   yAxis: [{
                allowDecimals: false,
                min: 0,
                max:60,
                title: {
                    text: 'Active Minutes'
                }

            }],
	    tooltip: {
		shared: true,
		crosshairs: true,
		style: {
			color: '#fff',
			fontSize: '9pt',
			padding: '5px'
		},
		formatter: function() {
                         var s = '<b> At '+ this.x +': </b><br/>';
			    //console.log(this.points);
			    var high;
			    var low;			    
			    $.each(this.points, function(i, point) {
                                if(point.series.name == 'Pie'){
		                    return '<b>'+ point.name +'</b>: '+ Math.round(this.percentage) +' %';
	                       }else if(point.series.name === 'High'){
				   { high = point.y; }
			       }
				else{ low = point.y; }
			    });
			    s += 'Highly Active: ' + (high) + 'minutes<br/>';
			    s += 'Moderately active: '+ (low) + ' minutes<br/>';
			    
			    return s;
                     
		},
	    },
	    
	  plotOptions: {
		 column: {
		    stacking: 'normal',
		     shadow: false,
		 },
                 pie: {
	                    allowPointSelect: true,
	                    cursor: 'pointer',
	                    dataLabels: {
	                        enabled: false
	                    },
	                    showInLegend: true
	                }
	      },
	     
	    // This data is not the usual stock info as this represents the day high and day low rather than
	    // the start day end day.
	    
	    legend:false,
	    series: [{
		name:"High",
		type:'column',
		data: [0, 0, 0, 0, 0, 0, 0, 20, 30, 15, 0, 0, 0, 0, 0],
                stack: 'Active' 
            },{
		name:"Low",
		type:'column',
		data: [0, 0, 0, 0, 0, 20, 20, 30, 30, 20, 12, 20, 30, 0, 0],
                stack: 'Active' 
            },{
        name:"Pie",  
		type: 'pie',
		data: myActive,
		size: '50%',
		center: [80, 80]				
   	   }]
        }
	var chart = new Highcharts.Chart(options);
        //chart.render();
}
function getInactivityAnnual(chart_div, myActive){
        var data1 = [{
                    y: 5.45,
                    color: '#24CBE5',
                }, {
                    y: 6.35,
                    color: '#24CBE5',
                }, {
                    y: 6.80,
                    color: '#24CBE5',	
                }, {
                    y: 5.78,
                    color: '#24CBE5',
                }, {
                    y: 7.56,
                    color: '#24CBE5',
                },{
                    y: 6.56,
                    color: '#24CBE5',
                },{
                    y: 7.67,
                    color: '#24CBE5',
                },{
                    y: 4.23,
                    color: '#24CBE5',
                },{
                    y: 7.45,
                    color: '#24CBE5',
                },{
                    y: 8.56,
                    color: '#24CBE5',
                },{
                    y: 6.56,
                    color: '#24CBE5',
                },{
                    y: 5.45,
                    color: '#24CBE5',
                },];
        var series = [{
                data: data,
                name:""
            }];
        series.showInLegend = false;
        var chart = new Highcharts.Chart({
            chart: {
                renderTo: chart_div,
                type: 'column'
            },
            title: {
                text: 'Physical Inactivity Chart'
            },
            subtitle: {
                text: 'Source: Personis.com'
            },
            xAxis: {
                categories: [
                    'Jun, 2011',
                    'Jul, 2011',
                    'Aug, 2011',
                    'Sep, 2011',
                    'Oct, 2011',
                    'Nov, 2011',
                    'Dec, 2011',
                    'Jan, 2012',
                    'Feb, 2012',
                    'Mar, 2012',
                    'Apr, 2012',
                    'May, 2012',

                ]
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Average Number of Hits'
                }
            },
            legend: {
                layout: 'vertical',
                backgroundColor: '#FFFFFF',
                align: 'left',
                verticalAlign: 'top',
                x: 100,
                y: 70,
                floating: true,
                shadow: true
            },
            tooltip: {
                formatter: function() {
                    return ''+
                        'Avoided inactive periods: '+ this.y +' times <br/>(daily average for 31 days in '+this.x+')';
                }
            },
            plotOptions: {
                column: {
                    pointPadding: 0.2,
                    borderWidth: 0
                }
            },
            legend:{
	            enabled:false
            },
           series: series
        });
}
function getIntradayInactivity(){
       var break_list = [];
       $.ajax({  
			    type: "POST",  
			    url: "/get_break_records",  
			    data: "",  
                processdata:true,
			    success: function(data){
					   	   					   			
                break_list = eval(data);
                console.log(break_list);
				var i = 0;
		        d1 = new Date("20 Aug 2000 08:00");  
		        console.log('Starting time');
		        console.log(d1);        
		        for(var i = 0; i < break_list.length; i++){
		        	console.log(break_list[i].breakTime);
			        var d2 = new Date('20 Aug 2000 '+break_list[i].breakTime);
		            console.log(d2);
		            for(var j = 0; j < 60; j++){		 
				       if(d2.getTime() == d1.getTime()){
		                   console.log('Break!!!');
		                   var break_minutes = break_list[i].breakDuration.split(':');
				           var break_length = parseInt(break_minutes[0]); 
		                   for(var k=0; k < break_length; k++){
				               $('#colorchart').append('<a title="You have taken a break at '+break_list[i].breakTime+' hours for '+break_length+' minutes" ><div class="active" style="float:left"></div></a>');		    	
		                       d1.setMinutes(d1.getMinutes() + 1);    	
				           }
		                   break;
				       }
				       else{                    
				           $('#colorchart').append('<div class="inactive" style="float:left"></div>');
		                   d1.setMinutes(d1.getMinutes() + 1);    
				        }
				     }  
				}
		   	     var dEnd = new Date("20 Aug 2000 18:00");
			     var difference = dEnd.getTime() - d1.getTime();
			     console.log(difference); 
			     var minutesDifference = parseInt((difference / 60)/1000);
			     console.log(minutesDifference);
			     for(var i = 0; i< minutesDifference+4; i++){
			         $('#colorchart').append('<div class="inactive" style="float:left"></div>');           
			     }
				  $('#colorchart a').dcTooltip({
			        classWrapper: 'tooltip-2',
				    distance: 10
			     });		
   
					   
			   }
			});

	   

}
	
