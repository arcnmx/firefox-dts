{ firefox-unwrapped, jq }: firefox-unwrapped.overrideAttrs (old: rec {
  pname = "firefox-idl";
  name = "${pname}-${old.version}";

  buildFlags = [ "export" ];
  installFlags = [ "DESTDIR=$(out)" "-f${./Makefile}" ];
  preInstall = ''
    export sourceRoot
  '';
  doInstallCheck = false;

  nativeBuildInputs = old.nativeBuildInputs ++ [ jq ];
})
