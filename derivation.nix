{ stdenvNoCC
, xpidl-dts ? buildPackages.callPackage ./xpidl-dts/derivation.nix { }
, firefox-idl ? callPackage ./firefox-idl/firefox-idl.nix { }
, nix-gitignore
, buildPackages, callPackage
}: stdenvNoCC.mkDerivation {
  pname = "firefox-dts";
  version = "0.0.1";

  nativeBuildInputs = [ xpidl-dts ];
  inherit firefox-idl;

  src = nix-gitignore.gitignoreSourcePure [ ''
    *.nix
    /firefox-idl/
    /xpidl-dts/
  '' ./.gitignore ] ./.;

  makeFlags = [
    "DTS_PY=dts.py"
    "FIREFOX_IDL_ROOT=$(firefox-idl)"
  ];

  installFlags = [
    "DESTDIR=${placeholder "out"}"
  ];

  preBuild = ''
    patchShebangs iterate_idl.sh
  '';

  enableParallelBuilding = true;
}
