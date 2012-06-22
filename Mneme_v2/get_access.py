#!/usr/lib/bin python

from fitbit_plugin import *
from datetime import date, datetime, timedelta

#Personis

from Personis_Access import *
from Personis_App_Manager import *
from Personis_Visualisation_Manager import *
ACCESS_TYPE = 'Server'

fitbit = fitbit_plugin()

try:
    #personis_um = Personis_Access(ACCESS_TYPE, 'james', 'James', 'secret')
    personis_um = Personis_Access(ACCESS_TYPE, 'dbarua', 'Debjanee', 'qsbnjuj312')
except Exception,e:
    print e

res = fitbit.get_access_code(personis_um)
print res
