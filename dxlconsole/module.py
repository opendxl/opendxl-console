class Module(object):
    """
    The base class for pluggable modules within the console. The "fabric module"
    is an example of a module.
    """
    def __init__(self, app, name, title, icon_path, root_content_name):
        """
        Constructor parameters:

        :param app: The application that the module is a part of
        :param name: The name of the module
        :param title: The title for the module
        :param icon_path: The path to the icon for the module
        :param root_content_name: The name of the root content (in browser DOM) of the module
        """
        self._app = app
        self._name = name
        self._title = title
        self._icon_path = icon_path
        self._root_content_name = root_content_name

    def on_load(self, request):
        """
        Invoked when the module is loaded for initial display

        :param request: The HTTP request for the display
        """
        pass

    @property
    def app(self):
        """
        Returns the application that the module is a part of

        :return: The application that the module is a part of
        """
        return self._app

    @property
    def name(self):
        """
        Returns the name of the module

        :return: The name of the module
        """
        return self._name

    @property
    def title(self):
        """
        Returns the title of the module

        :return: The title of the module
        """
        return self._title

    @property
    def enabled(self):
        """
        Returns whether the module is enabled

        :return: Whether the module is enabled
        """
        return True

    @property
    def get_icon_path(self):
        """
        Returns the path to the icon for the module

        :return: The path to the icon for the module
        """
        return self._icon_path

    @property
    def content(self):
        """
        The content of the module (JS code)

        :return: The content of the module (JS code)
        """
        return None

    @property
    def root_content_name(self):
        """
        The name of the root content (in browser DOM) of the module
        :return: The name of the root content (in browser DOM) of the module
        """
        return self._root_content_name

    @property
    def handlers(self):
        """
        Web (Tornado) handlers for the module

        :return: The web (Tornado) handlers for the module
        """
        return []
