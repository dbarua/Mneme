/*This js file contains all the necessary functions for goal setting, monitoring and revising.*/
//<![CDATA[
new_goal = "";
var value="",height ;  
var goallist = [], goal_unitlist = [], default_list = [], duration = []; 
var prev_height;
var types = ['DOMMouseScroll', 'mousewheel'];
//var log_events = [], log_index = 0;
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
	                var comment = "Browser Advanced setting slider:"+div+" click event";
		    		log_events[log_index++] = comment; 
	            }
        });*/

        $('#create_goal').click(function(){
                       console.log("Set Goals clicked...");
                       getGoals('Fitbit',"");
                       return false;
        });
        
        $('#goalboxclose').click(function(){
	       	var comment = "Dashboard: goal-setting window has ben closed.";
		    log_events[log_index++] = comment; 
			$("#advanced_question").hide();
            var height = parseInt($('#set_goal_box').height())+100; 
                    $('#set_goal_box').animate({'top':'-800px'},500,function(){
                       $('#overlay2').fadeOut('fast');
                       $('.myloading').hide();
                    });
        });
        
        $(".stepButtons").click(function(){
        	var type = $(this).attr('id');
        	var comment = "Dashboard: Monitoring step goal. Showing chart for "+type+".";
	 	    log_events[log_index++] = comment; 
  
        	//alert("Show "+type);
        	getGoaldata(type);
        });
        
                
        $(".modButtons").click(function(){
        	var type = $(this).attr('id');
        	var comment = "Dashboard: Monitoring moderate activity goal. Showing chart for "+type+".";
	 	    log_events[log_index++] = comment; 
  
        	//alert("Show "+type);
        	show_moderate_activity_chart(type);
        });
        $(".intButtons").click(function(){
        	var type = $(this).attr('id');
        	var comment = "Dashboard: Monitoring intense activity goal. Showing chart for "+type+".";
	 	    log_events[log_index++] = comment; 
  
        	//alert("Show "+type);
        	show_intense_activity_chart(type);
        });        
        $('#confirmboxclose, #okbutton').click(function(){
                    //height = parseInt($('#set_goal_box').height())+100; 
                    var comment = "Dashboard: Confirm button has been clicked";
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
        	var comment = "Dashboard: Set goals button has been clicked.";
		    log_events[log_index++] = comment; 
		    $('.error').hide();     
		    $('#addgoal').attr('data-goal','new');  
		    console.log($('#addgoal').attr('data-goal'));          
		    
        	var txt = "<label style='float:left; width:100%; font-size:1em;display:inline-block'>";
        	txt += "This section is based on the widely used <span class='lefttxt02'>SMART</span> goals.";
        	txt += "<span id='span_intro' title='";
        	txt += "SMART is the acronym of Specificity, Measurability, Attainablity, Relevence, and Timed.";
        	txt += "This suggests that an effective goal should have a specific target which can be measured. Such goal should be achievable and relevant.";
        	txt += "This goal should also have a specific timetable and deadline.' ";
        	txt += "class='ui-state-default ui-corner-all ui-icon ui-icon-help' style='cursor: pointer;display:inline-block'>?</span>";	
			txt += "</label>";
			$('#set_goal_intro').html(txt)
        	$('#frm_set_goal').show('slow');
        	$('#frm_set_goal_advanced').hide('slow');
        	//$('#set_goal_box').height('77.2972973%');
        	$('#advanced_question').hide('slow');
        	$('#contgoal').show();
        	$('#addgoal').hide();
        	$('#backgoal').hide();
		    
        	getGoals(app,goal,"new");
        	
        });

        $('input.revisegoals').click(function(){
        	var goal = $(this).attr('data-div-id');
        	var app =  $(this).attr('id');
        	//alert("Mygoal "+value);
        	var comment = "Dashboard: Revise goal button has been clicked.";
		    log_events[log_index++] = comment; 
		    $('.error').hide();    
		    $('#addgoal').attr('data-goal','revise');  

		    var txt = "<label style='float:left; width:100%; font-size:1em;display:inline-block'>";
        	txt += "This section is based on the widely used <span class='lefttxt02'>SMART</span> goals.";
        	txt += "<span id='span_intro' title='";
        	txt += "SMART is the acronym of Specificity, Measurability, Attainablity, Relevence, and Timed.";
        	txt += "This suggests that an effective goal should have a specific target which can be measured. Such goal should be achievable and relevant.";
        	txt += "This goal should also have a specific timetable and deadline.' ";
        	txt += "class='ui-state-default ui-corner-all ui-icon ui-icon-help' style='cursor: pointer;display:inline-block'>?</span>";	
			txt += "</label>";
			$('#set_goal_intro').html(txt)
        	$('#frm_set_goal').show('slow');
        	$('#frm_set_goal_advanced').hide('slow');
        	//$('#set_goal_box').height('77.2972973%');
        	$('#advanced_question').hide('slow');
        	$('#contgoal').show();
        	$('#addgoal').hide();
        	$('#backgoal').hide();

       	    reviseGoals(app,goal,"revise");        	          	  
        });        

        $('.historicbutton').click(function(){
        	var form = $(this).attr('data-div-id');
        	var value = $(this).val();
        	//alert(value);
        	var comment = "Dashboard: "+value+" button has been clicked. Showing historic chart for "+form+".";
		    log_events[log_index++] = comment; 
         	if(value.indexOf('historic') != -1){        	  
	        	  $(this).val('Back to current chart');
	        	  historicChart(form);
	        	  if(form == "StepGoal"){
	        	  	$('.stepButtons').hide('slow');
	        	  }
	        	  else if(form == "ModerateActivityGoal"){
	        	  	$('.modButtons').hide('slow');
	        	  }
	        	  else if(form == "IntenseActivityGoal"){
	        	  	$('.intButtons').hide('slow');
	        	  }
        	}else{
	        	  $(this).val('Go to historic chart');	
	        	  if(form == "StepGoal"){
	        	  	getGoaldata("none");
	        	  	$('.stepButtons').show('slow');
	        	  }else if(form == "ModerateActivityGoal"){
	        	  	   var param = "none_ModerateActivityGoal";
	        	       show_moderate_activity_chart(param);
	        	       $('.modButtons').show('slow');
	        	  }else if(form == "IntenseActivityGoal"){
	        	  	   var param = "none_IntenseActivityGoal";
	        	       show_intense_activity_chart(param);
	        	       $('.intButtons').show('slow');
	        	  }	 	        	  
        	}          	
        });
        $(".howto_buttons").click(function(){
        	    var mode = $(this).attr('data-div-id');
        		var subtitle_text = '<h3>Weekly progress chart</h3><div style="margin:10px;"><h4>Summary:</h4>At the top of the chart, you will find a summary of your weekly progress towards this goal.</div>' 
        		subtitle_text += '<div style="margin:20px 10px 20px 10px;height:auto"><h4>Legend:</h4>';
        		subtitle_text += '<div style="margin:10px;padding:5px;background-color:#DB843D;color:#fff;">Orange Line = Current target ' + mode +',</div>';
	            subtitle_text += '<div style="margin:10px;padding:5px;background-color:#A47D7C;color:#000">Pink Line = Previous target ' + mode +', </div>';
				subtitle_text += '<div style="margin:10px;padding:5px;background-color:#009ACD;color:#fff">Deep blue column = On current target, </div>';
				subtitle_text += '<div style="margin:10px;padding:5px;background-color:#89A54E;color:#000">Light green column = Over current target, </div>';
				subtitle_text += '<div style="margin:10px;padding:5px;background-color:#63B8FF;color:#000">Light blue column = Over previous target, </div>';
				subtitle_text += '<div style="margin:10px;padding:5px;background-color:#fff;border:1px solid #ccc;color:#000">White column = Behind current target,</div>';
				subtitle_text += '<div style="margin:10px;padding:5px;background-color:#ccc;color:#000;">Light grey column = Behind previous target</div>';
				subtitle_text += ' </div>';
                subtitle_text += '<div style="margin:10px;"><h4>Add note:</h4>You can note down any special comment on a day in the chart. To add notes, click on the horizontal lines or the columns. A small dialog box will appear where you can enter what you want to add. Click "Save" to save the note.</div>';
                subtitle_text += '<div style="margin:10px;"><h4>Read note:</h4>Once you have saved a note for a day e.g. 2/2/2012, a small icon will appear above the column chart for date Thu, Feb 2. Click on the icon to read your stored notes for that day.</div>';
                //subtitle_text += '<div style="margin:10px;"><h4>Previous week:</h4>You can review the chart from the previous weeks by clicking "Previous week" button. </div>';
                //subtitle_text += '<div style="margin:10px;"><h4>Next week:</h4>If you move to the chart for previous weeks, you can click "Next week" to go back to the more recent charts. </div>';
				//subtitle_text += '<div style="margin:10px;"><h4>Go to historic chart:</h4> Click this button to review your past goals and how you performed.</div>'
				subtitle_text += '<h3>Historic chart</h3>';				
				subtitle_text += '<div style="margin:10px;"><h4>Summary: </h4> At the top of the chart, you will find a summary of your overall performance during the period shown in the chart. </div>';
                subtitle_text += '<div style="margin:10px;"><h4>Legend:</h4></div>';
                subtitle_text += '<div style="margin:10px;padding:5px;background-color:#AA4643;color:#fff">Red Line = Target ' + mode +', </div>';
				subtitle_text += '<div style="margin:10px;padding:5px;background-color:#4572A7;color:#fff">Blue Line = Walked ' + mode +', </div>';
				subtitle_text += '<div style="margin:10px;"><h4>Time Range selector: </h4> At top-left corner, you will see 6 different time periods for reviewing data. </div>';
				subtitle_text += '<div style="margin:10px;"><h4>Date range input fields:</h4> At the top right corner, you will find two date input fields where you can enter the dates for the period you want to view your data.</div>';
				subtitle_text += '<div style="margin:10px;"><h4>Scroll bar:</h4> At the bottom of the chart, you will find a scroll bar that you can move to see a your data for a particular period.</div>';
        	    return hs.htmlExpand(this, {
			        pageOrigin: {
					  x: 200, 
					  y: 200
					},
					headingText: "How to read the chart",
				    maincontentText: subtitle_text,
					width: 400,
					height:400
			  }).addClass("show_list")
			    .addClass("darkbackcolor");   
        });
        
		$('.details').click(function(){
        	var goal = $(this).attr('data-div-id');
        	var app =  $(this).attr('id');
        	var comment = "Dashboard: Goal details button has been clicked.";
		    log_events[log_index++] = comment; 
        	getGoalDetails(app,goal);
        	
        });
        
        $("#notify").click(function(){
        	$("#notify input").each( function() {           
			     var val = $(this).val();
			 	 var label_id = $(this).attr('data-label');			                  
				 if($(this).attr("checked")){
				    $('#'+label_id).show('slow');
				  }else{
				    $('#'+label_id).hide('slow');
			   }
			}); 
        })
        
        $('#advanced_header input').click(function(e){
        	//alert("Start");
        	var comment = "Dashboard: Advanced goal setting link has been clicked.";
		    log_events[log_index++] = comment; 
            if($(this).val() == "Show more options") {  
            	$(this).val('Hide more options'); 
            	$('#set_goal_box').height(750);
            }            
            else  {
            	$(this).val('Show more options'); 
            	$('#set_goal_box').height(620);
            }
        	
        	$('#advanced_question').toggle('slow');        	
        	$('#set_goal_box').animate({'top':'20px'},500);
        });
        
        $('#contgoal').click(function(){
        	var txt = "<label style='float:left; width:100%; font-size:1em;display:inline-block'>";
        	txt += "This section helps you think about some more aspects. Research shows these can help people acheive their goals.";
        	//txt += "<span id='span_intro' title='.' class='ui-state-default ui-corner-all ui-icon ui-icon-help' style='cursor: pointer;display:inline-block'>?</span>";	
			txt += "</label>";
			var option1_check = -1, option2_check = -1;
			$("#likert_1 input:radio").each(function() {           
             	   var resp1 = $(this).val(); 
             	   console.log("value "+resp1);                 
				   if($(this).attr("checked")){
				   	 var comment = "Dashboard: Goal setting window section 1. Rating = "+resp1;
				   	 log_events[log_index++] = comment;
				   	 $(this).attr("checked",false);
				   	 console.log("User resp "+resp1);
				   	 option1_check = 1;
				   }
			 });
			 if($('#comment_1').val() != "Please feel free to explain your answer."){
			 	  var comment = $('#comment_1').val();		
				  log_events[log_index++] = comment;
				  $('#comment_1').val('');
			 }
			$("#likert_2 input:radio").each(function() {           
             	   var resp2 = $(this).val();                  
				   if($(this).attr("checked")){
				   	 var comment = "Dashboard: Goal setting window section 1. Rating = "+resp2;
				   	 log_events[log_index++] = comment;
				   	 $(this).attr("checked",false);
				   	 console.log("User resp "+resp2);
				   	 option2_check = 1;
				   }
			 });
			 if($('#comment_2').val() != "Please feel free to explain your answer."){
			 	  var comment = $('#comment_2').val();		
				  log_events[log_index++] = comment;
				  $('#comment_2').val('');
			 }
	 	    console.log("Options: "+option1_check+" and "+option2_check);
	     	if(option1_check == 1 && option2_check == 1){
	     		$('.error').hide();
	        	$('#set_goal_intro').html(txt)
	        	$('#frm_set_goal').hide('slow');
	        	$('#frm_set_goal_advanced').show('slow');
	        	//$('#set_goal_box').height('70%');
	        	$('#advanced_question').show('slow');
	        	$('#contgoal').hide();
	        	//$('#addgoal').val("Set "+$('#goal_title').text()+" goal");
	        	$('#addgoal').val("Set goal");
	        	$('#addgoal').show();
	        	$('#backgoal').show();
			        	
        	    var comment = "Dashboard: Continue next goal setting section button is clicked.";
		        log_events[log_index++] = comment;
			}else{
				if(option1_check == -1){$('#option1_error').show()}
				if(option2_check == -1){$('#option2_error').show()}
			}
				   	 
        });
        $('#backgoal').click(function(){
        	var txt = "<label style='float:left; width:100%; font-size:1em;display:inline-block'>";
        	txt += "This section is based on the widely used <span class='lefttxt02'>SMART</span> goals.";
        	txt += "<span id='span_intro' title='";
        	txt += "SMART is the acronym of Specificity, Measurability, Attainablity, Relevence, and Timed.";
        	txt += "This suggests that an effective goal should have a specific target which can be measured. Such goal should be achievable and relevant.";
        	txt += "This goal should also have a specific timetable and deadline.' ";
        	txt += "class='ui-state-default ui-corner-all ui-icon ui-icon-help' style='cursor: pointer;display:inline-block'>?</span>";	
			txt += "</label>";
			$('#set_goal_intro').html(txt)
        	$('#frm_set_goal').show('slow');
        	$('#frm_set_goal_advanced').hide('slow');
        	//$('#set_goal_box').height('77.2972973%');
        	$('#advanced_question').hide('slow');
        	$('#contgoal').show();
        	$('#addgoal').hide();
        	$('#backgoal').hide();
        	
        });
        
        $('#addgoal').live('click',function(e){
        	$('.myloading').show();
        	$("#advanced_question").hide();
            var new_goal="";
			
			var goal_name = $('#addgoal').attr('title');
			var goal_function = $('addgoal').attr('data-goal');
			var url = ""
			var option1_check = -1, option2_check = -1;
			
			$("#likert_1 input:radio").each(function() {           
             	   var resp1 = $(this).val();                  
				   if($(this).attr("checked")){
				   	 var comment = "Dashboard: Goal setting window section 2. Rating = "+resp1;
				   	 log_events[log_index++] = comment;
				   	 $(this).attr("checked",false);
				   	 console.log("User resp "+resp1);
			 	   	 option1_check = 1;
			
				   }
			 });
			 if($('#comment_1').val() != "Please feel free to explain your answer."){
			 	  var comment = $('#comment_1').val();		
				  log_events[log_index++] = comment;
				  $('#comment_1').val('');
			 }
			$("#likert_2 input:radio").each(function() {           
             	   var resp2 = $(this).val();                  
				   if($(this).attr("checked")){
				   	 var comment = "Dashboard: Goal setting window section 2. Rating = "+resp2;
				   	 log_events[log_index++] = comment;
				   	 $(this).attr("checked",false);
				   	 console.log("User resp "+resp2);
			 	   	 option2_check = 1;
			
				   }
			 });
			 if($('#comment_2').val() != "Please feel free to explain your answer."){
			 	  var comment = $('#comment_2').val();		
				  log_events[log_index++] = comment;
				  $('#comment_2').val('');
			 }


			if(option1_check == 1 && option2_check == 1){
	     			
	     			$('.error').hide();
	        
					var comment = "Dashboard: Set goal button has been clicked. Setting "+goal_name+".";
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
		            
		            $("#notify input:checkbox").each( function() {           
		             	   var val = $(this).val();                  
						   if($(this).attr("checked")){
						   	  var input_id = $(this).attr('data-div-id');
						   	  var label_id = $(this).attr('data-label');
						   	  new_goal += $('#notify input#'+input_id).val()+",";
						   	  $('#'+label_id).show('slow');
						   }else{
						   	  new_goal += "no "+val+",";
						   	  $('#'+label_id).hide('slow');
						   }
					 }); 
		            new_goal += $("select#week_list option:selected").val()+",";
		           
		            var goal_option = $('#addgoal').attr('data-div-id').split(",")		    
					new_goal += goal_option[0]+",";
					goal_function = goal_option[1];
		            
		            var value = $('#goal_difficulty_slide').slider("value");
		            console.log("Slider importance"+value);
		            //console.log($('#goal_commitment_slide').slider("value"));
		            //console.log($('#goal_efficacy_slide').slider("value"));
		            
		            new_goal += $('#goal_commitment_silde').slider("value")+",";                       
		            new_goal += $('#goal_efficacy_slide').slider("value")+","; 
		            new_goal += $('#goal_difficulty_slide').slider("value")+",";
		            new_goal += $('#goal_priority_slide').slider("value");
		
					//alert(new_goal);
					//$('#set_goal_box form').text("Please wait this will take a while....");
					$('#set_goal_box').animate({'top':'-800px'},500);
					
					if(goal_function == 'new'){
						url = "/set_goals?newgoal="
					}else{
						url = "/revise_goals?newgoal="
					}
					console.log("Do "+goal_function+" goal with url "+url);
			
					
					$.ajax({  
					    type: "POST",  
					    url: url+new_goal,  
					    data: "",                              
					    success: function(data){
						            if(data.indexOf('Error') == -1){
						            	 //--Reload the whole page
									     document.location.href = "/browse";
									     //--or just reload the middle panel
									     //$('.hideable').hide();
									     //getPluginsGoals();	
									     //-- or just load the function
									     /*if(goal_name == "CurrentLeveleGoal"){
										      	window.CurrentLevelGoalFunct(width, active_goals[j]);
										   }else if(goal_name == "StepGoal"){
										      	window.StepGoalFunct(width, active_goals[j]);
										   }else if(goal_name == "ModerateActivityGoal"){
										      	window.ModerateGoalFunct(width, active_goals[j]);
										   }else if(goal_name == "IntenseActivityGoal"){
										      	window.IntenseGoalFunct(width, active_goals[j]);
										   }else if(goal_name == "AvoidInactivityGoal"){
										      	window.AvoidInactivityGoalFunct(width, active_goals[j]);
										   }	  */ 		   	
		
									}							
								    else{
								    	   $('#confirm_goal_set div').text(data);
								        }                          
									   $('#overlay2').fadeOut('fast');		                          
		                         }
		                    }); // end of ajax
		               }else{
							if(option1_check == -1){$('#option1_error').show()}
							if(option2_check == -1){$('#option2_error').show()}
					  }                                                        
		
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
               var comment = "Dashboard: Getting goal details.";
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
                var comment = "Dashboard: Getting goal defaults.";
 			    log_events[log_index++] = comment; 

                var data = appname+"."+goal; 
                //alert("WIP: Goal "+goal+" for app "+appname);
               	$('#addgoal').attr('title',goal);
               	$('#addgoal').addClass('button');
               	
        	    $('#addgoal').attr('data-div-id',appname+",new");	
        	    $('#addgoal').attr('data-goal','new');
                //$('div.myBox').attr("id",goal);
                var url = ""
                if(form == "new")
                   url = "/get_goals_json?data="+data;
                else{
                   url = "/get_prev_goals_json?data="+data;
                   console.log(form);
                  }   
               console.log(goal);
               $("#email_label, #tweet_label").hide();  
	           $.ajax({  
				    type: "POST",  
				    url: url,  
				    data: "",  
	                processdata:true,
				    success: function(data){
					   items = eval(data);	
					   var goal_details = [];
					   console.log(items);
					   goal_details = eval(items[0].goal);
					   console.log(goal_details);					   
					   goal_duration = eval(items[0].duration);
					   console.log(goal_duration);					   
					   
					   $('#goal_title').text(goal_details[0]);
					   $('h3#goal_header').text("Set effective goal for "+goal_details[0]);
					   $('#span_desc').attr('title',goal_details[1]);
					   $('#duration').val(goal_duration[0]);
					   $('#span_duration').attr('title',goal_duration[1]);
					   
					   if(goal_details[0].indexOf('start') == -1){
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
		                      $('#set_goal_box').height(700); 
		                      $('#set_goal_box').width(800);
		                      $('#goal_setting_div').height('80%');
		                      $('#goal_ques_div').height('80%');
		                      $('#advanced_header').show('slow');
		                      $('.goalboxlink').show('slow');
		                      
		                      console.log("Setting"+ goal);
		                      $('#'+goal+'monitor input').each(function(){
		                      	   console.log("Enabling buttons");
								   $(this).removeAttr('disabled');
							  });
		                      $('#goal_commitment_silde').slider("value",0);                       
	            			  $('#goal_efficacy_slide').slider("value",0); 
	            			  $('#goal_difficulty_slide').slider("value",0);
	            			  $('#goal_priority_slide').slider("value",0); 
	            		
		                   	  $('#contgoal').show();
						   	  $('#backgoal').hide();
						   	  $('#addgoal').hide();
						              
					   }
					   else{
						   	$('#number').hide('slow'); 
						   	$('#set_goal_box').height(600);
						   	$('#set_goal_box').width(800);
  	                       			 $('#goal_setting_div').height('75%');
		                    $('#goal_ques_div').height('80%');

						   	$('#advanced_header').hide();						   	

						   	$('.goalboxlink').hide();
						   	$('#contgoal').hide();
						   	$('#backgoal').hide();
						   	$('#addgoal').show();
						   	
						   	 
					   }
						  
						$('#overlay2').fadeIn('fast',function(){
				  	     console.log("Block overlay..."); 
					     
					     
		                 //$('#number').hide();
		                 $("#notify input").each( function() {                             
							   $(this).attr("checked",false);
					     }); 
					     
					     $("#email_check").attr("checked",true);
		                 $("#notify input").each( function() {           
			             	   var label_id = $(this).attr('data-label');                  
							   if($(this).attr("checked")){							   	  
							   	  $('#'+label_id).show('slow');
							   }else{
							   	  $('#'+label_id).hide('slow');
							   }
					     }); 

					     $('#set_goal_box').animate({'top':'60px','left':'15%','right':'40%'},500);
		                 $('#set_goal_box').draggable();  	 	    
			  	        });   
 				    },                        
		       });  //end of ajax call

}		       

function reviseGoals(appname,goal,form){ 		                                                                         
                                                                    
                var data = appname+"."+goal; 
                var comment = "Dashboard: Getting previous goal details for revision.";
			    log_events[log_index++] = comment; 
                
                //alert("WIP: Goal "+goal+" for app "+appname);
               	$('#addgoal').attr('title',goal);
               	$('#addgoal').addClass('button');
               	
        	    $('#addgoal').attr('data-div-id',appname+",revise");
        	    $('#addgoal').attr('data-goal','revise');	
                //$('div.myBox').attr("id",goal);
                var url = ""
                url = "/get_prev_goals_json?data="+data;
                console.log(form);
                console.log("Revising "+ goal);
                
                
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
         cur_goal = data.split('.')[1];
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
					   $('h3#goal_header').text("Set effective goal for "+goal_details[0]);
					   
					   $('#span_desc').attr('title',goal_details[1]);					   
					   $('#duration').val(my_goal[0]);
					   $('#span_duration').attr('title',goal_duration[1]);
					   
					   var myDate = new Date();
	            	   var today = new Date();
					   
					   myDate.setDate(today.getDate()- parseInt(my_goal[10]));
	              	   var displayDate = (myDate.getDate()) + '/' + (myDate.getMonth()+1) + '/' + myDate.getFullYear();
	              	   var start_text = "I set this goal on "+displayDate+". ";
	              	   start_text += my_goal[10]+ "days passed. "+ my_goal[11] + " more days to go. ";
	              	   console.log(start_text);
                       $("#my_start").text(start_text); 
	            	   $("#td_my_start").show();	
					   $('#weekday_list option[value='+ my_goal[9] +']').attr('selected', 'selected');
					   if(goal_details[0].indexOf('start') == -1){
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
		                      $('#set_goal_box').height(700); 
		                      $('#set_goal_box').width(800);
		                  $('#goal_setting_div').height('80%');
		                    $('#goal_ques_div').height('80%');

		                      $('#advanced_header').show('slow');
		                      $('.goalboxlink').show('slow');

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
								
							  $('#goal_priority_slide').slider("value",my_goal[12]);
			            	  index = parseInt(my_goal[12] / 10);   
							  $( "#goal_priority_label" ).text(goal_attr_values[index]);
					
					
							  $('#contgoal').show();
						   	  $('#backgoal').hide();
						   	  $('#addgoal').hide();
						      
		                              
					   }
					   else{
					   		  $('#number').hide('slow'); 
		  				      $('#set_goal_box').height(600);
						   	  $('#set_goal_box').width(800);
						   	  $('#advanced_header').hide();						   	
						   	  $('.goalboxlink').hide();
							  $('#goal_setting_div').height('75%');
							  $('#goal_ques_div').height('80%');

						   	  $('#contgoal').hide();
						   	  $('#backgoal').hide();
						   	  $('#addgoal').show();
						   	     	  				      
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
		             
		             $("#notify input").each( function() {                             
							   $(this).attr("checked",false);
					     }); 
					     
					 $("#email_check").attr("checked",true);
		             $("#notify input").each( function() {           
			             	   var label_id = $(this).attr('data-label');                  
							   if($(this).attr("checked")){							   	  
							   	  $('#'+label_id).show('slow');
							   }else{
							   	  $('#'+label_id).hide('slow');
							   }
					 }); 
		             $('#week_list option[value='+ my_goal[5] +']').attr('selected', 'selected');
		             
   					//----- Show the goal setting box
					$('#overlay2').fadeIn('fast',function(){
				  	     console.log("Block overlay..."); 					     
					     /*$("#notify input").each( function() {                             
							   $(this).attr("checked",false);
					     }); */
					     $('#set_goal_box').animate({'top':'60px','left':'20%','right':'40%'},500);
		                 $('#set_goal_box').draggable();  	 	    
			  	        });  
 				    },                        
		       });  //end of ajax call	
}
function manageCurrentGoalPanel(){
	var button_array = ["calories_button","steps_button","active_button"];
	
	$('.curgoal').live('click',function(e){
	   var index;
	   console.log("Clicked....")
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
	          var type = $(this).attr('data-form');
	          $('#'+div_id).show('fast');
	          $(this).removeClass('button');
	          $(this).addClass('pressedbutton');
	          console.log("button pressed:"+type+"chart type"+chart+"showing on div"+div_id); 
	          width = ($(window).width() * 56.5)/100;
	          show_current_goal_chart(type,chart,div_id,width);	  	  

	   	  }
	   	  
	   }
	   	
	});
}
var width;
function getGoaldata(past_next){
	             show_step_chart(past_next);
           		 $('#StepGoalButtons').show();
            	 $('#StepGoalButtons input').each(function(){
                 console.log("Enabling buttons");
				 $(this).removeAttr('disabled');
 			});
                        
}	

function historicChart(form){
	     var myActivity = [], myDataArray = [], myGoals = [];
	     var width = $(window).width();
	     width = ($(window).width() * 56.5)/100;
		 console.log("found the width"+width);
		 var goal_met = 0, goal_met_nearly = 0;
		 var summary = "", goal_active = 0;
	     jQuery.getJSON('/show_historic_graph?data='+form,null,function(items) {
		   $.each(items, function (itemNo, item) {          
		   	    if(parseFloat(item.activity) >= parseFloat(item.goal))
		   	       {
		   	       	   goal_met = goal_met + 1;
		   	       }
		   	    if(parseFloat(item.activity) < parseFloat(item.goal) && parseFloat(item.activity) >= parseFloat(item.goal)-500)
		   	       {
		   	       	   goal_met_nearly = goal_met_nearly + 1;
		   	       }                                                        
			    goal_active = goal_active + 1;                                                        
			    myActivity.push([Date.UTC(item.year,item.month - 1,item.day),parseFloat(item.activity)]);
				myGoals.push([Date.UTC(item.year,item.month - 1,item.day),parseFloat(item.goal)]);							                      
			});
                myDataArray.push(myActivity);
	            myDataArray.push(myGoals); 
	            mySeriesName = ['Activity','Goal'];    
	            console.log(myDataArray[0]);
	            console.log(myDataArray[1]);  
	            if(goal_met > 0){
	            	var res = (goal_met/goal_active)*100;
	            	summary = summary+"You met your goal "
	            	if(goal_met == 1){
	            		summary += "once ";
	            	}else{
	            	  summary += goal_met+" times ";
	            	} 
	            	  summary += "during this period. <br/>" 
	            	if(res >= 50){
	            		 summary += "You were successful "+Math.round(res)+"% of times. <br/>";
	            	}else{
	            		 summary += "You did okay. But you need to be more active."
	            	}	            	
	            }
	            /*if(goal_met_nearly > 0){
	            	summary = summary+"You nearly missed goals ";
	            	if(goal_met_nearly == 1){
	            		summary += "once. "; 
	            	}
	            	else{
	            		summary += goal_met_nearly+" times. ";
	            	}
	            }*/
	            if(form=="StepGoal"){
	            	getHistoricGoalChart("StepGoalChart", "line", myDataArray, 'Historic Goals and Activity','Steps/day',mySeriesName,width,"steps walked daily", summary);
	            	 $('#StepGoalmonitor').show('slow');
				 	 $('#StepGoal').hide('slow');
				 	$('#StepGoalChart').show(); 				 	
				 	$('#goal_chart_space').show();
				}
	            else if(form == "ModerateActivityGoal"){
	                getHistoricGoalChart("ModerateActivityGoalChart", "line", myDataArray, 'Historic Goals and Activity','Moderately active minutes/day',mySeriesName,width,"minutes when you were moderately active",summary);
	                //$('#ModerateActivityGoalmonitor').show('slow');
				 	$('#ModerateActivityGoal').hide('slow');
				 	$('#ModerateActivityGoalChart').show(); 
				 	$('#mod_goal_chart_space').show();
				}
	            else if(form == "IntenseActivityGoal"){
	                getHistoricGoalChart("IntenseActivityGoalChart", "line", myDataArray, 'Historic Goals and Activity','Moderately active minutes/day',mySeriesName,width,"minutes when you were intensely active",summary);
	             	 //$('#IntenseActivityGoalmonitor').show('slow');
				 	 $('#IntenseActivityGoal').hide('slow');
				 	 $('#IntenseActivityGoalChart').show(); 
				 	 $('#intense_goal_chart_space').show();	             
	            }  
	                
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
                        Highcharts.dateFormat('%e. %b', this.x) +': '+ Math.round(this.y);
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
var mynotes = [], chart_width;

function getStepGoalChart(chart_div,chart_type,myArray,start_date,titleText,yAxisTitle,seriesName,width,mynotes,summary, data_type){
	var target = 10000;
	console.log(mynotes);
	window.mynotes = mynotes;
	window.chart_width = width;
	$(".myloading").show();
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
                text: summary+"<br/>",
                margin: 100,
                backgroundColor: '#FCFFC5'
                
            },
            /*subtitle: {
                text: subtitle_text,
				align: 'center',
				style: {
                   color: '#ccc',
                   fontWeight: 'bold'
                }
            	//x: 80                
            },*/
            xAxis: {
            	type: 'datetime',
            	dateTimeLabelFormats: { 
					day: '%a, %e. %b'
					/*year: '%Y'*/
	               },
				tickInterval: 1 * 24 * 3600 * 1000, // one day
				tickWidth: 0,
				gridLineWidth: 1,
				labels: {
	                style: {
	                    width: 10
	                }
	            }
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
                labels:{
                	formatter: function() {
                   	 if(data_type == "steps")	return (this.value/1000) +' k';
                   	 else if(data_type == "moderate activity" || data_type == "intense activity"){
                   	 	return (this.value) +' mins';
                   	 }
                  }
                }
            },            
            legend: {
          	  enabled: false
        	},          
        	/*tooltip: {
                formatter: function() {
                    return Highcharts.dateFormat('%e. %b', this.x)+ '<br/>' + this.point.name +' is <br/> '+ this.y;
                }
            },*/
            tooltip: {
                formatter: function() {
                    var s = Highcharts.dateFormat('%e. %b', this.x);
                    var total = 0
                    var prev_goal, prev_remain;
                    var my_stats = [], my_attr = [];
                    var i = 0;
                	$.each(this.points, function(i, point) {                		
                    	  if((point.point.name != "stepremaingoal")&&(point.point.name != "stepremainprev") && (point.point.name != "Current goal") && (point.point.name != "Previous goal")){
                    	      total = total + point.y;                    	                      	  
                    	  }
                    	  if(point.point.name != "stepremainprev") prev_remain = point.y;
                    	  if(point.point.name != "Previous goal") prev_goal = point.y;              	  	
                    	  
                    	  my_stats[i] = point.y;
                    	  my_attr[i] = point.point.name;
                    	  i = i + 1;                  	  
                	}); // end of loop 1
                	if(data_type == "steps"){
	                	$.each(this.points, function(i, point) {
	                	   	if(point.point.name == 'stepovergoal'){
	                	    	if(point.y > 0){                    	                
	                	             s += '<br/> Congrats!! You have walked '+ total +'steps;';
	                	             s += '<br/> '+ point.y + ' steps over your target';
	                	       }
	                	    }              	        	  
	                	    if(point.point.name == 'stepremaingoal'){
	                	      console.log("Looking current+Prev status: "+point.point.name+","+point.y);                	    	                	    
	                	      if(point.y > 0){                    	                
	                	         s += '<br/> You have walked '+total+' steps;'
	                	         s += '<br/> You needed to do '+ point.y + ' steps more to meet your target. ';
	                	        }  
	                        }
	                	    if(point.point.name == 'stepoverprev'){
	                	      console.log("Looking Prev status: "+point.point.name+","+point.y);
	                          if((point.y > 0)&&(point.y-total!=0)){
	                             s += '<br/> But you were '+point.y+' over your previous target step count.'
	                            }
	                        }
	                   }); // end of loop 2                	   
                   }else if(data_type == "moderate activity" || data_type == "intense activity"){
	                	$.each(this.points, function(i, point) {
	                	   	if(point.point.name == 'stepovergoal'){
	                	    	if(point.y > 0){                    	                
	                	             s += '<br/> Congrats!! You did '+ total +' minutes of '+data_type+";";
	                	             s += '<br/> '+ point.y + ' minutes over your target';
	                	       }
	                	    }              	        	  
	                	    if(point.point.name == 'stepremaingoal'){
	                	      console.log("Looking current+Prev status: "+point.point.name+","+point.y);                	    	                	    
	                	      if(point.y > 0){                    	                
	                	         s += '<br/> You did '+total+' minutes of '+data_type+";";
	                	         s += '<br/> You needed to do '+ point.y + ' minutes more to meet your target. ';
	                	        }  
	                        }
	                	    if(point.point.name == 'stepoverprev'){
	                	      console.log("Looking Prev status: "+point.point.name+","+point.y);
	                          if((point.y > 0)&&(point.y-total!=0)){
	                             s += '<br/> But you were '+point.y+' minutes over your previous target.'
	                            }
	                        }
	                   }); // end of loop 2                	   
                   }              	                    	                                                                  
                   return s;
            	},
            	shared: true
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
		                           '<br/><textarea rows="5" cols="30" id="stepgoal_notes_'+ this.x +
		                           '"></textarea><br/><input type="button" class="button stepnotes_button" value="Save" onclick="saveNotes('+ this.x +'); return hs.close(this);"/>',
								width: 300,
								height:220
						     });
						  }
				       }
				    }
                },
                line: {
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
		                           '<br/><textarea rows="5" cols="30" id="stepgoal_notes_'+ this.x +
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
	            pointInterval: 24 *3600 * 1000, // one day
	            color:'#A47D7C'

            }, {
            	type: 'line',
                pointStart: start_date,
	            pointInterval: 24 *3600 * 1000, // one day
				color:'#DB843D'
            }]
        };
        options.series[4].data = myArray[4];                
        options.series[2].data = myArray[0];
        options.series[1].data = myArray[1];
        options.series[0].data = myArray[2];
        var prev_goal = 0; 
        for(var i = 0; i < myArray[3].length; i++){
        	if(myArray[3][i].y != 0){          
        	   console.log(myArray[3][i]);
        	   prev_goal = prev_goal + 1;
        	}
        }
        if(prev_goal > 0) options.series[3].data = myArray[3];
        else options.series[3].data = [0];
        
        var chart = new Highcharts.Chart(options);
        $(".myloading").hide();
	
        
}

function drawImages() {
    var chart = this;
    console.log("chart width "+window.chart_width);
    var extremes = chart.xAxis[0].getExtremes();
    console.log("Extreme", extremes);
    var x_axes = [107.96629213483146,198.97752808988764,289.98876404494376,381,472.0112359550561,563.0224719101124,654.0337078651685];
    var width = $(window).width()/100,
        height = $(window).height()/100,
        image_width = 30;
    var div = window.chart_width/100 - 1,         
        distance = window.chart_width/8.02,
        base;
    if(div < 7) base = (window.chart_width/div);
    else  base = (window.chart_width/10);
    
    console.log("Width of screen",width);
    for (var i = 0; i < chart.series[0].data.length; i++) {
    	var x, y;
    	if (i < 4){ 
    	    if(window.chart_width > 500){
    	    	base2 = base + image_width/4;
    	    	x = (base2 + i*distance) - (image_width/2);//x_axes[i]-(image_width/2);//120 + width+(i*8);//chart.plotLeft + image_width/2*i;//+ chart.xAxis[0].translate(i, false) - image_width / 2,
    	    } 
    	    else{
    	    	 base2 = base;
    	    	 x = (base2 + i*distance) - (image_width/4);
    	    }
            
        }else{
       	    x = (base + i*distance) - (image_width/2);
        }
        y = 70;//chart.plotTop - image_width / 2;
        
        console.log("start "+ base);
        console.log("distance "+ distance);    
        //console.log(chart.plotLeft,chart.plotTop);
        //console.log("x="+chart.xAxis[0].translate(i, true));
        console.log("x:"+x+", y:"+y); //http://highcharts.com/demo/gfx/sun.png
        console.log("my notes : "+window.mynotes[i]);
        var text_index = [], index = 0;
        if(window.mynotes[i] != ""){
           //text_index[index++] = i;
		   imagesMap[i] = chart.renderer.image('/static/images/emblem_note.png', x, y, image_width, image_width);
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
								   y: 500
								},
								headingText: "Notes on this day",
								maincontentText: "<ul>"+$(this).attr('title')+"</ul>",
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
        var image_width = 30,
            x = chart.plotLeft + chart.xAxis[0].translate(i, false) - image_width / 2,
            y = chart.plotTop - image_width / 2;

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

function getHistoricGoalChart(chart_div,chart_type,myArray,titleText,yAxisTitle,seriesName,width,goal_type,summary)
{
                var type = chart_type;
                var container = chart_div
		        var options = {
			      chart: {
				     renderTo: container,
			         defaultSeriesType: type,
			         width:width,
			         height:500
			      },
			      
			      title: {
				    text: summary+"<br/>",
                	margin: 100,
                	backgroundColor: '#FCFFC5'
			      },
			      
			      /*subtitle: {
				     text: summary
			      },*/
			      rangeSelector: {
			            inputBoxStyle: {
			                right: '-280px'
			            },
			            //selected: 0
			      },
			      /*rangeSelector: {
			    	     enabled: false
			      },*/
	    			      
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
				    text: "Target Steps"
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
					    /*point: {
					       events: {
						   click: function() {
						      hs.htmlExpand(null, {
								pageOrigin: {
								   x: this.pageX, 
								   y: this.pageY
								},
								headingText: "Sticky Notes",
								maincontentText: Highcharts.dateFormat('%e. %b %Y', this.x) +':<br/> '+ 								    
		                           '<br/><textarea rows="5" cols="30" id="stepgoal_notes_'+ this.x +
		                           '"></textarea><br/><input type="button" class="button stepnotes_button" value="Save" onclick="saveNotes('+ this.x +'); return hs.close(this);"/>',
								width: 300,
								height:220
								
								
						     });
						  }
				       }
				    },*/
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
			      }],
			      	
			};
		    var series = {
			      data: []
		    };
		  	options.series[0].data = myArray[0];
		  	options.series[1].data = myArray[1];

                   

	           var chart = new Highcharts.StockChart(options,function(chart){

				    // apply the date pickers
				    setTimeout(function(){
					$('input.highcharts-range-selector', $('#'+chart.options.chart.renderTo))
					    .datepicker()
				    },0)
			     });
	            // Set the datepicker's date format
		    $.datepicker.setDefaults({
			dateFormat: 'yy-mm-dd',
			onSelect: function(dateText) {
			    this.onchange();
			    this.onblur();
			}
		    });
    
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
	      //if(items){	      	  
	      	  var data = eval(items);
	   	      goal_array_plugins = ["CurrentLevelGoal","StepGoal","ModerateActivityGoal","IntenseActivityGoal","AvoidInactivityGoal"];
    		  manageFitbitGoals(data, goal_array_plugins);			 	     
		  //} // end of if
		});	   
}
//-- Function for showing current goal
var CurrentLevelGoalFunct = function getCurrentGoalDisplay(width, goal_info){
	 var mySteps = [], myDataArray = [], myRemainSteps = [];
	 console.log("found the width"+width);
	 
	 window.current_time_passed = goal_info.time_passed;
	 window.current_time_left = goal_info.time_left;
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
			       var intro = "<h3 style='color:#336699'>Get started with Fitbit:</h3> You will find your current level of activity by wearing Fitbit for a week. The chart below will show your daily step count, daily calories burned and average activity level for a week. ";
			       intro += "It is "+window.current_time_passed +" days since you started following this goal and you have "+ window.current_time_left+ " days left including today. "; 	
			       $('#CurrentLevelGoalmonitor').html(intro);
			     }
			     else{
  			        $('#CurrentLevelGoalmonitor').html("<h3>Get started with Fitbit:</h3>  No Fitbit data found");
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
	var StepGoalFunct = function getStepGoalDisplay(width, goal_info){
		            var param ="none";
		            
		            window.step_target = goal_info.target;
		            window.step_days_a_week = goal_info.days_a_week;
		            window.step_time_passed = goal_info.time_passed;
		            window.step_time_left = goal_info.time_left;
		            window.step_target_valid = goal_info.days_target_valid;
		            window.step_target_met = goal_info.days_target_met;  
		            show_step_chart(param);
            		
            		$('#StepGoalButtons').show();
            		$('#StepGoalButtons input').each(function(){
                  	console.log("Enabling buttons");
					$(this).removeAttr('disabled');
 			});
            
	};
	// Function for shpwing moderate goal
	var ModerateGoalFunct = function getModerateGoalDisplay(width, goal_info){
            		$('#ModerateActivityGoalButtons').show();
            		
            		window.mod_target = goal_info.target;
		            window.mod_days_a_week = goal_info.days_a_week;
		            window.mod_time_passed = goal_info.time_passed;
		            window.mod_time_left = goal_info.time_left;
		              
            		var param = "none_ModerateActivityGoal";
            		show_moderate_activity_chart(param);
            		$('#ModerateActivityGoalButtons input').each(function(){
                  		console.log("Enabling buttons");
						$(this).removeAttr('disabled');
            		});
		
	};
	// Function for showing intense goal
	var IntenseGoalFunct = function getIntenseGoalDisplay(width, goal_info){
					$('#IntenseActivityGoalButtons').show();
            		window.int_target = goal_info.target;
		            window.int_days_a_week = goal_info.days_a_week;
		            window.int_time_passed = goal_info.time_passed;
		            window.int_time_left = goal_info.time_left;
					
            		var param = "none_IntenseActivityGoal";
            		show_intense_activity_chart(param);
            		$('#IntenseActivityGoalButtons input').each(function(){
                  		console.log("Enabling buttons");
						$(this).removeAttr('disabled');
            		});
		
	};
	var AvoidInactivityGoalFunct = function getAvoidInactivityGoalDisplay(width, goal_info){
		var mySteps = [], myDataArray = [], myRemainSteps = [],myExceedSteps = [];
		console.log("found the width"+width);
		jQuery.getJSON('/show_step_goal?data=none', null, function (items) {
			     console.log(eval(items));  
			     var newgoal = "Step goal";    
                 console.log("Showing chart for "+newgoal);	
                 data = eval(items);
			     if(data.length != 0){  
			      $('#AvoidInactivityGoalmonitor').text(newgoal+": Here is the graph for monitoring your progress towards this goal. This chart is based on your Fitbit data.");
			     }
			     else{
  			        $('#AvoidInactivityGoalmonitor').text(newgoal+": No Fitbit data found");
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
                        getStepGoalChart("AvoidInactivityyGoalChart", "column", myDataArray, 'Steps walked in seven days','Steps/day',mySeriesName,width);                                               		           						                        		               
		                $('#AvoidInactivityGoalmonitor').show('slow');
			 			$('#AvoidInactivityGoal').hide('slow');
			 			$('#AvoidInactivityGoalChart').show(); 
			 			//$('#stepButtons').show();
            });
		
	};	
	
//---List of all the goals available in Mneme
var goal_function_fitbit = [CurrentLevelGoalFunct,StepGoalFunct,ModerateGoalFunct,IntenseGoalFunct,AvoidInactivityGoalFunct];	

function manageFitbitGoals(active_goals, goal_array_fitbit){

    var goal_new_function = [];
	for(var i = 0; i < goal_array_fitbit.length; i++){
		//---Check the goals that are active now
		if(active_goals){
			for(var j = 0; j < active_goals.length; j++){	   		    
			    if(goal_array_fitbit[i] == active_goals[j].name){
			    	console.log("Already Set goal: "+active_goals[j].name);                           		                 
			        if(active_goals[j].show_chart == 1){ 
			           goal_array_fitbit.splice(i,1);
			       	   goal_new_function[j] = goal_function_fitbit[i];	
			       	 }  	  	 	
		         }
		      }
	   }		                     			               
	}
	for(var i = 0; i < goal_array_fitbit.length; i++){
		        $('#'+goal_array_fitbit[i]+" input.goals").attr('id','Fitbit');
		        $('#'+goal_array_fitbit[i]+" input.details").attr('id','Fitbit');		              	              
		        $('#'+goal_array_fitbit[i]).show('fast'); 	
		        //$('#'+goal_array_fitbit[i]+' input.historicbutton').attr('disabled','disabled');
		        goal_function_fitbit.splice(i,1);

	}
	var manage_cur_goal = 0;
	
				  
	/*var header = "You have Fitbit plugin installed. ";				  
	$("#GoalHeader").text(header);
	header = "<b>Number of active goals: " + goal_array_fitbit.length+"."
	header += " Number of inactive goals: "+(4-goal_array_fitbit.length)+"</b>";
	$("#GoalHeader").append(header);
	$("#goal_head_title").show('fast');
	if(goal_array_fitbit.length < 4 && goal_array_fitbit.length >= 1) {
	    var goal_link = "<p> Click <a href='#Goals' style='color:#fff'> here </a> to set more goals.</p>";
	    $('#goal_chart_space').show();
	}else{ $('#goal_chart_space').hide();}				  				  
	$("#GoalHeader").append(goal_link);
	$("#GoalHeader").show('fast');	*/	
				  		    
    /*if(goal_array_fitbit.length < 5 && goal_array_fitbit.length >= 1) {	    
	    $('#goal_chart_space').show();
	}else{ 
		$('#goal_chart_space').hide();
	}*/
	if(active_goals){			
	    for(var j = 0; j < active_goals.length; j++){				  	
			console.log("Getting data for " + active_goals[j].name);  				  	
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
			if(active_goals[j].name == "CurrentLevelGoal" && active_goals[j].show_chart == 1){
		         	manage_cur_goal = 1;
		         	console.log("Current goal found");	         		
		     }
		     
			if(active_goals[j].show_chart == 1){
			   console.log("Calling function for showing charts: "+active_goals[j].name);
			   if(active_goals[j].name == "CurrentLevelGoal"){
			      	CurrentLevelGoalFunct(width, active_goals[j]);
			   }else if(active_goals[j].name == "StepGoal"){
			      	StepGoalFunct(width, active_goals[j]);
			   }else if(active_goals[j].name == "ModerateActivityGoal"){
			      	ModerateGoalFunct(width, active_goals[j]);
			   }else if(active_goals[j].name == "IntenseActivityGoal"){
			      	IntenseGoalFunct(width, active_goals[j]);
			   }else if(active_goals[j].name == "AvoidInactivityGoal"){
			      	AvoidInactivityGoalFunct(width, active_goals[j]);
			   }	   		   	
			   //goal_new_function[j](width, active_goals[j]);
			}				  	  
	     }	
         if(manage_cur_goal == 1)
        		manageCurrentGoalPanel(width);		
    }// end of if active_goals
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
           console.log(notes); 
             $.ajax({  
			    type: "POST",  
			    url: "/add_notes_to_activity?note="+notes,  
			    data: "",  
                processdata:true,
			    success: function(data){
			    	//alert(data);
			    	getGoaldata("note");
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
function show_current_goal_chart(type,chart,div,width){
	    myData = [];
	    //type="steps"
		jQuery.getJSON('/show_current_goal?data='+type, null, function (items) {
			     console.log(eval(items)); 
			     var newgoal = "Current level goal";    
                 console.log("Showing chart for "+newgoal);	
			     
			     //console.log("Length:"+items.length);
			     if(items){
	 		     	 items = eval(items);
				     if(items.length != 0){  
			      		 var intro = '<h3 style="color:#336699">Get started with Fitbit:</h3> You will find your current level of activity by wearing Fitbit for a week. The chart below will show your daily step count, daily calories burned and average activity level for a week. It is ';
			       		 intro += window.current_time_passed +" days since you started following this goal and you have "+ window.current_time_left+ " days left including today. "; 	
			       		 $('#CurrentLevelGoalmonitor').html(intro);
			     	}
			     	else{
  			        	$('#CurrentLevelGoalmonitor').html("<h3 style='color:#339966'>Get started with Fitbit:</h3>  No Fitbit data found");
			     	}
			     
			         for(var k = 0; k < items.length; k++){                                      
                       console.log("My data:"+items[k]);
                       if (type == "steps")
					      myData.push([Date.UTC(items[k].year,items[k].month - 1,items[k].day),parseFloat(items[k].steps)]);
                       else if (type == "calories")
					      myData.push([Date.UTC(items[k].year,items[k].month - 1,items[k].day),Math.round(parseFloat(items[k].calories))]);
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
                          getGoalPieChart(div,myData,'Average active minutes in seven days','Active minutes',width);
                          
                       show_goal_monitorpanel("CurrentLevelGoal");
		                
            });
		
}

function show_step_chart(param){
	     var mySteps = [], myDataArray = [], myRemainSteps = [], myExceedSteps = [];
	     var myPrevRemainSteps = [], myGoalSteps = [], myNotes = [], myDates = [];
	     var width = $(window).width();
	     width = ($(window).width() * 56.5)/100;
		 console.log("found the width"+width);		 
	     jQuery.getJSON('/show_step_goal?data='+param, null, function (items) {
			     console.log(eval(items));  
			     var newgoal = "Step goal";    
                 console.log("Showing chart for "+newgoal);	
                 var data = eval(items);
                 console.log(data)
                 var test;
                 if(data.length == null){
                 	test = data.goalEnd;
                 	console.log("No fitbit:"+test);                 	
                 }
			     if(test){
			    	 
		  	         $('#StepGoal input.goals').attr('id',"Fitbit");
			         $('#StepGoal input.details').attr('id',"Fitbit");
			         $('#StepGoalButtons').hide();		              	              			         			                     			               
		       		 $('#goal_chart_space').hide();
		       		 if(test.indexOf("Please") != -1 ){
		       			 console.log(test+"Please...please");
		       		 }else{
		       			$('#StepGoal').show('fast');
		       		}
			 	}
			 	else{ 
				
	                 var goal_summary_text = "";
	                 var exceed_prev = 0, exceed_cur = 0;
	                 
				     if(data.length != 0){
				        var intro = "<h3>Step goal:</h3> Your current target is to walk "+data[0].cur_target +" steps per day; " + window.step_days_a_week + " days a week. ";
				        if(window.step_time_passed > 0){
					        intro += "You have been following this goal for ";
	
					     	 
					     	//--Time passed
					     	var days, weeks; 
					     	if(window.step_time_passed >= 7){
					     	   weeks = parseInt(window.step_time_passed / 7);
					     	   days = window.step_time_passed % 7;
					     	   intro += weeks;
					     	   if(weeks > 1) intro += " weeks";
					     	   else intro += "week";
					     	   
					     	   if(days != 0){
					     	   	 if(days == 1) intro+= " and "+days+" day";
					     	   	 else intro+= " and "+days+" days";
					     	   }
					     	}else{
					     	   days = window.step_time_passed;
					     	   weeks = 0; 	
					     	   if(days == 1) intro+= days+" day";
					     	   else intro+= days+" days";
					     	}
					    	intro += ". "
					    }  
					    if(window.step_time_left > 0){
					     	intro += "You have "
					     	//----Time left
					     	var days2, weeks2;
					        if(window.step_time_left >= 7){
					     	   weeks2 = parseInt(window.step_time_left / 7);
					     	   days2 = window.step_time_left % 7;
					     	   intro += weeks2;
					     	   if(weeks2 > 1) intro += " weeks";
					     	   else intro += "week";
					     	   
					     	   if(days2 != 0){
					     	   	 if(days2 == 1) intro+= " and "+days2+" day";
					     	   	 else intro+= " and "+days2+" days";
					     	   }
					     	}else{
					     	   days2 = window.step_time_left;
					     	   weeks2 = 0; 	
					     	   if(days2 == 1) intro+= "and "+days2+" day";
					     	   else intro+= "and "+days2+" days";
					     	} 
					     	intro += " left including today. "
					     }
					     if(window.step_target_valid != 0 && window.step_target_met != 0){
					     	   var percentage = window.step_target_met/window.step_target_valid;
					     	   console.log (window.step_target_met+"/"+window.step_target_valid);
					     	   intro += "So far your were successful "+Math.round(percentage*100,2)+"% of the times. "
					     }
				        $('#StepGoalmonitor').html(intro);
				     }
				     else{
	  			        $('#StepGoalmonitor').html("<h3>Step goal:</h3>: No Fitbit data found");
				     }
				     	                              
		               for(var k = 0; k < data.length; k++){
		               	   item = data[k];                                      
	                       console.log(item);
	                       //--If I have not walked at all
	                       if(item.steps == 0){
	                       	   	 mySteps.push({y: parseFloat(0), color:'#009ACD', name:'stepreachgoal'});
		                       	 myPrevRemainSteps.push(parseFloat(0));
		                       	 myRemainSteps.push({y:parseFloat(0), color:'#89A54E', name:'stepovergoal'});
								 
	                       }else{//--I have walked
	                       if(item.remain < 0){ //-- and I exceed my current goal
	                       	     var cur_goal = item.steps + item.remain;
	                       	     var cur_remain = Math.abs(item.remain);
		                       	 mySteps.push({y: parseFloat(cur_goal), color:'#009ACD', name:'stepreachgoal'});
		                       	 myPrevRemainSteps.push(parseFloat(0));
		                       	 myRemainSteps.push({y:parseFloat(cur_remain), color:'#89A54E', name:'stepovergoal'});
								 exceed_cur = exceed_cur + 1;
								 /*mySteps.push([Date.UTC(item.year,item.month - 1,item.day),{y: parseFloat(cur_goal), color:'#45CCCC'}]);
		                       	 myPrevRemainSteps.push([Date.UTC(item.year,item.month - 1,item.day),parseFloat(0)]);
		                       	 myRemainSteps.push([Date.UTC(item.year,item.month - 1,item.day),{y:parseFloat(-item.remain), color:'#89A54E'}]);*/	                       	 
	                       }
	                       else{//-- and I have not reached my current goal               	 
	                       	 if(item.prev_remain < 0){ // but I exceeded my previous goal
	                       	     prev_goal = item.steps + item.prev_remain;
	                       	     var cur_remain = item.remain + item.prev_remain;
	                       	     var prev_remain = Math.abs(item.prev_remain);   
		                       	 mySteps.push({y: parseFloat(prev_goal), color:'#009ACD', name:'stepreachprev'});
		                       	 myPrevRemainSteps.push({y:parseFloat(prev_remain), color:'#63B8FF', name:'stepoverprev'});
		                       	 myRemainSteps.push({y:parseFloat(item.remain), color:'#FFFFFF', name:'stepremaingoal'});                       	 	
								 exceed_prev = exceed_prev + 1;
		                       	 /*mySteps.push([Date.UTC(item.year,item.month - 1,item.day),{y: parseFloat(prev_goal), color:'#45CCCC'}]);
		                       	 myPrevRemainSteps.push([Date.UTC(item.year,item.month - 1,item.day),{y:parseFloat(-item.prev_remain), color:'#4572A7'}]);
		                       	 myRemainSteps.push([Date.UTC(item.year,item.month - 1,item.day),{y:parseFloat(cur_remain), color:'#FFFFFF'}]);*/                       	 	
	                       	 }else{//-- and I have not reached my previous goal either 
	                       	 	 if(item.prev_target < item.cur_target){                       	    
	                       	        var cur_remain = item.remain - item.prev_remain;   
		                       	    mySteps.push({y: parseFloat(item.steps), color:'#009ACD', name:'step'});
		                       	    if(parseFloat(items.steps) < 50){
		                       	     myPrevRemainSteps.push({y:parseFloat(item.prev_remain), color:'#FFF', name:'stepremainprev'});
		                       	 	}else{
		                       	   	myPrevRemainSteps.push({y:parseFloat(item.prev_remain), color:'#CCC', name:'stepremainprev'});
		                       	 	}
		                       	 	myRemainSteps.push({y:parseFloat(cur_remain), color:'#FFFFFF', name:'stepremaingoal'});                       	 	
								}
								else{
									mySteps.push({y: parseFloat(item.steps), color:'#009ACD', name:'step'});
		                       	    myPrevRemainSteps.push({y:parseFloat(0), color:'#CCC', name:'stepremainprev'});		                       	 	
		                       	 	myRemainSteps.push({y:parseFloat(item.remain), color:'#FFFFFF', name:'stepremaingoal'});                       	 	
									
								}
		                       	 /*mySteps.push([Date.UTC(item.year,item.month - 1,item.day),{y: parseFloat(item.steps), color:'#45CCCC'}]);
		                       	 myPrevRemainSteps.push([Date.UTC(item.year,item.month - 1,item.day),{y:parseFloat(item.prev_remain), color:'#4E4E4E'}]);
		                       	 myRemainSteps.push([Date.UTC(item.year,item.month - 1,item.day),{y:parseFloat(cur_remain), color:'#FFFFFF'}]);*/                       	 	
	                       	 	
	                       	 }// --end i haven't reached my previous goal
	                        }// --end i haven't reached my current goal
	                       }// --end i have walked
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
	        		if(exceed_cur != 0){
	        			goal_summary_text = "Well done!!! You met your target ";
	        			if (exceed_cur == 1){ 
	        			   goal_summary_text += "once";
	        			}else{
	        			   goal_summary_text += exceed_cur+" times";
	        			}
	        			goal_summary_text +=" this week. Keep it up!!!";
	        		}else{
	        		   if(exceed_prev != 0){
	        		   	  goal_summary_text = "You met your previous target ";
	        		   	  if(exceed_prev == 1)
	        		   	     goal_summary_text += "once";
	        		   	  else
	        		   	     goal_summary_text += exceed_prev+" times"
	        		   	  goal_summary_text += " this week.";
	        		 }
	        		  /* else{
	        		      goal_summary_text = "Looking forward to meet the goal. Carry on!!!"  
	        		   }*/
	        		}
	        		var data_type = "steps"
	        		$('.myloading').show();
	                getStepGoalChart("StepGoalChart", "column", myDataArray, start_date, 'Steps walked in this week','Steps/day', mySeriesName, width, myNotes, goal_summary_text, data_type);                                               		           						                        		               
	           
			        $('#StepGoalmonitor').show('slow');
				 	$('#StepGoal').hide('slow');
				 	$('#StepGoalChart').show(); 
				 	$('#StepGoalButtons').show();
				 	//----Next prev button show/hide based on the date
				 	
				 	$('#goal_chart_space').show();
				 	$('.myloading').hide();
			 	}
            });
	
}
function show_moderate_activity_chart(param){
		var mySteps = [], myDataArray = [], myRemainSteps = [],myExceedSteps = [];
		var myPrevRemainSteps = [], myGoalSteps = [], myNotes = [], myDates = [];
	    var width = $(window).width();
	    width = ($(window).width() * 56.5)/100;
		console.log("found the width"+width);
		 
		console.log("found the width"+width);
		
		jQuery.getJSON('/show_moderate_activity_goal?data='+param, null, function (items) {
				 console.log(eval(items));  
			     var newgoal = "Moderate Activity goal";    
                 console.log("Showing chart for "+newgoal);	
                 data = eval(items);
                 
                 var test = data[0].goalEnd;
			     if(test){
			    	//console.log("Items:"+eval(items));
		  	        $('#ModerateActivityGoal input.goals').attr('id',"Fitbit");
			        $('#ModerateActivityGoal input.details').attr('id',"Fitbit");		              	              
			        $('#ModerateActivityGoal').show('fast'); 			                     			               
		       		$('#mod_goal_chart_space').hide();
			 	}
			 	else{ 
				
	                 var goal_summary_text = "";
	                 var exceed_prev = 0, exceed_cur = 0;
	                 
				     if(data.length != 0){ 
				       	
				       	var intro = "<h3>Increase Moderate Activity Goal:</h3> Your current target is to do "+data[0].cur_target +" minutes of moderate activity per day; "+window.mod_days_a_week+" days a week. ";
				       	
				       	if(window.mod_time_passed > 0){
					       	intro += "You have been following this goal for ";
	
					     	 
					     	//--Time passed
					     	var days, weeks; 
					     	if(window.mod_time_passed >= 7){
					     	   weeks = parseInt(window.mod_time_passed / 7);
					     	   days = window.mod_time_passed % 7;
					     	   intro += weeks;
					     	   if(weeks > 1) intro += " weeks";
					     	   else intro += "week";
					     	   
					     	   if(days != 0){
					     	   	 if(days == 1) intro+= " and "+days+" day";
					     	   	 else intro+= " and "+days+" days";
					     	   }
					     	}else{
					     	   days = window.mod_time_passed;
					     	   weeks = 0; 	
					     	   if(days == 1) intro+= days+" day";
					     	   else intro+= days+" days";
					     	}
					     	intro += ". ";
					    } 
					    if(window.mod_time_left > 0){
					     	intro += "You have "
					     	//----Time left
					     	var days2, weeks2;
					        if(window.mod_time_left >= 7){
					     	   weeks2 = parseInt(window.mod_time_left / 7);
					     	   days2 = window.mod_time_left % 7;
					     	   intro += weeks2;
					     	   if(weeks2 > 1) intro += " weeks";
					     	   else intro += "week";
					     	   
					     	   if(days2 != 0){
					     	   	 if(days2 == 1) intro+= " and "+days2+" day";
					     	   	 else intro+= " and "+days2+" days";
					     	   }
					     	}else{
					     	   days2 = window.mod_time_left;
					     	   weeks2 = 0; 	
					     	   if(days2 == 1) intro+= "and "+days2+" day";
					     	   else intro+= "and "+days2+" days";
					     	} 
					     	intro += " left including today."
						}	 
				      $('#ModerateActivityGoalmonitor').html(intro);
				     }
				     else{
	  			        $('#ModerateActivityGoalmonitor').text(newgoal+": No Fitbit data found");
				     }
				     	                              
		               for(var k = 0; k < data.length; k++){
		               	   item = data[k];                                      
	                       console.log(item);
	                       //--If I have not walked at all
	                       if(item.active_mins == 0){
	                       	   	 mySteps.push({y: parseFloat(0), color:'#009ACD', name:'stepreachgoal'});
		                       	 myPrevRemainSteps.push(parseFloat(0));
		                       	 myRemainSteps.push({y:parseFloat(0), color:'#89A54E', name:'stepovergoal'});
								 
	                       }else{//--I have walked
	                       if(item.remain < 0){ //-- and I exceed my current goal
	                       	     var cur_goal = item.active_mins + item.remain;
	                       	     var cur_remain = Math.abs(item.remain);
		                       	 mySteps.push({y: parseFloat(cur_goal), color:'#009ACD', name:'stepreachgoal'});
		                       	 myPrevRemainSteps.push(parseFloat(0));
		                       	 myRemainSteps.push({y:parseFloat(cur_remain), color:'#89A54E', name:'stepovergoal'});
								 exceed_cur = exceed_cur + 1;
								 /*mySteps.push([Date.UTC(item.year,item.month - 1,item.day),{y: parseFloat(cur_goal), color:'#45CCCC'}]);
		                       	 myPrevRemainSteps.push([Date.UTC(item.year,item.month - 1,item.day),parseFloat(0)]);
		                       	 myRemainSteps.push([Date.UTC(item.year,item.month - 1,item.day),{y:parseFloat(-item.remain), color:'#89A54E'}]);*/	                       	 
	                       }
	                       else{//-- and I have not reached my current goal               	 
	                       	 if(item.prev_remain < 0){ // but I exceeded my previous goal
	                       	     prev_goal = item.active_mins + item.prev_remain;
	                       	     var cur_remain = item.remain + item.prev_remain;
	                       	     var prev_remain = Math.abs(item.prev_remain);   
		                       	 mySteps.push({y: parseFloat(prev_goal), color:'#009ACD', name:'stepreachprev'});
		                       	 myPrevRemainSteps.push({y:parseFloat(prev_remain), color:'#63B8FF', name:'stepoverprev'});
		                       	 myRemainSteps.push({y:parseFloat(item.remain), color:'#FFFFFF', name:'stepremaingoal'});                       	 	
								 exceed_prev = exceed_prev + 1;
		                       	 /*mySteps.push([Date.UTC(item.year,item.month - 1,item.day),{y: parseFloat(prev_goal), color:'#45CCCC'}]);
		                       	 myPrevRemainSteps.push([Date.UTC(item.year,item.month - 1,item.day),{y:parseFloat(-item.prev_remain), color:'#4572A7'}]);
		                       	 myRemainSteps.push([Date.UTC(item.year,item.month - 1,item.day),{y:parseFloat(cur_remain), color:'#FFFFFF'}]);*/                       	 	
	                       	 }else{//-- and I have not reached my previous goal either                        	    
	                       	     var cur_remain = item.remain - item.prev_remain;   
		                       	 mySteps.push({y: parseFloat(item.active_mins), color:'#009ACD', name:'step'});
		                       	 if(parseFloat(items.active_mins) < 50){
		                       	   myPrevRemainSteps.push({y:parseFloat(item.prev_remain), color:'#FFF', name:'stepremainprev'});
		                       	 }else{
		                       	   myPrevRemainSteps.push({y:parseFloat(item.prev_remain), color:'#CCC', name:'stepremainprev'});
		                       	 }
		                       	 myRemainSteps.push({y:parseFloat(cur_remain), color:'#FFFFFF', name:'stepremaingoal'});                       	 	
	
		                       	 /*mySteps.push([Date.UTC(item.year,item.month - 1,item.day),{y: parseFloat(item.steps), color:'#45CCCC'}]);
		                       	 myPrevRemainSteps.push([Date.UTC(item.year,item.month - 1,item.day),{y:parseFloat(item.prev_remain), color:'#4E4E4E'}]);
		                       	 myRemainSteps.push([Date.UTC(item.year,item.month - 1,item.day),{y:parseFloat(cur_remain), color:'#FFFFFF'}]);*/                       	 	
	                       	 	
	                       	 }// --end i haven't reached my previous goal
	                        }// --end i haven't reached my current goal
	                       }// --end i have walked
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
	        		if(exceed_cur != 0){
	        			goal_summary_text = "Well done!!! You met your target ";
	        			if (exceed_cur == 1){ 
	        			   goal_summary_text += "once";
	        			}else{
	        			   goal_summary_text += exceed_cur+" times";
	        			}
	        			goal_summary_text +=" this week. Keep it up!!!";
	        		}else{
	        		   if(exceed_prev != 0){
	        		   	  goal_summary_text = "You met your previous target ";
	        		   	  if(exceed_prev == 1)
	        		   	     goal_summary_text += "once";
	        		   	  else
	        		   	     goal_summary_text += exceed_prev+" times"
	        		   	  goal_summary_text += " this week.";
	        		 }
	        		  /* else{
	        		      goal_summary_text = "Looking forward to meet the goal. Carry on!!!"  
	        		   }*/
	        		}
	        		var data_type = "moderate activity"
	                getStepGoalChart("ModerateActivityGoalChart", "column", myDataArray, start_date, 'My moderately active minutes in this week', 'Minutes/day', mySeriesName, width, myNotes, goal_summary_text, data_type);                                               		           						                        		               
	           
			        $('#ModerateActivityGoalmonitor').show('slow');
				 	$('#ModerateActivityGoal').hide('slow');
				 	$('#ModerateActivityGoalChart').show(); 
				 	$('#mod_goal_chart_space').show();
			 	}
            });
	
}
function show_intense_activity_chart(param){
		var mySteps = [], myDataArray = [], myRemainSteps = [],myExceedSteps = [];
		var myPrevRemainSteps = [], myGoalSteps = [], myNotes = [], myDates = [];
	    var width = $(window).width();
	    width = ($(window).width() * 56.5)/100;
		console.log("found the width"+width);
		 
		console.log("found the width"+width);
		
		jQuery.getJSON('/show_intense_activity_goal?data='+param, null, function (items) {
				 console.log(eval(items));  
			     var newgoal = "Intense Activity goal";    
                 console.log("Showing chart for "+newgoal);	
                 data = eval(items);
                 
                 var test = data[0].goalEnd;
			     if(test){
			    	//console.log("Items:"+eval(items));
		  	        $('#IntenseActivityGoal input.goals').attr('id',"Fitbit");
			        $('#IntenseActivityGoal input.details').attr('id',"Fitbit");		              	              
			        $('#IntenseActivityGoal').show('fast'); 			                     			               
		       		$('#intense_goal_chart_space').hide();
			 	}
			 	else{ 
				
	                 var goal_summary_text = "";
	                 var exceed_prev = 0, exceed_cur = 0;
	                 
				     if(data.length != 0){  
				     	var intro = "<h3>Increase Intense Activity Goal:</h3> Your current target is to do "+data[0].cur_target +" minutes of intense activity per day; "+window.int_days_a_week+" days a week. ";
				       	
				       	if(window.int_time_passed>0){
					       	intro += "You have been following this goal for ";						     	 
					     	//--Time passed
					     	var days, weeks; 
					     	if(window.int_time_passed >= 7){
					     	   weeks = parseInt(window.int_time_passed / 7);
					     	   days = window.int_time_passed % 7;
					     	   intro += weeks;
					     	   if(weeks > 1) intro += " weeks";
					     	   else intro += "week";
					     	   
					     	   if(days != 0){
					     	   	 if(days == 1) intro+= " and "+days+" day";
					     	   	 else intro+= " and "+days+" days";
					     	   }
					     	}else{
					     	   days = window.int_time_passed;
					     	   weeks = 0; 	
					     	   if(days == 1) intro+= days+" day";
					     	   else intro+= days+" days";
					     	}
					     	intro += ". "
					    } 
					    if(window.int_time_left > 0){
					     	intro += "You have "
					     	//----Time left
					     	var days2, weeks2;
					        if(window.int_time_left >= 7){
					     	   weeks2 = parseInt(window.int_time_left / 7);
					     	   days2 = window.int_time_left % 7;
					     	   intro += weeks2;
					     	   if(weeks2 > 1) intro += " weeks";
					     	   else intro += "week";
					     	   
					     	   if(days2 != 0){
					     	   	 if(days2 == 1) intro+= " and "+days2+" day";
					     	   	 else intro+= " and "+days2+" days";
					     	   }
					     	}else{
					     	   days2 = window.int_time_left;
					     	   weeks2 = 0; 	
					     	   if(days2 == 1) intro+= "and "+days2+" day";
					     	   else intro+= "and "+days2+" days";
					     	} 
					     	intro += " left including today."
						}
				        $('#IntenseActivityGoalmonitor').html(intro);
				     }
				     else{
	  			        $('#IntenseActivityGoalmonitor').text(newgoal+": No Fitbit data found");
				     }
				     	                              
		               for(var k = 0; k < data.length; k++){
		               	   item = data[k];                                      
	                       console.log(item);
	                       //--If I have not walked at all
	                       if(item.active_mins == 0){
	                       	   	 mySteps.push({y: parseFloat(0), color:'#009ACD', name:'stepreachgoal'});
		                       	 myPrevRemainSteps.push(parseFloat(0));
		                       	 myRemainSteps.push({y:parseFloat(0), color:'#89A54E', name:'stepovergoal'});
								 
	                       }else{//--I have walked
	                       if(item.remain < 0){ //-- and I exceed my current goal
	                       	     var cur_goal = item.active_mins + item.remain;
	                       	     var cur_remain = Math.abs(item.remain);
		                       	 mySteps.push({y: parseFloat(cur_goal), color:'#009ACD', name:'stepreachgoal'});
		                       	 myPrevRemainSteps.push(parseFloat(0));
		                       	 myRemainSteps.push({y:parseFloat(cur_remain), color:'#89A54E', name:'stepovergoal'});
								 exceed_cur = exceed_cur + 1;
								 /*mySteps.push([Date.UTC(item.year,item.month - 1,item.day),{y: parseFloat(cur_goal), color:'#45CCCC'}]);
		                       	 myPrevRemainSteps.push([Date.UTC(item.year,item.month - 1,item.day),parseFloat(0)]);
		                       	 myRemainSteps.push([Date.UTC(item.year,item.month - 1,item.day),{y:parseFloat(-item.remain), color:'#89A54E'}]);*/	                       	 
	                       }
	                       else{//-- and I have not reached my current goal               	 
	                       	 if(item.prev_remain < 0){ // but I exceeded my previous goal
	                       	     prev_goal = item.active_mins + item.prev_remain;
	                       	     var cur_remain = item.remain + item.prev_remain;
	                       	     var prev_remain = Math.abs(item.prev_remain);   
		                       	 mySteps.push({y: parseFloat(prev_goal), color:'#009ACD', name:'stepreachprev'});
		                       	 myPrevRemainSteps.push({y:parseFloat(prev_remain), color:'#63B8FF', name:'stepoverprev'});
		                       	 myRemainSteps.push({y:parseFloat(item.remain), color:'#FFFFFF', name:'stepremaingoal'});                       	 	
								 exceed_prev = exceed_prev + 1;
		                       	 /*mySteps.push([Date.UTC(item.year,item.month - 1,item.day),{y: parseFloat(prev_goal), color:'#45CCCC'}]);
		                       	 myPrevRemainSteps.push([Date.UTC(item.year,item.month - 1,item.day),{y:parseFloat(-item.prev_remain), color:'#4572A7'}]);
		                       	 myRemainSteps.push([Date.UTC(item.year,item.month - 1,item.day),{y:parseFloat(cur_remain), color:'#FFFFFF'}]);*/                       	 	
	                       	 }else{//-- and I have not reached my previous goal either                        	    
	                       	     var cur_remain = item.remain - item.prev_remain;   
		                       	 mySteps.push({y: parseFloat(item.active_mins), color:'#009ACD', name:'step'});
		                       	 if(parseFloat(items.active_mins) < 50){
		                       	   myPrevRemainSteps.push({y:parseFloat(item.prev_remain), color:'#FFF', name:'stepremainprev'});
		                       	 }else{
		                       	   myPrevRemainSteps.push({y:parseFloat(item.prev_remain), color:'#CCC', name:'stepremainprev'});
		                       	 }
		                       	 myRemainSteps.push({y:parseFloat(cur_remain), color:'#FFFFFF', name:'stepremaingoal'});                       	 	
	
		                       	 /*mySteps.push([Date.UTC(item.year,item.month - 1,item.day),{y: parseFloat(item.steps), color:'#45CCCC'}]);
		                       	 myPrevRemainSteps.push([Date.UTC(item.year,item.month - 1,item.day),{y:parseFloat(item.prev_remain), color:'#4E4E4E'}]);
		                       	 myRemainSteps.push([Date.UTC(item.year,item.month - 1,item.day),{y:parseFloat(cur_remain), color:'#FFFFFF'}]);*/                       	 	
	                       	 	
	                       	 }// --end i haven't reached my previous goal
	                        }// --end i haven't reached my current goal
	                       }// --end i have walked
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
	        		if(exceed_cur != 0){
	        			goal_summary_text = "Well done!!! You met your target ";
	        			if (exceed_cur == 1){ 
	        			   goal_summary_text += "once";
	        			}else{
	        			   goal_summary_text += exceed_cur+" times";
	        			}
	        			goal_summary_text +=" this week. Keep it up!!!";
	        		}else{
	        		   if(exceed_prev != 0){
	        		   	  goal_summary_text = "You met your previous target ";
	        		   	  if(exceed_prev == 1)
	        		   	     goal_summary_text += "once";
	        		   	  else
	        		   	     goal_summary_text += exceed_prev+" times"
	        		   	  goal_summary_text += " this week.";
	        		 }
	        		  /* else{
	        		      goal_summary_text = "Looking forward to meet the goal. Carry on!!!"  
	        		   }*/
	        		}
	        		var data_type = "intense activity"
	                getStepGoalChart("IntenseActivityGoalChart", "column", myDataArray, start_date, 'My intensly active minutes in this week', 'Minutes/day', mySeriesName, width, myNotes, goal_summary_text, data_type);                                               		           						                        		               
	           
			        $('#IntenseActivityGoalmonitor').show('slow');
				 	$('#IntenseActivityGoal').hide('slow');
				 	$('#IntenseActivityGoalChart').show(); 
				 	$('#intense_goal_chart_space').show();
			 	}
            });
	
}
$(document).ready(function() {initGoalOptions();});
//]]>
