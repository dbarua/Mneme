//<![CDATA[
new_goal = "";
var value="",height ;  
var goallist = [], goal_unitlist = [], default_list = [], duration = []; 
var prev_height;
function initGoalOptions() {
        $('#create_goal').click(function(){
                       console.log("Set Goals clicked...");
                       getGoals('Fitbit',"");
                       return false;
                   });
        $('#goalboxclose').click(function(){
                    height = parseInt($('#set_goal_box').height())+100; 
                    $('#set_goal_box').animate({'top':'-800px'},500,function(){
                       $('#overlay2').fadeOut('fast');
                    });
                });
        $('#confirmboxclose, #okbutton').click(function(){
                    //height = parseInt($('#set_goal_box').height())+100; 
                    $('#confirm_goal_set').animate({'top':'-800px'},500,function(){
                       $('#overlay2').fadeOut('fast');
                       myGoal = $('#addgoal').attr('title');
                       /*if (myGoal=='CurrentGoal'){
                       	  getCurrentGoalDisplay();
                       }
                       show_goal_monitorpanel(myGoal);*/
                      document.location.href = "/browse";
                    });
        });        
                
        $('.goals').click(function(){
        	var goal = $(this).attr('data-div-id');
        	var app =  $(this).attr('id');
        	//alert("Mygoal "+goal+" for app "+app);
        	getGoals(app,goal);
        });

		$('.details').click(function(){
        	var goal = $(this).attr('data-div-id');
        	var app =  $(this).attr('id');
        	getGoalDetails(app,goal);
        	
        });
        

        $('#addgoal').click(function(){
            var new_goal="";
			
			new_goal = $('#addgoal').attr('title')+",";
			new_goal += $('#duration').val()+",";
			if(new_goal.indexOf('Current') == -1){
	            new_goal += $('#quatity').val()+" "+$('#after_q').text()+",";
	            new_goal += $('#time').val()+" "+$('#after_t').text()+",";
	        }
	        else{
	        	new_goal += "no quantity,no time,"
	        }    
            if($('#email_input').val()!="")
               new_goal += $('#email_input').val()+",";
            else   
               new_goal += "no email,";
               
            if($('#twitter_input').val()!="")
               new_goal += $('#twitter_input').val()+",";
            else   
               new_goal += "no twit,";
               
            new_goal += $("select#week_list option:selected").val()+",";
           		    
			
            new_goal += $('#addgoal').attr('data-div-id');
            
			//alert(new_goal);
			$.ajax({  
			    type: "POST",  
			    url: "/set_goals?newgoal="+new_goal,  
			    data: "",                              
			    success: function(data){
  							//$("#dialog").dialog("destroy");                
							$('#set_goal_box').animate({'top':'-800px'},500,function(){
							      // $('#overlay2').fadeOut('fast');
							      $('#confirm_goal_set').width(300);
							      $('#confirm_goal_set').height(100);							      
							      $('#confirm_goal_set').animate({'top':'30%','left':'40%','right':'50%'},500);
	                              $('#confirm_goal_set').draggable();
	                              $('#confirm_goal_set div').text(data);
	                              var val = $('#addgoal').attr('title');
	                              //$('div#'+val).hide('slow');
	                              
							});
				            //$("#dialog-message").text(data);					    
							/*$("#dialog-message").dialog({
									modal: true,
									buttons: {
										Ok: function() {
							                        $(this).dialog('close');				                      
				                             }				                                             
									    }                                                                                        
					                });*/
					                                                     
                                }
                        });
                                                                       

                });// end of addgoal.click

 
       /*$('#mail_notify').live('click', function(e){
             var email = $('#mail_notify').attr('checked');
             var twit = $('#twit_notify').attr('checked');
             var cur_height = $('#set_goal_box').height();
                            
             console.log("Email notifier clicked...");
             if($('#mail_notify').is(':checked')){   
			     $('#email').show('slow');
			     console.log('mail notify checked...');
                 $('#set_goal_box').height(cur_height+100); 
			 }
			 else{
			     $('#email').hide('slow');
			     console.log('mail notify unchecked...');
                 $('#set_goal_box').height(cur_height-100); 
	         }
         });
         $('#twit_notify').live('click', function(e){
               var email = $('#mail_notify').attr('checked');
               var twit = $('#twit_notify').attr('checked');
               var cur_height = $('#set_goal_box').height();

			   if($('#twit_notify').is(':checked')){   
                     $('#set_goal_box').height(cur_height+100); 
		 		     $('#twitter').show('slow');                                  
           		           
			       }
			   else{
				  $('#twitter').hide('slow');
                       $('#set_goal_box').height(cur_height-100); 
		           }

          });*/
            


 }

function show_goal_monitorpanel(newgoal){
	         console.log("Showing chart for "+newgoal);
			 $('#'+newgoal+"monitor").text(newgoal+": Here is an example graph that you will see for this goal when your own data will be available. ");
			/* var myActive = [];
             myActive.push(['Sedentary',19]);
             myActive.push(['Lightly Active',parseFloat(3)]);
             myActive.push(['Moderately Active',1]);
		     myActive.push(['Very Active',1]);
			 getIntradayStackChart(newgoal+"Chart",myActive,newgoal+" Visualisation");*/
			 $('#'+newgoal+"monitor").show('slow');
			 $('#'+newgoal).hide('slow');
			 $('#'+newgoal+"Chart").show();
			 //$('#current_step_div').show();
			
}

function getGoalDetails(appname,goal){ 		                                                                         
                                                                    
               var data = appname+"."+goal; 
               //alert("WIP: Goal "+goal+" for app "+appname);   
               console.log(data);  
	           $.ajax({  
				    type: "POST",  
				    url: "/get_goals_json?data="+data,  
				    data: "",  
	                processdata:true,
				    success: function(data){
					   items = eval(data);	
					   var goal_details = [];
					   
					   goal_details = eval(items[0].goal);
					   console.log(goal_details);
					   $('#'+goal+" div.description").text(goal_details[1]);
					   $('#'+goal+" div.description").toggle('fast');
					   var value = $('#'+goal+" input.details").val();
					   if(value == 'Show details') 
					      $('#'+goal+" input.details").val('Hide details');
					   else  				   				
					      $('#'+goal+" input.details").val('Show details');
                        
 				    },                        
		       });  //end of ajax call
               
              
          

}
function getGoals(appname,goal){ 		                                                                         
                                                                    
                var data = appname+"."+goal; 
                //alert("WIP: Goal "+goal+" for app "+appname);
               	$('#addgoal').attr('title',goal);
               	$('#addgoal').addClass('button');
               	
        	    $('#addgoal').attr('data-div-id',appname);	
                //$('div.myBox').attr("id",goal);
               console.log(goal);  
	           $.ajax({  
				    type: "POST",  
				    url: "/get_goals_json?data="+data,  
				    data: "",  
	                processdata:true,
				    success: function(data){
					   items = eval(data);	
					   var goal_details = [];
					   
					   goal_details = eval(items[0].goal);
					   console.log(goal_details);					   
					   goal_duration = eval(items[0].duration);
					   console.log(goal_duration);					   
					   
					   $('#goal_title').text(goal_details[0]);
					   $('#span_desc').attr('title',goal_details[1]);
					   $('#duration').val(goal_duration[0]);
					   $('#span_duration').attr('title',goal_duration[1]);
					   
					   if(goal_details[0].indexOf('current') == -1){
						      goal_unit = eval(items[0].goal_unit);					   
						   	  defaults = eval(items[0].default_val);
						   	  console.log(goal_unit);
						   	  console.log(defaults);
						   	  $('#goal_quantity').text(goal_unit[0]+"*");
		                      $('#quantity').val(defaults[0]); 
					      	  $('#span_q').attr('title',defaults[1]);
		                      $('#after_q').text(goal_unit[1]);
		                      
		                      $('#goal_time').text(goal_unit[2]+"*");
		                      $('#time').val(defaults[2]); 
					      	  $('#span_t').attr('title',defaults[3]);
		                      $('#after_t').text(goal_unit[3]);
		                      $('#number').show('slow'); 
		                      //$('#set_goal_box div#number').show(); 
		                      $('#set_goal_box').height(420); 
		                      
		                              
					   }
					   else{
					   	$('#number').hide('slow'); 
					   	$('#set_goal_box').height(310); 
					   }
					   
 				    },                        
		       });  //end of ajax call
		       $('#overlay2').fadeIn('fast',function(){
			  	     console.log("Block overlay..."); 
				     
				     $('#set_goal_box').width(450);
	                 //$('#number').hide();
	                 $("#notify input").each( function() {                             
						   $(this).attr("checked",false);
				     }); 
				     $('#set_goal_box').animate({'top':'150px'},500);
	                 $('#set_goal_box').draggable();  	 	    
  	        });
}		       
function getGoalRecords(note){
		      	var action_url = '/show_goals';
                var chart_div = ['container1','container2','container3'];    
                var mySteps = [], myIntense = [], myModerate = [], myNote = [], myDataArray = [];

			    jQuery.getJSON(action_url,
		             null, function (items) {
                                 //Plotting each data point from the response JSON object
                                  //console.log(items);
	                 $.each(items, function (itemNo, item) { 
                     //array, function(index, value)
                          //console.log(item);
				          mySteps.push([Date.UTC(item.year,item.month - 1,item.day),parseFloat(item.steps)]);
				          myModerate.push([Date.UTC(item.year,item.month - 1,item.day),parseFloat(item.moderate)]);
				          myIntense.push([Date.UTC(item.year,item.month - 1,item.day),parseFloat(item.intense)]);
                          if(item.note != "")
                             myNote.push({name:'title',x:Date.UTC(item.year,item.month - 1,item.day),title:item.note, text:item.note});                                  
		                });
                         if(note!='None'){
                            var data = note.split("_"); 
                            alert(data[0]+" and "+data[1]);
                            //myNote.push({name:'title',x:Date.UTC(item.year,item.month - 1,item.day),title:item.note, text:item.note});
                         }  
                         myDataArray.push(mySteps);
                         myDataArray.push(myModerate);
		                 myDataArray.push(myIntense);
			             myDataArray.push(myNote);
                         //myDataArray.push(myPulse);
			             getStepGoalLongTerm(chart_div, myDataArray);
                      }); 

}
function manageCurrentGoalPanel(){
	var button_array = ["calories_button","steps_button","active_button"];
	
	$('.curgoal').live('click',function(e){
	   var index;
	   for(var i = 0;i<button_array.length;i++){
	   	  if($(this).attr('id') == button_array[i]){
	   	  	  index = i;
	          var div_id = $(this).attr('data-div-id');
	          var chart = $(this).attr('data-chart');
	          var type = $(this).attr('title');
	          $('#'+div_id).show('fast');
	          $(this).removeClass('button');
	          $(this).addClass('pressedbutton'); 
	          getCurrentGoalDisplayNew(type,chart,div_id);	  	  
	   	  }
	   	  else{
	          var div_id = $('#'+button_array[i]).attr('data-div-id');
	          $('#'+div_id).hide('fast');
	          if($('#'+button_array[i]).hasClass('pressedbutton')){
		          $('#'+button_array[i]).removeClass('pressedbutton');
		          $('#'+button_array[i]).addClass('button');	          	
	          }  	  	 	  	  
	   	  }
	   	  
	   }
	   	
	});
}
function getCurrentGoalDisplayNew(type,chart,div){
	    myData = [];
		jQuery.getJSON('/show_current_goal?data='+type, null, function (items) {
			     console.log(eval(items));                                 
	             $.each(items, function (itemNo, item) {                                      
                       console.log(item);
                       if (type == "steps")
					      myData.push([Date.UTC(item.year,item.month - 1,item.day),parseFloat(item.steps)]);
                       else if (type == "calories")
					      myData.push([Date.UTC(item.year,item.month - 1,item.day),parseFloat(item.calories)]);
                       else 
                          /*roundupto = Math.pow(10,14);
                          console.log(roundupto)
                          active_mins = Math.round(item.active_mins * roundupto)/roundupto;
                          console.log(active_mins);*/
                          myData.push([item.activity_level,Math.round(parseFloat(item.active_mins))]);
               });
                       if(type == 'steps') 
                          getCurrentGoalChart(div, chart, myData, 'Steps walked in last seven days','Steps/day','Steps');
                       if(type == 'calories') 
                          getCurrentGoalChart(div, chart, myData, 'Calories burned in last seven days','Caloreis Burned/day','Calories burned');
                       else   
                          getGoalPieChart(div,myData,'Avearge active minutes in last seven days','Active minutes');
                       show_goal_monitorpanel("CurrentGoal");
		                
            });
		
	}
function getGoalVisual(chart_div, myArray) {

	var options;
        var myContent = '<div id="my_content"><br/>Sticky Notes:<input type="text" id="sticky_notes" class="sticky"/><br/><input type="button" value="Save" id="save_comment" onclick="saveNotes(); return hs.close(this);"/></div>';
        
        options = {
			    chart: {
				renderTo: chart_div[0],
				zoomType: 'xy'
			    },
			    title: {
				text: 'Display of Progress'
			    },
			    subtitle: {
				text: 'Source: Personis server'
			    },
			    xAxis: [{            
				 type: 'datetime',
				 tickInterval: 1 * 24 * 3600 * 1000, // one week
				 tickWidth: 0,
				 gridLineWidth: 1,
				 startOfWeek: 1,
				 labels: {
				    align: 'left', 
				    formatter: function() {
				        return Highcharts.dateFormat('%a %e %b', this.value); 
				    },                   
				 },
				//categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        			//min: 6
                                 minrange: 3600000,                            
			    }],
			    yAxis: [{ // Primary yAxis
				labels: {
				    formatter: function() {
				        return this.value+' k';
				    },
				    style: {
				        color: '#000'
				    }
				},
				title: {
				    text: 'Steps per day',
				    style: {
				        color: '#000'
				    }
				},
				opposite: true,
				max:15,
				min:0   
			    }, { // Secondary yAxis
				gridLineWidth: 0,
				title: {
				    text: 'Moderate Activity per day',
				    style: {
				        color: '#4572A7'
				    }
				},
				labels: {
				    formatter: function() {
				        return this.value +' mins';
				    },
				    style: {
				        color: '#4572A7'
				    }
				},
				max: 60,
				min: 0   

			    }, { // Tertiary yAxis
				gridLineWidth: 0,
				title: {
				    text: 'Intense Activity per week',
				    style: {
				        color: '#AA4643'
				    }
				},
				labels: {
				    formatter: function() {
				        return this.value+' times';
				    },
				    style: {
				        color: '#AA4643'
				    }
				},
				opposite: true,
				max: 7,
				min: 0   

			    },{
				labels: {
				    formatter: function() {
				        return this.title;
				    },
				    style: {
				        color: '#AA4643'
				    }
				},

			    }],
			   tooltip: {
					    formatter: function(){
						console.log(this)
                        var unit;
						if(this.point) {
						    return "this is a note added on " + new Date(this.point.x).toDateString()
						}
						else {
							var s = '<b>'+ Highcharts.dateFormat('%A, %b %e, %Y', this.x) +'</b>';
							var unit;
							$.each(this.points, function(i, point) {
							    if(point.series.name == 'Steps')
							       unit = 'k steps/day';
							    if(point.series.name == 'Intense Activity')
							       unit = ' times/day'
							    if(point.series.name == 'Moderate Activity')
							       unit = ' mins/day'
				                            
							    s += '<br/> '+point.series.name+': '+ point.y+unit;
							});					    
						        return s;						
                                              }
					    }                
					},

			    legend: {
				layout: 'vertical',
				align: 'left',
				x: 120,
				verticalAlign: 'top',
				y: 80,
				floating: true,
				backgroundColor: '#FFFFFF'
			    },
			    scrollbar: {
				enabled: true
			    },

			    plotOptions: {				
				 series: {
				    cursor: 'pointer',
				    point: {
				    events: {
					    click: function() {
				            if(this.series.name == 'Steps')
				               unit = this.y+'k steps/day';
				            if(this.series.name == 'Intense Activity')
				               unit = this.y+' times/day';
				            if(this.series.name == 'Moderate Activity')
				               unit = this.y+' mins/day';
                            if(this.series.name == 'Sticky notes')
                               unit = this.text;    
					    

					hs.htmlExpand(null, {
						pageOrigin: {
						   x: this.pageX, 
						   y: this.pageY
						},
						headingText: this.series.name,
                                                maincontentText:  Highcharts.dateFormat('%e %b %Y', this.x) +': '+ unit + '<div id="my_content"><br/>Sticky Notes:<input type="text" class="sticky" id="'+Highcharts.dateFormat('%e %b %Y', this.x)+'"/><br/><input type="button" value="Save" id="save_comment" onclick="saveNotes(); return hs.close(this);"/></div>',
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
                    rangeSelector:{
                                      enable: false
                            }, 
			    series: [{
				name: 'Steps',
				color: '#000',
				type: 'line',
				yAxis: 0,
			    }, {
				name: 'Moderate Activity',
				color: '#4572A7',
				type: 'line',
				marker: {
				    enabled: false
				},
				yAxis: 1,
			        dashStyle: 'shortdot'               
			    },{
				name: 'Intense Activity',
				type: 'scatter',
				color: '#AA4643',
                                id: 'dataseries',
				yAxis: 2,
			    },{
				type: 'flags',
				name: 'Sticky notes',
				/*data: [{
				    x: Date.UTC(2012,4,20),
				    title: 'Sick',
                                    text: 'Feeling very very unwell'
				}],*/
				onSeries: 'dataseries',
				shape: 'squarepin'
			    }]
		       };
                              //<![CDATA[
                              for(i = 0; i < myArray.length;i++)
  			        options.series[i].data = myArray[i];
                              //]]>
			      var chart = new Highcharts.StockChart(options);

}
function getStepGoalLongTerm(chart_div, myArray) {

	
        var myContent = '<div id="my_content"><br/>Sticky Notes:<input type="text" id="sticky_notes" class="sticky"/><br/><input type="button" value="Save" id="save_comment" onclick="saveNotes(); return hs.close(this);"/></div>';
        
        var options = {
    
            chart: {
                renderTo: chart_div[0]
            },
    
            title: {
                text: 'Step goal chart'
            },
    
            subtitle: {
                text: 'Source: Personis Server'
            },
    
            xAxis: [{            
				 type: 'datetime',
				 tickInterval: 1 * 24 * 3600 * 1000, // one week
				 tickWidth: 0,
				 gridLineWidth: 1,
				 startOfWeek: 1,
				 labels: {
				    align: 'left', 
				    formatter: function() {
				        return Highcharts.dateFormat('%a %e %b', this.value); 
				    },                   
				 },
				//categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        			//min: 6
                minrange: 3600000,                            
	    }],
    
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
                showFirstLabel: false,
                plotLines:[{
			
                    value : 10,
                    color : 'red',                    
                    width : 4,
                    label : {
                        text : 'Goal Step: 10K per day'
                    }
                
		        }]
            },{
				labels: {
				    formatter: function() {
				        return this.title;
				    },
				    style: {
				        color: '#AA4643'
				    }
				},

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
                                unit = this.y+'k steps/day';
                                hs.htmlExpand(null, {
						pageOrigin: {
						   x: this.pageX, 
						   y: this.pageY
						},
						headingText: this.series.name,
                        maincontentText:  Highcharts.dateFormat('%e %b %Y', this.x) +': '+ unit + '<div id="my_content"><br/>Sticky Notes:<input type="text" class="sticky" id="'+Highcharts.dateFormat('%e %b %Y', this.x)+'"/><br/><input type="button" value="Save" id="save_comment" onclick="saveNotes(); return hs.close(this);"/></div>',
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
                name: 'Goals per day',
                lineWidth: 2,
                marker: {
                    radius: 2
                }
            },{
				type: 'flags',
				name: 'Sticky notes',
				/*data: [{
				    x: Date.UTC(2012,4,20),
				    title: 'Sick',
                                    text: 'Feeling very very unwell'
				}],*/
				onSeries: 'dataseries',
				shape: 'squarepin'
			    }]
        };                         
        options.series[0].data = myArray[0];
        options.series[1].data = myArray[3];
        var chart = new Highcharts.Chart(options);

}
function getCurrentGoalChart(chart_div,chart_type,myArray,titleText,yAxisTitle,seriesName)
{
	 console.log("preparing highchart graph"+ myArray); 
	 var options = {
            chart: {
                renderTo: chart_div,
                type: chart_type
            },
            title: {
                text: titleText
            },
            subtitle: {
                text: 'source: Personis-Fitbit'
            },
            xAxis: {
            	type: 'datetime',
            	/*dateTimeLabelFormats: { 
					month: '%b \'%y',
					year: '%Y'
	               },*/
				tickInterval: 1 * 24 * 3600 * 1000, // one day
				tickWidth: 0,
				gridLineWidth: 1,
				/*labels: {
				        align: 'left',
				        x: 3,
				        y: 3 
                }*/
            },
            yAxis: {
                title: {
                    text: yAxisTitle
                },
                min: 0
            },
            tooltip: {
                formatter: function() {
                        return '<b>'+ this.series.name +'</b><br/>'+
                        Highcharts.dateFormat('%e. %b', this.x) +': '+ this.y ;
                }
            },
           series: [{
                name: seriesName,                
            }]
        };
        
        options.series[0].data = myArray;  
        var chart = new Highcharts.Chart(options);
   
   
}
function getCurrentGoalChartold(chart_div,myArray){
	console.log("preparing highchart graph"+ myArray);
    var options = {
            chart: {
                renderTo: chart_div,
                type: 'column'
            },
            title: {
                text: 'My current level'
            },
            subtitle: {
                text: 'Source: Personis Server'
            },
            xAxis: {
				     type: 'datetime',
				     tickInterval: 1 * 24 * 3600 * 1000, // one day
				     tickWidth: 0,
				     gridLineWidth: 1,
				     labels: {
				        align: 'left',
				        x: 3,
				        y: -3 
				 }
			},
            yAxis: {
                min: 0,
                title: {
                    text: 'Steps per day'
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
                        this.x +': '+ this.y +' steps';
                }
            },
            plotOptions: {
                column: {
                    pointPadding: 0.2,
                    borderWidth: 0
                }
            },
            series: [{
                name: 'Walked steps',                
            }]
        };
        options.series[0].data = myArray;        
        var chart = new Highcharts.StockChart(options);
}
function getStepGoal(chart_div){
         chart = new Highcharts.Chart({
            chart: {
                renderTo: chart_div,
                type: 'column'
            },
            title: {
                text: 'Stacked column chart'
            },
            subtitle: {
                text: 'Source: Personis Server'
            },
            xAxis: {
                //categories: ['Apples', 'Oranges', 'Pears', 'Grapes', 'Bananas']
                 type: 'datetime',
				 tickInterval: 1 * 24 * 3600 * 1000, // one week
				 tickWidth: 0,
				 gridLineWidth: 1,
				 startOfWeek: 1,
				 labels: {
				    align: 'left', 
				    formatter: function() {
				        return Highcharts.dateFormat('%a %e %b', this.value); 
				    },                   
				 },
				//categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        			//min: 6
                minrange: 3600000,      
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Steps per day'
                },
                stackLabels: {
                    enabled: true,
                    style: {
                        fontWeight: 'bold',
                        color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
                    }
                }
            },
            legend: {
                align: 'right',
                x: -100,
                verticalAlign: 'top',
                y: 20,
                floating: true,
                backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColorSolid) || 'white',
                borderColor: '#CCC',
                borderWidth: 1,
                shadow: false
            },
            tooltip: {
                formatter: function() {
                    return '<b>'+ this.x +'</b><br/>'+
                        this.series.name +': '+ this.y +'<br/>'+
                        'Total: '+ this.point.stackTotal;
                }
            },
            plotOptions: {
                column: {
                    stacking: 'normal',
                    dataLabels: {
                        enabled: true,
                        color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white'
                    }
                }
            },
            series: [{
                name: 'Goal steps',                
            }, {
                name: 'Walked steps',                
            }]
        });
    
}
function getGoalPieChart(chart_div,myArray,titleText,seriesName)
{
	     /*  Highcharts.getOptions().colors = $.map(Highcharts.getOptions().colors, function(color) {
            return {
                radialGradient: { cx: 0.5, cy: 0.3, r: 0.7 },
                stops: [
                    [0, color],
                    [1, Highcharts.Color(color).brighten(-0.3).get('rgb')] // darken
                ]
            };
        });*/
        
        // Build the chart
        
        var options = {
            chart: {
                renderTo: chart_div,
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false
            },
            title: {
                text: titleText
            },
            tooltip: {
                formatter: function() {
                    return '<b>'+ this.point.name +'</b>: '+ Math.round(this.percentage) +' %';
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
                type: 'pie',
                name: seriesName
                
                
            }]
        };
        options.series[0].data = myArray;
        chart = new Highcharts.Chart(options);
}
$(document).ready(function() {initGoalOptions();});
//]]>
