import os
import glob
from PIL import Image

def compress_to_webp(source_path, target_path, max_size_kb=100):
    quality = 90
    img = Image.open(source_path)
    # Convert RGBA to RGB if saving without transparent requirement or keep RGBA for webp
    
    while True:
        img.save(target_path, 'WEBP', quality=quality)
        size_kb = os.path.getsize(target_path) / 1024
        if size_kb <= max_size_kb or quality <= 10:
            break
        quality -= 5
    return size_kb

def main():
    # 1. Convert all jpg and png to webp
    image_files = glob.glob('*.jpg') + glob.glob('*.jpeg') + glob.glob('*.png')
    converted = {}
    
    for file in image_files:
        filename, _ = os.path.splitext(file)
        target_file = f"{filename}.webp"
        
        # Don't overwrite existing user-added webp files unless necessary, but run compression logic on them? 
        # Actually user wants to convert the ones that are NOT webp yet
        size = compress_to_webp(file, target_file)
        print(f"Converted {file} -> {target_file} ({size:.2f} KB)")
        converted[file] = target_file
        
    # Also compress existing webp files if they are > 100kb? Wait, let's just compress what we have.
    # We will just replace references in HTML and CSS
    
    html_files = glob.glob('*.html')
    css_files = glob.glob('*.css')
    
    files_to_update = html_files + css_files
    
    for filepath in files_to_update:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
            
        original_content = content
        for old_img, new_img in converted.items():
            content = content.replace(old_img, new_img)
            
        if content != original_content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"Updated references in {filepath}")

if __name__ == '__main__':
    main()
