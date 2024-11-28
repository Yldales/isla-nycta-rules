import os
import json
import sys

INPUT_DIRECTORY = '../isla-nycta-json/dinosaurs'
OUTPUT_FILE = os.path.join('docs', 'pot', 'tiers.md')

def generate_markdown(dinosaurs):
    markdown = "# Dinosaurs Tiers\n\n"
    markdown += "| Tier | Name | Diet |\n"
    markdown += "|------|---------------|---------------|\n"
    
    for dino in sorted(dinosaurs, key=lambda x: x['tier']):
        markdown += f"| {dino['tier']} | {dino['name'].title()} | {dino['type'].title()} |\n"
    
    return markdown

def main():
    dinosaurs = []
    
    for filename in os.listdir(INPUT_DIRECTORY):
        if filename.endswith('.json'):
            try:
                with open(os.path.join(INPUT_DIRECTORY, filename), 'r') as file:
                    dinosaur = json.load(file)
                    dinosaurs.append(dinosaur)
            except (json.JSONDecodeError, IOError) as e:
                print(f"Error reading {filename}: {e}", file=sys.stderr)
    
    markdown_content = generate_markdown(dinosaurs)
    
    os.makedirs(os.path.dirname(OUTPUT_FILE), exist_ok=True)
    with open(OUTPUT_FILE, 'w') as output_file:
        output_file.write(markdown_content)

if __name__ == "__main__":
    main()