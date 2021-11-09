{ pkgs ? import <nixpkgs> { } }: with pkgs.lib; let
  xpidl-dts = pkgs.python3Packages.callPackage ./derivation.nix { };
in xpidl-dts
