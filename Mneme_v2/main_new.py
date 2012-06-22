#!/usr/bin/env python
#
#
# this program is using some code from Cherrypy and Personis tutorial

import os, sys

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
#from pytz import timezone, tzfile
#import pytz

import webbrowser

#Access Personis
#from Personis_Build_Model import *
from Personis_Access import *
from Personis_App_Manager import *
from Personis_Visualisation_Manager import *

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
import fitbit_plugin

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

def print_timing(func):
    def wrapper(*arg):
        t1 = time.clock()
        res = func(*arg)
        t2 = time.clock()
        print '%s took %0.3fms' % (func.func_name, (t2-t1)*1000.0)
        return res
    return wrapper

def write_log(mode,text):
    __time = datetime.datetime.fromtimestamp(int(time.time())).strftime("%a %b %d %H:%M:%S %Y")
    note = '['+__time+'] ['+mode+'] '+text+'\n'
    f = open('comment.log','a')
    f.write(note)
    f.close

#Main page
class WelcomePage():

    _cp_config = { 'tool.sessions.on': True }


    @print_timing
    def index(self):
        self.__curSession = "Session 1"
        self.__curComponent = 'None'
        self.__curContext = 'None'

        write_log('notice','Welcome to Mneme')

        genshi_tmpl = LoadGenshiTemplate(self.__curSession)
        return genshi_tmpl.welcome_template()
    index.exposed = True



    #----------------------------------Start Greetings functions--------------------------------------------------------#

   # Greet new user

    #@print_timing
    def greetUserNew(self, data=None):
        greeting = ""
        fname, lname, sex, modelname, username, password = data.split('_')
        self.__curSession = "Session 1"
        self.personis_mkmodel = Personis_Build_Model()
        if fname != None:
            # Greet the user!
            if lname != None:
                # make a user model
                print "%s %s" % (fname, lname)
                print "%s" % sex
                print "%s %s" % (modelname, username)
                try:
                    if(self.personis_mkmodel.build_model(fname, lname, sex, modelname, username,password)):
                    #if ACCESS_TYPE == 'Server':
                        greeting1 = "Congratulations"
                        greeting2 = "You have successfully built your user model. "
                        greeting2 += "Your username is:"+username+"  and your model dirctory is: "+modelname
                        self.personis_um = Personis_Access(ACCESS_TYPE, modelname, username, password)
                        self.username = username
                        self.password = password
                        self.modelname = modelname

                        #self.access_model(modelname, username, password)
                        self.personis_um.tell_login_time('log-in')
                        if self.personis_um.create_app_context():
                            print "Success"
                        else:
                            print "Error creating Apps"
                    else:
                        greeting1 = "Sorry"
                        greeting2 = "Model already exists or an Error occured while creating new model. "
                        greeting2 = greeting2 + ". Try again or Login to existing model. "

                    write_log('notice','Successfully modol created')

                except OSError, e:
                    greeting1 = "Sorry"
                    greeting2 = "Failed due to error: "+str(e)+" Contact Administrator."
                    __time = datetime.datetime.fromtimestamp(int(time.time())).strftime("%a, %d %b %Y %H:%M:%S +0000")
                    write_log('error','Login failure:'+str(e))

                message = greeting1+' '+fname+' '+lname+','+greeting2
                return message

    greetUserNew.exposed = True


    #Greet existing user
    def greetUser(self, data=None):
        t1 = time.clock()
        global tmpl
        self.__curSession = "Session 1"
        self.__curContext = "None"
        try:
            modelname, username, password = data.split('_')
            if((modelname!="")and(username!="")and(password!="")):
                self.personis_um = Personis_Access(ACCESS_TYPE, modelname, username, password)
                self.personis_app_manager = Personis_App_Manager(ACCESS_TYPE, self.personis_um)
                self.username = username
                self.password = password
                self.modelname = modelname

                #self.access_model(modelname, username, password)

                self.personis_um.tell_login_time('log-in')
                #self.applist = personis_um.get_list_apps()
                #self.um_applist = peronis_um.um.listapps()

                #sensor_list = list()
                #sensor_list=self.check_for_registered_sensors()
                #self.run_sensors(sensor_list)
                greeting1 = "Welcome"
                greeting2 = "You have successfully logged in \n your user model"

                write_log('notice','Successful login')


            else:
                greeting1 = "Sorry"
                username = ""
                greeting2="Login failure due to lack of sufficient information. Please provide all information currectly."

                write_log('error','Login failure due to lack of sufficient information')


        except Exception, e:
            print e
            greeting1 = "Sorry"
            greeting2 = "Your user model does not exist or "+str(e)+" Please build a new user model."
            write_log('error','Login failure:'+str(e))


        message = greeting1+' '+username+','+greeting2

        t2 = time.clock()
        print 'greetUser took %0.3fms' % ((t2-t1)*1000.0)

        return message

    greetUser.exposed = True


    #----------------------------------Start Browsing functions--------------------------------------------------------#

    #get directories and subdirectories for context
    def get_context_list(self):
        directory = []
        keys = ('dir','subdir')
        main_um_dirs = list()
        context_list = []
        context_list = self.personis_um.all_access_model()

        for context in self.context_list:
            temp_list = list()
            subcontext, component = self.personis_um.get_all_component(context_list);
            if subcontext:
                temp_list.append(context)
                temp_list.append(subcontext)
                data_dictionary = dict(itertools.izip(keys, temp_list))
                directory.append(data_dictionary)
        return directory,context_list

    # browse list of contexts
    @print_timing
    def browse(self,**data):
        self.browser_activities = self.personis_um.get_evidence_new(context = ['Admin'], componentid = 'browseractivity')
        self.__curAction = "Browser"
        self.context_list = []
        #size = self.personis_um.get_size()
        #print size

        self.modeltree = self.personis_um.build_modeldef_tree()
        genshi_tmpl = LoadGenshiTemplate(self.__curSession, self.username, self.browser_activities)

        if type(self.modeltree) is ListType:
            write_log('notice','Browser Clicked: Operation Successful')
            self.modeltree = sorted(self.modeltree, key=attrgetter('level', 'name'))
            return genshi_tmpl.browse_template(ACCESS_TYPE, self.modeltree, self.username)
        else:
            e = self.context_list
            write_log('error','Browser Clicked: Operation Failed; Error:'+str(e))

        return genshi_tmpl.greeting_template(e,"Browse")
    browse.exposed = True


    @print_timing
    def get_prev_context(self):
        try:
            context_list = self.__curContext.split('/')
            print context_list
            prev_context = '/'.join([str(x) for x in context_list[:-1]])
            print prev_context

            write_log('notice','Get previous operation successful')

            if len(prev_context) == 0:
                return "Main"
            return prev_context

        except Exception,e:
            print e
            write_log('error','Get previous context Operation Failed; Error:'+str(e))
            return "Error"
    get_prev_context.exposed = True

    #@print_timing
    def get_sub_context(self,context=None):

        try:
            #context_list = context_list.rstrip('')
            context_list = context.split('/')
            print context_list
            newlist = []
            contexts,components = self.personis_um.get_all_component(context_list);
            if type(contexts) is ListType:
                for sub in contexts:
                    context_list.append(sub)
                    newlist = []
                    subcontexts,components = self.personis_um.get_all_component(context_list);
                    if subcontexts:
                        context_list.remove(sub)
                        contexts.remove(sub)
                        sub += "_expand"
                        newlist.append(sub)
                    else:
                        context_list.remove(sub)
                contexts = contexts + newlist
                subcontext = json.dumps(contexts)
                write_log('notice','Get all subcontext successful')
                print subcontext
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
        self.browser_activities = self.personis_um.get_evidence_new(context = ['Admin'], componentid = 'browseractivity')
        print "Printing browser act.."
        print self.browser_activities

        t1 = time.clock()
        print context
        self.__curComponent = ""
        self.__curContext = context

        udata = context.decode("utf-8")
        context = udata.encode("ascii","ignore")
        context_list = context.split('/')

        genshi_tmpl = LoadGenshiTemplate(self.__curSession, self.username, self.browser_activities)
        try:
            #contexts, components = self.personis_um.all_access_model(context_list);
            contexts,components = self.personis_um.get_all_component(context_list);
            if type(contexts) is ListType:
                t2 = time.clock()
                print 'show_subcontext took %0.3fms' % ((t2-t1)*1000.0)
                write_log('notice','Subdirectories Clicked: operation successful')
                for item in self.modeltree:
                    if item.name == context_list[0]:
                        item.visited = 1
                    else:
                        item.visited = 0
                return genshi_tmpl.browse_sub_elements(self.__curContext, self.__curComponent, sorted(contexts), sorted(components,key=operator.attrgetter('Identifier')), self.modeltree)
            else:
                e = self.context_list
                write_log('error','Subdirectories Clicked: Operation Failed; Error:'+str(e))
                return genshi_tmpl.greeting_template(e, "Browse"+self.__curComponent, self.modeltree)

        except Exception,e:
            print e
            write_log('error','Sub browser Clicked: Operation Failed; Error:'+str(e))
            return genshi_tmpl.greeting_template(e, "Browse"+self.__curComponent, self.modeltree)
    show_sub_context.exposed = True

    def get_component_list(self,context=None):
        data = []
        print context
        self.__curComponent = ""
        self.__curContext = context
        udata = context.decode("utf-8")
        context = udata.encode("ascii","ignore")
        context_list = context.split('/')
        print context_list
        try:
            contexts,components = self.personis_um.get_all_component(context_list)
            if type(contexts) is ListType:
                for con in contexts:
                    data.append(con)
                for comp in components:
                    data.append(self.todict(comp, comp.Identifier))

                write_log('notice',' Get component list operation successful')

                return json.dumps(data)
        except Exception,e:
            print e
            write_log('error','Get component list Operation Failed; Error:'+str(e))
            return genshi_tmpl.greeting_template(e, "Browse"+self.__curComponent)

    get_component_list.exposed = True

    # get current component
    def get_component(self, componentid=None):
        self.__curComponent = componentid
        print componentid
        return "Success"
    get_component.exposed = True

    # upload jqrid table with evidencelist
    def users_json(self, rows=None, sidx=None, _search=None, searchField=None,
        searchOper=None, searchString=None, page=None, sord=None, nd=None): # 1 line
        """Returns all users from test_data in a json format that's compatible with jqGrid.""" # 2 lines
        t1 = time.clock()
        header = ["value", "flags", "source", "evidence_type", "creation_time", "time", "useby", "owner", "comment"] # 3 lines
        #users_list = test_data_to_list(test_data) # 4 lines
        genshi_tmpl = LoadGenshiTemplate(self.__curSession, self.username)

        if self.__curComponent != 'None':
            print "getting new"
            context = self.__curContext.split()
            reslist = self.personis_um.get_evidence_new(context, self.__curComponent)
            self.__curComponent = 'None'
        else:
            print "getting default"
            self.__curComponent = 'firstname'
            reslist = self.personis_um.get_evidence_new()

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
                print "Evidence: %d" %i
                for val in myEvd:
                    print val

            import my_jqGrid
            result_page = my_jqGrid.jqgrid_json(self, evdlist, header, rows=rows, sidx=sidx, _search=_search,
            searchField=searchField, searchOper=searchOper, searchString=searchString, page=page, sord=sord)

            t2 = time.clock()
            print 'user-json took %0.3fms' % ((t2-t1)*1000.0)
            write_log('notice','Show evidence list operation successful')

            return result_page

        else:
            print reslist
            e = reslist
            write_log('error','Show evidence list Operation Failed; Error:'+str(e))
            return genshi_tmpl.greeting_template(e,"Evidencelist upload")
    users_json.exposed = True

    #add new evidence to the model
    def add_new_evidence(self,data=None):
       #show_id = request.GET.get('name')
        res = ""
        t1 = time.clock()
        try:
            print data
            udata = data.decode("utf-8")
            data = udata.encode("ascii","ignore")
            if self.personis_um.add_new_evidence(self.__curContext, data):
                res = """ Successfully added"""
                write_log('notice','Add new evidence operation successful')

            else:
                res = """Failed to add"""
                write_log('error','Show evidence list Operation Failed; Error:'+str(res))

        except Exception, e:
            print e
            res = """Failed to add""" + str(e)
            write_log('error','Add new evidence Operation Failed; Error:'+str(e))

        t2 = time.clock()
        print 'add_new_evidence took %0.3fms' % ((t2-t1)*1000.0)
        return res
    add_new_evidence.exposed  = True

    def add_new_element(self,data):
        data = data.split('_')
        context = self.__curContext.split('/')
        if self.__curContext == "None" or data[3] == "Home":
            context = []
        print context
        if data[0] == 'component':
            try:
                self.personis_um.make_new_component(data[1],'attribute', 'string',None,data[2],context)
                write_log('notice','Add new component operation successful')

                return "Successfully added %s: %s" % (data[0],data[1])
            except Exception,e:
                print e
                write_log('error','Add new component Operation Failed; Error:'+str(e))

                return "Error in operation. Creation failed as %s" % str(e)
        elif data[0] == 'context':
            try:
                res = self.personis_um.make_new_context(data[1],data[2],context)
                if res == "Success":
                    write_log('notice','Add new context operation successful')

                    return "Successfully added %s: %s" % (data[0],data[1])
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
        genshi_tmpl = LoadGenshiTemplate(self.__curSession,self.username)
        return genshi_tmpl.app_template()
    apps_plugin.exposed = True

    @print_timing
    def show_unreg_apps(self):
        print "Showing unregistered apps"
        self.modeltree = self.personis_um.build_modeldef_tree()
        self.modeltree = sorted(self.modeltree, key=attrgetter('level', 'name'))
        self.browser_activities = self.personis_um.get_evidence_new(context = ['Admin'], componentid = 'browseractivity')
        genshi_tmpl = LoadGenshiTemplate(self.__curSession,self.username,self.browser_activities)
        try:
            #context_list = self.personis_um.all_access_model()
            self.applist = self.personis_app_manager.get_list_apps()
            print self.applist
            write_log('notice','Show unregistered apps list operation successful')

            return genshi_tmpl.unreg_apps_template(self.applist,self.modeltree)

        except Exception, e:
            write_log('error','Show unregistered list Operation Failed; Error:'+str(e))
            return genshi_tmpl.greeting_template('Unregistered App load fails: '+str(e),"Unregistered Apps", self.modeltree)


    show_unreg_apps.exposed = True


    def register_app(self, data):
        t1 = time.clock()
        res = ""
        try:
            print data
            if 'nogoals' not in data:
                self.__setgoal = True
            else:
                self.__setgoal = False

            result = self.personis_app_manager.register_app(data)

            if "Error" not in result:
                write_log('notice','Apps register operation successful')

                res = result
            else:
                res = "Error in opration "
                write_log('error','Apps register Operation Failed; '+result)

        except Exception,e:
            print e
            write_log('error','Apps regsiter Operation Failed; Error:'+str(e))

            res = "Error in opration "
        t2 = time.clock()
        print 'register_app took %0.3fms' % ((t2-t1)*1000.0)
        return res

    register_app.exposed = True

    @print_timing
    def show_reg_apps(self):
        self.browser_activities = self.personis_um.get_evidence_new(context = ['Admin'], componentid = 'browseractivity')
        print self.username
        print "Showing registered apps"
        global stream
        genshi_tmpl = LoadGenshiTemplate(self.__curSession, self.username, self.browser_activities)
        try:
            new_um_applist =self.personis_app_manager.get_register_applist()
            print new_um_applist
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

            return genshi_tmpl.greeting_template(err, "Show registered apps", self.modeltree)

    show_reg_apps.exposed = True

    def show_app_greeting(self):
        greeting = " Authorisation successful"
        return genshi_tmpl.greeting_template(greeting, "Show registered apps", self.modeltree)

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
            self.applist = self.personis_app_manager.get_list_apps()
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

        self.browser_activities = self.personis_um.get_evidence_new(context = ['Admin'], componentid = 'browseractivity')
        genshi_tmpl = LoadGenshiTemplate(self.__curSession,self.username, self.browser_activities)

        result = self.personis_app_manager.complete_fitbit_install(oauth_verifier)
        #Add installation evidence to 'browseractivity' component
        if result == 'ok':

            write_log('notice','Fitbit authentication operation successful')

            import datetime
            today = datetime.datetime.now()
            end_date = date(today.year, today.month, today.day)
            start_date = end_date-timedelta(days=2)
            self.personis_app_manager.get_minute_steps(start_date, end_date)
            #self.personis_um.add_rules(context=['Device','Fitbit'])
            return genshi_tmpl.fitbit_template("Fitbit Confirmation",self.__setgoal,self.modeltree)

        else:
            write_log('error','Fitbit authentication operation Failed; Error:'+str(result))

            return genshi_tmpl.greeting_template(result,"Message page",self.modeltree)
    fitbit_authentication.exposed = True

    def get_goals_json(self, appname=None):
        goal_list = []
        print appname
        try:
                #if appname == "Fitbit":
            goal_list = [{'goal':['Find out my current activity level','This goal will help you determine how much active you are. You will find out your activity level based on the Fitbit steps data.'],'duration':['1 week','1 week gives you reasonable time to find out your activity level.']},{'goal':['Daily step goal','This should be your goal after you have found out your current activity level'],'goal_unit':['Walking at least','steps in a day','For at least','days in a week'],'default_val':['10000','This number of steps is for the users who have not yet found out their baseline number of steps','7','Doing this activity every day of the week ensures consistency. If you change this, please do not set this less than 3 days. Study suggests even healthy people will develop higher blood sugar after only three days of a sedentary lifestyle.'],'duration':['4 weeks','4 weeks duration is good for setting short term goals. It helps you to be more focused and motivated.'] },{'goal':['Daily moderate activity','This goal offers you to do activities in a moderate level. Such activities will cause a slight, but noticeable, increase in your breathing and heart rate. A good example of moderate-intensity activity is brisk walking, that is at a pace where you are able to comfortably talk but not sing.'],'goal_unit':['Do at least' ,'minutes of moderate activity', 'For at least', 'days in a week'],'default_val':['30','You can accumulate your 30 minutes (or more) throughout the day by combining a few shorter sessions of activity of around 10 to 15 minutes each.','3','Study suggests even healthy people will develop higher blood sugar after only three days of a sedentary lifestyle.'], 'duration':['4 weeks','4 weeks duration is good for setting short term goals. It helps you to be more focused and motivated.']}]

            import json
            subcat_json = json.dumps(goal_list)
            print subcat_json

            write_log('notice','Get Goals operation successful')

            return subcat_json
        except Exception,e:

            write_log('error','Get Goals Operation Failed; Error:'+str(e))

            return json.dumps('Error:'+str(e))
    get_goals_json.exposed = True

    def set_goals(self,goal):

        context = ['Health']
        ctx_obj = Personis_base.Context(Identifier="Goals",
                                          Description="Applications available for use",
                                          perms={'ask':True, 'tell':True, "resolvers":["all","last10","last1","goal"]},                                                                                           resolver=None, objectType="Context")


        print "Creating Goal context "
        self.personis_um.um.mkcontext(context,ctx_obj)
        context.append('Goals')
        goal = "Dummy goal"
        try:
            self.personis_um.make_new_component(goal,'attribute', 'string',None,'None',context)
            self.personis_um.add_evidence(context=['Admin'], component='browseractivity', value="Goal:"+goal+" is set", comment="/show_sub_context?context=Health/Goals")

            write_log('notice','Set goals operation successful')

            return "Success"
        except Exception,e:
            write_log('error','Set Goals Operation Failed; Error:'+str(e))

            return "Error: "+str(e)
    set_goals.exposed = True

    def browse_goals(self):
        self.browser_activities = self.personis_um.get_evidence_new(context = ['Admin'], componentid = 'browseractivity')
        self.__curAction = "Goals"
        self.context_list = []
        self.modeltree = self.personis_um.build_modeldef_tree()
        #self.modeltree = set(self.modeltree)
        genshi_tmpl = LoadGenshiTemplate(self.__curSession, self.username, self.browser_activities)

        if type(self.modeltree) is ListType:
            write_log('notice','Goals Clicked: Operation Successful')
            self.modeltree = sorted(self.modeltree, key=attrgetter('level', 'name'))
            return genshi_tmpl.browse_goal_template(ACCESS_TYPE, self.modeltree, self.username)
        else:
            e = self.context_list
            write_log('error','Goals Clicked: Operation Failed; Error:'+str(e))

        return genshi_tmpl.greeting_template(e,"Goals",self.modeltree)

    browse_goals.exposed = True

    def run_sensor_apps(self):
        import fitbit_plugin
        fitbit_plugin.get_fitbit_data(self.personis_um)
    run_sensor_apps.exposed = True
    #----------------------------------End Application functions -----------------------------------------------------------#



    #----------------------------------Start Visualisation functions--------------------------------------------------------#
    def show_size(self):
        t1 = time.clock()
        self.personis_vis = Personis_Visualisation_Manager(ACCESS_TYPE, self.personis_um)
        res = self.personis_vis.show_size(self.modeltree)

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
        self.personis_vis = Personis_Visualisation_Manager(ACCESS_TYPE, self.personis_um)
        res = self.personis_vis.show_health()
        t2 = time.clock()
        write_log('notice','Show health visualisation')
        print 'show_health took %0.3fms' % ((t2-t1)*1000.0)
        return res

    show_health.exposed = True

    #@print_timing
    def show_graph_hc(self,data=None):
        write_log('notice','Get data from um for visualisation')
        self.personis_vis = Personis_Visualisation_Manager(ACCESS_TYPE, self.personis_um)
        return self.personis_vis.show_graph_hc(data)

    show_graph_hc.exposed = True

    def show_goals(self):
        t1 = time.clock()
        self.personis_vis = Personis_Visualisation_Manager(ACCESS_TYPE, self.personis_um)
        res = self.personis_vis.show_goals()
        t2 = time.clock()
        write_log('notice','Show goals visualisation')
        print 'show_goal took %0.3fms' % ((t2-t1)*1000.0)
        return res

    show_goals.exposed = True

    @print_timing
    def show_people(self):
        write_log('notice','Show people visualisation')
        self.personis_vis = Personis_Visualisation_Manager(ACCESS_TYPE, self.personis_um)
        return self.personis_vis.term_cloud()

    show_people.exposed = True

    #@print_timing
    def show_timeline(self):
        write_log('notice','Show timeline visualisation')
        self.personis_vis = Personis_Visualisation_Manager(ACCESS_TYPE, self.personis_um)
        return self.personis_vis.show_timeline()

    show_timeline.exposed = True

    #@print_timing
    def show_annual(self):
        write_log('notice','Show annual visualisation')
        self.personis_app_manager = Personis_App_Manager(ACCESS_TYPE, self.personis_um)
        #self.personis_app_manager.get_fitbit_data()
        self.personis_um.get_size()
        self.personis_vis = Personis_Visualisation_Manager(ACCESS_TYPE, self.personis_um)
        return self.personis_vis.annual_records()

    show_annual.exposed = True

    def show_calories(self):
        #self.personis_app_manager = Personis_App_Manager(ACCESS_TYPE, self.personis_um)
        #self.personis_app_manager.get_calorie_data()
        self.personis_vis = Personis_Visualisation_Manager(ACCESS_TYPE, self.personis_um)
        write_log('notice','Show calories visualisation')
        fitbit_plugin.get_fitbit_data(self.personis_um)
        self.personis_vis.show_graph_steps()
        return self.personis_vis.annual_records()

    show_calories.exposed = True

    def get_timeline_data(self):
        return self.personis_vis.get_timeline_data()
    get_timeline_data.exposed = True



    #----------------------------------End Visualisation functions---------------------------------------------------------------#

    @print_timing
    def help_um(self):
        genshi_tmpl = LoadGenshiTemplate(self.__curSession,)
        e = " This page is under development. Thank you for patience."
        return genshi_tmpl.greeting_template(e,"Help page",self.modeltree)
    help_um.exposed = True


    def show_tabhelp(self):

        genshi_tmpl = LoadGenshiTemplate(self.__curSession)
        return genshi_tmpl.show_help()

    show_tabhelp.exposed = True


    def open_page():
        webbrowser.open_new("http://127.0.0.1:8080/")
    open_page.exposed = True

    def comment_log(self,comment):
        __time = datetime.datetime.fromtimestamp(int(time.time())).strftime("%a %b %d %H:%M:%S %Y")
        comment = comment.split('_')
        note = '['+__time+'] ['+comment[0]+'] '+comment[1]+'\n'

        f = open('comment.log','a')
        f.write(note)
        f.close()
        return "Success"
    comment_log.exposed = True

    def logout(self):
        self.personis_um = None
        genshi_tmpl = LoadGenshiTemplate(self.__curSession)
        write_log('notice','Log out operation successful')
        return genshi_tmpl.welcome_template()
    logout.exposed = True


#cherrypy.root.browse = BrowsePage()

if __name__ == '__main__':


    cherrypy.config.update('global.conf')
    cherrypy.quickstart(WelcomePage(),'/',config='app.conf')
    #import subprocess
    #ret = subprocess.call(["ssh","chai@vm1-chai2","python /home/chai/um-browser/serv.py"]);


    #cherrypy.engine.subscribe('start', open_page)
    #cherrypy.server.start()
    #cherrypy.server.start_with_callback(
    #        webbrowser.open,
    #        ('http://localhost:8080',),
    #        )
