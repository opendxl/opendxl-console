# pylint: disable=no-member, no-name-in-module, import-error

from __future__ import absolute_import
import glob
import os
import distutils.command.sdist
import distutils.log
import subprocess
from setuptools import Command, setup
import setuptools.command.sdist

# Patch setuptools' sdist behaviour with distutils' sdist behaviour
setuptools.command.sdist.sdist.run = distutils.command.sdist.sdist.run

VERSION_INFO = {}
CWD = os.path.abspath(os.path.dirname(__file__))
with open(os.path.join(CWD, "dxlconsole", "_version.py")) as f:
    exec(f.read(), VERSION_INFO)  # pylint: disable=exec-used


class LintCommand(Command):
    """
    Custom setuptools command for running lint
    """
    description = 'run lint against project source files'
    user_options = []
    def initialize_options(self):
        pass
    def finalize_options(self):
        pass
    def run(self):
        self.announce("Running pylint for library source files and tests",
                      level=distutils.log.INFO)
        subprocess.check_call(["pylint",
                               "dxlconsole/modules"] +
                              glob.glob("*.py") +
                              glob.glob("dxlconsole/*.py"))


class CiCommand(Command):
    """
    Custom setuptools command for running steps that are performed during
    Continuous Integration testing.
    """
    description = 'run CI steps (lint, test, etc.)'
    user_options = []
    def initialize_options(self):
        pass
    def finalize_options(self):
        pass
    def run(self):
        self.run_command("lint")

TEST_REQUIREMENTS = ["astroid<2.3.0", "pylint<=2.3.1"]

DEV_REQUIREMENTS = TEST_REQUIREMENTS + ["sphinx"]

setup(
    # Package name:
    name="dxlconsole",

    # Version number:
    version=VERSION_INFO["__version__"],

    # Requirements
    install_requires=[
        "tornado",
        "dxlbootstrap>=0.1.3",
        "dxlclient",
        "beautifulSoup4"
    ],

    tests_require=TEST_REQUIREMENTS,

    extras_require={
        "dev": DEV_REQUIREMENTS,
        "test": TEST_REQUIREMENTS
    },

    # Package author details:
    author="McAfee LLC",

    # License
    license="Apache License 2.0",

    # Keywords
    keywords=['opendxl', 'dxl', 'mcafee', 'console'],

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
        "dxlconsole.modules.topology",
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
    url="http://www.mcafee.com",

    description="Web-based console for interacting with a DXL fabric",

    long_description=open('README').read(),

    python_requires='>=2.7.9,!=3.0.*,!=3.1.*,!=3.2.*,!=3.3.*',

    classifiers=[
        "Development Status :: 4 - Beta",
        "Topic :: Software Development :: Libraries :: Python Modules",
        "License :: OSI Approved :: Apache Software License",
        "Programming Language :: Python",
        "Programming Language :: Python :: 2",
        "Programming Language :: Python :: 2.7",
        "Programming Language :: Python :: 3",
        "Programming Language :: Python :: 3.4",
        "Programming Language :: Python :: 3.5",
        "Programming Language :: Python :: 3.6",
        "Programming Language :: Python :: 3.7"
    ],

    cmdclass={
        "ci": CiCommand,
        "lint": LintCommand
    }
)
