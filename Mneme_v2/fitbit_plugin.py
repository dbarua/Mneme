#!/usr/bin/env python


import fitbit
import json
import datetime

import os, sys
import random, itertools, json
GOAL = 10000
#Personis
#import Personis
#import Personis_base, Personis_a
#from Personis_util import printcomplist
from personis import client

from datetime import date, timedelta
from oauth import oauth

import string
#from multiprocessing.connection import Client
#from multiprocessing import Process, Lock
#import threading, webbrowser
#modelname=sys.argv[1]
#username=sys.argv[2]
#password=sys.argv[3]
#model_dir = sys.argv[4]
#model_dir = '/home/dbarua/llum/Personis/models'

global evidence_list
evidence_list = []

__current_app = "Fitbit"

context = ['Devices','Fitbit','Activity']

z = fitbit.FitBit()
access_token = ""

class fitbit_plugin(object):

	def install_fitbit(self, personis_um):

		url,token = self.get_fitbit_authorization(personis_um)

		print url, token
		#track_minute_calories(personis_um, ac_token)
		return url,token
		"""
		track_intrday_fitbit()
		# print get_date() - date(2011, 7,8)
		"""
	def get_fitbit_authorization(self, personis_um):

		auth_url, auth_token = z.GetRequestToken()
		self.oauth_url = auth_url
		self.oauth_token = auth_token
		print auth_url
		#print auth_token
		try:
			#lock = Lock()
			#Process(target=send_data, args=(lock, personis_um, auth_url, auth_token)).start()

			#import webbrowser
			#webbrowser.open(auth_url)
			return auth_url,auth_token
		except Exception,e:
			return "Error:"+str(e)

	def complete_authentication(self, personis_um, oauth_verifier=None, oauth_token=None):
		try:
			self.oauth_verifier = oauth_verifier
			oauth_token = oauth.OAuthToken.from_string(str(oauth_token))
			self.access_token = z.GetAccessToken(oauth_verifier, oauth_token)
			print self.access_token
			import datetime
			today = datetime.datetime.now()
			start_date = str(today.year)+'-'+str(today.month)+'-'+str(today.day)

			response = z.ApiCall(self.access_token, apiCall='/1/user/-/activities/date/'+start_date+'.json')
			jdata = json.loads(response)
			print jdata
			
			
			ctx_obj = client.Context(Identifier="Fitbit", Description="Extract data from fitbit server",
										perms={'ask':True, 'tell':True, "resolvers":["all","last10","last1","goal"]},																						   
										resolver=None, objectType="Context")
			context = ['Devices']
			print "Creating Fitbit context under Devices context "
			
			personis_um.um.mkcontext(context,ctx_obj)

			ctx_obj = client.Context(Identifier="Activity", Description="Extract data from fitbit server",
										perms={'ask':True, 'tell':True, "resolvers":["all","last10","last1","goal"]},																						   resolver=None, objectType="Context")
			context.append('Fitbit')
			print "Creating Activity context under Devices/Fitbit context "
			personis_um.um.mkcontext(context,ctx_obj)

			context.append('Activity')
			cobj = client.Component(Identifier="steps", component_type="attribute", value_type="number",resolver=None,Description="Fitbit 1-minute step data")
			personis_um.um.mkcomponent(context=context, componentobj=cobj)
			print "Creating component %s"%cobj.Identifier
			cobj = client.Component(Identifier="calories", component_type="attribute", value_type="string",resolver=None,Description="Fitbit 1-minute calorie data")
			personis_um.um.mkcomponent(context=context, componentobj=cobj)
			print "Creating component %s"%cobj.Identifier

			cobj = client.Component(Identifier="activity_level", component_type="attribute", value_type="number",resolver=None,Description="Fitbit 1-minute active score data")
			personis_um.um.mkcomponent(context=context, componentobj=cobj)
			print "Creating component %s"%cobj.Identifier
			
			cobj = client.Component(Identifier="active_mins", component_type="attribute", value_type="number",resolver=None,Description="Fitbit active minutes in a day")
			personis_um.um.mkcomponent(context=context, componentobj=cobj)
			print "Creating component %s"%cobj.Identifier

			cur_context = ['Devices','Fitbit']
			componentid = "@fitbit_access_token"
			cobj = client.Component(Identifier=componentid, component_type="attribute", value_type="string",resolver=None,Description="Fitbit access token")
			personis_um.um.mkcomponent(context=cur_context, componentobj=cobj)
			ev = client.Evidence(source="fitbit-installer", evidence_type="explicit", value=self.access_token)
			ev.comment = "first installation of fitbit."
			personis_um.um.tell(context=cur_context, componentid=componentid, evidence=ev)
			print "Creating component %s"%cobj.Identifier
			
			componentid = "@apicall"
			cobj = client.Component(Identifier=componentid, component_type="attribute", value_type="number",resolver=None,Description="Fitbit apicall for accessing data")
			personis_um.um.mkcomponent(context=cur_context, componentobj=cobj)
			ev = client.Evidence(source="fitbit-installer", evidence_type="explicit", value=1)
			ev.comment = "first call"
			personis_um.um.tell(context=cur_context, componentid=componentid, evidence=ev)
			print "Creating component %s"%cobj.Identifier
			
				 
			return "ok"
		except Exception,e:
			print e
			return "Error:"+str(e)

	#get todays date and time
	def get_date(self):
		try:
			import datetime
			today_date = datetime.datetime.now()
			#start_date = datetime.datetime.fromtimestamp(int(t)).strftime('%Y-%m-%d')
			print "Now %s"% str(today_date)
			return date(today_date.year, today_date.month, today_date.day)
		except Exception, e:
			print e
			return 0

		   
	def process_apicall(self, access_token="", current_date=None, start_time=None, end_time=None, form="steps", time_flag=False, personis_um=None, fake_date=None):
		import datetime,time
		try:
			if time_flag == False: # Get fitbit data for all day
				print "searching for minute data for %s with fake date" % str(current_date)
				if fake_date:
				   print fake_date
				   apicall_str1 = '/1/user/-/activities/log/'+form+'/date/'+str(fake_date)+'/'+str(fake_date)+'.json'
				else:
				   apicall_str1 = '/1/user/-/activities/log/'+form+'/date/'+str(current_date)+'/'+str(current_date)+'.json'
				   #apicall_str2 = '/1/user/-/activities/log/calories/date/'+str(current_date)+'/'+str(current_date)+'.json'
				
			else: 
				#----Get fitbit data for a specified time limit-----
				apicall_str1 = '/1/user/-/activities/log/'+form+'/date/'+str(current_date)+'/1d/time/'+str(start_time)+'/'+str(end_time)+'.json'
				print "Searching data from %s to %s "%(start_time,end_time)					
				#apicall_str2 = '/1/user/-/activities/log/'+form+'/date/'+str(current_date)+'/1d/time/'+str(start_time)+'/'+str(end_time)+'.json'
								
			
			if time_flag == True and form == "calories":
			   ev = client.Evidence(source="fitbit-installer", evidence_type="explicit", value=1)
			   ev.comment = "api call time track"
			   personis_um.um.tell(context=['Devices','Fitbit'], componentid="@apicall", evidence=ev)
			   print "Adding api-call for new data"
			
			print "---Processing api call %s" %(apicall_str1)   
			jdata = z.ApiCall(access_token, apiCall=apicall_str1)			 
			jdata = json.loads(jdata)
			activity_key = 'activities-log-'+form+'-intraday'
			jdata = jdata[activity_key]['dataset']
			print jdata
			context = ['Devices','Fitbit','Activity']
			for fd in jdata:
			  fit_time = fd['time']						 
			  user_date = str(current_date)+" "+str(fit_time) 
			  fit_val = fd['value']
				
			  if form=='calories':
				  cid = form
				  fit_level = fd['level']
				  fit_val = round(fit_val,4)
				  if fit_level != 0:
					 personis_um.add_evidence(context=context, component=cid, value=fit_val, comment=None, usertime=user_date, flags=['minute'])   
					 personis_um.add_evidence(context=context, component='activity_level', value=fit_level, comment=None, usertime=user_date, flags=['minute'])
			  else:
					 cid = form
					 if fit_val != 0:
						personis_um.add_evidence(context=context, component=cid, value=fit_val, comment=None, usertime=user_date, flags=['minute'])
					   #print "Fitbit data on %s is %d" %(user_date, fit_val)  
			return "Success"	 
		except Exception,e:
			print "Error in process_apicall function:",e
			return None
	
	def add_evidence_um(self, personis_um, jdata, form, current_date):

		activity_key = 'activities-log-'+form+'-intraday'
		jdata = jdata[activity_key]['dataset']
		print jdata
		context = ['Devices','Fitbit','Activity']
		for fd in jdata:
			fit_time = fd['time']						 
			user_date = str(current_date)+" "+str(fit_time) 
			fit_val = fd['value']
				
			if form=='calories':
			   cid = form
			   fit_level = fd['level']
			   fit_val = round(fit_val,4)
			   if fit_level != 0:
				  personis_um.add_evidence(context=context, component=cid, value=fit_val, comment=None, usertime=user_date, flags=['minute'])   
				  personis_um.add_evidence(context=context, component='activity_level', value=fit_level, comment=None, usertime=user_date, flags=['minute'])
				  #print "Fitbit data on %s is %d" %(user_date, fit_val)
			   else:
				  cid = form
				  if fit_val != 0:
					 personis_um.add_evidence(context=context, component=cid, value=fit_val, comment=None, usertime=user_date, flags=['minute'])
					   #print "Fitbit data on %s is %d" %(user_date, fit_val)	
			
	def daily_summary_data(self,personis_um,current_date):
		access_token = self.get_access_code(personis_um)
		response = z.ApiCall(access_token, apiCall='/1/user/-/activities/date/'+str(current_date)+'.json')
		print response
		jdata = json.loads(response)  
		print jdata						   
		
		context = ['Devices','Fitbit','Activity']
		#--- Not adding for summary steps and calories data
		#steps = jdata['summary']['steps']
		#cid = "steps"
		#print "my steps:"+str(steps)		
		#personis_um.add_evidence(context=context, component=cid, value=steps, comment=None, usertime=str(current_date), flags=['summary'])
		caldata = jdata['summary']["caloriesOut"]	
		personis_um.add_evidence(context=context, component="calories", value=caldata, comment=None, usertime=str(current_date)+" 00:00:00", flags=['summary'])

		#--SUmmary of active mins in last 7 days
		activemins = ["fairlyActiveMinutes","lightlyActiveMinutes","sedentaryMinutes","veryActiveMinutes"]
		for key in activemins:
			actvmins = jdata['summary'][key] 
			personis_um.add_evidence(context=context, component="active_mins", value=actvmins, comment=key, usertime=str(current_date)+" 00:00:00", flags=['summary'])
			

	def get_intrday_fitbit_data(self, personis_um, access_token, form='steps',start_date=None, end_date=None):
		global evidence_list
		if start_date != end_date:
			days_in_between = str(end_date - start_date).split(' ')
			interval = int(days_in_between[0])
		else:
			interval = 3
			print interval
		activity_key = 'activities-log-'+form+'-intraday'
		for i in range(interval):
			try:
				current_date=start_date + timedelta(days=i)
				#print current_date, i
				time = False
				self.process_apicall(access_token, current_date, form, time, personis_um)
			except Exception, e:
				print e


	def resolver_fitbit(self, personis_um, form='steps', start_date=None, interval=7, type="past", keys=('year','month','day','steps')):
		#-- Get fitbit data from um
		evdlist = personis_um.get_evidence_new(context=['Devices','Fitbit','Activity'], componentid=form)
		found = 0
		#-- If start date is not avaliable go for today's date
		import datetime,time 
		if not start_date:		   
		   today = datetime.datetime.now()
		   start_date = date(today.year, today.month, today.day)
		prev_date = start_date
		print "Start graph from ", prev_date
		#keys = ('year','month','day','steps') 
		newval = 0
		datadict_list = []
		#-- By default look for past 7 days data
		for i in range(0,interval):
		   print "Resolve data for past"
		   newval = 0
		   #-- Loop through the evidence list						
		   for j in range(len(evdlist)):
			   #-- If this evidence is not already visited and 
			   #-- check the flag if the evidence is minute data (not summary data)
			   if evdlist[j].value != -1:# and evdlist[j].flags[0] == 'minute':
				  tt = time.localtime(int(evdlist[j].time))
				  track_date = date(tt[0],tt[1],tt[2])
				  if track_date == prev_date:
					 newval = newval + evdlist[j].value
					 #print "Year:%d, Month:%d, Day:%d, Value: %d" %(prev_date.year,prev_date.month,prev_date.day,evdlist[j].value)
					 evdlist[j].value = -1 #-- mark as visited
					   
		   tag_list=list()
		   tag_list.append(prev_date.year)
		   tag_list.append(prev_date.month)
		   tag_list.append(prev_date.day)
		   #-----------------------alex personis user study
		   email_id = personis_um.get_evidence_new(context=['Personal'], componentid="email")
		   if email_id[-1].value.find("personis") != -1:
			   if form =='calories':
				  newval = newval + 1000
				  if prev_date.day == 12 and prev_date.month == 1:
					  newval = newval + 517 
				  if prev_date.day == 11 and prev_date.month == 1:
					  newval = newval - 600
				  if prev_date.day == 10 and prev_date.month == 1:
					  newval = newval - 80 
				  if prev_date.day == 9 and prev_date.month == 1:
					  newval = newval - 100 
			   if prev_date.day == 13 and prev_date.month == 1:
				  newval = 0 
			   if prev_date.day == 14 and prev_date.month == 1:
				  newval = 0 
			  
		   #--------------------------
		   tag_list.append(newval)
		   #print "Year:%d, Month:%d, Day:%d, Value: %d" %(prev_date.year,prev_date.month,prev_date.day,newval)
		   data_dictionary = dict(itertools.izip(keys, tag_list))
		   datadict_list.append(data_dictionary)
		   if type == "past": prev_date = prev_date - timedelta(days=1)
		   else: prev_date = prev_date + timedelta(days=1)
		#print json.dumps(datadict_list)  
		return json.dumps(datadict_list)
	#---Resolver
	def resolver_fitbit_active_mins(self, personis_um, start_date=None, set_date=None, interval=7, type="past", keys=('activity_level','active_mins')):
		
		evdlist = personis_um.get_evidence_new(context=['Devices','Fitbit','Activity'], componentid='activity_level')
		found = 0
		#-- If start date is not avaliable go for today's date
		prev_date = start_date 
		import datetime,time
		today = datetime.datetime.now()
		current_date = date(today.year, today.month, today.day)
		if not prev_date:		   
		   prev_date = current_date
		
		   
		newval = 0
		datadict_list = []
		inactive = light_active = fair_active = very_active = 0
		
		#-- When this goal was set
		minutes = today.hour * 60 + today.minute
		print "Minutes today:", minutes
		daysinbetween = str((current_date - set_date).days)
		print daysinbetween
		minutes = minutes + (1 * 24 * 60)
		#print "Days in between:",days," and minutes ",mintues
		#-- By default look for past 7 days data
		for i in range(0,interval):
		   print "Resolve data for past"
		   newval = 0
		   #-- Loop through the evidence list						
		   for j in range(len(evdlist)):
			   #-- If this evidence is not already visited and 
			   #-- check the flag if the evidence is minute data (not summary data)
			   if evdlist[j].value != -1 and evdlist[j].flags[0] == 'minute':
				  tt = time.localtime(int(evdlist[j].time))
				  track_date = date(tt[0],tt[1],tt[2])
				  if track_date == prev_date:
					 if evdlist[j].value == 1:
						light_active = light_active + evdlist[j].value
					 elif evdlist[j].value == 2:
						fair_active = fair_active + evdlist[j].value
					 elif evdlist[j].value == 3:
						very_active = very_active + evdlist[j].value
					 #-- mark as visited
					 evdlist[j].value = -1 
																 
		
		inactive = minutes - (light_active + fair_active + very_active)
		tag_list=list()
		tag_list.append('Sedentary')
		tag_list.append(inactive)
		data_dictionary = dict(itertools.izip(keys, tag_list))
		datadict_list.append(data_dictionary)
		
		tag_list=list()
		tag_list.append('Lightly active')
		tag_list.append(light_active)
		data_dictionary = dict(itertools.izip(keys, tag_list))
		datadict_list.append(data_dictionary)
		
		tag_list=list()
		tag_list.append('Fairly active')
		tag_list.append(fair_active)
		data_dictionary = dict(itertools.izip(keys, tag_list))
		datadict_list.append(data_dictionary)
		
		tag_list=list()
		tag_list.append('Very active')
		tag_list.append(very_active)
		data_dictionary = dict(itertools.izip(keys, tag_list))		
		datadict_list.append(data_dictionary)
		
		return json.dumps(datadict_list)
	
	def resolver_fitbit_with_target(self, personis_um, goalcontext, form='steps', start_date=None, interval=7, type="past", keys=('year','month','day','steps','prev_remain','remain','prev_target','cur_target','notes'),goal_target_current=[], goal_target_prev=[]):
		#-- Get fitbit data from um
		evdlist = personis_um.get_evidence_new(context=['Devices','Fitbit','Activity'], componentid=form)
		found = 0
		#-- If start date is not avaliable go for today's date
		import datetime,time 
		if not start_date:		   
		   today = datetime.datetime.now()
		   start_date = date(today.year, today.month, today.day)
		prev_date = start_date
		#keys = ('year','month','day','steps') 
		newval = 0
		datadict_list = []
		#print "Current Goal %s, prev goal %s" % (goal_target_current, goal_target_prev)
		print "start the graph from date", prev_date
		if form == 'steps':
		   note_evdlist = personis_um.get_evidence_new(context=['Goals','Health','StepGoal'], componentid='notes')
		else: 
		   note_evdlist = personis_um.get_evidence_new(context=goalcontext, componentid='notes')
		#-- By default look for past 7 days data
		for i in range(0,interval):
		   print "Resolve data for date ", prev_date
		   notes = ""		   
		   newval = 0
		   #-- Loop through the evidence list   
								
		   for j in range(len(evdlist)):
			   #-- If this evidence is not already visited and 
			   #-- check the flag if the evidence is minute data (not summary data)
			   if evdlist[j].value != -1:# and evdlist[j].flags[0] == 'minute':
				  tt = time.localtime(int(evdlist[j].time))
				  track_date = date(tt[0],tt[1],tt[2])
				  if track_date == prev_date:
					 if goalcontext[2] == "StepGoal": 
						 newval = newval + evdlist[j].value
						 evdlist[j].value = -1 #-- mark as visited
					 elif goalcontext[2] == "ModerateActivityGoal":
						 if evdlist[j].value == 2:
							newval = newval + 1
							evdlist[j].value = -1 #-- mark as visited							
					 elif goalcontext[2] == "IntenseActivityGoal":
						 if evdlist[j].value == 3:
							newval = newval + 1
							evdlist[j].value = -1 #-- mark as visited
					 
					 
		   #-- Find out the notes for this day		 
		   for k in range(len(note_evdlist)):
				if note_evdlist[k] != -1:
				  tt_2 = time.localtime(int(note_evdlist[k].time))
				  track_date = date(tt_2[0],tt_2[1],tt_2[2]) 
				  if track_date == prev_date:
					 notes = notes + "<li>"+note_evdlist[k].value+"</li>"
					 print "Year:%d, Month:%d, Day:%d, Value: %s" %(prev_date.year,prev_date.month,prev_date.day,note_evdlist[k].value)
					 note_evdlist[k].value = -1 #-- mark as visited
								 
		   #--- Create a list mapping the keys with the values			
		   tag_list=list()
		   tag_list.append(prev_date.year)
		   tag_list.append(prev_date.month)
		   tag_list.append(prev_date.day)
		   if prev_date.day == 13 and prev_date.month == 1:
			  newval = 0 
		   email_id = personis_um.get_evidence_new(context=['Personal'], componentid="email")
		   if email_id[-1].value == "alexoneweek.personis@gmail.com" and goalcontext[2] == "StepGoal":
			  newval = 0
		   if email_id[-1].value == "alexonemonth.personis@gmail.com" and goalcontext[2] == "StepGoal":
			   if prev_date.day == 4 and prev_date.month == 2:
				   newval = 5902 
		   if email_id[-1].value == "alexonemonth.personis@gmail.com" and goalcontext[2] == "StepGoal":
			   if prev_date.day == 4 and prev_date.month == 2:
				   newval = 5902 
			   if prev_date.day == 10 and prev_date.month == 2:
				   newval = 0
			   if prev_date.day == 11 and prev_date.month == 2:
				   newval = 0 
			   if prev_date.day == 12 and prev_date.month == 2:
				   newval = 0 
			
			  
		   diff = string.atoi(goal_target_current[i]) - newval
		   diff_prev = string.atoi(goal_target_prev[i]) - newval
		   print "Current data ", newval
		   tag_list.append(newval)
		   tag_list.append(diff_prev)
		   tag_list.append(diff)
		   tag_list.append(string.atoi(goal_target_prev[i]))   
		   tag_list.append(string.atoi(goal_target_current[i])) 
		   tag_list.append(notes)	  
		   #print "Year:%d, Month:%d, Day:%d, Value: %d Remaining: %d" %(prev_date.year,prev_date.month,prev_date.day,newval,diff)
		   data_dictionary = dict(itertools.izip(keys, tag_list))
		   datadict_list.append(data_dictionary)
		   if type == "past": prev_date = prev_date - timedelta(days=1)
		   else: prev_date = prev_date + timedelta(days=1)
		#print json.dumps(datadict_list)  
		return json.dumps(datadict_list)	
	
	
	def resolver_fitbit_activity_level(self, personis_um, form='activity_level', level=3, start_date=None, interval=7, type="past", keys=('year','month','day','minutes')):
		#-- Get fitbit data from um
		evdlist = personis_um.get_evidence_new(context=['Devices','Fitbit','Activity'], componentid=form)
		found = 0
		#-- If start date is not avaliable go for today's date
		levels = ['Sedentary','Lightly active','Fairly active','Very active']
		import datetime,time 
		if not start_date:		   
		   today = datetime.datetime.now()
		   start_date = date(today.year, today.month, today.day)
		prev_date = start_date
		#keys = ('year','month','day','steps') 
		newval = 0
		datadict_list = []
		#-- By default look for past 7 days data
		print "Looking for activity level %s in a %d pieces of evidence" % (str(level), len(evdlist))
		for i in range(0,interval):
		   print "Resolve data for past"
		   newval = 0
		   #-- Loop through the evidence list						
		   for j in range(len(evdlist)):
			   #-- If this evidence is not already visited and 
			   #-- check the flag if the evidence is minute data (not summary data)
			   if evdlist[j].value != -1:# and evdlist[j].flags[0] == 'minute':
				  tt = time.localtime(int(evdlist[j].time))
				  track_date = date(tt[0],tt[1],tt[2])
							   
				  if track_date == prev_date and evdlist[j].value == level:
					 print evdlist[j]	
					 newval = newval + 1					 
					 #print "Year:%d, Month:%d, Day:%d, Value: %d" %(prev_date.year,prev_date.month,prev_date.day,evdlist[j].value)
					 evdlist[j].value = -1 #-- mark as visited
					   
		   tag_list=list()
		   tag_list.append(prev_date.year)
		   tag_list.append(prev_date.month)
		   tag_list.append(prev_date.day)
		   tag_list.append(newval)
		   #print "Year:%d, Month:%d, Day:%d, Value: %d" %(prev_date.year,prev_date.month,prev_date.day,newval)
		   data_dictionary = dict(itertools.izip(keys, tag_list))
		   datadict_list.append(data_dictionary)
		   if type == "past": prev_date = prev_date - timedelta(days=1)
		   else: prev_date = prev_date + timedelta(days=1)
		#print json.dumps(datadict_list)  
		return json.dumps(datadict_list)	  
	   
	def get_access_code(self, personis_um):
		ac_token_list = personis_um.get_evidence_new(context=['Devices','Fitbit'], componentid='@fitbit_access_token')
		if ac_token_list:
			ac_token = ac_token_list[0].value
			print ac_token
		return ac_token

	def get_fitbit_data(self, personis_um, start_date, end_date):
		ac_token_list = personis_um.get_evidence_new(context=['Devices','Fitbit'], componentid='@fitbit_access_token')
		if ac_token_list:
			ac_token = ac_token_list[0].value
			print ac_token
			self.get_intrday_fitbit_data(personis_um.um, ac_token, 'steps', start_date, end_date)  
			
	def get_fitbit_average(self, goal, personis_um):
		summary = 0
		import datetime
		today = datetime.datetime.now()
		current_date = date(today.year, today.month, today.day)
		average = 0
		if goal == 'StepGoal':
		   data = self.resolver_fitbit(personis_um, form='steps', start_date=current_date, interval=7, type="past", keys=('year','month','day','steps'))
		elif goal == 'ModerateActivityGoal':
		   data = self.resolver_fitbit_activity_level(personis_um, form='activity_level', level=2, start_date=current_date, interval=7, type="past", keys=('year','month','day','mins')) 
		elif goal == 'IntenseActivityGoal':
		   data = self.resolver_fitbit_activity_level(personis_um, form='activity_level', level=3, start_date=current_date, interval=7, type="past", keys=('year','month','day','mins'))
		print data
		data = json.loads(data)
		days = 0
		for i in range(0,7):
		   if goal == 'StepGoal':
			   summary = summary + data[i]['steps']
		   else:
			   if data[i]['mins'] != 0:
				  summary = summary + data[i]['mins']
		   days = days + 1
		print "Summary for goal %s: %d" % (goal,summary)
		average = summary / days				 
		return average, days   

	def get_daily_fitbit_summary(self, goal, personis_um):
		summary = 0
		import datetime
		today = datetime.datetime.now()
		current_date = date(today.year, today.month, today.day)
		average = 0
		if goal == 'StepGoal':
		   data = self.resolver_fitbit(personis_um, form='steps', start_date=current_date, interval=7, type="past", keys=('year','month','day','steps'))
		elif goal == 'ModerateActivityGoal':
		   data = self.resolver_fitbit_activity_level(personis_um, form='activity_level', level=2, start_date=current_date, interval=7, type="past", keys=('year','month','day','mins')) 
		elif goal == 'IntenseActivityGoal':
		   data = self.resolver_fitbit_activity_level(personis_um, form='activity_level', level=3, start_date=current_date, interval=7, type="past", keys=('year','month','day','mins'))
		return summary  
 
	def thread_test(self):
		import threading, time
		print "I m running"
		threading.Timer(300, thread_test).start() 
