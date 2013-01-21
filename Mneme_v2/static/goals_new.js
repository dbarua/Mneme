//<![CDATA[
new_goal = "";
var value="",height ;  
var goallist = [], goal_unitlist = [], default_list = [], duration = []; 
var prev_height;
var types = ['DOMMouseScroll', 'mousewheel'];
var log_events = [], log_index = 0;
var goal_attr_values = ['Not set','','Very low','','Low','','Medium','','High','','Very high'];
function initGoalOptions() {
	 	/*$(document).ajaxSend(function(event, request, settings) {
					$('.myloading').show();
		 	   });
		 
        $(document).ajaxComplete(function(event, request, settings) {
		       		$('.myloading').hide();
		 	   });*/
		
        /*$( ".slider" ).slider({
        		range: "min",
	            value:0,
	            min: 0,
	            max: 100,
	            step: 20,
	            slide: function( event, ui ) {
	            	var div = $(this).attr('data-div-id');
	            	console.log(ui.value);
	            	var value = (ui.value).toString();
	            	var index = parseInt(value.split('')[0]);
	            	if(index == 1) 
	            	   index = 10;
	                $( "#"+div ).text(values[index]);
	                var comment = "notice_Advanced setting slider:"+div+" click event";
		    		log_events[log_index++] = comment; 
	            }
        });*/

        $('#create_goal').click(function(){
                       console.log("Set Goals clicked...");
                       getGoals('Fitbit',"");
                       return false;
                   });
         
        $('#goalboxclose').click(function(){
	       	var comment = "notice_Goal Setting: Close goal setting box click event";
		    log_events[log_index++] = comment; 

            var height = parseInt($('#set_goal_box').height())+100; 
                    $('#set_goal_box').animate({'top':'-800px'},500,function(){
                       $('#overlay2').fadeOut('fast');
                    });
                });
        $(".stepButtons").click(function(){
        	var type = $(this).attr('id');
        	var comment = "notice_Goal Monitoring: View step goals for "+type;
	 	    log_events[log_index++] = comment; 
  
        	//alert("Show "+type);
        	getGoaldata(type);
        });        
        $('#confirmboxclose, #okbutton').click(function(){
                    //height = parseInt($('#set_goal_box').height())+100; 
                    $('#confirm_goal_set').animate({'top':'-800px'},500,function(){
                       $('#overlay2').fadeOut('fast');                       
                        document.location.href = "/browse";
                    });
        });        
                
        $('.goals').click(function(){
        	var goal = $(this).attr('data-div-id');
        	var app =  $(this).attr('id');
        	//alert("Mygoal "+goal+" for app "+app);
        	$('#advanced_question').hide();
        	var comment = "notice_Goal Setting: Set goals button click event";
		    log_events[log_index++] = comment; 
        	getGoals(app,goal,"new");
        	
        });

        $('input.revisegoals').click(function(){
        	var goal = $(this).attr('data-div-id');
        	var app =  $(this).attr('id');
        	//alert("Mygoal "+value);
        	var comment = "notice_Goal Setting: Revise goal button click event";
		    log_events[log_index++] = comment; 
       	    reviseGoals(app,goal,"revise");        	          	  
        });        

        $('.historicbutton').click(function(){
        	var form = $(this).attr('data-div-id');
        	var value = $(this).val();
        	//alert(value);
        	var comment = "notice_Long term monitoring: Historic chart view click event";
		    log_events[log_index++] = comment; 
         	if(value.indexOf('historic') != -1){        	  
	        	  $(this).val('Back to current chart');
	        	  historicChart(form);
	        	  $('.stepButtons').hide('slow');
        	}else{
	        	  $(this).val('Go to historic chart');	
	        	  getGoaldata("none");
	        	  $('.stepButtons').show('slow');
        	}  

        	
        });
		$('.details').click(function(){
        	var goal = $(this).attr('data-div-id');
        	var app =  $(this).attr('id');
        	var comment = "notice_Goal Setting: Goal details button click event";
		    log_events[log_index++] = comment; 
        	getGoalDetails(app,goal);
        	
        });
        
        $('#advanced_header').click(function(e){
        	//alert("Start");
        	var comment = "notice_Goal Setting: Advanced goal setting click event";
		    log_events[log_index++] = comment; 

        	$('#advanced_question').toggle('slow');
        	$('#set_goal_box').height(620);
        	$('#set_goal_box').animate({'top':'20px'},500);
        });
        $('#addgoal').live('click',function(e){
        	$('.myloading').show();
            var new_goal="";
			var comment = "notice_Goal Setting: Save goal button click event";
		    log_events[log_index++] = comment; 

			new_goal = $('#addgoal').attr('title')+",";
			new_goal += $('#duration').val()+",";
			new_goal += $("select#weekday_list option:selected").val()+",";
			if(new_goal.indexOf('Current') == -1){
	            new_goal += $('#quantity').val()+" "+$('#after_q').text()+",";
	            new_goal += $('#time').val()+" "+$('#after_t').text()+",";
	        }
	        else{
	        	new_goal += "no quantity,no time,"
	        }    
            console.log("I am here:"+new_goal);
            if($('#notify input#email_input').val()!="")
               new_goal += $('#notify input#email_input').val()+",";
            else   
               new_goal += "no email,";
               
            if($('#notify input#twitter_input').val()!="")
               new_goal += $('#notify input#twitter_input').val()+",";
            else   
               new_goal += "no twit,";
               
            new_goal += $("select#week_list option:selected").val()+",";
           		    
			
            new_goal += $('#addgoal').attr('data-div-id')+",";
            
            var value = $('#goal_difficulty_slide').slider("value");
            console.log("Slider importance"+value);
            //console.log($('#goal_commitment_slide').slider("value"));
            //console.log($('#goal_efficacy_slide').slider("value"));
            
            new_goal += $('#goal_commitment_silde').slider("value")+",";                       
            new_goal += $('#goal_efficacy_slide').slider("value")+","; 
            new_goal += $('#goal_difficulty_slide').slider("value");

			//alert(new_goal);
			//$('#set_goal_box form').text("Please wait this will take a while....");
			$('#set_goal_box').animate({'top':'-800px'},500);
			
			$.ajax({  
			    type: "POST",  
			    url: "/set_goals?newgoal="+new_goal,  
			    data: "",                              
			    success: function(data){
				            if(data.indexOf('Error') == -1)
							     document.location.href = "/browse";								
						    else{
						    	$('#confirm_goal_set div').text(data);
						    }                          
							$('#overlay2').fadeOut('fast');		                          
                         }
                     });
                                                                       

                });// end of addgoal.click
                

 }

function show_goal_monitorpanel(newgoal){
	         $('#'+newgoal+"monitor").show('slow');
			 $('#'+newgoal).hide('slow');
			 $('#'+newgoal+"Chart").show();
			 //$('#current_step_div').show();
			
}

function getGoalDetails(appname,goal){ 		                                                                         
                                                                    
               var data = appname+"."+goal; 
               //alert("WIP: Goal "+goal+" for app "+appname); 
               var comment = "notice_Goal Setting: Get goal details ajax call";
			   log_events[log_index++] = comment; 
  
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
					   if(value == 'Hide details') 
					      $('#'+goal+" input.details").val('More about this goal');
					   else  				   				
					      $('#'+goal+" input.details").val('Hide details');
                        
 				    },                        
		       });  //end of ajax call
               
              
          

}
function getGoals(appname,goal,form){ 		                                                                         
                $('.revise_goal').hide();  
                var comment = "notice_Goal Setting: Get goal defaults ajax call";
 			    log_events[log_index++] = comment; 

                var data = appname+"."+goal; 
                //alert("WIP: Goal "+goal+" for app "+appname);
               	$('#addgoal').attr('title',goal);
               	$('#addgoal').addClass('button');
               	
        	    $('#addgoal').attr('data-div-id',appname);	
                //$('div.myBox').attr("id",goal);
                var url = ""
                if(form == "new")
                   url = "/get_goals_json?data="+data;
                else{
                   url = "/revise_goals_json?data="+data;
                   console.log(form);
                  }   
               console.log(goal);  
	           $.ajax({  
				    type: "POST",  
				    url: url,  
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
		                      $('#set_goal_box').height(500); 
		                      
		                              
					   }
					   else{
					   	$('#number').hide('slow'); 
					   	$('#set_goal_box').height(400); 
					   }
					$('#goal_commitment_silde').slider("value",0);                       
            		$('#goal_efficacy_slide').slider("value",0); 
            		$('#goal_difficulty_slide').slider("value",0);   
					$('#overlay2').fadeIn('fast',function(){
				  	     console.log("Block overlay..."); 
					     
					     $('#set_goal_box').width(450);
		                 //$('#number').hide();
		                 $("#notify input").each( function() {                             
							   $(this).attr("checked",false);
					     }); 
					     $('#set_goal_box').animate({'top':'60px'},500);
		                 $('#set_goal_box').draggable();  	 	    
			  	        });   
 				    },                        
		       });  //end of ajax call

}		       

function reviseGoals(appname,goal,form){ 		                                                                         
                                                                    
                var data = appname+"."+goal; 
                var comment = "notice_Goal Setting: Get my previous goal details ajax call";
			    log_events[log_index++] = comment; 
                
                //alert("WIP: Goal "+goal+" for app "+appname);
               	$('#addgoal').attr('title',goal);
               	$('#addgoal').addClass('button');
               	
        	    $('#addgoal').attr('data-div-id',appname);	
                //$('div.myBox').attr("id",goal);
                var url = ""
                url = "/revise_goals_json?data="+data;
                console.log(form);
                console.log(goal);  
	            $.ajax({  
				    type: "POST",  
				    url: url,  
				    data: "",  
	                processdata:true,
				    success: function(resp){
					   //items = eval(data);
					   console.log(resp);	
					   getGoalsAndProcess(resp,data);
 				    },                        
		       });  //end of ajax call

}
function getGoalsAndProcess(result,data){
	     var my_goal = eval(result)
	     console.log(my_goal[0].myGoal);
	     var my_goal = (my_goal[0].myGoal).split("_");	     
         var url = "/get_goals_json?data="+data;
         $.ajax({  
		    type: "POST",  
		    url: url,  
		    data: "",  
	        processdata:true,
	        success: function(resp){
					   
					   console.log(resp);	
					   items = eval(resp);
					   var goal_details = [];
					   
					   goal_details = eval(items[0].goal);
					   console.log(goal_details);					   
					   goal_duration = eval(items[0].duration);
					   console.log(goal_duration);					   
					   
					   //---This is just to show my previous goal in label instead of input boxes
					   //$('.revise_goal').show(); 
					   //$('#my_duration').text(my_goal[0]+". Change it to:");
					   
					   $('#goal_title').text(goal_details[0]);
					   $('#span_desc').attr('title',goal_details[1]);					   
					   $('#duration').val(my_goal[0]);
					   $('#span_duration').attr('title',goal_duration[1]);
					  
					   if(goal_details[0].indexOf('current') == -1){
						      goal_unit = eval(items[0].goal_unit);					   
						   	  defaults = eval(items[0].default_val);
						   	  console.log(goal_unit);
						   	  console.log(defaults);
						   	  $('#goal_quantity').text(goal_unit[0]+"*");
		                      $('#quantity').val(my_goal[1].split(' ')[0]); 
		                      
					      	  $('#span_q').attr('title',defaults[1]);
		                      $('#after_q').text(goal_unit[1]);
		                      
		                      $('#goal_time').text(goal_unit[2]+"*");
		                      $('#time').val(my_goal[2].split(' ')[0]); 
		                      					      	  
					      	  $('#span_t').attr('title',defaults[3]);
		                      $('#after_t').text(goal_unit[3]);
		                      
		                      //---This is just to show my previous goal in label instead of input boxes
							  //$('#my_quantity').text(my_goal[1]+". Change it to:");		                      
		                      //$('#my_time').text(my_goal[2]+". Change it to:");

		                      $('#number').show('slow');
		                       
		                      //$('#set_goal_box div#number').show(); 
		                      $('#set_goal_box').height(500); 
		                      
		                              
					   }
					   else{
					   		  $('#number').hide('slow'); 
		  				      $('#set_goal_box').height(400); 		  				      
					   }
		  			 //---This is just to show my previous goal in label instead of input boxes
		             //$('#my_notify_email').text(my_goal[3]+". Change it to:");
		             //$('#my_notify_twit').text(my_goal[4]+". Change it to:");
		             //$('#my_notify_time').text(my_goal[5]+". Change it to:");
					   

					 //----- Add my email, twit, feedback frequency.
					 if(my_goal[3] != "no email")
					    $('#email_input').val(my_goal[3]);
					 if(my_goal[4] != "no twit")
		                $('#twit_input').text(my_goal[4]);
		             $('#week_list option[value='+ my_goal[5] +']').attr('selected', 'selected');
		             
		            //----- Add my commitment, efficacy and difficulty.
   					$('#goal_commitment_silde').slider("value",my_goal[6]); 
   					var index = parseInt(my_goal[6] / 10);
   					$( "#goal_commit_label" ).text(goal_attr_values[index]);
	                                     
            		$('#goal_efficacy_slide').slider("value",my_goal[7]);
            		index = parseInt(my_goal[7] / 10); 
            		$( "#goal_efficacy_label" ).text(goal_attr_values[index]);
            		
            		$('#goal_difficulty_slide').slider("value",my_goal[8]);
            		index = parseInt(my_goal[8] / 10);   
					$( "#goal_difficulty_label" ).text(goal_attr_values[index]);
					
   					//----- Show the goal setting box
					$('#overlay2').fadeIn('fast',function(){
				  	     console.log("Block overlay..."); 					     
					     $('#set_goal_box').width(450);
		                 $("#notify input").each( function() {                             
							   $(this).attr("checked",false);
					     }); 
					     $('#set_goal_box').animate({'top':'60px'},500);
		                 $('#set_goal_box').draggable();  	 	    
			  	        });  
 				    },                        
		       });  //end of ajax call	
}
function manageCurrentGoalPanel(){
	var button_array = ["calories_button","steps_button","active_button"];
	
	$('.curgoal').live('click',function(e){
	   var index;
	   for(var i = 0;i<button_array.length;i++){
	          var div_id = $('#'+button_array[i]).attr('data-div-id');
	          $('#'+div_id).hide('fast');
	          if($('#'+button_array[i]).hasClass('pressedbutton')){
		          $('#'+button_array[i]).removeClass('pressedbutton');
		          $('#'+button_array[i]).addClass('button');	          	
	          }  	  	 	  	  

	   }	
	   for(var i = 0;i<button_array.length;i++){

	   	  if($(this).attr('id') == button_array[i]){
	   	  	  index = i;
	          var div_id = $(this).attr('data-div-id');
	          var chart = $(this).attr('data-chart');
	          var type = $(this).attr('title');
	          $('#'+div_id).show('fast');
	          $(this).removeClass('button');
	          $(this).addClass('pressedbutton');
	          console.log("button pressed:"+type+"chart type"+chart+"showing on div"+div_id); 
	          width = ($(window).width() * 56.5)/100;
	          getCurrentGoalDisplayNew(type,chart,div_id,width);	  	  

	   	  }
	   	  
	   }
	   	
	});
}
var width;
function getCurrentGoalDisplayNew(type,chart,div,width){
	    myData = [];
		jQuery.getJSON('/show_current_goal?data='+type, null, function (items) {
			     console.log(eval(items)); 
			     var newgoal = "Current level goal";    
                 console.log("Showing chart for "+newgoal);	
			     
			     //console.log("Length:"+items.length);
			     if(items){
	 		     	 items = eval(items);
				     if(items.length != 0){  
				      $('#CurrentLevelGoalmonitor').text(newgoal+": Here is the graph to monitor your progress. This chart is based on your last week's Fitbit data.");
				     }
				     else{
	  			        $('#CurrentLevelGoalmonitor').text(newgoal+": No Fitbit data found");
				     }
			     
			         for(var k = 0; k < items.length; k++){                                      
                       console.log("My data:"+items[k]);
                       if (type == "steps")
					      myData.push([Date.UTC(items[k].year,items[k].month - 1,items[k].day),parseFloat(items[k].steps)]);
                       else if (type == "calories")
					      myData.push([Date.UTC(items[k].year,items[k].month - 1,items[k].day),parseFloat(items[k].calories)]);
                       else 
                          /*roundupto = Math.pow(10,14);
                          console.log(roundupto)
                          active_mins = Math.round(item.active_mins * roundupto)/roundupto;
                          console.log(active_mins);*/
                          myData.push([items[k].activity_level,Math.round(parseFloat(items[k].active_mins))]);                          
                    }
                       
                  } 
                       if(type == 'steps') 
                          getCurrentGoalChart(div, chart, myData, 'Steps walked in seven days','Steps/day','Steps',width);
                       if(type == 'calories') 
                          getCurrentGoalChart(div, chart, myData, 'Calories burned in seven days','Caloreis Burned/day','Calories burned',width);
                       else if(type=='active_mins')  
                          getGoalPieChart(div,myData,'Avearge active minutes in seven days','Active minutes',width);
                          
                       show_goal_monitorpanel("CurrentLevelGoal");
		                
            });
		
	}
function getGoaldata(past_next){
	     var mySteps = [], myDataArray = [], myRemainSteps = [], myExceedSteps = [], myPrevRemainSteps = [], myGoalSteps = [], myNotes = [];
	     var width = $(window).width();
	     width = ($(window).width() * 56.5)/100;
		 console.log("found the width"+width);
		 var past_next = "none", prev_goal = 0;
	     jQuery.getJSON('/show_step_goal?data='+past_next, null, function (items) {
			     console.log(eval(items));  
			     var newgoal = "Step goal";    
                 console.log("Showing chart for "+newgoal);	
                 data = eval(items);
                 
			     if(data.length != 0){  
			      $('#StepGoalmonitor').text(newgoal+": Here is the graph for monitoring your progress towards this goal. This chart is based on your Fitbit data.");
			     }
			     else{
  			        $('#StepGoalmonitor').text(newgoal+": No Fitbit data found");
			     }
			     	                              
	               for(var k = data.length-1; k >= 0; k--){
	               	   item = data[k];                                      
                       console.log(item);
                       if(item.remain < 0){
                       	     var cur_goal = item.steps + item.remain;
                       	     var cur_remain = Math.abs(item.remain);
	                       	 mySteps.push({y: parseFloat(cur_goal), color:'#63B8FF', name:'Steps walked by me reaching <br/>my current step goal'});
	                       	 myPrevRemainSteps.push(parseFloat(0));
	                       	 myRemainSteps.push({y:parseFloat(cur_remain), color:'#89A54E', name:'Steps walked by me exceeding <br/>my current step goal'});
							 
							 /*mySteps.push([Date.UTC(item.year,item.month - 1,item.day),{y: parseFloat(cur_goal), color:'#45CCCC'}]);
	                       	 myPrevRemainSteps.push([Date.UTC(item.year,item.month - 1,item.day),parseFloat(0)]);
	                       	 myRemainSteps.push([Date.UTC(item.year,item.month - 1,item.day),{y:parseFloat(-item.remain), color:'#89A54E'}]);*/	                       	 
                       }
                       else{                       	 
                       	 if(item.prev_remain < 0){
                       	     prev_goal = item.steps + item.prev_remain;
                       	     var cur_remain = item.remain + item.prev_remain;
                       	     var prev_remain = Math.abs(item.prev_remain);   
	                       	 mySteps.push({y: parseFloat(prev_goal), color:'#63B8FF', name:'Steps walked by me reaching <br/>my previous step goal'});
	                       	 myPrevRemainSteps.push({y:parseFloat(prev_remain), color:'#009ACD', name:'Steps walked by me exceeding <br/>my previous step goal'});
	                       	 myRemainSteps.push({y:parseFloat(item.remain), color:'#FFFFFF', name:'Remaining steps counts for <br/>my current step goal'});                       	 	

	                       	 /*mySteps.push([Date.UTC(item.year,item.month - 1,item.day),{y: parseFloat(prev_goal), color:'#45CCCC'}]);
	                       	 myPrevRemainSteps.push([Date.UTC(item.year,item.month - 1,item.day),{y:parseFloat(-item.prev_remain), color:'#4572A7'}]);
	                       	 myRemainSteps.push([Date.UTC(item.year,item.month - 1,item.day),{y:parseFloat(cur_remain), color:'#FFFFFF'}]);*/                       	 	
                       	 }
                       	 else{                       	    
                       	     var cur_remain = item.remain - item.prev_remain;   
	                       	 mySteps.push({y: parseFloat(item.steps), color:'#63B8FF', name:'Steps walked by me'});
	                       	 if(parseFloat(items.steps) < 50){
	                       	   myPrevRemainSteps.push({y:parseFloat(item.prev_remain), color:'#FFF', name:'Remaining steps counts for <br/>my previous step goal'});
	                       	 }else{
	                       	   myPrevRemainSteps.push({y:parseFloat(item.prev_remain), color:'#CCC', name:'Remaining steps counts for <br/>my previous step goal'});
	                       	 }
	                       	 myRemainSteps.push({y:parseFloat(cur_remain), color:'#FFFFFF', name:'Remaining steps counts for <br/>my current step goal'});                       	 	

	                       	 /*mySteps.push([Date.UTC(item.year,item.month - 1,item.day),{y: parseFloat(item.steps), color:'#45CCCC'}]);
	                       	 myPrevRemainSteps.push([Date.UTC(item.year,item.month - 1,item.day),{y:parseFloat(item.prev_remain), color:'#4E4E4E'}]);
	                       	 myRemainSteps.push([Date.UTC(item.year,item.month - 1,item.day),{y:parseFloat(cur_remain), color:'#FFFFFF'}]);*/                       	 	
                       	 	
                       	 }
                       }
					   /*mySteps.push([Date.UTC(item.year,item.month - 1,item.day),parseFloat(item.steps)]);
					   myPrevRemainSteps.push([Date.UTC(item.year,item.month - 1,item.day),parseFloat(item.prev_remain)]);
					   myRemainSteps.push([Date.UTC(item.year,item.month - 1,item.day),parseFloat(item.remain)]);*/
					    myExceedSteps.push({y:parseFloat(item.prev_target),name:'Previous goal',color:'green'});
					    myGoalSteps.push({y:parseFloat(item.cur_target),name:'Current goal',color:'red'});
					    myNotes.push(item.notes);
                   }
                        myDataArray.push(mySteps);
                        myDataArray.push(myPrevRemainSteps);
		                myDataArray.push(myRemainSteps);
		                myDataArray.push(myExceedSteps);
		                myDataArray.push(myGoalSteps);
        		        mySeriesName = ['Steps','Prev Remaining','Remaining steps','Exceeding steps'];
        		        var start_date = Date.UTC(data[6].year,data[6].month - 1,data[6].day);                                                                       		           						                        		               
            			getStepGoalChart("StepGoalChart", "column", myDataArray, start_date, 'Steps walked in seven days','Steps/day',mySeriesName,width,myNotes);                                               		           						                        		               
            
		                $('#StepGoalmonitor').show('slow');
			 			$('#StepGoal').hide('slow');
			 			$('#StepGoalChart').show(); 
			 			$('#stepButtons').show();
                                                        		           						                        		               
            });
}	

function historicChart(form){
	     var myActivity = [], myDataArray = [], myGoals = [];
	     var width = $(window).width();
	     width = ($(window).width() * 56.5)/100;
		 console.log("found the width"+width);
	     jQuery.getJSON('/show_historic_graph?data='+form,null,function(items) {
		   $.each(items, function (itemNo, item) {                                                                 
			    myActivity.push([Date.UTC(item.year,item.month - 1,item.day),parseFloat(item.activity)]);
				myGoals.push([Date.UTC(item.year,item.month - 1,item.day),parseFloat(item.goal)]);							                      
			});
                myDataArray.push(myActivity);
	            myDataArray.push(myGoals); 
	            mySeriesName = ['Activity','Goal'];    
	            console.log(myDataArray[0]);
	            console.log(myDataArray[1]);  
	            getHistoricGoalChart("StepGoalChart", "line", myDataArray, 'Historic Goals and Activity','Steps/day',mySeriesName,width);
         });

}
function getCurrentGoalChart(chart_div,chart_type,myArray,titleText,yAxisTitle,seriesName,width)
{
	 
	 console.log("Current screen width:"+width);
	 console.log("preparing highchart graph"+ myArray); 
	 var options = {
            chart: {
                renderTo: chart_div,
                type: chart_type,
                width: width             
            },
            title: {
                text: titleText
            },
            subtitle: {
                text: 'source: Personis-Fitbit'
            },
            xAxis: {
            	type: 'datetime',
            	dateTimeLabelFormats: { 
					day: '%a, %e. %b'
					/*year: '%Y'*/
	               },
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


         
		/*chart.setSize(
		       $("#"+chart_div).width()/2, 
		       $("#"+chart_div).height(),
		       false
		    );   
		*/
        
       //mouseWheelHandler(chart_div);

       /* var mouseDown = 0;
        $('#'+chart_div).mousedown(function() {
    		mouseDown = 1;
		});

		$('#'+chart_div).mouseup(function() {
		    mouseDown = 0;
		});

        $('#'+chart_div).mousemove(function(e) {
	         if (mouseDown == 1) {
	         if (e.pageX > lastX) {
	            var diff = e.pageX - lastX;
	            var xExtremes = chart.xAxis[0].getExtremes();
	            chart.xAxis[0].setExtremes(xExtremes.min - diff, xExtremes.max - diff);
	         }
	         else if (e.pageX < lastX) {
	            var diff = lastX - e.pageX;
	            var xExtremes = chart.xAxis[0].getExtremes();
	            chart.xAxis[0].setExtremes(xExtremes.min + diff, xExtremes.max + diff);
	         }
	
	         if (e.pageY > lastY) {
	            var ydiff = 1 * (e.pageY - lastY);
	            var yExtremes = chart.yAxis[0].getExtremes();
	            chart.yAxis[0].setExtremes(yExtremes.min + ydiff, yExtremes.max + ydiff);
	        }
	        else if (e.pageY < lastY) {
	            var ydiff = 1 * (lastY - e.pageY);
	            var yExtremes = chart.yAxis[0].getExtremes();
	            chart.yAxis[0].setExtremes(yExtremes.min - ydiff, yExtremes.max - ydiff);
	        }
	    }
	    lastX = e.pageX;
	    lastY = e.pageY;
   	});*/
   
}
var setZoom = function() {

		    var xMin = chart.xAxis[0].getExtremes().dataMin;
		    var xMax = chart.xAxis[0].getExtremes().dataMax;
		    var yMin = chart.yAxis[0].getExtremes().dataMin;
		    var yMax = chart.yAxis[0].getExtremes().dataMax;
		   
		
		    chart.xAxis[0].setExtremes(xMin + (1 - zoomRatio) * xMax, xMax * zoomRatio);
		    chart.yAxis[0].setExtremes(yMin + (1 - zoomRatio) * yMax, yMax * zoomRatio);
		};

function handler(event) {
    var orgEvent = event || window.event, args = [].slice.call( arguments, 1 ), delta = 0, returnValue = true, deltaX = 0, deltaY = 0;
    event = $.event.fix(orgEvent);
    event.type = "mousewheel";
    
    // Old school scrollwheel delta
    if ( event.wheelDelta ) { delta = event.wheelDelta/120; }
    if ( event.detail     ) { delta = -event.detail/3; }
    
    // New school multidimensional scroll (touchpads) deltas
    deltaY = delta;
    
    // Gecko
    if ( orgEvent.axis !== undefined && orgEvent.axis === orgEvent.HORIZONTAL_AXIS ) {
        deltaY = 0;
        deltaX = -1*delta;
    }
    
    // Webkit
    if ( orgEvent.wheelDeltaY !== undefined ) { deltaY = orgEvent.wheelDeltaY/120; }
    if ( orgEvent.wheelDeltaX !== undefined ) { deltaX = -1*orgEvent.wheelDeltaX/120; }
    
    // Add event and delta to the front of the arguments
    args.unshift(event, delta, deltaX, deltaY);
    
    return $.event.handle.apply(this, args);
}
var imagesMap = {};
var mynotes = [];
function getStepGoalChart(chart_div,chart_type,myArray,start_date,titleText,yAxisTitle,seriesName,width,mynotes){
	var target = 10000;
	console.log(mynotes);
	window.mynotes = mynotes;
	var options = {
            chart: {
                renderTo: chart_div,
                //type: chart_type,
                width: width,
		        height: 400,
                events: {
		            load: drawImages,//(mynotes),
		            //redraw: alignImages
		        }
            },
            title: {
                text: titleText,
                margin: 50
            },
            subtitle: {
                text: 'source: Personis-Fitbit'
            },
            xAxis: {
            	type: 'datetime',
            	dateTimeLabelFormats: { 
					day: '%a, %e. %b'
					/*year: '%Y'*/
	               },
				tickInterval: 1 * 24 * 3600 * 1000, // one day
				tickWidth: 0,
				gridLineWidth: 1,
				/*labels: {
		            x: 100,
		            useHTML: true,
		            formatter: function () {
		                return '<img src="/home/chai/Mneme/Mneme_v2/static/images/emblem_note.png"><img>';
		            }
		        }*/
				/*labels: {
				        align: 'left',
				        x: 3,
				        y: 3 
                }*/
            },
            yAxis: {
                min: 0,
                title: {
                    text: yAxisTitle
                },  
            },            
            legend: {
          	  enabled: false
        	},          
        	tooltip: {
                formatter: function() {
                    return Highcharts.dateFormat('%e. %b', this.x)+ '<br/>' + this.point.name +' is <br/> '+ this.y;
                }
            },
            plotOptions: {
                column: {
                    stacking: 'normal',                
				    cursor: 'pointer',
				    point: {
				    events: {
				    click: function() {
						      hs.htmlExpand(null, {
								pageOrigin: {
								   x: this.pageX, 
								   y: this.pageY
								},
								headingText: "Sticky Notes",
								maincontentText: Highcharts.dateFormat('%e. %b %Y', this.x) +':<br/> '+ 								    
		                           '<br/><textarea rows="5" cols="35" id="stepgoal_notes_'+ this.x +
		                           '"></textarea><br/><input type="button" class="button stepnotes_button" value="Save" onclick="saveNotes('+ this.x +'); return hs.close(this);"/>',
								width: 300,
								height:220
						     });
						  }
				       }
				    }
                }
            },
            series: [{
            	type: 'column',
                pointStart: start_date,
	            pointInterval: 24 *3600 * 1000 // one day

                
            }, {
            	type: 'column',
                pointStart: start_date,
	            pointInterval: 24 *3600 * 1000 // one day

            }, {
            	type: 'column',
                pointStart: start_date,
	            pointInterval: 24 *3600 * 1000 // one day

            }, {
            	type: 'line',
                pointStart: start_date,
	            pointInterval: 24 *3600 * 1000 // one day

            }, {
            	type: 'line',
                pointStart: start_date,
	            pointInterval: 24 *3600 * 1000 // one day

            }]
        };
        options.series[3].data = myArray[3];
        options.series[4].data = myArray[4];
        
        options.series[2].data = myArray[0];
        options.series[1].data = myArray[1];
        options.series[0].data = myArray[2];  
        for(var i = 0; i < myArray[0].length; i++){
        	console.log(myArray[0][i]);
        	console.log(myArray[1][i]);
        	console.log(myArray[2][i]);
        	console.log(myArray[3][i]);
        }
        var chart = new Highcharts.Chart(options);
       
        
}

function drawImages() {
    var chart = this;
    //console.log("chart length "+chart.series[0].data.length);
    for (var i = 0; i < chart.series[0].data.length; i++) {
        var imageWidth = 30,
            x = 100 + (imageWidth*i*3)+(i*8);//chart.plotLeft + imageWidth/2*i;//+ chart.xAxis[0].translate(i, false) - imageWidth / 2,
            y = 55//chart.plotTop - imageWidth / 2;
        console.log(chart.plotLeft,chart.plotTop);
        console.log("x="+chart.xAxis[0].translate(i, false));
        console.log(x+","+y); //http://highcharts.com/demo/gfx/sun.png
        console.log("my notes : "+window.mynotes[i]);
        var text_index = [], index = 0;
        if(window.mynotes[i] != ""){
           //text_index[index++] = i;
		   imagesMap[i] = chart.renderer.image('/static/images/emblem_note.png', x, y, imageWidth, imageWidth);
		   imagesMap[i].add();
 	       imagesMap[i].attr({
		        zIndex: 100,
		        title: window.mynotes[i]
		    });
		   imagesMap[i].css({
		        cursor: 'pointer'
		    });

		   imagesMap[i].on('click', function() {
		        //location.href = 'http://example.com'
		         //alert(text);
		         //for(var k=0;k<text_index.length;k++){
		         //if(i==text_index[k])
		         //	  var text = mynotes[i];
		         //}
		           console.log(i,x,y);
		           return hs.htmlExpand(null, {
								pageOrigin: {
								   x: x, 
								   y: y-20
								},
								headingText: "Notes on this day",
								maincontentText: $(this).attr('title'),
								width: 300,
								height:220
						     });   
						  
		    });
		    //.add();   
	    }
      }
};

function alignImages() {
    var chart = this;
    for (var i = 0; i < chart.series[0].data.length; i++) {
        var imageWidth = 30,
            x = chart.plotLeft + chart.xAxis[0].translate(i, false) - imageWidth / 2,
            y = chart.plotTop - imageWidth / 2;

        imagesMap[i].attr({
            x: x,
            y: y});   
    }
}

function getGoalPieChart(chart_div,myArray,titleText,seriesName,width)
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
                plotShadow: false,
                width:width
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

function getHistoricGoalChart(chart_div,chart_type,myArray,titleText,yAxisTitle,seriesName,width)
{
                var type = chart_type;
                var container = chart_div
		        var options = {
			      chart: {
				     renderTo: container,
			         defaultSeriesType: type,
			         width:width
			      },
			      
			      title: {
				    text: 'Daily Activity Historic Records'
			      },
			      
			      subtitle: {
				     text: 'Source: Personis Server'
			      },
			      rangeSelector: {
			            inputBoxStyle: {
			                right: '-280px'
			            },
			            //selected: 0
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
				    	text: yAxisTitle
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
				    text: "Goal"
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
					 name: seriesName[0],
					 lineWidth: 4,
					 marker: {
					    radius: 4
					 }
			      },{
					 name: seriesName[1]
			      }]
			};
            var series = {
	              data: []
            };
               options.series[0].data = myArray[0];
		       options.series[1].data = myArray[1];

	           var chart = new Highcharts.StockChart(options);
    
}
function getAllGoals(chart_div, myArray) {

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

function getHealthChart(period){
                console.log("I am here"+period);
                var myDataArray = []; 
                if(period == 'Intraday'){
	                var myActive = [];
                    myActive.push(['Sedentary',19]);
                    myActive.push(['Lightly Active',parseFloat(3)]);
                    myActive.push(['Moderately Active',1]);
		            myActive.push(['Very Active',1]);
		            getIntradayStackChart(chart_div2, myActive);
			       //getInactivityAnnual(chart_div2,myActive);
		        }
                else{
                    var mySteps = [], myActiveHours = [], myCalorie = [], myPulse = [];
			        jQuery.getJSON(action_url2+data, null, function (items) {
                                 //Plotting each data point from the response JSON object
                                  //console.log(items);
	                          $.each(items, function (itemNo, item) { 
                                     //array, function(index, value)
                                     console.log(item);
				     mySteps.push([Date.UTC(item.year,item.month - 1,item.day),parseFloat(item.steps)]);
				     myActiveHours.push([Date.UTC(item.year,item.month - 1,item.day),parseFloat(item.active_time)]);
				     myCalorie.push([Date.UTC(item.year,item.month - 1,item.day),parseFloat(item.calorie)]);
								     //myPulse.push([Date.UTC(item.year,item.month - 1,item.day),parseFloat(item.pulse)]);
				                                  
						                });
                              myDataArray.push(mySteps);
		                      myDataArray.push(myActiveHours);
                              myDataArray.push(myCalorie);
                              //myDataArray.push(myPulse);
		                      getHighStockChart(chart_type2, chart_div2, myDataArray);
                       });
               }

}
function getPluginsGoals(){
	  var goal_array_plugins = [];
	  jQuery.getJSON("/check_plugins", null, function (items) {
          console.log("Checked");
          console.log(items);          
	      if(items){	      	  
	      	  var data = eval(items);
	      	  $('#app_table').hide();
	      	  for(var index=0;index<data.length;index++)
	      	  {
		      	  if(data[index][0] == "Fitbit"){
				   	$('#app_list app1').remove();
				   	$('#side_bar_plugins').remove();
				   	//$('#app_table').text('');
				   	//$('#app_table').show();
				  }				  
		      	  if(data[index][0] != "None"){
					  if(data[index][0]=="inactivity_monitor")
					     goal_array_plugins = ["CurrentLevelGoal","InactivityGoal"];
					  else if(data[index][0]=="Fitbit"){
				 	     goal_array_plugins = ["CurrentLevelGoal","StepGoal","ModerateActivityGoal","IntenseActivityGoal"];
				 	     manageFitbitGoals(data, index, goal_array_plugins);			 	     
				 	  }
				 	  else{
				 	  	 goal_array_plugins = ["CurrentLevelGoal"];
				 	  }
				 	  
			   }//end of date[index][0]!= none
			 } // end of for  
		  } // end of if
		  else{
		  	$('#app_table').show('fast');
		  	$("#GoalHeader").hide('fast');
		  	$("#goal_head_title").hide('fast');
		  }  
		 
		});  

}
function manageFitbitGoals(data, index, goal_array_fitbit){

     //-- Function for showing current goal
     var CurrentLevelGoalFunct = function getCurrentGoalDisplay(width){
	 var mySteps = [], myDataArray = [], myRemainSteps = [];
	 console.log("found the width"+width);
	 jQuery.getJSON('/show_current_goal?data=steps', null, function (items) {
	 	//--- End of Goal Duration. So show current goal set panel
	 	data = eval(items);
	 	console.log(data[0]);
	 	var test = data[0].goalEnd;
	    if(test){
	    	//console.log("Items:"+eval(items));
  	        $('#CurrentLevelGoal input.goals').attr('id',"Fitbit");
	        $('#CurrentLevelGoal input.details').attr('id',"Fitbit");		              	              
	        $('#CurrentLevelGoal').show('fast'); 			                     			               
       	
	 	}
	 	else{ 
			     console.log(eval(items));  
			     var newgoal = "Current level goal";    
                 console.log("Showing chart for "+newgoal);	
                 data = eval(items);
                 
			     if(data.length != 0){  
			      $('#CurrentLevelGoalmonitor').text(newgoal+": Here is the graph that for monitoring this goal that tracks your current level of activity. This chart is based on your Fitbit data.");
			     }
			     else{
  			        $('#CurrentLevelGoalmonitor').text(newgoal+": No Fitbit data found");
			     }
			     	                              
	               $.each(items, function (itemNo, item) {                                      
                       console.log(item);
					   mySteps.push([Date.UTC(item.year,item.month - 1,item.day),parseFloat(item.steps)]);
					   
                   });
                      getCurrentGoalChart("current_step_div", "column", mySteps, 'My Baseline: Steps walked in seven days','Steps/day','Steps',width);
                      
		              $('#CurrentLevelGoalmonitor').show('slow');
			 		  $('#CurrentLevelGoal').hide('slow');
			 		  $('#CurrentLevelGoalChart').show(); 
  			}
         
         });
        
		
	};
	// Function for shpwing step goal
	var StepGoalFunct = function getStepGoalDisplay(width){
	     var mySteps = [], myDataArray = [], myRemainSteps = [], myExceedSteps = [], myPrevRemainSteps = [], myGoalSteps = [], myNotes = [];
	     var width = $(window).width();
	     width = ($(window).width() * 56.5)/100;
		 console.log("found the width"+width);
		 var past_next = "none", prev_goal = 0;
	     jQuery.getJSON('/show_step_goal?data='+past_next, null, function (items) {
			     console.log(eval(items));  
			     var newgoal = "Step goal";    
                 console.log("Showing chart for "+newgoal);	
                 data = eval(items);
                 
			     if(data.length != 0){  
			      $('#StepGoalmonitor').text(newgoal+": Here is the graph for monitoring your progress towards this goal thta tracks your step counts. This chart is based on your Fitbit data.");
			     }
			     else{
  			        $('#StepGoalmonitor').text(newgoal+": No Fitbit data found");
			     }
			     	                              
	               for(var k = data.length-1; k >= 0; k--){
	               	   item = data[k];                                      
                       console.log(item);
                       if(item.remain < 0){
                       	     var cur_goal = item.steps + item.remain;
                       	     var cur_remain = Math.abs(item.remain);
	                       	 mySteps.push({y: parseFloat(cur_goal), color:'#63B8FF', name:'Steps walked by me reaching <br/>my current step goal'});
	                       	 myPrevRemainSteps.push(parseFloat(0));
	                       	 myRemainSteps.push({y:parseFloat(cur_remain), color:'#89A54E', name:'Steps walked by me exceeding <br/>my current step goal'});
							 
							 /*mySteps.push([Date.UTC(item.year,item.month - 1,item.day),{y: parseFloat(cur_goal), color:'#45CCCC'}]);
	                       	 myPrevRemainSteps.push([Date.UTC(item.year,item.month - 1,item.day),parseFloat(0)]);
	                       	 myRemainSteps.push([Date.UTC(item.year,item.month - 1,item.day),{y:parseFloat(-item.remain), color:'#89A54E'}]);*/	                       	 
                       }
                       else{                       	 
                       	 if(item.prev_remain < 0){
                       	     prev_goal = item.steps + item.prev_remain;
                       	     var cur_remain = item.remain + item.prev_remain;
                       	     var prev_remain = Math.abs(item.prev_remain);   
	                       	 mySteps.push({y: parseFloat(prev_goal), color:'#63B8FF', name:'Steps walked by me reaching <br/>my previous step goal'});
	                       	 myPrevRemainSteps.push({y:parseFloat(prev_remain), color:'#009ACD', name:'Steps walked by me exceeding <br/>my previous step goal'});
	                       	 myRemainSteps.push({y:parseFloat(item.remain), color:'#FFFFFF', name:'Remaining steps counts for <br/>my current step goal'});                       	 	

	                       	 /*mySteps.push([Date.UTC(item.year,item.month - 1,item.day),{y: parseFloat(prev_goal), color:'#45CCCC'}]);
	                       	 myPrevRemainSteps.push([Date.UTC(item.year,item.month - 1,item.day),{y:parseFloat(-item.prev_remain), color:'#4572A7'}]);
	                       	 myRemainSteps.push([Date.UTC(item.year,item.month - 1,item.day),{y:parseFloat(cur_remain), color:'#FFFFFF'}]);*/                       	 	
                       	 }
                       	 else{                       	    
                       	     var cur_remain = item.remain - item.prev_remain;   
	                       	 mySteps.push({y: parseFloat(item.steps), color:'#63B8FF', name:'Steps walked by me'});
	                       	 if(parseFloat(items.steps) < 50){
	                       	   myPrevRemainSteps.push({y:parseFloat(item.prev_remain), color:'#FFF', name:'Remaining steps counts for <br/>my previous step goal'});
	                       	 }else{
	                       	   myPrevRemainSteps.push({y:parseFloat(item.prev_remain), color:'#CCC', name:'Remaining steps counts for <br/>my previous step goal'});
	                       	 }
	                       	 myRemainSteps.push({y:parseFloat(cur_remain), color:'#FFFFFF', name:'Remaining steps counts for <br/>my current step goal'});                       	 	

	                       	 /*mySteps.push([Date.UTC(item.year,item.month - 1,item.day),{y: parseFloat(item.steps), color:'#45CCCC'}]);
	                       	 myPrevRemainSteps.push([Date.UTC(item.year,item.month - 1,item.day),{y:parseFloat(item.prev_remain), color:'#4E4E4E'}]);
	                       	 myRemainSteps.push([Date.UTC(item.year,item.month - 1,item.day),{y:parseFloat(cur_remain), color:'#FFFFFF'}]);*/                       	 	
                       	 	
                       	 }
                       }
					   /*mySteps.push([Date.UTC(item.year,item.month - 1,item.day),parseFloat(item.steps)]);
					   myPrevRemainSteps.push([Date.UTC(item.year,item.month - 1,item.day),parseFloat(item.prev_remain)]);
					   myRemainSteps.push([Date.UTC(item.year,item.month - 1,item.day),parseFloat(item.remain)]);*/
					    myExceedSteps.push({y:parseFloat(item.prev_target),name:'Previous goal',color:'green'});
					    myGoalSteps.push({y:parseFloat(item.cur_target),name:'Current goal',color:'red'});
                        myNotes.push(item.notes)
                   }
                myDataArray.push(mySteps);
                myDataArray.push(myPrevRemainSteps);
		        myDataArray.push(myRemainSteps);
		        myDataArray.push(myExceedSteps);
		        myDataArray.push(myGoalSteps);
        	    mySeriesName = ['Steps','Prev Remaining','Remaining steps','Exceeding steps']
        		var start_date = Date.UTC(data[0].year,data[0].month - 1,data[0].day);
        		console.log("Start on");
        		console.log(start_date);
                getStepGoalChart("StepGoalChart", "column", myDataArray, start_date, 'Steps walked in this week','Steps/day',mySeriesName,width,myNotes);                                               		           						                        		               
            
		        $('#StepGoalmonitor').show('slow');
			 	$('#StepGoal').hide('slow');
			 	$('#StepGoalChart').show(); 
			 	$('#stepButtons').show();
            });
	};
	// Function for shpwing moderate goal
	var ModerateGoalFunct = function getModerateGoalDisplay(){
		var mySteps = [], myDataArray = [], myRemainSteps = [],myExceedSteps = [];
		console.log("found the width"+width);
		jQuery.getJSON('/show_step_goal?data=none', null, function (items) {
			     console.log(eval(items));  
			     var newgoal = "Step goal";    
                 console.log("Showing chart for "+newgoal);	
                 data = eval(items);
			     if(data.length != 0){  
			      $('#ModerateActivityGoalmonitor').text(newgoal+": Here is the graph for monitoring your progress towards this goal. This chart is based on your Fitbit data.");
			     }
			     else{
  			        $('#ModerateActivityGoalmonitor').text(newgoal+": No Fitbit data found");
			     }
			     	                              
	               $.each(items, function (itemNo, item) {                                      
                       console.log(item);
					   mySteps.push([Date.UTC(item.year,item.month - 1,item.day),parseFloat(item.steps)]);
					   myRemainSteps.push([Date.UTC(item.year,item.month - 1,item.day),parseFloat(item.remain)]);
					   myExceedSteps.push([Date.UTC(item.year,item.month - 1,item.day),parseFloat(item.exceed)]);
                   });
                        myDataArray.push(mySteps);
		                myDataArray.push(myRemainSteps);
		                myDataArray.push(myExceedSteps);
		                mySeriesName = ['Steps','Remaining steps','Exceeding steps']
                        getStepGoalChart("ModerateActivityGoalChart", "column", myDataArray, 'Steps walked in seven days','Steps/day',mySeriesName,width);                                               		           						                        		               
		                $('#ModerateActivityGoalmonitor').show('slow');
			 			$('#ModerateActivityGoal').hide('slow');
			 			$('#ModerateActivityGoalChart').show(); 
			 			//$('#stepButtons').show();
            });
		
	};
	// Function for shpwing intense goal
	var IntenseGoalFunct = function getIntenseGoalDisplay(){
		var mySteps = [], myDataArray = [], myRemainSteps = [],myExceedSteps = [];
		console.log("found the width"+width);
		jQuery.getJSON('/show_step_goal?data=none', null, function (items) {
			     console.log(eval(items));  
			     var newgoal = "Step goal";    
                 console.log("Showing chart for "+newgoal);	
                 data = eval(items);
			     if(data.length != 0){  
			      $('#IntenseActivityGoalmonitor').text(newgoal+": Here is the graph for monitoring your progress towards this goal. This chart is based on your Fitbit data.");
			     }
			     else{
  			        $('#IntenseActivityGoalmonitor').text(newgoal+": No Fitbit data found");
			     }
			     	                              
	               $.each(items, function (itemNo, item) {                                      
                       console.log(item);
					   mySteps.push([Date.UTC(item.year,item.month - 1,item.day),parseFloat(item.steps)]);
					   myRemainSteps.push([Date.UTC(item.year,item.month - 1,item.day),parseFloat(item.remain)]);
					   myExceedSteps.push([Date.UTC(item.year,item.month - 1,item.day),parseFloat(item.exceed)]);
                   });
                        myDataArray.push(mySteps);
		                myDataArray.push(myRemainSteps);
		                myDataArray.push(myExceedSteps);
		                mySeriesName = ['Steps','Remaining steps','Exceeding steps']
                        getStepGoalChart("IntenseActivityGoalChart", "column", myDataArray, 'Steps walked in seven days','Steps/day',mySeriesName,width);                                               		           						                        		               
		                $('#IntenseActivityGoalmonitor').show('slow');
			 			$('#IntenseActivityGoal').hide('slow');
			 			$('#IntenseActivityGoalChart').show(); 
			 			//$('#stepButtons').show();
            });
		
	};	
    var goal_function_fitbit = [CurrentLevelGoalFunct,StepGoalFunct,ModerateGoalFunct,IntenseGoalFunct];	

	for(var i=1;i<data[index].length;i++){	                              		                 
	        $('#'+data[index][i]+" input.goals").attr('id',data[index][0]);
	        $('#'+data[index][i]+" input.details").attr('id',data[index][0]);		              	              
	        $('#'+data[index][i]).show('fast'); 			                     			               
	}
	for(var k=1; k<data[index].length; k++){
	    for(var j=0; j<goal_array_fitbit.length; j++){
	        var set = 1;				         				     				  	  
		  	 if(goal_array_fitbit[j]==data[index][k]){
	  	  	 	  set = 0;
	 	  	 	  console.log("Found Match");				  	  	 	  
	  	  	 	  goal_array_fitbit.splice(j,1);
	  	  	 	  goal_function_fitbit.splice(j,1);					  	  	 	  
	  	  	 }
	 	  }				  	  
	  }
	  console.log(goal_array_fitbit);
				  
	var header = "You have Fitbit plugin installed. ";				  
	$("#GoalHeader").text(header);
	header = "<b>Number of active goals: " + goal_array_fitbit.length+"."
	header += " Number of inactive goals: "+(4-goal_array_fitbit.length)+"</b>";
	$("#GoalHeader").append(header);
	$("#goal_head_title").show('fast');
	if(goal_array_fitbit.length < 4 && goal_array_fitbit.length >= 1) 
	    var goal_link = "<p> Click <a href='#Goals' style='color:#fff'> here </a> to set more goals.</p>";				  				  
	    $("#GoalHeader").append(goal_link);
	    $("#GoalHeader").show('fast');		
				  		    
    for(var j=0;j<goal_array_fitbit.length;j++){				  	
		console.log("Getting data for "+goal_array_fitbit[j]);  				  	
		var width = $(window).width();				  	
		console.log("Current width = "+width);
		if(width <= 1440){
		  	   width = ($(".charts").width() * width)/100;	
		}
		else{
			   width = (32 * width)/100;
		}		 					 				
		console.log("Converted width = " + width);	
		console.log(goal_function_fitbit[j]); 	
		goal_function_fitbit[j](width);	

		//manageCurrentGoalPanel(width);			  	  
    }	

}
function saveNotes(note_date){
           //var note_date = $(this).attr('data-div-id');
           var myInput = document.getElementById('stepgoal_notes_'+note_date);
           console.log(note_date);
           var timestamp = parseInt(note_date);
		   //var timestamp = 1301090400
		   var date = new Date(timestamp);
		   var datevalues = date.getUTCFullYear()+"-"+(date.getUTCMonth()+1)+"-"+date.getUTCDate()+" "+
		                    date.getUTCHours()+":"+date.getUTCMinutes()+":"+date.getUTCSeconds();
		    
			    
           var notes = "StepGoal_"+myInput.value+"_"+datevalues;
           console.log('hello'); 
             $.ajax({  
			    type: "POST",  
			    url: "/add_notes_to_activity?note="+notes,  
			    data: "",  
                processdata:true,
			    success: function(data){
			    	//alert(data);
			    	getGoaldata("none");
	        	   /*if(data == "Success")             
                      //reload the graph
                      alert(data)
                   else
                   	  alert(data)*/
            	}
            });	         	        

}
function addNotes(notes){
             console.log('hello'); 
             $.ajax({  
			    type: "POST",  
			    url: "/add_notes_to_activity?note="+notes,  
			    data: "",  
                processdata:true,
			    success: function(data){
                                
                                    //reload the graph
                                }
                        });
	}
$(document).ready(function() {initGoalOptions();});
//]]>
