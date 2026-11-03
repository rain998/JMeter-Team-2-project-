import csv
import random

with open("users.csv", "w", newline ="") as file:
    writer  = csv.writer(file)
    writer.writerow(["username","password"])
    for i in range (141,201):
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
subtask_rows = []
task_id = 1
subtask_id = 1

counter = 141

# Looping through each user
for i, user in enumerate(users):
    username = user[username_col]

    # Each user gets one task
    task_rows.append({
        "username": username,
        "id": task_id,
        "task": "Sample Task",
        "completed": 0
    })

    # Users 171-200 have two subtasks
    if (counter >= 171) :
        for x in range(2):
            subtask_rows.append({
                "todo_id": task_id,
                "id": subtask_id,
                "task": "Sample subtask",
                "completed": 0
            })
            subtask_id += 1
    
    task_id += 1
    counter += 1
                
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
write_csv(
    "subtasks.csv",
    subtask_rows,
    ["todo_id", "id", "task", "completed"],
)

print("Task/subtask data generated successfully")