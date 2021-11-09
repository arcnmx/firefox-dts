{ python3Packages
, buildPythonPackage ? python3Packages.buildPythonPackage
, ply ? python3Packages.ply
, firefox-unwrapped
, parallel
}: buildPythonPackage {
  pname = "WebIDL";
  inherit (firefox-unwrapped) version src;

  propagatedBuildInputs = [ ply ];

  postPatch = ''
    cd dom/bindings/parser
    substituteAll $setupPath setup.py

    sed -i '1 i\#!/usr/bin/env python' WebIDL.py
  '';

  checkInputs = [ parallel ];
  checkPhase = ''
    runHook preCheck
    parallel -j $NIX_BUILD_CORES --halt now,fail=1 -m --max-args 2 python runtests.py ::: tests/*
    runHook postCheck
  '';

  passAsFile = [ "setup" ];
  setup = ''
    from setuptools import setup

    setup(
      name='@pname@',
      version='@version@',
      install_requires=['ply'],
      scripts=['WebIDL.py'],
      py_modules=['WebIDL'],
    )
  '';

  postInstall = ''
    mv $out/bin/{WebIDL.py,WebIDL}
  '';
}
