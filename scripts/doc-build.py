#! /usr/bin/env python
# -*- coding: utf-8 -*-
"""\
Python script to build documentation in folder gh-pages.
"""

# BSD 3-Clause License
#
# Copyright (c) 2015, Nicolas Riesco and others as credited in the AUTHORS file
# All rights reserved.
#
# Redistribution and use in source and binary forms, with or without
# modification, are permitted provided that the following conditions are met:
#
# 1. Redistributions of source code must retain the above copyright notice,
# this list of conditions and the following disclaimer.
#
# 2. Redistributions in binary form must reproduce the above copyright notice,
# this list of conditions and the following disclaimer in the documentation
# and/or other materials provided with the distribution.
#
# 3. Neither the name of the copyright holder nor the names of its contributors
# may be used to endorse or promote products derived from this software without
# specific prior written permission.
#
# THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
# AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
# IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
# ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
# LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
# CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
# SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
# INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
# CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
# ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
# POSSIBILITY OF SUCH DAMAGE.

import json
import os
import shutil
import subprocess
import urllib2

import IPython
import nbconvert
import IPython.nbformat.v3 as nbformat
import jinja2


class Exporter(nbconvert.HTMLExporter):
    def __init__(self, template_file="full.tpl", **kw):
        if IPython.version_info[0] < 2:
            # Template "basic.tpl" is missing in IPython v1,
            # use fake "compat/basic.tpl" instead.
            super(nbconvert.HTMLExporter, self).__init__(extra_loaders=[
                jinja2.FileSystemLoader([
                    config["in_tpl"],
                    config["in_tpl_compat"],
                ]),
            ], **kw)
        else:
            super(nbconvert.HTMLExporter, self).__init__(extra_loaders=[
                jinja2.FileSystemLoader([
                    config["in_tpl"],
                ]),
            ], **kw)

        self.template_file = template_file


def render(title, infilename, outfilename):
    if os.path.basename(os.path.dirname(outfilename)) == "doc":
        exporter = config["exporter_doc"]
    else:
        exporter = config["exporter_root"]

    if infilename.endswith(".md"):
        render_markdown(exporter, title, infilename, outfilename)
    else:
        render_notebook(exporter, title, infilename, outfilename)


def render_notebook(exporter, title, infilename, outfilename):
    resources = {
        "title": title,
        "navbar": config["navbar"],
    }

    html, resources = exporter.from_filename(
        infilename,
        resources=resources
    )

    with open(outfilename, "w") as outfile:
        outfile.write(html)


def render_markdown(exporter, title, infilename, outfilename):
    notebook = config["nb_empty"]
    resources = {
        "title": title,
        "navbar": config["navbar"],
        "md": subprocess.check_output([
            "pandoc",
            "--from=markdown_github-hard_line_breaks",
            "--to=html",
            infilename,
        ])
    }

    html, resources = exporter.from_notebook_node(
        notebook,
        resources=resources
    )

    with open(outfilename, "w") as outfile:
        outfile.write(html)


def render_css(outfilename):
    exporter = config["exporter_css"]
    notebook = config["nb_empty"]
    resources = {}

    css, resources = exporter.from_notebook_node(
        notebook,
        resources=resources
    )

    with open(outfilename, "w") as outfile:
        outfile.write(css)


def make_folders():
    if os.path.exists(config["out"]):
        shutil.rmtree(config["out"])

    for path in [
        config["out"],
        config["out_doc"],
        config["out_jsdoc"],
        config["out_js"],
        config["out_css"],
    ]:
        os.mkdir(path)


def copy_images():
    if os.path.exists(config["out_images"]):
        shutil.rmtree(config["out_images"])

    shutil.copytree(
        config["in_images"],
        config["out_images"],
    )


def build_css():
    nbcss = "nb.css"
    render_css(
        os.path.join(config["out_css"], nbcss)
    )

    customcss = "custom.css"
    shutil.copyfile(
        os.path.join(config["in_tpl"], customcss),
        os.path.join(config["out_css"], customcss)
    )


def build_root():
    render(
        "Overview",
        os.path.join(config["root"], "README.md"),
        os.path.join(config["out"], "index.html")
    )

    render(
        "Contribution guidelines",
        os.path.join(config["root"], "CONTRIBUTING.md"),
        os.path.join(config["out"], "contributing.html")
    )


def build_doc():
    navbar = config["navbar"]

    docs = [
        ("Installation", navbar["Installation"]),
        ("Usage", navbar["Usage"]),
    ]

    for title, filename in navbar["Features"].iteritems():
        docs.append(
            (title[4:], filename)
        )

    for author, tutorials in navbar["Tutorials"].iteritems():
        for title, filename in tutorials.iteritems():
            docs.append(
                (author + ": " + title[4:], filename)
            )

    for title, filename in docs:
        render(
            title,
            os.path.join(config["in_doc"], filename),
            os.path.join(config["out_doc"], filename + ".html")
        )


def build_jsdoc():
    outfolder = config["out_jsdoc"]
    if os.path.exists(outfolder):
        shutil.rmtree(outfolder)

    subprocess.check_call([
        "jsdoc",
        "-c",
        os.path.join(config["in_jsdoc"], "conf.json"),
    ])


def download_libs():
    urls = [
        "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/css/bootstrap.min.css",
    ]
    folder = config["out_css"]
    download(urls, folder)

    urls = [
        "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/js/bootstrap.min.js",
        "https://cdnjs.cloudflare.com/ajax/libs/html5shiv/3.7.2/html5shiv.min.js",
        "https://cdnjs.cloudflare.com/ajax/libs/respond.js/1.4.2/respond.min.js",
        "https://cdnjs.cloudflare.com/ajax/libs/require.js/2.1.10/require.min.js",
        "https://cdnjs.cloudflare.com/ajax/libs/jquery/2.0.3/jquery.min.js",
    ]
    folder = config["out_js"]
    download(urls, folder)


def download(urls, folder):
    for url in urls:
        filename = url.split("/")[-1].split("?")[0]
        outfilename = os.path.join(folder, filename)
        tmpfilename = outfilename + ".tmp"
        try:
            with open(tmpfilename, "wb") as tmpfile:
                shutil.copyfileobj(
                    urllib2.urlopen(url, timeout=10),
                    tmpfile
                )
        except urllib2.URLError:
            os.remove(tmpfilename)
            raise
        os.rename(outfilename + ".tmp", outfilename)


def main():
    print "Building IJavascript website..."
    make_folders()
    copy_images()
    build_css()
    build_root()
    build_doc()

    print "Generating JSDoc documentation..."
    build_jsdoc()

    print "Downloading CSS and JS libraries..."
    try:
        download_libs()
        print "Done."
    except urllib2.URLError:
        print "Download failed."


# Global settings
config = {}

# Folders
config["root"] = os.path.dirname(
    os.path.realpath(os.path.dirname(__file__))
)
config["in_images"] = os.path.join(config["root"], "images")
config["in_doc"] = os.path.join(config["root"], "doc")
config["in_tpl"] = os.path.join(config["in_doc"], "nbconvert")
config["in_tpl_compat"] = os.path.join(config["in_tpl"], "compat")
config["in_jsdoc"] = os.path.join(config["root"], "jsdoc")
config["out"] = os.path.join(config["root"], "gh-pages")
config["out_doc"] = os.path.join(config["out"], "doc")
config["out_jsdoc"] = os.path.join(config["out"], "jsdoc")
config["out_images"] = os.path.join(config["out"], "images")
config["out_js"] = os.path.join(config["out"], "js")
config["out_css"] = os.path.join(config["out"], "css")

# Empty notebook
config["nb_empty"] = nbformat.NotebookNode({
    "metadata": {
        "name": ""
    },
    "worksheets": [],
    "cells": []
})

# List of notebooks
with open(os.path.join(config["in_doc"], "navbar.json")) as infile:
    config["navbar"] = json.load(infile)

# Exporters
config["exporter_root"] = Exporter("root.tpl")  # For files in the root folder
config["exporter_doc"] = Exporter("doc.tpl")  # For files in the doc folder
config["exporter_css"] = Exporter("css.tpl")  # To generate nbconvert CSS


if __name__ == "__main__":
    main()
