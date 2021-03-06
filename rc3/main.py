#!/usr/bin/env python
#
# Copyright 2011 de Mobo Inc.
#
# AUTOGENERATED: Any changes made in this file will be overwritten.
#
import os
from google.appengine.ext import webapp
from google.appengine.ext.webapp import util


class MainHandler(webapp.RequestHandler):
    def get(self):
        self.response.out.write('Hello de Mobo world!')

def main():
    application = webapp.WSGIApplication([('/', MainHandler)],
                                         debug=os.environ.get('SERVER_SOFTWARE', '').startswith('Dev'))
    util.run_wsgi_app(application)


if __name__ == '__main__':
    main()
