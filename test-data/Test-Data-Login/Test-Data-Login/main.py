import csv
import secrets
import string

# CSV output filename
output_file = "test_user_credentials.csv"

# Characters allowed in passwords
characters = string.ascii_letters + string.digits + "!@#$%&*_-"

# Generate 40 username/password pairs
users = []

for i in range(1, 41):
    username = f"testuser{i:03d}"

    # Generate a random 16-character password
    password = "".join(
        secrets.choice(characters) for _ in range(16)
    )

    users.append({
        "username": username,
        "password": password
    })

# Write data to CSV
with open(output_file, "w", newline="", encoding="utf-8") as file:
    writer = csv.DictWriter(
        file,
        fieldnames=["username", "password"]
    )

    writer.writeheader()
    writer.writerows(users)

print("CSV file successfully generated!")
print(f"Total users created: {len(users)}")
print(f"File saved as: {output_file}")