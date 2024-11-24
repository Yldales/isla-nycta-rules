import os
import json
import sys

INPUT_DIRECTORY = '../isla-nycta-json/dinosaurs'
OUTPUT_FILE = 'schemas/dinosaurs.schema.json'

dinosaur_names = []

for filename in os.listdir(INPUT_DIRECTORY):
    if filename.endswith('.json'):
        file_path = os.path.join(INPUT_DIRECTORY, filename)
        with open(file_path, 'r') as file:
            data = json.load(file)
            if 'name' not in data:
                print(f"Error: 'name' not found in {filename}.")
                sys.exit(1)
            dinosaur_names.append(data['name'])

schema = {
    "type": "array",
    "items": {
        "type": "string",
        "enum": dinosaur_names
    }
}

with open(OUTPUT_FILE, 'w') as file:
    json.dump(schema, file, indent=4)

print(f"Schema generated successfully in {OUTPUT_FILE}.")