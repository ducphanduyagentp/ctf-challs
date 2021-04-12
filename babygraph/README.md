# Baby Graph

This is what happens to your baby when you want a pwner and a graph theorist. Do your part!!!

nc challenges1.ritsec.club 1339

Author: @fpasswd on Discord, @flyingpassword on Twitter

## Solution

- You are supposed to solve a nice graph theory problem before you can reach the vuln code, which is just gonna fgets buffer overflow
- The source code is provided and the problem solving is also implemented in there so you can just replicate in your exploit. Also, the number of questions is small so you can try to bruteforce.
- The system is ubuntu 20.04 so ROP has some issue like 16-byte alignment. I did not know about this and learned it during the end of the CTF, but it should not affect solution, which can be one_gadget.