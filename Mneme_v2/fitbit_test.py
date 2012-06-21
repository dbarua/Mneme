
from fitbit_plugin import *
from datetime import date, datetime, timedelta

#Personis
import Personis
import Personis_base, Personis_a
from Personis_util import printcomplist

from Personis_Access import *
from Personis_App_Manager import *
from Personis_Visualisation_Manager import *


fitbit = fitbit_plugin()
today = datetime.datetime.now()
end_date = date(2012, 3, 10)

start_date = end_date-timedelta(days=2)
print str(start_date)+'_'+str(end_date)
ACCESS_TYPE = 'Server'
try:
   personis_um = Personis_Access(ACCESS_TYPE, 'dbarua', 'Debjanee', 'qsbnjuj312')
except Exception,e:
   print e
#personis_app_manager = Personis_App_Manager(ACCESS_TYPE, personis_um)

res = fitbit.get_fitbit_data(personis_um, start_date, end_date)
print type(res)
#for r in res:
#   print r
#context = ['Devices','Fitbit','Activity']
#evd = personis_um.get_evidence_new(context,'steps')

