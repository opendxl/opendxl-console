try:
    from configparser import ConfigParser # pylint: disable=unused-import
except ImportError:
    from ConfigParser import ConfigParser

try:
    from StringIO import StringIO # pylint: disable=unused-import
except ImportError:
    from io import StringIO

def read_file(config_parser, file_like_obj):
    return config_parser.read_file(file_like_obj) \
        if hasattr(config_parser, "read_file") else \
        config_parser.readfp(file_like_obj)
