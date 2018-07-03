const File = require('../../File/file')

const repository = () => {
    const inicial = () => {
        return new Promise((resolve, reject) => {
            File.find({}, (err, res) => {
                if (err) {
                    reject({ result: 'error', msg: err })
                }

                resolve({ result: 'success', msg: 'Files Found!', files: res })
            })
        })
    }

    const fileCreate = (body, req) => new Promise((resolve, reject) => {
        let f = new File({
            text: body.text,
            columns: body.columns,
            calleds: body.calleds,
            user: req.session.user_id
        })
        f.save((err) => {
            if (err) {
                reject({ result: 'error', error: { msg: err.errmsg || err.message, code: err.code } })
            }

            resolve({ result: 'success', msg: 'File create success!', file: f })
        })
    })

    const fileInsertCalled = (body, req) => new Promise((resolve, reject) => {
        const file_id = body.file.id
        const called = body.calleds
        File.update({ _id: file_id }, { $push: { calleds: called } }, (err, raw) => {
            if (!file_id) {
                return reject({ result: 'error', error: { msg: 'File id is required!' } })
            }
            if (!called) {
                return reject({ result: 'error', error: { msg: 'File id is required!' } })
            }
            if (Array.isArray(called)) {
                called.forEach((value) => {
                    if (!Number.isInteger(value.called)) {
                        return reject({ result: 'error', error: { msg: 'Called is not Number!' } })
                    }
                })
            }
            if (err) {
                return reject({ result: 'error', error: { msg: err } })
            }
            return resolve({ result: 'success', called: raw })
        })
    })

    const fileRemoveCalled = (body) => new Promise((resolve,reject)=>{
        const file_id = body.file.id
        const called_id = body.called.id

        File.findByIdAndUpdate({id:file_id},{$pop:{'called._id':called_id}},(err,res)=>{
            if(err)
            {
                return reject({ result: 'error', error: err})
            }
            
            return resolve({ result: 'success', file: res})
        })

    })

    const fileCount = () => new Promise((resolve, reject) => {
        File.count({}, (err, count) => {
            if (count) {

                resolve({ result: 'success', msg: 'files found!', Count: count })
            }
            reject({ result: 'error', error: { msg: err } })
        });
    })

    return Object.create({
        inicial,
        fileCreate,
        fileCount,
        fileInsertCalled
    })
}

module.exports = Object.assign({ repository })