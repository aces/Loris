from mkdocs.plugins import BasePlugin
from mkdocs.config import config_options

import os
import shutil
import sys

class RootPlugin(BasePlugin):
    config_scheme = (
        ('ignore_folders', config_options.Type(list, default=[])),
        ('ignore_hidden', config_options.Type(bool, default=True))
    )

    def __init__(self):
        self.docs_dir = "docs_"

    def on_pre_build(self, config):
        self.ignore_folders = self.config['ignore_folders']
        self.ignore_folders += [config['docs_dir'],
                                config['site_dir'],
                                self.docs_dir]
        self.ignore_hidden = self.config['ignore_hidden']
        # Update the docs_dir with our temporary one!
        self.orig_docs_dir = config['docs_dir']
        config['docs_dir'] = self.docs_dir
        # Add all md files from directory, keeping folder structure
        self.paths = self.gen_from_dir()
        
    def on_serve(self, server, config, **kwargs):
        builder = list(server.watcher._tasks.values())[0]['func']

        # still watch the original docs/ directory
        if os.path.exists(self.orig_docs_dir):
            server.watch(self.orig_docs_dir, builder)

        # watch all the doc files
        for orig, _ in self.paths:
            server.watch(orig, builder)

        return server

    def on_post_build(self, config):
        shutil.rmtree(self.docs_dir)

    def valid_dir(self, dir):
        if self.ignore_hidden and dir[0] == ".":
            return False
        if dir in self.ignore_folders:
            return False
        return True

    def gen_from_dir(self):
        paths = []
        for root, dirs, files in os.walk("."):
            for f in files:
                if any (s in f for s in ('.md', '.svg', '.png', '.jpg')):
                    doc_root = "./" + self.docs_dir + root[1:]
                    orig = "{}/{}".format(root, f)
                    new = "{}/{}".format(doc_root, f)
                    try:
                        os.makedirs(doc_root, exist_ok=True)
                        shutil.copy(orig, new)
                        paths.append((orig, new))
                    except Exception as e:
                        print("ERROR: {}.. skipping {}".format(e, orig))

            dirs[:] = [d for d in dirs if self.valid_dir(d)]
        return paths
