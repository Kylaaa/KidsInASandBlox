import subprocess
command = "dir"
subprocess.run(["cmd.exe", "/c", "start", f"{command}"], timeout=15)