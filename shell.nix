{ pkgs ? import <nixpkgs> {} }:
let
  php = pkgs.php80.withExtensions ({ enabled, all }:
    enabled ++ [ all.ast ]);
in
pkgs.mkShell {
  buildInputs = with pkgs; [ php git nodejs php80Packages.composer ];
  shellHook =
    ''
       php -v;
       echo;
       echo 'To start a development LORIS web server run:';
       echo '    php -S localhost:8000 -t htdocs/ htdocs/router.php';
    '';
}
