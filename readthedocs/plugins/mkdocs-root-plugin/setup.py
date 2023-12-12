import setuptools

setuptools.setup(
    name='mkdocs-root-plugin',
    version='0.0.1',
    python_requires='>=3',
    install_requires=[
        'mkdocs>=1.0.6',
        'click>=7.1'
    ],
    packages=setuptools.find_packages(),
    entry_points={
        'mkdocs.plugins': [
            'root = mkdocs_root_plugin.plugin:RootPlugin'
        ]
    }
)
