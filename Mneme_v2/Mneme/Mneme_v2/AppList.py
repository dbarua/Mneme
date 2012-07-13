#!/usr/bin/env python


class AppList(object):
    def __init__(self, name, activate, reg, desc,img,imgh):
        self.appname = name
        self.activate = activate
        self.registered = reg
        self.description = desc
        self.image = img
        self.imageheight = imgh
