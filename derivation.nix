{ stdenvNoCC
, cmake, ninja
, cmake-lib ? buildPackages.callPackage ./cmake/lib/derivation.nix { }
, xpidl-dts ? buildPackages.callPackage ./xpidl-dts/derivation.nix { }
, firefox-idl ? callPackage ./firefox-idl/firefox-idl.nix { }
, typescript ? buildPackages.nodePackages.typescript
, nix-gitignore
, buildPackages, callPackage
}: stdenvNoCC.mkDerivation {
  pname = "firefox-dts";
  version = "0.1.0";

  nativeBuildInputs = [ xpidl-dts cmake ninja typescript cmake-lib ];

  src = nix-gitignore.gitignoreSourcePure [ ''
    *.nix
    /firefox-idl/
    /xpidl-dts/
    /cmake/lib/
  '' ./.gitignore ] ./.;

  cmakeFlags = [
    "-DFIREFOX_IDL_ROOT=${firefox-idl}"
  ];

  installFlags = [
    "DESTDIR=${placeholder "out"}"
  ];
}
