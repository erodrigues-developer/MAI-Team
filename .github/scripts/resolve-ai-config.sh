#!/usr/bin/env bash
set -euo pipefail

provider="${AI_PROVIDER:-claude}"
provider="$(printf '%s' "$provider" | tr '[:upper:]' '[:lower:]')"

case "$provider" in
  claude|gpt|gemini|grok)
    ;;
  *)
    echo "::error::Unsupported AI provider '$provider'. Use one of: claude, gpt, gemini, grok."
    exit 1
    ;;
esac

default_model=""
default_version=""

case "$provider" in
  claude)
    default_model="claude-sonnet"
    default_version="4-20250514"
    ;;
  gpt)
    default_model="gpt-5"
    default_version=""
    ;;
  gemini)
    default_model="gemini-2.5-pro"
    default_version=""
    ;;
  grok)
    default_model="grok-code-fast"
    default_version="1"
    ;;
esac

model="${AI_MODEL:-$default_model}"
model_version="${AI_MODEL_VERSION:-$default_version}"
model_id="${AI_MODEL_ID:-}"

if [ -z "$model_id" ]; then
  if [ -n "$model_version" ]; then
    case "$model" in
      *"$model_version")
        model_id="$model"
        ;;
      *)
        model_id="${model}-${model_version}"
        ;;
    esac
  else
    model_id="$model"
  fi
fi

{
  echo "provider=$provider"
  echo "model=$model"
  echo "model_version=$model_version"
  echo "model_id=$model_id"
  echo "provider_label=${provider}:${model_id}"
} >> "$GITHUB_OUTPUT"
