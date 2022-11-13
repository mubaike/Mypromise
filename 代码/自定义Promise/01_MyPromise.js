/**
 * 定义类的思路
 *      1.先把功能分析清楚了，再动手
 *      2.写一点想一点，走一步看一步
 */

//创建一个变量来记录Promise的状态
const PROMISE_STATE = {
    PENDING: 0,
    FULFILLED: 1,
    REJECTED: 2
} //pending fulfilled rejected


class MyPromise {
    //创建一个变量来存储Promise的结果
    #result

    //创建一个变量来记录Promise的状态
    #state = PROMISE_STATE.PENDING

    //创建一个变量来存储回调函数
    //由于回调函数可能有多个，所以使用数组赋值
    #callbacks = []

    constructor(executor) {
        //接收一个 执行器 作为参数
        executor(this.#resolve.bind(this), this.#reject.bind(this)) //调用回调函数
    }

    //私有的resolve() 用来存储成功的数据
    #resolve(value) {
        // 禁止值被重复修改
        // 如果state不等于pending，说明值已经被修改 函数直接放回
        if (this.#state !== PROMISE_STATE.PENDING) return;

        this.#result = value;
        this.#state = PROMISE_STATE.FULFILLED;  //数据填充成功

        //当resolve执行时，说明数据已经进来了，需要调用then的回调函数
        //放入微任务队列内执行，而不是直接执行
        queueMicrotask(() => {
            //调用callbacks中的所有函数
            this.#callbacks.forEach(cb => {
                cb()
            })
        })
    }

    //私有的reject() 用来存储拒绝的数据
    #reject(reason) { }

    //添加一个用来读取数据的then方法
    then(onFulfilled, onRejected) {
        /**
         * then中回调函数的放回值，会成为新的Promise中的数据
         */

        //放回Promise类型数据
        return new MyPromise((resolve, reject) => {
            if (this.#state === PROMISE_STATE.PENDING) {
                //进入判断说明数据还没有进入Promise，将回调函数设置为callback的值
                // this.#callback.push = onFulfilled;
                this.#callbacks.push(() => {
                    resolve(onFulfilled(this.#result))
                })
            } else if (this.#state === PROMISE_STATE.FULFILLED) {
                //then的回调函数，应该放入到微任务队列中执行，而不是直接调用
                queueMicrotask(() => {
                    resolve(onFulfilled(this.#result))
                })
            }
        })
    }
}

const mp = new MyPromise((resolve, reject) => {
    resolve("xxs")
})

mp.then((result) => {
    console.log("读取数据1", result);
    return "sd"
}).then(r => {
    console.log(r);
    return 'sss'
}).then(r => {
    console.log(r);
})