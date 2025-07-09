#!/usr/bin/env bash

set -Ee
set -o pipefail
set -o functrace

trap 'catch $? $LINENO ${BASH_SOURCE[0]}' EXIT
catch() {
  if [ "$1" != "0" ]; then
    # error handling goes here
    echo "[ERROR] in $(basename "$3") at line $2 (error code $1)"
  fi
}

SCRIPT_PATH="$(dirname "$(readlink -f "${BASH_SOURCE[0]}")")"

usage() {
  echo "Usage: $0 [options]"
  echo
  echo "Options:"
  echo "  -h, --help                    Show this help message"
  echo
}

main() {
  local HELM_RELEASE_NAME

  # Parse arguments
  while [[ $# -gt 0 ]]; do
    case "$1" in
    init)
      # Requisito: scaricare il file walle.sh con curl da Github
      # Steps:
      # 2. Scarica il progetto Walle da GitHub in una cartella temporanea
      # 3. Crea una nuova cartella con il nome del progetto (inserito come argomento)
      # 4. Sposta il contenuto della cartella temporanea nella nuova cartella*  (rimuovendo alcuni file non necessari)
      # 5. Crea un file di configurazione .walle.config.json con le informazioni del progetto e di quale walle ha usato per installarlo
      # 6. Esegue pulizie
      shift 2
      ;;
    update)
      # Requisito: aggiornare il progetto Walle
      # Steps:
      # 1. Scarica l'ultima versione del progetto Walle da GitHub in una cartella temporanea
      # 2. Aggiorna i file necessari nella cartella del progetto* (inserito come argomento)
      # 3. Aggiorna il file di configurazione .walle.config.json con le nuove informazioni
      # 4. Esegue pulizie
      shift 2
      ;;
    -h | --help)
      usage
      exit 0
      ;;
    *)
      usage
      exit 1
      ;;
    esac
  done
  # * Da input o da usa la configurazione .walle.config.json per aggiornare i file walle all'interno del progetto
}

main "$@"
