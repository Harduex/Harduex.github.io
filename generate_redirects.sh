#!/bin/bash

# === Configuration ===
# --- Set these variables to match your setup ---

# The full URL of your old website (where the blog currently is)
OLD_SITE_BASE_URL="https://harduex.com"

# The path to your blog on the old site. Must start and end with a slash if it's a directory.
# e.g., "/blog/" for www.my-domain.com/blog/
OLD_BLOG_PATH_PREFIX="/blog/"

# The full URL of your new blog subdomain
NEW_BLOG_BASE_URL="https://blog.harduex.com/"

# The local directory where the redirect HTML files will be created
# This directory will be created if it doesn't exist.
# The structure inside will mirror your old site, e.g., OUTPUT_DIR/blog/your-post.html
OUTPUT_DIR="./redirect_html_files"

# Path to your sitemap XML file
SITEMAP_FILE="sitemap.xml" # Change this to your sitemap's filename

# --- End of User Configuration ---

# === Script Logic ===

# Function to display usage
usage() {
    echo "Usage: $0 <path_to_sitemap.xml>"
    echo "If <path_to_sitemap.xml> is not provided, it will use SITEMAP_FILE from script config ('${SITEMAP_FILE}')."
    echo ""
    echo "Please ensure OLD_SITE_BASE_URL, OLD_BLOG_PATH_PREFIX, NEW_BLOG_BASE_URL, and OUTPUT_DIR are correctly set inside the script."
}

# Check if xmllint is installed
if ! command -v xmllint &>/dev/null; then
    echo "Error: xmllint is not installed. Please install it using:"
    echo "sudo apt-get install libxml2-utils"
    exit 1
fi

# Override SITEMAP_FILE if argument is provided
if [ -n "$1" ]; then
    SITEMAP_FILE="$1"
fi

# Check if sitemap file exists
if [ ! -f "$SITEMAP_FILE" ]; then
    echo "Error: Sitemap file '${SITEMAP_FILE}' not found."
    usage
    exit 1
fi

# Ensure OUTPUT_DIR exists
mkdir -p "$OUTPUT_DIR"
if [ ! -d "$OUTPUT_DIR" ]; then
    echo "Error: Could not create output directory '${OUTPUT_DIR}'."
    exit 1
fi
echo "Output directory set to: $(readlink -f "${OUTPUT_DIR}")"

# Normalize OLD_BLOG_PATH_PREFIX: ensure it starts and ends with a slash if not empty
if [ -n "$OLD_BLOG_PATH_PREFIX" ]; then
    if [[ ! "$OLD_BLOG_PATH_PREFIX" == /* ]]; then
        OLD_BLOG_PATH_PREFIX="/${OLD_BLOG_PATH_PREFIX}"
    fi
    if [[ ! "$OLD_BLOG_PATH_PREFIX" == */ ]]; then
        OLD_BLOG_PATH_PREFIX="${OLD_BLOG_PATH_PREFIX}/"
    fi
fi
echo "Normalized OLD_BLOG_PATH_PREFIX: '${OLD_BLOG_PATH_PREFIX}'"

# Normalize NEW_BLOG_BASE_URL: ensure it ends with a slash
if [[ ! "$NEW_BLOG_BASE_URL" == */ ]]; then
    NEW_BLOG_BASE_URL="${NEW_BLOG_BASE_URL}/"
fi
echo "Normalized NEW_BLOG_BASE_URL: '${NEW_BLOG_BASE_URL}'"

# Counter for processed files
processed_count=0
blog_urls_found=0

# Extract URLs from sitemap using xmllint
# This command extracts the text content of all <loc> elements.
echo "Processing sitemap file: ${SITEMAP_FILE}..."
xmllint --xpath "//*[local-name()='url']/*[local-name()='loc']/text()" "$SITEMAP_FILE" | while read -r old_url; do
    # Remove potential leading/trailing whitespace (though xmllint output is usually clean)
    old_url=$(echo "$old_url" | xargs)

    # Construct the full prefix to check against
    full_old_blog_prefix="${OLD_SITE_BASE_URL}${OLD_BLOG_PATH_PREFIX}"

    # Check if the URL is part of the old blog
    if [[ "$old_url" == ${full_old_blog_prefix}* ]]; then
        ((blog_urls_found++))
        echo "Found blog URL: $old_url"

        # Extract the path relative to the old site's root
        # e.g., if old_url is https://www.my-domain.com/blog/post.html, path_from_old_root is /blog/post.html
        path_from_old_root="${old_url#"$OLD_SITE_BASE_URL"}" # Removes OLD_SITE_BASE_URL from the beginning

        # Determine the path for the new blog (relative to the new blog's root)
        # e.g., if path_from_old_root is /blog/post.html, path_on_new_blog is post.html
        # (assuming OLD_BLOG_PATH_PREFIX is /blog/)
        path_on_new_blog="${path_from_old_root#"$OLD_BLOG_PATH_PREFIX"}"

        # Construct the new full URL
        new_full_url="${NEW_BLOG_BASE_URL}${path_on_new_blog}"

        # Determine the local file path for the redirect file
        local_file_path_in_output_dir="${OUTPUT_DIR}${path_from_old_root}"

        # If the original URL (or path_on_new_blog) ends with a slash, it's a directory; create an index.html file
        if [[ "$path_from_old_root" == */ ]]; then
            local_file_path_in_output_dir="${local_file_path_in_output_dir}index.html"
        elif [[ ! "$path_from_old_root" == *.* && ! "$path_from_old_root" == */ ]]; then
            # If it doesn't have an extension and doesn't end with a slash, assume it's a "clean URL"
            # that points to a directory. Create an index.html for it.
            # Example: /blog/my-category -> /blog/my-category/index.html
            mkdir -p "$(dirname "$local_file_path_in_output_dir")/${path_from_old_root##*/}" # Create the directory itself
            local_file_path_in_output_dir="${OUTPUT_DIR}${path_from_old_root}/index.html"
        fi

        # Create the directory structure for the file
        mkdir -p "$(dirname "$local_file_path_in_output_dir")"

        # Generate HTML redirect content
        # Note: Using bash's $'...' for newlines in the variable.
        # Using double quotes for variable expansion inside the heredoc.
        # Escaping backticks if used, though not in this template.
        redirect_html_content=$(
            cat <<EOF
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>This page has moved</title>
  <link rel="canonical" href="${new_full_url}" />
  <meta http-equiv="refresh" content="0; url=${new_full_url}">
  <script>
    window.location.replace("${new_full_url}");
  </script>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; padding: 20px; text-align: center; }
    p { margin-bottom: 10px; }
    a { color: #007bff; text-decoration: none; }
    a:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <p>This page has moved permanently.</p>
  <p>If you are not redirected automatically, please click this link: <a href="${new_full_url}">${new_full_url}</a>.</p>
</body>
</html>
EOF
        )
        # Write the HTML to the file
        echo "$redirect_html_content" >"$local_file_path_in_output_dir"
        echo "  Generated: $local_file_path_in_output_dir -> $new_full_url"
        ((processed_count++))
    fi
done

echo ""
echo "--- Script Finished ---"
if [ "$blog_urls_found" -eq 0 ]; then
    echo "No URLs matching '${OLD_SITE_BASE_URL}${OLD_BLOG_PATH_PREFIX}*' were found in the sitemap."
else
    echo "Found ${blog_urls_found} blog URLs in the sitemap."
    echo "${processed_count} redirect HTML files created in '${OUTPUT_DIR}'."
fi
echo "Please review the generated files in '${OUTPUT_DIR}'."
echo "You will need to upload the contents of this directory (e.g., the 'blog' folder if it was created inside) to the root of your OLD GitHub Pages repository (${OLD_SITE_BASE_URL})."
