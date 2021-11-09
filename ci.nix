{ pkgs, lib, ... }: with pkgs; with lib; let
  firefox-dts = import ./. { inherit pkgs; };
in {
  name = "firefox-dts";
  ci.gh-actions.enable = true;
  cache.cachix.arc.enable = true;
  channels = {
    nixpkgs = "21.05";
  };
  tasks = {
    build.inputs = with firefox-dts; [
      firefox-dts firefox-idl xpidl xpidl-dts WebIDL
    ];
  };
}
