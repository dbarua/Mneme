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


#Apps model
from AppList import *
from Personis_Access import *
import fitbit, json
from fitbit_plugin import *


class Personis_App_Manager(object):
    def __init__(self,access_type=None, um_object=None):
        self.access_type = access_type
        #self.personis_um = Personis_Access()
        self.personis_um = um_object
        if self.personis_um.create_app_context():
            print "Success"
        else:
            print "Error creating Apps"

    
    # Get list of Apps

    def build_list_apps(self):
        applist = list()
        applist.append(AppList("Fitbit","Activate",False,"Extract fitbit data about activity. This device can help you in achieving long term goals for maintaining activity and well-being","/static/images/fitbit.png",50))
        applist.append(AppList("GmailSensor","Activate",False,"Extract google mails from google IMAP server","/static/images/gmail.png",100))
        return applist


    def get_list_apps(self):
        self.applist = self.build_list_apps()
        self.um_applist =  self.personis_um.um_applist()
        if self.um_applist:
            for key in self.um_applist.keys():
                print key
                for app in self.applist:
                    if(app.appname==key):
                        self.applist.remove(app)

        for app in self.applist:
            print app.appname

        return self.applist

    def get_register_applist(self):
        test_applist = list()
        self.um_applist = self.personis_um.um_applist()
        if self.um_applist:
            apps_list = self.um_applist
            print apps_list
            for key in apps_list.keys():
                test_applist.append(AppList(key,"Activate",True,"","",""))


            new_um_applist = list(set(test_applist))

            for key in new_um_applist:
                udata = (key.appname).decode("utf-8")
                adata = udata.encode("ascii","ignore")
                try:
                    print adata
                    context, reslist = self.personis_um.get_all_component(['Devices'])
                    #context2, reslist2 = self.personis_um.get_all_component(['Devices'])
                    #context.append(context2)
                    #reslist.append(reslist2)
                    print key.appname
                    if reslist:
                        for res in reslist:
                            for evd in res.evidencelist:

                                if evd['value'] == "Activated":
                                    print evd['value']
                                    key.activate = "Deactivate"
                                elif evd['value'] == "Inactivated":
                                    print evd['value']
                                    key.activate = "Activate"
                except Exception,e:
                    print e
                    return e
            return new_um_applist
        else:
            return "No registered plugin found"

    def register_app(self,data):

        try:
            #cl = cherrypy.request.headers['Content-Length']
            #data = cherrypy.request.body.read(int(cl))


            app_info = data.split("_")
            print "App infos: Name %s, description %s, password %s"%(app_info[0],app_info[1],app_info[2])
            
            #---Storage preferences
            sum_data = app_info[1]
            old_sum_data = app_info[2]
            detailed_data = app_info[3]
            
            appdetails = ""
            try:
                appdetails = self.personis_um.um.registerapp(app_info[0], "", "fitbit_pass")
                print "Registered ok: ", appdetails
            except Exception,e:
                import traceback
                print "Error:"+ str(e)
                traceback.extract_stack()
            
            print "List the registered apps:"

            apps = self.um_applist
            for key in apps.keys():
                self.applist.append(AppList(key,"Activate",True,"","",""))
            print apps


            #permission#
            ask = tell = True
            """
            permission = app_info[3].split(' ')
            print permission[0], permission[1]
            if 'ask' in permission:
                 ask = True
            if 'tell' in permission:
                 tell = True
            """
            resolvers = ['last1','last10','all','goal']
            print "Set some permissions for the new app"
            self.personis_um.um.setpermission(context=["Apps"], app=app_info[0], permissions={'ask':ask, 'tell':tell, "resolvers":resolvers})

            print "Show the permissions:"
            perms = self.personis_um.um.getpermission(context=["Apps"], app=app_info[0])
            print "New App:", perms


            try:
                #argument = "python "+filename[2]+" "+self.personis_um.modelname+" "+self.personis_um.username+" "+self.personis_um.password+" "+model_dir+" "+" > out_address_list"
                #print argument
                #os.system(argument)
                #self.personis_um.add_evidence(context=['Admin'], component='browseractivity', value=app_info[0]+" Plugin is installed", comment="")
                if app_info[0]=="Fitbit":
                    self.manage_store_preferences(app_info[0], sum_data, old_sum_data, detailed_data)
                    url = self.create_app_plugin(app_info[0],"Activity")
                else:
                    url = "Work in Progress...."
                return url
            except Exception,e:
                print e
                return str(e)

        except Exception,e:
            print e
            return str(e)


    """
    def register_app(self,appname,description,notes,password,permission,resolvers,filename):
       print appname,description,notes,password,permission,resolvers,filename
       return "Success"
    register_app.exposed=True
    """
    def manage_app_data(self,data):

        app_info = data.split("_")
        print "App infos: Name %s, description %s, password %s"%(app_info[0],app_info[1],app_info[2])
            
        #---Storage preferences
        sum_data = app_info[1]
        old_sum_data = app_info[2]
        detailed_data = app_info[3]
        self.manage_store_preferences(app_info[0], sum_data, old_sum_data, detailed_data)
        
    def manage_store_preferences(self, app, sum_data, old_sum_data, detailed_data):
        #--------------Creating Memory preferences for Fitbit Plugin---------------------
        store_pref_context = ["Mneme","StoragePreference"] 
        if type(self.personis_um.get_context("Mneme")) != 'dict':
            try:
              self.personis_um.make_new_context("Mneme","",[])
              self.personis_um.make_new_context("StoragePreference","",["Mneme"])
              print "Creating Mneme context "                               
            except Exception,e:
              write_log('error','Mneme Context Creation Failed; Error:'+str(e))
              return "Error: "+str(e)
                       
                       
        self.personis_um.make_new_component('active','attribute', 'string',None,'None',store_pref_context)
        self.personis_um.make_new_component('longterm','attribute', 'string',None,'None',store_pref_context)
        self.personis_um.make_new_component('archive','attribute', 'string',None,'None',store_pref_context)
        self.personis_um.make_new_component('trash','attribute', 'string',None,'None',store_pref_context)
                        
        store_list = ['active','archive','longterm','trash']
        for store in store_list:
            if sum_data.find(store) != -1:
               self.personis_um.add_evidence(context=store_pref_context, component=store, value=sum_data)
                           
        for store in store_list:
            if old_sum_data.find(store) != -1:
                self.personis_um.add_evidence(context=store_pref_context, component=store, value=old_sum_data)
                              
        for store in store_list:
            if detailed_data.find(store) != -1:
               self.personis_um.add_evidence(context=store_pref_context, component=store, value=detailed_data)
         
    def activate_apps(self):
        if self.__current_app == "Gmail-Sensors":
            self.activate_gmail_sensor()

    def edit_app(self, **data):

        if cherrypy.request.method == 'POST':
            form = ExtractForm()
            try:
                data = form.to_python(data)
                print data["appname"]

                app_obj = Application(**data)
                print app_obj
                print "Register an app %s" %data['appname']

                appdetails = self.um.registerapp(app=data['appname'], desc=data['description'], password=data['password'])
                print "Registered ok: ", appdetails
                print "List the registered apps:"
                apps = self.um.listapps()
                print apps

                print "Set some permissions for the %s app" %data['appname']
                self.um.setpermission(context=["Apps"], app=data['appname'], permissions={'ask':data['ask'], 'tell':data['tell'], "resolvers":["last1", "goal"]})

                print "Show the permissions:"
                perms = self.um.getpermission(context=["Apps"], app=data['appname'])
                print "New App:", perms

            except Exception, e:
                print e
        else:
            errors = {}
        greeting1 = "Dear"
        fname = self.username
        greeting2="This page is under development. Thank you for patience."
        #greeting2 = "%s is successfully edited" %(data['appname'])

        tmpl = loader.load('greeting.html')
        stream = tmpl.generate(session=self.__curSession,greeting1=greeting1,fname=fname,greeting2=greeting2,who=self.username, where="Registered apps Page")
        return stream.render('xhtml')

    def delete_app(self, **data):
        if cherrypy.request.method == 'POST':
            form = ExtractForm()
            try:
                print "Delete the 'MyHealth' app while NOT accessing as owner"
                data = form.to_python(data)
                print data["appname"]

                app_obj = Application(**data)
                print app_obj
                try:
                    self.um.deleteapp(app=data['appname'])
                    greeting1 = "Dear"
                    fname = self.username
                    greeting2 = "%s is successfully deleted" %(data['appname'])
                except Exception as e:
                    print "deletapp failed with exception : %s\n" % (e)
                    greeting1 = "Sorry"
                    fname = self.username
                    greeting2 = "%s cannot be deleted" %(data['appname'])
                else:
                    print "FAILED: deleteapp should not be able to delete app when not owner"

            except Exception, e:
                print e
        else:
            errors = {}


    def create_app_plugin(self,appname=None,cname=None):
        print appname, cname
        try:
            """
            ctx_obj = client.Context(Identifier=appname,
                                            Description="Applications available for use",
                                            perms={'ask':True, 'tell':True, "resolvers":["all","last10","last1","goal"]},                                                                                           resolver=None, objectType="Context")
            context = ['Apps']
            print "Creating Applications context "
            self.personis_um.um.mkcontext(context,ctx_obj)
            context.append(appname)
            self.personis_um.make_new_component(cname,"activity", "number",None,'None',context)
            """
            if appname=="Fitbit":
                self.__fitbit = fitbit_plugin()
                url,token = self.__fitbit.install_fitbit(self.personis_um)
                self.__fitbit.oauth_token = token
                return url
            else:
                print "No api code available"
                return "Error:"+"No api code available"
        except Exception,e:
            print e
            return "Error:"+str(e)

    #-------------------------- Fitbit App ------------------------------#
    def complete_fitbit_install(self,oauth_verifier):
        print self.__fitbit.oauth_token
        result = self.__fitbit.complete_authentication(self.personis_um, oauth_verifier,self.__fitbit.oauth_token)
        return result

    def get_fitbit_data(self):
        z = fitbit.FitBit()

        auth_url, auth_token = z.GetRequestToken()

        print auth_url

        #auth_verifier= raw_input('Please copy the verifier code')

        #access_token = z.GetAccessToken(auth_verifier, auth_token)
        #access_token = 'oauth_token_secret=0048e221fa432edcad09eb1015aa9f57&oauth_token=2408b24acb803a8f32bc00c08fece346'


        date = self.personis_um.get_date()
        print date
        response = z.ApiCall(access_token, apiCall='/1/user/-/activities/log/steps/date/2012-02-15/1d.json')
        print response
        jdata = json.loads(response)
        print jdata

    def get_calorie_data(self):
        import fitbit_plugin        
        fitbit_plugin.track_minute_calories(self.personis_um)

    def get_minute_steps(self, start, end):
        self.__fitbit.get_fitbit_data(self.personis_um, start, end)
