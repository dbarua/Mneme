#!/usr/bin/env python
import sys,os
from genshi.template import TemplateLoader 

loader = TemplateLoader(
    os.path.join(os.path.dirname(__file__), 'mytemplates'),
    auto_reload=True
)

class LoadGenshiTemplate(object):

        def __init__(self, session="", who="", browser_activity=[]):
                self.__curSession = session
                self.who = who
                self.browser_activity = browser_activity 

	def welcome_template(self):
		tmpl = loader.load('um_home.html')
		#tmpl = loader.load('browse_tabs.html')
		content = """"""
		stream = tmpl.generate(session=self.__curSession, title="Long term User Model Browser", headline="About Mneme", content=content)
		return stream.render('xhtml')


	def browse_template(self, access_type, context_list, username):
                   self.who = username
                   for b in self.browser_activity:
                       print b.value, b.time

		   text = " This page will help you to monitor the personal data captured in the user model. In this page, you can see a list of directories that hold information about different aspects of your life. Personal, for example, holds information related to your personal details and Health. Hove over the question mark to see what the corresponding directory means. Hover over the link to read some direction. Click a name to monitor the internal content of each directory. Check the boxes if you want to use some additional operations. "

		   if access_type == 'Base': tmpl = loader.load('browse_context.html')
		   else: #tmpl = loader.load('browse_context_server_new.html')
                     tmpl = loader.load('um_views.html')
		   stream = tmpl.generate(session=self.__curSession, title="Home",headline="List of contexts in the user model", context=context_list, about=text, who=self.who, where="Home", browser_activity=self.browser_activity)
		   return stream.render('xhtml')


	def browse_sub_elements(self,cur_context,cur_comp,contexts,components,context_list):
		   text = "This page will help you to monitor the personal data captured in the user model. In this page, you can see that list of sub-contexts asscoiated to you. Hover over the 'question' sign beside each of these contexts to find out what this means. Click an element to visualise the internal content. Use 'Back' button to browse back to previous page."
		   tmpl = loader.load('um_browse.html')
		   stream = tmpl.generate(session=self.__curSession, title=cur_context, headline="List of subdirectories and components in the user model", subdirs=contexts, components=components, content="", action="Browse", about=text, context=context_list, who=self.who, where="Home/"+cur_context, browser_activity=self.browser_activity)
		   return stream.render('xhtml')


	def greeting_template(self,data, where,context_list):
		   greeting1 = "Dear user "
		   fname = self.who
		   greeting2 = str(data)
                   content = greeting1+fname+" "
                   content += greeting2
	 	   tmpl = loader.load('greeting.html')
		   stream = tmpl.generate(session=self.__curSession, title="User Model Browser", headline="Special Message from Mneme Developers", content=content,about="",who=self.who, where=where,context=context_list, browser_activity=self.browser_activity)
		   return stream.render('xhtml')

	def app_template(self):
		tmpl = loader.load('welcome_app_new.html')
		print self.__curSession
		stream = tmpl.generate(session=self.__curSession,title="Application plugin",headline="Application Plugin Services", who=self.who, where="Application Plugin Page",browser_activity=self.browser_activity)
		return stream.render('xhtml')

	def unreg_apps_template(self,applist, context_list):
		keyword_list = [{"word":"Activity","about": "Creates model of your activity"},
		                {"word":"Sleep","about": "Creates model of your sleep"}, 
				{"word":"Food","about": "Creates model for your daily diet"},
		               ]
                text = "In this page you will find a number of apps plugin related to your personal devices and applications. Each of these plugins enables you to extract fine grained details of your personal information from the respective device. If you install 'MyFitbitSensor', for example you can extract you 'Fitbit' sensor data in your model. This plugins help to visualise personal information from different perspectives. Also this will help you to set goals and monitor progress."

		goals=['Walk x steps a day', 'Take at least x minutes of moderate exercise each day', 'Take at least x minutes of vigorous exercise each day', 'Avoid inactivity period longer than x minutes each day']      

		tmpl = loader.load('um_app_new.html')
		stream = tmpl.generate(session=self.__curSession, title="Show Unregistered Apps", headline="Available applications for registering", app_list=applist, context=context_list, keywordlist=keyword_list, who=self.who, where="Applications", about=text, browser_activity=self.browser_activity)        
		return stream.render('xhtml')

	def reg_apps_template(self,new_um_applist):
                text = "This page shows the list of regsitered apps in the user model."
		tmpl = loader.load('reg_applist_new.html')
		stream = tmpl.generate(session=self.__curSession, title="Show Registered Apps", headline="Available applications registered to the user model", app_list=new_um_applist,who=self.who, where="Applications/Registered Apps",about=text,browser_activity=self.browser_activity)        
		return stream.render('xhtml') 

        def browse_goal_template(self, access_type, context_list, username):
                   self.who = username
                   for b in self.browser_activity:
                       print b.value, b.time

		   text = " This page will help you to set and monitor the personal goals. In this page, you can see a list of directories that hold information about different goals."

		   if access_type == 'Base': tmpl = loader.load('browse_context.html')
		   else: #tmpl = loader.load('browse_context_server_new.html')
                     tmpl = loader.load('um_goals.html')
		   stream = tmpl.generate(session=self.__curSession, title="Goals",headline="List of contexts in the user model", context=context_list, about=text, who=self.who, where="Goals",browser_activity=self.browser_activity)
		   return stream.render('xhtml')

	def show_help(self):
		tmpl = loader.load('tabtest.html')
		print self.__curSession
		stream = tmpl.generate()
		return stream.render('xhtml')

        def fitbit_template(self, headline = "Fitbit Confirmation", setgoal=False,context_list=[]):
		tmpl = loader.load('fitbit_confirmation_new.html')
		print self.__curSession
		stream = tmpl.generate(session=self.__curSession, title=headline, headline=headline, setgoal=setgoal ,who=self.who, where="Fitbit Confirmation Page",browser_activity=self.browser_activity,about="",context=context_list)
		return stream.render('xhtml')
                
