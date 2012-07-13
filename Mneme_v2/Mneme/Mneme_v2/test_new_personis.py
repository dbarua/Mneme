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

    #---- Test Access Personis UM -------#
    personis_um = Personis_Access(ACCESS_TYPE, 'Alice', 'alice', 'secret')
    res = "Success"

    #---- Test Model Tree with Context and Subcontexts -------#
    model = personis_um.build_modeldef_tree()
    for m in model:
        print m.name, m.parent, m.children, m.expand, m.level

    #---- Test Add Evidence and Get the Evidence Value  -------#
    personis_um.add_evidence(context=['Personal'], component='firstname', value="Rakhee", comment="This is my real name")
    evdlist = personis_um.get_evidence_new(context=['Personal'], componentid='firstname',resolver={'evidence_filter':"all"})
    for e in evdlist:
        print e.value

    #---- Test Make new context, Make new component to that context and Add new evidence to that evidence -------#
    personis_um.make_new_context(context_id="Travel",desc="Information related to my travel",context=[''])
    personis_um.make_new_context("China","my China tour infos", ['Travel'])
    personis_um.make_new_component('places','attribute', 'string',None,'None',['Travel','China'])
    personis_um.add_evidence(context=['Travel','China'], component='places', value="Tiananmen Square", comment="")
    personis_um.add_evidence(context=['Travel','China'], component='places', value="Great Wall", comment="")

    evdlist = personis_um.get_evidence_new(context = ['Travel','China'], componentid = 'places')
    for b in evdlist:
        print b.value

    #---- Test Get Context with Size -------#
    contextinfo = personis_um.get_context(['Travel','China'],True)
    print contextinfo

    #perm = personis_um.getpermission(context=['Travel','China'], app)
except Exception,e:
    print e

#res = fitbit.get_access_code(personis_um)
print res
