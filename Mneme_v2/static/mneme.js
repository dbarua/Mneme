/*This is the js file with utilities*/
/* Called in layout_home_109.html and layout_browser_new.html*/
function handleMenuBar(page){
	
	$('a.main_menu').click(function(){
           var gotopage = $(this).attr('id');
           var redirect_page = ""
           console.log(gotopage);
		   if(gotopage == "Home"){
			redirect_page = "/browse";
		   }
	       else if(gotopage == "UMBrowser"){
			redirect_page="/show_sub_context?context=Apps/";
		   }
           send_comments(redirect_page); 

	});
}
function handleSideBar(page){
         var current= "" 
		 $('.expando, .normal').live('hover', function(e){
		    var cur_context_path_id = $(this).attr('id');
		    var cur_context_path = $(this).attr('data-div-id');
		    console.log("Parent path as id: "+cur_context_path);
		    var cur_context = $(this).attr('title');
		    console.log("Context: "+cur_context);
		    var sublist = [];
		    var comment = "Model Browser (left menu): Expand "+cur_context_path+" on hover";
		    window.log_events[window.log_index++] = comment; 

		    $('#'+cur_context_path_id).children('ul').remove();
		    /*var contextList = $(this).parents('li')
		     .map(function () { 
		            //console.log(this.id) 
		            return this.id; 
		        }).get();

		    var context = ""; 
		    if(contextList.length){ 
		        for(var i=contextList.length-1; i>=0; i--){
		           context += contextList[i] + '/'; 
		       }
		    }*/
		    context = cur_context_path;
		    //context = context.replace(/\s/g, '');
		    
		    ncontext = context.split('+');
		    context = ncontext.join('/');
		    
	        current = context;
	        if(ncontext.length < 2){
				console.log("Send Context "+context+" to fetch sub context");
			    $.getJSON('/get_sub_context?context='+context, function(data) {
			       var items = [], lis = [];
			       items = eval(data);
			       console.log(data);               
	               if(items){
						   for(var i=0; i< items.length; i++){
							   if(items[i].indexOf(':expand') != -1){
							      items[i] = items[i].split(':')[0];
							            console.log("New Item"+items[i]) 
									    var newpath = cur_context_path_id+"_"+items[i];
									    var trackpath = cur_context_path+"+"+items[i];
									    console.log("New parent path "+ newpath);
									    //lis.push('<li class="expando" title="' + items[i] + '" id="'+ newpath +'" data-div-id="'+ trackpath +'"><a class="sf-with-ul cmenu2" data-div-id="' + items[i] + '" href="#">'+items[i]+'</a><span class="sf-sub-indicator"> &#187;</span></li>');
									    lis.push('<li class="normal" title="' + items[i] + '" id="'+ newpath +'" data-div-id="'+ trackpath +'"><a class="sf-with-ul cmenu2" data-div-id="' + items[i] + '" href="#">'+items[i]+'</a></li>');
								       }
							       else{
							       	    var newpath = cur_context_path_id+"_"+items[i];
							       	    var trackpath = cur_context_path+"+"+items[i];
							       	    console.log("New Item"+items[i])
							       	    console.log("New parent path "+ newpath);
								 		lis.push('<li class="normal" title="' + items[i] + '"id="'+ newpath +'" data-div-id="'+ trackpath +'"><a class="cmenu2" data-div-id="' + items[i] + '" href="#">'+items[i]+'</a></li>');
							       }
						          $('<ul/>', {	    
						            html: lis.join('')
						          }).appendTo('#'+cur_context_path_id);
	              			}
			    		}
	
			    //console.log('append to: '+cur_context) ;
			    //console.log(lis);
			   });
			  }
	       });
	       $('.expando, .normal').live('click', function(){
			    var cur_context_path = $(this).attr('id');
		        console.log('Change context to:'+current);
			    var comment = "Model Browser (left menu): Redirect to "+current +" when "+cur_context_path+" has been clicked";
			    window.log_events[window.log_index++] = comment; 
			    var redirect_page = "/show_sub_context?context="+current;  
			    send_comments(redirect_page);
                    
	       });
	       //$('#user_feedback_box').show();
	       $('#user_feedback_box').offset({'top':'10px','left':'80%','right':'10%'});
	       $('#user_feedback_box').show();
		   $('#user_feedback_box').draggable(); 
		  // $('#box').height('600px');
		  // $('#box').width('750px');
		    
		   $('#about_dashboard').click(function(){
		   	    var val = $(this).attr('data-div-id');
		   		var text = "The Dashboard helps you set goals, see progress towards them and control the collection of data about them. "+val+"<br/>"
				text += "Plugins: These are at the left. For example, FitBit is a device that tracks your activity. Install its plugin in Mneme to get a copy of the FitBit data. Then you will be able to see it against the goals you have created in Mneme. <br/>";
				text += "Wellness Goals: The main screen in the middle shows the goals you can set Mneme to remember. <br/>"; 
				text += 'Click "Set the goal" and set the details you want to set for your current goals. <br/> ';
				text += 'Click "Goal history" to see the actual data about this goal so you can.';
				
				
		   		return hs.htmlExpand(this, {
			        pageOrigin: {
					  x: 200, 
					  y: 200
					},
					headingText: "About Mneme Dashboard",
				    maincontentText: text,
					width: 400,
					height:400
			  }).addClass("show_list")
			    .addClass("darkbackcolor");
		   });
              
	          $("[title]").tooltip({
                     
                      position: {
						my: "center bottom-20",
						at: "center top",
						using: function(position, feedback) {
						    $(this).css(position);
						    $("<div>")
							.addClass("arrow")
							.addClass(feedback.vertical)
							.addClass(feedback.horizontal)
							.appendTo(this);
						}
				      },
				      /*content: function() {
					    var text = $(this).attr('title');	
                        if(text != ""){
					       text += '<br><input type="button" value="Thanks. got it." class="close_tooltip button" style="font-size:0.8em"/>';
                           text += '<input type="button" value="Not quite helpful." class="close_tooltip button" style="font-size:0.8em"/><br>';
					       return text;
					     }	
				      },
				      show: {
						effect: "slideDown",
						delay: 250
				      },
				      hide: {
						effect: "slideUp",
						delay: 250
				      },			    
				      open: function(event, ui){
	                      var tooltip_id = $(this).attr('id');
					      $('.ui-tooltip-content input').click(function(){
	                      		var val = $(this).val();
					  			var id = tooltip_id;
                            	console.log(id+","+val);
	  			    			var comment = " Dashboard: "+ id +"Tootltip "+ val +" button clicked ";
			    				window.log_events[window.log_index++] = comment; 	
    	                        $("[title]").tooltip("close");
                       });
                   }*/
				})/*.bind( "mouseleave", function(event,ui) {
				   event.stopImmediatePropagation();
				   var fixed = setTimeout('$("[title]").tooltip("close")', 10000);
				
				   $(".ui-tooltip").hover(
				   	  function(){
					 		clearTimeout (fixed);
			          },
				      function(){
				      	 $("[title]").tooltip("close");
				  });
				  
                                      
			     })*/;



}
function updateSideBar(element,type){
	  var where = $('#menu_left').attr('data-div-id');
	  if(where == 'Home'){
		if(type=='context'){
			  var new_str = '<li class="normal" id="'+element+'" data-div-id="'+10+'"">';     
			  new_str += '<a href="Javascript:void(0);" name="context" class="sf-with-ul" data-div-id="'+element+'" title="Click the name to see list of associated components and sub-contexts and select the checkbox to apply forgetting on it.">'+element;
		      new_str += '</a></li>';
		      $('ul#menuleft').append(new_str);
		     } 
	    }
	  else{
	  	if(type == 'context'){
	  		if($('div#form_context')){	  		   
		  		var new_str = '<li><input type="checkbox"/><a href="#" class="internal cmenu2" name="context" data-div-id="'+where+'" id="'+element+'" title="Click the name to see list of associated components and sub-contexts and select the checkbox to apply forgetting on it.">'+element;
	            new_str += '  <span title="This is a directory." class="ui-state-default ui-corner-all ui-icon ui-icon-folder-collapsed"></span>';
				new_str += '  <span title="Information about"'+element+'" class="ui-state-default ui-corner-all ui-icon ui-icon-help">?</span><div id="clear_space"></div></li>';
				$('ul#context_ul div#form_context').append(new_str);
			}
			else{
				$('#no_context').hide();
                var new_str = '<div id="form_context" class="show_list" style="margin:1%;padding:5%;width:83%">'; 
                new_str += '<li><input type="checkbox"/><a href="#" class="internal cmenu2" name="context" data-div-id="'+where+'" id="'+element+'" title="Click the name to see list of associated components and sub-contexts and select the checkbox to apply forgetting on it.">'+element;
	            new_str += '  <span title="This is a directory." class="ui-state-default ui-corner-all ui-icon ui-icon-folder-collapsed"></span>';
				new_str += '  <span title="Information about"'+element+'" class="ui-state-default ui-corner-all ui-icon ui-icon-help">?</span><div id="clear_space"></div></li>';
				$('ul#context_ul div#form_context').append(new_str);				
			}
	  	}
	  }
	        $('.easy_button, .not_easy_button').live('click',function(e){
            	
            	  var val_id = $(this).attr('id');
            	  var val = $(this).val();
            	  var comment = "Dashboard: during "+appname+" installation "+val_id+" button has been clicked with user saying '"+val+"'";
            	  console.log(comment);
                  window.log_events[index++] = comment;
            });   
}

function handleCreateButton(){
	           var add_val;
               $('#new_element a').click(function(){
               $('.error').hide();
               add_val = $(this).attr('id');
                              
               $('#name').val('');
               $('#description').val(''); 
               var comment = "Model Browser: Add "+add_val+" has been clicked";
               window.log_events[window.log_index++] = comment; 
               if(add_val == 'context'){
	                    $('#new_box').height('480px');
                        $('#name_div').show();
               }
               else{
 	                    $('#new_box').height('400px');
                        $('#name_div').hide();
               }
               $('#overlay').fadeIn('fast',function(){
                   console.log(add_val);
		           $('#new_box h1').text('Create new '+add_val);
		                  
				   $('#new_box').width('500px');
				   $('#new_box').animate({'top':'100px'},500);
				   $('#new_box').draggable(); 
               });
           }); 
           $('#new_boxclose').click(function(){
               var comment = "Model Browser: Add new element window closed";
               window.log_events[window.log_index++] = comment; 
               $('#new_box').animate({'top':'-800px'},500,function(){
                        $('#overlay').fadeOut('fast');
                        $('#new_element').slideUp('slow');
	            });

          });
               $('#reason4').click(function(){
               console.log('I am here');
               var cur_height = $('#new_box').height(); 
               if($('#reason4').is(':checked')){   
                       $('#new_box').height(cur_height+50); 
 	                   $('#other_div').show('slow');                                  
           	   }
			   else{
			 		   $('#other_div').hide('slow');
			           $('#new_box').height(cur_height-50); 
		       }

               });
                   /* $('#new_element').click(function(){
		                       $('#overlay').fadeIn('fast',function(){
		                                console.log(add_val);
				                $('#new_box h1').text('Create new element');
				                //$('#new_box').css({left:'200px',top:'50px'}); 
		                                //$('#name_label').text('Name of the '+add_val+'*'); 		                        
						$('#new_box').width('500px');
						$('#new_box').animate({'top':'100px'},500);
				           	$('#new_box').draggable(); 
		                        });
		           
		      });*/
		     $('#create_button').click(function(){
		     	var data,element;
		     	console.log(add_val);
		     	$('.error').hide();
		     	data = add_val+'_';
		     	var alphaOnly = /[A-Za-z]/g;
		     	var splChars = "!@#$%^&*()+=-[]\\\';,./{}|\":<>?";
		     	var error = 0;
		     	if(add_val == 'component')
		     	   element= 'none';
		     	else{   
                    element = $('#name_table input').val();
                    if(element != ""){
	                    console.log("Context name:"+element);
						for (var i = 0; i < element.length; i++) {
						    if (splChars.indexOf(element.charAt(i)) != -1){
						       //alert ("Special Characters not allowed");
						       $('#name_error').text("Special characters are not allowed. Only use letters and numbers.");
						       $('#name_error').show(); 
						       $('#name_table input').focus();
						       error += 1;
						    } 
						}
                   }
                   else{
                   	  error += 1;
                   	  $('#name_error').text("Please enter a name for the context");
                   	  $('#name_error').show();
                   }		     	   
		     	
		     	}   
		     	var element2 = $('#subname_table input').val()
		     	if(element2 != ""){
					for (var i = 0; i < element2.length; i++) {
						    if (splChars.indexOf(element2.charAt(i)) != -1){
						       //alert ("Special Characters not allowed");
						       $('#subname_error').text("Special characters are not allowed. Only use letters and numbers.");
						       $('#subname_error').show();  
						       $('#subname_table input').focus();
						       error += 1;
						    } 
						}
               }
               else{
                   	  error += 1;
                   	  $('#subname_error').text("Please enter a name for the component");
                   	  $('#subname_error').show();
               	
               }
		     	if(error == 0){
		     		data += element + '_';   		     	
		     	    data += element2 + '_';
			     	$("#reason_table input").each( function() {                             
	                       if($(this).is(':checked')){
	                       	    data += $(this).val()+'+';
	                       }
					        
				   })
			      //data += '_Home'
  			      console.log(data);
		          $.ajax({  
						    type: "POST",  
						    url: "/add_new_element?data="+data,  
						    data: "",  
						    processdata:true,
						    success: function(data){
		                            console.log(data);
                                    if(data.indexOf('Error')!=-1) 
                                       alert(data); 
                                    else
                                       alert("Successfuly created new element");   
								    var comment = "Model Browser: Add new element has been confirmed";
					                window.log_events[window.log_index++] = comment; 
			
			                         $('#new_box').animate({'top':'-800px'},500,function(){
			                               $('#overlay').fadeOut('fast');
			                               $('#new_element').slideUp('slow');
			                           });   
			                         var where = $('#menu_left').attr('data-div-id');
			                         console.log('I am in'+where);
			                         if(where == 'Home'){
			                         	 document.location.href="/browse";
			                         }  
			                         else{
			                         	context = data;
			                         	document.location.href="/show_sub_context?context="+context;
			                         }
			                         //if(element!='none'){
			                         //   updateSideBar(element,add_val);
			                         //}                                                  
		                          },                        
				       });  
		               return false;
               }		     	    
		     });
 
}
// Send the logs and write it in a file
function send_comments(redirect_page){
		      var all_comments = ""
		      var page = "Dashboard";
		      if(redirect_page.indexOf("browse") == -1){
		      	  page = "Model Browser";
		      }
              if(window.log_events.length == 0){
		      	var comment = "No event has been clicked so far. Moving on to "+page;
				window.log_events[window.log_index++] = comment; 
              }
		      for(var i = 0; i < window.log_events.length; i++){
		           all_comments += window.log_events[i]+","
		   	   }
			  window.log_events = [];
              window.log_index = 0;
			  $.ajax({  
			    type: "POST",  
			    url: "/comment_log?comment="+all_comments,  
			    success: function(data){
			             document.location.href=redirect_page;
                    }                        
		       });  
		       return false;
}  

function register_app(appname, description) {
	      //http.abort();
          var index;
	                
          var data=appname;//+"_"+description;//+password;//+"_"+permission;
          
          var store_list = ['','active','archive','longterm','trash']
          data += "_This week's daily summary data is stored in the "+store_list[parseInt($("select#sum_data option:selected").val())];
          data += " and kept there for "+$("select#sum_time option:selected").val();
          data += "_Daily summary data for all week except the running one is stored in the "+store_list[parseInt($("select#old_sum_data option:selected").val())];
          data += " and kept there for "+$("select#old_sum_time option:selected").val();
          data += "_Fine grained 1 minute data is stored in the "+store_list[parseInt($("select#detailed_data option:selected").val())];
          data += " and kept there for "+$("select#detailed_time option:selected").val();
          
          console.log(data);
          var found = 0; 
          
		  $.ajax({  
			    type: "POST",  
			    url: "/register_app?data="+data,  
			    success: function(data){
				if ((data.indexOf("Error") == -1) && (data.indexOf("Work") == -1)){
					   console.log(data); 
        	               // document.location.href = data;
        	               send_comments(data); 
                           //mywindow = window.open(data, "mywindow", "location=1,status=1,scrollbars=1,  width=1100,height=800");
    					   //mywindow.moveTo(0, 0);
                                
                        }
                        else{ 
							   $("#dialog").dialog("destroy");                
							   $('#overlay3').fadeOut('fast');
				           	   $("#dialog-message").text(data);					    
							   $("#dialog-message").dialog({
							   		modal: true,
									buttons: {
										Ok: function() {
								                 $(this).dialog('close');
                        			             $('#overlay3').fadeOut('fast');
				                          }				                                             
									}
                                                                                        
					          });
                      }                                                          
				
				},
                            //dataType="text";
		       });
		       return false;
	    }
function manage_app(appname){
	      
	      var data=appname;//+"_"+description;//+password;//+"_"+permission;
	      
	      var store_list = ['','active','archive','longterm','trash']
          data += "_This week's daily summary data is stored in the "+store_list[parseInt($("select#sum_data option:selected").val())];
          data += " and kept there for "+$("select#sum_time option:selected").val();
          data += "_Daily summary data for all week except the running one is stored in the "+store_list[parseInt($("select#old_sum_data option:selected").val())];
          data += " and kept there for "+$("select#old_sum_time option:selected").val();
          data += "_Fine grained 1 minute data is stored in the "+store_list[parseInt($("select#detailed_data option:selected").val())];
          data += " and kept there for "+$("select#detailed_time option:selected").val();
          var found = 0; 
          
		  $.ajax({  
			    type: "POST",  
			    url: "/manage_app_data?data="+data,  
			    success: function(data){
				if ((data.indexOf("Error") == -1) && (data.indexOf("Work") == -1)){
					   console.log(data); 
			       }
			    }	
			  });	   
}
function removeRegisteredApp(appname){

		   var container = $('#app_list');    
           	   console.log("ok; deleteing... "+appname);
		   var inputs = container.find('input');
                   for(var i = 0; i < inputs.length; i++){
                       var value = $('#'+inputs[i].id).val(); 
                       if(value == appname){
                            $('#'+inputs[i].id).remove();
                            $('#'+value).remove();
                       } 
                   }

           }

function updateBrowserActivity(activity){
                  var container = $('#morelinks');
                  var myDate = new Date();
	              var displayDate = (myDate.getDate()) + '/' + (myDate.getMonth()+1) + '/' + myDate.getFullYear();
                  var ul = container.find('ul');
                  var html = '<li>'+ activity + displayDate +' </li>';
	              ul.append($(html));  

           }

function handleMidPanelBrowser(){
	$('#form_context a').live('click', function(e){
            var context = $(this).attr('id');
            var title = $(this).attr('data-div-id');            
            var new_context = title+"/"+context;
            var comment = "Model Browser: Context "+context+" has been clicked";
            window.log_events[index++] = comment; 
            //send_comments(window.log_events);
			console.log('New context:'+new_context);
			document.location.href = "/show_sub_context?context="+new_context;  
        });

}
function handle_app_install(){
	           window.log_events = [], index = 0;  
               //<![CDATA[
               $('.error').hide();    
  	           $(document).ajaxSend(function(event, request, settings) {
				   	//$('#loading-indicator').show();
					$('.myloading').show();
		  		 });
		 
               $(document).ajaxComplete(function(event, request, settings) {
		   			//$('#loading-indicator').hide();
		       		$('.myloading').hide();
	      	 });
               $('#app_list a, #sapp1 img, #fitbit_app img, #fitbit_app input.button').click(function() {
                  appname = $(this).attr('id');
                      
		  		  description = $(this).attr('data-div-id');
                  var comment = "Dashboard: "+appname+" icon/button has been clicked";
                  console.log(comment);  
                  console.log(appname+","+description);
                  window.log_events[index++] = comment; 
                  //$('#pass_span').attr('title',"This password will be used for setting permission for "+appname+" to access your model. This don't have to be the same as your Google+ password or "+appname+" password.");  
                  $('#box h3').text("Manage your "+appname+" data."); 
                  //$('#appname').val(appname); 
	              //$('#description').val(description);
                  //$('#password').val('');
                  /*$('#appname').text("Application Name: "+appname); 
	          	  $('#description').text("Description: "+description);
                  $('#password').val('');*/
                  //$('#data_manager_border').height('75px');
	          	  //$('#advanced_options').hide('slow');
		  		  /*$('#app_data_manage_div input').each( function() {  
			           $(this).attr("checked", false);
                  });*/
                  $('#overlay2').fadeIn('fast',function(){
			          $('#box').animate({'top':'50px','left':'20%','right':'40%'},500);
		              	  $('#box').draggable(); 
		                  $('#box').height('600px');
				  		  $('#box').width('750px');
		        });
		
            }); //end of app_list a.click
 
              /*$('#data_manager_table').click(function(){
                     console.log("Testing")                             
	            
                     $('#data_manager_table input').each( function() {  
                     if($(this).is(':checked')){
	                    var value = $(this).val();
                            if(value == "advanced"){
                               	var comment = " Dashboard: advanced manager has been checked during app installation";
	                       	   	window.log_events[index++] = comment; 

                           		$('#data_manager_border').height('300px');
			       				$('#advanced_options').show('slow');
                               	$('#box').height('565px');
			    			}
                            else{
			       				var comment = " Dashboard: default manager has been checked during app installation";
	                       		window.log_events[index++] = comment; 

			       				$('#data_manager_border').height('75px');
			       				$('#advanced_options').hide('slow');
			       				$('#box').height('380px');			    			    
			    			}
                       }
		  		});
	       });*/
              $('#appboxclose').click(function(){
                     var comment = "Dashboard: app installation window has been closed.";
                     window.log_events[index++] = comment; 

                     $('#box').animate({'top':'-850px'},500,function(){
                       $('#overlay2').fadeOut('fast');
                       /*$('#appname').text(appname); 
 	 	       		   $('#description').text(description);
                       $('#password').val('');  */                                                    

                    });
                });
                $('#fitbitokbutton').click(function(){
                           var comment = "Dashboard: fitbit confirmation ok button has been  clicked";
                           window.log_events[index++] = comment; 

                   	        $('#confirm_fitbit_install').animate({'top':'-800px'},500);
                   	   		//$('#overlay2').fadeOut('fast');                   	   
                   	   		register_app(appname, description);
                });
                   
                $('#fitbitcancelbutton').click(function(){
			    var comment = "Dashboard: fitbit confirmation cancel button has been clicked";
                       window.log_events[index++] = comment; 
                   	   $('#confirm_fitbit_install').animate({'top':'-800px'},500);
                   	   $('#overlay2').fadeOut('fast');
                   	   //not register_app();
                   });                                      
                
                $('#register_now').click(function(){ 
                      var comment = "Dashboard: Fitbit installation has been confirmed. Continue Installation";
                      window.log_events[index++] = comment; 
                 
		           /*$('.error').hide();
					  var name1 = $("#appname").val();
		  			  if (name1 == "") {
						$("#app_error").show();
						$("#appname").focus();
						return false;
 	                 }

					var pass = $("#password").val();
				  	if (pass == "") {
						$("#pass_error").show();
						$("#password").focus();
						return false;
 	               }*/
 	                var button_val = $(this).val(); 
                    $('#box').animate({'top':'-850px'},500,function(){
                             //$('#overlay3').fadeIn('fast');
                             /*$('#confirm_fitbit_install').width(400);
						     $('#confirm_fitbit_install').height(150);							      
						     $('#confirm_fitbit_install').animate({'top':'30%','left':'30%','right':'50%'},500);
						     $('#confirm_fitbit_install').draggable();
						     var helpText = "Fitbit plugin installation will take 2-3 minutes, as we will extract your last two days data from Fitbit server."
						     helpText +=  " \nThank you for kind understanding."						              
						     $('#confirm_fitbit_install div').text(helpText);*/
						     $('#overlay2').fadeOut('fast');
						     if(button_val == "Continue installation")
						        register_app(appname, description);
						     else
						     	//manage_app("Fitbit");
						     	alert("Work in progress");
						    
                        });                   
                    

                   }); //end of #register_now.click

}
function handleRightSidebar(){
	$('#user_feedback input#log_comment').click(function(){
		  var comment = $('#comment').val();
		  log_events[log_index++] = comment;		
		  //log_comment("user feedback: "+comment);
		  //alert("Thank you for your comment");
		  $('#comment').val('');		
	});
}
function handleForgetting(){
            $("#Archive").live('click',function(e){
				// Find out whether any checkbox is checked
				var check = 0;    
				console.log("Starting archive");
				$('#form_context input').each(function(){						    				    
				    if($(this).attr('checked')){
					   check += 1;
				   }
				});
					
			    $('#form_component input').each(function(){
				    if($(this).attr('checked')){
				           check += 1;
					    }
				});
				
				if(check == 0){
						 	alert("Please select an element first");
						 }
				else{
				    	
					$('#overlay').fadeIn('fast',function(){ 
						   console.log("Checked element = "+check);                    				      
		                   $('#archive_box').width(750);
					       $('#archive_box').height(300);							      					       
					       $('#archive_box').draggable();
					       $('#archive_box').animate({'top':'160px'},500);
		              });                   
				 }
             	  		 
		     return false;
	      });
          $("#Delete").live('click',function(e){
             	 var names = "", data; 
             	 var check = 0;    
				 console.log("Starting delete");
				 $('#form_context input').each(function(){						    				    
				    if($(this).attr('checked')){
					   check += 1;
				   }
				 });
					
			    $('#form_component input').each(function(){
				    if($(this).attr('checked')){
				           check += 1;
					    }
				});
				
				if(check == 0){
						 	alert("Please select an element first");
						 }            	               	 
             	 else{
   		            $('#overlay').fadeIn('fast',function(){ 
						   console.log("Checked element = "+check);                    				      
		                   $('#delete_box').width(750);
					       $('#delete_box').height(250);							      					       
					       $('#delete_box').draggable();
					       $('#delete_box').animate({'top':'160px'},500);
		              });     
	   		        /*$( "#dialog:ui-dialog" ).dialog( "destroy" );	
					$( "#dialog-confirm" ).dialog({
						resizable: false,
						height:140,
						modal: true,
						buttons: {
							"Delete": function() {
								$( this ).dialog( "close" );
								$.ajax({  
							    type: "POST",  
							    url: "/delete?data="+data,  
							    data: "",  
							    processdata:true,
							    success: function(data){
							    	alert("Data successfully deleted");
							    	var addr = data.split(':');						    	
							    	if(addr[0]=="Success")
							    	   document.location.href = "/show_sub_context?context="+addr[1];
							    	
							    }
							 });
							},
							Cancel: function() {
								$( this ).dialog( "close" );
							}
						}
			         });*/
				  }	   		      
	   		        return false;
   		     }); 	
	$('#archive_type').bind('change',function(event){
		
		var type = $("select#archive_type option:selected").val();
		var show_text = "";
		
		if(type == 'active')
		   show_text = "If you choose <strong>Long term</strong> as your persistent storage, your data will still be accessible to external applications and used for long term reflections."
		else 
		   show_text = "If you choose <strong>Archive</strong> as your persistent storage, your data will not appear in the charts and analysis. You can only view the data in the Model Browser";
		console.log(type+";"+show_text);
		$('#archive_type_comment').html(show_text);   
	});
	$('#archive_boxclose, #apply_archive').click(function(){
		$('#archive_box').animate({'top':'-800px'},500,function(){
			  $('#overlay').fadeOut('fast');
	     }); 
	});
	$('#delete_boxclose').click(function(){
		$('#delete_box').animate({'top':'-800px'},500,function(){
			  $('#overlay').fadeOut('fast');
	     }); 
	});
	$('#delete_table').click(function(){
	   $('#delete_table input').each( function() {  
          if($(this).is(':checked')){
	         var value = $(this).val();
             if(value == "notrash"){
             	 $('#trash_time').hide('slow');             	 
             }
             else{
                            	
                $('#trash_time').show('slow');           	
             }	
          }
       });
	});
	$('#apply_delete').click(function(){
      	 	var data = "Contexts:"
            $('#form_context input:checked').each(function(){
   		             data  += $(this).val()+",";
            });
            data += "_Components:"
            $('#form_component input:checked').each(function(){
   		              data  += $(this).val()+",";
            });
                 
            console.log("Data: "+data);
			$.ajax({  
			    type: "POST",  
			    url: "/delete?data="+data,  
			    success: function(data){
				    	alert("Data successfully deleted");
				    	var addr = data.split(':');						    	
				    	if(addr[0]=="Success")
			    	       document.location.href = "/show_sub_context?context="+addr[1];							    	
					    }
				    });

	});
}
