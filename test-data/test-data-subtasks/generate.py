import csv
import random

with open("users.csv", "w", newline ="") as file:
    writer  = csv.writer(file)
    writer.writerow(["username","password"])
    for i in range (140,201):
        username =f"testuser{i:03d}"
        password =f"password{i:03d}"
        writer.writerow([username, password])
    file.close()
print("CSV file generated successfully.")

with open("users.csv", newline="", encoding="utf-8-sig") as f:
    reader = csv.DictReader(f)
    users = list(reader)
    f.close()

if not users:
    raise ValueError("users.csv is empty")

# Find the username column
username_col = next(
    (c for c in users[0] if c.strip().lower() in
     ("username", "user_name", "user")),
    None
)
if not username_col:
    raise ValueError("Could not find a username column in users.csv")

# For simplicity all users will start with tasks and subtasks
task_rows = []
task_id = 1

# Looping through each user
for i, user in enumerate(users):
    username = user[username_col]

    # Each user gets one or two tasks
    number_of_tasks = random.randint(1, 2)
    user_task_ids = []
    already_done = []

    # Randomly generate what tasks to do
    for x in range(number_of_tasks):
        task_rows.append({
            "username": username,
            "id": task_id,
            "task": "Sample Task",
            "completed": 0
        })
        task_id += 1
                
def write_csv(filename, rows, columns):
    with open(filename, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=columns)
        writer.writeheader()
        writer.writerows(rows)
        f.close()

write_csv(
    "todos.csv",
    task_rows,
    ["username", "id", "task", "completed"],
)

print("Task/subtask data generated successfully")