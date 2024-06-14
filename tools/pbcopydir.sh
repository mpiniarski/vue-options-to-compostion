#!/bin/bash

# Check if at least one directory or file path is provided
if [ $# -eq 0 ]; then
    echo "Usage: $0 <directory_or_file_path> [<directory_or_file_path> ...]"
    exit 1
fi

# Function to check if a file is binary
is_binary() {
    local FILE=$1
    if [[ $(file --mime "$FILE" | grep binary) ]]; then
        return 0
    else
        return 1
    fi
}

# Function to read files recursively and append to clipboard
copy_files_to_clipboard() {
    local ITEM=$1
    local CONTENT=""
    if [ -d "$ITEM" ]; then
        for FILE in "$ITEM"/*; do
            if [ -d "$FILE" ]; then
                CONTENT+=$(copy_files_to_clipboard "$FILE")
            elif [ -f "$FILE" ]; then
                CONTENT+="File: $FILE\n"
                if ! is_binary "$FILE"; then
                    CONTENT+=$(cat "$FILE")
                else
                    CONTENT+="[Binary file content not copied]\n"
                fi
                CONTENT+="\n\n"
            fi
        done
    elif [ -f "$ITEM" ]; then
        CONTENT+="File: $ITEM\n"
        if ! is_binary "$ITEM"; then
            CONTENT+=$(cat "$ITEM")
        else
            CONTENT+="[Binary file content not copied]\n"
        fi
        CONTENT+="\n\n"
    fi
    echo "$CONTENT"
}

# Clear the clipboard
pbcopy < /dev/null

# Process all provided directories and files
ALL_CONTENT=""
for ITEM in "$@"; do
    if [ -d "$ITEM" ] || [ -f "$ITEM" ]; then
        ALL_CONTENT+=$(copy_files_to_clipboard "$ITEM")
    else
        echo "Warning: $ITEM is not a valid directory or file."
    fi
done

# Copy all collected content to the clipboard
echo -e "$ALL_CONTENT" | pbcopy

echo "Selected files and their contents have been copied to the clipboard."
