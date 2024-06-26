# Answer

Name: [黃崇銘]
ID: [512558012]

## Test Valgrind and ASan
| Vulnerability       | Result (Valgrind) | Result (ASan) |
|---------------------|-------------------|---------------|
| Heap out-of-bounds  | Detected          | Detected      |
| Stack out-of-bounds | Detected          | Detected      |
| Global out-of-bounds| Detected          | Detected      |
| Use-after-free      | Detected          | Detected      |
| Use-after-return    | Detected          | Detected      |

### Heap out-of-bounds
**Source code**:
```c
#include <stdlib.h>

void heap_out_of_bounds() {
    int *arr = malloc(10 * sizeof(int));
    arr[10] = 0; // 越界寫
    free(arr);
}

#### Source code
```
void stack_out_of_bounds() {
    int arr[10];
    arr[10] = 0; // 越界寫
}
```
#### Valgrind Report
```

```
### ASan Report
```

```

### Stack out-of-bounds
#### Source code
```
int global_arr[10];

void global_out_of_bounds() {
    global_arr[10] = 0; // 越界寫
}

```
#### Valgrind Report
```

```
### ASan Report
```

```

### Global out-of-bounds
#### Source code
```
#include <stdlib.h>

void use_after_free() {
    int *arr = malloc(10 * sizeof(int));
    free(arr);
    arr[0] = 0; // 使用已釋放內存
}

```
#### Valgrind Report
```

```
### ASan Report
```

```

### Use-after-free
#### Source code
```
int *ptr;

void use_after_return_helper() {
    int local_arr[10];
    ptr = &local_arr[0];
}

void use_after_return() {
    use_after_return_helper();
    ptr[0] = 0; // 使用返回後的局部變量
}

```
#### Valgrind Report
```

```
### ASan Report
```

```

### Use-after-return
#### Source code
```
void bypass_redzone() {
    int arr1[8];
    int arr2[8];
    *((volatile int *)(&arr1[8])) = 0; // 繞過紅區寫
}


```
#### Valgrind Report
```

```
### ASan Report
```

```

## ASan Out-of-bound Write bypass Redzone
### Source code
```

```
### Why

void bypass_redzone() {
    int arr1[8];
    int arr2[8];
    *((volatile int *)(&arr1[8])) = 0; // 繞過紅區寫
}
