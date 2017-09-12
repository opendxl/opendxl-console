from tornado.web import RequestHandler


class BaseRequestHandler(RequestHandler):

    def get_current_user(self):
        return self.get_secure_cookie("user")
