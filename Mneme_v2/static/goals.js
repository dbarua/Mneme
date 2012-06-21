//<![CDATA[
new_goal = "";
var value="",height ;  
var goallist = [], goal_unitlist = [], default_list = [], duration = []; 
var prev_height;
function initGoalOptions() {
        $('#create_goal').click(function(){
                       console.log("Set Goals clicked...");
                       getGoals('Fitbit');
                       return false;
                   });
        $('#goalboxclose').click(function(){
                    height = parseInt($('#set_goal_box').height())+100; 
                    $('#set_goal_box').animate({'top':'-800px'},500,function(){
                       $('#overlay').fadeOut('fast');
                    });
                });

		      $("#goal select").change(function () {
			    var goal = "";
		            $("#goal select option:selected").each(function () {
				     goal = $(this).text();
		                     var index = -1;
		                     if(goal.indexOf('current') == -1){
		                         $('#set_goal_box').height(520); 
		                     }
                                     else{
					 $('#set_goal_box').height(400); 
                                     }   
                                     $("#notify input").each(function() {                             
						$(this).attr("checked",false);
				      }); 	
                                     //$(".hideable").hide('slow');	                                 

		                     for(var i =0; i < goallist.length; i++){
		                         index = goallist[i].indexOf(goal);                                
		                         console.log(index);
		                         if (index != -1) {
		   		           $('#goal_desc').text(goallist[i][1]); 
		                           console.log(goallist[i][1]); 
                                           //$(".hideable").hide('slow'); 
		                           //$('div.expander').expander();                                                                
		                           if (goal_unitlist[i][0] != 'none'){
		                              console.log(goal_unitlist[i]);
		                              console.log(default_list[i]);
		                              $('#goal_quantity').text(goal_unitlist[i][0]);
		                              $('#quantity').val(default_list[i][0]); 
					      $('#span_q').attr('title',default_list[i][1]);
		                              $('#after_q').text(goal_unitlist[i][1]);
		                              $('#goal_time').text(goal_unitlist[i][2]);
		                              $('#time').val(default_list[i][2]); 
					      $('#span_t').attr('title',default_list[i][3]);
		                              $('#after_t').text(goal_unitlist[i][3]);
		                              $('#number').show('slow'); 
		                           }
		                           else{
					      $('#number').hide('slow'); 
		                    	   }
		                           $('#duration').val(duration[i][0]);
		                           $('#span_duration').attr('title',duration[i][1]);
		                             /* $('#goal_time').text(goal_unitlist[index][1]);
		                              $('#time').val(default_list[index][1]); 
		                              $('#repeat-label').text(weekday_list[index][0]);*/
		                        }
		                     }
	             });  
                }).trigger('change'); 

        $('#addgoal').click(function(){
                        new_goal="";
			$("#goal select option:selected").each(function () {
		             new_goal += $(this).text();
                             
  		        });                        
			 $('#from').val('');
                         $('#to').val('');
                         /*if(new_goal.indexOf('current')== -1){
				$('#set_goal_box').height(700); 
                         }*/  
			 $("#repeat input").each( function() {                             
				$(this).attr("checked",false);
			});
			 $("#notify input").each( function() {                             
				$(this).attr("checked",false);
			}); 

			$.ajax({  
			    type: "POST",  
			    url: "/set_goals?goal="+new_goal,  
			    data: "",  
                            processdata:true,
			    success: function(data){
  							$("#dialog").dialog("destroy");                
							$('#set_goal_box').animate({'top':'-800px'},500,function(){
							       $('#overlay').fadeOut('fast');
							});
				                        $("#dialog-message").text(data);					    
							$("#dialog-message").dialog({
									modal: true,
									buttons: {
										Ok: function() {
										       //newUnregApplist();
				                                                       $(this).dialog('close');
				                                
				                                              }
				                                             
									}
                                                                                        
					                   });                                      
                                }
                        });
                                                                       

                });// end of addgoal.click
                $('#mail_notify').live('click', function(e){
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

                 });


 }

function getGoals(appname){ 		                                                                         
                                                                    
                     
	              $.ajax({  
			    type: "POST",  
			    url: "/get_goals_json?appname="+appname,  
			    data: "",  
                            processdata:true,
			    success: function(data){
					   console.log(eval(data));	   					   				
                                           sublist = eval(data);
					   var e = document.getElementById('goal_list');
					   var i = 0;
                                           $.each(sublist, function (itemNo, item) { 
                                                  console.log(item.goal);
                                                  console.log(item.goal_unit);
                                                  console.log(item.default_val);
                                                  if(item.goal) goallist[i] = eval(item.goal);                                                       
                                                  else  goallist[i] = ['none'];                                                  
				                  e.options[i] = new Option(goallist[i][0],goallist[i][0]);     
                                                  if(item.duration) duration[i] = eval(item.duration);
                                                  else  duration[i] = ['none'];                                                  
                                        
                                                  if(item.goal_unit) goal_unitlist[i] = eval(item.goal_unit);
                                                  else  goal_unitlist[i] = ['none'];                                                  
                                                  if(item.default_val) default_list[i] = eval(item.default_val);
                                                  else  default_list[i] = ['none'];                                                  
						  
                                                  i++;                                                  
	    		                      }); 
                                           console.log(goallist);
 				},                        
		       });  //end of ajax call
               
                       $('#overlay').fadeIn('fast',function(){
		  	     console.log("Block overlay..."); 
			     $('#set_goal_box').height(400); 
			     $('#set_goal_box').width(450);
                             $('.hideable').hide();
                             $("#notify input").each( function() {                             
				  $(this).attr("checked",false);
			     }); 
			     $('#set_goal_box').animate({'top':'20px'},500);
                             $('#goal_desc').text(goallist[0][1]);  
		             $('#set_goal_box').draggable();  	 	    
  	           }); 


}
function getGoalRecords(note){
		      	var action_url = '/show_goals';
                        var chart_div = 'container';    
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
			 getGoalVisual(chart_div, myDataArray);
                      }); 

}
function getGoalVisual(chart_div, myArray) {

	var options;
        var myContent = '<div id="my_content"><br/>Sticky Notes:<input type="text" id="sticky_notes" class="sticky"/><br/><input type="button" value="Save" id="save_comment" onclick="saveNotes(); return hs.close(this);"/></div>';
        
        options = {
			    chart: {
				renderTo: chart_div,
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
$(document).ready(function() {initGoalOptions();});
//]]>
