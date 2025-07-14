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

usage_init() {
  echo "Usage: $0 [options]"
  echo
  echo "Options:"
  echo "  -h, --help                    Show this help message"
  echo "  -n, --project-name <name>     Specify the project name (Required)"
  echo "  -d, --dir-path <path>         Specify the directory path for the project (Defaults to current directory)"
  echo
}

function download_project() {
  local dir_path="$1"

  if [ -z "${dir_path}" ]; then
    dir_path=$(mktemp -d)
  fi

  # Download the project from GitHub
  git clone https://github.com/FabrizioCafolla/walle-design-system "$dir_path"
  if [ $? -ne 0 ]; then
    echo "Failed to download the project from GitHub."
    exit 1
  fi
  echo "Project downloaded to temporary directory: $dir_path"
}

function create_project_directory() {
  local project_name="$1"
  if [ -z "$project_name" ]; then
    echo "Project name is required."
    exit 1
  fi

  mkdir -p "$project_name"
  if [ $? -ne 0 ]; then
    echo "Failed to create project directory: $project_name"
    exit 1
  fi
  echo "Project directory created: $project_name"
}

function create_config_file() {
  local project_name="$1"
  local config_file=".walle.config.json"

  # Create a configuration file with project details
  echo "{
  \"projectName\": \"${project_name}\",
  \"walleVersion\": \"$(git --git-dir="${SCRIPT_PATH}/.git" rev-parse HEAD)\",
  \"updatedAt\": \"$(date +%Y-%m-%dT%H:%M:%S)\"
}" >"${project_name}/${config_file}"

  if [ $? -ne 0 ]; then
    echo "Failed to create configuration file: ${config_file}"
    exit 1
  fi
  echo "Configuration file created: ${config_file}"
}

function sync_files() {
  local source_path="$1"
  local target_path="$2"

  if [ -z "$source_path" ] || [ -z "$target_path" ]; then
    echo "Source and target paths are required for synchronization."
    exit 1
  fi

  if [ -d "$source_path" ]; then
    mkdir -p "$target_path"
    if [ $? -ne 0 ]; then
      echo "Failed to create target directory: $target_path"
      exit 1
    fi
    cp -r "$source_path/" "$target_path/"
  elif [ -f "$source_path" ]; then
    cp "$source_path" "$target_path"
  else
    echo "Error synchronizing files from $source_path to $target_path."
    return 1
  fi

  echo "Files synchronized from ${source_path} to ${target_path}."
}
function sync_walle_files() {
  local temp_dir="$1"
  local project_name="$2"

  # Move files from the temporary directory to the project directory
  sync_files "${temp_dir}/lib/infrastructure/@walle" "${project_name}/lib/infrastructure/@walle"
  sync_files "${temp_dir}/lib/scripts/@walle" "${project_name}/lib/scripts/@walle"
  sync_files "${temp_dir}/lib/website/src/@walle" "${project_name}/lib/website/src/@walle"
  sync_files "${temp_dir}/.github/workflows/actions" "${project_name}/.github/workflows/actions"
  sync_files "${temp_dir}/lib/Makefile.walle" "${project_name}/lib/Makefile.walle"
  sync_files "${temp_dir}/lib/infrastructure/Makefile" "${project_name}/lib/infrastructure/Makefile"
  sync_files "${temp_dir}/lib/website/Makefile" "${project_name}/lib/website/Makefile"
  sync_files "${temp_dir}/walle.sh" "${project_name}/walle.sh"

  # Clean up temporary directory
  rm -rf "$temp_dir"

  create_config_file "${project_name}"
}

function init() {
  local PROJECT_NAME DIR_PATH

  DIR_PATH="$(pwd)" # Default to current directory

  while [[ $# -gt 0 ]]; do
    case "$1" in
    -n | --project-name)
      PROJECT_NAME="${2}"
      shift 2
      ;;
    -d | --dir-path)
      DIR_PATH="${2}"
      shift 2
      ;;
    -h | --help)
      usage_init
      exit 0
      ;;
    *)
      usage_init
      echo "Unknown command: $1"
      exit 1
      ;;
    esac
  done

  if [ -z "${PROJECT_NAME}" ]; then
    echo "Project name is required for initialization."
    exit 1
  fi

  if [ ! -d "${DIR_PATH}" ]; then
    mkdir -p "${DIR_PATH}"
  fi

  download_project "${DIR_PATH}/${PROJECT_NAME}"

  rm -rf "${DIR_PATH}/${PROJECT_NAME}/.git"

  echo "Walle project initialized successfully in ${DIR_PATH}/${PROJECT_NAME}."
}

function update() {
  local SOURCE_VERSION PROJECT_PATH

  SOURCE_VERSION="main"
  PROJECT_PATH="$(pwd)"
  TEMP_DIR="$(mktemp -d)"

  while [[ $# -gt 0 ]]; do
    case "$1" in
    -s | --source-version)
      SOURCE_VERSION="${2}"
      shift 2
      ;;
    -p | --project-path)
      PROJECT_PATH="${2}"
      shift 2
      ;;
    -h | --help)
      usage_init
      exit 0
      ;;
    *)
      usage_update
      echo "Unknown command: $1"
      exit 1
      ;;
    esac
  done

  if [ -z "${SOURCE_VERSION}" ]; then
    echo "Source version is required for update."
    exit 1
  fi

  if [ ! -d "${PROJECT_PATH}" ]; then
    echo "Project path does not exist: ${PROJECT_PATH}"
    exit 1
  fi

  download_project "${TEMP_DIR}" "${SOURCE_VERSION}"
  sync_walle_files "${TEMP_DIR}" "${PROJECT_PATH}"
  create_config_file "$(basename "${PROJECT_PATH}")"

  echo "Walle project updated successfully in ${PROJECT_PATH}."
}

main() {
  local command
  local args=()

  while [[ $# -gt 0 ]]; do
    case "$1" in
    init)
      command="init"
      shift
      ;;
    update)
      command="update"
      shift 2
      ;;
    -h | --help)
      usage
      exit 0
      ;;
    *)
      args+=("$1")
      shift
      ;;
    esac
  done
  # * Da input o da usa la configurazione .walle.config.json per aggiornare i file walle all'interno del progetto

  if ! ${command} "${args[@]}"; then
    echo "Command '$command' failed."
    exit 1
  fi
}

main "$@"
