// 数组解构
let [a, b, c] = [1, 2, 3]
console.log(a, b, c)
let [x = 1] = [undefined]
console.log(x)
let [y = 1] = [null]
console.log(y)
// 对象解构
let {foo, bar} = {foo: 'aaa', bar: 'bbb'}
console.log(foo, bar)
let {first: f, last: l} = {first: 'hello', last: 'world'}
console.log(f, l)
// 字符串解构
let [a1, a2, a3, a4] = 'hello'
let {length: len} = 'hello'

function example() {
    return [1, 2]
}

let jsonData = {id: 42, status: "OK", data: [867, 5309]};
let {id, status, data: number} = jsonData;
console.log(number)

console.log('hello'.charCodeAt(0))
console.log('hello'.codePointAt(0))
console.log('hello'.charAt(0))

console.log('666'.padStart(10, '0'))
console.log('666'.padEnd(10, '0'))

// 数组相关
console.log(...[1, 2, 3])

function f1(x, y, z) {
    return x + y + z
}

console.log(f1(...[1, 2, 3]))

let m = Math.max(...[1, 2, 3]);
console.log(m)

let arr1 = [0, 1, 2]
let arr2 = [3, 4, 5]
arr1.push(...arr2)
console.log(arr1)

let aa = [1, 2]
// es6复制数组
let bb = [...aa]
bb[0] = 2
console.log(aa[0], bb[0])
// es5复制数组
bb = a1.concat()
// es6合并数组
let arr3 = [1, 2, ...arr2]
// es5合并数组
let arr4 = [1, 2].concat(arr2)
// 解构赋值
let [first, ...rest] = [1, 2, 3, 4]

let strings = Array.from({'0': 'a', '1': 'b', '2': 'c', length: 3});
console.log(strings)

console.log(Array.of(1, 2, 3))

console.log([1, '2', true])

let fill = new Array(4).fill(6);
console.log(fill)

let n = [1, 4, -5, 10].find(n => n < 0)
console.log(n)
n = [1, 4, 15, 20].findIndex((value, index, obj) => value > 9)
console.log(n)

console.log([1, 2, 3].includes(2))


// promise
new Promise((resolve, reject) => {
    if (Object.is(1, 1))
        resolve('executed')
    else
        reject('error')
}).then(result => {
    console.log(result)
    return 'executed2'
}).then(result => {
    throw new Error('出错了');
    // then 方法指定的回调函数，如果运行中 抛出错误，也会被 catch 方法捕获
    console.log(result)
}).catch(error => {
    console.log(error)
}).finally(() => {
    console.log('finished')
})

let promise1 = new Promise((resolve, reject) => {
    setTimeout(() => {
        console.log('promise1-executing')
        resolve('promise1-finish')
    }, 1000)
}).then(result => {
    return result
}).catch(error => error)

let promise2 = new Promise((resolve, reject) => {
    setTimeout(() => {
        console.log('promise2-executing')
        resolve('promise2-finish')
    }, 2000)
}).then(result => {
    throw  new Error('出错了')
    return result
}).catch(error => error)

Promise.all([promise1, promise2]).then(result => {
    console.log(result)
}).catch(error => {
    console.log(error)
})

// Promise.race([promise1, promise2]).then(result => {
//     console.log(result)
// }).catch(error => {
//     console.log(error)
// })


// async
function doSomething1(ms) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve('test async')
        }, ms)
    })
}

function doSomething2(ms) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // resolve('test async')
            reject('some error happened')
        }, ms)
    })
}

async function asyncPrint() {
    let response1 = ''
    try {
        response1 = await doSomething1(1000)
    } catch (error) {
        console.log(error)
    }

    let response2 = ''
    try {
        response2 = await doSomething2(2000)
    } catch (error) {
        console.log(error)
    }

    // throw  new Error('出错了')
    return [response1, response2]
}

async function asyncPrint2() {
    // 可以在doSomething里边使用.catch接收异常
    let [response1, response2] = await Promise.all([doSomething1(), doSomething2()])
    return [response1, response2]
}

async function asyncPrint3() {
    let response1 = doSomething1(1000)
    try {
        response1 = await response1
    } catch (error) {
        console.log(error)
    }

    let response2 = doSomething2(2000)
    try {
        // 也可以在doSomething里边使用.catch接收异常`
        response2 = await response2.catch(e => e)
    } catch (error) {
        console.log(error)
    }
    return [response1, response2]
}

// async 函数返回的 Promise 对象,必须等到内部所有 await 命令后面 的 Promise 对象执行完，才会发生状态改变，除非遇到 return 语句或 者抛出错误
// async 函数内部 return 语句返回的值，会成为 then 方法回调函数的参数
// async 函数内部抛出错误，会导致返回的 Promise 对象变为 reject 状态。抛出的错误对象会被 catch 方法回调函数接收到
// 正常情况下， await 命令后面是一个 Promise 对象。如果不是，会被转成一个立即 resolve 的 Promise 对象
// await 命令后面的 Promise 对象如果变为 reject 状态， 如果没有使用 try-catch 捕获，则 reject 的参数会被 catch 方法的回调函数接收到
// 默认只要一个 await 语句后面的 Promise 变为 reject ，那么整 个 async 函数都会中断执行，
// 有时，我们希望即使前一个异步操作失败，也不要中断后面的异步操 作。这时可以将第一个 await 放在 try...catch 结构里面，这样不管 这个异步操作是否成功，第二个 await 都会执行
// 另一种方法是 await 后面的 Promise 对象再跟一个 catch 方法，处理 前面可能出现的错误
asyncPrint().then(result => {
    console.log(result)
}).catch(error => {
    console.log(error)
})