try:
    from configparser import ConfigParser # pylint: disable=unused-import
except ImportError:
    from ConfigParser import ConfigParser


def read_file(config_parser, file_like_obj):
    return config_parser.read_file(file_like_obj) \
        if hasattr(config_parser, "read_file") else \
        config_parser.read_fp(file_like_obj)
