import os
import json
import yaml
import collections
from jinja2 import Environment, FileSystemLoader
from jsonschema import validate

#==============================================================================#
# CONSTANTS
#==============================================================================#

SCHEMA_PATH = 'schemas/nycta.schema.json'
DINOSAURS_PATH = 'schemas/dinosaurs.schema.json'
TEMPLATE_DIR = 'templates'
TEMPLATE_FILE = 'profile.html'
JSON_FILES_DIR = '../isla-nycta-json/dinosaurs'
OUTPUT_DIR = '../docs/pot'

#==============================================================================#
# FUNCTIONS
#==============================================================================#

def load_json_file(path, description):
    """Load and return JSON data from the given file path."""
    if not os.path.exists(path):
        print(f"Error: {description} file {path} does not exist.")
        exit(1)
    with open(path, 'r', encoding='utf-8') as file:
        print(f"Loading {description} file {path}.")
        return json.load(file)

def setup_template():
    """Set up and return the Jinja2 template."""
    template_path = os.path.join(TEMPLATE_DIR, TEMPLATE_FILE)
    if not os.path.exists(template_path):
        print(f"Error: Template file {TEMPLATE_FILE} does not exist at {TEMPLATE_DIR}.")
        exit(1)
    env = Environment(loader=FileSystemLoader(TEMPLATE_DIR))
    return env.get_template(TEMPLATE_FILE)

def process_json_files(template, schema):
    """Process JSON files and generate markdown files and YAML data."""
    json_files = [f for f in os.listdir(JSON_FILES_DIR) if f.endswith('.json')]
    print(f"Found {len(json_files)} JSON files to process.")
    yaml_output = collections.defaultdict(lambda: collections.defaultdict(dict))

    for json_file in json_files:
        json_path = os.path.join(JSON_FILES_DIR, json_file)
        try:
            with open(json_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
            validate(instance=data, schema=schema)

            markdown = template.render(data)
            markdown_file = os.path.join(
                OUTPUT_DIR, data['type'], str(data['tier']), f"{data['name'].lower()}.md"
            )
            os.makedirs(os.path.dirname(markdown_file), exist_ok=True)
            with open(markdown_file, 'w', encoding='utf-8') as md_file:
                md_file.write(markdown)
            print(f"Markdown file generated: {markdown_file}")

            tier_key = f"Tier {data['tier']}"
            relative_markdown_path = os.path.relpath(markdown_file, OUTPUT_DIR)
            yaml_output[data['type']][tier_key][data['name']] = relative_markdown_path

        except jsonschema.exceptions.ValidationError as e:
            print(f"Validation error in {json_file}: {e.message}")
        except Exception as e:
            print(f"Error processing {json_file}: {e}")

    return yaml_output

def generate_yaml_output(yaml_data):
    """Generate and print the YAML output."""
    sorted_yaml_output = {
        type_: dict(sorted(tiers.items(), key=lambda t: int(t[0].split()[1])))
        for type_, tiers in yaml_data.items()
    }
    final_output = []
    for type_, tiers in sorted_yaml_output.items():
        type_dict = {type_: []}
        for tier, dinosaurs in tiers.items():
            tier_dict = {tier: [{name: path} for name, path in dinosaurs.items()]}
            type_dict[type_].append(tier_dict)
        final_output.append(type_dict)
    print(yaml.dump(final_output, default_flow_style=False, sort_keys=False))

#==============================================================================#
# MAIN
#==============================================================================#

def main():
    schema = load_json_file(SCHEMA_PATH, "Schema")
    template = setup_template()
    yaml_data = process_json_files(template, schema)
    generate_yaml_output(yaml_data)

if __name__ == "__main__":
    main()