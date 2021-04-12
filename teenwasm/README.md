# Teen WASM

Teen WASM

This is a JS engine pwn challenge.

V8 version: 9.2.0 (candidate)

V8 commit: a958fd7852f973b78f33a69e75fbccf0b45361d6

glibc version: 2.31

OS: Ubuntu 20.04.2 - 64 bit

Provided challenge files: V8 debug and release builds, diff and patch files, challenge setup files, libc.so.6

The server will be running the release build.

Note: My intended solution is not only about 90% reliable so if you are sure it has worked locally, in debug or release, but cannot get it to work remotely, please try to run your exploit many more times. Please talk to me if you think there is an issue.

Give us a link to your exploit and we will run it like `./d8 <file.js>`

Note: If you execute `/bin/sh` the runner will try to print flag for you. If you go any other ways and it works locally but not remotely, please talk to me.

If you have a working exploit locally for teenwasm but it does not work remotely when you give the URL, and if you host it from your own server, your server might have blocked our server from downloading it, most likely due to user-agent string. So please find somewhere public like pastebin and post it there unlisted to try again. Thank you!

`nc challenges1.ritsec.club 1338`

Download Link: https://drive.google.com/file/d/1zL3-iREPlUQyM8SUW8CCqxQxBTsIvW6H/view?usp=sharing

Author: @fpasswd on Discord, @flyingpassword on Twitter

## Solution

- The idea is adding a shrink functionality to WASM memory, which is not obviously available.
- The shrink function does not shrink by pages like the grow function. Instead, it shrink by bytes, so the result may not be aligned and causes all sorts of trouble. But most importantly, it changes where the underlying backing store is allocated.
- Some checks is disabled to allow bugs to happen.
- The shrink function has this bug
    - If it is not a shared ArrayBuffer then it will be Reallocated(realloc, or malloc+free). This behavior needs to be investigated.
    - The old BackingStore is not detached and thus an ArrayBuffer not associated with a WASM Memory is still usable after shrink. This is UAF.
- Exploit
    - Infoleak: leak heap address by shrinking until the backing store is allocated on the actually glibc heap. Here you can have several options to leak, but I choose to pick big alloc size to leak main_arena. Leak this way may not be consistent and you gotta account for that in your exploit.
    - Assume had info leak, now what? We need to get control over glibc heap. The disassociated backing store can be freed by trigger garbage collection. We still want the ArrayBuffer to be usable (not detached), but need the backing_store to be freed. After freed, you can put it on tcache bins to carry out tcache poison attack.
    - Poison sequence: alloc wasm memory, shink to 100 bytes, shrink again to put the previous pointer on tcache bin 0x70, use it to overwrite the next_ptr.
