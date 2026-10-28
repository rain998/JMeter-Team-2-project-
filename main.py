
import csv
from pathlib import Path

with open("users.csv", newline="", encoding="utf-8-sig") as f:
    reader = csv.DictReader(f)
    users = list(reader)

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

# First 40% create tasks
task_users_count = int(len(users) * 0.40)
task_users = users[:task_users_count]

# 30% of all users create subtasks;
# these users must also own tasks
subtask_users_count = int(len(users) * 0.30)
subtask_users = task_users[:subtask_users_count]

task_rows = []
subtask_rows = []
task_id = 1

task_names = ["Buy groceries", "Clean the room"]
subtask_names = [
    ["Buy milk", "Buy bread"],
    ["Pick up clothes", "Wipe the desk"],
]

for i, user in enumerate(task_users):
    username = user[username_col]

    # Each selected user gets one or two tasks
    number_of_tasks = 1 + (i % 2)
    user_task_ids = []

    for j in range(number_of_tasks):
        current_id = f"TASK{task_id:04d}"
        task_rows.append({
            "username": username,
            "id": current_id,
            "task": task_names[j],
        })
        user_task_ids.append((current_id, j))
        task_id += 1

    # Only the selected 30% create subtasks.
    # Each subtask-owning user gets up to two subtasks
    if i < subtask_users_count:
        parent_id, template_index = user_task_ids[0]

        for title in subtask_names[template_index]:
            subtask_rows.append({
                "username": username,
                "id": parent_id,
                "subtask": title,
            })

def write_csv(filename, rows, columns):
    with open(filename, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=columns)
        writer.writeheader()
        writer.writerows(rows)

write_csv(
    "tasks.csv",
    task_rows,
    ["username", "task_id", "task_title"],
)
write_csv(
    "subtasks.csv",
    subtask_rows,
    ["username", "task_id", "subtask_title"],
)

print(f"Total users: {len(users)}")
print(f"Task users: {len(task_users)}")
print(f"Subtask users: {len(subtask_users)}")
print(f"Tasks created: {len(task_rows)}")
print(f"Subtasks created: {len(subtask_rows)}")
