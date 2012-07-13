#for Activity
class ActivityType(object):
    def __init__(self, type_mail=None, count=None):
        self.type=type_mail
        self.time=count
    


class activity_a_day(object):
        '''each object of this class holds
        a particular date and
        number of received and sent mails on that date'''
        def __init__(self, date=None, count1=None, count2=None, count3=None, count4=None):
          self.mydate=date
          self.steps=count1
          self.active_hours = count2
          self.calorie=count3
          self.heartbeat=count4


class goal_activity(object):
        '''each object of this class holds
        a particular date and
        number of received and sent mails on that date'''
        def __init__(self, date=None, count1=None, count2=None, count3=None,notes=""):
          self.mydate=date
          self.steps=count1
          self.intense = count2
          self.moderate=count3
          self.note = notes



