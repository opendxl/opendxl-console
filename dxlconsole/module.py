class Module(object):

    def __init__(self, app, name, title, icon_path, root_content_name):
        self._app = app
        self._name = name
        self._title = title
        self._icon_path = icon_path
        self._root_content_name = root_content_name

    @property
    def app(self):
        return self._app

    @property
    def name(self):
        return self._name

    @property
    def title(self):
        return self._title

    @property
    def enabled(self):
        return True

    @property
    def get_icon_path(self):
        return self._icon_path

    @property
    def content(self):
        return None

    @property
    def root_content_name(self):
        return self._root_content_name

    @property
    def handlers(self):
        return []
