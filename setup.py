import os

from setuptools import setup
import distutils.command.sdist

import setuptools.command.sdist

# Patch setuptools' sdist behaviour with distutils' sdist behaviour
setuptools.command.sdist.sdist.run = distutils.command.sdist.sdist.run

version_info = {}
cwd=os.path.abspath(os.path.dirname(__file__))
with open(os.path.join(cwd, "dxlconsole", "_version.py")) as f:
    exec(f.read(), version_info)

dist = setup(
    # Package name:
    name="dxlconsole",

    # Version number:
    version=version_info["__version__"],

    # Requirements
    install_requires=[
        "tornado",
        "dxlbootstrap>=0.1.3",
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
        "dxlconsole._config",
        "dxlconsole._config.sample",
        "dxlconsole._config.app",
        "dxlconsole.modules",
        "dxlconsole.modules.broker",
        "dxlconsole.modules.certificates",
        "dxlconsole.modules.monitor",
        "dxlconsole.web",
        "dxlconsole.web.jquery",
        "dxlconsole.web.images",
        "dxlconsole.web.isomorphic",
        "dxlconsole.web.isomorphic.locales",
        "dxlconsole.web.isomorphic.login",
        "dxlconsole.web.isomorphic.system",
        "dxlconsole.web.isomorphic.system.development",
        "dxlconsole.web.isomorphic.system.helpers",
        "dxlconsole.web.isomorphic.system.language",
        "dxlconsole.web.isomorphic.system.modules",
        "dxlconsole.web.isomorphic.system.modules-debug",
        "dxlconsole.web.isomorphic.system.schema",
        "dxlconsole.web.isomorphic.skins",
        "dxlconsole.web.isomorphic.skins.Tahoe",
        "dxlconsole.web.isomorphic.skins.Tahoe.fonts",
        "dxlconsole.web.isomorphic.skins.Tahoe.images",
        "dxlconsole.web.isomorphic.skins.Tahoe.images.actions",
        "dxlconsole.web.isomorphic.skins.Tahoe.images.button",
        "dxlconsole.web.isomorphic.skins.Tahoe.images.Calendar",
        "dxlconsole.web.isomorphic.skins.Tahoe.images.ColorPicker",
        "dxlconsole.web.isomorphic.skins.Tahoe.images.controls",
        "dxlconsole.web.isomorphic.skins.Tahoe.images.cssButton",
        "dxlconsole.web.isomorphic.skins.Tahoe.images.CubeGrid",
        "dxlconsole.web.isomorphic.skins.Tahoe.images.DatabaseBrowser",
        "dxlconsole.web.isomorphic.skins.Tahoe.images.DateChooser",
        "dxlconsole.web.isomorphic.skins.Tahoe.images.Dialog",
        "dxlconsole.web.isomorphic.skins.Tahoe.images.DynamicForm",
        "dxlconsole.web.isomorphic.skins.Tahoe.images.edges",
        "dxlconsole.web.isomorphic.skins.Tahoe.images.FileBrowser",
        "dxlconsole.web.isomorphic.skins.Tahoe.images.headerIcons",
        "dxlconsole.web.isomorphic.skins.Tahoe.images.ImgButton",
        "dxlconsole.web.isomorphic.skins.Tahoe.images.iOS",
        "dxlconsole.web.isomorphic.skins.Tahoe.images.ListGrid",
        "dxlconsole.web.isomorphic.skins.Tahoe.images.Menu",
        "dxlconsole.web.isomorphic.skins.Tahoe.images.MultiUploadItem",
        "dxlconsole.web.isomorphic.skins.Tahoe.images.NavigationBar",
        "dxlconsole.web.isomorphic.skins.Tahoe.images.Panel",
        "dxlconsole.web.isomorphic.skins.Tahoe.images.pickers",
        "dxlconsole.web.isomorphic.skins.Tahoe.images.Progressbar",
        "dxlconsole.web.isomorphic.skins.Tahoe.images.RecordEditor",
        "dxlconsole.web.isomorphic.skins.Tahoe.images.RichTextEditor",
        "dxlconsole.web.isomorphic.skins.Tahoe.images.SchemaViewer",
        "dxlconsole.web.isomorphic.skins.Tahoe.images.Scrollbar",
        "dxlconsole.web.isomorphic.skins.Tahoe.images.SectionHeader",
        "dxlconsole.web.isomorphic.skins.Tahoe.images.shared",
        "dxlconsole.web.isomorphic.skins.Tahoe.images.Slider",
        "dxlconsole.web.isomorphic.skins.Tahoe.images.Splitbar",
        "dxlconsole.web.isomorphic.skins.Tahoe.images.Tab",
        "dxlconsole.web.isomorphic.skins.Tahoe.images.TabSet",
        "dxlconsole.web.isomorphic.skins.Tahoe.images.TileGrid",
        "dxlconsole.web.isomorphic.skins.Tahoe.images.ToolStrip",
        "dxlconsole.web.isomorphic.skins.Tahoe.images.TransferIcons",
        "dxlconsole.web.isomorphic.skins.Tahoe.images.TreeGrid",
        "dxlconsole.web.isomorphic.skins.Tahoe.images.Window",
        "dxlconsole.web.isomorphic.skins.Tahoe.images.shared.shadows",
        "dxlconsole.web.isomorphic.skins.Tahoe.images.Tab.bottom",
        "dxlconsole.web.isomorphic.skins.Tahoe.images.Tab.left",
        "dxlconsole.web.isomorphic.skins.Tahoe.images.Tab.right",
        "dxlconsole.web.isomorphic.skins.Tahoe.images.Tab.top",
        "dxlconsole.web.isomorphic.skins.Tahoe.images.ToolStrip.button",
        "dxlconsole.web.isomorphic.skins.Tahoe.images.Window.icons"
    ],

    package_data={'': ['*.*'],
        "dxlconsole._config.sample" : ['*'],
        "dxlconsole._config.app" : ['*']},

    # Details
    url="",

    description="",

    long_description=open('README').read(),

    classifiers=[
        "Programming Language :: Python"
    ],
)
