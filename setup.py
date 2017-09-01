from setuptools import setup
import distutils.command.sdist

import setuptools.command.sdist

# Patch setuptools' sdist behaviour with distutils' sdist behaviour
setuptools.command.sdist.sdist.run = distutils.command.sdist.sdist.run

VERSION = __import__('dxlconsole').get_version()

dist = setup(
    # Package name:
    name="dxlconsole",

    # Version number:
    version=VERSION,

    # Requirements
    install_requires=[
        "tornado",
        "dxlbootstrap",
        "dxlclient"
    ],

    # Package author details:
    author="",

    # License
    license="",

    # Keywords
    keywords=[],

    # Packages
    packages=[
        "dxlconsole",
        "dxlconsole.modules",
        "dxlconsole.modules.broker",
        "dxlconsole.modules.certificates",
        "dxlconsole.web",
        "dxlconsole.web.images",
        "dxlconsole.web.isomorphic",
        "dxlconsole.web.isomorphic.locales",
        "dxlconsole.web.isomorphic.login",
        "dxlconsole.web.isomorphic.skins",
        "dxlconsole.web.isomorphic.system",
        "dxlconsole.web.isomorphic.skins.Graphite",
        "dxlconsole.web.isomorphic.skins.Graphite.images",
        "dxlconsole.web.isomorphic.skins.Graphite.images.actions",
        "dxlconsole.web.isomorphic.skins.Graphite.images.button",
        "dxlconsole.web.isomorphic.skins.Graphite.images.Calendar",
        "dxlconsole.web.isomorphic.skins.Graphite.images.ColorPicker",
        "dxlconsole.web.isomorphic.skins.Graphite.images.controls",
        "dxlconsole.web.isomorphic.skins.Graphite.images.cssButton",
        "dxlconsole.web.isomorphic.skins.Graphite.images.CubeGrid",
        "dxlconsole.web.isomorphic.skins.Graphite.images.DatabaseBrowser",
        "dxlconsole.web.isomorphic.skins.Graphite.images.DateChooser",
        "dxlconsole.web.isomorphic.skins.Graphite.images.Dialog",
        "dxlconsole.web.isomorphic.skins.Graphite.images.DynamicForm",
        "dxlconsole.web.isomorphic.skins.Graphite.images.edges",
        "dxlconsole.web.isomorphic.skins.Graphite.images.FileBrowser",
        "dxlconsole.web.isomorphic.skins.Graphite.images.headerIcons",
        "dxlconsole.web.isomorphic.skins.Graphite.images.ImgButton",
        "dxlconsole.web.isomorphic.skins.Graphite.images.iOS",
        "dxlconsole.web.isomorphic.skins.Graphite.images.ListGrid",
        "dxlconsole.web.isomorphic.skins.Graphite.images.Menu",
        "dxlconsole.web.isomorphic.skins.Graphite.images.MultiUploadItem",
        "dxlconsole.web.isomorphic.skins.Graphite.images.NavigationBar",
        "dxlconsole.web.isomorphic.skins.Graphite.images.Panel",
        "dxlconsole.web.isomorphic.skins.Graphite.images.pickers",
        "dxlconsole.web.isomorphic.skins.Graphite.images.Progressbar",
        "dxlconsole.web.isomorphic.skins.Graphite.images.RecordEditor",
        "dxlconsole.web.isomorphic.skins.Graphite.images.RichTextEditor",
        "dxlconsole.web.isomorphic.skins.Graphite.images.SchemaViewer",
        "dxlconsole.web.isomorphic.skins.Graphite.images.Scrollbar",
        "dxlconsole.web.isomorphic.skins.Graphite.images.SectionHeader",
        "dxlconsole.web.isomorphic.skins.Graphite.images.shared",
        "dxlconsole.web.isomorphic.skins.Graphite.images.Slider",
        "dxlconsole.web.isomorphic.skins.Graphite.images.Splitbar",
        "dxlconsole.web.isomorphic.skins.Graphite.images.Tab",
        "dxlconsole.web.isomorphic.skins.Graphite.images.TabSet",
        "dxlconsole.web.isomorphic.skins.Graphite.images.TileGrid",
        "dxlconsole.web.isomorphic.skins.Graphite.images.ToolStrip",
        "dxlconsole.web.isomorphic.skins.Graphite.images.TransferIcons",
        "dxlconsole.web.isomorphic.skins.Graphite.images.TreeGrid",
        "dxlconsole.web.isomorphic.skins.Graphite.images.Window",
        "dxlconsole.web.isomorphic.skins.Graphite.images.shared.shadows",
        "dxlconsole.web.isomorphic.skins.Graphite.images.Tab.bottom",
        "dxlconsole.web.isomorphic.skins.Graphite.images.Tab.left",
        "dxlconsole.web.isomorphic.skins.Graphite.images.Tab.right",
        "dxlconsole.web.isomorphic.skins.Graphite.images.Tab.top",
        "dxlconsole.web.isomorphic.skins.Graphite.images.ToolStrip.button",
        "dxlconsole.web.isomorphic.skins.Graphite.images.Window.icons",
        "dxlconsole.web.isomorphic.system.development",
        "dxlconsole.web.isomorphic.system.helpers",
        "dxlconsole.web.isomorphic.system.language",
        "dxlconsole.web.isomorphic.system.modules",
        "dxlconsole.web.isomorphic.system.modules-debug",
        "dxlconsole.web.isomorphic.system.schema",
    ],

    package_data={'': ['*.*']},

    # Details
    url="",

    description="",

    long_description=open('README').read(),

    classifiers=[
        "Programming Language :: Python"
    ],
)
