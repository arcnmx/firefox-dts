from setuptools import setup

version = '@version@'

setup(
    name='xpidl-dts',
    version=version if not '@' in version else "0",
    install_requires=['xpidl'],
    scripts=['dts.py'],
    py_modules=['dts'],
)
