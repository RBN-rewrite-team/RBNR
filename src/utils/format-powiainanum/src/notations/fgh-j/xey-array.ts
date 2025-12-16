/* eslint-disable @typescript-eslint/no-explicit-any */
function arr01Sort(arr01: any) {
    arr01.sort(function (a: any, b: any) {
        return (function (a, b) {
            if (typeof a == 'number') {
                return
            } else if (a[3] > b[3]) {
                return -1
            } else if (a[3] < b[3]) {
                return 1
            } else if (a[2] == 'x' && b[2] != 'x') {
                return -1
            } else if (a[2] != 'x' && b[2] == 'x') {
                return 1
            } else if (a[2] == 'x' && b[2] == 'x') {
                return -1
            } else if (a[2] > b[2]) {
                return -1
            } else if (a[2] < b[2]) {
                return 1
            } else if (a[0] == 'x' && b[0] != 'x') {
                return -1
            } else if (a[0] != 'x' && b[0] == 'x') {
                return 1
            } else if (a[0] == 'x' && b[0] == 'x') {
                return -1
            } else if (a[0] > b[0]) {
                return -1
            } else if (a[0] < b[0]) {
                return 1
            } else if (a[1] > b[1]) {
                return -1
            } else if (a[1] < b[1]) {
                return 1
            }

            return -1
        })(a, b)
    })
}
function arr01Merge(arr01: any) {
    let elemOffset = 0 // a unnegative number
    for (let i = 0; i < arr01.length - 2; ++i) {
        if (
            arr01[i][0] == arr01[i + 1][0] &&
            arr01[i][2] == arr01[i + 1][2] &&
            arr01[i][3] == arr01[i + 1][3]
        ) {
            // same arr01's merge
            arr01[i][1] += arr01[i + 1][1]
            arr01.splice(i + 1, 1)
            --i
            elemOffset++
        }
    }
    return elemOffset
}
export function myPolarize(
    arr01: any,
    hasOperationRepeat = true,
    toArrowVared = false,
    parseToArrowNum = -1,
) {
    if (arr01.length == 1) {
        if (arr01[0] >= 1e10) {
            return { arrows: 1, repeation: 2, bottom: Math.log10(Math.log10(arr01[0])) }
        } else if (arr01[0] >= 10) {
            return { arrows: 1, repeation: 1, bottom: Math.log10(arr01[0]) }
        } else return { arrows: 1, repeation: 0, bottom: arr01[0] }
    }
    hasOperationRepeat = toArrowVared ? false : hasOperationRepeat
    arr01Sort(arr01)
    arr01Merge(arr01)
    let ptr = arr01.length - 2
    const b = () => arr01[arr01.length - 1]
    const c = (x: any) => {
        arr01[arr01.length - 1] = x
    }
    let repeatResult = 1000001
    while (--repeatResult >= 0) {
        if (b() >= 10) {
            const a = Math.log10(b())
            arr01.push([1, 1, 1, 1])
            ptr++
            arr01Sort(arr01)

            const offset = arr01Merge(arr01)
            ptr -= offset
            c(a)
        } else {
            if (
                !toArrowVared &&
                ptr == 0 &&
                typeof arr01[ptr + 1] == 'number' &&
                (hasOperationRepeat || (!hasOperationRepeat && arr01[ptr][1] == 1)) &&
                arr01[ptr][0] >= parseToArrowNum
            )
                break // arr01 [[],number]
            if (
                toArrowVared &&
                ptr == 0 &&
                typeof arr01[ptr + 1] == 'number' &&
                arr01[ptr][0] == 'x'
            )
                break
            if (
                (toArrowVared && ptr == 0 && arr01[ptr][1] == 1) ||
                (ptr != 0 &&
                    typeof arr01[ptr + 1] == 'number' &&
                    typeof arr01[ptr][0] == 'number' &&
                    arr01[ptr][1] == 1 &&
                    (arr01[ptr - 1][0] == 'x' ||
                        arr01[ptr - 1][2] > arr01[ptr][2] ||
                        arr01[ptr - 1][3] > arr01[ptr][3]) &&
                    arr01[ptr][0] > 2 &&
                    (ptr != 0 || arr01[ptr - 1][0] == 'x'))
            ) {
                /*convert [x,1,1,1] sth to ["x", 1, 1, 1] x+f(base)*/ const arrow_count =
                    arr01[ptr][0]
                const base = b()
                //x|10 = arrow-1+(log_5 base)/2
                let Jx
                if (arrow_count == 3) Jx = base
                else {
                    Jx = arrow_count - 1 + Math.log(base / 2) / Math.log(5)
                }
                arr01[ptr][0] = 'x'

                c(Jx)
                arr01Sort(arr01)
                const offset = arr01Merge(arr01)
                ptr -= offset
            }
            if (typeof arr01[ptr + 1] == 'number' && arr01[ptr][0] == 'x' && b() < 10 && ptr != 0) {
                // conver ["x", sth, j, k] sth2 to [1, 1, j+1, k]
                const base = b()
                const JRepeation = arr01[ptr][1]
                const Kx = JRepeation + Math.log10(base)
                arr01[ptr][1] = 1
                arr01[ptr][0] = 1
                arr01[ptr][2]++
                c(Kx)

                arr01Sort(arr01)
                const offset = arr01Merge(arr01)
                ptr -= offset
            }
            if (
                ((ptr == 0 && !hasOperationRepeat && arr01[ptr][1] != 1) || ptr != 0) &&
                arr01[ptr][0] != 'x' &&
                b() < 10
            ) {
                // const goal = ptr == 0 ? arr01[ptr][0] + 1 : arr01[ptr - 1][1]
                // AAAA..{x}..AAA b
                // can be x+log10 b to
                // B(x+log10 b)
                if (
                    b() == 1 &&
                    ptr > 0 &&
                    arr01[ptr - 1][0] > arr01[ptr][0] &&
                    arr01[ptr][1] == 1
                ) {
                    arr01[ptr][0] = arr01[ptr - 1][0]
                } else {
                    const right = arr01[ptr][1] + Math.log10(b())
                    arr01[ptr][0]++
                    arr01[ptr][1] = 1
                    c(right)
                }

                arr01Sort(arr01)
                const offset = arr01Merge(arr01)
                ptr -= offset
            }
        }
    }
    if (repeatResult <= 0) {
        console.warn('warning: ' + JSON.stringify(arr01) + 'seems took long time to parsing.')
    }
    return {
        bottom: b(),
        repeation: arr01[ptr][1],
        arrows: arr01[ptr][0],
        layer1: arr01[ptr][2],
        layer2: arr01[ptr][3],
        arr01: arr01,
    }
}
