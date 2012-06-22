#!/usr/bin/env python
#
#
# this program is using some code from Cherrypy and Personis tutorial

import os, sys

#Personis
import Personis
import Personis_base, Personis_a
from Personis_util import printcomplist

#Time, date, timezone
from datetime import date, time, timedelta
import time
#from pytz import timezone, tzfile
#import pytz

import gviz_api
import random, itertools, json

from Activity_Models import *
# Personis Configuration
#cfg = ConfigParser.ConfigParser()
#cfg.read(os.path.expanduser("~/.personis.conf"))
#personispath = cfg.get('paths', 'personis')
#print "Path:", personispath
#sys.path.insert(0, personispath)

#model_dir = '/home/dbarua/Desktop/llum/Personis/models'

#_curdir = os.path.join(os.getcwd(), os.path.dirname(__file__))
model_dir = '/home/chai/llum/Personis/models'

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
                       nc = list()     				#initialised for new context each time
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

