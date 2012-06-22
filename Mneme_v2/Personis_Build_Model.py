#!/usr/bin/env python
#
#
# this program is using some code from Cherrypy and Personis tutorial

import os, sys

#Personis
import Personis
import Personis_base, Personis_a
from Personis_util import printcomplist

# Personis Configuration
#cfg = ConfigParser.ConfigParser()
#cfg.read(os.path.expanduser("~/.personis.conf"))
#personispath = cfg.get('paths', 'personis')
#print "Path:", personispath
#sys.path.insert(0, personispath)

#model_dir = '/home/dbarua/Desktop/llum/Personis/models'

#_curdir = os.path.join(os.getcwd(), os.path.dirname(__file__))
model_dir = '/home/chai/llum/Personis/models'

class Personis_Build_Model(object):
    def __init__(self):    
        self.um = None

    def build_model(self,fname=None, lname=None, sex=None, modelname=None, username=None,password=None):
	#argument = 'python /home/dbarua/Desktop/llum/Personis/Src/Utils/mkmodel.py /home/dbarua/Desktop/llum/Personis/Src/Modeldefs/user /home/dbarua/Desktop/llum/Personis/models ' + modelname + ':' + username + ':' + password +' > output 2> error_output'
	argument = 'python /home/chai/Personis-155/Personis/Src/Utils/mkmodel.py /home/chai/Personis-155/Personis/Src/Modeldefs/user /home/chai/Personis-155/Personis/models ' + modelname + ':' + username + ':' + password +' > output 2> error_output'
        print argument        
        try:
                   os.system(argument)
                   size_err = os.path.getsize('error_output')  
                   size_out = os.path.getsize('output')  
                   if(size_out > size_err):
                       self.fname=fname
                       self.lname=lname 
                       self.username = username
                       self.password = password 
                       self.modelname = modelname                                          
		       return True

                   else: 
                       f = open("error_output","r")
		       try:
			  lines = f.readlines()
		       finally:
			  f.close()  
                       return False 

        except Exception,e:
                   print e
                   return False

