const File = require('../../File/file')

const repository = ()=>{
    const inicial = () =>{
        return new Promise((resolve,reject)=>{
            File.find({},(err,res)=>{
                if(err)
                {
                    reject({result:'error',msg:err})
                }

                resolve({result:'success',msg:'Files Found!',files:res})
            })
        })
    }

    const fileCreate = (body,req)=> new Promise((resolve,reject)=>{
        let f = new File({
            text:body.text,
            columns: body.columns,
            calleds:body.calleds,
            user: req.session.user_id
        })
        f.save((err)=>{
            if(err)
            {
                reject({result:'error',error:{msg:err.errmsg||err.message, code:err.code}})
            }

            resolve({result:'success',msg:'File create success!',file:f})
        })
    })

    const fileInsertCalled = (body,req)=> new Promise((resolve,reject)=>{
        File.update({_id:body},{$push:{calleds:body.called}},(err,raw)=>{
            if(err)
            {
                return reject({result:'error',error:{msg:err}})
            }
        })
    })
    
    const fileCount = ()=> new Promise((resolve,reject)=>{
        File.count({},(err,count)=>{
            if(count)
            {

                resolve({result:'success',msg:'files found!',Count: count})
            }
            reject({result:'error',error:{msg:err}})
        });
    })

    return Object.create({
        inicial,
        fileCreate,
        fileCount
    })
}

module.exports = Object.assign({repository})