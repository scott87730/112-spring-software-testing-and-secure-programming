import angr
import claripy

def main():
    # 加載 login 可執行文件
    project = angr.Project('login', auto_load_libs=False)

    # 設定輸入長度和創建符號變量
    input_size = 16  # 密碼長度
    flag_chars = [claripy.BVS(f'flag_{i}', 8) for i in range(input_size)]
    flag = claripy.Concat(*flag_chars + [claripy.BVV(b'\n')])  # 添加換行符

    # 創建初始狀態
    initial_state = project.factory.full_init_state(
        args=['./login'],
        stdin=flag
    )

    # 添加約束條件：所有字符都是可打印的
    for k in flag_chars:
        initial_state.solver.add(k >= 0x20)
        initial_state.solver.add(k <= 0x7e)

    # 創建仿真管理器
    simulation = project.factory.simgr(initial_state)

    # 定義目標地址
    def is_successful(state):
        return b'Login successful' in state.posix.dumps(1)

    def should_abort(state):
        return b'Login failed' in state.posix.dumps(1)

    # 開始仿真
    simulation.explore(find=is_successful, avoid=should_abort)

    if simulation.found:
        solution_state = simulation.found[0]
        solution = solution_state.solver.eval(flag, cast_to=bytes).strip(b'\n')
        print(f'Found solution: {solution}')
    else:
        print('No solution found')

if __name__ == '__main__':
    main()
