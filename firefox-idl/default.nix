{ pkgs ? import <nixpkgs> { } }: with pkgs.lib; let
  firefox-idl = pkgs.callPackage ./firefox-idl.nix { };
  xpidl = pkgs.python3Packages.callPackage ./xpidl.nix { };
  WebIDL = pkgs.python3Packages.callPackage ./webidl.nix;
  packages = {
    inherit firefox-idl xpidl WebIDL;
  };
in packages.firefox-idl // packages
