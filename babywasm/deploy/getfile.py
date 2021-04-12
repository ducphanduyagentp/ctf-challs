import subprocess
import sys
import urllib.request
import tempfile
import pexpect


url = input("Enter the URL to your exploit (only http/https is allowed): ")
if not url.startswith("http://") and not url.startswith("https://"):
    print("URL needs to be in http or https")
    exit(-1)

D8_PATH = "./v8.release/d8"
_, EXP_PATH = tempfile.mkstemp(suffix=".js")


urllib.request.urlretrieve(url, EXP_PATH)

# proc = subprocess.Popen([D8_PATH, "--shell", EXP_PATH], stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
# stddata = proc.communicate(b"cat flag.txt")

# print(stddata)

p = pexpect.spawnu(D8_PATH, args=[EXP_PATH])
index = p.expect([pexpect.EOF, "\$\s$"])
print(p.before)

if index == 0:
    print("Process is dead.")
elif index == 1:
    print("\nShell may be running. Trying to cat flag...")
    p.setecho(False)
    p.sendline("cat flag.txt")
    p.sendeof()
    lines = p.readlines()
    print(''.join(lines))
    p.terminate()
else:
    print("not sure what's here")
    print(p.before)