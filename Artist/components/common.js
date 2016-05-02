/*global exports*/
'use strict';
(function (factory) {
    // 各种模块加载方式的处理
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof define === 'function' && define.cmd) {
        define(function (require, exports, module) {
            module.exports = factory(jQuery);
        });
    } else if (typeof exports === 'object') {
        exports.async = factory();
    } else {
        // window.async=factory();
    }
}(function () {
    // 下面这俩函数是有用的
    function async(generator) {
        // 主Promise
        return new Promise(function (resolve, reject) {
            var g = generator();
            /**
             *  该函数会在异步过程执行完毕后被调用,会唤醒主函数继续执行到下一个yield或return为止。
             *  参数val为异步过程的结果，即promise.result。
             *  返回值为主函数内yield或return的结果，
             *  如果是yield则必须为promise或可被autoPack包装的对象，或者包含前两者的数组
             */
            function next(val) {
            
                // 将上次运行结果返回给主函数，令主函数继续执行到下一处中断，并将结果存入result
                var result = g.next(val);
                // 暂存主函数运行结果
                var promise = result.value;
                // 判断主函数是否执行完毕，执行完毕则调用resolve完成主Promise,否则继续执行
                if (!result.done) {
                    // 判断主函数提供的参数是否为数组，
                    // 如果不是数组则用autoPack封装后通过then(next)绑定下一步流程。并通过catch(reject)抛出异常
                    // 如果是数组则对每个成员进行封装后用Promise.All打包，然后继续执行。
                    if (promise instanceof Array) {
                        Promise.all(promise.map(autoPack)).then(next).catch(reject);
                    } else {
                        autoPack(promise).then(next).catch(reject);
                    }
                } else {
                    resolve(promise);
                }
            }

            // 捕获并通过reject抛出异常
            try {
                next();
            } catch (e) {
                reject(e);
            }
        })
    }

    // 自动打包，可以将第三方实现的Promise工具打包为ES6标准的Promise
    // 目前仅支持jQuery.Promise
    function autoPack(target) {
        // 包装$.ajax
        if (target.error) {
            return new Promise(function (resolve, reject) {
                target.done(resolve).error(reject);
            })
        } else {
            return target;
        }
    }

    return async;
}));