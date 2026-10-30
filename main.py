import csv
import random

with open("./test-data/users.csv", newline="", encoding="utf-8-sig") as f:
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

# For simplicity all users will start with tasks and subtasks
task_names = ["Buy groceries", "Clean the room", "Workout"]
subtask_names = [
    ["Buy milk", "Buy bread"],
    ["Pick up clothes", "Wipe the desk"],
    ["Do curls", "Do squats"]
]
task_rows = []
subtask_rows = []
task_id = 1
subtask_id = 1

# Looping through each user
for i, user in enumerate(users):
    username = user[username_col]

    # Each user gets one or two tasks
    number_of_tasks = random.randint(1, 2)
    user_task_ids = []
    already_done = []

    # Randomly generate what tasks to do
    for x in range(number_of_tasks):
        rand_index = random.randint(0, 2)
        while rand_index in already_done:
            rand_index = random.randint(0, 2)
        already_done.append(rand_index)
        task_rows.append({
            "username": username,
            "id": task_id,
            "task": task_names[rand_index],
            "completed": 0
        })
        user_task_ids.append((task_id, rand_index))

        if random.randint(0, 1) == 1:
            for title in subtask_names[rand_index]:
                subtask_rows.append({
                    "todo_id": task_id,
                    "id": subtask_id,
                    "task": title,
                    "completed": 0
                })
                subtask_id += 1

        task_id += 1
                
def write_csv(filename, rows, columns):
    with open(filename, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=columns)
        writer.writeheader()
        writer.writerows(rows)

write_csv(
    "./test-data/tasks.csv",
    task_rows,
    ["username", "id", "task", "completed"],
)
write_csv(
    "./test-data/subtasks.csv",
    subtask_rows,
    ["todo_id", "id", "task", "completed"],
)

print("Task/subtask data generated successfully")