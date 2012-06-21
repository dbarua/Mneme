/*This is the js file with utilities*/
var log_events = [], log_index = 0;
/* Called in layout_home.html and layout_goals.html*/
function handleSideBar(page){
                var current= "" 
		$('.expando, .normal').live('hover', function(e){
		    var cur_context = $(this).attr('id');
		    var sublist = [];
		    var comment = "notice_Model Explorer: Expand "+cur_context+"on hover event";
		    log_events[log_index++] = comment; 

		    $('#'+cur_context).children('ul').remove();
		    var contextList = $(this).parents('li')
		     .map(function () { 
		            //console.log(this.id) 
		            return this.id; 
		        }).get();

		    var context = ""; 
		    if(contextList.length){ 
		        for(var i=contextList.length-1; i>=0; i--){
		           context += contextList[i] + '/'; 
		       }
		    }
		    context += cur_context;
		    context = context.replace(/\s/g, '');
		    console.log(context);
                    current = context;
		    $.getJSON('/get_sub_context?context='+context, function(data) {
		       var items = [], lis = [];
		       items = eval(data);
		       //console.log(data);               
                       if(items){
			       for(var i=0; i< items.length; i++){
				 if(items[i].indexOf('_expand') != -1){
				   items[i] = items[i].split('_')[0];
				   //console.log(items[i]) 
				   lis.push('<li class="expando" id="' + items[i] + '"><a class="sf-with-ul cmenu2" data-div-id="' + items[i] + '" href="#">'+items[i]+'</a><span class="sf-sub-indicator"> &#187;</span></li>');
			       }
			       else{
				 lis.push('<li class="normal" id="' + items[i] + '"><a class="cmenu2" data-div-id="' + items[i] + '" href="#">'+items[i]+'</a></li>');
			       }
			    $('<ul/>', {	    
			     html: lis.join('')
			   }).appendTo('#'+cur_context);
                       }
		    }

		    //console.log('append to: '+cur_context) ;
		    //console.log(lis);
		 });

	       });
	       $('.expando, .normal').click(function(){
		    var cur_context = $(this).attr('id');
                    console.log(current);
		    var comment = "notice_Model Explorer: Expand "+cur_context+"on click event";
		    log_events[log_index++] = comment; 
		    //send_comments(log_events);
                    log_events = [];
                    if(page == 'Home')
                         document.location.href = "/show_sub_context?context="+current;  
                    
	       });



}

function handleCreateButton(){
               $('#new_element a').click(function(){

                               add_val = $(this).attr('id');
                               console.log(add_val);
			       $('#name').val('');
                               $('#description').val(''); 
                               var comment = "notice_Browse subdir Page: Add "+add_val+"clicked";
		               log_events[log_index++] = comment; 
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
		                        //$('#new_box').css({left:'200px',top:'50px'}); 
                                        //$('#name_label').text('Name of the '+add_val+'*'); 		                        
					$('#new_box').width('500px');
					$('#new_box').animate({'top':'100px'},500);
		                   	$('#new_box').draggable(); 
                                });

                       }); 
               $('#new_boxclose').click(function(){
                               var comment = "notice_Browse subdir Page: Add new element boxclose icon clicked";
		               log_events[log_index++] = comment; 

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

}
function log_comment(comment){
				$.ajax({  
						    type: "POST",  
						    url: "/comment_log?comment="+comment,  
						    data: "",  
						    processdata:true,
						    success: function(data){
		                                               console.log(data);
                                                               $('#comment').val(''); 
		                                 	},                        
				       });  
		                return false;

                       }  

function send_comments(comment){
		      for(var i = 0; i < comment.length; i++)
		          log_comment(comment[i]);
		   }



function register_app() {
	      //http.abort();
              var index;
	      var appname = $('#appname').val();
	      var description=$('#description').val();
	      //var notes = $('#notes').val();
              var password = $('#password').val();
                    
              var permission = "None";
              //var permission = $("input[@name=access_group]:checked").val();
              console.log(permission);
              if ($('#tell').is(':checked')){
		  permission = $('#tell').val();
               }
              if ($('#ask').is(':checked')){
                  permission += "+"+$('#ask').val();
               }
              else{
                  permission +="+None";
	      }

              var data=appname+"_"+description+"_"+password;//+"_"+permission;
              if($('#goal_checkbox').is(':checked')){                                                   
                   data += "_goals"                     
              }
              else{ 
                   data += "_nogoals"
              }
              console.log(data);
              //var array_act = ['Activity', 'Sleep', 'Device', 'People', 'Food'];
              var found = 0; 
		$.ajax({  
			    type: "POST",  
			    url: "/register_app?data="+data,  
			    data: "",  
                            processdata:true,
			    success: function(data){
						if ((data.indexOf("Error") == -1) && (data.indexOf("Work") == -1)){ 
                                                        removeRegisteredApp(appname);	
                                                        updateBrowserActivity(appname+' plugin is installed on ');
                                                        send_comments(log_events);
                                                        document.location.href = data; 
                                                }
                                                else{ 
							   $("#dialog").dialog("destroy");                
							   $('#overlay3').fadeOut('fast');
				                           $("#dialog-message").text(data);					    
							   $("#dialog-message").dialog({
									modal: true,
									buttons: {
										Ok: function() {
										       //newUnregApplist();
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


