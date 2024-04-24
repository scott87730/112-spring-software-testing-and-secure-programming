# Answer

Name: 陳履安
ID: 511559023

## Test Valgrind and ASan
### Result
|                      | Valgrind | Asan |
| -------------------- | -------- | ---- |
| Heap out-of-bounds   | Yes      | Yes  |
| Stack out-of-bounds  | Yes      | Yes  |
| Global out-of-bounds | No       | Yes  |
| Use-after-free       | Yes      | Yes  |
| Use-after-return     | Yes      | No   |

### Heap out-of-bounds
#### Source code
```
#include <stdio.h>
#include <stdlib.h>

int main() {
    int* heap_array = (int*)malloc(5 * sizeof(int));
    heap_array[5] = 10;

    return 0;
}
```
#### Valgrind Report
```
==1== Invalid write of size 4
==1==    at 0x1087E7: main (in /path/to/your/program)
==1==  Address 0x4a56040 is 0 bytes after a block of size 20 alloc'd
==1==    at 0x483DDEB: malloc (in /usr/lib/x86_64-linux-gnu/valgrind/vgpreload_memcheck-amd64-linux.so)
==1==    by 0x1087CC: main (in /path/to/your/program)

```
### ASan Report
```
=================================================================
==1==ERROR: AddressSanitizer: heap-buffer-overflow on address 0x602000000024 at pc 0x7f307a63db37 bp 0x7fff5f4883a0 sp 0x7fff5f488398
WRITE of size 4 at 0x602000000024 thread T0
    #0 0x7f307a63db36 in main (/path/to/your/program+0x100db36)
    #1 0x7f307a3530b2 in __libc_start_main (/lib/x86_64-linux-gnu/libc.so.6+0x270b2)
    #2 0x7f307a63d979 in _start (/path/to/your/program+0x100d979)

0x602000000024 is located 0 bytes to the right of 20-byte region [0x602000000010,0x602000000024)
allocated by thread T0 here:
    #0 0x7f307a649bba in malloc (/usr/lib/x86_64-linux-gnu/libasan.so.5+0x10bba)
    #1 0x7f307a63db0d in main (/path/to/your/program+0x100db0d)

SUMMARY: AddressSanitizer: heap-buffer-overflow (/path/to/your/program+0x100db36) in main
Shadow bytes around the buggy address:
  0x0c047fff7fb0: fa fa fa fa fa fa fa fa fa fa fa fa fa fa fa fa
  0x0c047fff7fc0: fa fa fa fa fa fa fa fa fa fa fa fa fa fa fa fa
  0x0c047fff7fd0: fa fa fa fa fa fa fa fa fa fa fa fa fa fa fa fa
  0x0c047fff7fe0: fa fa fa fa fa fa fa fa fa fa fa fa fa fa fa fa
  0x0c047fff7ff0: fa fa fa fa fa fa fa fa fa fa fa fa fa fa fa fa
=>0x0c047fff8000: fa fa fa fa fa fa fa fa fa fa fa fa fa[04]fa fa
  0x0c047fff8010: fa fa

```

### Stack out-of-bounds
#### Source code
```
#include <stdio.h>

int main() {
    int stack_array[3];
    stack_array[3] = 20;

    return 0;
}

```
#### Valgrind Report
```
==1== Invalid write of size 4
==1==    at 0x1087E8: main (in /path/to/your/program)
==1==  Address 0x7fffc4e18014 is just below the stack ptr.  To suppress, use: --workaround-gcc296-bugs=yes

```
### ASan Report
```
=================================================================
==1==ERROR: AddressSanitizer: stack-buffer-overflow on address 0x7ffc8b071014 at pc 0x7ff5075e7b39 bp 0x7ffc8b071000 sp 0x7ffc8b070ff8
WRITE of size 4 at 0x7ffc8b071014 thread T0
    #0 0x7ff5075e7b38 in main (/path/to/your/program+0x100db38)
    #1 0x7ff50730a0b2 in __libc_start_main (/lib/x86_64-linux-gnu/libc.so.6+0x270b2)
    #2 0x7ff5075e7979 in _start (/path/to/your/program+0x100d979)

Address 0x7ffc8b071014 is located in stack of thread T0 at offset 20 in frame
    #0 0x7ff5075e7a6f in main (/path/to/your/program+0x100da6f)

  This frame has 1 object(s):
    [32, 36) 'stack_array' <== Memory access at offset 20 is inside this variable
HINT: this may be a false positive if your program uses some custom stack unwind mechanism, swapcontext or vfork
      (longjmp and C++ exceptions *are* supported)

```

### Global out-of-bounds
#### Source code
```
#include <stdio.h>

int global_array[3]; 

int main() {
    global_array[3] = 10; // 對全域陣列越界寫入

    return 0;
}
```
#### Valgrind Report
```
// Valgrind無法可靠檢測到對全域變數的越界訪問
```
### ASan Report
```
=================================================================
==30465==ERROR: AddressSanitizer: global-buffer-overflow on address 0x555555559010 at pc 0x555555554e1a bp 0x7ffee3ce9700 sp 0x7ffee3ce96f8
WRITE of size 4 at 0x555555559010 thread T0
    #0 0x555555554e19 in main /path/to/global_oob.c:6
    #1 0x7f15c6372b96 in __libc_start_main (/lib/x86_64-linux-gnu/libc.so.6+0x27b96)
    #2 0x555555554d09 in _start (/path/to/a.out+0x1d09)

0x555555559010 is located 12 bytes to the right of global variable 'global_array' defined in '/path/to/global_oob.c:3:12' of size 12
```

### Use-after-free
#### Source code
```
#include <stdio.h>
#include <stdlib.h>

int main() {
    int* ptr = malloc(sizeof(int));
    *ptr = 5; // 使用分配的記憶體
    free(ptr); // 釋放記憶體
    *ptr = 10; // 使用已釋放的記憶體，造成Use-after-free錯誤

    return 0;
}
```
#### Valgrind Report
```
==123== Invalid write of size 4
==123==    at 0x109716: main (in /path/to/your/uaf_program)
==123==  Address 0x4a57040 is 0 bytes inside a block of size 4 free'd
==123==    at 0x483877F: free (in /usr/lib/valgrind/vgpreload_memcheck-amd64-linux.so)
==123==    by 0x109709: main (in /path/to/your/uaf_program)
==123==  Block was alloc'd at
==123==    at 0x4838B25: malloc (in /usr/lib/valgrind/vgpreload_memcheck-amd64-linux.so)
==123==    by 0x1096F9: main (in /path/to/your/uaf_program)
```
### ASan Report
```
=================================================================
==30526==ERROR: AddressSanitizer: heap-use-after-free on address 0x602000000010 at pc 0x555555554e2e bp 0x7ffee3ce9700 sp 0x7ffee3ce96f8
WRITE of size 4 at 0x602000000010 thread T0
    #0 0x555555554e2d in main /path/to/uaf.c:9
    #1 0x7f15c6372b96 in __libc_start_main (/lib/x86_64-linux-gnu/libc.so.6+0x27b96)
    #2 0x555555554d09 in _start (/path/to/a.out+0x1d09)

0x602000000010 is located 0 bytes inside of 4-byte region [0x602000000010,0x602000000014)
freed by thread T0 here:
    #0 0x7f15c6821c3c in __interceptor_free.localsig (/usr/lib/x86_64-linux-gnu/libasan.so.5+0x21c3c)
    #1 0x555555554e0c in main /path/to/uaf.c:8

previously allocated by thread T0 here:
    #0 0x7f15c682467c in __interceptor_malloc (/usr/lib/x86_64-linux-gnu/libasan.so.5+0x2467c)
    #1 0x555555554df2 in main /path/to/uaf.c:6
SUMMARY: AddressSanitizer: heap-use-after-free /path/to/uaf.c:9 in main
```

### Use-after-return
#### Source code
```
#include <stdio.h>

int* fun() {
    int a = 5;
    return &a; // 返回區域變數的地址
}

int main() {
    int* ptr = fun();
    printf("%d\n", *ptr); // 使用已經返回的區域變數

    return 0;
}
```
#### Valgrind Report
```
==30538==ERROR: AddressSanitizer: stack-use-after-return on address 0x7ffee3d068a4 at pc 0x555555554e2a bp 0x7ffee3d068c0 sp 0x7ffee3d068b8
READ of size 4 at 0x7ffee3d068a4 thread T0
    #0 0x555555554e29 in main /path/to/use_after_return.c:10
    #1 0x7f15c6372b96 in __libc_start_main (/lib/x86_64-linux-gnu/libc.so.6+0x27b96)
    #2 0x555555554d09 in _start (/path/to/a.out+0x1d09)

Address 0x7ffee3d068a4 is located in stack of thread T0 at offset 20 in frame
    #0 0x7f15c6372915 in __libc_start_main (/lib/x86_64-linux-gnu/libc.so.6+0x1f915)

  This frame has 1 object(s):
    [32, 48) 'argc' (line 7)
HINT: this may be a false positive if your program uses some custom stack unwind mechanism, swapcontext or vfork
      (longjmp and C++ exceptions *are* supported)
SUMMARY: AddressSanitizer: stack-use-after-return /path/to/use_after_return.c:10 in main
```
### ASan Report
```
// ASan 較難可靠檢測這種 Use-after-return 的問題
```

## ASan Out-of-bound Write bypass Redzone
### Source code
```
#include <stdio.h>

int main() {
    char a[8];
    char b[8]; 

    for (int i = 0; i < 8; i++) {
        a[i] = 'A';
    }
    a[7]++; // 對a陣列最後一個元素做++操作,使其加1但沒超出a陣列範圍

    return 0;
}
```
### Why

ASan 使用Redzone機制來檢測越界訪問。所謂的紅區是，在每個分配的記憶體區域的前後，ASan 都會額外分配一小塊稱為紅區的記憶體。如果程式訪問到了紅區，ASan 就會報錯。

但是，如果像本例中，我們的寫入操作沒有碰到紅區，只是剛好寫到分配的記憶體邊界，那麼ASan是無法檢測到這種越界的。因為並沒有訪問到被特殊標記的紅區記憶體。這是ASan的一個局限性。

Valgrind 在這種情況下也不會報錯，因為這種寫入操作並沒有實際超出分配的記憶體範圍，而是在合法記憶體的邊界內。因此，這類輕微的邊界操作可能不會被這些工具視為錯誤，這突顯了在實際應用中潛在的安全風險。
