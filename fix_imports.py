import os

target_dir = r'smart-gas-monitoring/src/ui'
replacements = [
    ('@/smart-gas-monitoring/lib/utils', '../../lib/utils'),
    ('@/smart-gas-monitoring/src/ui/', './'),
    ('@/smart-gas-monitoring/hooks/', '../../hooks/')
]

modified_files = []

for filename in os.listdir(target_dir):
    if filename.endswith('.jsx'):
        filepath = os.path.join(target_dir, filename)
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        new_content = content
        for old, new in replacements:
            new_content = new_content.replace(old, new)
        
        if new_content != content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            modified_files.append(filename)

print("Modified files:")
for f in modified_files:
    print(f)
