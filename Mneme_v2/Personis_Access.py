#!/usr/bin/env python
#



import os, sys

#import Personis
#import Personis_base
#import Personis_a
#from Personis_util import printcomplist
from personis import client

#Time, date, timezone
from datetime import datetime, date, time, timedelta
import time

import string
#Apps model
from AppList import *

modeltree = []
global index
index = 0
class model_tree(object):
	def __init__(self,name="",parent="",child=[],level=0,expand=False):
		self.name = name
		self.parent = parent
		self.children = child
		self.expand = expand
		self.level = level
		self.visited = 0
		
class goals_set(object):
	def __init__(self, name, target, days_a_week, show_chart, time_passed, time_left, days_target_valid, days_target_met):
		self.name = name
		self.target = target
		self.days_a_week = days_a_week
		self.show_chart = show_chart
		self.time_passed = time_passed
		self.time_left = time_left
		self.days_target_met = days_target_met
		self.days_target_valid = days_target_valid
		
class Personis_Access(object):

	# initialise personis um object and access to the server
	def __init__(self, connection):
		self.connection = connection

		self.um = client.Access(connection = self.connection)
		
		#self.um = client.Access(uri = uri, credentials = credentials, http = ht)

		# modelfile = "saved-model"
		#print "importing:", modelfile
		#modeljson = open(modelfile).read()
		#self.um.import_model(partial_model=modeljson)

		#self.make_new_component('log-in','attribute', 'string',None,'None')
		#self.make_new_component('browseractivity','attribute', 'string',None,'None')


	# adding new component to the context (default 'Personal')
	def make_new_component(self, cname, ctype, value=None, res=None, desc=None, context=['Personal']):
		try:
			cobj = client.Component(Identifier=cname, component_type=ctype, Description=desc, value_type=value, resolver=res)
			self.um.mkcomponent(context=context, componentobj=cobj)
			print "Created component ", cname
			return True
		except Exception, e:
			print e
			return str(e)

	# adding new view to the model to the component list of context 'People'

	def make_new_view(self, vname, context, vcomplist):
		vobj = client.View(Identifier=vname, component_list=vcomplist)
		print "view:", vname
		self.um.mkview(context=context, viewobj=vobj)


	# adding new evidence to component
	def add_evidence(self, context=[], component=None, value=None, comment=None, usertime=None,flags=[]):
		print "Component type %s" % type(component)
		print "Component %s, Value %s" % (component,value)
		ev = client.Evidence(source="Personis_Access.py", evidence_type="explicit", value=value,flags=flags)
		ev.comment = comment
		if usertime:
			import time
			#if not usertime.time():
			#	ev.time=time.mktime(time.strptime(usertime, '%Y-%m-%d'))
			#else:	
			ev.time=time.mktime(time.strptime(usertime, '%Y-%m-%d %H:%M:%S'))
		self.um.tell(context=context, componentid=component, evidence=ev)


	def make_new_context(self,context_id,desc,context):
		try:
			ctx_obj = client.Context(Identifier=context_id,
											Description=desc,
											perms={'ask':True, 'tell':True, "resolvers":["all","last10","last1","goal"]},																						   resolver=None, objectType="Context")

			print "Creating new context %s"%context_id
			self.um.mkcontext(context,ctx_obj)
			return "Success"
		except Exception,e:
			print e
			return e


	#-----Adding a component called access record associated to each context and component-----------#

	def set_access_records(self):
		dir_list, main_dirs = self.get_context_list()
		for dirs in main_dirs:
			print dirs
		for d in dir_list:
			print d['dir']
			context_list = d['dir'].split('/')
			self.make_new_component(self.um, "access",'attribute', 'string',None,'None',context_list)

	#----------Creating Application context: Apps model----------------#

	def create_app_context(self):
		try:
			ctx_obj = client.Context(Identifier="Apps",
											Description="Applications available for use",
											perms={'ask':True, 'tell':True, "resolvers":["all","last10","last1","goal"]},																						   resolver=None, objectType="Context")
			context = []
			context.append('.')
			print "Creating Applications context "
			self.um.mkcontext(context,ctx_obj)
			return True
		except Exception,e:
			return False

	#-------Accessing the um to ask components and view evidence list

	def all_access_model(self, cont):
		context_list = []
		try:
			info = self.um.ask(context=cont, showcontexts=True)
			(cobjlist, contexts, theviews, thesubs) = info
			#printcomplist(cobjlist, printev = "yes")
			print "Components:"
			for cobj in cobjlist:
				print "\t%s: %s"%(cobj.Identifier, cobj.Description)
			print "Contexts: %s" % str(contexts)
			print "Views: %s" % str(theviews)
			print "Subscriptions: %s" % str(thesubs)

			for dirs in contexts:
				context_list.append(dirs)
			return context_list
		except ValueError, e:
			err_msg = "ask failed: %s" % (e)
			return err_msg


	def get_all_component(self, context=[]):
		try:
			if(context):
				info = self.um.ask(context=context,view=None,resolver=None,showcontexts=True)
				cobjlist,contexts,view,subs = info
				print info
				for t in contexts:
					print "Context: %s" % t
				new_cobjlist = list()
				for c in cobjlist:
					print "Component: %s" % c.Identifier
					#if c.Identifier[0] != '@':
					new_cobjlist.append(c)
				return contexts, new_cobjlist
		except Exception,e:
			print e
			return str(e),str(e)


	def todict(self, obj, classkey=None):
		if isinstance(obj, dict):
			for k in obj.keys():
				obj[k] = self.todict(obj[k], classkey)
			return obj
		elif hasattr(obj, "__iter__"):
			return [self.todict(v, classkey) for v in obj]
		elif hasattr(obj, "__dict__"):
			data = dict([(key, self.todict(value, classkey))
			  for key, value in obj.__dict__.iteritems()
			  if not callable(value) and not key.startswith('_')])
			if classkey is not None and hasattr(obj, "__class__"):
				data[classkey] = obj.__class__.__name__
			return data
		else:
			return obj

	#cur_level = 0
	def expand_model(self, context_name, context, cur_level):
		global index
		info = self.um.ask(context=context,view=None,resolver=None,showcontexts=True)
		cobjlist,subcontexts,view,subs = info
		parent = '_'.join(context)
		print parent
		if len(subcontexts) == 0:
			modeltree.append(model_tree(context_name,parent=parent,child=subcontexts,level=cur_level,expand=False))
			return
		else:
			modeltree.append(model_tree(context_name,parent=parent,child=subcontexts,level=cur_level,expand=True))
			for i in range(len(sorted(subcontexts))):
				cur_level += 1
				context.append(subcontexts[i])
				self.expand_model(subcontexts[i],context,cur_level)
				context.remove(subcontexts[i])
				cur_level -= 1

	def build_modeldef_tree(self):
		del modeltree[:]

		context = []
		info = self.um.ask(context=context,view=None,resolver=None,showcontexts=True)
		cobjlist,contexts,view,subs = info
		#index = len(contexts)
		for i in range(len(sorted(contexts))):
			context = []
			context.append(contexts[i])
			cur_level = 0
			self.expand_model(contexts[i], context, cur_level)
			#context.remove(contexts[i])

		return modeltree

	def get_context(self, context=['Personal'], getSize=True):
		try:
			print context, getSize
			contextinfo = self.um.getcontext(context=context, getsize=getSize)
			return contextinfo
		except Exception, e:
			#print e
			return str(e)

	def get_evidence_new(self, context=['Personal'], componentid='firstname',resolver={'evidence_filter':"all"}):
		try:
			print context,componentid
			info = self.um.ask(context=context,view=None,resolver=resolver,showcontexts=True)
			cobjlist,contexts,view,subs = info
			evdlist = list()
			for c in cobjlist:
				if c.Identifier == componentid:
					if c.evidencelist:
						for item in c.evidencelist:
							#print item.value
							evdlist.append(item)

			return evdlist
		except Exception,e:
			print e
			return e

	def getpermission(self, context, app):
		perms = self.um.getpermission(context=["Devices"], app=app)
		return perms

	#get todays date and time

	def get_date(self):
		try:
			t = datetime.now()
			print t
			EpochSeconds=time.mktime(t.timetuple())
			#now = datetime.fromtimestamp(EpochSeconds, pytz.utc )
			#now = now.astimezone(pytz.timezone('Australia/Sydney'))
			print "Now %s"%now
			return now
		except Exception, e:
			return e

	def um_applist(self):
		return self.um.listapps()


	#add new evidence

	def add_new_evidence(self,context, data=None):
		try:
			print data, context
			componentid,value,flags,comment,user_date,useby_date =data.split("_")
			context = context.split("/")
			ev = client.Evidence(source=self.username, evidence_type="explicit", value=value)
			if comment != 'None': ev.comment=comment
			if flags != 'None': ev.flags = flags
			if user_date != 'None': ev.time=time.mktime(time.strptime(user_date, '%d/%m/%Y'))
			if useby_date != 'None': ev.useby=time.mktime(time.strptime(useby_date, '%d/%m/%Y'))
			self.um.tell(context=context, componentid=componentid, evidence=ev)
			return True
		except Exception,e:
			return False

	#---------------------- Functions for deletion -------------------------------------#

	def delete_component(self, context, component):
		resd = self.um.delcomponent(context, component)
		return resd

	def delete_context(self, context):
		if self.um.delcontext(context):
			print context
			return "ok"
		else:
			return "fail"

	def delete_view(self, context, viewid):
		try:
			self.um.delview(context, viewid)
			return "ok"
		except Exception, e:
			return "fail:"+str(e)

	#---------------------- Functions for subscription or rules -------------------------------------#

	def add_rules(self, context, feedback_type, feedback_freq, start_day, start_date):
		week_day = ["sunday", "monday","tuesday","wednesday","thursday","friday","saturday"]
	   
		date1 = (start_date + timedelta(days = 15)).day
		date2 = (start_date + timedelta(days = 30)).day
		
		
		context_str = "/".join(str(ctx) for ctx in context)
		if feedback_freq == "hour":
			cron = '["0 * * * *"]' 
		elif feedback_freq == "day":
			cron = '["0 0 * * *"]' 
		elif feedback_freq == "week":
			cron = '["0 0 * *'+week_day.index(start_day)+'"]' 
		elif feedback_freq == "fortnight":
			cron = '["0 0 1,15 * *"]' 
		elif feedback_freq == "month":
			cron = '["0 0 1 * *"]' 
			

		if feedback_type != "no email":	
			try:
				sub = """"""+cron+""" <default!./"""+context_str+"""/target_value> ~ '.*' : NOTIFY 'http://vm1-chai2.cs.usyd.edu.au:2001/send_mail?goal_type="""+context[-1]+"""'"""
				#sub = """<./Goals/Health/StepGoal/target_value> ~ '.*' : NOTIFY 'http://vm1-chai2.cs.usyd.edu.au:2001/test_sub'"""
				appdetails = self.um.registerapp(app="MyEmailSubscription", desc="Subscription for sending feedback email", password="pass9")
					  
				self.um.setpermission(context=context, app="MyEmailSubscription", permissions={'ask':True, 'tell':True})
				perms = self.um.getpermission(context=context, app="MyEmailSubscription")
				print "New Email App:", perms
		
				result = self.um.subscribe(context=context, view=['target_value'], subscription={'user':'MyEmailSubscription', 'password':'pass9', 'statement':sub})
				print "Result from subscription", result
			except Exception,e:
				print "Error while setting subscription"
		else:
			print "Not supported yet...WIP"
			
		
	def add_sensor_rules(self, context):
		context_str = "/".join(str(ctx) for ctx in context)
		sub = """["*/30 * * * *"] <default!./"""+context_str+"""/@fitbit_access_token> ~ '.*' : NOTIFY 'http://vm1-chai2.cs.usyd.edu.au:2001/run_sensor_apps'"""
		#sub = """<./Goals/Health/StepGoal/target_value> ~ '.*' : NOTIFY 'http://vm1-chai2.cs.usyd.edu.au:2001/test_sub'"""
		appdetails = self.um.registerapp(app="MySensorSubscription", desc="My Subscription for making api calls to extract sensor data", password="pass1")
			  
		self.um.setpermission(context=context, app="MySensorSubscription", permissions={'ask':True, 'tell':True})

		result = self.um.subscribe(context=context, view=['@fitbit_access_token'], subscription={'user':'MySensorSubscription', 'password':'pass1', 'statement':sub})
		
		print "Result from subscription",result

		
	#---------------------- Functions for resolvers -------------------------------------#
	
	def myresolver(component=None, context=None, resolver_args=None):
		print "new resolver called with ", `component`
		if resolver_args == None:
		   ev_filter = None
		else:
		   ev_filter = resolver_args.get('evidence_filter')
		component.evidencelist = component.filterevidence(model=model, context=context, resolver_args=resolver_args)
		if len(component.evidencelist) > 0:
		   component.value = component.evidencelist[-1]['value']
		return component
	
	#self.um.setresolver(context = ['Device','Fitbit','Activity'],component='steps',resolver = 'myresolver')
	

	#---------------------- New Functions for apps and goals -------------------------------------#
	def get_days_in_between(self,value):
		value = value.split(' ');
		 
		if string.find(value[1],'week') != -1:
			return 7 * string.atoi(value[0])
		elif string.find(value[1],'month') != -1:
			return 30 * string.atoi(value[0])
		else:
			return 7

	def check_installed_plugins(self):
		try:
		  contextlist = self.all_access_model(cont=["Devices"])
		except Exception,e:
		  print "Devices not found error",e
		try:
		  contextlist2 = self.all_access_model(cont=["Apps"])
		except Exception,e:
		  print "Apps not found error",e							
		contextlist = contextlist + contextlist2
		return contextlist
			
	def check_goals(self):
		"""
		try:
		  contextlist = self.all_access_model(cont=["Devices"])
		except Exception,e:
		  print "Devices not found error",e
		try:
		  contextlist2 = self.all_access_model(cont=["Apps"])
		except Exception,e:
		  print "Apps not found error",e							
		contextlist = contextlist + contextlist2
		"""
		goalcontext = ['Goals','Health'] 
		goalcontext_obj = self.all_access_model(cont=goalcontext)
		print goalcontext_obj
		import datetime
		today = datetime.datetime.now()
		current_date = date(today.year, today.month, today.day)
		app_goal_list = list()
		goal_list = ["CurrentLevelGoal","StepGoal","ModerateActivityGoal","IntenseActivityGoal","AvoidInactivityGoal"]
		for g in goal_list:				   
			if g in goalcontext_obj:
			   goalcontext.append(g)
			   show_chart = 0
			   
			   #---Get the target value 
			   goal_target_val = self.get_evidence_new(context = goalcontext, componentid="target_value")
			   print goal_target_val
			   try:
				   if goal_target_val:
					 goal_target_v = (goal_target_val[-1].value).split(' ')[0]
				   else:
					 goal_target_v = "none"
			   except Exception,e:
				   print e	
			   
			   #--Find out how many times in a week you are following the goal
			   goal_target_freq = self.get_evidence_new(context = goalcontext, componentid="target_frequency")
			   if goal_target_freq:
				   goal_target_f = (goal_target_freq[-1].value).split(' ')[0]
			   else:
				   goal_target_f = "none"			   
			   
			   #--Find out when the goal was set
			   goal_startdate = self.get_evidence_new(context=goalcontext, componentid="goal_startdate")
			   
			   #--How many days in between the goal set date 
			   goal_duration = self.get_evidence_new(context=goalcontext, componentid="goal_duration")
			   if goal_duration[-1].value == "no change":
			   	  for dd in goal_duration[::-1]:
			   	  	 if dd.value != "no change":
			   	  	 	betweendays = self.get_days_in_between(dd.value)
			   	  	 	break
			   else:
			      betweendays = self.get_days_in_between(goal_duration[-1].value)

			   #---Get the date when the goal is set and how many days have been passed
			   #start_time = time.localtime(int(goal_startdate[-1].creation_time))
			   
			   start_time = time.mktime(time.strptime(goal_startdate[-1].value, '%d/%m/%Y'))
			   start_time = time.localtime(int(start_time))
			   goal_start_date = date(start_time[0], start_time[1], start_time[2])
			   print "This goal is set on ", goal_start_date
			   print "This goal will go for", goal_duration[-1].value
			   days_passed = (current_date - goal_start_date).days

			   #---Get the date when the goal will end
			   goal_end_date = goal_start_date + timedelta(days = betweendays)							  
			   
			   #--Find out whether the goal is still on. If it is still on, then show the chart and check how many days left. Beacuse there might be data from previous goal.
			   
			   days_left = 0
			   days_target_needed_to_be_met = 0 
			   days_target_met = 0
			   if goal_end_date >= current_date:
				  show_chart = 1
				  days_left =  (goal_end_date - current_date).days

			   email_id = self.get_evidence_new(context = ['Personal'], componentid="email")
			   if email_id[-1].value == "alexoneweek.personis@gmail.com" and g == "CurrentLevelGoal":
				  days_passed = 5
				  days_left = 2
				  show_chart = 1
				  days_target_needed_to_be_met = 0
				  days_target_met = 0
				  
			   if email_id[-1].value == "alexoneweek.personis@gmail.com" and g == "StepGoal":
				  days_passed = 0
				  days_left = 12 * 7
				  days_target_needed_to_be_met = 0
				  days_target_met = 0
				  
			   if email_id[-1].value == "alexonemonth.personis@gmail.com" and g == "CurrentLevelGoal":
				  days_passed = 7
				  days_left = 0
				  show_chart = 0
				  days_target_needed_to_be_met = 0
				  days_target_met = 0
				  
			   if email_id[-1].value == "alexonemonth.personis@gmail.com" and g == "StepGoal":
				  days_passed = 25
				  days_left = 9 * 7 + 3
				  show_chart = 1
				  #if goal_target_val[-1].flags[0] == "New": 	
				  days_target_needed_to_be_met = 17
				  days_target_met = 14
				  #elif goal_target_val[-1].flags[0] == "Revised": 
				  #	 days_target_needed_to_be_met = 0 
				  #	 days_target_met = 0
				  
			   if email_id[-1].value == "alexoneyear.personis@gmail.com" and g == "CurrentLevelGoal":
				  days_passed = 7
				  days_left = 0
				  show_chart = 0

			   if email_id[-1].value == "alexoneyear.personis@gmail.com" and g == "StepGoal":
				  days_passed = 11 * 7 + 2
				  days_left = 5
				  show_chart = 1
				  #if goal_target_val[-1].flags[0] == "New": 
				  days_target_needed_to_be_met = 11 * 7 + 2
				  days_target_met = 70
			   
			   print "Days:::",days_passed, days_left      
			   new_goal = goals_set(g, goal_target_v, goal_target_f, show_chart, days_passed, days_left, days_target_needed_to_be_met, days_target_met) 
			   
			   app_goal_list.append(self.todict(new_goal, new_goal.name))
			   goalcontext.remove(g)				
		"""	   
		for cont in contextlist:
			if cont == "inactivity_monitor":
			   app_goal_list.append(["inactivity_monitor","CurrentLevelGoal","InactivityGoal"]) 
			elif cont == "Fitbit":
			   ft_goal_list = list() 
			   ft_goal_list.append("Fitbit")
			   goal_list = ["CurrentLevelGoal","StepGoal","ModerateActivityGoal","IntenseActivityGoal"]
			   for g in goal_list:				   
				  if g not in goalcontext:
					 ft_goal_list.append(g)   
			   app_goal_list.append(ft_goal_list)
			else:
			   oth_goal_list = list() 
			   oth_goal_list.append(cont)
			   app_goal_list.append(oth_goal_list)			
			   #return ["Fitbit","CurrentGoal","StepGoal","ModerateActivityGoal","IntenseActivityGoal"]  
		"""			  
		if app_goal_list: 
			print app_goal_list
			return app_goal_list
		else:
			return None
	#------------------Deprecated Functions (not used)----------------------------------#

	#accessing the um to add personal components (firstname and lastname) and tell evidence
	def tell_model(self, modelname, username, fname, lname, sex, password):
		# create a new component
		# tell this as user's first name, last name and gender
		ev = client.Evidence(source=self.username, evidence_type="explicit", value=fname)
		self.um.tell(context=["Personal"], componentid='firstname', evidence=ev)
		ev = client.Evidence(source=self.username, evidence_type="explicit", value=lname)
		self.um.tell(context=["Personal"], componentid='lastname', evidence=ev)
		ev = client.Evidence(source=self.username, evidence_type="explicit", value=sex)
		self.um.tell(context=["Personal"], componentid='gender', evidence=ev)


	def tell_login_time(self, comp_id):

		try:
			import datetime
			time = datetime.datetime.now()
			ev = client.Evidence(source="build_model.py", evidence_type="explicit", value=time)
			self.um.tell(context=["Personal"], componentid=comp_id, evidence=ev)
		except Exception, e:
			print e
			return e


	def add_access_records(self,componentid=None):
		try:
			self.um = Personis.Access(connection = self.connection, debug=True)
			ev = client.Evidence(source="build_model.py", evidence_type="explicit", value=str(componentid))
			ev.comment = "Access Record for " + componentid
			context = self.__curContext.split('/')
			self.um.tell(context=context, componentid="access", evidence=ev)
			return "Success"
		except Exception,e:
			print e
			return "Error "+e


	def get_size(self):
		model = self.modelname.split('@')
		import subprocess
		ret = subprocess.call(["ssh", "chai@vm1-chai2", "python /home/chai/Personis-155/Personis/Src/getSize.py "+model[0]]);
		return ret

	def get_evidence_fitbit(context, componentid, start, end):
		evdlist = self.get_evidence_new(context, component)
		days_in_between = str(end - start).split(' ')
		interval = int(days_in_between[0])
		print interval
		margin = datetime.timedelta(days = interval)
		keys = ('date','steps')
		for ev in evdlist:
			#print datetime.datetime.fromtimestamp(int(ev.time)).strftime('%Y-%m-%d'), ev.value

			try:
				um_time = ev.time
				import datetime
				tt = time.localtime(int(um_time))
				track_date = date(tt[0],tt[1],tt[2])
				if start <= track_date <= end:
					#datetime.datetime.fromtimestamp(int(time)).strftime('%Y-%m-%d')
					if prev_date != track_date:
						if newval != 0:
							new_evdlist.append(newval)
							datelist.append(track_date)
							print "UM data on %s is %s"%(str(track_date), newval)
						newval = int(ev.value)

						prev_date = track_date
					else:
						newval = newval + int(ev.value)

			except Exception,e:
				print e
				return "Error: "+str(e)

			dict_data = []

			for i in range(len(new_evdlist)):
				tag_list=list()
				tag_list.append(datelist[i])
				tag_list.append(new_evdlist[i])
				data_dictionary = dict(itertools.izip(keys, tag_list))
				dict_data.append(data_dictionary)
		return dict_data
