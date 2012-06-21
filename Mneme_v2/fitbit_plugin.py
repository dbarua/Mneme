#!/usr/bin/env python


import fitbit
import json
import datetime

import os, sys

sys.path.insert(0, '/home/chai/llum/llum/Personis/Src')

GOAL = 10000
#Personis
import Personis
import Personis_base, Personis_a
from Personis_util import printcomplist

from datetime import date, timedelta
from oauth import oauth 
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

          ctx_obj = Personis_base.Context(Identifier="Fitbit", Description="Extract data from fitbit server",
					  perms={'ask':True, 'tell':True, "resolvers":["all","last10","last1","goal"]}, 					  				                  resolver=None, objectType="Context")
          context = ['Devices']
          print "Creating Fitbit context under Devices context "
          personis_um.um.mkcontext(context,ctx_obj)

          ctx_obj = Personis_base.Context(Identifier="Activity", Description="Extract data from fitbit server",
					  perms={'ask':True, 'tell':True, "resolvers":["all","last10","last1","goal"]}, 					  				                  resolver=None, objectType="Context")
          context.append('Fitbit')
          print "Creating Activity context under Devices/Fitbit context "
          personis_um.um.mkcontext(context,ctx_obj)

          context.append('Activity')
          cobj = Personis_base.Component(Identifier="steps", component_type="attribute", value_type="number",resolver=None,Description="Fitbit 1-minute step data")
          personis_um.um.mkcomponent(context=context, componentobj=cobj)
          print "Creating component %s"%cobj.Identifier
          cobj = Personis_base.Component(Identifier="calories", component_type="attribute", value_type="number",resolver=None,Description="Fitbit 1-minute calorie data")
          personis_um.um.mkcomponent(context=context, componentobj=cobj)
          print "Creating component %s"%cobj.Identifier

          cobj = Personis_base.Component(Identifier="active_score", component_type="attribute", value_type="number",resolver=None,Description="Fitbit 1-minute active score data")
          personis_um.um.mkcomponent(context=context, componentobj=cobj)
          print "Creating component %s"%cobj.Identifier

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
	         start_date = str(today.year)+'-'+str(today.month-1)+'-'+str(today.day)

	  	 response = z.ApiCall(self.access_token, apiCall='/1/user/-/activities/date/'+start_date+'.json')
		 jdata = json.loads(response)
                 print jdata
                 self.personis_um = personis_um
		 
		 cur_context = ['Admin'] 
		 componentid = "@fitbit_access_token"
		 cobj = Personis_base.Component(Identifier=componentid, component_type="attribute", value_type="string",resolver=None,Description="Fitbit access token")
		 personis_um.um.mkcomponent(context=cur_context, componentobj=cobj)
		 ev = Personis_base.Evidence(source="fitbit-installer", evidence_type="explicit", value=self.access_token)	
		 ev.comment = "first installation of fitbit."
		 personis_um.um.tell(context=cur_context, componentid=componentid, evidence=ev)

		 componentid = "@apicall"
		 cobj = Personis_base.Component(Identifier=componentid, component_type="attribute", value_type="number",resolver=None,Description="Fitbit apicall for accessing data")
		 personis_um.um.mkcomponent(context=cur_context, componentobj=cobj)
		 ev = Personis_base.Evidence(source="fitbit-installer", evidence_type="explicit", value=1)	
		 ev.comment = "first call"
		 personis_um.um.tell(context=cur_context, componentid=componentid, evidence=ev)
                  
                 return "ok"
          except Exception,e:
                 print e
                 return "Error:"+str(e)

      def print_dict(self, cdate=None, value=None):
          global evidence_list 
          user_date = ""
          for nkey,nval in value.iteritems():
   	      udata = (nkey).decode("utf-8") 
	      nkey = udata.encode("ascii","ignore") 
           
           #if 'dataset' in nkey:
	      if 'dict' in str(type(nval)):
	          self.print_dict(cdate, nval)
	      elif 'list' in str(type(nval)):
	          self.print_list(cdate, nval)
	      else:
                  if 'time' in nkey: 
                      nval = str(cdate)+' '+str(nval)
                  if 'datasetInterval' not in nkey: 
                      data = str(nkey)+"="+str(nval)
                      #print "Data: "+data
                      evidence_list.append(data)

      def print_list(self, current_date=None, value=[]):
          for val in value:
              if 'dict' in str(type(val)):
                  self.print_dict(current_date, val)
              elif 'list' in str(type(val)):
                  self.print_list(current_date, val)
              else:
                  print "Value: "+val 
      """
      def add_evidence(self, um=None, context=[], component=None, value=None, comment=None, usertime=None):
          print component, value
          ev = Personis_base.Evidence(source="activate_fitbit.py", evidence_type="explicit", value=value)	
	  ev.comment = comment
          import time
	  ev.time=time.mktime(time.strptime(usertime, '%Y-%m-%d %H:%M:%S')) 
          um.tell(context=context, componentid=component, evidence=ev)
      """
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

      
      def tell_fitbit_data(self, personis_um, cid):
          j = 0
          global evidence_list
          for i in xrange(0, len(evidence_list), 1):           
              user_date = None
              value=""
              if j < len(evidence_list)-1: 
                 evd = evidence_list[j].split('=')
                 if evd[0] == 'value':
                 #print evidence_list[j]
                    value = int(evd[1])
                    if value != 0 and j < len(evidence_list)-1: 
		       #print evidence_list[j+1]         
		       evd = evidence_list[j+1].split('=')
	               user_date = evd[1]                          
                       personis_um.add_evidence(context=context, component=cid, value=value, comment=None, usertime=user_date)
                       print "Fitbit steps data on %s is %d" %(user_date, value)
  	         j = j+2
          """
          reslist = personis_um.um.ask(context=context, view=None, resolver={'evidence_filter':"all"}) 
          for res in reslist:
               for evd in res.evidencelist:
                   print evd.value, evd.time
          """
      def process_apicall(self, activity_key, access_token, current_date, form, time=False):
          try:
             if time == False:
                print current_date
  	        apicall_str = '/1/user/-/activities/log/'+form+'/date/'+str(current_date)+'/'+str(current_date)+'.json'

             else:
                now = datetime.datetime.now()  
                end_time = datetime.time(now)
	        end_time = datetime.datetime.fromtimestamp(int(start_time)).strftime('%H:%M')
                start_time = now - datetime.timedelta(minutes=30)
	        start_time = datetime.datetime.fromtimestamp(int(end_time)).strftime('%H:%M')
                #apicall_str = '/1/user/-/activities/log/calories/date/'+str(current_date)+'/1d/time/12:20/12:45.json'

	     print "@:"+str(current_date)
             print access_token
	     response = z.ApiCall(access_token, apiCall=apicall_str)
             print apicall_str
	     print response 
	     jdata = json.loads(response)

  	     #print jdata
	     for key, value in jdata.iteritems():
                  #print key
	          udata = (key).decode("utf-8") 
	          key = udata.encode("ascii","ignore") 
                  #print type(key),key
                  if activity_key in key:                            
	   	     if 'dict' in str(type(value)): self.print_dict(current_date, value)
		     elif 'list' in str(type(value)):self.print_list(current_date, value)
          except Exception,e:
            print e            



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
		      current_date=start_date+timedelta(days=i)
                      #print current_date, i
                      self.process_apicall(activity_key, access_token, current_date, form) 
              except Exception, e:
                      print e       
          
          try:
	       #perms = personis_um.getpermission(context=["Devices"], app='Fitbit')
               #rint perms
	       #if perms['tell'] == True:
	       #self.tell_fitbit_data(personis_um, form)   
               for evd in evidence_list:
                   print evd
               return "Success"
	  except Exception,e:
               print e 
               return str(e)     
          
      def track_intrday_fitbit(self):
          response = z.ApiCall(access_token, apiCall='/1/user/-/activities/date/2012-02-17.json')
          jdata = json.loads(response)
          for key, value in jdata.iteritems():
  	     udata = (key).decode("utf-8") 
	     key = udata.encode("ascii","ignore") 
             if key == 'summary':
                steps = value['steps']
                if steps < GOAL:
                   argument = 'python notify2.py '+ str(GOAL - steps)
                   os.system(argument)
                    
      def get_access_code(self, personis_um):
          ac_token_list = personis_um.get_evidence_new(context=['Admin'], componentid='@fitbit_access_token')
          if ac_token_list:
             ac_token = ac_token_list[0].value
             print ac_token
          return ac_token

      def get_fitbit_data(self, personis_um, start_date, end_date):

          ac_token_list = personis_um.get_evidence_new(context=['Admin'], componentid='@fitbit_access_token')
          if ac_token_list:
             ac_token = ac_token_list[0].value
             print ac_token
             self.get_intrday_fitbit_data(personis_um.um, ac_token, 'steps', start_date, end_date)
             #get_intrday_fitbit_data(personis_um.um, ac_token, 'calories', start_date, end_date)


      def track_minute_calories(self, personis_um):
          #apicall_str = "/1/user/-/activities/log/calories/date/2011-07-05/2011-07-05.json"

          evdlist = personis_um.get_evidence_new(context, componentid="steps")

          for ev in evdlist:
              try:
	         time = ev.time
	         import datetime
	         track_date = datetime.datetime.fromtimestamp(int(time)).strftime('%Y-%m-%d')
	         track_time = datetime.datetime.fromtimestamp(int(time)).strftime('%H:%M')
	         apicall_str = "/1/user/-/activities/log/calories/date/"+track_date+"/1d/time/"+track_time+"/"+track_time+".json"
  	         print apicall_str
	         response = z.ApiCall(access_token, apiCall=apicall_str)
	         jdata = json.loads(response)
	         print jdata

	         for key, value in jdata.iteritems():
                     print key
		     udata = (key).decode("utf-8") 
		     key = udata.encode("ascii","ignore") 
                     #print type(key),key
                     if 'activities-log-steps-intraday' in key:                            
		         if 'dict' in str(type(value)): self.print_dict(current_date, value)
		         elif 'list' in str(type(value)):self.print_list(current_date, value)            

              except Exception, e:
                   print e 

          self.tell_fitbit_data(personis_um, 'calories')   

      """
      def send_data(self, l, personis_um, auth_url, auth_token):
          try: 
            l.acquire()
	    conn = Client(('localhost',15000), authkey="12345")

	    op = "put"
            
	    key = 'oauth_token_secret'
	    value = auth_token.secret
	    conn.send({'action':op, 'key':key, 'val':value})
	    r = conn.recv()

	    key = 'oauth_token'
	    value = auth_token.key
	    conn.send({'action':op, 'key':key, 'val':value})
	    r = conn.recv()

	    key = 'oauth_callback_confirmed'
	    value = "true" 
	    conn.send({'action':op, 'key':key, 'val':value})
	    r = conn.recv()

	    key = 'modelname'
	    value = personis_um.modelname
            print value
	    conn.send({'action':op, 'key':key, 'val':value})
	    r = conn.recv()

	    key = 'username'
	    value = personis_um.username
	    conn.send({'action':op, 'key':key, 'val':value})
	    r = conn.recv()

	    key = 'password'
	    value = personis_um.password     
	    conn.send({'action':op, 'key':key, 'val':value})
	    r = conn.recv()

            key = 'open'
	    value = auth_url
            conn.send({'action':op, 'key':key, 'val':value})
            r = conn.recv()

	    conn.close()
            l.release()
          except Exception,e:
            print e

      """
