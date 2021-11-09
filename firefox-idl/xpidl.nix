{ python3Packages
, buildPythonPackage ? python3Packages.buildPythonPackage
, ply ? python3Packages.ply
, six ? python3Packages.six
, firefox-unwrapped
}: buildPythonPackage {
  pname = "xpidl";
  inherit (firefox-unwrapped) version src;

  propagatedBuildInputs = [ ply six ];

  postPatch = ''
    cd xpcom/idl-parser/xpidl
    substituteAll $setupPath setup.py
    mkdir xpidl
    mv __init__.py xpidl.py rust.py rust_macros.py header.py jsonxpt.py xpidl/

    substituteInPlace runtests.py \
      --replace 'import mozunit' "" \
      --replace 'mozunit.main(runwith="unittest")' 'unittest.main()'
    ln -s runtests.py test.py
  '';

  passAsFile = [ "setup" ];
  setup = ''
    from setuptools import setup

    setup(
      name='@pname@',
      version='@version@',
      install_requires=['ply', 'six'],
      scripts=['xpidl/xpidl.py', 'xpidl/header.py'],
      packages=['xpidl'],
    )
  '';

  postInstall = ''
    mv $out/bin/{xpidl.py,xpidl}
    mv $out/bin/{header.py,xpidl-cxx}
  '';
}
