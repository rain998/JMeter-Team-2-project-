import csv 
with open("./users.csv", "w",newline ="") as file:
    writer  = csv.writer(file)
    writer.writerow(["username","password"])
    for i in range (21,201):
        username =f"testuser{i:03d}"
        password =f"password{i:03d}"
        writer.writerow([username, password])
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


task_rows = []
task_id = 1
subtask_rows = []
subtask_id = 1

counter = 21

for i, user in enumerate(users):
    username = user[username_col]

    # First 20 users will not have todos

    # Users 21-200 will have 1 todo
    if (counter >= 21):
        task_rows.append({
                "username": username,
                "id": task_id,
                "task": "Sample Task 1",
                "completed": 0
            })

        # Users 171-200 will have 2 subtasks
        if (counter >= 171):
            for x in range(2):
                subtask_rows.append({
                    "todo_id": task_id,
                    "id": subtask_id,
                    "task": "Sample subtask",
                    "completed": 0
                })
                subtask_id += 1
        task_id += 1

        task_rows.append({
                        "username": username,
                        "id": task_id,
                        "task": "Sample Task 1",
                        "completed": 0
                    })
        if (counter >= 171):
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