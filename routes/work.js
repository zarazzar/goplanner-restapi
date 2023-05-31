const express = require('express')
const router = express.Router()
const Work = require('../models/Work')

function result(succ,msg,details){
    if(details){
        return{
            success: succ,
            message: msg,
            data: details
        }
    }else{
        return{
            success: succ,
            message: msg
        }
    }
}


router.get('/',async(req,res)=>{
    try {
        const work = await Work.aggregate([
            {
                $lookup: {
                    from: 'user',
                    localField: 'user_id',
                    foreignField: '_id',
                    as: 'userData'
                }
            },
            {
                $set : {
                    id: '$_id',
                    username: {$arrayElemAt: ['$userData.username',0] },
                    created_date: {$dateToString: {format: '%d-%m-%Y %H:%M:%S',date: '$created_date', timezone: '+07:00'}},
                    modified_date: {$dateToString: {format: '%d-%m-%Y %H:%M:%S',date: '$modified_date', timezone: '+07:00'}}
                }
            },
            {
                $project : {
                    userData: 0,
                    _id: 0
                }
            }
        ]);

        if(work.length > 0 ){
            res.status(200).json(result(1,'Retreive Data Success!', work))
        }else{
            res.status(200).json(result(0,'Tidak ada data!'))
        }
    }catch (error){
        res.status(500).json(result(0,error.message))
    }
})

router.post('/',async (req,res)=>{
    const inputWork = new Work({
        content: req.body.content,
        user_id: req.body.user_id
    })

    try{
        const work = await inputWork.save()
        res.status(200).json(result(1,'Insert WorkPlan Success!'))
    }catch(error){
           res.status(500).json(result(0, error.message))
        }
})

router.put('/',async(req,res)=>{
    const data = {
        id: req.body.id,
        content : req.body.content,
        modified_date: Date.now()
    }
    try{
        const work = await Work.updateOne({
            _id: data.id
        },data)
        if(work.matchedCount>0){
            res.status(200).json(result(1,'Update WorkPlan Success!'))
        }else{
            res.status(200).json(result(0,'Update WorkPlan Failed!'))
        }
    }catch(error){
        res.status(500).json(result(0, error.message))
    }
})

router.delete('/:id',async(req,res)=>{
    try{
        const work = await Work.deleteOne({
            _id: req.params.id
        })

        if(work.deletedCount>0){
            res.status(200).json(result(1,'Delete WorkPlan Success!'))
        }else{
            res.status(200).json(result(0,'Delete WorkPlan Failed!'))
        }
    }catch(error){
        res.status(500).json(result(0, error.message))
    }
})

module.exports = router