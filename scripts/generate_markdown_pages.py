from jinja2 import Environment, FileSystemLoader
from jsonschema import validate
import json
import jsonschema
import os
import yaml
import collections


#==============================================================================#
# CONSTANTS
#==============================================================================#

SCHEMA_PATH = 'schemas/nycta.schema.json'
DINOSAURS_PATH = 'schemas/dinosaurs.schema.json'
TEMPLATE_DIR = 'templates'
TEMPLATE_FILE = 'templates/profile.html'
JSON_FILES_DIR = '../isla-nycta-json/dinosaurs'
OUTPUT_DIR = '../docs/pot'

#==============================================================================#
# REQUIRED FILES
#==============================================================================#

# ...
if not os.path.exists(SCHEMA_PATH):
    print(f"Error: Schema file {SCHEMA_PATH} does not exist.")
    exit(1)

with open(SCHEMA_PATH) as schema_file:
    print(f"Loading schema file {SCHEMA_PATH}.")
    schema = json.load(schema_file)

# ...
if not os.path.exists(DINOSAURS_PATH):
    print(f"Error: Dinosaurs file {DINOSAURS_PATH} does not exist.")
    exit(1)

with open(DINOSAURS_PATH) as f:
    print(f"Loading dinosaurs file {DINOSAURS_PATH}.")
    dinosaurs = json.load(f)

#==============================================================================#
# MAIN
#==============================================================================#

# Jinja2 template
if not os.path.exists(TEMPLATE_FILE):
    print(f"Error: Template file {TEMPLATE_FILE} does not exist.")
    exit(1)

env = Environment(loader=FileSystemLoader(TEMPLATE_DIR))
template = env.get_template(TEMPLATE_FILE)

# Get all JSON files in the specified directory
json_files = [f for f in os.listdir(JSON_FILES_DIR) if f.endswith('.json')]
print(f"Found {len(json_files)} JSON files to process.")

# Dictionary to collect the data for YAML output
yaml_output = collections.defaultdict(lambda: collections.defaultdict(dict))

for json_file in json_files:
    with open(os.path.join(JSON_FILES_DIR, json_file), 'r', encoding='utf-8') as f:
        try:
            data = json.load(f)
            validate(instance=data, schema=schema)

            # Jinja2 template rendering
            markdown = template.render(data)
            
            # Define the markdown file path
            markdown_file = os.path.join(OUTPUT_DIR, data['type'], f"{data['tier']}", f"{data['name'].lower()}.md")

            # Create the markdown file path if it doesn't exist
            os.makedirs(os.path.dirname(markdown_file), exist_ok=True)

            with open(markdown_file, 'w', encoding='utf-8') as md_file:
                md_file.write(markdown)
                print(f"Markdown file generated: {markdown_file}")

            # Collect data for YAML output
            tier_key = f"Tier {data['tier']}"
            yaml_output[data['type']][tier_key][data['name']] = f"pot/{data['type']}/{data['tier']}/{data['name'].lower()}.md"

        except jsonschema.exceptions.ValidationError as e:
            print(f"Validation error in {json_file}: {e.message}")

        except Exception as e:
            print(f"Error processing {json_file}: {e}")

# Sort the tiers in ascending order within each type
sorted_yaml_output = {type_: dict(sorted(tiers.items(), key=lambda t: int(t[0].split()[1]))) for type_, tiers in yaml_output.items()}

# Convert the sorted dictionary to the desired list format
final_output = []
for type_, tiers in sorted_yaml_output.items():
    type_dict = {type_: []}
    for tier, dinosaurs in tiers.items():
        tier_dict = {tier: [{name: path} for name, path in dinosaurs.items()]}
        type_dict[type_].append(tier_dict)
    final_output.append(type_dict)

# Print the collected data as YAML
print(yaml.dump(final_output, default_flow_style=False, sort_keys=False))