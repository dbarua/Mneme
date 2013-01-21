#!/usr/bin/env python
#
#
# this program is using some code from Cherrypy and Personis tutorial

import os, sys

#Personis
#import Personis
#import Personis_base, Personis_a
#from Personis_util import printcomplist
from personis import client
#Time, date, timezone
from datetime import date, time, timedelta
import time
#from pytz import timezone, tzfile
#import pytz

import gviz_api
import random, itertools, json

from Activity_Models import *

#Apps model
from AppList import *
from string import Template
from genshi.template import TemplateLoader

loader = TemplateLoader(
	os.path.join(os.path.dirname(__file__), 'um_templates'),
	auto_reload=True
)

import htmllib
import formatter
import string

class Parser(htmllib.HTMLParser):
	# return a dictionary mapping anchor texts to lists
	# of associated hyperlinks

	def __init__(self, verbose=0):
		self.anchors = {}
		f = formatter.NullFormatter()
		htmllib.HTMLParser.__init__(self, f, verbose)

	def anchor_bgn(self, href, name, type):
		self.save_bgn()
		self.anchor = href

	def anchor_end(self):
		text = string.strip(self.save_end())
		if self.anchor and text:
			self.anchors[text] = self.anchors.get(text, []) + [self.anchor]

class Personis_Visualisation_Manager(object):
	def __init__(self,access_type=None, um_object=None):
		self.access_type = access_type
		self.personis_um = um_object

	def read_template_file(self,filename):
		f = open(filename, "r")
		line = ""
		try:
			byte = f.read(1)
			while byte != "":
				line = line + str(byte)
				byte = f.read(1)
		finally:
			f.close()
		return line

	def show_size(self,modeltree):
		keys = ('context','size')
		data = []
		try:
			for model in modeltree:
				taglist = list()
				if model.level == 0:
					nc = list()							  #initialised for new context each time
					taglist.append(model.name)
					nc.append(model.name)
					contextinfo = self.personis_um.get_context(nc)
					size = float(contextinfo['size'])/float(1024)   # convert to KB
					taglist.append(size)
					#taglist.append(random.randrange(10,20))
					data_dictionary = dict(itertools.izip(keys, taglist))
					data.append(data_dictionary)

			return data
		except Exception, e:
			return str(e)
	def get_days_in_between(self,value):
		value = value.split(' ');
		 
		if string.find(value[1],'week') != -1:
			return 7 * string.atoi(value[0])
		elif string.find(value[1],'month') != -1:
			return 30 * string.atoi(value[0])
		else:
			return 7
		
	def show_current_goal(self,fbt,form):
		import datetime
		today = datetime.datetime.now()
		current_date = date(today.year, today.month, today.day)
		#keys = ('year','month','day','steps','intense','moderate','light','sedentary')
		if form == "steps":
			keys = ('year','month','day','steps')
		elif form == "calories":
			keys = ('year','month','day','calories')
		else:
			keys = ('activity_level','active_mins')
		
		context = ['Goals','Health','CurrentLevelGoal']
		
		feedback_freq = self.personis_um.get_evidence_new(context=context, componentid="feedback_freq")
		print "feedback %s" % feedback_freq[-1].value #-- Take latest goal feedback type
		
		app_plugin = self.personis_um.get_evidence_new(context=context, componentid="app_plugin")

		start_time = time.localtime(int(feedback_freq[-1].creation_time))
		set_date = date(start_time[0], start_time[1], start_time[2])

		goal_duration = self.personis_um.get_evidence_new(context=context, componentid="goal_duration")
		#-- Take latest goal span
		betweendays = self.get_days_in_between(goal_duration[-1].value)
		end_date = set_date + timedelta(days = betweendays)
		
		interval = 0
		prev_date = ""
		# You have reached  the end 
		if current_date >= end_date: 
		   return json.dumps([{"goalEnd" : "Goal duration ends"}])		   
		   
	    #-------------------------Temporary fake setup------------------------
		email_id = self.personis_um.get_evidence_new(context = ['Personal'], componentid="email")
		emails = str(email_id[-1].value)
		print "Is fake alex?",emails.find("personis")
		
			
		#---This is just to check on what date you are start viewing the goal chart 
		start_graph_date = self.personis_um.get_evidence_new(context = context, componentid='graph_startdate')
		print "Date ",start_graph_date[-1].value, "with flag ",start_graph_date[-1].flags[0]
		startgraph_date = time.strptime(start_graph_date[-1].value, "%d/%m/%Y")   
		startgraph_date = date(startgraph_date[0], startgraph_date[1], startgraph_date[2])
		goal_list = []
		if start_graph_date[-1].flags[0] == "Revised":
			if current_date != startgraph_date:			
				startgraph_date_old = time.strptime(start_graph_date[-2].value, "%d/%m/%Y")   
				startgraph_date_old = date(startgraph_date[0], startgraph_date[1], startgraph_date[2])
				days_old = (startgraph_date - startgraph_date_old).days
				endgraph_date_old = startgraph_date_old + timedelta(days = 7)
				print "End this chart on ",endgraph_date
							
				if startgraph_date <= endgraph_date_old:
					#for i in range(0,days_old-1):
					#   goal_list[i] = "old"   
					#for j in range(days_old,6):
					#   goal_list[j] = "new"
					prev_date = startgraph_date_old
				else:					
					prev_date = startgraph_date_old
			else:			
				self.personis_um.add_evidence(context=context, component='graph_startdate', value=start_graph_date[-1].value, flags=['Updated'])
				prev_date = startgraph_date
				#for j in range(0,6):
				#	goal_list[j] = "new"
					
		else:
			if emails.find("personis") == -1:
				endgraph_date = startgraph_date + timedelta(days = 6)
				print "End this chart on ",endgraph_date
				
				if current_date >= endgraph_date:  
					start_goal_weekday = self.personis_um.get_evidence_new(context = context, componentid='goal_startday')
					print "start on day ",start_goal_weekday[-1].value
					dayofweek = start_goal_weekday[-1].value
					pass_date = current_date
					day_of_week = ["monday","tuesday","wednesday","thursday","friday","saturday","sunday"]				
					print "Weekday:", current_date.weekday()
					while dayofweek != day_of_week[pass_date.weekday()]:
						  pass_date = pass_date + timedelta(days = 1)  
					start_graph = pass_date.strftime("%d/%m/%Y")
					startgraph_date = pass_date
					print "Showing graph window from ",start_graph
					self.personis_um.add_evidence(context=context, component='graph_startdate', value=start_graph, flags=['Updated'])
					   
					prev_date = startgraph_date
					#for j in range(0,6):
					#	goal_list[j] = "new"
				else:
				    prev_date = startgraph_date
			else:
				prev_date = startgraph_date	
				
		past_next  = "next"   
		print "goal set on %s %d days ago" % (prev_date, interval)
		print "pursue goal for %s for %d days" % (end_date,betweendays) 
		interval = 7
		if form != 'active_mins':
		   json_data = fbt.resolver_fitbit(self.personis_um, form, prev_date, interval, past_next, keys)
		else:
		   json_data = fbt.resolver_fitbit_active_mins(self.personis_um, prev_date, set_date, interval, past_next, keys=keys)
		print json_data
		return json_data
		"""			 
		date_list = []
		#date_list.append(current_date)
		check_list = []
		# creating a list of all the dates within the interval
		for i in range(0,interval):
			newdate = end_date - timedelta(days=i)
			date_list.append(newdate)
			check_list.append(0)
		 
		if form != "active_mins": #--- If form is steps and calories,you get to see the column chart		   
		   if current_date != prev_date: #--It has been some time since you set the goal			   
			   json_data = fbt.resolver_fitbit(self.personis_um, form, prev_date, interval, past_next, keys)
		   else: #----If it is the day when you've just set your goal...
			   print "Showing data for past 7 days"
			   if form == "steps": #--- If you are after "steps" data, then you already have the fine grained evidence that you've got during fitbit installation...so go for it.
				   json_data = fbt.resolver_fitbit(self.personis_um, form, prev_date, interval, past_next, keys)
			   else:  #--- But if you are after "calorie" data, then look for the summary results, as you didn't get the calorie during installation as it slows down the system.
				   json_data = self.get_fitbit_data_column(form,current_date,date_list,interval,keys)
		   print json_data
		   return json_data
		else: #--- If form is active minutes, you get to see the pie chart				  
		   return self.get_fitbit_data_pie(form,end_date,date_list,interval,keys) 
		"""  
	def get_fitbit_data_column(self,form,current_date,date_list,interval,keys):
		daycount = 1
		#---check the evidence list and match the date
		print "Showing data for %s" % form
		datadict_list = []
		evdlist = self.personis_um.get_evidence_new(context=['Devices','Fitbit','Activity'], componentid=form)			
		if evdlist:
		   for ev in evdlist:
			   print ev.flags[0]			   
			   if ev.flags[0] == "summary":
				  try: #---Take the user given time or creation time
				   
					 if ev.time: um_time = ev.time
					 else: um_time = ev.creation_time  
					 
					 tt = time.localtime(int(um_time))
					 track_date = date(tt[0],tt[1],tt[2])
					 print "Track_date: %s"%str(track_date)
									
					 #------ if evidence date is found in the datelist then add it to the dictionary
					 print "Outside: Year:%d, Month:%d, Day:%d, Value: %d" %(tt[0],tt[1],tt[2],ev.value)
					 found = 0
					 for dt in date_list:
						print "Chech date %s" % str(dt) 
						if track_date == dt:
						   print "Track_date: %s"%str(track_date)
						   found = 1 
					 if found == 1:				   
						#print datetime.datetime.fromtimestamp(int(um_time)).strftime('%Y-%m-%d'), ev.value				   
						#new_evdlist.append(int(ev.value))
						tag_list=list()
						tag_list.append(tt[0])
						tag_list.append(tt[1])
						tag_list.append(tt[2])
						tag_list.append(ev.value)
						print "Inside: Year:%d, Month:%d, Day:%d, Value: %d" %(tt[0],tt[1],tt[2],ev.value)
						data_dictionary = dict(itertools.izip(keys, tag_list))
						datadict_list.append(data_dictionary)
															  
						#prev_date = prev_date + timedelta(days=1)
						#daycount = daycount + 1					
				  except Exception,e:
					 print e
		   print json.dumps(datadict_list)
		   return json.dumps(datadict_list)

		else:
		   return			   

	def get_fitbit_data_pie(self,form,current_date,date_list,interval,keys):		
		evdlist = self.personis_um.get_evidence_new(context=['Devices','Fitbit','Activity'], componentid=form)
		   
		#---check the evidence list and match the date
		sedentary = light = moderate = intense = 0	
		my_list = [{'type':'sedentary','value':0},{'type':'light','value':0},{'type':'moderate','value':0},{'type':'intense','value':0}]
		val_list = [0,0,0,0]
		if evdlist:
		   for ev in evdlist:							  
			   try: #---Take the user given time or creation time
				  if ev.time: um_time = ev.time
				  else: um_time = ev.creation_time  
					 
				  tt = time.localtime(int(um_time))
				  track_date = date(tt[0],tt[1],tt[2])
				  print "Track_date: %s"%str(track_date)
									
				  #------ if evidence date is found in the datelist then add it to the dictionary
				  
				  found = 0
				  for dt in date_list:
					 print "Chech date %s" % str(dt) 
					 if track_date == dt:
						 print "Track_date: %s"%str(track_date)
						 found = 1 
						 
				  if found == 1:				   
					 if ev.comment == "sedentaryMinutes": 
						 val_list[0] = val_list[0] + ev.value
						 print "Inside sedentary: Year:%d, Month:%d, Day:%d, Value: %d" %(tt[0],tt[1],tt[2],ev.value)
					 elif ev.comment == "lightlyActiveMinutes": 
						 val_list[1] = val_list[1]+ev.value
						 print "Inside light: Year:%d, Month:%d, Day:%d, Value: %d" %(tt[0],tt[1],tt[2],ev.value)					 
					 elif ev.comment == "fairlyActiveMinutes": val_list[2] = val_list[2]+ev.value
					 else: val_list[3] = val_list[3] + ev.value
										
					 
			   except Exception,e:
				   print e

		   data_dict = []   
		   activemins = ["sedentaryMinutes","lightlyActiveMinutes","fairlyActiveMinutes","veryActiveMinutes"]	 
		   for i in range(len(val_list)):
			   taglist = list()
					 
			   taglist.append(activemins[i])
			   taglist.append((val_list[i]/7))
				   
			   data_dictionary = dict(itertools.izip(keys, taglist))
			   data_dict.append(data_dictionary)   
		   
		   print json.dumps(data_dict)
		   return json.dumps(data_dict)
		else:
		   return			   

	def show_goal_with_target(self,fbt,form, goal_type, past_next, st_date):
		
		import datetime
		today = datetime.datetime.now()
		current_date = date(today.year, today.month, today.day)
		keys = ('year','month','day','steps','prev_remain','remain','prev_target','cur_target','notes')
		if form == "steps":
			keys = ('year','month','day','steps','prev_remain','remain','prev_target','cur_target','notes')
		elif form == "calories":
			keys = ('year','month','day','calories','prev_remain','remain','prev_target','cur_target','notes')
		else:
			keys = ('year','month','day','active_mins','prev_remain','remain','prev_target','cur_target','notes')
			
		#-- Look for the goal type	
		context = ['Goals','Health']
		context.append(goal_type)
		
		#-- Take current goal target
		goal_target_val = self.personis_um.get_evidence_new(context = context, componentid="target_value")
		print "target %s" % goal_target_val[-1].value 
		goal_target = (goal_target_val[-1].value).split(' ')[0]
		
		#-- Take previous goal target		
		
		goal_target_prev = "0" 
		if len(goal_target_val) > 1:			
		   for tval in goal_target_val[::-1]:
			   if tval.flags[0] == "New" or tval.flags[0] == "Used":
				  goal_target_prev = (tval.value).split(' ')[0] 
				  print "Previous target %s" % tval.value

		
		#-- Take latest goal goal target
		goal_target_freq = self.personis_um.get_evidence_new(context = context, componentid="target_frequency")
		print "do every %s" % goal_target_freq[-1].value 
		
		#-- Take latest goal feedback type
		feedback_freq = self.personis_um.get_evidence_new(context = context, componentid="feedback_freq")
		print "feedback %s" % feedback_freq[-1].value 
		
		#-- See what is the plugin for this goal...For now it is not checked....
		app_plugin = self.personis_um.get_evidence_new(context=context, componentid="app_plugin")
		
		#--When the goal started
		goal_startdate = self.personis_um.get_evidence_new(context=context, componentid="goal_startdate")		
		start_time = time.localtime(int(goal_startdate[-1].creation_time))
		st_date = date(start_time[0], start_time[1], start_time[2])

		#-- Take latest goal duration..how long you will pursue the goal
		goal_duration = self.personis_um.get_evidence_new(context=context, componentid='goal_duration')

		#--How many days in between the goal set date and goal finish deadline
		betweendays = self.get_days_in_between(goal_duration[-1].value)
		end_date = st_date + timedelta(days = betweendays)
		interval = 0 

		#---Check whether you have already reached the end date
		if current_date >= end_date:		   
		   return [{"goalEnd" : "Goal duration ends"}]  
	   
		
			 
		#---creating a list of all the dates within the interval
		for i in range(0,interval):
			newdate = end_date - timedelta(days=i)
			date_list.append(newdate)
			check_list.append(0)
  
		
		#---This is just to check on what date you are start viewing the goal chart 
		start_graph_date = self.personis_um.get_evidence_new(context = context, componentid='graph_startdate')
		print "Starting the graph window ", start_graph_date[-1].value
		startgraph_date = time.strptime(start_graph_date[-1].value, "%d/%m/%Y")   
		startgraph_date = date(startgraph_date[0], startgraph_date[1], startgraph_date[2])
		goal_list = list()
		goal_list_prev = list()
		
		final_date = ""
		startgraph_date_old = None
		if start_graph_date[-1].flags[0] == "Revised":
		   print "But as this date is flagged as Revised, "
		   if current_date != startgraph_date:  
	 		  for st_date in start_graph_date[::-1]:
				  if st_date.flags[0] == "New" or st_date.flags[0] == "Used":
					   print "Start the window from", st_date.value
					   startgraph_date_old = time.strptime(st_date.value, "%d/%m/%Y")   
					   startgraph_date_old = date(startgraph_date_old[0], startgraph_date_old[1], startgraph_date_old[2])
					   break
				
			  days_old = (startgraph_date - startgraph_date_old).days
			  print "The new date is ", days_old, " days away from the old date"
			  endgraph_date_old = startgraph_date_old + timedelta(days = 7)
			  print "The old chart window ends on ",endgraph_date_old
			  goal_target_prev2 = "0" 
			  if len(goal_target_val) > 2:
				   for tval in goal_target_val[::-2]:
					   if tval.flags[0] == "New" or tval.flags[0] == "Used":
						  goal_target_prev2 = (tval.value).split(' ')[0] 
						  print "Previous previous target %s" % tval.value
								
			  if startgraph_date <= endgraph_date_old:
				   print "As the new date falls within old chart window"
				   print "Current and previous targets for the days between old and new start date are", goal_target_prev, " and ",goal_target_prev2
				   for i in range(0,days_old):			 
					   goal_list.append(goal_target_prev)
					   goal_list_prev.append(goal_target_prev2)  
					   print "Current and previous targets for the days between new start and end window date are", goal_target, " and ",goal_target_prev	
				   for j in range(days_old,7):
					   goal_list.append(goal_target)
					   goal_list_prev.append(goal_target_prev)
				   	   final_date = startgraph_date_old
			  else:
					print "As the new date falls outside old chart window"
					print "Current and previous targets for the days between old start and end date are", goal_target_prev, " and ",goal_target_prev2
					for i in range(0,7):			 
					   goal_list.append(goal_target_prev)
					   goal_list_prev.append(goal_target_prev2)										  
					   final_date = startgraph_date_old
		   else:
				print "As the new date is today"
				print "Current and previous targets are", goal_target, " and ",goal_target_prev, "and update the flags as Used"
				print "A new time window will start from now on."				
				self.personis_um.add_evidence(context=context, component='graph_startdate', value=start_graph_date[-1].value, flags=['Used'])
				self.personis_um.add_evidence(context=context, component='target_value', value=goal_target_val[-1].value, flags=['Used'])
			
				final_date = startgraph_date
				for j in range(0,7):
					goal_list.append(goal_target)
					goal_list_prev.append(goal_target_prev)
		else:
			print "A new time window starts from now on as the date is not revised."				
			endgraph_date = startgraph_date + timedelta(days = 7)
			print "The chart ends on ",endgraph_date				   
			if current_date > endgraph_date:  
				   print "As today is outside the last time window, update the time window"		
				   start_goal_weekday = self.personis_um.get_evidence_new(context = context, componentid='goal_startday')
				   print "Get the weeday when the goal starts", start_goal_weekday[-1].value
				   dayofweek = start_goal_weekday[-1].value
				   pass_date = current_date
				   day_of_week = ["monday","tuesday","wednesday","thursday","friday","saturday","sunday"]				
				   print "Weekday:", current_date.weekday()
				   while dayofweek != day_of_week[pass_date.weekday()]:
					  pass_date = pass_date + timedelta(days = 1)  
				   start_graph = pass_date.strftime("%d/%m/%Y")
				   startgraph_date = pass_date
				   print "New chart window start date is ",start_graph
				   self.personis_um.add_evidence(context=context, component='graph_startdate', value=start_graph, flags=['Used'])
				   print "Current and previous targets are", goal_target, " and ",goal_target_prev, "and update the flags as Used"
		   
				   final_date = startgraph_date
				   for j in range(0,7):
					   goal_list.append(goal_target)
					   goal_list_prev.append(goal_target_prev)
			else:
				   print "As today is inside the current chart window"
				   print "Current and previous targets are", goal_target, " and ",goal_target_prev, "and no update is needed"
		
				   final_date = startgraph_date
				   for j in range(0,7):
					   goal_list.append(goal_target)
					   goal_list_prev.append(goal_target_prev)
				
		#----Just a small check to set interval in default 7 days so you can see a default graph just after you've set the goal
		if past_next == "none": 
			prev_date = final_date
			interval = 7 
			past_next = "next"
		elif past_next == "past":
			prev_date = st_date
			interval = 7
			past_next = "next"
		elif past_next == "next":
			prev_date = st_date
			interval = 7
			past_next = "next"
		   
		print "goal set on %s %d days ago" % (prev_date, interval)
		print "pursue goal for %s for %d days" % (end_date,betweendays) 
		new_evdlist = list()
		daycount = 1
		
		date_list = []
		check_list = []
		
		#--- If form is steps and calories,you get to see the column chart
		#if form == "steps": 
		#json_data = fbt.resolver_fitbit_with_target(self.personis_um, context, form, prev_date, interval, past_next, keys, goal_target, goal_target_prev,)
		json_data = fbt.resolver_fitbit_with_target(self.personis_um, context, form, prev_date, interval, past_next, keys, goal_list,goal_list_prev)			
		print json_data
		return json_data
		#--- If form is active minutes, you get to see the pie chart
		#else:				   
		#   return [] 

	def get_historic_data_with_target(self, fbt, form, goal_type):

		import datetime
		today = datetime.datetime.now()
		current_date = date(today.year, today.month, today.day)
		keys = ('year','month','day','activity','goal')
		  
		#-- Look for the goal type	
		context = ['Goals','Health']
		context.append(goal_type)

		#-- Take all goal targets so far
		goal_target_val = self.personis_um.get_evidence_new(context = context, componentid="target_value")
		#-- Take latest goal duration..how long you will pursue the goal
		goal_duration = self.personis_um.get_evidence_new(context=context, componentid="goal_duration")
		index = 0
		evdlist = self.personis_um.get_evidence_new(context=['Devices','Fitbit','Activity'], componentid=form)
		print "Number of goals:", len(goal_target_val)
		datadict_list = []
		email_id = self.personis_um.get_evidence_new(context=['Personal'], componentid="email")
		   
		for gindex in range(len(goal_target_val)):
			 print "Print data so far"
			 print json.dumps(datadict_list)
							
			 goal_target = (goal_target_val[gindex].value).split(' ')[0]
			 print "Looking data from target ",goal_target				
			 start_time = time.localtime(int(goal_target_val[gindex].time))
			 goal_start_date = date(start_time[0], start_time[1], start_time[2])
			 print "This goal is set on ", goal_start_date
			 
			 #--How many days in between the goal set date and goal finish deadline
			 if goal_duration[gindex].value != "no change":
				betweendays = self.get_days_in_between(goal_duration[gindex].value)
			 else:
				betweendays = self.get_days_in_between(goal_duration[gindex-1].value)
			 
			 goal_end_date = goal_start_date + timedelta(days = betweendays)
			 
			 if gindex < len(goal_target_val)-1:
				goal_target_next = (goal_target_val[gindex+1].value).split(' ')[0]								
				next_start_time = time.localtime(int(goal_target_val[gindex+1].time))
				next_goal_start_date = date(next_start_time[0], next_start_time[1], next_start_time[2])
				print "Next goal is starting on ", next_goal_start_date
				if next_goal_start_date < goal_end_date:
				   betweendays = (next_goal_start_date - goal_start_date).days						 
		
			 print "Pursue this goal till %s for %d days" % (goal_end_date,betweendays) 

			 #index = index + 1  
			 prev_date = goal_start_date
			 interval = betweendays
			 for i in range(1,interval):
				 newval = 0
				 #-- Loop through the evidence list						
				 for j in range(len(evdlist)):
					 #-- If this evidence is not already visited and 
					 #-- check the flag if the evidence is minute data (not summary data)
					 if evdlist[j].value != -1:# and evdlist[j].flags[0] == 'minute':
						 tt = time.localtime(int(evdlist[j].time))
						 track_date = date(tt[0],tt[1],tt[2])
							   
						 if track_date == prev_date:
							 #print evdlist[j]	
							 if goal_type == "StepGoal":
								 newval = newval + evdlist[j].value
								 evdlist[j].value = -1 #-- mark as visited
							 elif goal_type == "ModerateActivityGoal":
								 if evdlist[j].value == 2:
									newval = newval + 1
									evdlist[j].value = -1 #-- mark as visited
							 elif goal_type == "IntenseActivityGoal":
								 if evdlist[j].value == 3:
									newval = newval + 1
									evdlist[j].value = -1 #-- mark as visited			  
			  
							 #print "Year:%d, Month:%d, Day:%d, Value: %d" %(prev_date.year,prev_date.month,prev_date.day,evdlist[j].value)
							 
					   
				 #-----------------------alex personis user study
				 if email_id[-1].value == "alexonemonth.personis@gmail.com" and goal_type == "StepGoal":
					if prev_date.day == 4 and prev_date.month == 2:
						newval = 5902 
				
				 if email_id[-1].value == "alexoneweek.personis@gmail.com" and goal_type == "StepGoal":
					 newval = 0
				
				 if email_id[-1].value == "alexonemonth.personis@gmail.com" and goal_type == "StepGoal":
					if prev_date.day == 4 and prev_date.month == 2:
						newval = 5902 
					if prev_date.day == 10 and prev_date.month == 2:
					   newval = 0
					if prev_date.day == 11 and prev_date.month == 2:
					   newval = 0 
					if prev_date.day == 12 and prev_date.month == 2:
					   newval = 0 
                
				 if newval != 0:	  
					 tag_list=list()
					 tag_list.append(prev_date.year)
					 tag_list.append(prev_date.month)
					 tag_list.append(prev_date.day)
			   
					 tag_list.append(newval)
					 tag_list.append(string.atoi(goal_target))
					 #print "Year:%d, Month:%d, Day:%d, Value: %d" %(prev_date.year,prev_date.month,prev_date.day,newval)
					 data_dictionary = dict(itertools.izip(keys, tag_list))
					 datadict_list.append(data_dictionary)					 
				 prev_date = prev_date + timedelta(days=1)
				 
					 
		print json.dumps(datadict_list)				   
		return json.dumps(datadict_list)				 

	def show_historic_graph(self, fbt, form, goal_type):
		
		if goal_type != 'CurrentLevelGoal':
		   return self.get_historic_data_with_target(fbt, form, goal_type)

	def show_health(self):
		#visualization_template = self.read_template_file("templates/health_graph.html")
		visualization_template = self.read_template_file("mytemplates/visualization_hc1.html")
		return visualization_template


	def show_graph_hc_old(self,data=None):

		keys = ('year','month','day','steps','calory','pulse')
		print data
		try:
			search_date = data.split('_')
			#print search_date[0], search_date[1]
			object_list1 = list()
			object_list2 = list()

			x=0
			d1, m1, y1 = (int(x) for x in search_date[0].split('/'))
			d2, m2, y2 = (int(x) for x in search_date[1].split('/'))

			date1 = date(y1, m1, d1)
			date2 = date(y2, m2, d2)

			offset = int(str(date2 - date1).split(' ')[0])
			start_date=date1
			current_date=start_date
			print date1, date2, offset
			#evdlist, datelist = self.personis_um.get_evidence(context=['Apps','Fitbit','Activity'], componentid="steps", start=date1, end=date2)
			while (offset>=0):
				current_date=start_date+timedelta(days = x)
				x += 1
				offset -= 1
				steps = random.randrange(10000,12000)
				#divMod = float(mails_rec/3000)
				calories = random.randrange(1900,2000)
				heartbeat = random.randrange(50,70)

				obj = activity_a_day(current_date, steps, calories,heartbeat)
				object_list1.append(obj)

			activity_list = ["sedentary","lightly active","fairly active","very active"]
			for activity in activity_list:
				number = random.randrange(0,10)
				obj = ActivityType(activity,number)
				object_list2.append(obj)

			dict_data = []

			for e in object_list1:
				tag_list=list()
				tag_list.append(e.mydate.year)
				tag_list.append(e.mydate.month)
				tag_list.append(e.mydate.day)
				tag_list.append(e.steps)
				tag_list.append(e.calory)
				tag_list.append(e.heartbeat)
				data_dictionary = dict(itertools.izip(keys, tag_list))
				dict_data.append(data_dictionary)
			return json.dumps(dict_data)
		except Exception,e:
			print e
			return "Error: "+str(e)


	def show_graph_hc(self,data=None):

		keys = ('year','month','day', 'steps', 'active_time', 'calorie', 'pulse')
		print data
		try:
			search_date, search_period = data.split('_')
			print search_date, search_period
			object_list1 = list()
			object_list2 = list()

			x=0
			d1, m1, y1 = (int(x) for x in search_date.split('/'))
			if search_period == 'Week': offset = 7
			elif search_period == 'Fortnight': offset = 14
			elif search_period == 'Month': offset = 30
			elif search_period == 'Year': offset = 365

			start_date = date(y1, m1, d1)

			print start_date, offset
			#evdlist, datelist = self.personis_um.get_evidence(context=['Devices','Fitbit','Activity'], componentid="steps", start=date1, end=date2)
			while (offset>=0):
				current_date=start_date-timedelta(days = offset)
				offset -= 1
				steps = random.randrange(10000,12000)
				active_hours = random.randrange(1,5)
				#divMod = float(mails_rec/3000)
				calories = random.randrange(1900,2000)
				heartbeat = random.randrange(50,70)

				obj = activity_a_day(current_date, steps, active_hours, calories,heartbeat)
				object_list1.append(obj)

			activity_list = ["sedentary","lightly active","fairly active","very active"]
			for activity in activity_list:
				number = random.randrange(0,10)
				obj = ActivityType(activity,number)
				object_list2.append(obj)

			dict_data = []

			for e in object_list1:
				tag_list=list()
				tag_list.append(e.mydate.year)
				tag_list.append(e.mydate.month)
				tag_list.append(e.mydate.day)
				tag_list.append(e.steps)
				tag_list.append(e.active_hours)
				tag_list.append(e.calorie)
				tag_list.append(e.heartbeat)
				data_dictionary = dict(itertools.izip(keys, tag_list))
				dict_data.append(data_dictionary)
			return json.dumps(dict_data)
		except Exception,e:
			print e
			return "Error: "+str(e)

	def annual_records(self):
		#visualization_template = self.read_template_file("um_templates/column-drilldown.htm")
		#return visualization_template
		file = open("um_templates/test.html")
		html = file.read()
		file.close()
		return html

	def show_goals(self):
		keys = ('year','month','day', 'steps', 'intense', 'moderate', 'note')
		notes_arr = ['sick', 'exam','quiz','busy','travel','party']
		try:
			import datetime
			today = datetime.datetime.now()
			start_date = date(today.year, today.month, today.day)
			print start_date
			offset = 7
			object_list = list()
			dict_data = []
			print start_date, offset
			#evdlist, datelist = self.personis_um.get_evidence(context=['Devices','Fitbit','Activity'], componentid="steps", start=date1, end=date2)
			while (offset>=10):
				current_date=start_date-timedelta(days = offset)
				offset -= 1
				steps = random.randrange(9,11)
				intense = random.randrange(1,2)
				#divMod = float(mails_rec/3000)
				if intense == 0:
					i = random.randrange(0,5)
					note = notes_arr[i]
				else:
					note = ""
				moderate = random.randrange(20,40)

				obj = goal_activity(current_date, steps, intense, moderate,note)
				object_list.append(obj)

			while (offset>=7):
				current_date=start_date-timedelta(days = offset)
				offset -= 1
				steps = random.randrange(1,3)
				intense = 0
				#divMod = float(mails_rec/3000)
				note = "Sick"
				moderate = random.randrange(5,10)

				obj = goal_activity(current_date, steps, intense, moderate,note)
				object_list.append(obj)

			while (offset>=2):
				current_date=start_date-timedelta(days = offset)
				offset -= 1
				steps = random.randrange(9,11)
				intense = random.randrange(1,2)
				#divMod = float(mails_rec/3000)
				note = ""
				moderate = random.randrange(20,40)

				obj = goal_activity(current_date, steps, intense, moderate,note)
				object_list.append(obj)

			obj = goal_activity(start_date-timedelta(days = 1), 5, 0, 15, "Quiz")
			object_list.append(obj)
			obj = goal_activity(start_date, 10, 1, 35, "")
			object_list.append(obj)

			for e in object_list:
				tag_list=list()
				tag_list.append(e.mydate.year)
				tag_list.append(e.mydate.month)
				tag_list.append(e.mydate.day)
				tag_list.append(e.steps)
				tag_list.append(e.intense)
				tag_list.append(e.moderate)
				tag_list.append(e.note)
				data_dictionary = dict(itertools.izip(keys, tag_list))
				dict_data.append(data_dictionary)
			return json.dumps(dict_data)
		except Exception,e:
			print e
			return "Error: "+str(e)

	def show_timeline(self):
		visualization_template = self.read_template_file("mytemplates/timeline.html")
		return visualization_template

	def get_timeline_data(self):
		event_data = [{'start':"2012-03-04", 'title':"Installed fitbit sensor",'isDuration':False},{'start':"2012-03-15", 'end':"2012-04-04", 'title':"Set Step goal",'isDuration':True},{'start':"2012-04-02",'end':"2012-06-17",'title':"Set moderate activity goal",'isDuration':True}]
		data = {'dateTimeFormat': 'iso8601', 'wikiURL': "http://simile.mit.edu/shelf/", 'wikiSection': "Simile Cubism Timeline",'events' : event_data}
		return json.dumps(data)


	def term_cloud(self):
		# Creating the data
		description = {"tag": ('string', 'Tag'),
						 "url": ('string', 'URL'),
						 "size":('number','Size'),
						 }
		keys = ('tag','url','size')
		data = []

		list1 = ['Dora','David','Bob','Alice','John','Paulin','Laura']
		list2 = [20,15,15,10,10,5,5]

		i=0
		for i in range(len(list1)):
			tag_list=list()
			tag_list.append(list1[i])
			tag_list.append('#')
			tag_list.append(list2[i])
			data_dictionary = dict(itertools.izip(keys, tag_list))
			data.append(data_dictionary)

		for j in range(len(data)):
			print data[j]


		# Loading it into gviz_api.DataTable
		data_table = gviz_api.DataTable(description)
		data_table.LoadData(data)

		# Creating a JavaScript code string
		jscode = data_table.ToJSCode("jscode_data",
									   columns_order=("tag", "url","size"))


		# Putting the JS code into the template
		visualization_template_pie = self.read_template_file("mytemplates/term_cloud.html")
		print visualization_template_pie % vars()
		return visualization_template_pie % vars()


	def getDayOfWeek(self,date_obj):
		# day of week (Monday = 0) of a given month/day/year
		dayofWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

		return dayofWeek[date.weekday(date_obj)]


	def datetoday(self,day, month, year):
		d = day
		m = month
		y = year
		if m < 3:
			z = y-1
		else:
			z = y
		dayofweek = ( 23*m//9 + d + 4 + y + z//4 - z//100 + z//400 )
		if m >= 3:
			dayofweek -= 2
		dayofweek = dayofweek%7
		return dayofweek - 1
	
 
	def show_graph_steps(self):
		new_evdlist = list()
		#print "", Weekday[self.getDayOfWeek("11/12/1970")]
		evdlist = self.personis_um.get_evidence_new(context=['Devices','Fitbit','Activity'], componentid="steps")
		import datetime
		prev_date = date(2000,1,1)
		i = 0
		newval = 0
		weekday_data = [0,0,0,0,0,0,0]
		for ev in evdlist:
			print datetime.datetime.fromtimestamp(int(ev.time)).strftime('%Y-%m-%d'), ev.value
			try:
				um_time = ev.time
				import datetime
				tt = time.localtime(int(um_time))
				track_date = date(tt[0],tt[1],tt[2])
				#datetime.datetime.fromtimestamp(int(time)).strftime('%Y-%m-%d')
				if prev_date != track_date:
					if newval != 0:
						new_evdlist.append(int(newval))
						print "Fitbit data on %s is %s"%(str(prev_date), newval)
						weekday_data[date.weekday(prev_date)] += newval
					newval = int(ev.value)

					prev_date = track_date
				else:
					newval += int(ev.value)

			except Exception,e:
				print e
				return "Error: "+str(e)

		weekday_data[date.weekday(prev_date)] += newval

		dayofWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
		keys = ('dayOfWeek','steps')
		dict_data = []
		for i in range(len(dayofWeek)):
			print "Fitbit calories burnt on %s is %d"%(dayofWeek[i],weekday_data[i])
			tag_list=list()
			tag_list.append(dayofWeek[i])
			tag_list.append(weekday_data[i])
			data_dictionary = dict(itertools.izip(keys, tag_list))
			dict_data.append(data_dictionary)
		return json.dumps(dict_data)

	 
	   
