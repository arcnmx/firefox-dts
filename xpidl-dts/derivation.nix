{ python3Packages
, nix-gitignore
, xpidl ? python3Packages.xpidl or (python3Packages.callPackage ../firefox-idl/xpidl.nix { })
, buildPythonPackage ? python3Packages.buildPythonPackage
}: buildPythonPackage {
  pname = "xpidl-dts";
  version = "0.0.1";

  propagatedBuildInputs = [ xpidl ];
  src = nix-gitignore.gitignoreSourcePure [ ''
    *.nix
  '' ../.gitignore ] ./.;

  postPatch = ''
    substituteAllInPlace setup.py
  '';
}
