#!/usr/bin/env python
#
#
# this program is using some code from Cherrypy and Personis tutorial

import os, sys


import httplib, oauth2
from optparse import OptionParser
import httplib2 

from oauth2client.file import Storage
from oauth2client.client import AccessTokenRefreshError, Storage, Credentials, OAuth2WebServerFlow
from oauth2client.tools import run

import cherrypy
import wsgiref.handlers
import ConfigParser

#Email
import email, rfc822
import cgi, cgitb
#from mail_header import ContactAddress
import string, operator

#Time, date, timezone
from datetime import datetime, date, time, timedelta
import time
import threading, random
#from pytz import timezone, tzfile
#import pytz

import webbrowser
import yaml

#Access Personis
from personis import client
#from Personis_Build_Model import *
from Personis_Access import *
from Personis_App_Manager import *
from Personis_Visualisation_Manager import *
#import Personis_util
import connection

from types import *

# For Apps
import fitbit, json
from AppList import *
import itertools
#from formencode import Schema, validators
#from Application import *
from Activity_Models import *
import pickle
from operator import attrgetter

import gviz_api
import random
from fitbit_plugin import *
from fitbitsensor import *	
from Queue import PriorityQueue
fname = ""
lname=""
password=""
people_list = list()
group_list = list()

#EPOCH = datetime.fromtimestamp(0)

ACCESS_TYPE = 'Server'

personis_um = None

#applist.append("MyLastFM")
applist = list()
um_applist = list()
um_appobjlist = list()
new_um_applist = list()
edit_cont = ""
email_address_list = list()
group_address_list = list()



from gntemplate import *
global genshi_tmpl
browser_activities=[]
def print_timing(func):
	def wrapper(*arg):
		t1 = time.clock()
		res = func(*arg)
		t2 = time.clock()
		print '%s took %0.3fms' % (func.func_name, (t2-t1)*1000.0)
		return res
	return wrapper

def write_log(mode,text):
	import datetime
	__time = datetime.datetime.fromtimestamp(int(time.time())).strftime("%a %b %d %H:%M:%S %Y")
	note = '['+__time+'] ['+mode+'] '+text+'\n'
	f = open('comment.log','a')
	f.write(note)
	f.close
	
import debug
debug.listen()
#Main page
class WelcomePage():

	#_cp_config = { 'tool.sessions.on': True }

	def __init__(self, oauthconf = None):
		self.oauthconf = yaml.load(file(oauthconf,'r'))

	@print_timing
	def index(self):
		curSession = 'Session 1'
		cherrypy.session['cur_session'] = curSession  

		write_log('notice','Welcome to Mneme')
		
		genshi_tmpl = LoadGenshiTemplate(curSession)
		return genshi_tmpl.welcome_template()
	index.exposed = True

	#----------------------------------Start Browsing functions--------------------------------------------------------#

	#get directories and subdirectories for context
	def get_context_list(self):
		directory = []
		keys = ('dir','subdir')
		main_um_dirs = list()
		context_list = []
		um = cherrypy.session.get('um')
		context_list = um.all_access_model()
		cherrypy.session['context_list'] = context_list
		for context in context_list:
			temp_list = list()
			subcontext, component = um.get_all_component(context_list);
			if subcontext:
				temp_list.append(context)
				temp_list.append(subcontext)
				data_dictionary = dict(itertools.izip(keys, temp_list))
				directory.append(data_dictionary)
		return directory,context_list

	# browse list of contexts
	@print_timing
	def browse(self,**data):
		try:
			um = cherrypy.session.get('um')
			#um.delete_context(["Devices","Fitbit"])
			#um.delete_context(["Goals","Health","StepGoal"])
			#um.delete_context(["Goals","Health","ModerateActivityGoal"])
			modeltree = browser_activities = []
			pluginlist = []
			uninstalled_list = ['Fitbit']
			#self.send_mail()
			
			if cherrypy.session.get('uninstalled_list'):
			   uninstalled_list = cherrypy.session.get('uninstalled_list')
						
			cur_action = "Browser"
			cherrypy.session['cur_action'] = cur_action
			if um != None: 
			   #browser_activities = um.get_evidence_new(context = ['Admin'], componentid = 'browseractivity')				
			   try:
				   modeltree = um.build_modeldef_tree()
			   except Exception,e:
				   print "Building model tree error", e	
			   try:
				   pluginlist = um.check_installed_plugins()
				   for app in pluginlist:
					   for un_app in uninstalled_list:
						   if un_app == app:
							   print app
							   uninstalled_list.remove(un_app) 
				   cherrypy.session['uninstalled_list'] = uninstalled_list					 
				   print "Plugins", pluginlist
				   print "Uninstalled plugins", uninstalled_list
			   except Exception,e:
				   print "Finding installed plugin error", e	
			   #try:
			   #	print "Sending email"
			   #	print self.send_mail()
			   #except Exception,e:
			   #	print "Mail error",e				
			   #print "Plugin list length:%d is %s"% (len(pluginlist),str(pluginlist[0])) 
			   #----- Testing 
			   #um.delete_context(["Goals","Health","CurrentGoal"])
			   #um.delete_context(["Goals","Health","StepGoal"])
			   #um.delete_context(["Goals","Health","ModerateActivityGoal"])
			   #um.delete_context(["Goals","Health","IntenseActivityGoal"])  
			   #um.delete_context(["Devices","Fitbit"])
			   #-------											   
			print "User name:",cherrypy.session.get('username')   
			genshi_tmpl = LoadGenshiTemplate(cherrypy.session.get('cur_session'), cherrypy.session.get('username'), browser_activities)
			email_id_list = list()
			if type(modeltree) is ListType:
			   write_log('notice','Browser Clicked: Operation Successful')
			   modeltree = sorted(modeltree, key=attrgetter('level', 'name'))
			   cherrypy.session['modeltree'] = modeltree
			   try:
				  email_id_list = um.get_evidence_new(context=['Personal'],componentid='email')
				  email_id = email_id_list[-1].value
				  print len(email_id_list),email_id_list[-1].value
				  print modeltree, pluginlist
				  if len(pluginlist) != 0:
					  cherrypy.session['pluginlist'] = pluginlist
				  
				  
				  return genshi_tmpl.browse_template(ACCESS_TYPE, modeltree, cherrypy.session.get('username'),email_id, pluginlist, uninstalled_list)
			   except Exception,e:
				  print "Email not found for error: ",e				  
				  return genshi_tmpl.greeting_template(e,"Browse",modeltree)							
			else:
			   e = modeltree
			   write_log('error','Browser Clicked: Operation Failed; Error:'+str(e))
			   return genshi_tmpl.greeting_template(e,"Browse",modeltree)
		except Exception, e:
			genshi_tmpl = LoadGenshiTemplate(cherrypy.session.get('cur_session'))
			write_log('error','Browser Clicked: Operation Failed; Error:'+str(e))
			print "Browse error", e
			return genshi_tmpl.greeting_template(e,"Browse")
			
	browse.exposed = True


	@print_timing
	def get_prev_context(self):
		try:
			cur_context = cherrypy.session.get('cur_context')
			context_list = cur_context.split('/')
			#print context_list
			prev_context = '/'.join([str(x) for x in context_list[:-1]])
			#print prev_context

			write_log('notice','Get previous operation successful')

			if len(prev_context) == 0:
				return "Main"
			return prev_context

		except Exception,e:
			#print e
			write_log('error','Get previous context Operation Failed; Error:'+str(e))
			return "Error"
	get_prev_context.exposed = True

	#@print_timing
	def get_sub_context(self,context=None):
		um = cherrypy.session.get('um')
		print "Look for context: %s" %context
		try:
			#context_list = context_list.rstrip('')
			context_list = context.split('/')
			#print context_list
			newlist = []
			contexts,components = um.get_all_component(context_list);
			print contexts
			if type(contexts) is ListType:
				for sub in contexts:
					context_list.append(sub)					
					subcontexts,components = um.get_all_component(context_list);
					if subcontexts:
						print "Sub context is found for"+sub
						context_list.remove(sub)
						contexts.remove(sub)
						sub += ":expand"
						newlist.append(sub)
					else:
						print "Sub context is not found for"+sub
						context_list.remove(sub)
				print "--Contexts that have children--"
				print newlist		
				contexts = contexts + newlist
				subcontext = json.dumps(contexts)
				write_log('notice','Get all subcontext successful')
				#print subcontext
				return subcontext

			else:
				return []

		except Exception,e:
			print e
			write_log('error','Get previous context Operation Failed; Error:'+str(e))
			return []

	get_sub_context.exposed = True

	
	# browse list of sub-contexts and components
	#@print_timing
	def show_sub_context(self,context=None):
		um = cherrypy.session.get('um')
		#browser_activities = um.get_evidence_new(context = ['Admin'], componentid = 'browseractivity')

		t1 = time.clock()
		print context
		
		cherrypy.session['cur_context'] = context

		udata = context.decode("utf-8")
		context = udata.encode("ascii","ignore")
		context_list = context.split('/')
		modeltree = cherrypy.session.get('modeltree')
		
		genshi_tmpl = LoadGenshiTemplate(cherrypy.session.get('cur_session'), cherrypy.session.get('username'), browser_activities)
		try:
			#contexts, components = self.personis_um.all_access_model(context_list);
			contexts,components = um.get_all_component(context_list);
			print contexts
			if type(contexts) is ListType:
				t2 = time.clock()
				print 'show_subcontext took %0.3fms' % ((t2-t1)*1000.0)
				write_log('notice','Subdirectories Clicked: operation successful')
				for item in modeltree:
					if item.name == context_list[0]:
						item.visited = 1
					else:
						item.visited = 0
				return genshi_tmpl.browse_sub_elements(context, "", sorted(contexts), sorted(components,key=operator.attrgetter('Identifier')),modeltree)
			else:
				e = contexts
				write_log('error','Subdirectories Clicked: Operation Failed; Error:'+str(e))
				return genshi_tmpl.greeting_template(e, "Browse", modeltree)

		except Exception,e:
			#print e
			write_log('error','Sub browser Clicked: Operation Failed; Error:'+str(e))
			return genshi_tmpl.greeting_template(e, "Browse", modeltree)
	show_sub_context.exposed = True

	def get_component_list(self,context=None):
		um = cherrypy.session.get('um')
		data = []
		print context
		curComponent = ""
		cherrypy.session['cur_context'] = context
		udata = context.decode("utf-8")
		context = udata.encode("ascii","ignore")
		context_list = context.split('/')
		#print context_list
		try:
			contexts,components = um.get_all_component(context_list)
			if type(contexts) is ListType:
				for con in contexts:
					data.append(con)
				for comp in components:
					data.append(self.todict(comp, comp.Identifier))

				write_log('notice',' Get component list operation successful')

				return json.dumps(data)
		except Exception,e:
			#print e
			modeltree = cherrypy.session.get('modeltree')
			write_log('error','Get component list Operation Failed; Error:'+str(e))
			return genshi_tmpl.greeting_template(e, "Browse", modeltree)

	get_component_list.exposed = True

	# get current component
	def get_component(self, componentid=None):
		cherrypy.session['cur_component'] = componentid
		#print componentid
		return "Success"
	get_component.exposed = True

	# upload jqrid table with evidencelist
	def users_json(self, rows=None, sidx=None, _search=None, searchField=None,
		searchOper=None, searchString=None, page=None, sord=None, nd=None): # 1 line
		"""Returns all users from test_data in a json format that's compatible with jqGrid.""" # 2 lines
		t1 = time.clock()
		header = ["value", "flags", "source", "evidence_type", "creation_time", "time", "useby", "owner", "comment"] # 3 lines
		reslist = []
		genshi_tmpl = LoadGenshiTemplate(cherrypy.session.get('cur_session'), cherrypy.session.get('username'))
		cur_component = cherrypy.session.get('cur_component')
		cur_context = cherrypy.session.get('cur_context')		
		if cur_component != 'None':
			#print "getting new"
			context = cur_context.split()
			um = cherrypy.session.get('um')
			reslist = um.get_evidence_new(context, cur_component)
			cherrypy.session['cur_component'] = 'None'
		else:
			#print "getting default"
			um = cherrypy.session.get('um')
			cherrypy.session['cur_component'] = 'firstname'
			reslist = um.get_evidence_new()

		#users_list = test_data_to_list(test_data) # 4 lines
		evdlist = []
		i = 0
		#{'comment': None, 'evidence_type': 'explicit', 'creation_time': 1322914468.889158, 'value': 'Bob',
		#'source': 'Jane', 'flags': [], 'time': None, 'owner': 'Jane', 'objectType': 'Evidence', 'useby': None}
		myEvd = []

		if type(reslist) is ListType:
			for res in reslist:
				print "Inside user_json "
				myEvd = [0]*10
				myEvd[0] = i
				for key, value in res.__dict__.items():
				#print "%s:%s"%(key, value)
					for item in header:
						if item == key:
						#print "key: %s %s--"%(item,key)
							if key == 'creation_time' or key == 'time' or key == 'useby':
								if value:
									import datetime
									value = datetime.datetime.fromtimestamp(int(value)).strftime('%d/%m/%Y %H:%M:%S')
							elif key == 'flags':
								if value:
									value = ''.join(value)
								else:
									value="None"
							__index = header.index(item)
							#print "%s in %d" %(value,__index+1)
							myEvd[__index+1]=value
				evdlist.append(myEvd)
				i = i+1
				#print "Evidence: %d" %i
				#for val in myEvd:
				#	print val

			import my_jqGrid
			result_page = my_jqGrid.jqgrid_json(self, evdlist, header, rows=rows, sidx=sidx, _search=_search,
			searchField=searchField, searchOper=searchOper, searchString=searchString, page=page, sord=sord)

			t2 = time.clock()
			print 'user-json took %0.3fms' % ((t2-t1)*1000.0)
			write_log('notice','Show evidence list operation successful')

			return result_page

		else:
			#print reslist
			e = reslist
			write_log('error','Show evidence list Operation Failed; Error:'+str(e))
			modeltree = cherrypy.session.get('modeltree')
			return genshi_tmpl.greeting_template(e, "Evidencelist upload", modeltree)
	users_json.exposed = True

	#add new evidence to the model
	def add_new_evidence(self,data=None):
		#show_id = request.GET.get('name')
		res = ""
		t1 = time.clock()
		um = cherrypy.session.get('um')
		try:
			#print data
			udata = data.decode("utf-8")
			data = udata.encode("ascii","ignore")
			cur_context = cherrypy.session.get('cur_context')

			if um.add_new_evidence(cur_context, data):
				res = """ Successfully added"""
				write_log('notice','Add new evidence operation successful')

			else:
				res = """Failed to add"""
				write_log('error','Show evidence list Operation Failed; Error:'+str(res))

		except Exception, e:
			#print e
			res = """Failed to add""" + str(e)
			write_log('error','Add new evidence Operation Failed; Error:'+str(e))

		t2 = time.clock()
		print 'add_new_evidence took %0.3fms' % ((t2-t1)*1000.0)
		return res
	add_new_evidence.exposed  = True

	def add_new_element(self,data):
		print data
		data = data.split('_')
		cur_context = cherrypy.session.get('cur_context')
		if cur_context:
			context = cur_context.split('/')
		else:
			context = []
		print context				
		um = cherrypy.session.get('um')
		desc = data[3]
		print desc 
		if data[0] == 'component':
			try:
				um.make_new_component(data[2],'attribute', 'string',None,desc,context)
				write_log('notice','Add new component operation successful')

				return "%s" % (cur_context)
			except Exception,e:
				print e
				write_log('error','Add new component Operation Failed; Error:'+str(e))

				return "Error in operation. Creation failed as %s" % str(e)
		elif data[0] == 'context':
			try:
				res = um.make_new_context(data[1],data[2],context)
				if res == "Success":
					context.append(data[1])
					write_log('notice','Add new context operation successful')
					um.make_new_component(data[2],'attribute', 'string',None,desc,context)
					write_log('notice','Add new component operation successful') 
					return "%s" % (cur_context)
				else:
					write_log('error','Add new context Operation Failed; Error:'+str(res))
					return "Error in operation. Creation failed as %s" % res
			except Exception,e:
				print e
				write_log('error','Add new context Operation Failed; Error:'+str(e))

				return "Error in operation. Creation failed as %s" % str(e)
		else:
			print "Unrecognised Element"
			write_log('error','Add new element Operation Failed; Error:Unrecognised Element')

			return "Error: Unrecognised Element"
	add_new_element.exposed = True


   #-------------------------------------End Of Browseing functions------------------------------------------------------#

   #----------------------------------Start Application functions--------------------------------------------------------#
	@print_timing
	def apps_plugin(self):
		# Ask for the user's name.
		genshi_tmpl = LoadGenshiTemplate(cherrypy.session.get('cur_session'), cherrypy.session.get('username'))
		return genshi_tmpl.app_template()
	apps_plugin.exposed = True

	@print_timing
	def show_unreg_apps(self):
		um = cherrypy.session.get('um')
		print "Showing unregistered apps"
		cherrypy.session['cur_action'] = "Install Application Plugin"
		modeltree = um.build_modeldef_tree()
		modeltree = sorted(modeltree, key=attrgetter('level', 'name'))
		cherrypy.session['modeltree'] = modeltree
		#browser_activities = um.get_evidence_new(context = ['Admin'], componentid = 'browseractivity')
		genshi_tmpl = LoadGenshiTemplate(cherrypy.session.get('cur_session'), cherrypy.session.get('username') ,browser_activities)
		try:
			#context_list = self.personis_um.all_access_model()
			self.applist = cherrypy.session.get('appmgr').get_list_apps()		   
			write_log('notice','Show unregistered apps list operation successful')
			return genshi_tmpl.unreg_apps_template(self.applist, modeltree)

		except Exception, e:
			write_log('error','Show unregistered list Operation Failed; Error:'+str(e))
			return genshi_tmpl.greeting_template('Unregistered App load fails: '+str(e),"Unregistered Apps", modeltree)


	show_unreg_apps.exposed = True


	def register_app(self, data):
		t1 = time.clock()
		res = ""
		try:
			print "App install info: ",data
			#if 'nogoals' not in data:
			#	self.__setgoal = True
			#else:
			#	self.__setgoal = False
			
			self.applist = cherrypy.session.get('appmgr').get_list_apps()					   
			result = cherrypy.session.get('appmgr').register_app(data)

			if "Error" not in result:
				write_log('notice','Apps register operation successful')

				res = result
			else:
				res = "Error in opration "
				write_log('error','Apps register operation Failed; '+result)

		except Exception,e:
			print e
			write_log('error','Apps regsiter operation Failed; Error:'+str(e))

			res = "Error in opration "
		t2 = time.clock()
		print 'register_app took %0.3fms' % ((t2-t1)*1000.0)
		return res

	register_app.exposed = True

	def manage_app_data(self, data):
		t1 = time.clock()
		res = ""
		try:
			print "App manage info: ",data
			self.applist = cherrypy.session.get('appmgr').get_list_apps()					   
			result = cherrypy.session.get('appmgr').manage_app_data(data)

			if "Error" not in result:
				write_log('notice','Apps data store preferences operation successful')
				res = result
			else:
				res = "Error in opration "
				write_log('error','Apps  data store preferences operation Failed; '+result)

		except Exception,e:
			print e
			write_log('error','Apps regsiter operation Failed; Error:'+str(e))

			res = "Error in opration "
		t2 = time.clock()
		print 'register_app took %0.3fms' % ((t2-t1)*1000.0)
		return res

	manage_app_data.exposed = True

	@print_timing
	def show_reg_apps(self):
		um = cherrypy.session.get('um')
		#browser_activities = um.get_evidence_new(context = ['Admin'], componentid = 'browseractivity')
		print cherrypy.session.get('username')
		#print "Showing registered apps"
		global stream
		genshi_tmpl = LoadGenshiTemplate(cherrypy.session.get('cur_session'), cherrypy.session.get('username'), browser_activities)
		modeltree = cherrypy.session.get('modeltree')
		try:
			new_um_applist =cherrypy.session.get('appmgr').get_register_applist()
			#print new_um_applist
			if type(new_um_applist) is ListType:

				write_log('notice','Show registered apps list operation successful')

				return genshi_tmpl.reg_apps_template(new_um_applist)
			else:
				e = ", No installed app plugin has been found. Please install app or contact administrator."
				write_log('error','Show registered list Operation Failed; Error:'+str(e))

				return genshi_tmpl.greeting_template(e, "Show registered apps",self.modeltree)
		except Exception,e:
			err = ", An error occured during loading page. " + str(e) + "Please contact administrator."
			write_log('error','Show registered list Operation Failed; Error:'+str(e))

			return genshi_tmpl.greeting_template(err, "Show registered apps", modeltree)

	show_reg_apps.exposed = True

	def show_app_greeting(self):
		greeting = " Authorisation successful"
		modeltree = cherrypy.session.get('modeltree')
		return genshi_tmpl.greeting_template(greeting, "Show registered apps", modeltree)

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

	def get_unreg_app(self):
		#context_list = self.personis_um.all_access_model()
		data = []
		try:
			self.applist = cherrypy.session.get('appmgr').get_list_apps()
			print self.applist
			for app in self.applist:
				data.append(self.todict(app, app.appname))

			write_log('notice','Get unregistered apps list operation successful')

			return json.dumps(data)
		except Exception,e:
			write_log('error','Get unregistered apps list Operation Failed; Error:'+str(e))
			return json.dumps('Error:'+str(e))

	get_unreg_app.exposed = True

	def fitbit_authentication(self, oauth_token=None, oauth_verifier=None):
		#self.browser_activities = self.personis_um.get_evidence_new(context = ['Admin'], componentid = 'browseractivity')
		print "Hello Fitbit"
		um = cherrypy.session.get('um')
		#browser_activities = um.get_evidence_new(context = ['Admin'], componentid = 'browseractivity')
		genshi_tmpl = LoadGenshiTemplate(cherrypy.session.get('session'), cherrypy.session.get('username'), browser_activities)
		modeltree =  um.build_modeldef_tree()
		result = cherrypy.session.get('appmgr').complete_fitbit_install(oauth_verifier)
		#Add installation evidence to 'browseractivity' component
		if result == 'ok':

			write_log('notice','Fitbit authentication operation successful')
			
			#---- Fitbit is installed now extract last seven days data from fitbit
			#self.test_fitbit_installation('steps')
			
			self.test_fitbit_installation()
			um.add_sensor_rules(['Devices','Fitbit'])
			
			#---------- Testing options
			#thread = FitbitSensor()
			#thread.start()
			#import datetime
			#today = datetime.datetime.now()
			#end_date = date(today.year, today.month, today.day)
			#start_date = end_date-timedelta(days=2)
			#cherrypy.session.get('appmgr').get_minute_steps(start_date, end_date)
			
			#um.add_rules(context=['Device','Fitbit'])
			#
			#---------------
			
			#self.run_sensor_apps()
			redir = cherrypy.session.get('redirect')
		
			if redir == None:
				print "No redirect found"+str(redir)
				redir = '/browse/'
			raise cherrypy.InternalRedirect(redir)

		else:
			write_log('error','Fitbit authentication operation Failed; Error:'+str(result))

			return genshi_tmpl.greeting_template(result,"Message page",self.modeltree)
	fitbit_authentication.exposed = True
	
	def test_fitbit_installation(self):
		print "***Fitbit plugin installation testing in progress...***"
		import datetime
		today = datetime.datetime.now()
		current_date = date(today.year, today.month, today.day)
		um = cherrypy.session.get('um')	  
		  
		try:						  
		  cherrypy.session['fitbit'] = fitbit_plugin() 
		  access_token = cherrypy.session.get('fitbit').get_access_code(um)
 
 		  now = datetime.datetime.now()				
		  end_time = now.strftime("%H:%M")	
		  then = datetime.time(0,0,0)
		  start_time = then.strftime("%H:%M")
				   
		  stepcount_list = cherrypy.session.get('fitbit').process_apicall(access_token, current_date, start_time, end_time, "steps", True, um,None)
		  caloriecount_list = cherrypy.session.get('fitbit').process_apicall(access_token, current_date, start_time, end_time, "calories", True, um,None)
		  """
		  start_date = current_date-timedelta(days=2) 
		  
		  for i in range(0,2):
			  print "Fitbit data found on %s" %start_date			  
			  time_flag = False
			  stepcount_list = cherrypy.session.get('fitbit').process_apicall(access_token, start_date, None, None, "steps", time_flag, um)
			  cherrypy.session.get('fitbit').daily_summary_data(um,start_date)
			  start_date = start_date + timedelta(days=1) 

		  #cherrypy.session.get('fitbit').daily_summary_data(um,current_date)
		  stepcount_list = cherrypy.session.get('fitbit').process_apicall(access_token, current_date, None, None, "steps", time_flag, um)
		  caloriecount_list = cherrypy.session.get('fitbit').process_apicall(access_token, current_date, None, None, "calories", time_flag, um)
		  """	   
		  print "Fitbit testing successful"	
		  write_log('notice','Fitbit testing: Successful')		
		except Exception, e:
		  print "Error in testing: "+str(e)
		  write_log('error','Fitbit testing: Operation Failed; Error:'+str(e))

	def run_sensor_apps(self):
				
		print "*--------------Staring run sensor apps to add data to um-------------------*"
		import datetime,time
		today = datetime.datetime.now()
		current_date = date(today.year, today.month, today.day)
		um = cherrypy.session.get('um')	  
		#app_goallist = um.check_devices_and_goals()   
		try:  
		  write_log('notice','Making a Fitbit api call')	
		  #-----------Get fitbit access code									 
		  access_token = cherrypy.session.get('fitbit').get_access_code(um)
		  form = 'steps'
		  activity_key = 'activities-log-'+form+'-intraday' 
		  last_steps = um.get_evidence_new(context=['Devices','Fitbit','Activity'],componentid='steps')
		  last_calories = um.get_evidence_new(context=['Devices','Fitbit','Activity'],componentid='calories')
		  last_apicall_list = []
		  if last_calories and last_steps:
			 if last_calories[-1].time > last_steps[-1].time:
				last_apicall_list = last_calories
			 else:
				last_apicall_list = last_steps  
		  
		  if last_apicall_list:   
			 print "Api call list", last_apicall_list[-1].value
								 
			 #lasttime = datetime.mktime(int(last_apicall_list[-1].time)) + timedelta(minutes=1) 
			 lasttime = time.localtime(int(last_apicall_list[-1].time)) 
			 #lasttime = lasttime + timedelta(minutes=1)	
			 prevdate = date(lasttime[0],lasttime[1],lasttime[2])
			 if lasttime[4] < 59: prevtime = datetime.time(lasttime[3],lasttime[4]+1,lasttime[5])
			 else: prevtime = datetime.time(lasttime[3],lasttime[4],lasttime[5])
			 checktime = datetime.time(23,59,0)
			 print "Previous add date and time", prevdate, prevtime
			 creation_time = time.localtime(int(last_apicall_list[-1].creation_time))	
			 createddate = date(creation_time[0],creation_time[1],creation_time[2])
			 createdtime = datetime.time(creation_time[3],creation_time[4],creation_time[5])
			 
			 #if prevdate <= createddate:
			 #	 prevdate = createddate		 
			 
			 if prevdate == current_date:																
				print "last data added on today(%s) at %s for data on %s" %(prevdate, createdtime, prevtime)				  
				if createdtime > prevtime:
					start_time = createdtime.strftime("%H:%M")
				else:
					start_time = prevtime.strftime("%H:%M")							 
				now = datetime.datetime.now()				
				end_time = now.strftime("%H:%M")								

				stepcount_list = cherrypy.session.get('fitbit').process_apicall(access_token, current_date, start_time, end_time, form, True, um)
				caloriecount_list = cherrypy.session.get('fitbit').process_apicall(access_token, current_date, start_time, end_time, "calories", True, um)
				
			 elif prevdate < current_date:
				print "last data added on previously(%s) at %s" %(prevdate, prevtime) 
				if prevtime != checktime: 
				   then = datetime.time(23,59,0)
				   end_time = then.strftime("%H:%M")
				  
				   start_time = prevtime.strftime("%H:%M")  
				   stepcount_list = cherrypy.session.get('fitbit').process_apicall(access_token, prevdate, start_time, end_time, form, True, um)
				   caloriecount_list = cherrypy.session.get('fitbit').process_apicall(access_token, prevdate, start_time, end_time, "calories", True, um)

				   days_in_between = str(current_date - prevdate).split(' ') #--How many days left since you last scanned.				
				   interval = int(days_in_between[0])
				   
				   if interval > 1:
					  print "%d days have been passed since last scan "%interval
					  countdate = prevdate + timedelta(days=1)
					  for i in range(1,interval):	   
						  stepcount_list = cherrypy.session.get('fitbit').process_apicall(access_token, countdate, None, None, form, False, um)
						  caloriecount_list = cherrypy.session.get('fitbit').process_apicall(access_token, countdate, None, None, "calories", False, um)
						  countdate = countdate + timedelta(days=1)
				   print "%d days have been passed since last scan "%interval 
				   now = datetime.datetime.now()				
				   end_time = now.strftime("%H:%M")
				   then = datetime.time(0,0,0)
				   start_time = then.strftime("%H:%M")
				   stepcount_list = cherrypy.session.get('fitbit').process_apicall(access_token, current_date, start_time, end_time, form, True, um)
				   caloriecount_list = cherrypy.session.get('fitbit').process_apicall(access_token, current_date, start_time, end_time, "calories", True, um)
	   
			 
		  else:	 
			 now = datetime.datetime.now()				
			 end_time = now.strftime("%H:%M")	
			 then = datetime.time(0,0,0)
			 start_time = then.strftime("%H:%M")
				   
			 stepcount_list = cherrypy.session.get('fitbit').process_apicall(access_token, current_date, start_time, end_time, form, True, um)
			 caloriecount_list = cherrypy.session.get('fitbit').process_apicall(access_token, current_date, start_time, end_time, "calories", True, um)
		  write_log('notice','Successfully stored Fitbit minute data')		 
		except Exception,e:
		   print "Error in run sensor app", e		   
		   write_log('error','Error in run sensor app:'+str(e))
	run_sensor_apps.exposed = True		

	def check_plugins(self):
		um = cherrypy.session.get('um')
		exitFlag = 0
		goallist = um.check_goals()
		devices_apps = um.check_installed_plugins()
		 
		cherrypy.session['appgoal_list'] = goallist
		print "Goals" 
		print goallist
		if devices_apps:
			for item in devices_apps:
				print "Installed apps: ", item
				if item == 'Fitbit':
					print "Fitbit installed..get data"					   
					# create a fitbit plugin object
					cherrypy.session['fitbit'] = fitbit_plugin()
					#-- Run fitbit sensor installation test
					#self.test_fitbit_installation('steps')
					
					#---Temporarily commented out 
					#self.run_sensor_apps()
			
					#---Store fake data for user study			
					#self.run_fake_sensor()

					#------ Testing thread...not implemented				   
					#t = threading.Thread(target=process_fitbit,args=(um,cherrypy.session.get('fitbit'),60,))
					#t.start()
					#self.test_fitbit_installation('steps')
					#self.test_fitbit_installation('calories')
					#self.run_sensor_apps()
					#import fitbitsensor 
					#t = fitbitsensor.FitbitSensor(um,cherrypy.session.get('fitbit'))
					#t.start()
					#threading.Timer(300, t.start()).start()									  

			
		if goallist:
		   print json.dumps(goallist)
		   return json.dumps(goallist)
		else:		  
		   return None
	check_plugins.exposed = True  
	
	def run_fake_sensor(self):
		import datetime,time
		#today = datetime.datetime.now()
		#current_date = date(today.year, today.month, today.day)
		#current_date = current_date
		um = cherrypy.session.get('um')
		
		access_token = cherrypy.session.get('fitbit').get_access_code(um)
		
		"""
		current_date = date(2013,1,17)
		countdate = date(2012,2,22)
		interval = 2
	
		  
		for i in range(1,interval):	   
			stepcount_list = cherrypy.session.get('fitbit').process_apicall(access_token, current_date, None, None, "steps" , False, um, countdate)
			caloriecount_list = cherrypy.session.get('fitbit').process_apicall(access_token, current_date, None, None, "calories", False, um, countdate)
			countdate = countdate + timedelta(days=1)
			current_date = current_date + timedelta(days=1)
					
		#current_date = date(2013, 1, 18)
		#countdate = date(2012,3,1)
		#stepcount_list = cherrypy.session.get('fitbit').process_apicall(access_token, current_date, None, None, "steps" , False, um, countdate)
		#caloriecount_list = cherrypy.session.get('fitbit').process_apicall(access_token, current_date, None, None, "calories", False, um, countdate)
		"""
		"""
		#Week 1
		import datetime,time
		current_date = date(2013,1,19)
		countdate = date(2012,1,4)
		interval = 3
	  
		for i in range(1,interval):	   
			stepcount_list = cherrypy.session.get('fitbit').process_apicall(access_token, current_date, None, None, "steps" , False, um, countdate)
			caloriecount_list = cherrypy.session.get('fitbit').process_apicall(access_token, current_date, None, None, "calories", False, um, countdate)
			countdate = countdate + timedelta(days=1)
			current_date = current_date + timedelta(days=1)

		current_date = date(2013,1,21)
		countdate = date(2012,1,12)
		interval = 3

		for i in range(1,interval):	   
			stepcount_list = cherrypy.session.get('fitbit').process_apicall(access_token, current_date, None, None, "steps" , False, um, countdate)
			caloriecount_list = cherrypy.session.get('fitbit').process_apicall(access_token, current_date, None, None, "calories", False, um, countdate)
			countdate = countdate + timedelta(days=1)
			current_date = current_date + timedelta(days=1)

 		"""
 		"""
 		#week 2
 		current_date = date(2013,1,23)
		countdate = date(2012,3,1)
		stepcount_list = cherrypy.session.get('fitbit').process_apicall(access_token, current_date, None, None, "steps" , False, um, countdate)
		caloriecount_list = cherrypy.session.get('fitbit').process_apicall(access_token, current_date, None, None, "calories", False, um, countdate)

		current_date = date(2013,1,24)
		countdate = date(2012,3,12)
		interval = 7

		for i in range(1,interval):	   
			stepcount_list = cherrypy.session.get('fitbit').process_apicall(access_token, current_date, None, None, "steps" , False, um, countdate)
			caloriecount_list = cherrypy.session.get('fitbit').process_apicall(access_token, current_date, None, None, "calories", False, um, countdate)
			countdate = countdate + timedelta(days=1)
			current_date = current_date + timedelta(days=1)

		"""
		"""
		#Week 3
		current_date = date(2013,1,30)
		countdate = date(2012,3,7)
		stepcount_list = cherrypy.session.get('fitbit').process_apicall(access_token, current_date, None, None, "steps" , False, um, countdate)
		caloriecount_list = cherrypy.session.get('fitbit').process_apicall(access_token, current_date, None, None, "calories", False, um, countdate)

		current_date = date(2013,1,31)
		countdate = date(2012,12,5)
		stepcount_list = cherrypy.session.get('fitbit').process_apicall(access_token, current_date, None, None, "steps" , False, um, countdate)
		caloriecount_list = cherrypy.session.get('fitbit').process_apicall(access_token, current_date, None, None, "calories", False, um, countdate)
		current_date = date(2013,2,1)
		countdate = date(2012,12,10)
		interval = 6

		for i in range(1,interval):	   
			stepcount_list = cherrypy.session.get('fitbit').process_apicall(access_token, current_date, None, None, "steps" , False, um, countdate)
			caloriecount_list = cherrypy.session.get('fitbit').process_apicall(access_token, current_date, None, None, "calories", False, um, countdate)
			countdate = countdate + timedelta(days=1)
			current_date = current_date + timedelta(days=1)
		"""
		#Week 4
		current_date = date(2013,2,6)
		countdate = date(2011,10,18)
		interval = 3

		for i in range(1,interval):	   
			stepcount_list = cherrypy.session.get('fitbit').process_apicall(access_token, current_date, None, None, "steps" , False, um, countdate)
			caloriecount_list = cherrypy.session.get('fitbit').process_apicall(access_token, current_date, None, None, "calories", False, um, countdate)
			countdate = countdate + timedelta(days=1)
			current_date = current_date + timedelta(days=1)


		current_date = date(2013,2,8)
		countdate = date(2012,4,23)
		stepcount_list = cherrypy.session.get('fitbit').process_apicall(access_token, current_date, None, None, "steps" , False, um, countdate)
		caloriecount_list = cherrypy.session.get('fitbit').process_apicall(access_token, current_date, None, None, "calories", False, um, countdate)
		
		current_date = date(2013,2,9)
		countdate = date(2012,4,2)
		interval = 5
		

		for i in range(1,interval):	   
			stepcount_list = cherrypy.session.get('fitbit').process_apicall(access_token, current_date, None, None, "steps" , False, um, countdate)
			caloriecount_list = cherrypy.session.get('fitbit').process_apicall(access_token, current_date, None, None, "calories", False, um, countdate)
			countdate = countdate + timedelta(days=1)
			current_date = current_date + timedelta(days=1)	
	
	def get_defaults_by_owndata(self,goal):
		um = cherrypy.session.get('um')
		summary = cherrypy.session.get('fitbit').get_fitbit_average(goal, um)
		return summary
			
	def get_goals_json(self, data):
		goal_list = []
		appname,goal = data.split('.')
		um = cherrypy.session.get('um')
		print "Got appname ",appname,"and goal ",goal
		import json
		from pprint import pprint
		json_data=open('goals_without_app.json')
		
		goal_data = json.load(json_data)
		#pprint(goal_data)
		json_data.close()
		#print goal_data["Fitbit"][0]["CurrentLevelGoal"]
		#print self.get_defaults_by_owndata(goal)
		pluginlist = um.check_installed_plugins()
		try:
			 if goal=="CurrentLevelGoal":				 
				 goal_list = goal_data["Goals"][0]["CurrentLevelGoal"]
			 elif goal=="StepGoal":
				 if("Fitbit" in pluginlist):
					personal_average, personal_days = self.get_defaults_by_owndata(goal)
					print "Default: ", personal_average, personal_days
					dd = 10000
					if personal_average > 0 and personal_average < dd/2:
					   goal_data["Goals"][0]["StepGoal"][0]["default_val"][0]= dd/2
					   goal_data["Goals"][0]["StepGoal"][0]["default_val"][1]= "The guidelines suggest walking 10000 steps/day is good. But here we have suggested a lower value that suits your own personal average stepcounts (%d steps/day)." % personal_average
					elif personal_average > dd/2 and personal_average <= dd:
					   goal_data["Goals"][0]["StepGoal"][0]["default_val"][0]= dd 
					   goal_data["Goals"][0]["StepGoal"][0]["default_val"][1]= "The guidelines suggest walking 10000 steps/day is good. Your own personal average stepcounts is quite high (%d steps/day). We hope this suits you. " % personal_average
				 print goal, goal_data["Goals"][0]["StepGoal"]	  
				 goal_list = goal_data["Goals"][0]["StepGoal"]
			 elif goal == "ModerateActivityGoal":
				 if("Goals" in pluginlist):				   
					 personal_average, personal_days = self.get_defaults_by_owndata(goal)  
					 print "Default: active minutes and #days/week", personal_average, personal_days
					 #default = (goal_data["Goals"][0]["ModerateActivityGoal"][0]["default_val"][0])/2
					 dd = 30
					 if personal_average > 0 and personal_average < dd/2:
						goal_data["Goals"][0]["ModerateActivityGoal"][0]["default_val"][0]= personal_average*2
					 elif personal_average > dd/2 and personal_average <= dd:
						goal_data["Goals"][0]["ModerateActivityGoal"][0]["default_val"][0]= personal_average 
					 #goal_data["Goals"][0]["ModerateActivityGoal"][0]["default_val"][2] = personal_days
				 goal_list = goal_data["Goals"][0]["ModerateActivityGoal"]
			 elif goal == "IntenseActivityGoal":  
				 if("Fitbit" in pluginlist):				  
					 personal_average, personal_days = self.get_defaults_by_owndata(goal)
					 print "Default: ", personal_average, personal_days
					 dd = 30
					 if personal_average > 0 and personal_average < dd/2:
						goal_data["Goals"][0]["IntenseActivityGoal"][0]["default_val"][0]= personal_average*2
					 elif personal_average > dd/2 and personal_average <= dd:
						goal_data["Goals"][0]["IntenseActivityGoal"][0]["default_val"][0]= personal_average 
					 #goal_data["Goals"][0]["IntenseActivityGoal"][0]["default_val"][2] = personal_days				 
					 
				 goal_list = goal_data["Goals"][0]["IntenseActivityGoal"] 
			 elif goal == "AvoidInactivityGoal":
				 print "About Inactivity Goal", json.dumps(goal_data["Goals"][0]["AvoidInactivityGoal"])
				 goal_list = goal_data["Goals"][0]["AvoidInactivityGoal"]
					   
			 subcat_json = json.dumps(goal_list)
			 print subcat_json

			 write_log('notice','Get Goals operation successful')

			 return subcat_json
		except Exception,e:

			write_log('error','Get Goals Operation Failed; Error:'+str(e))

			return json.dumps('Error:'+str(e))
	get_goals_json.exposed = True

	def set_goals(self,newgoal):

		context = ["Goals","Health"]
		um = cherrypy.session.get('um')
		print "Got goal: ",newgoal
		
		goal_type,duration,dayofweek,measure,frequency,email,tweet,feedback_freq,app_plugin,commitment,efficacy,difficulty,importance = newgoal.split(',')
		print goal_type,duration,measure,frequency,email,tweet,feedback_freq,app_plugin
		if type(um.get_context(goal_type)) != 'dict':
		   try:
			  um.make_new_context(goal_type,"",context)
			  print "Creating Goal context "			 
			  context.append(goal_type)
		   except Exception,e:
			  write_log('error','Set Goals Operation Failed; Error:'+str(e))
			  return "Error: "+str(e)
		 
		um.make_new_component('goal_duration','attribute', 'string',None,'None',context)
		um.make_new_component('goal_startday','attribute', 'string',None,'None',context)
		um.make_new_component('graph_startdate','attribute', 'string',None,'None',context)
		um.make_new_component('goal_startdate','attribute', 'string',None,'None',context)
		
		um.make_new_component('target_value','attribute', 'string',None,'None',context)
		um.make_new_component('target_frequency','attribute', 'string',None,'None',context)			
		um.make_new_component('feedback_type_email','attribute', 'string',None,'None',context)
		um.make_new_component('feedback_type_tweet','attribute', 'string',None,'None',context)
		um.make_new_component('feedback_freq','attribute', 'string',None,'None',context)
		um.make_new_component('app_plugin','attribute', 'string',None,'None',context)
		um.make_new_component('subgoals','attribute', 'string',None,'None',context)
		um.make_new_component('supergoals','attribute', 'string',None,'None',context)
		um.make_new_component('commitment','attribute', 'string',None,'None',context)
		um.make_new_component('efficacy','attribute', 'string',None,'None',context)
		um.make_new_component('difficulty','attribute', 'string',None,'None',context)
		um.make_new_component('importance','attribute', 'string',None,'None',context)
		um.make_new_component('notes','attribute', 'string',None,'None',context)
		
		um.add_evidence(context=context, component='goal_duration', value=duration, flags=['New'])
		
		um.add_evidence(context=context, component='target_frequency', value=frequency, flags=['New'])
		um.add_evidence(context=context, component='feedback_type_email', value=email, flags=['New'])		
		um.add_evidence(context=context, component='feedback_type_tweet', value=tweet, flags=['New'])
		um.add_evidence(context=context, component='feedback_freq', value=feedback_freq, flags=['New'])
		um.add_evidence(context=context, component='app_plugin', value=app_plugin, flags=['New'])
		um.add_evidence(context=context, component='supergoals', value="Maintain wellness", flags=['New'])
		
		#values = ['Not set','','Very low','','Low','','Medium','','High','','Very high']
		#udata = commitment.decode("utf-8")
		#commitment = udata.encode("ascii","ignore")
		#index = int(commitment) / 10
		
		um.add_evidence(context=context, component='commitment', value=commitment, flags=['New'])
		
		#udata = efficacy.decode("utf-8")
		#efficacy = udata.encode("ascii","ignore")
		#index = int(efficacy)/10				
		
		um.add_evidence(context=context, component='efficacy', value=efficacy, flags=['New'])
		
		#udata = difficulty.decode("utf-8")
		#difficulty = udata.encode("ascii","ignore")
		#ndex = int(difficulty)/10				
		
		um.add_evidence(context=context, component='difficulty', value=difficulty, flags=['New'])

		um.add_evidence(context=context, component='importance', value=importance, flags=['New'])
		
		
		um.add_evidence(context=context, component='goal_startday', value=dayofweek, flags=['New'])
		
		import datetime,time
		today = datetime.datetime.now()
		current_date = date(today.year, today.month, today.day)
		
		#-------------------------Temporary fake setup------------------------
		email_id = um.get_evidence_new(context = ['Personal'], componentid="email")
		"""
		if email_id[-1].value == "alexnew.personis@gmail.com":
		   if goal_type == "CurrentLevelGoal":
		      current_date = date(2013, 1, 8)	
		
		if email_id[-1].value == "alexoneweek.personis@gmail.com":
		   if goal_type == "CurrentLevelGoal":
		      current_date = date(2013, 1, 8)	
		   else:		
		      cur_goal_context = ['Goals','Health','CurrentLevelGoal']
		      cur_goal_start_date = um.get_evidence_new(context = cur_goal_context, componentid="graph_startdate")
		      st_date = datetime.datetime.strptime(cur_goal_start_date[-1].value, "%d/%m/%Y").date()
		      #current_date = date(st_date[0], st_date[1], st_date[2])
		      current_date = st_date + timedelta(days = 6)
	
		if email_id[-1].value == "alexonemonth.personis@gmail.com":
		   cur_goal_context = ['Goals','Health','CurrentLevelGoal']
		   cur_goal_start_date = um.get_evidence_new(context = cur_goal_context, componentid="graph_startdate")
		   st_date = datetime.datetime.strptime(cur_goal_start_date[-1].value, "%d/%m/%Y").date()
		   #current_date = date(st_date[0], st_date[1], st_date[2])
		   current_date = st_date + timedelta(days = 6)

		if email_id[-1].value == "alexoneyear.personis@gmail.com":
		   cur_goal_context = ['Goals','Health','CurrentLevelGoal']
		   cur_goal_start_date = um.get_evidence_new(context = cur_goal_context, componentid="graph_startdate")
		   st_date = datetime.datetime.strptime(cur_goal_start_date[-1].value, "%d/%m/%Y").date()
		   #current_date = date(st_date[0], st_date[1], st_date[2])
		   current_date = st_date + timedelta(days = 6)
		  
		#------------------------------------------------------------------------

			 
		day_of_week = ["monday","tuesday","wednesday","thursday","friday","saturday","sunday"]				
		print "Weekday to start goal:",dayofweek, "and today:", current_date.weekday()
		while dayofweek != day_of_week[current_date.weekday()]:
			current_date = current_date + timedelta(days = 1)  
		"""
		#-------------------------Temporary fake setup------------------------
		email_id = um.get_evidence_new(context = ['Personal'], componentid="email")
		emails = str(email_id[-1].value)
		print "Is fake alex?",emails.find("personis")
		if emails.find("personis") != -1:
			if goal_type == "CurrentLevelGoal":
				  current_date = date(2013, 1, 8)
				  dayofweek = "tuesday"	
			elif goal_type == "StepGoal":		
				  current_date = date(2013, 1, 16)
				  dayofweek = "wednesday"
		
		else:
			 
			day_of_week = ["monday","tuesday","wednesday","thursday","friday","saturday","sunday"]				
			print "Weekday to start goal:",dayofweek, "and today:", current_date.weekday()
			while dayofweek != day_of_week[current_date.weekday()]:
				current_date = current_date + timedelta(days = 1)  
				
		 
		start_graph = current_date 
		start_graph = start_graph.strftime("%d/%m/%Y")
		print "Showing graph window from ",start_graph
		um.add_evidence(context=context, component='graph_startdate', value=start_graph, flags=['New'])
		
		#------------------Temporary fake set up
		if email_id[-1].value == "alexonemonth.personis@gmail.com":
		   for i in range(1,4):		   	  	
	   	   	   interval = 7 * i
		   	   start_graph = current_date + timedelta(days = interval)	 
		   	   start_graph = start_graph.strftime("%d/%m/%Y")
			   um.add_evidence(context=context, component='graph_startdate', value=start_graph, flags=['Used'])
		
		if email_id[-1].value == "alexoneyear.personis@gmail.com":
		   for i in range(1,12):		   	  	
	   	   	   interval = 7 * i
		   	   start_graph = current_date + timedelta(days = interval)	 
		   	   start_graph = start_graph.strftime("%d/%m/%Y")
			   um.add_evidence(context=context, component='graph_startdate', value=start_graph, flags=['Used'])
			
		#--------------------------------------------------------------------		
		um.add_evidence(context=context, component='goal_startdate', value=start_graph)

		start_time = current_date.strftime('%Y-%m-%d %H:%M:%S')
		um.add_evidence(context=context, component='target_value', value=measure, usertime=start_time, flags=['New'])
		
		#-----Adding a subsrciption....
		um.add_rules(context, email, feedback_freq, dayofweek, current_date)
		
		
		write_log('notice','Set goals operation is successful')
		
		return "Goal set successfully."
	set_goals.exposed = True

	def send_mail(self,goal_type):
		# Import smtplib for the actual sending function
		import smtplib
		
		# Import the email modules
		from email.mime.text import MIMEText
		
		context = ['Goals','Health']
		context.append(goal_type)
		
		fbtplug = cherrypy.session.get('fitbit') 
		um = cherrypy.session.get('um')
						
		
		target_val = um.get_evidence_new(context=context,componentid='target_value')
		for tval in target_val[::-1]:
			if tval.flags[0] != "Revised":
				target = tval.value.split(' ')[0]
				break
		#textfile = "mail.txt"
		msg = ""
		#--How many days in between the goal set date 
		import datetime
		today = datetime.datetime.now()
		current_date = date(today.year, today.month, today.day)
		#betweendays = self.get_days_in_between(cherrypy.session.get('goal_duration'))
		target = string.atoi(target)
		if goal_type == "StepGoal":
			summary = fbtplug.get_daily_fitbit_summary(goal_type, um)
			if summary < target:
			   msg = MIMEText("Almost there!!! You have walked "+str(summary) +"steps. You have to walk "+str(target-summary)+" steps to reach your target. ")
			else:
			   msg = MIMEText("Well done!!! You did it!!! You have walked "+summary +"steps. ")
		elif goal_type == "ModerateActivityGoal":
			summary = fbtplug.get_daily_fitbit_summary(goal_type, um)
			if summary < target:
			   msg = MIMEText("Almost there!!! You were moderately active for "+str(summary)+" minutes.")
			else:
			   msg = MIMEText("Well done!!! You did it!!! ")

		elif goal_type == "IntenseActivityGoal":
			summary = fbtplug.get_daily_fitbit_summary(goal_type, um)
			if summary < target:
			   msg = MIMEText("Almost there!!! You were intensely active for "+str(summary)+" minutes.")
			else:
			   msg = MIMEText("Well done!!! You did it!!! ")
		
		#fp = open(textfile, 'rb')
		# Create a text/plain message
		#msg = MIMEText(fp.read())
		#fp.close()
		
		# me == the sender's email address
		me = "chai@vm1-chai2.cs.usyd.edu.au"
		# you == the recipient's email address
		email_id = um.get_evidence_new(context = ['Personal'], componentid="email")
		
		you = email_id[-1].value #"alexnew.personis@gmail.com"
		msg['Subject'] = 'Your progress report'
		msg['From'] = me
		msg['To'] = you
		
		# Send the message via our own SMTP server, but don't include the
		# envelope header.
		print "Sending email"
		try:
			s = smtplib.SMTP('vm1-chai2.cs.usyd.edu.au')
			s.sendmail(me, [you], msg.as_string())
			s.quit()
		except Exception,e:
		   print e
		
		return "Success"
	send_mail.exposed = True

	def get_prev_goals_json(self, data):
		goal_list = []
		import json
		appname,goal = data.split('.')
		um = cherrypy.session.get('um')
		print appname,goal
		context=["Goals","Health"]
		udata = goal.decode("utf-8")
		goal = udata.encode("ascii","ignore")
		context.append(goal)
		print "Context for goal revise",context
		try:
			goal_duration = um.get_evidence_new(context=context,componentid='goal_duration')
			goal_startdate = um.get_evidence_new(context=context,componentid='goal_startdate')
			target_val = um.get_evidence_new(context=context,componentid='target_value')
			target_freq = um.get_evidence_new(context=context,componentid='target_frequency')
			feeback_mail = um.get_evidence_new(context=context,componentid='feedback_type_email')
			feedback_tweet = um.get_evidence_new(context=context,componentid='feedback_type_tweet')
			feedback_freq = um.get_evidence_new(context=context,componentid='feedback_freq')
			app_plugin = um.get_evidence_new(context=context,componentid='app_plugin')
			commitment = um.get_evidence_new(context=context,componentid='commitment')
			efficacy = um.get_evidence_new(context=context,componentid='efficacy')
			difficulty = um.get_evidence_new(context=context,componentid='difficulty')
			importance = um.get_evidence_new(context=context,componentid='importance')

			dayofweek = um.get_evidence_new(context=context, componentid='goal_startday')
			graph_start = um.get_evidence_new(context=context, componentid='graph_startdate')
		
			
			cherrypy.session['goal_type'] = goal
			cherrypy.session['target_val'] = target_val[-1].value
			cherrypy.session['target_freq'] = target_freq[-1].value
			cherrypy.session['feeback_mail'] = feeback_mail[-1].value
			cherrypy.session['feedback_tweet'] = feedback_tweet[-1].value
			cherrypy.session['feedback_freq'] = feedback_freq[-1].value
			cherrypy.session['app_plugin'] = app_plugin[-1].value
			cherrypy.session['commitment'] = commitment[-1].value
			cherrypy.session['efficacy'] = efficacy[-1].value
			cherrypy.session['difficulty'] = difficulty[-1].value
			cherrypy.session['dayofweek'] = dayofweek[-1].value
			if goal_duration[-1].value == "no change":
			   for gd in goal_duration:
				  if gd.flags[0] != "Revised":	 
		  			 cherrypy.session['goal_duration'] = gd.value
					 break
			else:
			   cherrypy.session['goal_duration'] = goal_duration[-1].value
			   cherrypy.session['goal_startdate'] = goal_startdate[-1].value
			   cherrypy.session['graph_startdate'] = graph_start[-1].value
			
			
			
			#--How many days in between the goal set date 
			import datetime
			today = datetime.datetime.now()
			current_date = date(today.year, today.month, today.day)
			betweendays = self.get_days_in_between(cherrypy.session.get('goal_duration'))

			#---Get the date when the goal is set and how many days have been passed
			start_time = time.localtime(int(target_val[-1].time))
			goal_start_date = date(start_time[0], start_time[1], start_time[2])
			print "This goal is set on ", goal_start_date
			days_passed = (current_date - goal_start_date).days
			if days_passed < 0:
			   days_passed = 0
			#---Get the date when the goal will end
			goal_end_date = goal_start_date + timedelta(days = betweendays)							  
			#--Find out whether the goal is still on. If it is still on, then show the chart and check how many days left. Beacuse there might be data from previous goal.
			days_left = 0
			if goal_end_date >= current_date:
			   days_left =  betweendays - days_passed

		except Exception,e:
			print "***Error: "+str(e)
		my_goal = ""
		#print goal_duration[-1].value
		my_goal = cherrypy.session.get('goal_duration') + "_" + target_val[-1].value + "_" +target_freq[-1].value +"_"+feeback_mail[-1].value+"_"+feedback_tweet[-1].value+"_"+feedback_freq[-1].value+ "_" + commitment[-1].value+ "_" + efficacy[-1].value+ "_" + difficulty[-1].value+"_"+dayofweek[-1].value+"_"+str(days_passed)+"_"+str(days_left)+"_" +importance[-1].value
		print my_goal
		goal_dict = [{"myGoal" : my_goal}]
		return json.dumps(goal_dict)
	get_prev_goals_json.exposed = True

		
	def revise_goals(self, newgoal):

		context = ["Goals","Health"]
		um = cherrypy.session.get('um')
		print "Got goal: ",newgoal
		
		goal_type,duration,dayofweek,measure,frequency,email,tweet,feedback_freq,app_plugin,commitment,efficacy,difficulty,importance = newgoal.split(',')
		print goal_type,duration,measure,frequency,email,tweet,feedback_freq,app_plugin
		
		cur_duration = ""
		context.append(goal_type)

		if cherrypy.session.get('goal_duration') != duration:
			print duration," and ",cherrypy.session.get('goal_duration')
			um.add_evidence(context=context, component='goal_duration', value=duration, flags=['Revised'])
			cur_duration = duration
		else:
			cur_duration = cherrypy.session.get('goal_duration')
			um.add_evidence(context=context, component='goal_duration', value="no change", flags=['Revised'])
			
		betweendays = self.get_days_in_between(cur_duration)
		
		cur_dayofweek = ""
		import datetime,time
		today = datetime.datetime.now()
		current_date = date(today.year, today.month, today.day)
		today_date = date(today.year, today.month, today.day)
			
		if cherrypy.session.get('dayofweek') != dayofweek:
			um.add_evidence(context=context, component='goal_startday', value=dayofweek, flags=['Revised'])
			cur_dayofweek = dayofweek
			#-------------Temporary for user study-----
			email_id = um.get_evidence_new(context = ['Personal'], componentid="email")
			if email_id[-1].value == "alexoneweek.personis@gmail.com":
			   cur_goal_context = ['Goals','Health','CurrentLevelGoal']
			   cur_goal_start_date = um.get_evidence_new(context = cur_goal_context, componentid="graph_startdate")
			   st_date = datetime.datetime.strptime(cur_goal_start_date[-1].value, "%d/%m/%Y").date()
			   #current_date = date(st_date[0], st_date[1], st_date[2])
			   current_date = st_date + timedelta(days = 8)
			   print current_date	
			
			if email_id[-1].value == "alexonemonth.personis@gmail.com":
			   cur_goal_context = ['Goals','Health','StepGoal']
			   cur_goal_start_date = um.get_evidence_new(context = cur_goal_context, componentid="graph_startdate")
			   if cur_goal_start_date[-1].flags[0] != "Revised":
			      st_date = datetime.datetime.strptime(cur_goal_start_date[-1].value, "%d/%m/%Y").date()
			   else:
			   	  for st_dt in cur_goal_start_date[::-1]:
			   	  	  if st_dt.flags[0] == "New" or st_dt.flags[0] == "Used":
			   	  	  	 st_date = datetime.datetime.strptime(st_dt[-1].value, "%d/%m/%Y").date()
			   	  	  	 break
			   #current_date = date(st_date[0], st_date[1], st_date[2])
			   current_date = st_date
			   print "Fake current date", current_date	
			#------------------------------------------ 
			day_of_week = ["monday","tuesday","wednesday","thursday","friday","saturday","sunday"]				
			print "Weekday to start goal:",dayofweek, "and today:", current_date.weekday()
			while cur_dayofweek != day_of_week[current_date.weekday()]:
				current_date = current_date + timedelta(days = 1)   
			
			start_graph = current_date
			start_graph = start_graph.strftime("%d/%m/%Y")
			if current_date == today_date:
				um.add_evidence(context=context, component='graph_startdate', value=start_graph, flags=['Used'])
			else:
				um.add_evidence(context=context, component='graph_startdate', value=start_graph, flags=['Revised'])
			 
				
			print "Showing graph window from ",start_graph
			#goal_end_date = goal_start_date + timedelta(days = betweendays)  
			
			#---Start date will not change on revise
			#um.add_evidence(context=context, component='goal_startdate', value=start_graph)
			
			
		if cherrypy.session.get('target_val') != measure:
			start_time = current_date.strftime('%Y-%m-%d %H:%M:%S')
  			if current_date == today_date:	
			   um.add_evidence(context=context, component='target_value', value=measure, usertime=start_time, flags=['Used'])
			else:
			   um.add_evidence(context=context, component='target_value', value=measure, usertime=start_time, flags=['Revised'])


		if cherrypy.session.get('target_freq') != frequency:
			um.add_evidence(context=context, component='target_frequency', value=frequency, flags=['Revised'])
		if cherrypy.session.get('feedback_mail') != email:
			um.add_evidence(context=context, component='feedback_type_email', value=email, flags=['Revised'])   
		if cherrypy.session.get('feedback_tweet') != tweet:	 
			um.add_evidence(context=context, component='feedback_type_tweet', value=tweet, flags=['Revised'])
		if cherrypy.session.get('feedback_freq') != feedback_freq:
			um.add_evidence(context=context, component='feedback_freq', value=feedback_freq, flags=['Revised'])
				
		if cherrypy.session.get('commitment') != commitment:
			um.add_evidence(context=context, component='commitment', value=commitment, flags=['Revised'])
				
		if cherrypy.session.get('efficacy') != efficacy:
			um.add_evidence(context=context, component='efficacy', value=efficacy, flags=['Revised'])
				
		if cherrypy.session.get('difficulty') != difficulty:
			um.add_evidence(context=context, component='difficulty', value=difficulty, flags=['Revised'])
			
		if cherrypy.session.get('importance') != importance:
			um.add_evidence(context=context, component='importance', value=importance, flags=['Revised'])
							   
		write_log('notice','Revise goals operation is successful')
		
		return "Goal revised successfully."
	

	revise_goals.exposed = True

	
	
	def browse_goals(self):
		um = cherrypy.session.get('um')
		#browser_activities = um.get_evidence_new(context = ['Admin'], componentid = 'browseractivity')
		cherrypy.session['cur_action'] = "Browse Goals"
		
		modeltree = um.build_modeldef_tree()
		
		#self.modeltree = set(self.modeltree)
		genshi_tmpl = LoadGenshiTemplate(cherrypy.session.get('cur_session'), cherrypy.session.get('username'), browser_activities)

		if type(modeltree) is ListType:
			write_log('notice','Goals Clicked: Operation Successful')
			modeltree = sorted(modeltree, key=attrgetter('level', 'name'))
			cherrypy.session['modeltree'] = modeltree
			return genshi_tmpl.browse_goal_template(ACCESS_TYPE, modeltree, cherrypy.session.get('username'))
		else:
			e = modeltree
			write_log('error','Goals Clicked: Operation Failed; Error:'+str(e))

		return genshi_tmpl.greeting_template(e,"Goals",modeltree)

	browse_goals.exposed = True

	def get_days_in_between(self,value):
		value = value.split(' ');
		 
		if string.find(value[1],'week') != -1:
			return 7 * string.atoi(value[0])
		elif string.find(value[1],'month') != -1:
			return 30 * string.atoi(value[0])
		else:
			return 7
		
	def revise_goals_json(self, data):
		goal_list = []
		import json
		appname,goal = data.split('.')
		um = cherrypy.session.get('um')
		print appname,goal
		context=["Goals","Health"]
		udata = goal.decode("utf-8")
		goal = udata.encode("ascii","ignore")
		context.append(goal)
		print "Context for goal revise",context
		try:
			goal_duration = um.get_evidence_new(context=context,componentid='goal_duration')
			target_val = um.get_evidence_new(context=context,componentid='target_value')
			target_freq = um.get_evidence_new(context=context,componentid='target_frequency')
			feeback_mail = um.get_evidence_new(context=context,componentid='feedback_type_email')
			feedback_tweet = um.get_evidence_new(context=context,componentid='feedback_type_tweet')
			feedback_freq = um.get_evidence_new(context=context,componentid='feedback_freq')
			app_plugin = um.get_evidence_new(context=context,componentid='app_plugin')
			commitment = um.get_evidence_new(context=context,componentid='commitment')
			efficacy = um.get_evidence_new(context=context,componentid='efficacy')
			difficulty = um.get_evidence_new(context=context,componentid='difficulty')
			dayofweek = um.get_evidence_new(context=context, componentid='goal_startday')
			
			#--How many days in between the goal set date 
			import datetime
			today = datetime.datetime.now()
			current_date = date(today.year, today.month, today.day)
			betweendays = self.get_days_in_between(goal_duration[-1].value)

			#---Get the date when the goal is set and how many days have been passed
			start_time = time.localtime(int(goal_duration[-1].creation_time))
			goal_start_date = date(start_time[0], start_time[1], start_time[2])
			print "This goal is set on ", goal_start_date
			days_passed = (current_date - goal_start_date).days

			#---Get the date when the goal will end
			goal_end_date = goal_start_date + timedelta(days = betweendays)							  
			#--Find out whether the goal is still on. If it is still on, then show the chart and check how many days left. Beacuse there might be data from previous goal.
			days_left = 0
			if goal_end_date >= current_date:
			   days_left =  (goal_end_date - current_date).days

		except Exception,e:
			print "***Error: "+str(e)
		my_goal = ""
		#print goal_duration[-1].value
		my_goal = goal_duration[-1].value + "_" + target_val[-1].value + "_" +target_freq[-1].value +"_"+feeback_mail[-1].value+"_"+feedback_tweet[-1].value+"_"+feedback_freq[-1].value+ "_" + commitment[-1].value+ "_" + efficacy[-1].value+ "_" + difficulty[-1].value+"_"+dayofweek[-1].value+"_"+str(days_passed)+"_"+str(days_left)
		print my_goal
		goal_dict = [{"myGoal" : my_goal}]
		return json.dumps(goal_dict)
	revise_goals_json.exposed = True
	
	def add_notes_to_activity(self,note):
		curcont,note,notedate = note.split("_")
		print "Note found for",curcont,",",note,notedate
		context = ['Goals','Health']
		context.append(curcont)
		um = cherrypy.session.get('um')
		#note_date = datetime.datetime.fromtimestamp(int(notedate)).strftime('%Y-%m-%d %H:%M:%S')
		try:
			um.add_evidence(context=context, component='notes', value=note, comment=None, usertime=notedate)
			return "Success"
		except Exception,e:
			return "Error"+str(e)
	add_notes_to_activity.exposed = True

		   
			
	#----------------------------------End Application functions -----------------------------------------------------------#



	#----------------------------------Start Visualisation functions--------------------------------------------------------#
	def show_size(self):
		t1 = time.clock()
		personis_vis = cherrypy.session.get('vismgr')
		modeltree = cherrypy.session.get('modeltree')
		res = personis_vis.show_size(modeltree)

		t2 = time.clock()
		print res
		if type(res) is ListType:
			res = json.dumps(res)
		write_log('notice','Show size visualisation')
		print 'show_health took %0.3fms' % ((t2-t1)*1000.0)
		return res

	show_size.exposed = True


	#@print_timing
	def show_health(self):
		t1 = time.clock()
		personis_vis = cherrypy.session.get('vismgr')
		res = personis_vis.show_health()
		t2 = time.clock()
		write_log('notice','Show health visualisation')
		print 'show_health took %0.3fms' % ((t2-t1)*1000.0)
		return res

	show_health.exposed = True

	#@print_timing
	def show_graph_hc(self,data=None):
		write_log('notice','Get data from um for visualisation')
		personis_vis = cherrypy.session.get('vismgr')
		return personis_vis.show_graph_hc(data)

	show_graph_hc.exposed = True

	def show_goals(self):
		t1 = time.clock()
		personis_vis = cherrypy.session.get('vismgr')
		res = personis_vis.show_goals()
		t2 = time.clock()
		write_log('notice','Show goals visualisation')
		print 'show_goal took %0.3fms' % ((t2-t1)*1000.0)
		return res

	show_goals.exposed = True
	
	def show_current_goal(self,data):
		#---- First Add some data to um ------
		import datetime
		today = datetime.datetime.now()
		current_date = date(today.year, today.month, today.day)
		um = cherrypy.session.get('um')	  
		fbtplug = cherrypy.session.get('fitbit') 
		if not cherrypy.session.get('fitbit_add'):
		   cherrypy.session['fitbit_add'] = True 
		#----- Then get data from um -------
		personis_vis = cherrypy.session.get('vismgr')
		res = personis_vis.show_current_goal(fbtplug,data)
		return res
	show_current_goal.exposed = True	

	def show_step_goal(self,data):
		#---- First Add some data to um ------
		import datetime
		#today = datetime.datetime.now()
		#current_date = date(today.year, today.month, today.day)
		#---This is just to check on what date you are start viewing the goal chart 
		print data
		um = cherrypy.session.get('um')
		installed_plugins = []
		
		if cherrypy.session.get('pluginlist'):
		   installed_plugins =  cherrypy.session.get('pluginlist')
		print "Installed",installed_plugins
		if data == "past":			
		   check_prev = cherrypy.session.get('prevcheck_type')
		   check_date = cherrypy.session.get('check_date')
		   if check_prev == "next":			  
			  check_date = check_date - timedelta(days=7)
		   else:
			  check_date = check_date - timedelta(days=7) 
		   cherrypy.session['check_date'] = check_date
		   print "Starting search from ", check_date," for past 7 days"
		   cherrypy.session['prevcheck_type'] = data
		elif data == "next":	 
		   check_prev = cherrypy.session.get('prevcheck_type')
		   check_date = cherrypy.session.get('check_date')
		   if check_prev == "next":			  
			  check_date = check_date + timedelta(days=7)
		   else:
			  check_date = check_date + timedelta(days=7)			 
		   cherrypy.session['check_date'] = check_date		   
		   print "Starting search from ", check_date ," for next 7 days"
		   cherrypy.session['prevcheck_type'] = data
		elif data == "note":
		   check_prev = cherrypy.session.get('prevcheck_type')
		   check_date = cherrypy.session.get('check_date')
		   #cherrypy.session['check_date'] = check_date		   
		   print "Starting search from ", check_date ," for next 7 days"
		   data = check_prev
		   #cherrypy.session['prevcheck_type'] = "none"			
		else:
		   context = ['Goals','Health','StepGoal']
		   start_graph_date = um.get_evidence_new(context = context, componentid='graph_startdate')
		   print start_graph_date[-1].value
		   startgraph_date = time.strptime(start_graph_date[-1].value, "%d/%m/%Y")   
		   check_date = date(startgraph_date[0], startgraph_date[1], startgraph_date[2])
		   cherrypy.session['check_date'] = check_date
		   cherrypy.session['prevcheck_type'] = data							
		   print "Starting search from ", check_date ," for next 7 days"

		if len(installed_plugins) != 0:
			if 'Fitbit' in installed_plugins:
			   print "Got Fitbit installed"									 
			   fbtplug = cherrypy.session.get('fitbit') 
			   if not cherrypy.session.get('fitbit_add'):		   
				  cherrypy.session['fitbit_add'] = True 
			   #----- Then get data from um -------
			   personis_vis = cherrypy.session.get('vismgr')
			   res = personis_vis.show_goal_with_target(fbt=fbtplug, form="steps", goal_type="StepGoal", past_next=data, st_date=check_date)
			   return res
			else:
				res = json.dumps({"goalEnd":"Please install Fitbit"})
				print res
				return res
	show_step_goal.exposed = True	

	def show_moderate_activity_goal(self,data):
		#---- First Add some data to um ------
		import datetime
		#today = datetime.datetime.now()
		#current_date = date(today.year, today.month, today.day)
		#---This is just to check on what date you are start viewing the goal chart 
		print data
		time_span, activity_type = data.split('_')
		um = cherrypy.session.get('um')
		if time_span == "past":			
		   check_prev = cherrypy.session.get('prevcheck_moderate')
		   check_date = cherrypy.session.get('check_date_moderate')
		   if check_prev == "next":			  
			  check_date = check_date - timedelta(days=7)
		   else:
			  check_date = check_date - timedelta(days=7) 
		   cherrypy.session['check_date_moderate'] = check_date
		   print "Starting search from ", check_date," for past 7 days"
		   cherrypy.session['prevcheck_moderate'] = data
		elif time_span == "next":	 
		   check_prev = cherrypy.session.get('prevcheck_moderate')
		   check_date = cherrypy.session.get('check_date_moderate')
		   if check_prev == "next":			  
			  check_date = check_date + timedelta(days=7)
		   else:
			  check_date = check_date + timedelta(days=7)			 
		   cherrypy.session['check_date_moderate'] = check_date		   
		   print "Starting search from ", check_date ," for next 7 days"
		   cherrypy.session['prevcheck_moderate'] = data
		elif time_span == "note":
		   check_prev = cherrypy.session.get('prevcheck_moderate')
		   check_date = cherrypy.session.get('check_date_moderate')
		   #cherrypy.session['check_date'] = check_date		   
		   print "Starting search from ", check_date ," for next 7 days"
		   data = check_prev
		   #cherrypy.session['prevcheck_type'] = "none"			
		else:
		   context = ['Goals','Health','ModerateActivityGoal']
		   start_graph_date = um.get_evidence_new(context = context, componentid='graph_startdate')
		   print start_graph_date[-1].value
		   startgraph_date = time.strptime(start_graph_date[-1].value, "%d/%m/%Y")   
		   check_date = date(startgraph_date[0], startgraph_date[1], startgraph_date[2])
		   cherrypy.session['check_date_moderate'] = check_date
		   cherrypy.session['prevcheck_moderate'] = data							
		   print "Starting search from ", check_date ," for next 7 days"
									 
		fbtplug = cherrypy.session.get('fitbit') 
		if not cherrypy.session.get('fitbit_add'):		   
		   cherrypy.session['fitbit_add'] = True 
		#----- Then get data from um -------
		personis_vis = cherrypy.session.get('vismgr')
		res = personis_vis.show_goal_with_target(fbt=fbtplug, form='activity_level', goal_type="ModerateActivityGoal", past_next=time_span, st_date=check_date)
		return res
	show_moderate_activity_goal.exposed = True	

	def show_intense_activity_goal(self,data):
		#---- First Add some data to um ------
		import datetime
		#today = datetime.datetime.now()
		#current_date = date(today.year, today.month, today.day)
		#---This is just to check on what date you are start viewing the goal chart 
		print data
		time_span, activity_type = data.split('_')
		um = cherrypy.session.get('um')
		if time_span == "past":			
		   check_prev = cherrypy.session.get('prevcheck_intense')
		   check_date = cherrypy.session.get('check_date_intense')
		   if check_prev == "next":			  
			  check_date = check_date - timedelta(days=7)
		   else:
			  check_date = check_date - timedelta(days=7) 
		   cherrypy.session['check_date_intense'] = check_date
		   print "Starting search from ", check_date," for past 7 days"
		   cherrypy.session['prevcheck_intense'] = data
		elif time_span == "next":	 
		   check_prev = cherrypy.session.get('prevcheck_intense')
		   check_date = cherrypy.session.get('check_date_intense')
		   if check_prev == "next":			  
			  check_date = check_date + timedelta(days=7)
		   else:
			  check_date = check_date + timedelta(days=7)			 
		   cherrypy.session['check_date_intense'] = check_date		   
		   print "Starting search from ", check_date ," for next 7 days"
		   cherrypy.session['prevcheck_intense'] = data
		elif time_span == "note":
		   check_prev = cherrypy.session.get('prevcheck_intense')
		   check_date = cherrypy.session.get('check_date_intense')
		   #cherrypy.session['check_date'] = check_date		   
		   print "Starting search from ", check_date ," for next 7 days"
		   data = check_prev
		   #cherrypy.session['prevcheck_type'] = "none"			
		else:
		   context = ['Goals','Health','IntenseActivityGoal']
		   start_graph_date = um.get_evidence_new(context = context, componentid='graph_startdate')
		   print start_graph_date[-1].value
		   startgraph_date = time.strptime(start_graph_date[-1].value, "%d/%m/%Y")   
		   check_date = date(startgraph_date[0], startgraph_date[1], startgraph_date[2])
		   cherrypy.session['check_date_intense'] = check_date
		   cherrypy.session['prevcheck_intense'] = data							
		   print "Starting search from ", check_date ," for next 7 days"
									 
		fbtplug = cherrypy.session.get('fitbit') 
		if not cherrypy.session.get('fitbit_add'):		   
		   cherrypy.session['fitbit_add'] = True 
		#----- Then get data from um -------
		personis_vis = cherrypy.session.get('vismgr')
		res = personis_vis.show_goal_with_target(fbt=fbtplug, form='activity_level', goal_type="IntenseActivityGoal", past_next=time_span, st_date=check_date)
		return res
	show_intense_activity_goal.exposed = True	

	def show_historic_graph(self,data):									 
		fbtplug = cherrypy.session.get('fitbit') 
		if not cherrypy.session.get('fitbit_add'):		   
		   cherrypy.session['fitbit_add'] = True 
		#----- Then get data from um -------
		personis_vis = cherrypy.session.get('vismgr')
		if data == "StepGoal":
		   res = personis_vis.show_historic_graph(fbt=fbtplug, form="steps", goal_type=data)
		elif data == "ModerateActivityGoal":
		   res = personis_vis.show_historic_graph(fbt=fbtplug, form="activity_level", goal_type=data)
		elif data == "IntenseActivityGoal":
		   res = personis_vis.show_historic_graph(fbt=fbtplug, form="activity_level", goal_type=data) 
		return res
	show_historic_graph.exposed = True	
		

	def get_break_records(self):
		break_list = [{'breakTime':'8:30', 'breakDuration':'2:00'},{'breakTime':'9:10', 'breakDuration':'6:00'},{'breakTime':'9:35', 'breakDuration':'1:30'},{'breakTime':'10:00', 'breakDuration':'18:00'}]
					   
		import json
		breaks = json.dumps(break_list)
		print breaks
		return breaks   
	get_break_records.exposed = True

	@print_timing
	def show_people(self):
		personis_vis = cherrypy.session.get('vismgr')
		um = cherrypy.session.get('um')
		modeltree = cherrypy.session.get('modeltree')
		return personis_vis.term_cloud()

	show_people.exposed = True

	#@print_timing
	def show_timeline(self):
		write_log('notice','Show timeline visualisation')
		personis_vis = cherrypy.session.get('vismgr')
		return self.personis_vis.show_timeline()

	show_timeline.exposed = True

	#@print_timing
	def show_annual(self):
		write_log('notice','Show annual visualisation')
		personis_vis = cherrypy.session.get('vismgr')
		um = cherrypy.session.get('um')
		modeltree = cherrypy.session.get('modeltree')
		app_manager = cherrypy.session.get('appmgr')
		return personis_vis.annual_records()

	show_annual.exposed = True

	def show_calories(self):
		personis_vis = cherrypy.session.get('vismgr')
		um = cherrypy.session.get('um')
		write_log('notice','Show calories visualisation')
		fitbit_plugin.get_fitbit_data(um)
		personis_vis.show_graph_steps()
		return personis_vis.annual_records()

	show_calories.exposed = True

	def get_timeline_data(self):
		personis_vis = cherrypy.session.get('vismgr')
		return personis_vis.get_timeline_data()
	get_timeline_data.exposed = True



	#----------------------------------End Visualisation functions---------------------------------------------------------------#
	
	#------------------------------------- Start Management functions --------------------------------------#
	def delete_evidence(self, data):
		print "Delete evidence data"
		print data
		return "Success"	
	delete_evidence.exposed = True	
	
	def delete(self,data):
		data = data.split("_")
		contextlist = data[0].split(":")
		complist = data[1].split(":")
		print "*****Deleting "+data[0]+"******"
		
		context = cherrypy.session.get('cur_context')
		udata = context.decode("utf-8")
		context = udata.encode("ascii","ignore")
		 
		cur_context = context.split('/')		
		
		print cur_context
		um = cherrypy.session.get('um')
		if len(contextlist)>1:
		   contextlist = contextlist[1].split(",") 
		   try: 
			 for d in contextlist[:-1]:
				 print "Deleting "+ d
				 udata = d.decode("utf-8")
				 d = udata.encode("ascii","ignore")
				 cur_context.append(d)
				 print cur_context
				 um.delete_context(cur_context)
				 del cur_context[-1]
				 print cur_context
			 return "Success:"+context
		   except Exception,e:
			 print e  
			 return e	
		print "*****Deleting "+data[1]+"******" 
		if len(complist) > 1:
			complist = complist[1].split(",")
			try:
			  for d in complist[:-1]:	
				um.delete_component(cur_context,d)
			  return "Success:"+context 
			except Exception,e:
				print e
				return str(e)
		
	delete.exposed = True	

	@print_timing
	def help_um(self):
		genshi_tmpl = LoadGenshiTemplate(cherrypy.session.get('cur_session'))
		modeltree = cherrypy.session.get('modeltree')
		e = " This page is under development. Thank you for patience."
		return genshi_tmpl.greeting_template(e,"Help page",modeltree)
	help_um.exposed = True


	def show_tabhelp(self):
		 
		genshi_tmpl = LoadGenshiTemplate(cherrypy.session.get('cur_session'))
		return genshi_tmpl.show_help()

	show_tabhelp.exposed = True
 
	def comment_log(self,comment):
		import datetime
		f = open('comment.log','a')
		udata = comment.decode("utf-8")
		comment = udata.encode("ascii","ignore")
		
		um = cherrypy.session.get('um')
		comp = "log_browser_data"
		context = ['']
		ncont = "Mneme"
		if type(um.get_context(ncont)) != 'dict':
		   try:
			  um.make_new_context(ncont,"",context)
			  print "Creating Mneme context "			 
			  context.append(ncont)
		   except Exception,e:
			  write_log('error','Creating '+ncont+' Failed; Error:'+str(e))
			  return "Error: "+str(e)
		
		um.make_new_component(comp,'attribute', 'string',None,'None',context)
		  
		if str.find(comment,",") != -1:
		   all_comments = comment.split(",") 
		   for comm in all_comments:
			   print comm
			   __time = datetime.datetime.fromtimestamp(int(time.time())).strftime("%a %b %d %H:%M:%S %Y")	
			   comment = comm.split(':')
			   note = '['+__time+'] [notice] '+ comm +'\n'
			   #note = '['+__time+'] ['+comment[0]+'] '+comment[1]+":"+comment[2]+'\n'
			   if comm != "":
				  um.add_evidence(context=context, component=comp, value=comm)
				  f.write(note)
		else:	
			__time = datetime.datetime.fromtimestamp(int(time.time())).strftime("%a %b %d %H:%M:%S %Y")	
			comment = comment.split('_')
			note = '['+__time+'] ['+comment[0]+'] '+comment[1]+'\n'
			if comment[1] != "":
			   um.add_evidence(context=context, component=comp, value=comment[1])
			   f.write(note)
		f.close()
		return "Success"
	comment_log.exposed = True

	def logout(self):
		cherrypy.session.pop('um')
		genshi_tmpl = LoadGenshiTemplate(cherrypy.session.get('cur_session'))
		write_log('notice','Log out operation successful')
		return genshi_tmpl.welcome_template()
	logout.exposed = True

	@cherrypy.expose
	def do_login(self):
		if cherrypy.session.get('connection') <> None:
			cherrypy.InternalRedirect('/browse/')
		print self.oauthconf
		flow = OAuth2WebServerFlow(client_id=self.oauthconf['client_id'],
								   client_secret=self.oauthconf['client_secret'],
								   scope='https://www.personis.info/auth/model',
								   user_agent='mneme-server/1.0',
								   auth_uri=self.oauthconf['personis_uri']+'/authorize',
								   token_uri=self.oauthconf['personis_uri']+'/request_token')
		callback = callback = self.oauthconf['callback']
		authorize_url = flow.step1_get_authorize_url(callback)
		cherrypy.session['flow'] = flow
		raise cherrypy.HTTPRedirect(authorize_url)
	
	

	def test_sub(self):  
		print "Hello from Subscription"
	test_sub.exposed = True 
	
		 
	@cherrypy.expose
	def authorized(self,code):
		#session = get_current_session()
		print cherrypy.request.params
		if not 'code' in cherrypy.request.params:
			self.abort(400, detail='no code param')

		code = cherrypy.request.params['code']
		flow = cherrypy.session.get('flow')
		print flow
		#flow = pickle.loads(flow)
		if not flow:
			raise IOError()
		cherrypy.session['flow'] = None
		credentials = flow.step2_exchange(cherrypy.request.params,httplib2.Http(disable_ssl_certificate_validation=True))
		
		#oauthconf = self.app.config.get('oauthconf')
		#print "Oauthconf: %s" % oauthconf
		
		c = client.Connection(uri = self.oauthconf['personis_uri'],credentials = credentials, http=httplib2.Http(disable_ssl_certificate_validation=True))
		cherrypy.session['connection'] = c
		
		#self.install_contexts(um)
		#self.redirect('/')
		um = Personis_Access(connection=c)
		app_manager = Personis_App_Manager(ACCESS_TYPE, um)
		personis_vis = Personis_Visualisation_Manager(ACCESS_TYPE, um)
 
		#ev = client.Evidence(source="build_model.py", evidence_type="explicit", value='TestUser1')
		#um.um.tell(context=["Personal"], componentid='firstname', evidence=ev)

		reslist = um.um.ask(context=["Personal"],view=['firstname'])
		print "My Name is %s "% reslist[0].evidencelist[0].value
		
		cherrypy.session['um'] = um
		cherrypy.session['appmgr'] = app_manager
		cherrypy.session['vismgr'] = personis_vis
		cherrypy.session['username'] = reslist[-1].evidencelist[0].value
		
		redir = cherrypy.session.get('redirect')

		if redir == None:
			print "No redirect found"+str(redir)
			redir = '/browse/'
		raise cherrypy.InternalRedirect(redir)



if __name__ == '__main__':

	parser = OptionParser()
	parser.add_option("-a", "--appconfig",
			  dest="appconf", metavar='FILE',
			  help="App Config file", default='app.conf')
	parser.add_option("-g", "--globalconfig",
			  dest="globalconf", metavar='FILE',
			  help="Global Config file", default='global.conf')
	parser.add_option("-o", "--oauthconf",
			  dest="oauthconf", metavar='FILE',
			  help="Oauth Config file", default='oauth.yaml')

	(options, args) = parser.parse_args()

	httplib2.debuglevel=0
	cherrypy.config.update(options.globalconf)
	cherrypy.tree.mount(WelcomePage(options.oauthconf),'/',config=options.appconf)
	
	#cherrypy.server.ssl_certificate = "server.crt"
	#cherrypy.server.ssl_private_key = "server.key" 
	cherrypy.engine.start()
	cherrypy.engine.block()
	#import subprocess
	#ret = subprocess.call(["ssh","chai@vm1-chai2","python /home/chai/um-browser/serv.py"]);


	#cherrypy.engine.subscribe('start', open_page)
	#cherrypy.server.start()
	#cherrypy.server.start_with_callback(
	#		webbrowser.open,
	#		('http://localhost:8080',),
	#		)
