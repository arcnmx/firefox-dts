{ pkgs ? import <nixpkgs> { } }: with pkgs.lib; let
  firefox-idl = import ./firefox-idl { inherit pkgs; };
  xpidl-dts = import ./xpidl-dts { inherit pkgs; };
  python = pkgs.python3.withPackages (p: [ firefox-idl.xpidl ]);
  packages = with pkgs; {
    inherit (firefox-idl) firefox-idl xpidl WebIDL;
    inherit xpidl-dts python;
    xpidl-dts-impure = writeShellScriptBin "dts.py" ''
      ${python}/bin/python ${toString ./xpidl-dts/dts.py} "$@"
    '';
    firefox-dts = callPackage ./derivation.nix { };
    shell = with packages; mkShell {
      DTS_PY = "${xpidl-dts-impure}/bin/dts.py";
      FIREFOX_IDL_ROOT = firefox-idl;

      nativeBuildInputs = [ gnumake python xpidl-dts-impure nodePackages.typescript ];
    };
  };
in packages.firefox-dts // packages
